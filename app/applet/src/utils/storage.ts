import { ChildProfile } from '../types';

const INITIAL_PROFILES: Record<'tru' | 'alivia' | 'ava', ChildProfile> = {
  tru: {
    id: 'tru',
    name: 'Tru',
    age: 5,
    track: 'kindergarten',
    subtitle: 'CVC Blending & Kindergarten Prep',
    avatar: {
      skinColor: '#f8d7da',
      hairStyle: 'short',
      hairColor: '#4a2c11',
      outfit: 'superhero',
      hat: 'cap',
      glasses: 'none',
    },
    currentMapLevel: 2,
    currentLessonId: 21,
    completedLessons: [],
    lessonStars: {},
    starGems: 45,
    streakDays: 4,
    lastActiveDate: new Date().toISOString(),
    masteredSounds: ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd'],
    masteredWords: ['cat', 'dog', 'sun', 'the', 'see', 'I', 'can'],
    unlockedPets: ['bear_barnaby'],
    treehouseDecor: ['wallpaper_space', 'toy_dino'],
    roomSetup: {
      wallpaper: 'wallpaper_space',
      floor: 'floor_wood',
      furniture: ['toy_dino'],
    },
    placementCompleted: true,
    readingAgeEquivalent: '5 yrs 4 mos',
  },
  alivia: {
    id: 'alivia',
    name: 'Alivia',
    age: 4,
    track: 'pre_k',
    subtitle: 'Emergent Pre-K • Twin Track A',
    avatar: {
      skinColor: '#f8d7da',
      hairStyle: 'pigtails',
      hairColor: '#a52a2a',
      outfit: 'princess',
      hat: 'tiara',
      glasses: 'none',
    },
    currentMapLevel: 1,
    currentLessonId: 1,
    completedLessons: [],
    lessonStars: {},
    starGems: 30,
    streakDays: 3,
    lastActiveDate: new Date().toISOString(),
    masteredSounds: ['s', 'a', 't'],
    masteredWords: ['a', 'I', 'see'],
    unlockedPets: ['kitten_katie'],
    treehouseDecor: ['wallpaper_magic'],
    roomSetup: {
      wallpaper: 'wallpaper_magic',
      floor: 'floor_wood',
      furniture: [],
    },
    placementCompleted: false,
    readingAgeEquivalent: '4 yrs 2 mos',
  },
  ava: {
    id: 'ava',
    name: 'Ava',
    age: 4,
    track: 'pre_k',
    subtitle: 'Emergent Pre-K • Twin Track B',
    avatar: {
      skinColor: '#f8d7da',
      hairStyle: 'buns',
      hairColor: '#d4af37',
      outfit: 'explorer',
      hat: 'bow',
      glasses: 'pink',
    },
    currentMapLevel: 1,
    currentLessonId: 1,
    completedLessons: [],
    lessonStars: {},
    starGems: 30,
    streakDays: 3,
    lastActiveDate: new Date().toISOString(),
    masteredSounds: ['s', 'a', 'm'],
    masteredWords: ['the', 'my'],
    unlockedPets: ['puppy_pip'],
    treehouseDecor: ['wallpaper_jungle'],
    roomSetup: {
      wallpaper: 'wallpaper_jungle',
      floor: 'floor_wood',
      furniture: [],
    },
    placementCompleted: false,
    readingAgeEquivalent: '4 yrs 2 mos',
  },
};

const STORAGE_KEY = 'read_with_me_profiles_v2';

export function loadProfiles(): Record<'tru' | 'alivia' | 'ava', ChildProfile> {
  if (typeof window === 'undefined') return INITIAL_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROFILES;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROFILES, ...parsed };
  } catch (err) {
    console.warn('Failed loading profiles from localStorage:', err);
    return INITIAL_PROFILES;
  }
}

export function saveProfiles(profiles: Record<'tru' | 'alivia' | 'ava', ChildProfile>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.warn('Failed saving profiles to localStorage:', err);
  }
}

export function updateChildProfile(
  childId: 'tru' | 'alivia' | 'ava',
  updater: (prev: ChildProfile) => ChildProfile
): Record<'tru' | 'alivia' | 'ava', ChildProfile> {
  const current = loadProfiles();
  const updatedChild = updater(current[childId]);
  const newProfiles = {
    ...current,
    [childId]: updatedChild,
  };
  saveProfiles(newProfiles);
  return newProfiles;
}
