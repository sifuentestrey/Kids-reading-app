export type LearnerId = 'tru' | 'alivia' | 'ava';

export interface LearnerProfile {
  id: LearnerId;
  name: string;
  age: number;
  track: string;
  avatar: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  currentMapLevel: 1 | 2 | 3;
  completedLessonIds: number[];
  starGems: number;
  unlockedPets: Pet[];
  treehouseItems: TreehouseItem[];
  placedTreehouseItems: string[];
  equippedHat?: string;
  equippedOutfit?: string;
  equippedAccessory?: string;
  masteredPhonics: string[];
  readingAgeEquivalent: string;
  learningMinutes: number;
  playingMinutes: number;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  icon: string;
  description: string;
  hatchingLessonId: number;
}

export interface TreehouseItem {
  id: string;
  name: string;
  category: 'furniture' | 'toy' | 'decor' | 'hat' | 'outfit' | 'accessory' | 'minigame';
  price: number;
  icon: string;
  unlocked: boolean;
  description: string;
  roomSlot?: 'wall' | 'floor' | 'desk' | 'rug' | 'bed' | 'window' | 'toybox';
  soundText?: string;
}

export interface DecodablePage {
  pageNumber: number;
  imageEmoji: string;
  sentence: string;
  highlightWords: string[];
  audioText: string;
}

export interface ComprehensionQuestion {
  id: number;
  prompt: string;
  options: {
    id: string;
    text: string;
    icon: string;
    isCorrect: boolean;
  }[];
}

export interface Lesson {
  id: number;
  title: string;
  targetSound: string;
  targetLetter: string;
  mapLevel: 1 | 2 | 3;
  mapName: string;
  step1: {
    mascotName: string;
    mascotEmoji: string;
    vocalMouth: 'open' | 'wide' | 'round';
    instructionText: string;
    phonicAudioText: string;
    exampleWords: { word: string; icon: string }[];
  };
  step2: {
    instruction: string;
    targetSound: string;
    items: {
      id: string;
      word: string;
      icon: string;
      startsWithTarget: boolean;
    }[];
  };
  step3: {
    letterToTrace: string;
    caseType: 'uppercase' | 'lowercase';
    guideLines: { x: number; y: number }[];
    matchingPairs: { letter: string; word: string; icon: string }[];
  };
  step4: {
    targetWords: {
      word: string;
      icon: string;
      missingLetter: string;
      scrambledLetters: string[];
    }[];
  };
  step5: {
    bookTitle: string;
    coverEmoji: string;
    pages: DecodablePage[];
    questions: ComprehensionQuestion[];
  };
}

export interface WorkSheetData {
  id: string;
  title: string;
  type: 'tracing' | 'coloring' | 'flashcard';
  description: string;
  lettersOrWords: string[];
}
