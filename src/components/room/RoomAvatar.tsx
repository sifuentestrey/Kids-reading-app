import React from 'react';

interface RoomAvatarProps {
  name: string;
  avatarIcon?: string;
  equippedHatId?: string;
  equippedOutfitId?: string;
  equippedAccessoryId?: string;
  className?: string;
}

export const RoomAvatarCharacter: React.FC<RoomAvatarProps> = ({
  name,
  equippedHatId,
  equippedOutfitId,
  equippedAccessoryId,
  className = "w-36 h-48",
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
      {/* Premium Vector Character Sprite - High Depth & Polish */}
      <svg viewBox="0 0 120 150" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
        <defs>
          {/* Skin Shading */}
          <radialGradient id="avatarSkinGrad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="60%" stopColor="#ffe4e6" />
            <stop offset="100%" stopColor="#fecdd3" />
          </radialGradient>

          {/* Hair Shading */}
          <linearGradient id="avatarHairGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="50%" stopColor="#713f12" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Shirt / Outfit Default */}
          <linearGradient id="avatarShirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Cape / Royal Robe */}
          <linearGradient id="avatarCapeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          {/* Space Suit */}
          <linearGradient id="spaceSuitGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Crown Metallic Gold */}
          <linearGradient id="goldCrownGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Wizard Hat Deep Velvet */}
          <linearGradient id="wizardHatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="60%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="avatarDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#020617" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 0. GROUND CONTACT SHADOW */}
        <ellipse cx="60" cy="142" rx="34" ry="7" fill="#000000" opacity="0.35" filter="blur(3px)" />

        {/* 1. FAIRY WINGS ACCESSORY (Back layer) */}
        {(equippedAccessoryId === 'fairy_wings' || equippedAccessoryId === 'wings') && (
          <g className="animate-pulse" filter="url(#avatarDropShadow)">
            {/* Left Wings */}
            <path d="M30 52 Q-2 18 8 60 Q28 62 38 56 Z" fill="#f472b6" opacity="0.9" stroke="#be123c" strokeWidth="2.5" />
            <path d="M28 58 Q10 78 22 92 Q34 88 38 68 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" strokeWidth="2" />
            
            {/* Right Wings */}
            <path d="M90 52 Q122 18 112 60 Q92 62 82 56 Z" fill="#f472b6" opacity="0.9" stroke="#be123c" strokeWidth="2.5" />
            <path d="M92 58 Q110 78 98 92 Q86 88 82 68 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" strokeWidth="2" />

            {/* Sparkle Glint */}
            <circle cx="16" cy="38" r="3" fill="#ffffff" />
            <circle cx="104" cy="38" r="3" fill="#ffffff" />
          </g>
        )}

        {/* 2. SUPERHERO CAPE / ROYAL ROBE (Back layer) */}
        {(equippedOutfitId === 'superhero_cape' || equippedOutfitId === 'royal_robe' || !equippedOutfitId) && (
          <g filter="url(#avatarDropShadow)">
            <path d="M32 54 Q10 92 18 122 Q60 132 102 122 Q110 92 88 54 Z" fill="url(#avatarCapeGrad)" stroke="#881337" strokeWidth="3" />
            <path d="M32 54 Q20 90 28 118" stroke="#fca5a5" strokeWidth="2.5" fill="none" opacity="0.75" />
            <path d="M88 54 Q100 90 92 118" stroke="#fca5a5" strokeWidth="2.5" fill="none" opacity="0.75" />
            {/* Gold Clasp */}
            <circle cx="60" cy="55" r="5" fill="url(#goldCrownGrad)" stroke="#ca8a04" strokeWidth="1.5" />
          </g>
        )}

        {/* 3. LEGS & SHOES */}
        {/* Left Leg */}
        <rect x="42" y="100" width="14" height="30" rx="7" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="42" y="102" width="4" height="24" fill="#334155" opacity="0.6" />
        {/* Right Leg */}
        <rect x="64" y="100" width="14" height="30" rx="7" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="64" y="102" width="4" height="24" fill="#334155" opacity="0.6" />

        {/* Left Shoe */}
        <ellipse cx="46" cy="132" rx="11" ry="8" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
        <ellipse cx="46" cy="134" rx="9" ry="3" fill="#ffffff" opacity="0.4" />
        <rect x="38" y="136" width="16" height="3" rx="1.5" fill="#f8fafc" />

        {/* Right Shoe */}
        <ellipse cx="74" cy="132" rx="11" ry="8" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
        <ellipse cx="74" cy="134" rx="9" ry="3" fill="#ffffff" opacity="0.4" />
        <rect x="66" y="136" width="16" height="3" rx="1.5" fill="#f8fafc" />

        {/* 4. BODY / SHIRT */}
        {equippedOutfitId === 'rainbow_shirt' ? (
          <g filter="url(#avatarDropShadow)">
            <rect x="34" y="52" width="52" height="56" rx="16" fill="#ef4444" stroke="#991b1b" strokeWidth="3" />
            <rect x="34" y="66" width="52" height="12" fill="#facc15" />
            <rect x="34" y="78" width="52" height="12" fill="#3b82f6" />
            <rect x="34" y="90" width="52" height="12" fill="#22c55e" />
            {/* White Collar */}
            <path d="M48 52 L60 64 L72 52 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>
        ) : equippedOutfitId === 'pajama_set' ? (
          <g filter="url(#avatarDropShadow)">
            <rect x="34" y="52" width="52" height="56" rx="16" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
            <circle cx="48" cy="68" r="3.5" fill="#fef08a" />
            <circle cx="72" cy="78" r="3.5" fill="#fef08a" />
            <circle cx="54" cy="92" r="3.5" fill="#fef08a" />
            {/* Collar Trim */}
            <path d="M42 52 C52 60, 68 60, 78 52" fill="none" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : equippedOutfitId === 'space_suit' ? (
          <g filter="url(#avatarDropShadow)">
            <rect x="32" y="52" width="56" height="56" rx="18" fill="url(#spaceSuitGrad)" stroke="#475569" strokeWidth="3.5" />
            {/* Chest Control Panel */}
            <rect x="42" y="60" width="36" height="24" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="50" cy="72" r="3.5" fill="#ef4444" className="animate-pulse" />
            <circle cx="60" cy="72" r="3.5" fill="#22c55e" className="animate-pulse" />
            <circle cx="70" cy="72" r="3.5" fill="#facc15" className="animate-pulse" />
            {/* Space Badge */}
            <circle cx="48" cy="88" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          </g>
        ) : (
          <g filter="url(#avatarDropShadow)">
            <rect x="34" y="52" width="52" height="56" rx="16" fill="url(#avatarShirtGrad)" stroke="#0369a1" strokeWidth="3" />
            {/* White Collar & Buttons */}
            <path d="M46 52 L60 66 L74 52 Z" fill="#ffffff" opacity="0.9" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="60" cy="74" r="2.5" fill="#ffffff" />
            <circle cx="60" cy="86" r="2.5" fill="#ffffff" />
          </g>
        )}

        {/* 5. ARMS & HANDS */}
        {/* Left Arm Waving */}
        <path d="M34 58 Q12 48 14 30" stroke="url(#avatarSkinGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="28" r="7" fill="url(#avatarSkinGrad)" stroke="#f43f5e" strokeWidth="1" />

        {/* Right Arm */}
        <path d="M86 58 Q108 66 104 84" stroke="url(#avatarSkinGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="104" cy="84" r="7" fill="url(#avatarSkinGrad)" stroke="#f43f5e" strokeWidth="1" />

        {/* 6. HELD ACCESSORY (In Right Hand) */}
        {equippedAccessoryId === 'magic_wand' && (
          <g filter="url(#avatarDropShadow)">
            <line x1="104" y1="84" x2="116" y2="58" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
            <polygon
              points="116,50 119,55 125,55 120,59 122,65 116,61 110,65 112,59 107,55 113,55"
              fill="url(#goldCrownGrad)"
              stroke="#ca8a04"
              strokeWidth="1.5"
              className="animate-pulse"
            />
            <circle cx="116" cy="58" r="10" fill="#fef08a" opacity="0.3" className="animate-ping" />
          </g>
        )}
        {equippedAccessoryId === 'gold_trophy' && (
          <g transform="translate(98, 62) scale(0.65)" filter="url(#avatarDropShadow)">
            <path d="M10 18 H30 L28 36 Q20 42 12 36 Z" fill="url(#goldCrownGrad)" stroke="#ca8a04" strokeWidth="2" />
            <rect x="17" y="42" width="6" height="10" fill="#78350f" />
            <polygon points="20,22 22,26 26,26 23,29 24,33 20,30 16,33 17,29 14,26 18,26" fill="#ffffff" />
          </g>
        )}
        {equippedAccessoryId === 'magnifying_glass' && (
          <g transform="translate(96, 60)" filter="url(#avatarDropShadow)">
            <circle cx="12" cy="12" r="11" fill="none" stroke="url(#goldCrownGrad)" strokeWidth="3.5" />
            <circle cx="12" cy="12" r="9" fill="#38bdf8" opacity="0.45" />
            <ellipse cx="9" cy="9" rx="3" ry="6" fill="#ffffff" opacity="0.8" transform="rotate(-30 9 9)" />
            <line x1="19" y1="19" x2="30" y2="30" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {/* 7. HEAD */}
        <circle cx="60" cy="32" r="27" fill="url(#avatarSkinGrad)" stroke="#fb7185" strokeWidth="2" filter="url(#avatarDropShadow)" />

        {/* Dynamic Hair Base & Bangs */}
        <g>
          {/* Back Hair */}
          <circle cx="34" cy="28" r="12" fill="url(#avatarHairGrad)" />
          <circle cx="86" cy="28" r="12" fill="url(#avatarHairGrad)" />
          {/* Front Bangs */}
          <path d="M33 26 Q60 4 87 26 Q78 12 60 12 Q42 12 33 26 Z" fill="url(#avatarHairGrad)" stroke="#451a03" strokeWidth="2" />
          {/* Hair Shine Highlight */}
          <path d="M44 14 Q60 8 76 14" stroke="#fde047" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round" />
        </g>

        {/* Glasses Overlay */}
        {equippedAccessoryId === 'star_glasses' && (
          <g transform="translate(36, 18) scale(0.85)" filter="url(#avatarDropShadow)">
            <polygon points="12,12 15,18 22,18 17,22 19,28 12,24 5,28 7,22 2,18 9,18" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
            <polygon points="40,12 43,18 50,18 45,22 47,28 40,24 33,28 35,22 30,18 37,18" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
            <line x1="22" y1="18" x2="30" y2="18" stroke="#be123c" strokeWidth="3" />
            {/* Lens Glint */}
            <line x1="10" y1="16" x2="14" y2="20" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="38" y1="16" x2="42" y2="20" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}

        {/* Large Expressive Anime Eyes */}
        <g>
          {/* Left Eye */}
          <ellipse cx="48" cy="30" rx="6" ry="7.5" fill="#1e1b18" />
          <ellipse cx="48" cy="31" rx="5" ry="6" fill="#451a03" />
          <circle cx="46" cy="28" r="2.8" fill="#ffffff" />
          <circle cx="50" cy="33" r="1.2" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="72" cy="30" rx="6" ry="7.5" fill="#1e1b18" />
          <ellipse cx="72" cy="31" rx="5" ry="6" fill="#451a03" />
          <circle cx="70" cy="28" r="2.8" fill="#ffffff" />
          <circle cx="74" cy="33" r="1.2" fill="#ffffff" />
        </g>

        {/* Blushing Cheeks */}
        <circle cx="38" cy="38" r="5" fill="#f43f5e" opacity="0.6" />
        <circle cx="82" cy="38" r="5" fill="#f43f5e" opacity="0.6" />

        {/* Cute Smile */}
        <path d="M52 38 Q60 48 68 38" stroke="#be123c" strokeWidth="3.5" fill="none" strokeLinecap="round" />

        {/* Nose Dot */}
        <circle cx="60" cy="35" r="1.2" fill="#e11d48" opacity="0.8" />

        {/* 8. EQUIPPED HATS */}
        {equippedHatId === 'golden_crown' || equippedHatId === 'princess_tiara' ? (
          <g filter="url(#avatarDropShadow)">
            <polygon points="38,14 44,0 52,8 60,-4 68,8 76,0 82,14" fill="url(#goldCrownGrad)" stroke="#ca8a04" strokeWidth="2.5" />
            <circle cx="60" cy="6" r="3" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <circle cx="44" cy="6" r="2.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
            <circle cx="76" cy="6" r="2.5" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
            {/* Sparkle */}
            <circle cx="60" cy="-4" r="2" fill="#ffffff" className="animate-ping" />
          </g>
        ) : equippedHatId === 'wizard_hat' ? (
          <g filter="url(#avatarDropShadow)">
            <polygon points="60, -22 34, 16 86, 16" fill="url(#wizardHatGrad)" stroke="#3b0764" strokeWidth="3" />
            <ellipse cx="60" cy="16" rx="30" ry="7" fill="#581c87" stroke="#3b0764" strokeWidth="2.5" />
            {/* Gold Moon & Stars */}
            <path d="M58,-8 A6 6 0 1 0 64,2 A8 8 0 1 1 58,-8 Z" fill="url(#goldCrownGrad)" />
            <polygon points="46,4 48,8 52,8 49,10 50,14 46,11 42,14 43,10 40,8 44,8" fill="#fef08a" />
          </g>
        ) : equippedHatId === 'pirate_hat' ? (
          <g filter="url(#avatarDropShadow)">
            <path d="M26 16 Q60 -4 94 16 Q60 8 26 16 Z" fill="#0f172a" stroke="#000000" strokeWidth="3" />
            <circle cx="60" cy="8" r="4.5" fill="#ffffff" />
            <path d="M56 12 L64 4 M64 12 L56 4" stroke="#000000" strokeWidth="2" />
            {/* Red Feather Plume */}
            <path d="M84 10 Q98 -10 90 -22 Q82 -8 84 10 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
          </g>
        ) : equippedHatId === 'chef_hat' ? (
          <g filter="url(#avatarDropShadow)">
            <ellipse cx="60" cy="2" rx="24" ry="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
            <rect x="40" y="8" width="40" height="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="48" y1="8" x2="48" y2="20" stroke="#f1f5f9" strokeWidth="2" />
            <line x1="72" y1="8" x2="72" y2="20" stroke="#f1f5f9" strokeWidth="2" />
          </g>
        ) : equippedHatId === 'cat_ears' ? (
          <g filter="url(#avatarDropShadow)">
            <polygon points="34,16 42,-4 50,14" fill="#f472b6" stroke="#be123c" strokeWidth="2.5" />
            <polygon points="38,14 42,2 46,12" fill="#fbcfe8" />

            <polygon points="70,14 78,-4 86,16" fill="#f472b6" stroke="#be123c" strokeWidth="2.5" />
            <polygon points="74,12 78,2 82,14" fill="#fbcfe8" />
          </g>
        ) : equippedHatId === 'dino_hood' ? (
          <g filter="url(#avatarDropShadow)">
            <path d="M30 18 Q60 -6 90 18 Q60 8 30 18 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
            <polygon points="46,-2 50,-10 54,-2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="60,-4 64,-12 68,-4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="74,-2 78,-10 82,-2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          </g>
        ) : (
          <g filter="url(#avatarDropShadow)">
            {/* Explorer Cap */}
            <path d="M30 18 Q60 2 90 18 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
            <path d="M22 18 Q60 12 98 18 L104 23 Q60 16 16 23 Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
            <circle cx="60" cy="8" r="4.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
};
