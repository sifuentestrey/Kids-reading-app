/**
 * Audio helpers shared by the Express server (`server.ts`) and the Netlify
 * function (`netlify/functions/tts.ts`).
 *
 * Both serve the same `/api/tts` contract on different hosts, so the conversion
 * lives here rather than being copied into each. A copy that drifts would
 * produce audio that plays on one deployment and not the other.
 */

/**
 * Wrap raw PCM in a WAV container.
 *
 * Gemini's TTS returns headerless signed 16-bit little-endian PCM. Browsers will
 * not play that directly, so a 44-byte RIFF header describing the format has to
 * be prepended before the bytes mean anything to an `<audio>` element.
 *
 * Defaults match what `gemini-3.1-flash-tts-preview` returns: 24 kHz, mono,
 * 16-bit.
 */
export function pcmToWav(
  pcmBuffer: Buffer,
  sampleRate = 24000,
  numChannels = 1,
  bitsPerSample = 16
): Buffer {
  const header = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  const fileSize = dataSize + 36;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  // RIFF descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(fileSize, 4);
  header.write('WAVE', 8);

  // fmt sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

/**
 * Gemini's TTS models, in preference order.
 *
 * These are preview IDs, and preview IDs are retired without notice — and which
 * of them a given API key is allowed to call depends on the project behind it.
 * A single hardcoded model is therefore a single point of failure for the whole
 * feature, so callers walk this list and take the first that answers.
 *
 * Newest first: 3.1 is the most natural read, and the 2.5 pair are the stable
 * ones that have been generally available the longest.
 */
export const TTS_MODELS = [
  'gemini-3.1-flash-tts-preview',
  'gemini-2.5-flash-preview-tts',
  'gemini-2.5-pro-preview-tts',
] as const;

/** Gemini's prebuilt TTS voices. Anything else is rejected by the API. */
export const GEMINI_VOICES = ['Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'] as const;

/** Default voice: the warmest of the set for reading to a young child. */
export const DEFAULT_GEMINI_VOICE = 'Kore';

/**
 * The style instruction sent with the text. Gemini's TTS takes direction in
 * plain language, and this is what turns a flat read into a storybook one — it
 * is the difference the whole feature exists for, so it is kept identical
 * across both deployments.
 */
export const NARRATOR_STYLE =
  'Say in a warm, gentle, clear, natural, expressive storybook narrator voice for young children:';

/** Pick a valid Gemini voice, falling back to the default. */
export function resolveGeminiVoice(requested?: unknown): string {
  return typeof requested === 'string' &&
    (GEMINI_VOICES as readonly string[]).includes(requested)
    ? requested
    : DEFAULT_GEMINI_VOICE;
}

/**
 * Google's Generative Language REST endpoint, written out in full and on
 * purpose.
 *
 * The `@google/genai` SDK used to make this call, and on Netlify it silently
 * did not reach Google at all: the platform's AI Gateway recognises the SDK and
 * reroutes it through its own model catalogue, which carries no TTS models. The
 * result was `unable to find suitable provider for gemini/...` — an error in a
 * shape Google never emits, for a model ID that is perfectly valid. Addressing
 * the API directly is what makes the destination something this code decides
 * rather than something the host can quietly redecide.
 */
const GEMINI_REST_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/** What the caller needs to know about a failed attempt, minus the credential. */
export class GeminiTtsError extends Error {}

/**
 * Gemini returns `audio/L16;codec=pcm;rate=24000`. The rate is read back rather
 * than assumed, because a WAV header that disagrees with its payload does not
 * fail — it plays, at the wrong pitch and speed, which is a far harder bug to
 * recognise than silence.
 */
function sampleRateFrom(mimeType: string | undefined): number {
  const match = /rate=(\d+)/.exec(mimeType ?? '');
  return match ? Number(match[1]) : 24000;
}

/**
 * Speak `text` with Gemini, returning playable WAV bytes.
 *
 * Throws `GeminiTtsError` with the upstream reason on failure; callers decide
 * whether that means falling back to the device voice.
 */
export async function synthesizeGeminiSpeech(options: {
  apiKey: string;
  text: string;
  model: string;
  voiceName: string;
  signal?: AbortSignal;
}): Promise<Buffer> {
  const { apiKey, text, model, voiceName, signal } = options;

  const response = await fetch(`${GEMINI_REST_BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // The key goes in a header, never the query string. Google's own client
      // puts it in the URL, which is how it ended up quoted back inside error
      // messages that then had to be scrubbed before they could be shown.
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${NARRATOR_STYLE} ${text}` }] }],
      // REST spells this `generationConfig`; the SDK spelled it `config`.
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    }),
    signal,
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new GeminiTtsError(`HTTP ${response.status}: ${raw.slice(0, 200)}`);
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new GeminiTtsError(`non-JSON response: ${raw.slice(0, 120)}`);
  }

  const part = payload?.candidates?.[0]?.content?.parts?.[0];
  const base64Audio = part?.inlineData?.data;
  if (!base64Audio) {
    throw new GeminiTtsError(`no audio in response: ${raw.slice(0, 200)}`);
  }

  return pcmToWav(Buffer.from(base64Audio, 'base64'), sampleRateFrom(part.inlineData?.mimeType));
}
