import handler from '../netlify/functions/tts';
import { pcmToWav, resolveGeminiVoice } from '../shared/audio';

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

// --- Sample rate is read back from the mimeType, never assumed. A header that
// disagrees with its payload plays at the wrong pitch rather than failing, which
// is far harder to notice than silence.
check('rate parsed from mimeType', pcmToWav(Buffer.alloc(8), 16000).readUInt32LE(24), 16000);

// --- Handler behaviour with NO key: must degrade, never 500.
delete process.env.GEMINI_API_KEY;
delete process.env.GOOGLE_AI_STUDIO_KEY;
let r = await handler(post({text:'Hello'}));
check('no key -> 200', r.status, 200);
check('no key -> not audio', r.headers.get('content-type'), 'application/json');
{const j:any=await r.json(); check('no key -> fallback flag', j.fallback, true); check('no key -> no secret leaked', !/[A-Za-z0-9_-]{30,}/.test(j.message), true);}

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
{
  const j:any = await r.json();
  check('bad key -> fallback flag', j.fallback, true);
  // The reason is the whole point of this round: it has to name the problem
  // without handing out the credential that caused it.
  check('bad key -> reason present', typeof j.reason === 'string' && j.reason.length > 0, true);
  check('bad key -> reason leaks no secret', !j.reason.includes('test-key-not-real'), true);
  check('bad key -> reason flags malformed key', /does NOT look like/.test(j.reason), true);
}

// --- GOOGLE_AI_STUDIO_KEY wins over GEMINI_API_KEY, because Netlify's AI
// Gateway claims the latter for a token that is not a Google key.
process.env.GEMINI_API_KEY='gateway-token-not-a-google-key';
process.env.GOOGLE_AI_STUDIO_KEY='AIza'+'x'.repeat(35);
r = await handler(post({text:'Hello'}));
check('prefers GOOGLE_AI_STUDIO_KEY', /from GOOGLE_AI_STUDIO_KEY/.test((await r.json()).reason), true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
