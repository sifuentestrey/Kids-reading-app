import { soundService } from '../services/soundService';

export { soundService };

export const playPhonemeSound = (phoneme: string, word?: string) => {
  soundService.speakPhoneme(phoneme, word);
};

export const playWordSound = (word: string) => {
  soundService.speak(word, { pitch: 1.2, rate: 0.85 });
};

export const playSuccessSound = () => {
  soundService.playSuccessChime();
};

export const playPopSound = () => {
  soundService.playPopSound();
};

export const playBoopSound = () => {
  soundService.playBoopSound();
};
