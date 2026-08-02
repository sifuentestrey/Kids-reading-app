import React, { useState, useEffect } from 'react';
import { LearnerProfile, TreehouseItem, Pet } from '../../types';
import {
  TreehouseBedGraphic,
  ComfyCouchGraphic,
  BookshelfGraphic,
  TelescopeGraphic,
  TeddyBearGraphic,
  WoodenTrainGraphic,
  RainbowRugGraphic,
  PhonicsDeskGraphic,
  SecretTentGraphic,
  HammockGraphic,
  PottedPlantGraphic,
  RetroTvGraphic,
  LavaLampGraphic,
  NeonStarGraphic,
  AquariumGraphic,
  JukeboxGraphic,
  FairyLightsGraphic,
  DiscoBallGraphic,
  MagicWandGraphic,
} from './RoomFurniture';
import { RoomPetGraphic } from './RoomPets';
import { RoomAvatarCharacter } from './RoomAvatar';
import { soundService } from '../../services/soundService';
import { GAME_BACKGROUNDS } from '../../assets/gameAssets';
import { Sun, Moon, Sunset, Sparkles, Move, Check, Lock, Unlock, Volume2 } from 'lucide-react';

interface TreehouseRoomStageProps {
  currentProfile: LearnerProfile;
  placedItems: TreehouseItem[];
  equippedHatItem?: TreehouseItem;
  equippedOutfitItem?: TreehouseItem;
  equippedAccessoryItem?: TreehouseItem;
  onItemClick: (title: string, speechText: string) => void;
  onPlaceItemGrid?: (itemId: string, x: number, y: number) => void;
}

export const TreehouseRoomStage: React.FC<TreehouseRoomStageProps> = ({
  currentProfile,
  placedItems,
  equippedHatItem,
  equippedOutfitItem,
  equippedAccessoryItem,
  onItemClick,
  onPlaceItemGrid,
}) => {
  // Time of Day state
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'daytime' | 'sunset' | 'night'>('daytime');
  
  // Special Interactive Toy States
  const [activeSpecialEffect, setActiveSpecialEffect] = useState<string | null>(null);
  const [isTvPlaying, setIsTvPlaying] = useState<boolean>(false);
  const [lavaLampColorIndex, setLavaLampColorIndex] = useState<number>(0);
  const [isTrainChugging, setIsTrainChugging] = useState<boolean>(false);
  
  // Decorate & Grid Mode States
  const [isDecorateMode, setIsDecorateMode] = useState<boolean>(false);
  const [isSafetyLocked, setIsSafetyLocked] = useState<boolean>(true);
  const [selectedGridCell, setSelectedGridCell] = useState<{ x: number; y: number } | null>(null);

  // Active Pet Emoticons State
  const [petEmoticons, setPetEmoticons] = useState<Record<string, string>>({});

  // Cycle pet speech emoticons randomly
  useEffect(() => {
    const emojis = ['❤️', '💤', '🎵', '⭐', '🐾', '🍎', '✨', '🎈'];
    const interval = setInterval(() => {
      if (currentProfile.unlockedPets.length > 0) {
        const randomPet = currentProfile.unlockedPets[Math.floor(Math.random() * currentProfile.unlockedPets.length)];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setPetEmoticons((prev) => ({ ...prev, [randomPet.id]: randomEmoji }));
        
        // Clear emoticon after 3.5 seconds
        setTimeout(() => {
          setPetEmoticons((prev) => {
            const next = { ...prev };
            delete next[randomPet.id];
            return next;
          });
        }, 3500);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentProfile.unlockedPets]);

  // Disco Effect Trigger
  const triggerDiscoEffect = () => {
    setActiveSpecialEffect('disco');
    soundService.playSuccessChime();
    soundService.speak("Dance party in the treehouse! Rainbow disco lights!");
    onItemClick('Sparkle Disco Ball', 'Dance party in the treehouse! Spinning sparkly disco lights everywhere!');
    setTimeout(() => setActiveSpecialEffect(null), 6000);
  };

  // TV Toggle Trigger
  const toggleRetroTv = () => {
    const nextState = !isTvPlaying;
    setIsTvPlaying(nextState);
    if (nextState) {
      soundService.playSuccessChime();
      soundService.speak("Sing along with the Phonics ABC Nursery Rhyme!");
      onItemClick('Retro TV Console', 'Playing Phonics Alphabet Song! A-B-C-D-E-F-G!');
    } else {
      soundService.playBoopSound();
      onItemClick('Retro TV Console', 'TV turned off.');
    }
  };

  // Lava Lamp Toggle Trigger
  const cycleLavaLamp = () => {
    soundService.playPopSound();
    setLavaLampColorIndex((prev) => prev + 1);
    soundService.speak("Glowing lava lamp!");
    onItemClick('Magma Lava Lamp', 'Bubble lava lamp glowing brightly!');
  };

  // Train Chug Trigger
  const startTrainChug = () => {
    setIsTrainChugging(true);
    soundService.playSuccessChime();
    soundService.speak("Choo choo! Alphabet train on the wooden track!");
    onItemClick('Alphabet Train Set', 'Choo choo! The wooden alphabet train is chugging along!');
    setTimeout(() => setIsTrainChugging(false), 5000);
  };

  // Render 2.5D Vector Furniture Graphic
  const renderFurnitureGraphic = (item: TreehouseItem) => {
    switch (item.id) {
      case 'treehouse_bed':
        return <TreehouseBedGraphic className="w-28 h-28 sm:w-36 sm:h-36 filter drop-shadow-xl" />;
      case 'comfy_couch':
        return <ComfyCouchGraphic className="w-28 h-24 sm:w-36 sm:h-30 filter drop-shadow-xl" />;
      case 'bookshelf_nook':
        return <BookshelfGraphic className="w-24 h-28 sm:w-30 sm:h-36 filter drop-shadow-xl" />;
      case 'star_telescope':
        return <TelescopeGraphic className="w-24 h-28 sm:w-28 sm:h-32 filter drop-shadow-xl" />;
      case 'stuffed_bear':
        return <TeddyBearGraphic className="w-20 h-24 sm:w-24 sm:h-28 filter drop-shadow-xl" />;
      case 'wooden_train':
        return (
          <div className={`transition-transform duration-500 ${isTrainChugging ? 'translate-x-2 animate-bounce-subtle' : ''}`}>
            <WoodenTrainGraphic className="w-28 h-18 sm:w-36 sm:h-22 filter drop-shadow-xl" />
          </div>
        );
      case 'phonics_desk':
        return <PhonicsDeskGraphic className="w-28 h-28 sm:w-34 sm:h-34 filter drop-shadow-xl" />;
      case 'secret_tent':
      case 'play_tent':
        return <SecretTentGraphic className="w-28 h-32 sm:w-36 sm:h-40 filter drop-shadow-xl" />;
      case 'treehouse_hammock':
        return <HammockGraphic className="w-36 h-22 sm:w-44 sm:h-26 filter drop-shadow-xl" />;
      case 'potted_plant':
        return <PottedPlantGraphic className="w-20 h-24 sm:w-24 sm:h-28 filter drop-shadow-xl" />;
      case 'retro_tv':
        return <RetroTvGraphic className="w-26 h-26 sm:w-32 sm:h-32 filter drop-shadow-xl" isPlaying={isTvPlaying} />;
      case 'lava_lamp':
        return <LavaLampGraphic className="w-16 h-26 sm:w-20 sm:h-30 filter drop-shadow-xl" colorIndex={lavaLampColorIndex} />;
      case 'neon_star':
        return <NeonStarGraphic className="w-22 h-26 sm:w-26 sm:h-30 filter drop-shadow-xl" />;
      case 'glowing_aquarium':
        return <AquariumGraphic className="w-28 h-24 sm:w-34 sm:h-28 filter drop-shadow-xl" />;
      case 'retro_jukebox':
        return <JukeboxGraphic className="w-26 h-30 sm:w-30 sm:h-34 filter drop-shadow-xl" />;
      case 'fairy_lights':
        return <FairyLightsGraphic className="w-48 h-12 filter drop-shadow-md" />;
      case 'disco_ball':
        return <DiscoBallGraphic className="w-24 h-28 filter drop-shadow-xl" />;
      case 'magic_wand_toy':
        return <MagicWandGraphic className="w-20 h-24 filter drop-shadow-xl" />;
      case 'rainbow_rug':
        return <RainbowRugGraphic className="w-48 h-20 filter drop-shadow-md" />;
      default:
        return (
          <div className="p-3 bg-amber-100 border-2 border-amber-500 rounded-2xl shadow-xl flex items-center gap-2">
            <span className="text-3xl">{item.icon}</span>
            <span className="font-display font-bold text-xs text-amber-950">{item.name}</span>
          </div>
        );
    }
  };

  // Helper to parse numeric Y value from percentage string like '56%' -> 56 for dynamic 2.5D depth sorting
  const parseYVal = (topStr: string): number => {
    const num = parseInt(topStr.replace('%', ''), 10);
    return isNaN(num) ? 50 : num;
  };

  // Fixed 2.5D Room Placement Coordinates
  const slotPositions: Record<string, { left: string; top: string }> = {
    treehouse_hammock: { left: '50%', top: '22%' },
    bookshelf_nook: { left: '16%', top: '30%' },
    star_telescope: { left: '84%', top: '32%' },
    treehouse_bed: { left: '18%', top: '56%' },
    secret_tent: { left: '82%', top: '58%' },
    comfy_couch: { left: '26%', top: '72%' },
    retro_tv: { left: '74%', top: '70%' },
    lava_lamp: { left: '88%', top: '65%' },
    neon_star: { left: '12%', top: '68%' },
    phonics_desk: { left: '18%', top: '84%' },
    stuffed_bear: { left: '38%', top: '82%' },
    wooden_train: { left: '68%', top: '85%' },
    potted_plant: { left: '88%', top: '78%' },
    glowing_aquarium: { left: '30%', top: '32%' },
    retro_jukebox: { left: '70%', top: '32%' },
  };

  // Roaming Pet Floor Coordinates
  const petPositions = [
    { left: '38%', top: '64%' },
    { left: '62%', top: '68%' },
    { left: '78%', top: '66%' },
  ];

  // Isometric Grid Matrix for Decorate Mode (4x4 Floor Grid)
  const gridCells = [
    { x: 0, y: 0, left: '25%', top: '58%' },
    { x: 1, y: 0, left: '42%', top: '58%' },
    { x: 2, y: 0, left: '58%', top: '58%' },
    { x: 3, y: 0, left: '75%', top: '58%' },
    { x: 0, y: 1, left: '22%', top: '68%' },
    { x: 1, y: 1, left: '40%', top: '68%' },
    { x: 2, y: 1, left: '60%', top: '68%' },
    { x: 3, y: 1, left: '78%', top: '68%' },
    { x: 0, y: 2, left: '18%', top: '78%' },
    { x: 1, y: 2, left: '38%', top: '78%' },
    { x: 2, y: 2, left: '62%', top: '78%' },
    { x: 3, y: 2, left: '82%', top: '78%' },
  ];

  // Ambient Gradient overlays based on time of day
  const timeOverlays = {
    morning: 'bg-gradient-to-b from-amber-500/20 via-orange-400/10 to-transparent',
    daytime: 'bg-gradient-to-b from-sky-400/10 via-amber-200/5 to-transparent',
    sunset: 'bg-gradient-to-b from-rose-600/30 via-amber-600/20 to-indigo-950/40',
    night: 'bg-gradient-to-b from-indigo-950/70 via-slate-900/60 to-amber-950/80',
  };

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] rounded-3xl border-4 border-amber-950 overflow-hidden shadow-2xl bg-amber-950 select-none group flex flex-col justify-between">
      
      {/* HUD OVERLAY BAR: CARTOON STYLED WARM CREAM CONTAINER WITH THICK OUTLINES */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-4 z-50 flex items-center justify-between pointer-events-auto bg-amber-50 border-4 border-amber-950 p-1.5 sm:p-2 rounded-2xl shadow-2xl">
        
        {/* TIME OF DAY SELECTOR BUBBLE */}
        <div className="bg-amber-100 border-2 border-amber-950 p-1 rounded-full shadow-md flex items-center gap-1">
          <button
            onClick={() => {
              setTimeOfDay('morning');
              soundService.playPopSound();
              soundService.speak("Sunrise morning glow!");
            }}
            className={`p-1.5 rounded-full border-2 transition-all ${
              timeOfDay === 'morning'
                ? 'bg-amber-400 border-amber-950 text-amber-950 scale-105 font-bold shadow'
                : 'bg-amber-50 border-amber-950 text-amber-800 hover:bg-amber-200'
            }`}
            title="Morning Sunrise 🌅"
          >
            <Sun className="w-4 h-4 text-amber-950" />
          </button>

          <button
            onClick={() => {
              setTimeOfDay('daytime');
              soundService.playPopSound();
              soundService.speak("Bright daytime in the treehouse!");
            }}
            className={`p-1.5 rounded-full border-2 transition-all ${
              timeOfDay === 'daytime'
                ? 'bg-sky-400 border-amber-950 text-amber-950 scale-105 font-bold shadow'
                : 'bg-amber-50 border-amber-950 text-amber-800 hover:bg-amber-200'
            }`}
            title="Sunny Daytime ☀️"
          >
            <Sun className="w-4 h-4 text-amber-950" />
          </button>

          <button
            onClick={() => {
              setTimeOfDay('sunset');
              soundService.playPopSound();
              soundService.speak("Golden hour sunset!");
            }}
            className={`p-1.5 rounded-full border-2 transition-all ${
              timeOfDay === 'sunset'
                ? 'bg-orange-400 border-amber-950 text-amber-950 scale-105 font-bold shadow'
                : 'bg-amber-50 border-amber-950 text-amber-800 hover:bg-amber-200'
            }`}
            title="Golden Hour Sunset 🌇"
          >
            <Sunset className="w-4 h-4 text-amber-950" />
          </button>

          <button
            onClick={() => {
              setTimeOfDay('night');
              soundService.playPopSound();
              soundService.speak("Starry night sky!");
            }}
            className={`p-1.5 rounded-full border-2 transition-all ${
              timeOfDay === 'night'
                ? 'bg-indigo-400 border-amber-950 text-amber-950 scale-105 font-bold shadow'
                : 'bg-amber-50 border-amber-950 text-amber-800 hover:bg-amber-200'
            }`}
            title="Starry Night 🌙"
          >
            <Moon className="w-4 h-4 text-amber-950" />
          </button>
        </div>

        {/* DECORATE & SAFETY LOCK CONTROLS */}
        <div className="flex items-center gap-2">
          {/* Child Safety Lock */}
          <button
            onClick={() => {
              setIsSafetyLocked(!isSafetyLocked);
              soundService.playBoopSound();
              soundService.speak(isSafetyLocked ? "Safety lock unlocked!" : "Safety lock locked!");
            }}
            className={`px-3 py-1.5 rounded-xl border-2 border-amber-950 font-display font-black text-xs flex items-center gap-1.5 shadow-md transition-all ${
              isSafetyLocked
                ? 'bg-amber-200 text-amber-950'
                : 'bg-emerald-400 text-amber-950 animate-pulse'
            }`}
          >
            {isSafetyLocked ? <Lock className="w-4 h-4 text-amber-950" /> : <Unlock className="w-4 h-4 text-amber-950" />}
            <span className="hidden sm:inline">{isSafetyLocked ? "Locked" : "Unlocked"}</span>
          </button>

          {/* Decorate Grid Mode Toggle */}
          <button
            onClick={() => {
              if (isSafetyLocked) {
                soundService.playBoopSound();
                soundService.speak("Unlock safety lock first to decorate!");
                return;
              }
              setIsDecorateMode(!isDecorateMode);
              soundService.playSuccessChime();
              soundService.speak(isDecorateMode ? "Viewing treehouse room!" : "Decorate grid active!");
            }}
            className={`px-3.5 py-1.5 rounded-xl border-2 border-amber-950 font-display font-black text-xs flex items-center gap-1.5 shadow-md transition-all ${
              isDecorateMode
                ? 'bg-emerald-400 text-amber-950 scale-105 animate-pulse'
                : 'bg-yellow-400 text-amber-950 hover:bg-yellow-300'
            }`}
          >
            <Move className="w-4 h-4 text-amber-950" />
            <span>{isDecorateMode ? "Finish Decorating" : "Decorate Grid"}</span>
          </button>
        </div>
      </div>

      {/* 1. ROOM BACKGROUND: HIGH QUALITY WOOD CABIN TEXTURE ASSET */}
      <img
        src={GAME_BACKGROUNDS.woodCabinInterior}
        alt="Wood Cabin Interior"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
        referrerPolicy="no-referrer"
      />

      {/* DYNAMIC VOLUMETRIC CIRCULAR TREEHOUSE WINDOW */}
      <div
        onClick={() => {
          // Cycle time of day when window is clicked
          const nextTime = timeOfDay === 'morning' ? 'daytime' : timeOfDay === 'daytime' ? 'sunset' : timeOfDay === 'sunset' ? 'night' : 'morning';
          setTimeOfDay(nextTime);
          soundService.playPopSound();
          soundService.speak(`Window view changed to ${nextTime}!`);
        }}
        className="absolute left-1/2 -translate-x-1/2 top-8 w-44 sm:w-52 h-44 sm:h-52 rounded-full border-8 border-amber-950 shadow-inner overflow-hidden cursor-pointer pointer-events-auto z-0 group/window transition-all duration-700"
      >
        {/* Morning View */}
        {timeOfDay === 'morning' && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-amber-200 to-emerald-400">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-200 rounded-full blur-[2px] animate-pulse" />
            <div className="absolute top-6 left-2 w-16 h-8 bg-white/70 rounded-full blur-[1px]" />
          </div>
        )}

        {/* Daytime View */}
        {timeOfDay === 'daytime' && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300">
            <div className="absolute top-4 left-4 w-16 h-8 bg-white/80 rounded-full blur-[1px] animate-pulse" />
            <div className="absolute top-8 right-6 w-12 h-6 bg-white/70 rounded-full blur-[1px]" />
            <div className="absolute -bottom-2 inset-x-0 h-24 bg-emerald-600 rounded-t-full opacity-90" />
          </div>
        )}

        {/* Sunset View */}
        {timeOfDay === 'sunset' && (
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500 via-orange-400 to-emerald-700">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-300 rounded-full blur-[3px]" />
            <div className="absolute top-6 left-4 w-14 h-6 bg-rose-200/60 rounded-full" />
          </div>
        )}

        {/* Night View */}
        {timeOfDay === 'night' && (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950">
            {/* Glowing Crescent Moon */}
            <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-yellow-200 shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
            {/* Twinkling Stars */}
            <span className="absolute top-6 left-6 text-yellow-200 text-xs animate-ping">✨</span>
            <span className="absolute top-12 left-16 text-yellow-100 text-xs animate-pulse">⭐</span>
            <span className="absolute top-10 right-20 text-yellow-200 text-xs animate-pulse">✨</span>
          </div>
        )}

        {/* Distant Forest Canopy */}
        <div className="absolute -bottom-4 inset-x-0 h-20 bg-emerald-800/90 rounded-t-full pointer-events-none" />

        {/* Window Wooden Cross Grid */}
        <div className="absolute inset-0 border-r-4 border-b-4 border-amber-950/60 pointer-events-none" />
      </div>

      {/* 2. ISOMETRIC 2.5D PERSPECTIVE WOODEN FLOOR OVERLAY */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-b from-transparent via-amber-950/10 to-amber-950/40 border-t border-amber-900/30 shadow-inner pointer-events-none">
        {/* Floor Planks Lines in Perspective */}
        <div className="absolute inset-0 opacity-20 flex justify-around">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full w-0.5 border-r border-amber-950 transform -skew-x-12" />
          ))}
        </div>
      </div>

      {/* TIME OF DAY AMBIENT LIGHTING OVERLAY */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-700 z-40 ${timeOverlays[timeOfDay]}`}>
        {/* Floating Ambient Sparkles / Light Motes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/5 text-amber-200 text-xs animate-pulse">✨</div>
          <div className="absolute top-1/3 right-1/4 text-yellow-100 text-sm animate-ping">⭐</div>
          <div className="absolute top-1/2 left-2/3 text-amber-300 text-xs animate-bounce">✨</div>
          <div className="absolute bottom-1/3 left-1/3 text-yellow-200 text-xs animate-pulse">✨</div>
        </div>
      </div>

      {/* DISCO PARTY SPARKLE LIGHT RAYS */}
      {activeSpecialEffect === 'disco' && (
        <div className="absolute inset-0 pointer-events-none z-45 flex flex-wrap justify-around items-center opacity-80 animate-spin-slow">
          <span className="text-4xl text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,1)]">✨</span>
          <span className="text-4xl text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,1)]">💖</span>
          <span className="text-4xl text-cyan-300 drop-shadow-[0_0_12px_rgba(103,232,249,1)]">⭐</span>
          <span className="text-4xl text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,1)]">✨</span>
        </div>
      )}

      {/* ISOMETRIC DECORATE GRID OVERLAY (WHEN DECORATE MODE ACTIVE) */}
      {isDecorateMode && (
        <div className="absolute inset-x-0 bottom-4 h-[48%] z-45 pointer-events-auto">
          {gridCells.map((cell) => {
            const isSelected = selectedGridCell?.x === cell.x && selectedGridCell?.y === cell.y;
            return (
              <div
                key={`${cell.x}-${cell.y}`}
                style={{ left: cell.left, top: cell.top }}
                onClick={() => {
                  setSelectedGridCell({ x: cell.x, y: cell.y });
                  soundService.playPopSound();
                  soundService.speak(`Selected grid spot ${cell.x + 1}, ${cell.y + 1}`);
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-20 h-10 rounded-full border-2 transform rotate-x-60 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-400/50 border-emerald-200 scale-110 shadow-[0_0_15px_rgba(52,211,153,1)]'
                    : 'bg-yellow-300/20 border-yellow-400/60 hover:bg-yellow-300/40'
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-[10px] text-yellow-200">
                  {cell.x + 1},{cell.y + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* FAIRY LIGHTS CEILING GARLAND */}
      {placedItems.some((i) => i.id === 'fairy_lights') && (
        <div className="absolute top-2 inset-x-4 z-40 flex justify-around items-center pointer-events-none">
          {['✨', '💡', '🌟', '💡', '✨', '💡', '🌟', '💡', '✨'].map((light, idx) => (
            <span key={idx} className="text-2xl drop-shadow-[0_0_10px_rgba(253,224,71,0.9)] animate-pulse">
              {light}
            </span>
          ))}
        </div>
      )}

      {/* DISCO BALL SPINNER */}
      {placedItems.some((i) => i.id === 'disco_ball') && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-42 flex flex-col items-center">
          <div className="w-0.5 h-6 bg-amber-200" />
          <button
            onClick={triggerDiscoEffect}
            className="text-4xl sm:text-5xl drop-shadow-2xl hover:scale-125 transition-transform animate-spin-slow cursor-pointer"
            title="Click to start disco party!"
          >
            🪩
          </button>
        </div>
      )}

      {/* 3. CENTER FLOOR 2.5D PLUSH RAINBOW RUG */}
      {placedItems.some((i) => i.id === 'rainbow_rug') && (
        <div
          style={{ left: '50%', top: '70%', zIndex: 10 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto hover:scale-105 transition-transform"
          onClick={() => {
            soundService.playPopSound();
            soundService.speak("Soft plush rainbow rug!");
            onItemClick('Rainbow Plush Rug', 'Soft, colorful woven rug at the center of the treehouse floor!');
          }}
        >
          <RainbowRugGraphic className="w-56 h-24 sm:w-64 sm:h-28 filter drop-shadow-2xl" />
        </div>
      )}

      {/* 4. PLACED 2.5D FURNITURE & TOYS */}
      {placedItems.map((item) => {
        if (item.id === 'rainbow_rug' || item.id === 'fairy_lights' || item.id === 'disco_ball') return null;
        const coords = slotPositions[item.id] || { left: '50%', top: '60%' };
        const computedZIndex = parseYVal(coords.top);

        return (
          <div
            key={item.id}
            style={{
              left: coords.left,
              top: coords.top,
              zIndex: computedZIndex,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/item cursor-pointer pointer-events-auto"
            onClick={() => {
              if (item.id === 'retro_tv') toggleRetroTv();
              else if (item.id === 'lava_lamp') cycleLavaLamp();
              else if (item.id === 'wooden_train') startTrainChug();
              else {
                soundService.playPopSound();
                soundService.speak(item.name);
                onItemClick(item.name, item.soundText || item.description);
              }
            }}
          >
            {/* 2.5D Ground Oval Shadow */}
            <div className="absolute -bottom-2 w-20 sm:w-28 h-6 bg-black/50 rounded-[50%] blur-[3px] pointer-events-none transform scale-x-125" />

            {/* Furniture Graphic */}
            <div className="group-hover/item:scale-115 group-hover/item:-translate-y-2 active:scale-95 transition-all">
              {renderFurnitureGraphic(item)}
            </div>

            {/* Hover Item Title Badge */}
            <span className="mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-amber-950/90 text-yellow-300 font-display font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400 shadow-xl whitespace-nowrap">
              {item.name}
            </span>
          </div>
        );
      })}

      {/* 5. UNLOCKED PETS ROAMING THE 2.5D FLOOR WITH SPEECH EMOTICONS */}
      {currentProfile.unlockedPets.map((pet, idx) => {
        const coords = petPositions[idx % petPositions.length];
        const activeEmoticon = petEmoticons[pet.id];
        const computedZIndex = parseYVal(coords.top);

        return (
          <div
            key={pet.id}
            style={{
              left: coords.left,
              top: coords.top,
              zIndex: computedZIndex,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer pointer-events-auto group/pet"
            onClick={() => {
              soundService.playSuccessChime();
              soundService.speak(`${pet.name} the ${pet.species}!`);
              onItemClick(`${pet.name} the ${pet.species}`, `${pet.name} says: ${pet.description}`);
            }}
          >
            {/* Active Pet Speech Emoticon Bubble */}
            {activeEmoticon && (
              <div className="absolute -top-10 bg-white text-slate-900 text-lg px-2 py-0.5 rounded-full border-2 border-amber-400 shadow-xl animate-bounce">
                {activeEmoticon}
              </div>
            )}

            {/* Pet Ground Shadow */}
            <div className="absolute -bottom-1 w-14 h-4 bg-black/50 rounded-[50%] blur-[2px] pointer-events-none" />

            <div className="group-hover/pet:scale-120 group-hover/pet:-translate-y-2 transition-all animate-bounce-subtle">
              <RoomPetGraphic species={pet.species} className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-lg" />
            </div>

            <span className="opacity-0 group-hover/pet:opacity-100 transition-opacity bg-emerald-950 text-emerald-200 font-display font-bold text-[9px] px-2 py-0.5 rounded-full border border-emerald-400 shadow-md whitespace-nowrap">
              {pet.name}
            </span>
          </div>
        );
      })}

      {/* 6. CENTER 2.5D CHARACTER AVATAR STAGE */}
      <div
        style={{
          left: '50%',
          top: '64%',
          zIndex: parseYVal('64%'),
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group/avatar"
        onClick={() => {
          soundService.playSuccessChime();
          soundService.speak(`Hi! I'm ${currentProfile.name}! Welcome to my treehouse!`);
          onItemClick(
            `${currentProfile.name}'s Avatar`,
            `Hi! I'm ${currentProfile.name}! Dressed in my ${equippedHatItem?.name || 'hat'}, ${equippedOutfitItem?.name || 'outfit'}, and ready to learn!`
          );
        }}
      >
        {/* Character Floor Shadow */}
        <div className="absolute -bottom-2 w-28 sm:w-32 h-8 bg-black/60 rounded-[50%] blur-[4px] pointer-events-none" />

        {/* Full 2.5D Character Avatar */}
        <div className="group-hover/avatar:scale-110 group-hover/avatar:-translate-y-2 transition-all">
          <RoomAvatarCharacter
            name={currentProfile.name}
            avatarIcon={currentProfile.avatar}
            equippedHatId={currentProfile.equippedHat}
            equippedOutfitId={currentProfile.equippedOutfit}
            equippedAccessoryId={currentProfile.equippedAccessory}
            className="w-28 h-40 sm:w-34 sm:h-48"
          />
        </div>

        {/* Character Name Tag */}
        <div className="mt-1 bg-amber-950 text-yellow-300 font-display font-extrabold text-xs px-3.5 py-1 rounded-full border-2 border-yellow-400 shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
          <span>{currentProfile.name}</span>
          {equippedHatItem && <span>{equippedHatItem.icon}</span>}
        </div>
      </div>
    </div>
  );
};

