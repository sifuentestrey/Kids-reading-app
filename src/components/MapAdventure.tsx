import React, { useState, useRef, useEffect } from 'react';
import { Lesson, LearnerProfile } from '../types';
import { Sparkles, Star, Lock, CheckCircle2, Play, Egg, X, ChevronRight, ChevronLeft, MapPin, Compass } from 'lucide-react';
import { soundService } from '../services/soundService';
import { AvatarImage } from './AvatarImage';

// Import generated world map artwork
import zooMapImg from '../assets/images/zoo_world_map_1785173722085.jpg';
import playgroundMapImg from '../assets/images/playground_world_map_1785173734667.jpg';
import islandMapImg from '../assets/images/island_world_map_1785173753619.jpg';

interface MapAdventureProps {
  currentProfile: LearnerProfile;
  mapLevel: 1 | 2 | 3;
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
}

export const MapAdventure: React.FC<MapAdventureProps> = ({
  currentProfile,
  mapLevel,
  lessons,
  onSelectLesson,
}) => {
  const [selectedPreviewLesson, setSelectedPreviewLesson] = useState<Lesson | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredLessons = lessons.filter((l) => l.mapLevel === mapLevel);

  const mapThemes = {
    1: {
      worldCode: 'WORLD 1',
      name: 'THE MAGICAL ZOO',
      tagline: 'Phonics Safari • Single Sound Foundations',
      targetAge: 'Ages 4–5 • Emergent Pre-K',
      bgImage: zooMapImg,
      startTitle: 'ZOOKEEPER GATE',
      startEmoji: '🦁',
      endTitle: 'SAFARI CITADEL',
      endEmoji: '🏰',
      badgeBg: 'bg-emerald-600 border-emerald-400 text-white',
      accentColor: 'emerald',
      pathStrokeMain: '#fef08a',
      pathStrokeDash: '#059669',
      decorations: ['🦁', '🐘', '🐼', '🦒', '🦩', '🦜', '🐵', '🐊'],
      landmarks: [
        { index: 1, title: 'Lion Roar Enclosure', emoji: '🦁' },
        { index: 3, title: 'Elephant Splash Pond', emoji: '🐘' },
        { index: 5, title: 'Star Gem Hatchery', emoji: '🥚' },
        { index: 7, title: 'Panda Bamboo Grove', emoji: '🐼' },
        { index: 10, title: 'Safari Grand Citadel', emoji: '🏰' },
      ],
    },
    2: {
      worldCode: 'WORLD 2',
      name: 'THE WONDER PLAYGROUND',
      tagline: 'CVC Word Blending & Sound Construction',
      targetAge: 'Ages 5–6 • Kindergarten Track',
      bgImage: playgroundMapImg,
      startTitle: 'TICKET PLAZA',
      startEmoji: '🎪',
      endTitle: 'WONDER PALACE',
      endEmoji: '🏰',
      badgeBg: 'bg-sky-600 border-sky-300 text-white',
      accentColor: 'sky',
      pathStrokeMain: '#fef08a',
      pathStrokeDash: '#0284c7',
      decorations: ['🛝', '🎪', '🎡', '🎢', '🚀', '🎨', '🎈', '🎠'],
      landmarks: [
        { index: 1, title: 'Coaster Loop-de-Loop', emoji: '🎢' },
        { index: 3, title: 'Vowel Ferris Wheel', emoji: '🎡' },
        { index: 5, title: 'Surprise Toy Tent', emoji: '🎪' },
        { index: 7, title: 'Rocket Launch Pad', emoji: '🚀' },
        { index: 10, title: 'Wonder Carnival Palace', emoji: '🏰' },
      ],
    },
    3: {
      worldCode: 'WORLD 3',
      name: 'THE ADVENTURE ISLAND',
      tagline: 'Consonant Blends, Digraphs & Sight Word Mastery',
      targetAge: 'Advanced Kindergarten • Phonics Champions',
      bgImage: islandMapImg,
      startTitle: 'PIRATE HARBOR',
      startEmoji: '⛵',
      endTitle: 'DRAGON CITADEL',
      endEmoji: '🏴‍☠️',
      badgeBg: 'bg-amber-600 border-amber-300 text-white',
      accentColor: 'amber',
      pathStrokeMain: '#fde047',
      pathStrokeDash: '#d97706',
      decorations: ['🏝️', '🏴‍☠️', '💎', '🦜', '🌋', '⛵', '🌴', '⚔️'],
      landmarks: [
        { index: 1, title: 'Shipwreck Bay', emoji: '⛵' },
        { index: 3, title: 'Crystal Word Cavern', emoji: '💎' },
        { index: 5, title: 'Dragon Nest Peak', emoji: '🐲' },
        { index: 7, title: 'Phonics Volcano Ridge', emoji: '🌋' },
        { index: 10, title: 'Pirate Citadel', emoji: '🏴‍☠️' },
      ],
    },
  };

  const theme = mapThemes[mapLevel];

  // Auto-scroll to active lesson node on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeIdx = filteredLessons.findIndex(
        (l) => !currentProfile.completedLessonIds.includes(l.id)
      );
      if (activeIdx > 0) {
        const scrollAmount = Math.max(0, activeIdx * 150 - 200);
        scrollContainerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, [mapLevel, filteredLessons, currentProfile.completedLessonIds]);

  // Coordinates along horizontal 2.5D map layout (X in px, Y top % offset)
  const nodePositions = [
    { x: 130, y: 55 },
    { x: 270, y: 64 },
    { x: 410, y: 48 },
    { x: 550, y: 68 },
    { x: 690, y: 52 },
    { x: 830, y: 72 },
    { x: 970, y: 54 },
    { x: 1110, y: 66 },
    { x: 1250, y: 46 },
    { x: 1390, y: 60 },
    { x: 1530, y: 50 },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-900 font-sans select-none flex flex-col">
      
      {/* Top Map Header & HUD */}
      <div className="bg-slate-900 text-white p-3 sm:p-4 border-b-4 border-amber-500 shadow-2xl z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full font-display font-black text-xs uppercase tracking-wider shadow-md border ${theme.badgeBg}`}>
            {theme.worldCode}
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-display font-extrabold text-yellow-300 leading-none">
              {theme.name}
            </h1>
            <p className="text-xs text-amber-100/80 font-medium mt-0.5">
              {theme.tagline} • <span className="text-yellow-200">{theme.targetAge}</span>
            </p>
          </div>
        </div>

        {/* Child Profile & Star Gems Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-950 px-3 py-1.5 rounded-full font-display font-extrabold text-xs sm:text-sm shadow-md border-2 border-white">
            <Sparkles className="w-4 h-4 text-amber-800 fill-amber-700 animate-pulse" />
            <span>{currentProfile.starGems} Star Gems</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full shadow-inner">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-500 border border-white shrink-0">
              <AvatarImage avatar={currentProfile.avatar} name={currentProfile.name} fallbackTextSize="text-xs" />
            </div>
            <span className="text-xs font-display font-bold text-slate-200">
              {currentProfile.name}
            </span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL PANORAMIC 2.5D OVERWORLD MAP CONTAINER */}
      <div className="relative flex-1 overflow-hidden flex flex-col justify-center bg-slate-900">
        
        {/* Scroll Control Arrows */}
        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
            }
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-3 bg-amber-400/95 hover:bg-amber-300 text-amber-950 rounded-full border-2 border-white shadow-2xl backdrop-blur-sm active:scale-95 transition-all"
          title="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-3 bg-amber-400/95 hover:bg-amber-300 text-amber-950 rounded-full border-2 border-white shadow-2xl backdrop-blur-sm active:scale-95 transition-all"
          title="Scroll Right"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Scrollable Landscape Container */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden scrollbar-none py-6 flex items-center"
        >
          <div className="relative min-w-[1700px] h-[520px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl mx-auto border-4 border-amber-900 flex flex-col justify-between select-none">
            
            {/* RICH GENERATED MAP ARTWORK BACKGROUND */}
            <img
              src={theme.bgImage}
              alt={theme.name}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none filter brightness-95 contrast-105"
              referrerPolicy="no-referrer"
            />

            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

            {/* FAR-LEFT START WORLD GATE */}
            <div className="absolute left-6 top-10 z-10 flex flex-col items-center">
              <div className="text-6xl sm:text-7xl drop-shadow-2xl animate-bounce-subtle">
                {theme.startEmoji}
              </div>
              <div className="bg-amber-100/90 border-2 border-amber-800 px-3 py-0.5 rounded-full font-display font-extrabold text-[10px] text-amber-950 shadow-lg mt-1">
                {theme.startTitle}
              </div>
            </div>

            {/* FAR-RIGHT END WORLD CITADEL */}
            <div className="absolute right-6 top-10 z-10 flex flex-col items-center">
              <div className="text-7xl sm:text-8xl drop-shadow-2xl animate-bounce-subtle">
                {theme.endEmoji}
              </div>
              <div className="bg-amber-950/90 border-2 border-amber-400 px-3 py-0.5 rounded-full font-display font-extrabold text-[10px] text-yellow-300 shadow-lg mt-1">
                {theme.endTitle}
              </div>
            </div>

            {/* SVG WINDING PATHWAY CONNECTING ALL MAP NODES */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <path
                d={filteredLessons.reduce((acc, lesson, idx) => {
                  const pos = nodePositions[idx % nodePositions.length];
                  if (!pos) return acc;
                  const x = pos.x;
                  const y = (pos.y / 100) * 520;
                  return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                }, '')}
                fill="none"
                stroke={theme.pathStrokeMain}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-lg opacity-90"
              />
              <path
                d={filteredLessons.reduce((acc, lesson, idx) => {
                  const pos = nodePositions[idx % nodePositions.length];
                  if (!pos) return acc;
                  const x = pos.x;
                  const y = (pos.y / 100) * 520;
                  return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                }, '')}
                fill="none"
                stroke={theme.pathStrokeDash}
                strokeWidth="10"
                strokeDasharray="10 8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* OVERWORLD LEVEL NODE PADS (2.5D INTERACTIVE BUTTONS) */}
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {filteredLessons.map((lesson, idx) => {
                const pos = nodePositions[idx % nodePositions.length] || { x: 150 + idx * 130, y: 60 };
                const isCompleted = currentProfile.completedLessonIds.includes(lesson.id);
                const isUnlocked =
                  idx === 0 ||
                  currentProfile.completedLessonIds.includes(filteredLessons[idx - 1]?.id) ||
                  isCompleted;

                const isCurrentPlayerNode =
                  isUnlocked &&
                  !isCompleted &&
                  (idx === 0 || currentProfile.completedLessonIds.includes(filteredLessons[idx - 1]?.id));

                const landmark = theme.landmarks.find((l) => l.index === lesson.id % 11);
                const isMilestoneEgg = lesson.id % 5 === 0;

                return (
                  <div
                    key={lesson.id}
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    {/* Active Learner Avatar Character Token on Top of Node */}
                    {isCurrentPlayerNode && (
                      <div className="absolute -top-16 z-30 flex flex-col items-center animate-bounce">
                        <div className="bg-yellow-400 text-yellow-950 font-display font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border-2 border-white shadow-xl whitespace-nowrap mb-0.5">
                          {currentProfile.name} is here!
                        </div>
                        <div className="w-11 h-11 rounded-full border-2 border-white shadow-2xl overflow-hidden bg-emerald-500">
                          <AvatarImage avatar={currentProfile.avatar} name={currentProfile.name} fallbackTextSize="text-xl" />
                        </div>
                      </div>
                    )}

                    {/* Landmark Header Signpost */}
                    {landmark && (
                      <div className="absolute -top-10 bg-slate-950/90 border border-yellow-400 px-2.5 py-0.5 rounded-full text-[10px] font-display font-extrabold text-yellow-300 shadow-md flex items-center gap-1 animate-bounce-subtle whitespace-nowrap">
                        <span>{landmark.emoji}</span>
                        <span>{landmark.title}</span>
                      </div>
                    )}

                    {/* CIRCULAR OVERWORLD MAP PAD BUTTON */}
                    <button
                      onClick={() => {
                        if (isUnlocked) {
                          soundService.playPopSound();
                          soundService.speakLetterSound(lesson.targetLetter, lesson.step1.exampleWords[0]?.word);
                          setSelectedPreviewLesson(lesson);
                        } else {
                          soundService.playBoopSound();
                          soundService.speak('Complete earlier lessons to unlock this path!');
                        }
                      }}
                      className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full border-4 shadow-2xl flex items-center justify-center transition-all transform hover:scale-115 active:scale-95 ${
                        isCompleted
                          ? 'bg-amber-400 border-white text-amber-950 ring-4 ring-yellow-300'
                          : isUnlocked
                          ? 'bg-slate-950 border-yellow-400 text-yellow-300 ring-4 ring-yellow-400/60 animate-pulse'
                          : 'bg-stone-900 border-stone-600 text-stone-500 cursor-not-allowed opacity-80'
                      }`}
                    >
                      {/* Mascot Icon or Letter in Pad */}
                      {isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-950 fill-amber-300" />
                      ) : isUnlocked ? (
                        <div className="text-center leading-none">
                          <span className="text-xs block font-display font-black text-yellow-300">
                            /{lesson.targetLetter}/
                          </span>
                        </div>
                      ) : (
                        <Lock className="w-4 h-4 text-stone-500" />
                      )}
                    </button>

                    {/* Milestone Pet Egg Indicator */}
                    {isMilestoneEgg && (
                      <div className="absolute -bottom-2 bg-yellow-400 text-yellow-950 p-1 rounded-full border border-amber-600 shadow-md animate-bounce">
                        <Egg className="w-3.5 h-3.5 fill-orange-300 text-amber-700" />
                      </div>
                    )}

                    {/* Node Label Signpost */}
                    <div className="mt-2 bg-amber-950/90 border border-amber-400/80 px-2 py-0.5 rounded-md text-white font-display font-bold text-[10px] shadow-md flex items-center gap-1 whitespace-nowrap">
                      <span>Lesson #{lesson.id}</span>
                      <span className="text-yellow-300 font-extrabold">⭐ 15</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* OVERWORLD MAP LESSON PREVIEW DIALOG */}
      {selectedPreviewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-amber-50 border-4 border-amber-400 rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl bg-amber-200 p-2.5 rounded-2xl border border-amber-300">
                  {selectedPreviewLesson.step1.mascotEmoji}
                </span>
                <div>
                  <span className="text-[10px] font-display font-extrabold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    {theme.worldCode} • STAGE {selectedPreviewLesson.id}
                  </span>
                  <h3 className="font-display font-black text-xl text-amber-950 mt-0.5">
                    {selectedPreviewLesson.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedPreviewLesson(null)}
                className="p-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Target Sound: /{selectedPreviewLesson.targetLetter}/</span>
                <span>Companion: {selectedPreviewLesson.step1.mascotName}</span>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {selectedPreviewLesson.step1.instructionText}
              </p>

              <div className="flex items-center justify-center gap-3 pt-1">
                {selectedPreviewLesson.step1.exampleWords.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-center"
                  >
                    <span className="text-2xl block">{item.icon}</span>
                    <span className="text-xs font-bold text-amber-950">{item.word}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-amber-950 bg-yellow-300/80 p-3 rounded-xl border border-yellow-400">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-800 fill-amber-700" />
                <span>Completion Reward: +15 Star Gems</span>
              </div>
              <span className="text-emerald-800 font-extrabold">5-Step Phonics Cycle</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedPreviewLesson(null)}
                className="flex-1 py-3 bg-amber-200 hover:bg-amber-300 text-amber-950 font-display font-bold text-xs rounded-2xl transition-all"
              >
                Back to Map
              </button>

              <button
                onClick={() => {
                  const lessonToLaunch = selectedPreviewLesson;
                  setSelectedPreviewLesson(null);
                  onSelectLesson(lessonToLaunch);
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-display font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START LESSON!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
