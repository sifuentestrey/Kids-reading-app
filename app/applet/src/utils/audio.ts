export function speakText(text: string, rate: number = 0.9, pitch: number = 1.1) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural'))
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function playBeep(freq: number, type: OscillatorType, duration: number) {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('Web Audio error:', err);
  }
}

export function playPopSound() {
  playBeep(440, 'sine', 0.1);
}

export function playSuccessSound() {
  playBeep(587.33, 'triangle', 0.15);
  setTimeout(() => playBeep(880, 'triangle', 0.3), 120);
}

export function playStarSound() {
  playBeep(659.25, 'sine', 0.1);
  setTimeout(() => playBeep(880, 'sine', 0.1), 100);
  setTimeout(() => playBeep(1174.66, 'sine', 0.3), 200);
}

export function playWrongSound() {
  playBeep(220, 'sawtooth', 0.2);
}
