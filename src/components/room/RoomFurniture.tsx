import React from 'react';
import { ArtDefs, ContactShadow, IsoBox, IsoCylinder, MAT, RimLight, iso } from './artKit';

/**
 * Isometric furniture for the treehouse room.
 *
 * Every piece is built from the artKit primitives, which means every piece
 * shares one projection, one light direction (upper left) and one muted palette.
 * See artKit.tsx for the rules — in particular, no near-black outlines and no
 * face-on shapes.
 *
 * Each graphic gets its own `idPrefix` so the shared gradient ids stay unique
 * when several graphics are mounted at once.
 */

interface GraphicProps {
  className?: string;
  isPlaying?: boolean;
  colorIndex?: number;
}

/** Common wrapper: transparent, no padding, no card chrome. */
const Sprite: React.FC<{
  className?: string;
  viewBox: string;
  children: React.ReactNode;
}> = ({ className, viewBox, children }) => (
  <div className={`relative bg-transparent p-0 m-0 border-0 ${className ?? ''}`}>
    <svg viewBox={viewBox} className="w-full h-full overflow-visible bg-transparent">
      {children}
    </svg>
  </div>
);

/* ================================================================== *
 * BEDS & SEATING
 * ================================================================== */

export const TreehouseBedGraphic: React.FC<GraphicProps> = ({ className = 'w-36 h-36' }) => {
  const p = 'bed';
  return (
    <Sprite className={className} viewBox="-90 -120 180 170">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={22} rx={62} idPrefix={p} />

      {/* Bed frame: a low box with a mattress slab on top */}
      <IsoBox u={-30} v={-18} w={60} d={36} th={8} material={MAT.walnut} idPrefix={p} />
      <IsoBox u={-29} v={-17} h={8} w={58} d={34} th={9} material={MAT.cream} idPrefix={p} bevel={1.5} />

      {/* Quilt covering the lower two thirds, tucked in at the sides */}
      <IsoBox u={-29} v={-3} h={17} w={58} d={20} th={3.5} material={MAT.teal} idPrefix={p} bevel={1} />
      {/* Quilt stitching, following the top face's angle */}
      {[-20, -8, 4, 16].map((u) => (
        <line
          key={u}
          x1={iso(u, -2, 20.5).x}
          y1={iso(u, -2, 20.5).y}
          x2={iso(u, 16, 20.5).x}
          y2={iso(u, 16, 20.5).y}
          stroke="#468083"
          strokeWidth="1.2"
          opacity="0.55"
        />
      ))}

      {/* Pillows */}
      <IsoBox u={-25} v={-14} h={17} w={22} d={12} th={5} material={MAT.cream} idPrefix={p} bevel={2.5} />
      <IsoBox u={0} v={-14} h={17} w={22} d={12} th={5} material={MAT.coral} idPrefix={p} bevel={2.5} />

      {/* Four corner posts */}
      {[
        [-30, -18],
        [30, -18],
        [-30, 18],
        [30, 18],
      ].map(([u, v]) => (
        <IsoCylinder key={`${u}-${v}`} u={u} v={v} r={3.4} th={46} material={MAT.oak} idPrefix={p} />
      ))}

      {/*
        Pitched canopy roof. A flat slab on posts reads as a table, so the canopy
        is built as two sloped panels meeting at a ridge: the left panel catches
        the light, the right falls away, and the gable end closes the shape.
      */}
      {(() => {
        const ridgeH = 68;
        const eaveH = 46;
        const ridgeBack = iso(0, -21, ridgeH);
        const ridgeFront = iso(0, 21, ridgeH);
        const eaveLB = iso(-33, -21, eaveH);
        const eaveLF = iso(-33, 21, eaveH);
        const eaveRB = iso(33, -21, eaveH);
        const eaveRF = iso(33, 21, eaveH);

        return (
          <g>
            {/* Right slope — away from the light */}
            <polygon
              points={`${ridgeBack.x},${ridgeBack.y} ${ridgeFront.x},${ridgeFront.y} ${eaveRF.x},${eaveRF.y} ${eaveRB.x},${eaveRB.y}`}
              fill={MAT.coral.right}
            />
            {/* Left slope — lit */}
            <polygon
              points={`${ridgeBack.x},${ridgeBack.y} ${ridgeFront.x},${ridgeFront.y} ${eaveLF.x},${eaveLF.y} ${eaveLB.x},${eaveLB.y}`}
              fill={MAT.coral.left}
            />
            {/* Front gable */}
            <polygon
              points={`${ridgeFront.x},${ridgeFront.y} ${eaveLF.x},${eaveLF.y} ${eaveRF.x},${eaveRF.y}`}
              fill={MAT.coral.top}
            />
            {/* Scalloped valance hanging off the front eaves */}
            <path
              d={`M ${eaveLF.x} ${eaveLF.y}
                  q 8 9 16 0 q 8 9 16 0 q 8 9 16 0 q 8 9 16 0
                  L ${eaveRF.x} ${eaveRF.y} Z`}
              fill={MAT.cream.left}
            />
            <RimLight
              d={`M ${eaveLB.x} ${eaveLB.y} L ${ridgeBack.x} ${ridgeBack.y}`}
              opacity={0.4}
            />
          </g>
        );
      })()}
    </Sprite>
  );
};

export const ComfyCouchGraphic: React.FC<GraphicProps> = ({ className = 'w-36 h-30' }) => {
  const p = 'couch';
  return (
    <Sprite className={className} viewBox="-90 -80 180 130">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={16} rx={56} idPrefix={p} />

      {/* Base, seat cushions, backrest, arms — all one material family so the
          couch reads as a single upholstered object. */}
      <IsoBox u={-32} v={-14} w={64} d={28} th={9} material={MAT.coral} idPrefix={p} bevel={1} />
      <IsoBox u={-30} v={-12} h={9} w={28} d={24} th={7} material={MAT.coral} idPrefix={p} bevel={2.5} />
      <IsoBox u={2} v={-12} h={9} w={28} d={24} th={7} material={MAT.coral} idPrefix={p} bevel={2.5} />
      <IsoBox u={-32} v={-16} h={9} w={64} d={7} th={24} material={MAT.coral} idPrefix={p} bevel={1} />
      <IsoBox u={-36} v={-14} h={9} w={6} d={28} th={16} material={MAT.coral} idPrefix={p} bevel={1.5} />
      <IsoBox u={30} v={-14} h={9} w={6} d={28} th={16} material={MAT.coral} idPrefix={p} bevel={1.5} />

      {/* Two throw cushions for a spot of contrast */}
      <IsoBox u={-24} v={-11} h={16} w={13} d={11} th={4} material={MAT.butter} idPrefix={p} bevel={2} />
      <IsoBox u={12} v={-11} h={16} w={13} d={11} th={4} material={MAT.teal} idPrefix={p} bevel={2} />

      {/* Feet */}
      {[[-30, 12], [26, 12]].map(([u, v]) => (
        <IsoCylinder key={u} u={u} v={v} r={2.6} th={5} material={MAT.walnut} idPrefix={p} />
      ))}
    </Sprite>
  );
};

export const HammockGraphic: React.FC<GraphicProps> = ({ className = 'w-40 h-22' }) => {
  const p = 'hammock';
  return (
    <Sprite className={className} viewBox="-100 -60 200 110">
      <ArtDefs idPrefix={p} />
      {/* Slung cloth: a deep curve, lit along its upper rim */}
      <path
        d="M -74 -22 Q 0 46 74 -22 Q 0 8 -74 -22 Z"
        fill={MAT.teal.left}
      />
      <path d="M -74 -22 Q 0 40 74 -22 Q 0 2 -74 -22 Z" fill={MAT.teal.top} opacity="0.55" />
      <RimLight d="M -74 -22 Q 0 8 74 -22" opacity={0.4} />
      {/* Ropes gathered to each end */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={`M ${74 * s} -22 L ${88 * s} -44`} stroke={MAT.cream.right} strokeWidth="2.5" fill="none" />
          <path d={`M ${60 * s} -18 L ${88 * s} -44`} stroke={MAT.cream.right} strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx={88 * s} cy={-44} r="4" fill={MAT.walnut.left} />
        </g>
      ))}
    </Sprite>
  );
};

export const SecretTentGraphic: React.FC<GraphicProps> = ({ className = 'w-36 h-36' }) => {
  const p = 'tent';
  return (
    <Sprite className={className} viewBox="-90 -110 180 160">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={20} rx={54} idPrefix={p} />

      {/* A cone tent: two lit panels meeting at a ridge, so it reads as volume
          rather than as a flat triangle. */}
      <path d={`M 0 -84 L ${iso(34, 34).x} ${iso(34, 34).y} L ${iso(-34, 34).x} ${iso(-34, 34).y} Z`} fill={MAT.plum.right} />
      <path d={`M 0 -84 L ${iso(-34, 34).x} ${iso(-34, 34).y} L ${iso(-34, -34).x} ${iso(-34, -34).y} Z`} fill={MAT.plum.left} />
      <path d={`M 0 -84 L ${iso(-34, -34).x} ${iso(-34, -34).y} L ${iso(34, -34).x} ${iso(34, -34).y} Z`} fill={MAT.plum.top} />
      <RimLight d={`M 0 -84 L ${iso(-34, -34).x} ${iso(-34, -34).y}`} opacity={0.3} />

      {/* Doorway, opening onto the dark interior */}
      <path d="M -14 34 Q -14 -18 0 -30 Q 14 -18 14 34 Z" fill="#3A2A46" />
      <path d="M -14 34 Q -12 -12 0 -26 L 0 34 Z" fill="#4A3757" />

      {/* Pennant */}
      <path d="M 0 -84 L 0 -100 L 20 -92 L 0 -86 Z" fill={MAT.butter.left} />
      <circle cx="0" cy="-84" r="4.5" fill={MAT.butter.top} />
    </Sprite>
  );
};

/* ================================================================== *
 * STORAGE & SURFACES
 * ================================================================== */

export const BookshelfGraphic: React.FC<GraphicProps> = ({ className = 'w-30 h-36' }) => {
  const p = 'shelf';
  const books = [
    [MAT.coral, 5, 13], [MAT.teal, 4, 11], [MAT.butter, 5, 14], [MAT.plum, 4, 12],
    [MAT.sky, 5, 10], [MAT.leaf, 4, 13],
  ] as const;

  return (
    <Sprite className={className} viewBox="-80 -130 160 170">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={14} rx={42} idPrefix={p} />

      {/* Carcass */}
      <IsoBox u={-26} v={-11} w={52} d={22} th={78} material={MAT.walnut} idPrefix={p} />
      {/* Recessed interior, darker than the carcass so the shelves read as deep */}
      <IsoBox u={-23} v={-11} h={4} w={46} d={18} th={70} material={MAT.oak} idPrefix={p} opacity={0.85} />

      {/* Two shelf boards with books standing on them */}
      {[8, 40].map((baseH, row) => (
        <g key={baseH}>
          <IsoBox u={-23} v={-11} h={baseH} w={46} d={18} th={3} material={MAT.pine} idPrefix={p} />
          {books.slice(row * 3, row * 3 + 3).map(([mat, w, bh], i) => (
            <IsoBox
              key={i}
              u={-19 + i * 13}
              v={-8}
              h={baseH + 3}
              w={w}
              d={12}
              th={bh}
              material={mat}
              idPrefix={p}
            />
          ))}
        </g>
      ))}

      {/* Top board and a small plant to break the silhouette */}
      <IsoBox u={-27} v={-12} h={78} w={54} d={24} th={4} material={MAT.pine} idPrefix={p} />
      <IsoCylinder u={12} v={0} h={82} r={6} th={8} material={MAT.coral} idPrefix={p} taper={0.8} />
      <ellipse cx={iso(12, 0, 92).x} cy={iso(12, 0, 92).y} rx="11" ry="8" fill={MAT.leaf.left} />
      <ellipse cx={iso(12, 0, 94).x - 3} cy={iso(12, 0, 94).y - 3} rx="7" ry="5" fill={MAT.leaf.top} />
    </Sprite>
  );
};

export const PhonicsDeskGraphic: React.FC<GraphicProps> = ({ className = 'w-34 h-34' }) => {
  const p = 'desk';
  return (
    <Sprite className={className} viewBox="-90 -100 180 150">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={18} rx={50} idPrefix={p} />

      {/* Legs, then the top, so the top overlaps them correctly */}
      {[[-26, -12], [22, -12], [-26, 12], [22, 12]].map(([u, v]) => (
        <IsoBox key={`${u}-${v}`} u={u} v={v} w={4} d={4} th={30} material={MAT.walnut} idPrefix={p} />
      ))}
      <IsoBox u={-30} v={-16} h={30} w={60} d={36} th={5} material={MAT.pine} idPrefix={p} bevel={1} />

      {/* An open book on the desk, angled with the surface */}
      <IsoBox u={-16} v={-8} h={35} w={30} d={18} th={2} material={MAT.cream} idPrefix={p} bevel={0.5} />
      <line
        x1={iso(-1, -8, 37).x}
        y1={iso(-1, -8, 37).y}
        x2={iso(-1, 10, 37).x}
        y2={iso(-1, 10, 37).y}
        stroke={MAT.cream.right}
        strokeWidth="1.5"
      />

      {/* Globe: sphere with a light-side highlight and a brass ring */}
      <circle cx={iso(20, -2, 46).x} cy={iso(20, -2, 46).y} r="12" fill={MAT.sky.left} />
      <circle cx={iso(20, -2, 46).x - 3} cy={iso(20, -2, 46).y - 4} r="8.5" fill={MAT.sky.top} opacity="0.75" />
      <path d="M -2 -8 Q 6 -14 12 -6" fill={MAT.leaf.left} opacity="0.8" transform={`translate(${iso(20, -2, 46).x - 5} ${iso(20, -2, 46).y})`} />
      <ellipse cx={iso(20, -2, 46).x} cy={iso(20, -2, 46).y} rx="13.5" ry="4" fill="none" stroke={MAT.butter.left} strokeWidth="2" />
      <IsoCylinder u={20} v={-2} h={35} r={4} th={4} material={MAT.butter} idPrefix={p} />
    </Sprite>
  );
};

export const RainbowRugGraphic: React.FC<GraphicProps> = ({ className = 'w-52 h-22' }) => {
  const p = 'rug';
  // Concentric isometric ovals: a rug is the one object that is genuinely flat,
  // so it is drawn as ellipses on the ground plane.
  const rings = [
    [64, '#C4574B'],
    [52, '#E39A4A'],
    [40, '#5FA5A3'],
    [28, '#6E97CD'],
    [15, '#F0DCB4'],
  ] as const;

  return (
    <Sprite className={className} viewBox="-80 -40 160 80">
      <ArtDefs idPrefix={p} />
      {rings.map(([r, fill]) => (
        <ellipse key={r} cx="0" cy="0" rx={r} ry={r * 0.5} fill={fill} />
      ))}
      {/* Soft pile: a light sheen across the near half so it isn't a flat disc */}
      <ellipse cx="0" cy="0" rx="64" ry="32" fill={`url(#${p}-sheen)`} />
    </Sprite>
  );
};

/* ================================================================== *
 * TOYS
 * ================================================================== */

export const TeddyBearGraphic: React.FC<GraphicProps> = ({ className = 'w-28 h-32' }) => {
  const p = 'bear';
  const fur = { light: '#D9A468', mid: '#BE8850', dark: '#9A6A3A' };
  const muzzle = '#EBD3A8';

  return (
    <Sprite className={className} viewBox="-60 -100 120 140">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={16} rx={34} idPrefix={p} />

      {/* Legs, body, arms, head — soft forms, shaded from upper left, no strokes */}
      <ellipse cx="-17" cy="18" rx="14" ry="11" fill={fur.dark} />
      <ellipse cx="17" cy="18" rx="14" ry="11" fill={fur.dark} />
      <ellipse cx="-17" cy="16" rx="11" ry="8" fill={muzzle} opacity="0.5" />
      <ellipse cx="17" cy="16" rx="11" ry="8" fill={muzzle} opacity="0.5" />

      <ellipse cx="0" cy="-8" rx="27" ry="29" fill={fur.mid} />
      <ellipse cx="-6" cy="-16" rx="20" ry="20" fill={fur.light} opacity="0.55" />
      <ellipse cx="0" cy="0" rx="16" ry="16" fill={muzzle} opacity="0.45" />

      <ellipse cx="-28" cy="-14" rx="10" ry="13" fill={fur.dark} transform="rotate(-18 -28 -14)" />
      <ellipse cx="28" cy="-14" rx="10" ry="13" fill={fur.dark} transform="rotate(18 28 -14)" />

      {/* Ears behind the head */}
      <circle cx="-21" cy="-64" r="10" fill={fur.dark} />
      <circle cx="21" cy="-64" r="10" fill={fur.dark} />
      <circle cx="-21" cy="-65" r="5.5" fill={muzzle} opacity="0.7" />
      <circle cx="21" cy="-65" r="5.5" fill={muzzle} opacity="0.7" />

      <circle cx="0" cy="-52" r="25" fill={fur.mid} />
      <circle cx="-7" cy="-59" r="18" fill={fur.light} opacity="0.6" />
      <ellipse cx="0" cy="-44" rx="14" ry="11" fill={muzzle} />

      {/* Face: simple and warm. Two dots and a stitch read friendlier than
          detailed eyes at this size. */}
      <circle cx="-9" cy="-56" r="3.2" fill="#4A3520" />
      <circle cx="9" cy="-56" r="3.2" fill="#4A3520" />
      <circle cx="-10" cy="-57" r="1.1" fill="#FFFFFF" opacity="0.9" />
      <circle cx="8" cy="-57" r="1.1" fill="#FFFFFF" opacity="0.9" />
      <ellipse cx="0" cy="-47" rx="4" ry="3" fill="#7A5330" />
      <path d="M -4 -41 Q 0 -37 4 -41" stroke="#7A5330" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Ribbon */}
      <path d="M -13 -30 Q 0 -25 13 -30 Q 0 -22 -13 -30 Z" fill={MAT.coral.left} />
      <circle cx="0" cy="-28" r="4" fill={MAT.coral.top} />

      <RimLight d="M -24 -66 Q -30 -46 -24 -30" width={2.5} opacity={0.32} />
    </Sprite>
  );
};

export const WoodenTrainGraphic: React.FC<GraphicProps> = ({ className = 'w-36 h-22' }) => {
  const p = 'train';
  const cars = [
    { u: -34, mat: MAT.coral, letter: 'A' },
    { u: -10, mat: MAT.teal, letter: 'B' },
    { u: 14, mat: MAT.butter, letter: 'C' },
  ];

  return (
    <Sprite className={className} viewBox="-90 -70 180 100">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={10} rx={52} idPrefix={p} />

      {/* Engine */}
      <IsoBox u={-56} v={-8} h={4} w={22} d={16} th={12} material={MAT.walnut} idPrefix={p} bevel={0.5} />
      <IsoCylinder u={-50} v={0} h={16} r={4} th={10} material={MAT.charcoal} idPrefix={p} />
      <IsoBox u={-40} v={-7} h={4} w={8} d={14} th={20} material={MAT.oak} idPrefix={p} bevel={0.5} />

      {/* Alphabet blocks on flatbed cars */}
      {cars.map(({ u, mat, letter }) => (
        <g key={letter}>
          <IsoBox u={u} v={-8} h={4} w={20} d={16} th={4} material={MAT.oak} idPrefix={p} />
          <IsoBox u={u + 3} v={-5} h={8} w={14} d={10} th={13} material={mat} idPrefix={p} bevel={0.5} />
          <text
            x={iso(u + 10, -5, 14).x}
            y={iso(u + 10, -5, 14).y + 4}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#FFF6E4"
            opacity="0.95"
          >
            {letter}
          </text>
        </g>
      ))}

      {/* Wheels: dark discs with a light catch, sitting under each car */}
      {[-52, -44, -30, -22, -6, 2, 18, 26].map((u) => (
        <g key={u}>
          <circle cx={iso(u, 4, 4).x} cy={iso(u, 4, 4).y} r="4.5" fill={MAT.charcoal.left} />
          <circle cx={iso(u, 4, 4).x - 1} cy={iso(u, 4, 4).y - 1} r="1.8" fill={MAT.slate.top} opacity="0.7" />
        </g>
      ))}
    </Sprite>
  );
};

export const TelescopeGraphic: React.FC<GraphicProps> = ({ className = 'w-30 h-36' }) => {
  const p = 'scope';
  return (
    <Sprite className={className} viewBox="-70 -110 140 150">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={14} rx={34} idPrefix={p} />

      {/* Tripod legs splayed in three directions */}
      {[[-22, 16], [22, 16], [0, -18]].map(([dx, dy], i) => (
        <path
          key={i}
          d={`M 0 -34 L ${dx} ${dy}`}
          stroke={i === 2 ? MAT.walnut.right : MAT.walnut.left}
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      <circle cx="0" cy="-34" r="6" fill={MAT.walnut.top} />

      {/* Brass barrel, angled up at the window. Brass rather than grey steel:
          warm metal sits inside the room's palette, and grey read as a sword. */}
      <g transform="rotate(-34 0 -40)">
        <rect x="-10" y="-92" width="20" height="58" rx="10" fill={MAT.butter.left} />
        <rect x="-10" y="-92" width="8" height="58" rx="4" fill={MAT.butter.top} opacity="0.85" />
        <rect x="4" y="-92" width="6" height="58" rx="3" fill={MAT.butter.right} opacity="0.8" />
        {/* Barrel bands */}
        <rect x="-11" y="-76" width="22" height="5" rx="2.5" fill={MAT.walnut.left} />
        <rect x="-11" y="-52" width="22" height="5" rx="2.5" fill={MAT.walnut.left} />
        {/* Objective lens */}
        <ellipse cx="0" cy="-92" rx="10" ry="4.5" fill={MAT.walnut.right} />
        <ellipse cx="0" cy="-92" rx="6.5" ry="2.8" fill="#8FB8E8" opacity="0.85" />
        {/* Eyepiece at the low end */}
        <rect x="-5" y="-34" width="10" height="12" rx="4" fill={MAT.walnut.left} />
      </g>

      <circle cx="30" cy="-88" r="3" fill="#FFF3C4" opacity="0.9" />
      <circle cx="38" cy="-76" r="1.8" fill="#FFF3C4" opacity="0.7" />
    </Sprite>
  );
};

export const MagicWandGraphic: React.FC<GraphicProps> = ({ className = 'w-20 h-24' }) => {
  const p = 'wand';
  return (
    <Sprite className={className} viewBox="-50 -80 100 110">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={8} rx={18} idPrefix={p} />
      {/* Stand, wand, star */}
      <IsoCylinder u={0} v={0} r={12} th={5} material={MAT.walnut} idPrefix={p} taper={0.85} />
      <rect x="-3" y="-56" width="6" height="56" rx="3" fill={MAT.cream.left} />
      <rect x="-3" y="-56" width="2.5" height="56" rx="1.2" fill={MAT.cream.top} />
      <path
        d="M 0 -78 L 6 -63 L 22 -61 L 10 -50 L 13 -34 L 0 -42 L -13 -34 L -10 -50 L -22 -61 L -6 -63 Z"
        fill={MAT.butter.left}
      />
      <path d="M 0 -78 L 6 -63 L 0 -60 Z" fill={MAT.butter.top} />
      <circle cx="0" cy="-58" r="4" fill="#FFF6E4" opacity="0.85" />
    </Sprite>
  );
};

/* ================================================================== *
 * DECOR & GADGETS
 * ================================================================== */

export const PottedPlantGraphic: React.FC<GraphicProps> = ({ className = 'w-22 h-26' }) => {
  const p = 'plant';
  const fronds = [
    [0, -68, 0], [-20, -54, -38], [20, -54, 38], [-13, -64, -18], [13, -64, 18],
  ] as const;

  return (
    <Sprite className={className} viewBox="-55 -90 110 120">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={12} rx={26} idPrefix={p} />

      {/* Fronds behind the pot, each a tapered leaf with a lighter centre */}
      {fronds.map(([x, y, rot], i) => (
        <g key={i} transform={`rotate(${rot} 0 -14)`}>
          <path d={`M 0 -14 Q ${x * 0.5} ${y * 0.7} ${x * 0.2} ${y}`} stroke={MAT.leaf.left} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d={`M 0 -14 Q ${x * 0.5} ${y * 0.7} ${x * 0.2} ${y}`} stroke={MAT.leaf.top} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>
      ))}

      <IsoCylinder u={0} v={0} r={17} th={20} material={MAT.coral} idPrefix={p} taper={1.15} />
      {/* Soil */}
      <ellipse cx={iso(0, 0, 20).x} cy={iso(0, 0, 20).y} rx="19" ry="9.5" fill="#5B4030" />
      <ellipse cx={iso(0, 0, 20).x - 3} cy={iso(0, 0, 20).y - 1} rx="13" ry="6" fill="#6B4A2A" opacity="0.8" />
    </Sprite>
  );
};

export const RetroTvGraphic: React.FC<GraphicProps> = ({ className = 'w-30 h-30', isPlaying = false }) => {
  const p = 'tv';
  return (
    <Sprite className={className} viewBox="-80 -100 160 140">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={16} rx={44} idPrefix={p} />

      {/* Console cabinet the set stands on */}
      <IsoBox u={-30} v={-14} w={60} d={28} th={20} material={MAT.walnut} idPrefix={p} />
      {/* Set body */}
      <IsoBox u={-26} v={-11} h={20} w={52} d={22} th={40} material={MAT.oak} idPrefix={p} bevel={1} />

      {/* Screen: inset on the left-facing plane so it reads as recessed glass */}
      <polygon
        points={`${iso(-21, 11, 54).x},${iso(-21, 11, 54).y}
                 ${iso(21, 11, 54).x},${iso(21, 11, 54).y}
                 ${iso(21, 11, 24).x},${iso(21, 11, 24).y}
                 ${iso(-21, 11, 24).x},${iso(-21, 11, 24).y}`}
        fill={isPlaying ? '#7FC4C0' : MAT.charcoal.left}
      />
      {isPlaying && (
        <polygon
          points={`${iso(-21, 11, 54).x},${iso(-21, 11, 54).y}
                   ${iso(21, 11, 54).x},${iso(21, 11, 54).y}
                   ${iso(21, 11, 40).x},${iso(21, 11, 40).y}
                   ${iso(-21, 11, 40).x},${iso(-21, 11, 40).y}`}
          fill="#D9EEF9"
          opacity="0.55"
        />
      )}
      {/* Glass reflection sweeping across the screen */}
      <polygon
        points={`${iso(-19, 11, 52).x},${iso(-19, 11, 52).y}
                 ${iso(-7, 11, 52).x},${iso(-7, 11, 52).y}
                 ${iso(-15, 11, 26).x},${iso(-15, 11, 26).y}
                 ${iso(-21, 11, 26).x},${iso(-21, 11, 26).y}`}
        fill="#FFFFFF"
        opacity="0.12"
      />

      {/* Dials and rabbit-ear aerial */}
      <circle cx={iso(23, 11, 44).x} cy={iso(23, 11, 44).y} r="3.4" fill={MAT.butter.left} />
      <circle cx={iso(23, 11, 34).x} cy={iso(23, 11, 34).y} r="3.4" fill={MAT.butter.left} />
      <path d={`M ${iso(-6, 0, 58).x} ${iso(-6, 0, 58).y} L -34 -86`} stroke={MAT.slate.left} strokeWidth="3" strokeLinecap="round" />
      <path d={`M ${iso(6, 0, 58).x} ${iso(6, 0, 58).y} L 34 -86`} stroke={MAT.slate.left} strokeWidth="3" strokeLinecap="round" />
    </Sprite>
  );
};

export const LavaLampGraphic: React.FC<GraphicProps> = ({ className = 'w-18 h-30', colorIndex = 0 }) => {
  const p = 'lava';
  const palettes = [MAT.coral, MAT.teal, MAT.plum, MAT.butter];
  const glow = palettes[colorIndex % palettes.length];

  return (
    <Sprite className={className} viewBox="-45 -110 90 130">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={8} rx={20} idPrefix={p} />

      {/* Warm glow bleeding onto the surroundings */}
      <ellipse cx="0" cy="-46" rx="30" ry="40" fill={glow.top} opacity="0.14" />

      {/* Brass base */}
      <IsoCylinder u={0} v={0} r={17} th={12} material={MAT.butter} idPrefix={p} taper={0.72} />

      {/* Glass vessel: a bulb that swells low and necks in at the top, which is
          what makes a lava lamp read as one rather than as a cone. */}
      <path
        d="M -12 -12 C -17 -34 -14 -62 -6 -80 L 6 -80 C 14 -62 17 -34 12 -12 Z"
        fill={glow.left}
        opacity="0.9"
      />
      <path
        d="M -12 -12 C -17 -34 -14 -62 -6 -80 L -2 -80 C -7 -58 -6 -32 -5 -12 Z"
        fill={glow.top}
        opacity="0.65"
      />

      {/* Blobs, largest at the bottom where the lamp is hottest */}
      <ellipse cx="-1" cy="-26" rx="8" ry="10" fill={glow.top} />
      <ellipse cx="3" cy="-48" rx="5.5" ry="7" fill={glow.top} opacity="0.9" />
      <ellipse cx="-3" cy="-64" rx="3.5" ry="4.5" fill={glow.top} opacity="0.8" />

      {/* Highlight down the lit side of the glass */}
      <path d="M -8 -68 C -10 -44 -8 -26 -7 -18" stroke="#FFF6E4" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* Brass cap on top of the vessel */}
      <ellipse cx="0" cy="-80" rx="8" ry="4" fill={MAT.butter.left} />
      <path d="M -8 -80 L -5 -92 L 5 -92 L 8 -80 Z" fill={MAT.butter.left} />
      <path d="M -8 -80 L -5 -92 L 0 -92 L 0 -80 Z" fill={MAT.butter.top} />
      <ellipse cx="0" cy="-92" rx="5" ry="2.5" fill={MAT.butter.top} />
    </Sprite>
  );
};

export const NeonStarGraphic: React.FC<GraphicProps> = ({ className = 'w-26 h-30' }) => {
  const p = 'neon';
  return (
    <Sprite className={className} viewBox="-60 -70 120 110">
      <ArtDefs idPrefix={p} />
      <ellipse cx="0" cy="-14" rx="52" ry="42" fill="#FFE9B0" opacity="0.16" />
      <path
        d="M 0 -58 L 12 -22 L 50 -22 L 20 2 L 30 38 L 0 16 L -30 38 L -20 2 L -50 -22 L -12 -22 Z"
        fill={MAT.butter.left}
      />
      <path d="M 0 -58 L 12 -22 L 0 -16 Z" fill={MAT.butter.top} />
      <path
        d="M 0 -48 L 9 -20 L 38 -20 L 15 -2 L 23 26 L 0 10 L -23 26 L -15 -2 L -38 -20 L -9 -20 Z"
        fill="#FFF6E4"
        opacity="0.5"
      />
    </Sprite>
  );
};

export const AquariumGraphic: React.FC<GraphicProps> = ({ className = 'w-34 h-30' }) => {
  const p = 'tank';
  return (
    <Sprite className={className} viewBox="-85 -95 170 130">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={14} rx={48} idPrefix={p} />

      {/* Stand, then the water volume, then the glass over it */}
      <IsoBox u={-30} v={-13} w={60} d={26} th={14} material={MAT.walnut} idPrefix={p} />
      <IsoBox u={-27} v={-11} h={14} w={54} d={22} th={34} material={MAT.teal} idPrefix={p} opacity={0.85} />

      {/* Gravel along the tank floor */}
      <IsoBox u={-27} v={-11} h={14} w={54} d={22} th={5} material={MAT.oak} idPrefix={p} />

      {/* Fish and bubbles on the front pane */}
      <g>
        <ellipse cx="-14" cy="-30" rx="9" ry="6" fill={MAT.coral.left} />
        <path d="M -23 -30 L -30 -35 L -30 -25 Z" fill={MAT.coral.right} />
        <circle cx="-11" cy="-32" r="1.6" fill="#FFF6E4" />
        <ellipse cx="16" cy="-16" rx="7" ry="4.5" fill={MAT.butter.left} />
        <path d="M 23 -16 L 29 -20 L 29 -12 Z" fill={MAT.butter.right} />
      </g>
      {[[-2, -40, 2.5], [3, -50, 2], [-6, -56, 1.6]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity="0.4" />
      ))}

      {/* Glass: a pale sheet with one highlight streak, plus a lit rim */}
      <IsoBox u={-27} v={-11} h={14} w={54} d={22} th={34} material={MAT.slate} idPrefix={p} opacity={0.16} />
      <IsoBox u={-28} v={-12} h={47} w={56} d={24} th={3} material={MAT.slate} idPrefix={p} />
    </Sprite>
  );
};

export const JukeboxGraphic: React.FC<GraphicProps> = ({ className = 'w-30 h-34' }) => {
  const p = 'juke';
  return (
    <Sprite className={className} viewBox="-70 -110 140 150">
      <ArtDefs idPrefix={p} />
      <ContactShadow u={0} v={14} rx={38} idPrefix={p} />

      {/* Body with a domed top */}
      <IsoBox u={-24} v={-12} w={48} d={24} th={56} material={MAT.coral} idPrefix={p} bevel={1} />
      <path
        d={`M ${iso(-24, 12, 56).x} ${iso(-24, 12, 56).y}
            Q ${iso(0, 12, 84).x} ${iso(0, 12, 84).y} ${iso(24, 12, 56).x} ${iso(24, 12, 56).y}
            L ${iso(24, 12, 50).x} ${iso(24, 12, 50).y}
            Q ${iso(0, 12, 76).x} ${iso(0, 12, 76).y} ${iso(-24, 12, 50).x} ${iso(-24, 12, 50).y} Z`}
        fill={MAT.butter.left}
      />

      {/* Lit window and a record inside */}
      <polygon
        points={`${iso(-18, 12, 50).x},${iso(-18, 12, 50).y}
                 ${iso(18, 12, 50).x},${iso(18, 12, 50).y}
                 ${iso(18, 12, 26).x},${iso(18, 12, 26).y}
                 ${iso(-18, 12, 26).x},${iso(-18, 12, 26).y}`}
        fill={MAT.charcoal.left}
      />
      <circle cx={iso(0, 12, 38).x} cy={iso(0, 12, 38).y} r="11" fill={MAT.slate.right} />
      <circle cx={iso(0, 12, 38).x} cy={iso(0, 12, 38).y} r="3.5" fill={MAT.coral.top} />

      {/* Speaker grille and buttons */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={iso(-14, 12, 18 - i * 4).x}
          y1={iso(-14, 12, 18 - i * 4).y}
          x2={iso(14, 12, 18 - i * 4).x}
          y2={iso(14, 12, 18 - i * 4).y}
          stroke={MAT.cream.right}
          strokeWidth="2.5"
          opacity="0.7"
        />
      ))}
      <circle cx={iso(-8, 12, 6).x} cy={iso(-8, 12, 6).y} r="3" fill={MAT.teal.top} />
      <circle cx={iso(8, 12, 6).x} cy={iso(8, 12, 6).y} r="3" fill={MAT.butter.top} />
    </Sprite>
  );
};

export const FairyLightsGraphic: React.FC<GraphicProps> = ({ className = 'w-full h-12' }) => {
  const p = 'lights';
  const bulbs = [MAT.coral, MAT.butter, MAT.teal, MAT.sky, MAT.plum, MAT.leaf, MAT.coral, MAT.butter];

  return (
    <Sprite className={className} viewBox="0 0 240 52">
      <ArtDefs idPrefix={p} />
      {/* Cable slung in a catenary. The bulbs are sampled from this exact curve
          so they hang on the wire instead of near it. */}
      <path d="M 4 8 Q 120 52 236 8" stroke="#5B4030" strokeWidth="2.5" fill="none" />
      {bulbs.map((mat, i) => {
        const t = (i + 0.5) / bulbs.length;
        // Quadratic Bezier from (4,8) through control (120,52) to (236,8).
        const mt = 1 - t;
        const x = mt * mt * 4 + 2 * mt * t * 120 + t * t * 236;
        const y = mt * mt * 8 + 2 * mt * t * 52 + t * t * 8;
        return (
          <g key={i}>
            <circle cx={x} cy={y + 10} r="9" fill={mat.top} opacity="0.22" />
            <circle cx={x} cy={y + 9} r="4.6" fill={mat.left} />
            <circle cx={x - 1.4} cy={y + 7.6} r="1.8" fill="#FFF6E4" opacity="0.85" />
          </g>
        );
      })}
    </Sprite>
  );
};

export const DiscoBallGraphic: React.FC<GraphicProps> = ({ className = 'w-24 h-28' }) => {
  const p = 'disco';
  return (
    <Sprite className={className} viewBox="-50 -20 100 110">
      <ArtDefs idPrefix={p} />
      <line x1="0" y1="-18" x2="0" y2="14" stroke="#5B4030" strokeWidth="2.5" />
      <circle cx="0" cy="44" r="30" fill={MAT.slate.left} />
      <circle cx="0" cy="44" r="30" fill={`url(#${p}-blob)`} />
      {/* Facets: a light grid over the sphere, brighter toward the light */}
      {[-20, -10, 0, 10, 20].map((dy) => (
        <ellipse key={dy} cx="0" cy={44 + dy} rx={Math.sqrt(Math.max(900 - dy * dy, 0))} ry="4" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.22" />
      ))}
      {[-24, -12, 0, 12, 24].map((dx) => (
        <ellipse key={dx} cx={dx} cy="44" rx="5" ry={Math.sqrt(Math.max(900 - dx * dx, 0))} fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.22" />
      ))}
      <circle cx="-11" cy="33" r="7" fill="#FFF6E4" opacity="0.5" />
    </Sprite>
  );
};
