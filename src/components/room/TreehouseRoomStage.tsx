import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LearnerProfile, PlacedItemLayout, TreehouseItem } from '../../types';
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
import {
  DEFAULT_AVATAR_SLOT,
  FLAT_FLOOR_ITEMS,
  PET_SLOTS,
  RoomBand,
  RoomPoint,
  depthZIndex,
  getDefaultSlot,
  getItemBand,
} from './roomLayout';
import { useRoomDrag } from './useRoomDrag';
import { Sun, Moon, Sunset, Sunrise, Move, Lock, Unlock, RotateCcw } from 'lucide-react';

type TimeOfDay = 'morning' | 'daytime' | 'sunset' | 'night';

/** Reserved layout id for the child's avatar. */
const AVATAR_LAYOUT_ID = '__avatar';

interface TreehouseRoomStageProps {
  currentProfile: LearnerProfile;
  placedItems: TreehouseItem[];
  equippedHatItem?: TreehouseItem;
  equippedOutfitItem?: TreehouseItem;
  equippedAccessoryItem?: TreehouseItem;
  onItemClick: (title: string, speechText: string) => void;
  onMoveItem: (itemId: string, x: number, y: number) => void;
  onResetRoomLayout: () => void;
}

/**
 * One source of truth for how the room looks at each time of day: wall wash,
 * floor wash, whole-room ambient light, and the view through the window.
 */
const TIME_THEMES: Record<
  TimeOfDay,
  {
    label: string;
    speech: string;
    wall: string;
    floor: string;
    ambient: string;
    sky: string;
    Icon: typeof Sun;
    swatch: string;
  }
> = {
  morning: {
    label: 'Sunrise',
    speech: 'Sunrise! Warm morning light is filling the treehouse.',
    wall: 'bg-gradient-to-b from-orange-300/35 via-amber-200/15 to-transparent',
    floor: 'bg-gradient-to-b from-amber-300/25 to-orange-900/20',
    ambient: 'bg-gradient-to-br from-orange-400/20 via-transparent to-amber-900/15',
    sky: 'bg-gradient-to-b from-indigo-400 via-orange-300 to-amber-200',
    Icon: Sunrise,
    swatch: 'bg-orange-300',
  },
  daytime: {
    label: 'Daytime',
    speech: 'Bright sunny daytime in the treehouse!',
    wall: 'bg-gradient-to-b from-sky-200/25 via-transparent to-transparent',
    floor: 'bg-gradient-to-b from-amber-100/20 to-amber-900/15',
    ambient: 'bg-gradient-to-b from-sky-200/10 via-transparent to-amber-950/10',
    sky: 'bg-gradient-to-b from-sky-400 via-sky-200 to-sky-100',
    Icon: Sun,
    swatch: 'bg-sky-300',
  },
  sunset: {
    label: 'Sunset',
    speech: 'Golden hour! The whole treehouse glows orange and pink.',
    wall: 'bg-gradient-to-b from-rose-500/35 via-orange-400/20 to-indigo-900/20',
    floor: 'bg-gradient-to-b from-rose-500/25 to-indigo-950/35',
    ambient: 'bg-gradient-to-br from-rose-500/25 via-amber-500/10 to-indigo-950/30',
    sky: 'bg-gradient-to-b from-indigo-700 via-rose-500 to-amber-300',
    Icon: Sunset,
    swatch: 'bg-rose-400',
  },
  night: {
    label: 'Night',
    speech: 'Starry night! Time for cosy bedtime stories.',
    wall: 'bg-gradient-to-b from-indigo-950/70 via-slate-900/55 to-slate-900/45',
    floor: 'bg-gradient-to-b from-indigo-950/55 to-slate-950/65',
    ambient: 'bg-gradient-to-b from-indigo-950/55 via-slate-900/35 to-amber-950/45',
    sky: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-indigo-900',
    Icon: Moon,
    swatch: 'bg-indigo-400',
  },
};

const TIME_ORDER: TimeOfDay[] = ['morning', 'daytime', 'sunset', 'night'];

/** Fixed star field for the night window — stable across renders. */
const WINDOW_STARS = [
  { top: '18%', left: '20%', size: 3, delay: '0s' },
  { top: '30%', left: '64%', size: 2, delay: '0.6s' },
  { top: '12%', left: '46%', size: 2, delay: '1.2s' },
  { top: '44%', left: '30%', size: 2.5, delay: '0.3s' },
  { top: '26%', left: '80%', size: 2, delay: '0.9s' },
  { top: '52%', left: '70%', size: 2, delay: '1.5s' },
];

export const TreehouseRoomStage: React.FC<TreehouseRoomStageProps> = ({
  currentProfile,
  placedItems,
  equippedHatItem,
  equippedOutfitItem,
  equippedAccessoryItem,
  onItemClick,
  onMoveItem,
  onResetRoomLayout,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('daytime');

  // Interactive toy states
  const [activeSpecialEffect, setActiveSpecialEffect] = useState<string | null>(null);
  const [isTvPlaying, setIsTvPlaying] = useState(false);
  const [lavaLampColorIndex, setLavaLampColorIndex] = useState(0);
  const [isTrainChugging, setIsTrainChugging] = useState(false);

  // Decorate mode, gated behind a child-safety lock so items can't be moved
  // by accident during normal play.
  const [isDecorateMode, setIsDecorateMode] = useState(false);
  const [isSafetyLocked, setIsSafetyLocked] = useState(true);

  const [petEmoticons, setPetEmoticons] = useState<Record<string, string>>({});

  const stageRef = useRef<HTMLDivElement>(null);
  const theme = TIME_THEMES[timeOfDay];

  const savedLayout = useMemo(() => {
    const map = new Map<string, RoomPoint>();
    (currentProfile.placedItemLayout ?? []).forEach((entry: PlacedItemLayout) => {
      map.set(entry.itemId, { x: entry.x, y: entry.y });
    });
    return map;
  }, [currentProfile.placedItemLayout]);

  const { draggingItemId, handlePointerDown, handlePointerMove, handlePointerUp, positionFor } =
    useRoomDrag({
      stageRef,
      onCommit: onMoveItem,
      enabled: isDecorateMode && !isSafetyLocked,
    });

  const canDrag = isDecorateMode && !isSafetyLocked;

  // Pets pop a mood emoji now and then.
  useEffect(() => {
    const emojis = ['❤️', '💤', '🎵', '⭐', '🐾', '🍎', '✨', '🎈'];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const interval = setInterval(() => {
      if (currentProfile.unlockedPets.length === 0) return;
      const pet =
        currentProfile.unlockedPets[Math.floor(Math.random() * currentProfile.unlockedPets.length)];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      setPetEmoticons((prev) => ({ ...prev, [pet.id]: emoji }));

      timeouts.push(
        setTimeout(() => {
          setPetEmoticons((prev) => {
            const next = { ...prev };
            delete next[pet.id];
            return next;
          });
        }, 3500)
      );
    }, 5000);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [currentProfile.unlockedPets]);

  const changeTimeOfDay = (next: TimeOfDay) => {
    setTimeOfDay(next);
    soundService.playPopSound();
    soundService.speak(TIME_THEMES[next].speech);
  };

  const triggerDiscoEffect = () => {
    setActiveSpecialEffect('disco');
    soundService.playSuccessChime();
    speakAndInspect('Sparkle Disco Ball', 'Dance party in the treehouse! Spinning sparkly disco lights everywhere!');
    setTimeout(() => setActiveSpecialEffect(null), 6000);
  };

  const toggleRetroTv = () => {
    const next = !isTvPlaying;
    setIsTvPlaying(next);
    if (next) {
      soundService.playSuccessChime();
      speakAndInspect('Retro TV Console', 'Playing the Phonics Alphabet Song! A-B-C-D-E-F-G!');
    } else {
      soundService.playBoopSound();
      speakAndInspect('Retro TV Console', 'TV turned off.');
    }
  };

  const cycleLavaLamp = () => {
    soundService.playPopSound();
    setLavaLampColorIndex((prev) => prev + 1);
    speakAndInspect('Magma Lava Lamp', 'The bubbly lava lamp is glowing brightly!');
  };

  const startTrainChug = () => {
    setIsTrainChugging(true);
    soundService.playSuccessChime();
    speakAndInspect('Alphabet Train Set', 'Choo choo! The wooden alphabet train is chugging along!');
    setTimeout(() => setIsTrainChugging(false), 5000);
  };

  /** Fill the speech bubble and read it aloud. */
  function speakAndInspect(title: string, text: string) {
    onItemClick(title, text);
    soundService.speak(text);
  }

  const renderFurnitureGraphic = (item: TreehouseItem) => {
    switch (item.id) {
      case 'treehouse_bed':
        return <TreehouseBedGraphic className="w-28 h-28 sm:w-36 sm:h-36" />;
      case 'comfy_couch':
        return <ComfyCouchGraphic className="w-28 h-24 sm:w-36 sm:h-30" />;
      case 'bookshelf_nook':
        return <BookshelfGraphic className="w-24 h-28 sm:w-30 sm:h-36" />;
      case 'star_telescope':
        return <TelescopeGraphic className="w-24 h-28 sm:w-28 sm:h-32" />;
      case 'stuffed_bear':
        return <TeddyBearGraphic className="w-20 h-24 sm:w-24 sm:h-28" />;
      case 'wooden_train':
        return (
          <div className={isTrainChugging ? 'animate-bounce-subtle' : ''}>
            <WoodenTrainGraphic className="w-28 h-18 sm:w-36 sm:h-22" />
          </div>
        );
      case 'phonics_desk':
        return <PhonicsDeskGraphic className="w-28 h-28 sm:w-34 sm:h-34" />;
      case 'secret_tent':
      case 'play_tent':
        return <SecretTentGraphic className="w-28 h-32 sm:w-36 sm:h-36" />;
      case 'treehouse_hammock':
        return <HammockGraphic className="w-36 h-22 sm:w-40 sm:h-22" />;
      case 'potted_plant':
        return <PottedPlantGraphic className="w-20 h-24 sm:w-22 sm:h-26" />;
      case 'retro_tv':
        return <RetroTvGraphic className="w-26 h-26 sm:w-30 sm:h-30" isPlaying={isTvPlaying} />;
      case 'lava_lamp':
        return <LavaLampGraphic className="w-16 h-26 sm:w-18 sm:h-30" colorIndex={lavaLampColorIndex} />;
      case 'neon_star':
        return <NeonStarGraphic className="w-22 h-26 sm:w-26 sm:h-30" />;
      case 'glowing_aquarium':
        return <AquariumGraphic className="w-28 h-24 sm:w-34 sm:h-30" />;
      case 'retro_jukebox':
        return <JukeboxGraphic className="w-26 h-30 sm:w-30 sm:h-34" />;
      case 'fairy_lights':
        return <FairyLightsGraphic className="w-48 h-12" />;
      case 'disco_ball':
        return <DiscoBallGraphic className="w-24 h-28" />;
      case 'magic_wand_toy':
        return <MagicWandGraphic className="w-20 h-24" />;
      case 'rainbow_rug':
        return <RainbowRugGraphic className="w-56 h-24 sm:w-64 sm:h-26" />;
      default:
        return (
          <div className="px-3 py-2 bg-amber-50 border-3 border-amber-950 rounded-2xl shadow-cartoon-sm flex items-center gap-2">
            <span className="text-3xl">{item.icon}</span>
            <span className="font-display font-bold text-xs text-amber-950">{item.name}</span>
          </div>
        );
    }
  };

  const handleItemTap = (item: TreehouseItem, wasDrag: boolean) => {
    if (wasDrag) return;
    if (item.id === 'retro_tv') return toggleRetroTv();
    if (item.id === 'lava_lamp') return cycleLavaLamp();
    if (item.id === 'wooden_train') return startTrainChug();
    if (item.id === 'disco_ball') return triggerDiscoEffect();
    soundService.playPopSound();
    speakAndInspect(item.name, item.soundText || item.description);
  };

  /**
   * Everything standing in the room, ordered back-to-front. Sorting by y as
   * well as setting z-index means equal-depth items still resolve in a stable
   * order, and an item dragged toward the bottom of the screen moves in front
   * of whatever it passes.
   */
  const entities = useMemo(() => {
    const list: Array<{
      key: string;
      point: RoomPoint;
      band: RoomBand;
      zIndex: number;
      node: React.ReactNode;
    }> = [];

    placedItems.forEach((item) => {
      const band = getItemBand(item.id);
      const saved = savedLayout.get(item.id) ?? getDefaultSlot(item.id);
      const point = positionFor(item.id, saved);
      const isRug = FLAT_FLOOR_ITEMS.has(item.id);
      const isBeingDragged = draggingItemId === item.id;

      list.push({
        key: item.id,
        point,
        band,
        zIndex: isBeingDragged ? 99 : depthZIndex(point, band, isRug),
        node: (
          <div
            className={`relative flex flex-col items-center bg-transparent ${
              canDrag ? 'cursor-grab' : 'cursor-pointer'
            } ${isBeingDragged ? 'room-item-dragging scale-105' : ''}`}
            onPointerDown={(event) => handlePointerDown(event, item.id, point)}
            onPointerMove={(event) => handlePointerMove(event, band)}
            onPointerUp={(event) => {
              const wasDrag = handlePointerUp(event);
              handleItemTap(item, wasDrag);
            }}
            onPointerCancel={(event) => handlePointerUp(event)}
          >
            {/* Ground contact shadow — skipped for rugs (already flat) and for
                anything mounted on the wall or ceiling. */}
            {band === 'floor' && !isRug && (
              <div className="absolute bottom-0 w-20 sm:w-24 h-4 bg-black/45 rounded-[50%] blur-[3px] pointer-events-none" />
            )}

            <div className="relative bg-transparent transition-transform duration-200 hover:-translate-y-1">
              {renderFurnitureGraphic(item)}
            </div>

            {/* Only the item under the finger gets a label — a badge on all
                twelve items at once buries the room. */}
            {isBeingDragged && (
              <span className="mt-0.5 bg-emerald-400 text-amber-950 border-2 border-amber-950 font-display font-black text-[9px] px-2 py-0.5 rounded-full shadow-cartoon-sm whitespace-nowrap">
                {item.name}
              </span>
            )}
          </div>
        ),
      });
    });

    // Pets roam fixed spots on the floor but still take part in depth sorting.
    currentProfile.unlockedPets.forEach((pet, index) => {
      const point = PET_SLOTS[index % PET_SLOTS.length];
      const emoticon = petEmoticons[pet.id];

      list.push({
        key: `pet-${pet.id}`,
        point,
        band: 'floor',
        zIndex: depthZIndex(point, 'floor'),
        node: (
          <button
            type="button"
            className="relative flex flex-col items-center bg-transparent group/pet"
            onClick={() => {
              soundService.playSuccessChime();
              speakAndInspect(`${pet.name} the ${pet.species}`, `${pet.name} says: ${pet.description}`);
            }}
          >
            {emoticon && (
              <span className="absolute -top-9 bg-amber-50 text-lg px-2 py-0.5 rounded-full border-2 border-amber-950 shadow-cartoon-sm animate-bounce">
                {emoticon}
              </span>
            )}
            <div className="absolute bottom-0 w-14 h-3.5 bg-black/45 rounded-[50%] blur-[2px] pointer-events-none" />
            <div className="animate-bounce-subtle transition-transform group-hover/pet:scale-110">
              <RoomPetGraphic species={pet.species} className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <span className="opacity-0 group-hover/pet:opacity-100 transition-opacity bg-emerald-500 text-amber-950 border-2 border-amber-950 font-display font-black text-[9px] px-2 py-0.5 rounded-full shadow-cartoon-sm whitespace-nowrap">
              {pet.name}
            </span>
          </button>
        ),
      });
    });

    // The child's avatar — draggable like furniture, under a reserved id.
    const avatarSaved = savedLayout.get(AVATAR_LAYOUT_ID) ?? DEFAULT_AVATAR_SLOT;
    const avatarPoint = positionFor(AVATAR_LAYOUT_ID, avatarSaved);
    const avatarDragging = draggingItemId === AVATAR_LAYOUT_ID;

    list.push({
      key: 'avatar',
      point: avatarPoint,
      band: 'floor',
      zIndex: avatarDragging ? 99 : depthZIndex(avatarPoint, 'floor'),
      node: (
        <div
          className={`relative flex flex-col items-center bg-transparent ${
            canDrag ? 'cursor-grab' : 'cursor-pointer'
          } ${avatarDragging ? 'room-item-dragging' : ''}`}
          onPointerDown={(event) => handlePointerDown(event, AVATAR_LAYOUT_ID, avatarPoint)}
          onPointerMove={(event) => handlePointerMove(event, 'floor')}
          onPointerUp={(event) => {
            const wasDrag = handlePointerUp(event);
            if (wasDrag) return;
            soundService.playSuccessChime();
            speakAndInspect(
              `${currentProfile.name}'s Avatar`,
              `Hi! I'm ${currentProfile.name}! Welcome to my treehouse!`
            );
          }}
          onPointerCancel={(event) => handlePointerUp(event)}
        >
          <div className="absolute bottom-6 w-24 sm:w-28 h-5 bg-black/50 rounded-[50%] blur-[4px] pointer-events-none" />
          <RoomAvatarCharacter
            name={currentProfile.name}
            avatarIcon={currentProfile.avatar}
            equippedHatId={currentProfile.equippedHat}
            equippedOutfitId={currentProfile.equippedOutfit}
            equippedAccessoryId={currentProfile.equippedAccessory}
            className="w-28 h-40 sm:w-34 sm:h-48"
          />

          {/* Name tag tucked against the character's feet. */}
          <div className="-mt-3 bg-amber-50 text-amber-950 border-3 border-amber-950 font-display font-black text-xs px-3 py-0.5 rounded-full shadow-cartoon-sm flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
            <span>{currentProfile.name}</span>
            {equippedHatItem && <span>{equippedHatItem.icon}</span>}
          </div>
        </div>
      ),
    });

    return list.sort((a, b) => a.point.y - b.point.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    placedItems,
    savedLayout,
    positionFor,
    draggingItemId,
    canDrag,
    currentProfile,
    petEmoticons,
    isTvPlaying,
    isTrainChugging,
    lavaLampColorIndex,
    equippedHatItem,
  ]);

  return (
    <div
      ref={stageRef}
      className="room-stage relative w-full h-[440px] sm:h-[500px] rounded-3xl border-4 border-amber-950 overflow-hidden shadow-cartoon-lg bg-amber-950"
    >
      {/* ============ ROOM SHELL ============ */}

      {/* Back wall: log courses, drawn in CSS so no asset can fail to load. */}
      <div className="room-wall-logs absolute inset-x-0 top-0 h-[56%]" />

      {/* Wall wash for the current time of day. */}
      <div
        className={`absolute inset-x-0 top-0 h-[56%] transition-colors duration-700 ${theme.wall}`}
      />

      {/* Circular window, centred on the back wall. */}
      <button
        type="button"
        onClick={() => {
          const next = TIME_ORDER[(TIME_ORDER.indexOf(timeOfDay) + 1) % TIME_ORDER.length];
          changeTimeOfDay(next);
        }}
        title="Click the window to change the time of day"
        className="absolute left-1/2 -translate-x-1/2 top-[14%] w-36 h-36 sm:w-44 sm:h-44 rounded-full border-[10px] border-amber-950 overflow-hidden shadow-[inset_0_6px_18px_rgba(0,0,0,0.55)] z-[6]"
      >
        {/* Sky */}
        <span className={`absolute inset-0 transition-colors duration-700 ${theme.sky}`} />

        {/* Sun, for the daylight modes */}
        {timeOfDay !== 'night' && (
          <span
            className={`absolute rounded-full blur-[1px] ${
              timeOfDay === 'daytime'
                ? 'top-4 right-6 w-10 h-10 bg-yellow-200'
                : timeOfDay === 'morning'
                ? 'bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-100'
                : 'bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-yellow-200'
            }`}
          />
        )}

        {/* Crescent moon: a bright disc with an offset sky-coloured disc
            carving the crescent out of it. */}
        {timeOfDay === 'night' && (
          <span className="absolute top-5 right-6 w-11 h-11">
            <span className="absolute inset-0 rounded-full bg-yellow-100 shadow-[0_0_18px_6px_rgba(254,240,138,0.55)]" />
            <span className="absolute -top-1 -right-2 w-10 h-10 rounded-full bg-indigo-950" />
          </span>
        )}

        {/* Stars */}
        {timeOfDay === 'night' &&
          WINDOW_STARS.map((star, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-yellow-50 animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
              }}
            />
          ))}

        {/* Distant forest canopy across the bottom of the view */}
        <span
          className={`absolute -bottom-3 inset-x-0 h-14 rounded-t-[100%] ${
            timeOfDay === 'night' ? 'bg-emerald-950' : 'bg-emerald-700'
          }`}
        />
        <span
          className={`absolute -bottom-2 -left-2 h-10 w-16 rounded-t-[100%] ${
            timeOfDay === 'night' ? 'bg-emerald-900' : 'bg-emerald-600'
          }`}
        />

        {/* Window muntins */}
        <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[5px] bg-amber-950/80" />
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[5px] bg-amber-950/80" />
      </button>

      {/* Floor: a separate plane tilted in 3D so the plank seams converge
          instead of meeting the wall at a flat horizontal line. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[52%] z-[2]"
        style={{ perspective: '900px', perspectiveOrigin: 'center top' }}
      >
        <div
          className="room-floor-planks absolute inset-x-[-30%] top-0 h-[200%] origin-top"
          style={{ transform: 'rotateX(64deg)' }}
        />

      </div>

      {/* Skirting board: makes the wall-to-floor join a deliberate edge rather
          than the flat seam this room used to have. */}
      <div className="absolute inset-x-0 top-[52%] -translate-y-full h-3 z-[5] bg-gradient-to-b from-amber-800 to-amber-950 border-y-2 border-amber-950/70 pointer-events-none" />

      {/* Placement grid, shown only while decorating. It shares the floor's 3D
          transform so the guide lines recede with the room, and sits above the
          floor wash so it stays readable at every time of day. */}
      {canDrag && (
        <div
          className="absolute inset-x-0 bottom-0 h-[52%] z-[6] pointer-events-none"
          style={{ perspective: '900px', perspectiveOrigin: 'center top' }}
        >
          <div
            className="absolute inset-x-[-30%] top-0 h-[200%] origin-top"
            style={{
              transform: 'rotateX(64deg)',
              backgroundImage:
                'repeating-linear-gradient(to right, rgba(253,224,71,0.7) 0 2px, transparent 2px 110px), repeating-linear-gradient(to bottom, rgba(253,224,71,0.7) 0 2px, transparent 2px 110px)',
            }}
          />
        </div>
      )}

      {/* Floor wash for the current time of day. */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[52%] z-[3] transition-colors duration-700 ${theme.floor}`}
      />

      {/* Soft contact shading where floor meets wall. */}
      <div className="room-baseboard-blend absolute inset-x-0 top-[48%] h-16 z-[4] pointer-events-none" />

      {/* ============ PLACED ITEMS, PETS, AVATAR ============ */}
      {entities.map((entity) => (
        <div
          key={entity.key}
          style={{
            left: `${entity.point.x * 100}%`,
            top: `${entity.point.y * 100}%`,
            zIndex: entity.zIndex,
          }}
          className="absolute -translate-x-1/2 -translate-y-full bg-transparent"
        >
          {entity.node}
        </div>
      ))}

      {/* ============ AMBIENT LIGHT ============
          Sits above the furniture (which tops out at z 99) but below the HUD,
          so the time of day tints the whole scene rather than only the shell. */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 z-[55] ${theme.ambient}`}
      />

      {activeSpecialEffect === 'disco' && (
        <div className="absolute inset-0 pointer-events-none z-[45] flex flex-wrap justify-around items-center opacity-80 animate-spin-slow">
          <span className="text-4xl drop-shadow-[0_0_12px_rgba(253,224,71,1)]">✨</span>
          <span className="text-4xl drop-shadow-[0_0_12px_rgba(244,114,182,1)]">💖</span>
          <span className="text-4xl drop-shadow-[0_0_12px_rgba(103,232,249,1)]">⭐</span>
          <span className="text-4xl drop-shadow-[0_0_12px_rgba(192,132,252,1)]">✨</span>
        </div>
      )}

      {/* ============ NEUBRUTALIST HUD ============ */}
      <div className="absolute top-3 inset-x-3 z-[60] flex items-start justify-between gap-2">
        {/* Time of day */}
        <div className="flex items-center gap-1 bg-amber-50 border-4 border-amber-950 p-1.5 rounded-2xl shadow-cartoon">
          {TIME_ORDER.map((key) => {
            const option = TIME_THEMES[key];
            const isActive = timeOfDay === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => changeTimeOfDay(key)}
                title={option.label}
                aria-label={option.label}
                aria-pressed={isActive}
                className={`p-1.5 rounded-xl border-3 border-amber-950 transition-transform ${
                  isActive
                    ? `${option.swatch} scale-105 shadow-cartoon-sm`
                    : 'bg-amber-50 hover:bg-amber-200'
                }`}
              >
                <option.Icon className="w-4 h-4 text-amber-950" strokeWidth={2.5} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {canDrag && (
            <button
              type="button"
              onClick={() => {
                onResetRoomLayout();
                soundService.speak('Furniture back to its starting spots!');
              }}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-200 border-4 border-amber-950 rounded-xl shadow-cartoon-sm font-display font-black text-xs text-amber-950 flex items-center gap-1.5"
              title="Put every item back where it started"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Child safety lock */}
          <button
            type="button"
            onClick={() => {
              const nowUnlocked = isSafetyLocked;
              setIsSafetyLocked(!isSafetyLocked);
              if (!nowUnlocked) setIsDecorateMode(false);
              soundService.playBoopSound();
              soundService.speak(nowUnlocked ? 'Decorating unlocked!' : 'Room locked so nothing moves.');
            }}
            className={`px-2.5 py-1.5 border-4 border-amber-950 rounded-xl shadow-cartoon-sm font-display font-black text-xs text-amber-950 flex items-center gap-1.5 ${
              isSafetyLocked ? 'bg-amber-200 hover:bg-amber-300' : 'bg-emerald-400'
            }`}
          >
            {isSafetyLocked ? (
              <Lock className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <Unlock className="w-4 h-4" strokeWidth={2.5} />
            )}
            <span className="hidden sm:inline">{isSafetyLocked ? 'Locked' : 'Unlocked'}</span>
          </button>

          {/* Decorate mode */}
          <button
            type="button"
            onClick={() => {
              if (isSafetyLocked) {
                soundService.playBoopSound();
                soundService.speak('Tap the lock first to start decorating!');
                return;
              }
              const next = !isDecorateMode;
              setIsDecorateMode(next);
              soundService.playSuccessChime();
              soundService.speak(
                next ? 'Decorate mode! Drag your furniture anywhere.' : 'All done decorating!'
              );
            }}
            className={`px-3 py-1.5 border-4 border-amber-950 rounded-xl shadow-cartoon-sm font-display font-black text-xs text-amber-950 flex items-center gap-1.5 transition-transform ${
              isDecorateMode ? 'bg-emerald-400 scale-102' : 'bg-yellow-400 hover:bg-yellow-300'
            } ${isSafetyLocked ? 'opacity-60' : ''}`}
          >
            <Move className="w-4 h-4" strokeWidth={2.5} />
            <span>{isDecorateMode ? 'Done' : 'Decorate'}</span>
          </button>
        </div>
      </div>

      {/* Decorate-mode helper strip */}
      {canDrag && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[60] bg-amber-50 border-4 border-amber-950 rounded-2xl px-3 py-1.5 shadow-cartoon-sm">
          <span className="font-display font-black text-[11px] text-amber-950">
            Drag any item — things nearer the front go on top!
          </span>
        </div>
      )}
    </div>
  );
};
