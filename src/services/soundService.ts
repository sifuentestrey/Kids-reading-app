// Sound and Speech Synthesis Service using Gemini Studio AI TTS & ElevenLabs with Web Audio API fallback

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  provider: 'gemini' | 'elevenlabs';
}

export const REALISTIC_VOICES: VoiceOption[] = [
  { id: 'Kore', name: 'Kore (Gemini Studio)', description: 'Warm, gentle, natural storybook narrator for kids', provider: 'gemini' },
  { id: 'Puck', name: 'Puck (Gemini Studio)', description: 'Upbeat, friendly young reader companion', provider: 'gemini' },
  { id: 'Zephyr', name: 'Zephyr (Gemini Studio)', description: 'Clear, encouraging reading teacher voice', provider: 'gemini' },
  { id: 'Fenrir', name: 'Fenrir (Gemini Studio)', description: 'Rich, friendly male storybook voice', provider: 'gemini' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (ElevenLabs)', description: 'Young, cheerful ElevenLabs kid story voice', provider: 'elevenlabs' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (ElevenLabs)', description: 'Calm, clear ElevenLabs reading voice', provider: 'elevenlabs' },
];

export const ELEVENLABS_VOICES = REALISTIC_VOICES;

class SoundService {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, string>(); // Text -> Blob URL
  private apiKey: string = '';
  private voiceId: string = 'Kore';
  private provider: 'gemini' | 'elevenlabs' = 'gemini';
  private serverTtsEnabled: boolean = true;
  /**
   * Whether a server TTS endpoint appears to exist at all.
   *
   * On a static deployment there is no `/api/tts`, so the request comes back as
   * the SPA's own HTML (or a 404). Without this flag every spoken line would pay
   * for a doomed round-trip before the browser voice started — a delay before
   * every word, in a reading app for pre-readers.
   *
   * Only a well-formed non-audio reply trips it, never a network error: a flaky
   * connection should not cost the studio voice for the rest of the session.
   */
  private serverTtsAvailable: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      this.apiKey = localStorage.getItem('elevenlabs_api_key') || '';
      this.voiceId = localStorage.getItem('tts_voice_id') || 'Kore';
      this.provider = (localStorage.getItem('tts_provider') as 'gemini' | 'elevenlabs') || 'gemini';
      this.serverTtsEnabled = localStorage.getItem('tts_enabled') !== 'false';
    }
  }

  public setApiKey(key: string) {
    this.apiKey = key.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('elevenlabs_api_key', this.apiKey);
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setVoiceId(id: string) {
    this.voiceId = id;
    const found = REALISTIC_VOICES.find((v) => v.id === id);
    if (found) {
      this.provider = found.provider;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('tts_voice_id', id);
      localStorage.setItem('tts_provider', this.provider);
    }
  }

  public getVoiceId(): string {
    return this.voiceId;
  }

  public setElevenLabsEnabled(enabled: boolean) {
    this.serverTtsEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tts_enabled', enabled ? 'true' : 'false');
    }
  }

  public isElevenLabsEnabled(): boolean {
    return this.serverTtsEnabled;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Speak text using Gemini Studio AI / ElevenLabs API, with intelligent Web Audio fallback
  async speak(text: string, options?: { pitch?: number; rate?: number; onEnd?: () => void }) {
    this.stop();

    const cleanText = text.trim();
    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    if (this.serverTtsEnabled && this.serverTtsAvailable) {
      const cacheKey = `${this.provider}:${this.voiceId}:${cleanText}`;
      if (this.audioCache.has(cacheKey)) {
        const cachedUrl = this.audioCache.get(cacheKey)!;
        this.playAudioUrl(cachedUrl, options?.onEnd);
        return;
      }

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey ? { 'x-elevenlabs-key': this.apiKey } : {}),
          },
          body: JSON.stringify({
            text: cleanText,
            voiceId: this.voiceId,
            provider: this.provider,
            apiKey: this.apiKey,
          }),
        });

        const contentType = response.headers.get('content-type') || '';

        if (response.ok && (contentType.includes('audio') || contentType.includes('wav') || contentType.includes('mpeg'))) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          this.audioCache.set(cacheKey, audioUrl);
          this.playAudioUrl(audioUrl, options?.onEnd);
          return;
        }

        // A reply arrived but it is not audio, so nothing is serving TTS here.
        // Stop asking for the rest of the session and use the browser voice.
        this.serverTtsAvailable = false;
        console.info('No server TTS endpoint; using the browser voice from here on.');
      } catch (e) {
        console.warn('Server TTS fetch failed, falling back to Web Speech API', e);
      }
    }

    // Fallback to browser SpeechSynthesis
    this.speakBrowser(cleanText, options);
  }

  private playAudioUrl(url: string, onEnd?: () => void) {
    this.stop();
    const audio = new Audio(url);
    this.currentAudio = audio;

    audio.onended = () => {
      this.currentAudio = null;
      onEnd?.();
    };

    audio.onerror = () => {
      this.currentAudio = null;
      onEnd?.();
    };

    audio.play().catch((err) => {
      console.warn('Audio play autoplay error:', err);
      onEnd?.();
    });
  }

  private speakBrowser(text: string, options?: { pitch?: number; rate?: number; onEnd?: () => void }) {
    if (!this.synth) {
      options?.onEnd?.();
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = options?.pitch ?? 1.1;
    utterance.rate = options?.rate ?? 0.85;

    const voices = this.synth.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Online') ||
            v.name.includes('Neural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Ava'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options?.onEnd) {
      utterance.onend = () => options.onEnd!();
      utterance.onerror = () => options.onEnd!();
    }

    this.synth.speak(utterance);
  }

  // Speak isolated phoneme
  speakPhoneme(phoneme: string, exampleWord?: string) {
    const text = exampleWord
      ? `The sound is ${phoneme}. Like in ${exampleWord}!`
      : `The sound is ${phoneme}.`;
    this.speak(text, { pitch: 1.2, rate: 0.85 });
  }

  // Alias for speakPhoneme
  speakLetterSound(letter: string, exampleWord?: string) {
    this.speakPhoneme(letter, exampleWord);
  }

  // Synthesize pleasant success chime (Star Gem reward sound)
  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.15, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.35);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Synthesize egg hatching fanfare
  playEggHatchFanfare() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const melody = [392, 523.25, 659.25, 783.99, 1046.5, 1318.51];
      melody.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
    } catch {
      // Ignore audio errors
    }
  }

  playPopSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore audio errors
    }
  }

  playBoopSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore audio errors
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const soundService = new SoundService();
