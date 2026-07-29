import { Lesson } from '../types';

export const CURRICULUM_LESSONS: Lesson[] = [
  // ==========================================
  // MAP LEVEL 1: THE MAGICAL ZOO (Emergent Pre-K / Alivia & Ava)
  // ==========================================
  {
    id: 1,
    title: 'Super Sound /s/',
    targetSound: 'S',
    targetLetter: 'S',
    mapLevel: 1,
    mapName: 'The Magical Zoo',
    step1: {
      mascotName: 'Sammy Snake',
      mascotEmoji: '🐍',
      vocalMouth: 'wide',
      instructionText: 'Put your teeth together and blow air gently: sssss!',
      phonicAudioText: 'Say /s/! Letter S makes the /s/ sound like in Sun!',
      exampleWords: [
        { word: 'Sun', icon: '☀️' },
        { word: 'Star', icon: '⭐' },
        { word: 'Soup', icon: '🍲' },
      ],
    },
    step2: {
      instruction: 'Tap all picture items that start with the /s/ sound!',
      targetSound: 'S',
      items: [
        { id: '1', word: 'Sun', icon: '☀️', startsWithTarget: true },
        { id: '2', word: 'Dog', icon: '🐶', startsWithTarget: false },
        { id: '3', word: 'Star', icon: '⭐', startsWithTarget: true },
        { id: '4', word: 'Soup', icon: '🍲', startsWithTarget: true },
        { id: '5', word: 'Cat', icon: '🐱', startsWithTarget: false },
      ],
    },
    step3: {
      letterToTrace: 'S',
      caseType: 'uppercase',
      guideLines: [
        { x: 70, y: 30 },
        { x: 30, y: 40 },
        { x: 70, y: 70 },
        { x: 30, y: 80 },
      ],
      matchingPairs: [
        { letter: 'S', word: 'Sun', icon: '☀️' },
        { letter: 's', word: 'Star', icon: '⭐' },
      ],
    },
    step4: {
      targetWords: [
        {
          word: 'SUN',
          icon: '☀️',
          missingLetter: 'S',
          scrambledLetters: ['S', 'U', 'N'],
        },
      ],
    },
    step5: {
      bookTitle: 'Sammy the Sun Snake',
      coverEmoji: '☀️',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '🐍',
          sentence: 'Sammy is a Snake.',
          highlightWords: ['Sammy', 'Snake'],
          audioText: 'Sammy is a Snake.',
        },
        {
          pageNumber: 2,
          imageEmoji: '☀️',
          sentence: 'Sammy sees the Sun.',
          highlightWords: ['Sammy', 'Sun'],
          audioText: 'Sammy sees the Sun.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'What sound does Letter S make?',
          options: [
            { id: 'a', text: '/s/ as in Sun', icon: '☀️', isCorrect: true },
            { id: 'b', text: '/b/ as in Bear', icon: '🐻', isCorrect: false },
          ],
        },
      ],
    },
  },

  {
    id: 2,
    title: 'Awesome Sound /a/',
    targetSound: 'A',
    targetLetter: 'A',
    mapLevel: 1,
    mapName: 'The Magical Zoo',
    step1: {
      mascotName: 'Annie Alligator',
      mascotEmoji: '🐊',
      vocalMouth: 'open',
      instructionText: 'Open your mouth wide like taking a bite of an apple: ah, ah, ah!',
      phonicAudioText: 'Say /a/! Letter A makes the short /a/ sound like in Apple!',
      exampleWords: [
        { word: 'Apple', icon: '🍎' },
        { word: 'Ant', icon: '🐜' },
        { word: 'Astronaut', icon: '👨‍🚀' },
      ],
    },
    step2: {
      instruction: 'Tap items that start with short /a/!',
      targetSound: 'A',
      items: [
        { id: '1', word: 'Apple', icon: '🍎', startsWithTarget: true },
        { id: '2', word: 'Ball', icon: '⚽', startsWithTarget: false },
        { id: '3', word: 'Ant', icon: '🐜', startsWithTarget: true },
        { id: '4', word: 'Axe', icon: '🪓', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'A',
      caseType: 'uppercase',
      guideLines: [
        { x: 50, y: 20 },
        { x: 20, y: 80 },
        { x: 80, y: 80 },
      ],
      matchingPairs: [
        { letter: 'A', word: 'Apple', icon: '🍎' },
        { letter: 'a', word: 'Ant', icon: '🐜' },
      ],
    },
    step4: {
      targetWords: [
        {
          word: 'ANT',
          icon: '🐜',
          missingLetter: 'A',
          scrambledLetters: ['A', 'N', 'T'],
        },
      ],
    },
    step5: {
      bookTitle: 'Annie Ant Eats An Apple',
      coverEmoji: '🍎',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '🐜',
          sentence: 'Annie is an Ant.',
          highlightWords: ['Annie', 'Ant'],
          audioText: 'Annie is an Ant.',
        },
        {
          pageNumber: 2,
          imageEmoji: '🍎',
          sentence: 'Annie eats a big red Apple.',
          highlightWords: ['Apple'],
          audioText: 'Annie eats a big red Apple.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'What did Annie Ant eat?',
          options: [
            { id: 'a', text: 'An Apple', icon: '🍎', isCorrect: true },
            { id: 'b', text: 'A Banana', icon: '🍌', isCorrect: false },
          ],
        },
      ],
    },
  },

  {
    id: 3,
    title: 'Terrific Sound /t/',
    targetSound: 'T',
    targetLetter: 'T',
    mapLevel: 1,
    mapName: 'The Magical Zoo',
    step1: {
      mascotName: 'Timmy Tiger',
      mascotEmoji: '🐯',
      vocalMouth: 'wide',
      instructionText: 'Tap your tongue against the roof of your mouth: t, t, t!',
      phonicAudioText: 'Say /t/! Letter T makes the crisp /t/ sound like in Tiger!',
      exampleWords: [
        { word: 'Tiger', icon: '🐯' },
        { word: 'Turtle', icon: '🐢' },
        { word: 'Train', icon: '🚂' },
      ],
    },
    step2: {
      instruction: 'Find picture items starting with /t/!',
      targetSound: 'T',
      items: [
        { id: '1', word: 'Tiger', icon: '🐯', startsWithTarget: true },
        { id: '2', word: 'Fish', icon: '🐟', startsWithTarget: false },
        { id: '3', word: 'Turtle', icon: '🐢', startsWithTarget: true },
        { id: '4', word: 'Train', icon: '🚂', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'T',
      caseType: 'uppercase',
      guideLines: [
        { x: 20, y: 20 },
        { x: 80, y: 20 },
        { x: 50, y: 20 },
        { x: 50, y: 80 },
      ],
      matchingPairs: [{ letter: 'T', word: 'Tiger', icon: '🐯' }],
    },
    step4: {
      targetWords: [
        {
          word: 'SAT',
          icon: '🧘',
          missingLetter: 'T',
          scrambledLetters: ['S', 'A', 'T'],
        },
      ],
    },
    step5: {
      bookTitle: 'Timmy Tiger Rides the Train',
      coverEmoji: '🚂',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '🐯',
          sentence: 'Timmy the Tiger sat.',
          highlightWords: ['Timmy', 'sat'],
          audioText: 'Timmy the Tiger sat.',
        },
        {
          pageNumber: 2,
          imageEmoji: '🚂',
          sentence: 'Timmy rides the Train.',
          highlightWords: ['Train'],
          audioText: 'Timmy rides the Train.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'Who sat on the train?',
          options: [
            { id: 'a', text: 'Timmy Tiger', icon: '🐯', isCorrect: true },
            { id: 'b', text: 'Sammy Snake', icon: '🐍', isCorrect: false },
          ],
        },
      ],
    },
  },

  {
    id: 4,
    title: 'Playful Sound /p/',
    targetSound: 'P',
    targetLetter: 'P',
    mapLevel: 1,
    mapName: 'The Magical Zoo',
    step1: {
      mascotName: 'Penny Penguin',
      mascotEmoji: '🐧',
      vocalMouth: 'round',
      instructionText: 'Press your lips together and pop air out: p, p, pop!',
      phonicAudioText: 'Say /p/! Letter P makes the quick /p/ sound like in Penguin!',
      exampleWords: [
        { word: 'Penguin', icon: '🐧' },
        { word: 'Pizza', icon: '🍕' },
        { word: 'Panda', icon: '🐼' },
      ],
    },
    step2: {
      instruction: 'Find items starting with the /p/ sound!',
      targetSound: 'P',
      items: [
        { id: '1', word: 'Pizza', icon: '🍕', startsWithTarget: true },
        { id: '2', word: 'Sun', icon: '☀️', startsWithTarget: false },
        { id: '3', word: 'Penguin', icon: '🐧', startsWithTarget: true },
        { id: '4', word: 'Popcorn', icon: '🍿', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'P',
      caseType: 'uppercase',
      guideLines: [
        { x: 30, y: 20 },
        { x: 30, y: 80 },
        { x: 70, y: 40 },
      ],
      matchingPairs: [{ letter: 'P', word: 'Pizza', icon: '🍕' }],
    },
    step4: {
      targetWords: [
        {
          word: 'PAT',
          icon: '🖐️',
          missingLetter: 'P',
          scrambledLetters: ['P', 'A', 'T'],
        },
      ],
    },
    step5: {
      bookTitle: 'Penny Eats Pizza',
      coverEmoji: '🍕',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '🐧',
          sentence: 'Penny the Penguin pat the pig.',
          highlightWords: ['Penny', 'Penguin'],
          audioText: 'Penny the Penguin pat the pig.',
        },
        {
          pageNumber: 2,
          imageEmoji: '🍕',
          sentence: 'Penny had hot Pizza.',
          highlightWords: ['Pizza'],
          audioText: 'Penny had hot Pizza.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'What did Penny eat?',
          options: [
            { id: 'a', text: 'Pizza', icon: '🍕', isCorrect: true },
            { id: 'b', text: 'Soup', icon: '🍲', isCorrect: false },
          ],
        },
      ],
    },
  },

  {
    id: 5,
    title: 'Incredible Sound /i/',
    targetSound: 'I',
    targetLetter: 'I',
    mapLevel: 1,
    mapName: 'The Magical Zoo',
    step1: {
      mascotName: 'Iggy Iguana',
      mascotEmoji: '🦎',
      vocalMouth: 'wide',
      instructionText: 'Wrinkle your nose like an itchy nose: ih, ih, ih!',
      phonicAudioText: 'Say /i/! Letter I makes the short /i/ sound like in Iguana!',
      exampleWords: [
        { word: 'Igloo', icon: '⛺' },
        { word: 'Iguana', icon: '🦎' },
        { word: 'Ink', icon: '🖋️' },
      ],
    },
    step2: {
      instruction: 'Tap items starting with short /i/!',
      targetSound: 'I',
      items: [
        { id: '1', word: 'Igloo', icon: '⛺', startsWithTarget: true },
        { id: '2', word: 'Star', icon: '⭐', startsWithTarget: false },
        { id: '3', word: 'Iguana', icon: '🦎', startsWithTarget: true },
        { id: '4', word: 'Ink', icon: '🖋️', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'I',
      caseType: 'uppercase',
      guideLines: [
        { x: 30, y: 20 },
        { x: 70, y: 20 },
        { x: 50, y: 20 },
        { x: 50, y: 80 },
        { x: 30, y: 80 },
        { x: 70, y: 80 },
      ],
      matchingPairs: [{ letter: 'I', word: 'Igloo', icon: '⛺' }],
    },
    step4: {
      targetWords: [
        {
          word: 'PIT',
          icon: '🕳️',
          missingLetter: 'I',
          scrambledLetters: ['P', 'I', 'T'],
        },
      ],
    },
    step5: {
      bookTitle: 'Iggy in the Igloo',
      coverEmoji: '⛺',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '🦎',
          sentence: 'Iggy is an Iguana.',
          highlightWords: ['Iggy', 'Iguana'],
          audioText: 'Iggy is an Iguana.',
        },
        {
          pageNumber: 2,
          imageEmoji: '⛺',
          sentence: 'Iggy sat in the Igloo.',
          highlightWords: ['Igloo'],
          audioText: 'Iggy sat in the Igloo.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'Where did Iggy sit?',
          options: [
            { id: 'a', text: 'In the Igloo', icon: '⛺', isCorrect: true },
            { id: 'b', text: 'In the Tree', icon: '🌳', isCorrect: false },
          ],
        },
      ],
    },
  },

  // ==========================================
  // MAP LEVEL 2: THE WONDER PLAYGROUND (CVC Blending / Kindergarten / Tru)
  // ==========================================
  {
    id: 6,
    title: 'CVC Blending: CAT & HAT',
    targetSound: 'AT',
    targetLetter: 'C',
    mapLevel: 2,
    mapName: 'The Wonder Playground',
    step1: {
      mascotName: 'Barnaby Bear',
      mascotEmoji: '🐻',
      vocalMouth: 'open',
      instructionText: 'Blend individual phonemes together: /c/ - /a/ - /t/ = CAT!',
      phonicAudioText: 'Let us blend CVC words! /c/ /a/ /t/ makes CAT!',
      exampleWords: [
        { word: 'Cat', icon: '🐱' },
        { word: 'Hat', icon: '🎩' },
        { word: 'Mat', icon: '🧘' },
      ],
    },
    step2: {
      instruction: 'Find items that belong to the -AT word family!',
      targetSound: 'AT',
      items: [
        { id: '1', word: 'Cat', icon: '🐱', startsWithTarget: true },
        { id: '2', word: 'Dog', icon: '🐶', startsWithTarget: false },
        { id: '3', word: 'Hat', icon: '🎩', startsWithTarget: true },
        { id: '4', word: 'Mat', icon: '🧘', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'C',
      caseType: 'uppercase',
      guideLines: [
        { x: 70, y: 30 },
        { x: 30, y: 50 },
        { x: 70, y: 70 },
      ],
      matchingPairs: [{ letter: 'C', word: 'Cat', icon: '🐱' }],
    },
    step4: {
      targetWords: [
        {
          word: 'CAT',
          icon: '🐱',
          missingLetter: 'C',
          scrambledLetters: ['C', 'A', 'T'],
        },
        {
          word: 'HAT',
          icon: '🎩',
          missingLetter: 'H',
          scrambledLetters: ['H', 'A', 'T'],
        },
      ],
    },
    step5: {
      bookTitle: 'The Cat in the Red Hat',
      coverEmoji: '🐱',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '🐱',
          sentence: 'A Cat sat on a mat.',
          highlightWords: ['Cat', 'mat'],
          audioText: 'A Cat sat on a mat.',
        },
        {
          pageNumber: 2,
          imageEmoji: '🎩',
          sentence: 'The Cat had a tall red Hat.',
          highlightWords: ['Cat', 'Hat'],
          audioText: 'The Cat had a tall red Hat.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'What did the Cat wear on its head?',
          options: [
            { id: 'a', text: 'A Red Hat', icon: '🎩', isCorrect: true },
            { id: 'b', text: 'A Crown', icon: '👑', isCorrect: false },
          ],
        },
      ],
    },
  },

  {
    id: 7,
    title: 'CVC Blending: DOG & LOG',
    targetSound: 'OG',
    targetLetter: 'D',
    mapLevel: 2,
    mapName: 'The Wonder Playground',
    step1: {
      mascotName: 'Duke Dog',
      mascotEmoji: '🐶',
      vocalMouth: 'open',
      instructionText: 'Blend sounds together: /d/ - /o/ - /g/ = DOG!',
      phonicAudioText: 'Say /d/! Blend /d/ /o/ /g/ to read DOG!',
      exampleWords: [
        { word: 'Dog', icon: '🐶' },
        { word: 'Log', icon: '🪵' },
        { word: 'Frog', icon: '🐸' },
      ],
    },
    step2: {
      instruction: 'Find items in the -OG word family!',
      targetSound: 'OG',
      items: [
        { id: '1', word: 'Dog', icon: '🐶', startsWithTarget: true },
        { id: '2', word: 'Sun', icon: '☀️', startsWithTarget: false },
        { id: '3', word: 'Log', icon: '🪵', startsWithTarget: true },
        { id: '4', word: 'Frog', icon: '🐸', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'D',
      caseType: 'uppercase',
      guideLines: [
        { x: 30, y: 20 },
        { x: 30, y: 80 },
        { x: 70, y: 50 },
      ],
      matchingPairs: [{ letter: 'D', word: 'Dog', icon: '🐶' }],
    },
    step4: {
      targetWords: [
        {
          word: 'DOG',
          icon: '🐶',
          missingLetter: 'D',
          scrambledLetters: ['D', 'O', 'G'],
        },
      ],
    },
    step5: {
      bookTitle: 'Duke the Dog on a Log',
      coverEmoji: '🐶',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '🐶',
          sentence: 'Duke is a big Dog.',
          highlightWords: ['Duke', 'Dog'],
          audioText: 'Duke is a big Dog.',
        },
        {
          pageNumber: 2,
          imageEmoji: '🪵',
          sentence: 'The Dog sat on a Log.',
          highlightWords: ['Dog', 'Log'],
          audioText: 'The Dog sat on a Log.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'Where did the Dog sit?',
          options: [
            { id: 'a', text: 'On a Log', icon: '🪵', isCorrect: true },
            { id: 'b', text: 'On a Chair', icon: '🪑', isCorrect: false },
          ],
        },
      ],
    },
  },

  {
    id: 8,
    title: 'CVC Blending: SUN & RUN',
    targetSound: 'UN',
    targetLetter: 'U',
    mapLevel: 2,
    mapName: 'The Wonder Playground',
    step1: {
      mascotName: 'Sunny Bunny',
      mascotEmoji: '🐰',
      vocalMouth: 'open',
      instructionText: 'Blend /s/ - /u/ - /n/ to say SUN!',
      phonicAudioText: 'Blend sounds together! /s/ /u/ /n/ makes SUN!',
      exampleWords: [
        { word: 'Sun', icon: '☀️' },
        { word: 'Run', icon: '🏃' },
        { word: 'Bun', icon: '🍔' },
      ],
    },
    step2: {
      instruction: 'Tap items in the -UN word family!',
      targetSound: 'UN',
      items: [
        { id: '1', word: 'Sun', icon: '☀️', startsWithTarget: true },
        { id: '2', word: 'Cat', icon: '🐱', startsWithTarget: false },
        { id: '3', word: 'Run', icon: '🏃', startsWithTarget: true },
        { id: '4', word: 'Bun', icon: '🍔', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'U',
      caseType: 'uppercase',
      guideLines: [
        { x: 30, y: 20 },
        { x: 30, y: 70 },
        { x: 70, y: 70 },
        { x: 70, y: 20 },
      ],
      matchingPairs: [{ letter: 'U', word: 'Sun', icon: '☀️' }],
    },
    step4: {
      targetWords: [
        {
          word: 'SUN',
          icon: '☀️',
          missingLetter: 'U',
          scrambledLetters: ['S', 'U', 'N'],
        },
        {
          word: 'RUN',
          icon: '🏃',
          missingLetter: 'R',
          scrambledLetters: ['R', 'U', 'N'],
        },
      ],
    },
    step5: {
      bookTitle: 'Bunny Runs in the Sun',
      coverEmoji: '🐰',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '☀️',
          sentence: 'The bright Sun is up.',
          highlightWords: ['Sun'],
          audioText: 'The bright Sun is up.',
        },
        {
          pageNumber: 2,
          imageEmoji: '🏃',
          sentence: 'Bunny can Run in the Sun!',
          highlightWords: ['Run', 'Sun'],
          audioText: 'Bunny can Run in the Sun!',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'What can Bunny do?',
          options: [
            { id: 'a', text: 'Run in the Sun', icon: '🏃', isCorrect: true },
            { id: 'b', text: 'Sleep in a box', icon: '📦', isCorrect: false },
          ],
        },
      ],
    },
  },

  // ==========================================
  // MAP LEVEL 3: THE ADVENTURE ISLAND (Advanced Consonant Blends)
  // ==========================================
  {
    id: 11,
    title: 'Consonant Blends: ST- (STAR & STOP)',
    targetSound: 'ST',
    targetLetter: 'ST',
    mapLevel: 3,
    mapName: 'The Adventure Island',
    step1: {
      mascotName: 'Captain Star',
      mascotEmoji: '🏴‍☠️',
      vocalMouth: 'wide',
      instructionText: 'Blend /s/ and /t/ smoothly together: st, st, star!',
      phonicAudioText: 'Consonant blend ST! /s/ + /t/ = /st/ like in Star!',
      exampleWords: [
        { word: 'Star', icon: '⭐' },
        { word: 'Stop', icon: '🛑' },
        { word: 'Storm', icon: '⛈️' },
      ],
    },
    step2: {
      instruction: 'Find items starting with the ST blend sound!',
      targetSound: 'ST',
      items: [
        { id: '1', word: 'Star', icon: '⭐', startsWithTarget: true },
        { id: '2', word: 'Fish', icon: '🐟', startsWithTarget: false },
        { id: '3', word: 'Stop', icon: '🛑', startsWithTarget: true },
        { id: '4', word: 'Storm', icon: '⛈️', startsWithTarget: true },
      ],
    },
    step3: {
      letterToTrace: 'S',
      caseType: 'uppercase',
      guideLines: [
        { x: 70, y: 30 },
        { x: 30, y: 50 },
        { x: 70, y: 70 },
      ],
      matchingPairs: [{ letter: 'ST', word: 'Star', icon: '⭐' }],
    },
    step4: {
      targetWords: [
        {
          word: 'STAR',
          icon: '⭐',
          missingLetter: 'S',
          scrambledLetters: ['S', 'T', 'A', 'R'],
        },
        {
          word: 'STOP',
          icon: '🛑',
          missingLetter: 'T',
          scrambledLetters: ['S', 'T', 'O', 'P'],
        },
      ],
    },
    step5: {
      bookTitle: 'Captain Star on Storm Island',
      coverEmoji: '🏴‍☠️',
      pages: [
        {
          pageNumber: 1,
          imageEmoji: '⭐',
          sentence: 'Captain Star sees a shiny Star.',
          highlightWords: ['Star'],
          audioText: 'Captain Star sees a shiny Star.',
        },
        {
          pageNumber: 2,
          imageEmoji: '🛑',
          sentence: 'The ship must Stop at the island.',
          highlightWords: ['Stop'],
          audioText: 'The ship must Stop at the island.',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'What did Captain Star see in the sky?',
          options: [
            { id: 'a', text: 'A Shiny Star', icon: '⭐', isCorrect: true },
            { id: 'b', text: 'A Big Fish', icon: '🐟', isCorrect: false },
          ],
        },
      ],
    },
  },
];
