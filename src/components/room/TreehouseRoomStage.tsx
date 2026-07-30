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
import { RoomShell, TimeOfDay } from './RoomShell';
import { Sun, Moon, Sunset, Sunrise, Move, Lock, Unlock, RotateCcw } from 'lucide-react';

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
 * Per-time-of-day data the stage still owns: the label and voiceover line, the
 * HUD swatch, and the room-wide ambient wash that tints the furniture along with
 * the shell. The sky, window view and surface lighting live in RoomShell.
 */
const TIME_THEMES: Record<
  TimeOfDay,
  { label: string; speech: string; ambient: string; Icon: typeof Sun; swatch: string }
> = {
  morning: {
    label: 'Sunrise',
    speech: 'Sunrise! Warm morning light is filling the treehouse.',
    ambient: 'bg-gradient-to-br from-orange-300/18 via-transparent to-amber-900/10',
    Icon: Sunrise,
    swatch: 'bg-orange-300',
  },
  daytime: {
    label: 'Daytime',
    speech: 'Bright sunny daytime in the treehouse!',
    ambient: 'bg-gradient-to-b from-sky-100/8 via-transparent to-amber-950/8',
    Icon: Sun,
    swatch: 'bg-sky-300',
  },
  sunset: {
    label: 'Sunset',
    speech: 'Golden hour! The whole treehouse glows orange and pink.',
    ambient: 'bg-gradient-to-br from-rose-500/22 via-amber-500/8 to-indigo-950/22',
    Icon: Sunset,
    swatch: 'bg-rose-400',
  },
  night: {
    label: 'Night',
    speech: 'Starry night! Time for cosy bedtime stories.',
    ambient: 'bg-gradient-to-b from-indigo-950/45 via-slate-900/30 to-slate-950/40',
    Icon: Moon,
    swatch: 'bg-indigo-400',
  },
};

const TIME_ORDER: TimeOfDay[] = ['morning', 'daytime', 'sunset', 'night'];

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
        return <TreehouseBedGraphic className="w-44 h-44 sm:w-52 sm:h-52" />;
      case 'comfy_couch':
        return <ComfyCouchGraphic className="w-44 h-34 sm:w-52 sm:h-40" />;
      case 'bookshelf_nook':
        return <BookshelfGraphic className="w-32 h-40 sm:w-40 sm:h-48" />;
      case 'star_telescope':
        return <TelescopeGraphic className="w-30 h-34 sm:w-36 sm:h-40" />;
      case 'stuffed_bear':
        return <TeddyBearGraphic className="w-26 h-30 sm:w-30 sm:h-36" />;
      case 'wooden_train':
        return (
          <div className={isTrainChugging ? 'animate-bounce-subtle' : ''}>
            <WoodenTrainGraphic className="w-40 h-24 sm:w-48 sm:h-28" />
          </div>
        );
      case 'phonics_desk':
        return <PhonicsDeskGraphic className="w-40 h-40 sm:w-48 sm:h-48" />;
      case 'secret_tent':
      case 'play_tent':
        return <SecretTentGraphic className="w-40 h-44 sm:w-48 sm:h-52" />;
      case 'treehouse_hammock':
        return <HammockGraphic className="w-48 h-26 sm:w-56 sm:h-30" />;
      case 'potted_plant':
        return <PottedPlantGraphic className="w-26 h-32 sm:w-30 sm:h-36" />;
      case 'retro_tv':
        return <RetroTvGraphic className="w-36 h-36 sm:w-44 sm:h-44" isPlaying={isTvPlaying} />;
      case 'lava_lamp':
        return <LavaLampGraphic className="w-20 h-32 sm:w-24 sm:h-36" colorIndex={lavaLampColorIndex} />;
      case 'neon_star':
        return <NeonStarGraphic className="w-26 h-30 sm:w-32 sm:h-34" />;
      case 'glowing_aquarium':
        return <AquariumGraphic className="w-40 h-32 sm:w-48 sm:h-40" />;
      case 'retro_jukebox':
        return <JukeboxGraphic className="w-34 h-40 sm:w-40 sm:h-48" />;
      case 'fairy_lights':
        return <FairyLightsGraphic className="w-64 h-16" />;
      case 'disco_ball':
        return <DiscoBallGraphic className="w-30 h-36" />;
      case 'magic_wand_toy':
        return <MagicWandGraphic className="w-24 h-30" />;
      case 'rainbow_rug':
        return <RainbowRugGraphic className="w-72 h-32 sm:w-80 sm:h-36" />;
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
              <RoomPetGraphic species={pet.species} className="w-20 h-20 sm:w-24 sm:h-24" />
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
            className="w-32 h-44 sm:w-36 sm:h-52"
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
      {/* ============ ROOM SHELL ============
          One SVG drawing the whole room in perspective: walls, ceiling beams,
          floor, window, and trim. See RoomShell.tsx for the geometry contract
          it shares with roomLayout's floor band. */}
      <RoomShell timeOfDay={timeOfDay} />

      {/* Clickable window: the art lives in RoomShell, this is just the hit
          target sitting over it. Its geometry mirrors the shell's viewBox —
          circle at (500,168) r=96 of 1000x560. */}
      <button
        type="button"
        onClick={() => {
          const next = TIME_ORDER[(TIME_ORDER.indexOf(timeOfDay) + 1) % TIME_ORDER.length];
          changeTimeOfDay(next);
        }}
        title="Click the window to change the time of day"
        aria-label="Change the time of day"
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-[30%] w-[19.2%] h-[34.3%] rounded-full z-[6] hover:bg-amber-50/10 transition-colors"
      />

      {/* Placement grid, shown only while decorating. It matches the shell's
          floor: lines run from the wall base out to the front edge, so the guide
          recedes with the room instead of lying flat across it. */}
      {canDrag && (
        <svg
          viewBox="0 0 1000 560"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full z-[6] pointer-events-none"
        >
          {Array.from({ length: 9 }, (_, i) => {
            const t = i / 8;
            return (
              <line
                key={`g-${i}`}
                x1={150 + t * 700}
                y1={300}
                x2={-120 + t * 1240}
                y2={560}
                stroke="#FDE047"
                strokeWidth="2"
                opacity="0.55"
              />
            );
          })}
          {[0.12, 0.3, 0.52, 0.78].map((t, i) => {
            const y = 300 + t * 260;
            const spread = t * 150;
            return (
              <line
                key={`gc-${i}`}
                x1={150 - spread}
                y1={y}
                x2={850 + spread}
                y2={y}
                stroke="#FDE047"
                strokeWidth="2"
                opacity="0.55"
              />
            );
          })}
        </svg>
      )}

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
