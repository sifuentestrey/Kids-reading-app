import React from 'react';

/**
 * Shared art kit for the treehouse room.
 *
 * Everything in the room is drawn from these primitives so the whole scene
 * shares one projection, one light direction, and one palette. That shared
 * system — not the amount of detail in any single object — is what separates a
 * cohesive game room from clip art pasted onto a background.
 *
 * Rules this kit enforces:
 *
 * 1. ONE PROJECTION. Objects are built from isometric boxes, so every object
 *    shows a top face and two side faces at the same angle as every other
 *    object. A shape drawn face-on will always read as a sticker no matter how
 *    well it is shaded.
 * 2. ONE LIGHT. The light comes from the upper left. Top faces are lightest,
 *    left faces mid, right faces darkest. Never shade an object to taste.
 * 3. NO OUTLINES. Forms read through value contrast, the way Club Penguin and
 *    Nicktropolis art does. A near-black stroke around a shape is the single
 *    strongest clip-art tell. Where two same-toned shapes must separate, use a
 *    darker tone of the same material, never black.
 * 4. MUTED PALETTE. Warm, slightly desaturated. Saturated primaries read as
 *    children's clip art rather than as a cosy room.
 */

/* ------------------------------------------------------------------ *
 * Projection
 * ------------------------------------------------------------------ */

/** Half-height of the isometric grid: a 2:1 dimetric, the classic game look. */
const V_SCALE = 0.5;

/**
 * Project isometric grid coordinates to screen space.
 * u runs right-and-down, v runs left-and-down, h runs straight up.
 */
export const iso = (u: number, v: number, h = 0) => ({
  x: (u - v),
  y: (u + v) * V_SCALE - h,
});

const pt = (p: { x: number; y: number }) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
const poly = (...points: { x: number; y: number }[]) => points.map(pt).join(' ');

/* ------------------------------------------------------------------ *
 * Palette
 * ------------------------------------------------------------------ */

export interface Material {
  /** Upward face — catches the most light. */
  top: string;
  /** Left-facing face — mid tone. */
  left: string;
  /** Right-facing face — darkest. */
  right: string;
}

export const MAT: Record<string, Material> = {
  pine: { top: '#E3BD8A', left: '#C79A65', right: '#A27445' },
  oak: { top: '#CFA26C', left: '#B5854F', right: '#8F6337' },
  walnut: { top: '#A9764A', left: '#8B5C34', right: '#6B4525' },
  cream: { top: '#F7EAD1', left: '#E9D6B4', right: '#D3BC98' },
  coral: { top: '#E79486', left: '#CE7264', right: '#A9544A' },
  teal: { top: '#84C6C1', left: '#63A6A4', right: '#468083' },
  sky: { top: '#95BCE9', left: '#7098CE', right: '#5077A9' },
  leaf: { top: '#94C56C', left: '#72A650', right: '#548438' },
  butter: { top: '#F5D57E', left: '#E2BB59', right: '#C39B3C' },
  plum: { top: '#B694CB', left: '#9873AE', right: '#77568B' },
  slate: { top: '#DBE0E5', left: '#BBC4CB', right: '#95A2AA' },
  charcoal: { top: '#4A555F', left: '#3A444C', right: '#2B333A' },
};

/** Warm shadow colour — never pure black, which reads as a hole. */
export const SHADOW = '#3B2413';

/* ------------------------------------------------------------------ *
 * Shared gradients + soft shading
 * ------------------------------------------------------------------ */

/**
 * Overlays that give every face a soft falloff, so surfaces feel like moulded
 * plastic rather than flat vector fills. Mount once per SVG.
 */
export const ArtDefs: React.FC<{ idPrefix: string }> = ({ idPrefix }) => (
  <defs>
    <linearGradient id={`${idPrefix}-sheen`} x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
      <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.06" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
    <linearGradient id={`${idPrefix}-fade`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={SHADOW} stopOpacity="0" />
      <stop offset="100%" stopColor={SHADOW} stopOpacity="0.28" />
    </linearGradient>
    <radialGradient id={`${idPrefix}-blob`} cx="0.35" cy="0.3" r="0.8">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
      <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.04" />
      <stop offset="100%" stopColor={SHADOW} stopOpacity="0.22" />
    </radialGradient>
    <radialGradient id={`${idPrefix}-contact`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor={SHADOW} stopOpacity="0.42" />
      <stop offset="65%" stopColor={SHADOW} stopOpacity="0.2" />
      <stop offset="100%" stopColor={SHADOW} stopOpacity="0" />
    </radialGradient>
  </defs>
);

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

interface IsoBoxProps {
  /** Grid origin: the box's rear-top corner. */
  u: number;
  v: number;
  /** Base height off the floor. */
  h?: number;
  /** Extents along u, v, and up. */
  w: number;
  d: number;
  th: number;
  material: Material;
  idPrefix: string;
  /** Rounded look for soft objects: shrinks the top face slightly. */
  bevel?: number;
  opacity?: number;
}

/**
 * The workhorse: an isometric box with a lit top face, a mid-tone left face and
 * a dark right face, plus a soft sheen so it doesn't read as flat vector.
 */
export const IsoBox: React.FC<IsoBoxProps> = ({
  u,
  v,
  h = 0,
  w,
  d,
  th,
  material,
  idPrefix,
  bevel = 0,
  opacity = 1,
}) => {
  const topH = h + th;

  // Top face, optionally inset to suggest a rounded edge.
  const b = bevel;
  const topFace = poly(
    iso(u + b, v + b, topH),
    iso(u + w - b, v + b, topH),
    iso(u + w - b, v + d - b, topH),
    iso(u + b, v + d - b, topH)
  );

  // Right-facing side (constant u = u + w).
  const rightFace = poly(
    iso(u + w, v, topH),
    iso(u + w, v + d, topH),
    iso(u + w, v + d, h),
    iso(u + w, v, h)
  );

  // Left-facing side (constant v = v + d).
  const leftFace = poly(
    iso(u, v + d, topH),
    iso(u + w, v + d, topH),
    iso(u + w, v + d, h),
    iso(u, v + d, h)
  );

  return (
    <g opacity={opacity}>
      <polygon points={rightFace} fill={material.right} />
      <polygon points={leftFace} fill={material.left} />
      <polygon points={leftFace} fill={`url(#${idPrefix}-fade)`} />
      <polygon points={topFace} fill={material.top} />
      <polygon points={topFace} fill={`url(#${idPrefix}-sheen)`} />
    </g>
  );
};

/**
 * An isometric cylinder — legs, posts, mugs, plant pots. Reads as a rounded
 * body plus an elliptical lit cap.
 */
export const IsoCylinder: React.FC<{
  u: number;
  v: number;
  h?: number;
  r: number;
  th: number;
  material: Material;
  idPrefix: string;
  taper?: number;
}> = ({ u, v, h = 0, r, th, material, idPrefix, taper = 1 }) => {
  const base = iso(u, v, h);
  const cap = iso(u, v, h + th);
  const rTop = r * taper;

  return (
    <g>
      {/* Body: a rounded tube between the two ellipse centres. */}
      <path
        d={`M ${base.x - r} ${base.y}
            L ${cap.x - rTop} ${cap.y}
            A ${rTop} ${rTop * V_SCALE} 0 0 1 ${cap.x + rTop} ${cap.y}
            L ${base.x + r} ${base.y}
            A ${r} ${r * V_SCALE} 0 0 1 ${base.x - r} ${base.y} Z`}
        fill={material.left}
      />
      <path
        d={`M ${base.x} ${base.y} L ${cap.x} ${cap.y} L ${cap.x + rTop} ${cap.y}
            L ${base.x + r} ${base.y} A ${r} ${r * V_SCALE} 0 0 1 ${base.x} ${base.y} Z`}
        fill={material.right}
        opacity="0.85"
      />
      <ellipse cx={cap.x} cy={cap.y} rx={rTop} ry={rTop * V_SCALE} fill={material.top} />
      <ellipse
        cx={cap.x}
        cy={cap.y}
        rx={rTop}
        ry={rTop * V_SCALE}
        fill={`url(#${idPrefix}-sheen)`}
      />
    </g>
  );
};

/**
 * Soft contact shadow. Every object needs one or it floats; it is offset
 * down-right because the light is upper-left.
 */
export const ContactShadow: React.FC<{
  u: number;
  v: number;
  rx: number;
  idPrefix: string;
  opacity?: number;
}> = ({ u, v, rx, idPrefix, opacity = 1 }) => {
  const c = iso(u, v, 0);
  return (
    <ellipse
      cx={c.x + rx * 0.12}
      cy={c.y + 1.5}
      rx={rx}
      ry={rx * V_SCALE * 0.72}
      fill={`url(#${idPrefix}-contact)`}
      opacity={opacity}
    />
  );
};

/**
 * Transform that lays flat content — text, a letter card, a label — onto an
 * object's left-facing plane so it shares the room's projection.
 *
 * Lettering is where the projection is easiest to break: a letter centred on a
 * shape as ordinary upright text reads as a sticker on the face, which
 * undoes the box it is drawn on. Wrapping it in this transform shears it onto
 * the plane instead, so the letter recedes with the object.
 *
 * The left face (constant v) runs along u and h. A local point (lx, ly), with ly
 * measured downward, sits at u + lx and h - ly, which projects to
 * (base.x + lx, base.y + lx * V_SCALE + ly) — hence matrix(1, V_SCALE, 0, 1).
 *
 * @param u  Grid u of the local origin.
 * @param v  The face's constant v — the object's front edge.
 * @param h  Height of the local origin off the floor.
 */
export const leftFaceTransform = (u: number, v: number, h: number) => {
  const o = iso(u, v, h);
  return `matrix(1 ${V_SCALE} 0 1 ${o.x.toFixed(2)} ${o.y.toFixed(2)})`;
};

/** A flat panel lying on the floor — rugs, mats, floor cushions. */
export const IsoFloorPanel: React.FC<{
  u: number;
  v: number;
  w: number;
  d: number;
  fill: string;
  opacity?: number;
}> = ({ u, v, w, d, fill, opacity = 1 }) => (
  <polygon
    points={poly(iso(u, v), iso(u + w, v), iso(u + w, v + d), iso(u, v + d))}
    fill={fill}
    opacity={opacity}
  />
);

/**
 * Rim light along an object's upper-left silhouette. A single bright arc does
 * more to make a shape feel three-dimensional than any amount of interior
 * detail.
 */
export const RimLight: React.FC<{ d: string; width?: number; opacity?: number }> = ({
  d,
  width = 2,
  opacity = 0.5,
}) => (
  <path
    d={d}
    fill="none"
    stroke="#FFF6E4"
    strokeWidth={width}
    strokeLinecap="round"
    opacity={opacity}
  />
);

export { poly, V_SCALE };
