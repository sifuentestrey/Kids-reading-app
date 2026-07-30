// Sound and Speech Synthesis Service using Gemini Studio AI TTS & ElevenLabs with Web Audio API fallback

import { chunkForSpeech, pickBestVoice } from './browserVoice';

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
  /** Cached voice list; `getVoices()` is async, so this is resolved once. */
  private voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;
  /** The deliberately chosen voice, so the ranking runs once rather than per line. */
  private chosenVoice: SpeechSynthesisVoice | null = null;
  private speechPrimed = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      this.apiKey = localStorage.getItem('elevenlabs_api_key') || '';
      this.voiceId = localStorage.getItem('tts_voice_id') || 'Kore';
      this.provider = (localStorage.getItem('tts_provider') as 'gemini' | 'elevenlabs') || 'gemini';
      this.serverTtsEnabled = localStorage.getItem('tts_enabled') !== 'false';

      // Start the voice list loading immediately, and prime on the first tap so
      // iOS has granted speech before the first line the child is meant to hear.
      void this.loadVoices();
      window.addEventListener('pointerdown', this.primeSpeech, { once: true });
      window.addEventListener('keydown', this.primeSpeech, { once: true });
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

  /**
   * Resolve the platform's voice list.
   *
   * `getVoices()` is asynchronous on every major browser: the first call returns
   * an empty array and the list arrives later. The previous implementation read
   * it synchronously, so on the lines that matter most — the welcome, the first
   * lesson prompt — it found nothing, set no voice, and the platform fell back
   * to its default, which on iOS and Android is one of the old robotic ones.
   * That was the whole reason the app sounded broken.
   *
   * Safari fires `voiceschanged` unreliably, so this polls as well, and gives up
   * after a few seconds rather than leaving a child waiting in silence.
   */
  private loadVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.voicesReady) return this.voicesReady;

    this.voicesReady = new Promise((resolve) => {
      const synth = this.synth;
      if (!synth) return resolve([]);

      const immediate = synth.getVoices();
      if (immediate.length) return resolve(immediate);

      let settled = false;
      const finish = (list: SpeechSynthesisVoice[]) => {
        if (settled) return;
        settled = true;
        clearInterval(poll);
        clearTimeout(bail);
        resolve(list);
      };
      const check = () => {
        const list = synth.getVoices();
        if (list.length) finish(list);
      };

      synth.addEventListener?.('voiceschanged', check);
      const poll = setInterval(check, 150);
      const bail = setTimeout(() => finish(synth.getVoices()), 3000);
    });

    return this.voicesReady;
  }

  /**
   * Let the platform hand out its voices before the first real line.
   *
   * iOS only permits speech that originates in a user gesture, and it will not
   * populate the voice list until speech has been attempted once. Speaking a
   * single space on the first tap satisfies both without the child hearing
   * anything, so every line after it can be spoken freely and with the chosen
   * voice already resolved.
   */
  private primeSpeech = () => {
    if (this.speechPrimed || !this.synth) return;
    this.speechPrimed = true;
    try {
      const warmup = new SpeechSynthesisUtterance(' ');
      warmup.volume = 0;
      this.synth.speak(warmup);
    } catch {
      // Priming is an optimisation; failing it must not break speech.
    }
    void this.loadVoices();
  };

  private async speakBrowser(
    text: string,
    options?: { pitch?: number; rate?: number; onEnd?: () => void }
  ) {
    if (!this.synth) {
      options?.onEnd?.();
      return;
    }

    const voices = await this.loadVoices();
    const synth = this.synth;
    if (!synth) {
      options?.onEnd?.();
      return;
    }

    if (!this.chosenVoice || !voices.includes(this.chosenVoice)) {
      this.chosenVoice = pickBestVoice(voices);
      if (this.chosenVoice) {
        console.info(`Speech voice: ${this.chosenVoice.name} (${this.chosenVoice.lang})`);
      }
    }

    synth.cancel();

    // Chrome drops an utterance queued in the same task as cancel(), so the
    // speak calls are deferred by a tick. Without this the first line after any
    // interruption is silently lost.
    await new Promise((r) => setTimeout(r, 30));

    // Long text is split so Chrome's ~15s per-utterance cut-off cannot truncate
    // a page mid-sentence.
    const chunks = chunkForSpeech(text);
    if (!chunks.length) {
      options?.onEnd?.();
      return;
    }

    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.pitch = options?.pitch ?? 1.1;
      utterance.rate = options?.rate ?? 0.85;
      // Set explicitly: some browsers pick a voice from `lang` when none is set,
      // and an unset lang can resolve to the device locale rather than English.
      utterance.lang = this.chosenVoice?.lang ?? 'en-US';
      if (this.chosenVoice) utterance.voice = this.chosenVoice;

      if (i === chunks.length - 1 && options?.onEnd) {
        utterance.onend = () => options.onEnd!();
        utterance.onerror = () => options.onEnd!();
      }

      synth.speak(utterance);
    });
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
