import { GoogleGenAI, Modality } from '@google/genai';
import { NARRATOR_STYLE, TTS_MODELS, pcmToWav, resolveGeminiVoice } from '../../shared/audio';

/**
 * Studio text-to-speech for the static deployment.
 *
 * The app is hosted as static files, which means there is no Express server to
 * hold an API key — and the Web Speech API voices every device ships are audibly
 * synthetic no matter how carefully they are selected. This function is what
 * closes that gap: it serves the same `/api/tts` contract `server.ts` does, so
 * the client needs no changes, while keeping the key server-side where a browser
 * can never read it.
 *
 * It deliberately mirrors `server.ts`'s Gemini branch — same models, same voices,
 * same narrator style instruction — so the voice does not change depending on
 * which way the app happens to be deployed.
 *
 * ElevenLabs is not implemented here. The Express path supports it and can be
 * added if Gemini's voices prove insufficient, but shipping one provider that is
 * verified beats two where the second is guesswork.
 */

/** Reused across warm invocations so each request does not rebuild the client. */
let client: GoogleGenAI | null = null;

function getClient(apiKey: string): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

/**
 * Strip anything that looks like a credential out of an upstream error before it
 * reaches the browser.
 *
 * This matters because Google's client puts the API key in the request URL, and
 * some of its errors quote that URL back. The reason text is genuinely useful for
 * telling "wrong key" apart from "quota gone" apart from "model not enabled" —
 * that distinction is the whole reason this is reported at all — but it is worth
 * nothing if shipping it hands out the key.
 */
function redact(err: unknown, apiKey: string): string {
  const raw = err instanceof Error ? err.message : String(err);
  return raw
    .split(apiKey)
    .join('[key]')
    // Any other long opaque token: query-string values and bearer-ish blobs.
    .replace(/[A-Za-z0-9_-]{25,}/g, '[redacted]')
    .slice(0, 300);
}

/**
 * Any non-audio reply makes the client fall back to the device voice and — by
 * design in `soundService` — stop asking for the rest of the session. That is
 * correct when there is genuinely no key, and it is why failures here are
 * reported honestly rather than dressed up as success.
 */
const fallback = (message: string, status = 200, reason?: string) =>
  new Response(JSON.stringify({ success: false, fallback: true, message, reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return fallback('Use POST.', 405);
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    // Not an error: the site is designed to work without a key, on the device
    // voice. Saying so plainly is what lets the client degrade cleanly.
    //
    // `.trim()` above is deliberate. A key pasted from a terminal can carry a
    // trailing newline, which would otherwise be a non-empty string that fails
    // authentication — a more confusing failure than having no key at all.
    return fallback('No GEMINI_API_KEY configured; using browser speech synthesis.');
  }

  let body: { text?: unknown; voiceId?: unknown };
  try {
    body = await request.json();
  } catch {
    return fallback('Malformed JSON body.', 400);
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return fallback('Missing required field: text.', 400);
  }

  const voiceName = resolveGeminiVoice(body.voiceId);
  const ai = getClient(apiKey);

  // Preview model IDs come and go, and which ones a given key may call depends on
  // the project behind it. Trying the list in order means a retired or ungranted
  // model costs one extra call rather than taking the whole feature down — which
  // is exactly what a hardcoded single model did.
  const failures: string[] = [];

  for (const model of TTS_MODELS) {
    try {
      const result = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `${NARRATOR_STYLE} ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          },
        },
      });

      const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        failures.push(`${model}: no audio in response`);
        continue;
      }

      const wav = pcmToWav(Buffer.from(base64Audio, 'base64'));

      return new Response(new Uint8Array(wav), {
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          // The same phrases repeat constantly — lesson prompts, the room's lines
          // — so letting the browser reuse them keeps quota and latency down.
          'Cache-Control': 'public, max-age=86400',
          // Which model actually answered, for when the voice changes character
          // and nobody can tell why.
          'X-TTS-Model': model,
        },
      });
    } catch (err) {
      failures.push(`${model}: ${redact(err, apiKey)}`);
    }
  }

  // Quota exhaustion and an invalid key both land here, which are the likeliest
  // failures in practice. The child keeps reading on the device voice rather than
  // hitting silence, and the reason says which one it was.
  console.warn('Gemini TTS failed:', failures.join(' | '));
  return fallback('Gemini TTS unavailable; using browser speech synthesis.', 200, failures.join(' | '));
}
