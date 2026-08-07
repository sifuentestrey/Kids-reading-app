import React from 'react';
import { ArtDefs, ContactShadow, MAT, RimLight } from './artKit';

interface RoomAvatarProps {
  name: string;
  avatarIcon?: string;
  equippedHatId?: string;
  equippedOutfitId?: string;
  equippedAccessoryId?: string;
  className?: string;
}

/**
 * The child's character.
 *
 * Built to the same rules as the furniture: chunky simplified forms, one light
 * from the upper left, no outlines. The silhouette does the work — big round
 * head, rounded body, stubby limbs — which is why late-2000s portal characters
 * stay readable at any size. Detail is deliberately sparse; eyelashes and
 * fingers at this scale are what tip a character into clip art.
 */

const SKIN = { light: '#F3C9A0', mid: '#E2AF84', dark: '#C68F65' };
const HAIR = { light: '#6B4A2A', mid: '#54381F' };

const OUTFIT_COLOURS: Record<string, typeof MAT.teal> = {
  hero_cape: MAT.coral,
  space_suit: MAT.sky,
  princess_gown: MAT.plum,
  dino_onesie: MAT.leaf,
  rainbow_tutu: MAT.butter,
};

export const RoomAvatarCharacter: React.FC<RoomAvatarProps> = ({
  name,
  equippedHatId,
  equippedOutfitId,
  equippedAccessoryId,
  className = 'w-34 h-48',
}) => {
  const p = `kid-${name.toLowerCase().replace(/[^a-z]/g, '') || 'child'}`;
  const shirt = (equippedOutfitId && OUTFIT_COLOURS[equippedOutfitId]) || MAT.teal;

  return (
    <div className={`relative bg-transparent p-0 m-0 border-0 ${className}`}>
      <svg viewBox="-60 -150 120 165" className="w-full h-full overflow-visible bg-transparent">
        <ArtDefs idPrefix={p} />
        <ContactShadow u={0} v={8} rx={30} idPrefix={p} />

        {/* Cape sits behind the body */}
        {equippedOutfitId === 'hero_cape' && (
          <path d="M -24 -94 Q -48 -58 -36 -26 Q 0 -42 36 -26 Q 48 -58 24 -94 Z" fill={MAT.coral.right} />
        )}

        {/* Legs: denim, a clear step darker than the shirt so the character has a
            readable silhouette rather than one continuous block of colour. */}
        <rect x="-18" y="-46" width="15" height="44" rx="7.5" fill="#4B6E93" />
        <rect x="3" y="-46" width="15" height="44" rx="7.5" fill="#3E5C7C" />
        <rect x="-18" y="-46" width="6" height="44" rx="3" fill="#6389AF" opacity="0.75" />

        {/* Shoes, sitting on the ground plane */}
        <path d="M -21 -10 h 16 v 6 q 0 5 -6 5 h -12 q -4 0 -4 -4 q 0 -5 6 -7 Z" fill="#C4574B" />
        <path d="M 5 -10 h 16 v 6 q 0 5 -6 5 h -12 q -4 0 -4 -4 q 0 -5 6 -7 Z" fill="#A9453A" />
        <path d="M -27 -3 h 22 v 4 h -22 Z" fill="#F0DCB4" opacity="0.9" />
        <path d="M -1 -3 h 22 v 4 h -22 Z" fill="#E4CCA0" opacity="0.9" />

        {/* Torso: a rounded barrel, brighter up the left side */}
        <path d="M -24 -96 Q -27 -50 -20 -42 L 20 -42 Q 27 -50 24 -96 Z" fill={shirt.left} />
        <path d="M -24 -96 Q -27 -50 -20 -42 L -6 -42 Q -10 -60 -8 -96 Z" fill={shirt.top} opacity="0.55" />
        <path d="M 10 -96 Q 14 -60 12 -42 L 20 -42 Q 27 -50 24 -96 Z" fill={shirt.right} opacity="0.85" />

        {/* Arms */}
        <path d="M -24 -92 Q -38 -80 -34 -58" stroke={shirt.left} strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M 24 -92 Q 38 -80 34 -58" stroke={shirt.right} strokeWidth="13" fill="none" strokeLinecap="round" />
        <circle cx="-34" cy="-55" r="7.5" fill={SKIN.mid} />
        <circle cx="34" cy="-55" r="7.5" fill={SKIN.mid} />
        <circle cx="-36" cy="-57" r="5" fill={SKIN.light} opacity="0.7" />

        {/* Head */}
        <circle cx="-29" cy="-115" r="6.5" fill={SKIN.dark} />
        <circle cx="29" cy="-115" r="6.5" fill={SKIN.dark} />
        <circle cx="0" cy="-118" r="30" fill={SKIN.mid} />
        <circle cx="-8" cy="-124" r="23" fill={SKIN.light} opacity="0.7" />

        {/* Hair: a soft cap of volume, never individual strands */}
        <path d="M -30 -122 Q -28 -152 0 -150 Q 28 -152 30 -122 Q 20 -136 0 -134 Q -20 -136 -30 -122 Z" fill={HAIR.mid} />
        <path d="M -30 -122 Q -28 -152 0 -150 Q 8 -148 10 -146 Q -14 -142 -22 -126 Z" fill={HAIR.light} opacity="0.65" />

        {/* Face */}
        <ellipse cx="-11" cy="-116" rx="4" ry="4.6" fill="#3D2716" />
        <ellipse cx="11" cy="-116" rx="4" ry="4.6" fill="#3D2716" />
        <circle cx="-12.5" cy="-118" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="9.5" cy="-118" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="-19" cy="-108" rx="6" ry="4" fill={MAT.coral.left} opacity="0.3" />
        <ellipse cx="19" cy="-108" rx="6" ry="4" fill={MAT.coral.left} opacity="0.3" />
        <path d="M -7 -106 Q 0 -99 7 -106" stroke="#8A5A3B" strokeWidth="2.6" fill="none" strokeLinecap="round" />

        {/* Equipped hat */}
        {equippedHatId &&
          (equippedHatId === 'golden_crown' ? (
            <g>
              <path d="M -26 -142 L -18 -160 L -8 -147 L 0 -166 L 8 -147 L 18 -160 L 26 -142 Z" fill={MAT.butter.left} />
              <path d="M -26 -142 L 26 -142 L 26 -135 L -26 -135 Z" fill={MAT.butter.right} />
              <circle cx="0" cy="-152" r="3" fill={MAT.coral.top} />
            </g>
          ) : (
            <g>
              <path d="M -31 -134 Q -30 -160 0 -160 Q 30 -160 31 -134 Z" fill={MAT.coral.left} />
              <path d="M -31 -134 Q -30 -160 -6 -160 Q -18 -148 -22 -134 Z" fill={MAT.coral.top} opacity="0.65" />
              <rect x="-33" y="-137" width="66" height="9" rx="4.5" fill={MAT.cream.left} />
              <circle cx="0" cy="-164" r="7" fill={MAT.cream.top} />
            </g>
          ))}

        {/* Equipped accessory */}
        {equippedAccessoryId && (
          <g opacity="0.9">
            <circle cx="-11" cy="-116" r="9.5" fill="none" stroke={MAT.charcoal.left} strokeWidth="2.4" />
            <circle cx="11" cy="-116" r="9.5" fill="none" stroke={MAT.charcoal.left} strokeWidth="2.4" />
            <line x1="-2" y1="-116" x2="2" y2="-116" stroke={MAT.charcoal.left} strokeWidth="2.4" />
          </g>
        )}

        <RimLight d="M -28 -134 Q -34 -112 -26 -96" width={2.5} opacity={0.28} />
      </svg>
    </div>
  );
};
