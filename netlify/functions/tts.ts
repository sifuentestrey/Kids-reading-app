import {
  GeminiTtsError,
  TTS_MODELS,
  resolveGeminiVoice,
  synthesizeGeminiSpeech,
} from '../../shared/audio';

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
 * ElevenLabs is not implemented here. The Express path supports it and can be
 * added if Gemini's voices prove insufficient, but shipping one provider that is
 * verified beats two where the second is guesswork.
 */

/**
 * Where the key may come from, in order of preference.
 *
 * `GEMINI_API_KEY` is listed second because Netlify's AI Gateway claims that
 * name: on a site with the gateway active the variable is present and holds a
 * gateway token, not a Google key, so reading it first means a correctly
 * configured site can still end up authenticating against the wrong service.
 * `GOOGLE_AI_STUDIO_KEY` is a name nothing else competes for, which is the whole
 * reason it exists.
 */
const KEY_VARS = ['GOOGLE_AI_STUDIO_KEY', 'GEMINI_API_KEY'] as const;

/**
 * Keys from Google AI Studio are `AIza` followed by 35 characters. Checking the
 * shape lets a misconfiguration be named — a gateway token, a truncated paste —
 * instead of surfacing as a generic 400 from an API that will not say which of
 * those it was.
 */
const looksLikeStudioKey = (key: string) => /^AIza[A-Za-z0-9_-]{35}$/.test(key);

function resolveKey(): { key: string; source: string } | null {
  for (const name of KEY_VARS) {
    // `.trim()` is deliberate. A key pasted from a terminal can carry a trailing
    // newline, which is a non-empty string that fails authentication — a more
    // confusing failure than having no key at all.
    const value = process.env[name]?.trim();
    if (value) return { key: value, source: name };
  }
  return null;
}

/**
 * Strip anything that looks like a credential out of an upstream error before it
 * reaches the browser. The reason text is what tells "wrong key" apart from
 * "quota gone" apart from "model not enabled", and it is worth nothing if
 * shipping it hands out the key.
 */
function redact(err: unknown, apiKey: string): string {
  const raw = err instanceof Error ? err.message : String(err);
  return raw
    .split(apiKey)
    .join('[key]')
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

/**
 * Netlify kills a synchronous function at 10 seconds. Budgeting under that means
 * a slow model yields to the next one and, in the worst case, the client gets a
 * clean fallback it can act on rather than a platform 502 it cannot.
 */
const TOTAL_BUDGET_MS = 8_500;

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return fallback('Use POST.', 405);
  }

  const resolved = resolveKey();
  if (!resolved) {
    // Not an error: the site is designed to work without a key, on the device
    // voice. Saying so plainly is what lets the client degrade cleanly.
    return fallback(
      'No Gemini API key configured; using browser speech synthesis.',
      200,
      `set one of ${KEY_VARS.join(' or ')}`
    );
  }
  const { key, source } = resolved;

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

  // Preview model IDs are retired without notice, and which ones a given key may
  // call depends on the project behind it. Trying the list in order means a
  // retired or ungranted model costs one extra call rather than taking the whole
  // feature down, which is exactly what a hardcoded single model did.
  const failures: string[] = [];
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  for (const model of TTS_MODELS) {
    const remaining = deadline - Date.now();
    if (remaining <= 500) {
      failures.push(`${model}: skipped, out of time`);
      continue;
    }

    try {
      const wav = await synthesizeGeminiSpeech({
        apiKey: key,
        text,
        model,
        voiceName,
        signal: AbortSignal.timeout(remaining),
      });

      return new Response(new Uint8Array(wav), {
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          // The same phrases repeat constantly — lesson prompts, the room's
          // lines — so letting the browser reuse them keeps quota and latency
          // down.
          'Cache-Control': 'public, max-age=86400',
          // Which model actually answered, for when the voice changes character
          // and nobody can tell why.
          'X-TTS-Model': model,
        },
      });
    } catch (err) {
      failures.push(`${model}: ${redact(err, key)}`);
      if (err instanceof GeminiTtsError && /API_KEY_INVALID|HTTP 40[13]/.test(err.message)) {
        // Rejected credentials, not a bad model — note Google answers a bad key
        // with 400, not 401, so the status alone is not enough to recognise it.
        // Trying the other two would fail identically and only burn the budget.
        break;
      }
    }
  }

  // Quota exhaustion and an invalid key both land here, which are the likeliest
  // failures in practice. The child keeps reading on the device voice rather than
  // hitting silence, and the reason says which one it was.
  const keyNote = looksLikeStudioKey(key)
    ? `key from ${source} (well-formed)`
    : `key from ${source} does NOT look like a Google AI Studio key ` +
      `(expected AIza + 35 chars, got ${key.length} chars starting "${key.slice(0, 4)}")`;

  console.warn('Gemini TTS failed:', keyNote, '|', failures.join(' | '));
  return fallback(
    'Gemini TTS unavailable; using browser speech synthesis.',
    200,
    `${keyNote} | ${failures.join(' | ')}`
  );
}
