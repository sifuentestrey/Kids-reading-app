export type LearnerTrack = 'kindergarten' | 'pre_k';

export interface AvatarConfig {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  hat: string;
  glasses: string;
}

export interface ChildProfile {
  id: 'tru' | 'alivia' | 'ava';
  name: string;
  age: number;
  track: LearnerTrack;
  subtitle: string;
  avatar: AvatarConfig;
  currentMapLevel: 1 | 2 | 3;
  currentLessonId: number;
  completedLessons: number[];
  lessonStars: Record<number, number>;
  starGems: number;
  streakDays: number;
  lastActiveDate: string;
  masteredSounds: string[];
  masteredWords: string[];
  unlockedPets: string[];
  treehouseDecor: string[];
  roomSetup: {
    wallpaper: string;
    floor: string;
    furniture: string[];
  };
  placementCompleted: boolean;
  readingAgeEquivalent: string;
}

export interface DiscriminationItem {
  id: string;
  name: string;
  soundStartsWith: string;
  icon: string;
  isCorrect: boolean;
}

export interface TracingGuide {
  letter: string;
  isUppercase: boolean;
  dots: { x: number; y: number }[];
}

export interface BookPage {
  text: string;
  highlightedWords: string[];
  imageIcon: string;
  bgGradient: string;
}

export interface QuizOption {
  text: string;
  icon: string;
  isCorrect: boolean;
}

export interface BookQuiz {
  question: string;
  options: QuizOption[];
}

export interface DecodableBook {
  id: string;
  title: string;
  coverIcon: string;
  description: string;
  level: 1 | 2 | 3;
  targetSounds: string[];
  pages: BookPage[];
  quiz: BookQuiz;
}

export interface LessonData {
  id: number;
  levelId: 1 | 2 | 3;
  title: string;
  targetLetterOrSound: string;
  description: string;
  isEggNode: boolean;
  demonstration: {
    targetLetter: string;
    soundPhoneme: string;
    mouthGuide: string;
    audioPrompt: string;
    exampleWords: { word: string; icon: string }[];
  };
  discrimination: {
    prompt: string;
    targetSound: string;
    items: DiscriminationItem[];
  };
  tracing: TracingGuide;
  wordBuilding: {
    targetWord: string;
    imageIcon: string;
    jumbledLetters: string[];
    hintSentence?: string;
  };
  decodableBook: DecodableBook;
}

export interface PetCompanion {
  id: string;
  name: string;
  species: string;
  icon: string;
  description: string;
  personality: string;
  unlockedAtNode: number;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'wallpaper' | 'floor' | 'furniture' | 'outfit' | 'hat' | 'toy';
  cost: number;
  icon: string;
  colorBg: string;
}
