import { pickBestVoice, scoreVoice, chunkForSpeech } from './browserVoice';

let pass = 0, fail = 0;
const check = (label: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `\n        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`}`);
  ok ? pass++ : fail++;
};

// Real iPadOS list. "Eloquence"/"Compact" are the robotic ones a child must not get.
const ios = [
  { name: 'Albert', lang: 'en-US', localService: true },
  { name: 'Fred', lang: 'en-US', localService: true, default: true },
  { name: 'Eloquence Reed', lang: 'en-US', localService: true },
  { name: 'Samantha', lang: 'en-US', localService: true },
  { name: 'Daniel (Enhanced)', lang: 'en-GB', localService: true },
];
check('iPadOS picks the enhanced voice, not default Fred', pickBestVoice(ios)?.name, 'Daniel (Enhanced)');

// Real Android Chrome list - network neural voices.
const android = [
  { name: 'Google español', lang: 'es-ES', localService: false },
  { name: 'Google US English', lang: 'en-US', localService: false },
  { name: 'English United States', lang: 'en-US', localService: true, default: true },
];
check('Android picks the Google network voice', pickBestVoice(android)?.name, 'Google US English');

// Windows/Edge.
const edge = [
  { name: 'Microsoft David - English (United States)', lang: 'en-US', localService: true, default: true },
  { name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US', localService: false },
];
check('Edge picks the Natural online voice', pickBestVoice(edge)?.name, 'Microsoft Aria Online (Natural) - English (United States)');

// A novelty voice must never win, even as the only English option.
check('novelty-only list returns null', pickBestVoice([{ name: 'Zarvox', lang: 'en-US', localService: true }]), null);
check('Zarvox scores below zero', scoreVoice({ name: 'Zarvox', lang: 'en-US' }) < 0, true);
check('non-English disqualified', scoreVoice({ name: 'Google español', lang: 'es-ES' }) < 0, true);
check('empty list returns null', pickBestVoice([]), null);
// A plain English voice with no quality marker is still usable.
check('plain English voice is acceptable', pickBestVoice([{ name: 'English United States', lang: 'en-US' }])?.name, 'English United States');

// Chunking: must not exceed the limit and must not break mid-word.
const page = 'The cat sat on the mat. The dog ran to the log! Did the pig dig? '.repeat(6);
const chunks = chunkForSpeech(page);
check('every chunk within the limit', chunks.every(c => c.length <= 180), true);
check('no chunk is empty', chunks.every(c => c.trim().length > 0), true);
check('chunking loses no words', chunks.join(' ').split(/\s+/).length, page.trim().split(/\s+/).length);
check('short text stays one chunk', chunkForSpeech('Well done!').length, 1);
check('empty text yields nothing', chunkForSpeech('   '), []);
// A single unbroken sentence longer than the limit must still split on words.
const runOn = 'and then ' .repeat(60);
check('run-on sentence splits on words', chunkForSpeech(runOn).every(c => c.length <= 180 && !c.startsWith('n ')), true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
