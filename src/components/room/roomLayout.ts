/**
 * Shared spatial model for the 2.5D treehouse room.
 *
 * Everything positional lives here so that App.tsx (persistence + migration),
 * the drag hook, and the stage renderer all agree on one coordinate space:
 * x = 0..1 left-to-right, y = 0..1 back-to-front. y is also the depth key —
 * anything with a larger y is nearer the viewer and draws on top.
 */

export type RoomBand = 'ceiling' | 'wall' | 'floor';

export interface RoomPoint {
  x: number;
  y: number;
}

/** Vertical extent of each band in stage-fraction terms. */
/**
 * Vertical extent of each band, in stage fractions. An item's y is the position
 * of its *base*, so these bounds keep hanging items clear of the HUD strip
 * across the top and keep wall items from sliding onto the floor.
 */
export const BAND_BOUNDS: Record<RoomBand, { minY: number; maxY: number }> = {
  ceiling: { minY: 0.15, maxY: 0.3 },
  wall: { minY: 0.3, maxY: 0.5 },
  floor: { minY: 0.54, maxY: 0.94 },
};

/** Horizontal inset so items can't be dragged half-off the room. */
const MIN_X = 0.07;
const MAX_X = 0.93;

/**
 * Which band each item belongs to. Anything unlisted is treated as floor
 * furniture, which is the safe default for newly added shop items.
 */
export const ITEM_BANDS: Record<string, RoomBand> = {
  fairy_lights: 'ceiling',
  disco_ball: 'ceiling',
  treehouse_hammock: 'ceiling',
  bookshelf_nook: 'wall',
  star_telescope: 'wall',
  glowing_aquarium: 'wall',
  neon_star: 'wall',
};

export const getItemBand = (itemId: string): RoomBand => ITEM_BANDS[itemId] ?? 'floor';

/**
 * Default resting place for every known item, used for first placement and to
 * seed the layout of rooms saved before positions were persisted.
 */
export const DEFAULT_ITEM_SLOTS: Record<string, RoomPoint> = {
  // Ceiling / hanging — clear of the HUD strip along the top
  fairy_lights: { x: 0.5, y: 0.19 },
  disco_ball: { x: 0.32, y: 0.22 },
  treehouse_hammock: { x: 0.72, y: 0.28 },

  // Wall-mounted, standing just above the floor line
  bookshelf_nook: { x: 0.08, y: 0.46 },
  star_telescope: { x: 0.87, y: 0.48 },
  glowing_aquarium: { x: 0.28, y: 0.44 },
  neon_star: { x: 0.72, y: 0.42 },

  // Floor — back half
  treehouse_bed: { x: 0.24, y: 0.62 },
  secret_tent: { x: 0.82, y: 0.64 },
  play_tent: { x: 0.82, y: 0.64 },
  retro_jukebox: { x: 0.62, y: 0.6 },

  // Floor — mid
  rainbow_rug: { x: 0.5, y: 0.72 },
  comfy_couch: { x: 0.26, y: 0.7 },
  retro_tv: { x: 0.75, y: 0.68 },
  lava_lamp: { x: 0.9, y: 0.66 },

  // Floor — front. The desk sits on the right rather than under the bed: both
  // pieces are tall — a canopy frame and a hutch — so stacking them at the same
  // x buried the desk behind the bed at the default arrangement.
  phonics_desk: { x: 0.8, y: 0.82 },
  stuffed_bear: { x: 0.38, y: 0.82 },
  wooden_train: { x: 0.66, y: 0.86 },
  potted_plant: { x: 0.95, y: 0.72 },
  magic_wand_toy: { x: 0.44, y: 0.88 },
};

/** Where the child's avatar stands by default — front and centre, clear of the
 *  window on the back wall. */
export const DEFAULT_AVATAR_SLOT: RoomPoint = { x: 0.5, y: 0.82 };

/** Where unlocked pets roam, in placement order. */
export const PET_SLOTS: RoomPoint[] = [
  { x: 0.36, y: 0.72 },
  { x: 0.64, y: 0.76 },
  { x: 0.8, y: 0.7 },
];

export const getDefaultSlot = (itemId: string): RoomPoint =>
  DEFAULT_ITEM_SLOTS[itemId] ?? { x: 0.5, y: 0.6 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Keep a dragged item inside the room, and inside its own band. */
export const clampToBand = (point: RoomPoint, band: RoomBand): RoomPoint => {
  const { minY, maxY } = BAND_BOUNDS[band];
  return {
    x: clamp(point.x, MIN_X, MAX_X),
    y: clamp(point.y, minY, maxY),
  };
};

/**
 * Depth ordering. Bands stack (ceiling behind wall behind floor) and within the
 * floor band y decides who overlaps whom, so an item dragged toward the bottom
 * of the screen moves in front of what it passes. Rugs are special-cased flat
 * to the floor so furniture always sits on top of them.
 */
export const depthZIndex = (point: RoomPoint, band: RoomBand, isRug = false): number => {
  if (isRug) return 5;
  switch (band) {
    case 'ceiling':
      return 40 + Math.round(point.y * 5);
    case 'wall':
      return 10 + Math.round(point.y * 8);
    case 'floor':
    default:
      return 20 + Math.round(point.y * 70);
  }
};

/** Items drawn flat on the floor rather than standing on it. */
export const FLAT_FLOOR_ITEMS = new Set(['rainbow_rug']);
