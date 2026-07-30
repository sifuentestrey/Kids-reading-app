import { GoogleGenAI, Modality } from '@google/genai';
import { NARRATOR_STYLE, pcmToWav, resolveGeminiVoice } from '../../shared/audio';

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
 * It deliberately mirrors `server.ts`'s Gemini branch — same model, same voices,
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
 * Any non-audio reply makes the client fall back to the device voice and — by
 * design in `soundService` — stop asking for the rest of the session. That is
 * correct when there is genuinely no key, and it is why failures here are
 * reported honestly rather than dressed up as success.
 */
const fallback = (message: string, status = 200) =>
  new Response(JSON.stringify({ success: false, fallback: true, message }), {
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

  try {
    const ai = getClient(apiKey);
    const result = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
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
      return fallback('Gemini returned no audio.');
    }

    const wav = pcmToWav(Buffer.from(base64Audio, 'base64'));

    return new Response(new Uint8Array(wav), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        // The same phrases repeat constantly — lesson prompts, the room's lines
        // — so letting the browser reuse them keeps quota and latency down.
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    // Quota exhaustion lands here, which is the likeliest failure in practice.
    // The child keeps reading on the device voice rather than hitting silence.
    console.warn('Gemini TTS failed:', err instanceof Error ? err.message : err);
    return fallback('Gemini TTS unavailable or quota reached.');
  }
}
