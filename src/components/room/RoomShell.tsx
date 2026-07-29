import React from 'react';

export type TimeOfDay = 'morning' | 'daytime' | 'sunset' | 'night';

/**
 * The room itself, drawn as a single one-point-perspective SVG box: back wall,
 * two side walls, a ceiling sliver with beams, and a floor whose planks converge
 * on the same vanishing point.
 *
 * Geometry notes
 * -------------
 * The viewBox is 1000x560 and renders with preserveAspectRatio="none" so the
 * shell stretches exactly like the stage's normalized 0..1 coordinate space.
 * That keeps the floor line at a fixed fraction of the stage height at every
 * viewport width, which is what lets placed items land on the floor rather than
 * drifting above or below it.
 *
 *   floor line (wall base) .... y = 300  -> 0.536 of the stage
 *   front edge ................ y = 560  -> 1.0
 *
 * Those match BAND_BOUNDS.floor in roomLayout.ts. Change one and you must
 * change the other.
 */

const FLOOR_Y = 300;
const WALL_TOP = 34;
const BACK_L = 150;
const BACK_R = 850;

interface SkyTheme {
  from: string;
  mid: string;
  to: string;
  /** Warm light spilling in through the window onto the floor. */
  shaft: string;
  shaftOpacity: number;
}

const SKY: Record<TimeOfDay, SkyTheme> = {
  morning: { from: '#5B7BB4', mid: '#E9A268', to: '#F6D9A8', shaft: '#FFD9A0', shaftOpacity: 0.3 },
  daytime: { from: '#6FB4E4', mid: '#A5D6F2', to: '#D9EEF9', shaft: '#FFF3D2', shaftOpacity: 0.26 },
  sunset: { from: '#4B4C86', mid: '#D9705F', to: '#F0B173', shaft: '#FFB877', shaftOpacity: 0.34 },
  night: { from: '#101A33', mid: '#1C2A4A', to: '#2A3B5C', shaft: '#9DBBE8', shaftOpacity: 0.14 },
};

/** Deterministic star field so the night sky doesn't reshuffle on every render. */
const STARS = [
  [-52, -46, 1.6], [18, -58, 1.2], [56, -30, 1.5], [-24, -20, 1.1],
  [40, 8, 1.3], [-64, 6, 1.2], [4, -34, 1.9], [70, -52, 1.1],
  [-38, 24, 1.2], [30, 40, 1.0],
] as const;

export const RoomShell: React.FC<{ timeOfDay: TimeOfDay }> = ({ timeOfDay }) => {
  const sky = SKY[timeOfDay];
  const isNight = timeOfDay === 'night';

  // Floor plank seams: each runs from a point on the wall base to a point on the
  // front edge, spreading as it approaches the viewer.
  const planks = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    const backX = BACK_L + t * (BACK_R - BACK_L);
    const frontX = -120 + t * (1000 + 240);
    return { backX, frontX };
  });

  return (
    <svg
      viewBox="0 0 1000 560"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        {/* Back wall: warmer and brighter near the window, falling off to the
            corners so the room feels lit from one place. */}
        <radialGradient id="shell-wallLight" cx="0.5" cy="0.42" r="0.68">
          <stop offset="0%" stopColor="#E8C79A" />
          <stop offset="55%" stopColor="#D2A87C" />
          <stop offset="100%" stopColor="#AD8253" />
        </radialGradient>

        <linearGradient id="shell-wallLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7A5330" />
          <stop offset="100%" stopColor="#A87B4C" />
        </linearGradient>

        {/* Floor: brightest just under the window, darkening toward the front
            corners where the light doesn't reach. */}
        <radialGradient id="shell-floorLight" cx="0.5" cy="0" r="0.95">
          <stop offset="0%" stopColor="#A9723F" />
          <stop offset="45%" stopColor="#905D31" />
          <stop offset="100%" stopColor="#6B4222" />
        </radialGradient>

        <linearGradient id="shell-sky" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={sky.from} />
          <stop offset="52%" stopColor={sky.mid} />
          <stop offset="100%" stopColor={sky.to} />
        </linearGradient>

        {/* Light spilling from the window across the floor. */}
        <linearGradient id="shell-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.shaft} stopOpacity={sky.shaftOpacity} />
          <stop offset="70%" stopColor={sky.shaft} stopOpacity={sky.shaftOpacity * 0.35} />
          <stop offset="100%" stopColor={sky.shaft} stopOpacity="0" />
        </linearGradient>

        <linearGradient id="shell-ceiling" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A331D" />
          <stop offset="100%" stopColor="#6B4A2A" />
        </linearGradient>

        {/* Soft ambient occlusion in the wall/floor crease. */}
        <linearGradient id="shell-crease" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B2413" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3B2413" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="shell-lampGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>

        <clipPath id="shell-windowClip">
          <circle cx="500" cy="168" r="82" />
        </clipPath>
      </defs>

      {/* ---------------- CEILING ---------------- */}
      <polygon points={`0,0 1000,0 ${BACK_R},${WALL_TOP} ${BACK_L},${WALL_TOP}`} fill="url(#shell-ceiling)" />
      {/* Two beams running back into the room */}
      <polygon points={`250,0 320,0 ${BACK_L + 232},${WALL_TOP} ${BACK_L + 190},${WALL_TOP}`} fill="#3E2B18" opacity="0.55" />
      <polygon points={`680,0 750,0 ${BACK_L + 510},${WALL_TOP} ${BACK_L + 468},${WALL_TOP}`} fill="#3E2B18" opacity="0.55" />

      {/* ---------------- SIDE WALLS ---------------- */}
      {/* Left wall catches the light; right wall falls away from it. */}
      <polygon points={`0,0 ${BACK_L},${WALL_TOP} ${BACK_L},${FLOOR_Y} 0,560`} fill="#C99C6E" />
      <polygon points={`0,0 ${BACK_L},${WALL_TOP} ${BACK_L},${FLOOR_Y} 0,560`} fill="url(#shell-crease)" opacity="0.35" />
      <polygon points={`1000,0 ${BACK_R},${WALL_TOP} ${BACK_R},${FLOOR_Y} 1000,560`} fill="#9A7148" />

      {/* Side-wall plank seams, converging with the room. */}
      {[0.25, 0.5, 0.75].map((t) => (
        <g key={`side-${t}`} opacity="0.22">
          <line x1={BACK_L * (1 - t)} y1={WALL_TOP * (1 - t)} x2={BACK_L * (1 - t)} y2={FLOOR_Y + (560 - FLOOR_Y) * t} stroke="#3B2413" strokeWidth="2" />
          <line x1={1000 - (1000 - BACK_R) * (1 - t)} y1={WALL_TOP * (1 - t)} x2={1000 - (1000 - BACK_R) * (1 - t)} y2={FLOOR_Y + (560 - FLOOR_Y) * t} stroke="#3B2413" strokeWidth="2" />
        </g>
      ))}

      {/* ---------------- BACK WALL ---------------- */}
      <rect x={BACK_L} y={WALL_TOP} width={BACK_R - BACK_L} height={FLOOR_Y - WALL_TOP} fill="url(#shell-wallLight)" />

      {/* Vertical log-plank seams: a dark groove with a light catch beside it, so
          the boards read as round timber rather than as stripes. */}
      {Array.from({ length: 14 }, (_, i) => {
        const x = BACK_L + ((i + 0.5) * (BACK_R - BACK_L)) / 14;
        return (
          <g key={`plank-${i}`}>
            <rect x={x - 1.5} y={WALL_TOP} width="3" height={FLOOR_Y - WALL_TOP} fill="#6B4A2A" opacity="0.4" />
            <rect x={x + 1.5} y={WALL_TOP} width="2" height={FLOOR_Y - WALL_TOP} fill="#E8C495" opacity="0.16" />
          </g>
        );
      })}

      {/* Knots, so the timber isn't mechanically uniform */}
      {[[268, 232], [612, 108], [742, 250], [352, 86]].map(([cx, cy], i) => (
        <ellipse key={`knot-${i}`} cx={cx} cy={cy} rx="7" ry="4.5" fill="#7A5330" opacity="0.4" />
      ))}

      {/* Painted wainscot along the lower wall — a colour anchor so the room
          isn't one continuous brown, and a horizontal line for the furniture to
          sit against. */}
      <rect x={BACK_L} y={FLOOR_Y - 78} width={BACK_R - BACK_L} height="62" fill="#5E8E86" />
      <rect x={BACK_L} y={FLOOR_Y - 78} width={BACK_R - BACK_L} height="8" fill="#7FB0A6" opacity="0.85" />
      <rect x={BACK_L} y={FLOOR_Y - 22} width={BACK_R - BACK_L} height="6" fill="#3F6B66" opacity="0.7" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = BACK_L + ((i + 0.5) * (BACK_R - BACK_L)) / 14;
        return <rect key={`wains-${i}`} x={x - 1} y={FLOOR_Y - 78} width="2" height="62" fill="#3F6B66" opacity="0.35" />;
      })}

      {/* ---------------- WINDOW ---------------- */}
      <g>
        {/* Frame, with an inner sill so the opening has thickness */}
        <circle cx="500" cy="168" r="96" fill="#6B4A2A" />
        <circle cx="500" cy="168" r="96" fill="url(#shell-crease)" opacity="0.5" />
        <circle cx="500" cy="170" r="88" fill="#8F6337" />
        <circle cx="500" cy="168" r="82" fill="url(#shell-sky)" />

        <g clipPath="url(#shell-windowClip)">
          {/* Sun or moon */}
          {!isNight && (
            <circle
              cx={timeOfDay === 'daytime' ? 540 : 500}
              cy={timeOfDay === 'daytime' ? 128 : 186}
              r={timeOfDay === 'daytime' ? 20 : 26}
              fill="#FFF3C4"
              opacity="0.95"
            />
          )}
          {isNight && (
            <g>
              <circle cx="538" cy="132" r="19" fill="#FBF3D0" />
              <circle cx="546" cy="126" r="16" fill="#1C2A4A" />
            </g>
          )}

          {/* Stars */}
          {isNight &&
            STARS.map(([dx, dy, r], i) => (
              <circle key={`star-${i}`} cx={500 + dx} cy={168 + dy} r={r} fill="#FFFDF2" opacity="0.9" />
            ))}

          {/* Distant tree canopy, layered for depth */}
          <ellipse cx="452" cy="238" rx="70" ry="34" fill={isNight ? '#16301F' : '#3F6B3A'} />
          <ellipse cx="556" cy="246" rx="78" ry="30" fill={isNight ? '#102618' : '#345C31'} />
          <ellipse cx="500" cy="256" rx="96" ry="26" fill={isNight ? '#0C1F13' : '#2C4E2A'} />
        </g>

        {/* Muntins, drawn as light bars with a shadow under each */}
        <rect x="497" y="86" width="7" height="164" fill="#8F6337" />
        <rect x="418" y="164" width="164" height="7" fill="#8F6337" />
        <rect x="497" y="86" width="2.5" height="164" fill="#C79A65" opacity="0.75" />
        <rect x="418" y="164" width="164" height="2.5" fill="#C79A65" opacity="0.75" />

        {/* Sill */}
        <polygon points="404,246 596,246 610,262 390,262" fill="#C79A65" />
        <polygon points="390,262 610,262 606,270 394,270" fill="#8F6337" />
      </g>

      {/* ---------------- FLOOR ---------------- */}
      <polygon points={`${BACK_L},${FLOOR_Y} ${BACK_R},${FLOOR_Y} 1000,560 0,560`} fill="url(#shell-floorLight)" />

      {/* Converging plank seams */}
      {planks.map((p, i) => (
        <g key={`floorplank-${i}`}>
          <line x1={p.backX} y1={FLOOR_Y} x2={p.frontX} y2="560" stroke="#4E2F16" strokeWidth="2.5" opacity="0.55" />
          <line x1={p.backX + 2} y1={FLOOR_Y} x2={p.frontX + 4} y2="560" stroke="#D9A96F" strokeWidth="1.5" opacity="0.22" />
        </g>
      ))}

      {/* Cross-boards, spaced wider as they come forward */}
      {[0.16, 0.38, 0.66, 1].map((t, i) => {
        const y = FLOOR_Y + t * (560 - FLOOR_Y);
        const spread = t * 150;
        return (
          <line
            key={`crossboard-${i}`}
            x1={BACK_L - spread}
            y1={y}
            x2={BACK_R + spread}
            y2={y}
            stroke="#4E2F16"
            strokeWidth="2"
            opacity="0.3"
          />
        );
      })}

      {/* Light pooling on the floor beneath the window */}
      <polygon points={`420,${FLOOR_Y} 580,${FLOOR_Y} 700,560 300,560`} fill="url(#shell-shaft)" />

      {/* ---------------- TRIM ---------------- */}
      {/* Skirting along the back wall, plus the returns down the side walls, and
          the ambient crease that keeps the join from reading as a hard seam. */}
      <rect x={BACK_L} y={FLOOR_Y - 16} width={BACK_R - BACK_L} height="16" fill="#8F6337" />
      <rect x={BACK_L} y={FLOOR_Y - 16} width={BACK_R - BACK_L} height="4" fill="#C79A65" opacity="0.7" />
      <polygon points={`0,536 ${BACK_L},${FLOOR_Y - 16} ${BACK_L},${FLOOR_Y} 0,560`} fill="#7A5330" />
      <polygon points={`1000,536 ${BACK_R},${FLOOR_Y - 16} ${BACK_R},${FLOOR_Y} 1000,560`} fill="#6B4A2A" />
      <rect x={BACK_L} y={FLOOR_Y} width={BACK_R - BACK_L} height="26" fill="url(#shell-crease)" />

      {/* Night lantern glow on the back wall, so the room isn't lit by nothing */}
      {isNight && <ellipse cx="500" cy="300" rx="300" ry="90" fill="url(#shell-lampGlow)" />}
    </svg>
  );
};
