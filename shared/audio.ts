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
