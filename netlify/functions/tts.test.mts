import handler from '../../netlify/functions/tts';
import { pcmToWav, resolveGeminiVoice } from '../../shared/audio';

let pass=0, fail=0;
const check=(l:string,got:unknown,want:unknown)=>{const ok=JSON.stringify(got)===JSON.stringify(want);
  console.log(`${ok?'PASS':'FAIL'}  ${l}${ok?'':`\n        got ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`}`); ok?pass++:fail++;};

const post=(body:unknown)=>new Request('https://x/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

// --- WAV header correctness: this is what makes the bytes playable at all.
const wav = pcmToWav(Buffer.alloc(2400), 24000, 1, 16);
check('WAV starts with RIFF', wav.subarray(0,4).toString(), 'RIFF');
check('WAV declares WAVE', wav.subarray(8,12).toString(), 'WAVE');
check('WAV header is 44 bytes + payload', wav.length, 44+2400);
check('sample rate 24000 encoded', wav.readUInt32LE(24), 24000);
check('mono', wav.readUInt16LE(22), 1);
check('16-bit', wav.readUInt16LE(34), 16);
check('byte rate correct', wav.readUInt32LE(28), 24000*1*16/8);
check('data size correct', wav.readUInt32LE(40), 2400);

// --- Voice resolution
check('valid voice kept', resolveGeminiVoice('Puck'), 'Puck');
check('invalid voice -> Kore', resolveGeminiVoice('Robot9000'), 'Kore');
check('missing voice -> Kore', resolveGeminiVoice(undefined), 'Kore');
check('injection-ish voice rejected', resolveGeminiVoice('../../etc/passwd'), 'Kore');

// --- Handler behaviour with NO key: must degrade, never 500.
delete process.env.GEMINI_API_KEY;
let r = await handler(post({text:'Hello'}));
check('no key -> 200', r.status, 200);
check('no key -> not audio', r.headers.get('content-type'), 'application/json');
check('no key -> fallback flag', (await r.json()).fallback, true);

// --- Guard rails
r = await handler(new Request('https://x/api/tts',{method:'GET'}));
check('GET rejected', r.status, 405);

process.env.GEMINI_API_KEY='test-key-not-real';
r = await handler(post({}));
check('missing text -> 400', r.status, 400);
r = await handler(post({text:'   '}));
check('blank text -> 400', r.status, 400);
r = await handler(new Request('https://x/api/tts',{method:'POST',body:'{oops'}));
check('malformed JSON -> 400', r.status, 400);

// --- A failing upstream (bogus key) must fall back, not crash.
r = await handler(post({text:'The cat sat on the mat.'}));
check('bad key -> still 200 fallback', r.status, 200);
check('bad key -> json not audio', r.headers.get('content-type'), 'application/json');
check('bad key -> fallback flag', (await r.json()).fallback, true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
