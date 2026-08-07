/**
 * Choosing a browser speech-synthesis voice.
 *
 * Every platform ships a pile of voices of wildly different quality under one
 * API, and the default pick is often the worst of them: the 1980s formant
 * synthesisers (macOS "Fred", iOS "Eloquence", the "Compact" variants) are still
 * present and still selected by default in some browsers. Those are what make an
 * app sound broken. The modern neural voices sitting right next to them in the
 * same list sound fine.
 *
 * So the voice is chosen deliberately rather than left to the platform, and the
 * ranking lives here as a pure function so it can be tested against real voice
 * lists without a browser.
 */

/** The fields of `SpeechSynthesisVoice` the ranking actually reads. */
export interface VoiceLike {
  name: string;
  lang: string;
  localService?: boolean;
  default?: boolean;
}

/**
 * Legacy formant and novelty voices. These are not merely worse — they are
 * unintelligible enough that a child sounding out a word after them would be
 * copying the wrong thing, so they are ranked below every real voice.
 */
const NOVELTY = new RegExp(
  [
    'albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos',
    'deranged', 'good news', 'hysterical', 'jester', 'organ', 'superstar',
    'trinoids', 'whisper', 'wobble', 'zarvox', 'fred', 'junior', 'ralph',
    'kathy', 'princess', 'grandma', 'grandpa', 'rocko', 'shelley', 'sandy',
    'flo', 'eloquence', 'compact',
  ].join('|'),
  'i'
);

/**
 * Voices known to sound good for storytelling to a young child, across the
 * platforms these three are likely to use — iPadOS, Android and desktop Chrome.
 */
const PREFERRED = /samantha|serena|moira|karen|tessa|fiona|allison|ava|siri|google us english|google uk english/i;

/** Marketing words the platforms attach to their neural or cloud voices. */
const HIGH_QUALITY = /natural|neural|premium|enhanced|online|eloquent(?!ce)/i;

/**
 * Score a voice. Higher is better; anything below zero is unusable and should
 * never be selected.
 */
export function scoreVoice(v: VoiceLike): number {
  const name = (v.name || '').toLowerCase();
  const lang = (v.lang || '').toLowerCase();

  // Wrong language is disqualifying: an English sentence read by a Spanish
  // voice is worse than any quality difference among English ones.
  if (!lang.startsWith('en')) return -1;

  let score = 0;

  // A novelty voice is never an acceptable answer, even if it is the only
  // English one, so this outweighs every bonus below.
  if (NOVELTY.test(name)) score -= 500;

  if (HIGH_QUALITY.test(name)) score += 40;
  if (PREFERRED.test(name)) score += 30;

  // Network voices are the neural ones on Android and Chrome. Not decisive on
  // its own, since iOS ships good local voices too.
  if (v.localService === false) score += 15;

  // Prefer the dialects the content is written in.
  if (lang === 'en-us' || lang === 'en-gb') score += 10;
  else if (lang.startsWith('en-')) score += 4;

  // A tiny nudge so the platform default wins a genuine tie.
  if (v.default) score += 1;

  return score;
}

/**
 * Pick the best usable voice, or null if the list has nothing acceptable — in
 * which case the caller should let the platform choose rather than force a
 * novelty voice on a child.
 */
export function pickBestVoice<T extends VoiceLike>(voices: readonly T[]): T | null {
  let best: T | null = null;
  let bestScore = -Infinity;

  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }

  return bestScore >= 0 ? best : null;
}

/**
 * Split text so no single utterance runs long enough to hit the ~15 second
 * cut-off Chrome applies to `speechSynthesis`. A decodable book page is well
 * within range of that, and being cut off mid-sentence reads as the voice
 * breaking rather than as a limit being hit.
 *
 * Splits on sentence boundaries, falling back to clauses and then to words, so a
 * break never lands mid-word.
 */
export function chunkForSpeech(text: string, limit = 180): string[] {
  const clean = text.trim();
  if (clean.length <= limit) return clean ? [clean] : [];

  const sentences = clean.match(/[^.!?]+[.!?]*\s*/g) ?? [clean];
  const out: string[] = [];
  let buf = '';

  const flush = () => {
    if (buf.trim()) out.push(buf.trim());
    buf = '';
  };

  for (const sentence of sentences) {
    if (sentence.length > limit) {
      flush();
      // Too long even as one sentence: break on words.
      let line = '';
      for (const word of sentence.split(/\s+/)) {
        if ((line + ' ' + word).trim().length > limit) {
          if (line.trim()) out.push(line.trim());
          line = word;
        } else {
          line = (line + ' ' + word).trim();
        }
      }
      if (line.trim()) out.push(line.trim());
      continue;
    }

    if ((buf + sentence).length > limit) flush();
    buf += sentence;
  }

  flush();
  return out;
}
