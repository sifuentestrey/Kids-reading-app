import React from 'react';
import { ArtDefs, ContactShadow, MAT, RimLight } from './artKit';

interface PetProps {
  species?: string;
  className?: string;
}

/**
 * Room pets, drawn to the same rules as the furniture and the avatar: soft
 * rounded silhouettes, one light from the upper left, no outlines, muted palette.
 *
 * Each animal is a stack of two or three big shapes plus a face. Resisting extra
 * detail is what keeps them looking like game characters instead of stickers.
 */

interface Coat {
  light: string;
  mid: string;
  dark: string;
  belly: string;
}

const COATS: Record<string, Coat> = {
  bunny: { light: '#F5EAE0', mid: '#E2D2C4', dark: '#C4B0A0', belly: '#FFF8F1' },
  owl: { light: '#C9A87C', mid: '#A98860', dark: '#836646', belly: '#EBD9BE' },
  fox: { light: '#E79A5F', mid: '#D07B41', dark: '#A85B2C', belly: '#F7E3CC' },
  dragon: { light: '#8FC9A8', mid: '#6BA987', dark: '#4B8265', belly: '#D6EFDF' },
  cat: { light: '#B9AFC6', mid: '#9A8FAA', dark: '#776C88', belly: '#E4DDEC' },
};

const Eyes: React.FC<{ y: number; spread: number; r?: number }> = ({ y, spread, r = 4 }) => (
  <g>
    <ellipse cx={-spread} cy={y} rx={r} ry={r * 1.15} fill="#3D2716" />
    <ellipse cx={spread} cy={y} rx={r} ry={r * 1.15} fill="#3D2716" />
    <circle cx={-spread - r * 0.35} cy={y - r * 0.45} r={r * 0.34} fill="#FFFFFF" opacity="0.9" />
    <circle cx={spread - r * 0.35} cy={y - r * 0.45} r={r * 0.34} fill="#FFFFFF" opacity="0.9" />
  </g>
);

export const RoomPetGraphic: React.FC<PetProps> = ({
  species = 'bunny',
  className = 'w-24 h-24',
}) => {
  const norm = species.toLowerCase();
  const coat = COATS[norm] ?? COATS.bunny;
  const p = `pet-${norm}`;

  return (
    <div className={`relative bg-transparent p-0 m-0 border-0 ${className}`}>
      <svg viewBox="-50 -70 100 90" className="w-full h-full overflow-visible bg-transparent">
        <ArtDefs idPrefix={p} />
        <ContactShadow u={0} v={10} rx={24} idPrefix={p} />

        {norm === 'owl' ? (
          <g>
            {/* Owl: one rounded body, wings tucked either side, big face disc */}
            <ellipse cx="0" cy="-22" rx="26" ry="28" fill={coat.mid} />
            <ellipse cx="-7" cy="-28" rx="19" ry="21" fill={coat.light} opacity="0.6" />
            <ellipse cx="0" cy="-16" rx="16" ry="18" fill={coat.belly} opacity="0.75" />
            <ellipse cx="-24" cy="-22" rx="8" ry="17" fill={coat.dark} />
            <ellipse cx="24" cy="-22" rx="8" ry="17" fill={coat.dark} />

            {/* Ear tufts */}
            <path d="M -20 -44 L -14 -58 L -8 -44 Z" fill={coat.dark} />
            <path d="M 20 -44 L 14 -58 L 8 -44 Z" fill={coat.dark} />

            {/* Face discs */}
            <circle cx="-9" cy="-34" r="11" fill={coat.belly} />
            <circle cx="9" cy="-34" r="11" fill={coat.belly} />
            <Eyes y={-34} spread={9} r={5} />
            <path d="M 0 -30 L -4 -25 L 4 -25 Z" fill={MAT.butter.left} />

            {/* Feet */}
            <ellipse cx="-9" cy="2" rx="7" ry="4" fill={MAT.butter.left} />
            <ellipse cx="9" cy="2" rx="7" ry="4" fill={MAT.butter.left} />
          </g>
        ) : norm === 'fox' ? (
          <g>
            {/* Tail behind the body */}
            <path d="M 20 -12 Q 46 -18 42 -40 Q 30 -30 18 -24 Z" fill={coat.dark} />
            <path d="M 34 -34 Q 44 -32 42 -40 Q 36 -38 34 -34 Z" fill={coat.belly} />

            {/* Body and head */}
            <ellipse cx="0" cy="-14" rx="23" ry="18" fill={coat.mid} />
            <ellipse cx="-6" cy="-19" rx="16" ry="12" fill={coat.light} opacity="0.6" />
            <ellipse cx="0" cy="-8" rx="13" ry="9" fill={coat.belly} opacity="0.7" />

            <circle cx="0" cy="-38" r="18" fill={coat.mid} />
            <circle cx="-6" cy="-42" r="13" fill={coat.light} opacity="0.6" />
            {/* Ears */}
            <path d="M -17 -48 L -13 -64 L -3 -52 Z" fill={coat.dark} />
            <path d="M 17 -48 L 13 -64 L 3 -52 Z" fill={coat.dark} />
            <path d="M -14 -51 L -12 -59 L -7 -52 Z" fill={MAT.coral.left} opacity="0.6" />
            <path d="M 14 -51 L 12 -59 L 7 -52 Z" fill={MAT.coral.left} opacity="0.6" />
            {/* Snout */}
            <ellipse cx="0" cy="-30" rx="10" ry="7" fill={coat.belly} />
            <ellipse cx="0" cy="-33" rx="3.2" ry="2.4" fill="#3D2716" />
            <Eyes y={-40} spread={7} r={3.6} />

            {/* Legs */}
            <ellipse cx="-11" cy="2" rx="6" ry="4" fill={coat.dark} />
            <ellipse cx="11" cy="2" rx="6" ry="4" fill={coat.dark} />
          </g>
        ) : norm === 'dragon' ? (
          <g>
            {/* Wings behind */}
            <path d="M -14 -34 Q -40 -50 -34 -18 Q -24 -26 -12 -26 Z" fill={coat.dark} />
            <path d="M 14 -34 Q 40 -50 34 -18 Q 24 -26 12 -26 Z" fill={coat.dark} />

            <ellipse cx="0" cy="-16" rx="21" ry="18" fill={coat.mid} />
            <ellipse cx="-6" cy="-21" rx="14" ry="12" fill={coat.light} opacity="0.6" />
            <ellipse cx="0" cy="-10" rx="12" ry="9" fill={coat.belly} opacity="0.7" />

            <circle cx="0" cy="-40" r="17" fill={coat.mid} />
            <circle cx="-6" cy="-44" r="12" fill={coat.light} opacity="0.6" />
            {/* Horns and snout */}
            <path d="M -12 -52 L -16 -64 L -6 -56 Z" fill={MAT.cream.left} />
            <path d="M 12 -52 L 16 -64 L 6 -56 Z" fill={MAT.cream.left} />
            <ellipse cx="0" cy="-33" rx="11" ry="7" fill={coat.belly} />
            <circle cx="-4" cy="-34" r="1.7" fill="#3D2716" />
            <circle cx="4" cy="-34" r="1.7" fill="#3D2716" />
            <Eyes y={-43} spread={7} r={3.6} />
            {/* Back ridge */}
            {[-6, 2, 10].map((dy) => (
              <path key={dy} d={`M 18 ${-24 + dy} L 26 ${-28 + dy} L 20 ${-18 + dy} Z`} fill={MAT.butter.left} opacity="0.8" />
            ))}
          </g>
        ) : (
          <g>
            {/* Bunny (default): body, head, tall ears, cotton tail */}
            <ellipse cx="17" cy="-8" rx="8" ry="7" fill={coat.belly} />
            <ellipse cx="0" cy="-14" rx="22" ry="17" fill={coat.mid} />
            <ellipse cx="-6" cy="-19" rx="15" ry="11" fill={coat.light} opacity="0.65" />
            <ellipse cx="-2" cy="-8" rx="12" ry="8" fill={coat.belly} opacity="0.7" />

            {/* Ears rise behind the head */}
            <ellipse cx="-9" cy="-56" rx="6" ry="16" fill={coat.mid} transform="rotate(-10 -9 -56)" />
            <ellipse cx="9" cy="-56" rx="6" ry="16" fill={coat.mid} transform="rotate(10 9 -56)" />
            <ellipse cx="-9" cy="-56" rx="3" ry="11" fill={MAT.coral.left} opacity="0.5" transform="rotate(-10 -9 -56)" />
            <ellipse cx="9" cy="-56" rx="3" ry="11" fill={MAT.coral.left} opacity="0.5" transform="rotate(10 9 -56)" />

            <circle cx="0" cy="-36" r="17" fill={coat.mid} />
            <circle cx="-6" cy="-40" r="12" fill={coat.light} opacity="0.65" />
            <ellipse cx="0" cy="-29" rx="9" ry="6" fill={coat.belly} />
            <ellipse cx="0" cy="-31" rx="2.8" ry="2" fill={MAT.coral.right} />
            <Eyes y={-38} spread={7} r={3.8} />
            <path d="M -4 -27 Q 0 -24 4 -27" stroke={coat.dark} strokeWidth="1.6" fill="none" strokeLinecap="round" />

            {/* Front paws */}
            <ellipse cx="-12" cy="1" rx="7" ry="4" fill={coat.light} />
            <ellipse cx="8" cy="1" rx="7" ry="4" fill={coat.light} />
          </g>
        )}

        <RimLight d="M -20 -44 Q -26 -28 -20 -14" width={2.2} opacity={0.28} />
      </svg>
    </div>
  );
};
