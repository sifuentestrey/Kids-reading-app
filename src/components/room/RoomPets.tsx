import React from 'react';

interface PetProps {
  species?: string;
  className?: string;
}

export const RoomPetGraphic: React.FC<PetProps> = ({ species = 'bunny', className = "w-24 h-24" }) => {
  const norm = species.toLowerCase();

  // 1. BARNABY THE READING BEAR GRAPHIC
  if (norm.includes('bear') || norm.includes('barnaby')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <radialGradient id="bearFurGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
            <linearGradient id="bearGlasses" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="30" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Bear Ears */}
          <circle cx="22" cy="22" r="12" fill="url(#bearFurGrad)" stroke="#78350f" strokeWidth="2" />
          <circle cx="22" cy="22" r="6" fill="#fde68a" />
          <circle cx="68" cy="22" r="12" fill="url(#bearFurGrad)" stroke="#78350f" strokeWidth="2" />
          <circle cx="68" cy="22" r="6" fill="#fde68a" />

          {/* Bear Body */}
          <ellipse cx="45" cy="56" rx="25" ry="26" fill="url(#bearFurGrad)" stroke="#78350f" strokeWidth="2.5" />
          <ellipse cx="45" cy="58" rx="16" ry="17" fill="#fde68a" />

          {/* Bear Head */}
          <circle cx="45" cy="36" r="21" fill="url(#bearFurGrad)" stroke="#78350f" strokeWidth="2.5" />

          {/* Snout */}
          <ellipse cx="45" cy="42" rx="9" ry="7" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <ellipse cx="45" cy="39" rx="4" ry="2.8" fill="#240c01" />

          {/* Cute Reading Glasses */}
          <circle cx="35" cy="32" r="8" fill="#ffffff" stroke="url(#bearGlasses)" strokeWidth="2.5" />
          <circle cx="35" cy="32" r="4" fill="#1e1b18" />
          <circle cx="33" cy="30" r="1.5" fill="#ffffff" />

          <circle cx="55" cy="32" r="8" fill="#ffffff" stroke="url(#bearGlasses)" strokeWidth="2.5" />
          <circle cx="55" cy="32" r="4" fill="#1e1b18" />
          <circle cx="53" cy="30" r="1.5" fill="#ffffff" />

          <line x1="43" y1="32" x2="47" y2="32" stroke="#facc15" strokeWidth="2.5" />

          {/* Blushing Cheeks */}
          <circle cx="27" cy="42" r="3.5" fill="#f43f5e" opacity="0.6" />
          <circle cx="63" cy="42" r="3.5" fill="#f43f5e" opacity="0.6" />

          {/* Holding Open Storybook */}
          <path d="M25 60 L45 68 L65 60 L65 76 L45 82 L25 76 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
          <path d="M27 61 L45 67 L63 61 L63 74 L45 80 L27 74 Z" fill="#ffffff" />
          <line x1="45" y1="67" x2="45" y2="80" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="35" y="70" fontSize="5" fontWeight="bold" fill="#0284c7">ABC</text>

          {/* Paws */}
          <ellipse cx="23" cy="62" rx="5" ry="4" fill="#78350f" />
          <ellipse cx="67" cy="62" rx="5" ry="4" fill="#78350f" />
        </svg>
      </div>
    );
  }

  // 2. PIP THE ALPHABET PENGUIN GRAPHIC
  if (norm.includes('penguin') || norm.includes('pip')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <radialGradient id="penguinBody" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <linearGradient id="scarfGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="28" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Flippers */}
          <ellipse cx="18" cy="52" rx="6" ry="16" fill="url(#penguinBody)" transform="rotate(25 18 52)" />
          <ellipse cx="72" cy="52" rx="6" ry="16" fill="url(#penguinBody)" transform="rotate(-25 72 52)" />

          {/* Body */}
          <ellipse cx="45" cy="50" rx="25" ry="29" fill="url(#penguinBody)" stroke="#020617" strokeWidth="2.5" />

          {/* Fluffy White Belly */}
          <ellipse cx="45" cy="54" rx="17" ry="22" fill="#ffffff" />

          {/* Head & Eyes */}
          <circle cx="35" cy="30" r="5" fill="#ffffff" />
          <circle cx="35" cy="30" r="3" fill="#020617" />
          <circle cx="36" cy="29" r="1.2" fill="#ffffff" />

          <circle cx="55" cy="30" r="5" fill="#ffffff" />
          <circle cx="55" cy="30" r="3" fill="#020617" />
          <circle cx="56" cy="29" r="1.2" fill="#ffffff" />

          {/* Cute Orange Beak */}
          <polygon points="45,32 38,39 52,39" fill="#f97316" stroke="#c2410c" strokeWidth="1" />

          {/* Cozy Winter Scarf */}
          <path d="M23 42 Q45 50 67 42 L65 48 Q45 56 25 48 Z" fill="url(#scarfGrad)" stroke="#0369a1" strokeWidth="1.5" />
          <rect x="52" y="46" width="8" height="18" rx="2" fill="url(#scarfGrad)" stroke="#0369a1" strokeWidth="1.5" transform="rotate(15 52 46)" />

          {/* Blushing Cheeks */}
          <circle cx="26" cy="36" r="3.5" fill="#f43f5e" opacity="0.6" />
          <circle cx="64" cy="36" r="3.5" fill="#f43f5e" opacity="0.6" />

          {/* Orange Webbed Feet */}
          <ellipse cx="32" cy="78" rx="8" ry="4.5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
          <ellipse cx="58" cy="78" rx="8" ry="4.5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // 3. WHISKERS THE WORD CAT GRAPHIC
  if (norm.includes('cat') || norm.includes('whiskers')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <radialGradient id="catFur" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="70%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </radialGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="28" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Swirling Tail */}
          <path d="M62 60 Q84 50 78 76 Q68 84 60 70 Z" fill="url(#catFur)" stroke="#581c87" strokeWidth="2" />

          {/* Ears */}
          <polygon points="22,26 28,6 38,24" fill="url(#catFur)" stroke="#581c87" strokeWidth="2" />
          <polygon points="25,24 28,10 35,22" fill="#f472b6" />

          <polygon points="68,26 62,6 52,24" fill="url(#catFur)" stroke="#581c87" strokeWidth="2" />
          <polygon points="65,24 62,10 55,22" fill="#f472b6" />

          {/* Body */}
          <ellipse cx="45" cy="54" rx="22" ry="24" fill="url(#catFur)" stroke="#581c87" strokeWidth="2.5" />
          <ellipse cx="45" cy="58" rx="13" ry="16" fill="#f3e8ff" />

          {/* Head */}
          <circle cx="45" cy="36" r="20" fill="url(#catFur)" stroke="#581c87" strokeWidth="2.5" />

          {/* Anime Cat Eyes */}
          <ellipse cx="34" cy="32" rx="4.5" ry="6" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="34" cy="32" rx="2" ry="4.5" fill="#1e1b18" />
          <circle cx="35" cy="30" r="1.5" fill="#ffffff" />

          <ellipse cx="56" cy="32" rx="4.5" ry="6" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="56" cy="32" rx="2" ry="4.5" fill="#1e1b18" />
          <circle cx="57" cy="30" r="1.5" fill="#ffffff" />

          {/* Pink Nose & Whiskers */}
          <polygon points="45,37 43,40 47,40" fill="#f43f5e" />
          <line x1="22" y1="38" x2="34" y2="39" stroke="#e9d5ff" strokeWidth="1.5" />
          <line x1="22" y1="42" x2="34" y2="41" stroke="#e9d5ff" strokeWidth="1.5" />
          <line x1="68" y1="38" x2="56" y2="39" stroke="#e9d5ff" strokeWidth="1.5" />
          <line x1="68" y1="42" x2="56" y2="41" stroke="#e9d5ff" strokeWidth="1.5" />

          {/* Golden Bell Collar */}
          <path d="M28 48 Q45 56 62 48" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="45" cy="52" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />

          {/* Feet */}
          <ellipse cx="32" cy="76" rx="6" ry="4" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1" />
          <ellipse cx="58" cy="76" rx="6" ry="4" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 4. TWINKLE THE STAR FOX GRAPHIC
  if (norm.includes('fox') || norm.includes('twinkle')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <radialGradient id="foxFurGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="30" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Big Bushy Tail */}
          <path d="M56 54 Q88 40 82 74 Q64 84 50 68 Z" fill="url(#foxFurGrad)" stroke="#9a3412" strokeWidth="2" />
          <path d="M72 62 Q84 66 82 74 Q70 80 64 72 Z" fill="#ffffff" />

          {/* Body */}
          <ellipse cx="42" cy="54" rx="21" ry="23" fill="url(#foxFurGrad)" stroke="#9a3412" strokeWidth="2.5" />
          <ellipse cx="42" cy="58" rx="13" ry="16" fill="#ffffff" />

          {/* Ears */}
          <polygon points="22,28 26,8 36,26" fill="url(#foxFurGrad)" stroke="#9a3412" strokeWidth="2" />
          <polygon points="24,26 26,12 33,24" fill="#240c01" />

          <polygon points="62,28 58,8 48,26" fill="url(#foxFurGrad)" stroke="#9a3412" strokeWidth="2" />
          <polygon points="60,26 58,12 51,24" fill="#240c01" />

          {/* Head */}
          <polygon points="42,20 18,40 66,40" fill="url(#foxFurGrad)" stroke="#9a3412" strokeWidth="2.5" />
          <polygon points="42,30 26,42 58,42" fill="#ffffff" />

          {/* Sparkling Eyes & Nose */}
          <circle cx="31" cy="33" r="4" fill="#1e1b18" />
          <circle cx="32" cy="32" r="1.8" fill="#ffffff" />

          <circle cx="53" cy="33" r="4" fill="#1e1b18" />
          <circle cx="54" cy="32" r="1.8" fill="#ffffff" />

          <circle cx="42" cy="41" r="4" fill="#1e1b18" />

          {/* Paws */}
          <ellipse cx="32" cy="76" rx="5.5" ry="4" fill="#1e1b18" />
          <ellipse cx="52" cy="76" rx="5.5" ry="4" fill="#1e1b18" />
        </svg>
      </div>
    );
  }

  // 5. SPARKY THE DRAGON CUB GRAPHIC
  if (norm.includes('dragon') || norm.includes('sparky')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <radialGradient id="dragonSkin" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="70%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="30" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Flapping Wings */}
          <path d="M28 38 Q8 20 2 38 Q16 46 28 48 Z" fill="#facc15" stroke="#d97706" strokeWidth="2.5" />
          <path d="M62 38 Q82 20 88 38 Q74 46 62 48 Z" fill="#facc15" stroke="#d97706" strokeWidth="2.5" />

          {/* Body */}
          <ellipse cx="45" cy="54" rx="21" ry="25" fill="url(#dragonSkin)" stroke="#14532d" strokeWidth="2.5" />
          <ellipse cx="45" cy="56" rx="13" ry="17" fill="#fde047" />

          {/* Head */}
          <circle cx="45" cy="30" r="19" fill="url(#dragonSkin)" stroke="#14532d" strokeWidth="2.5" />

          {/* Golden Horns */}
          <polygon points="35,16 33,6 41,14" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <polygon points="55,16 57,6 49,14" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />

          {/* Shiny Eyes */}
          <circle cx="35" cy="28" r="6" fill="#ffffff" />
          <circle cx="35" cy="28" r="3.8" fill="#1e1b18" />
          <circle cx="36" cy="27" r="1.8" fill="#ffffff" />

          <circle cx="55" cy="28" r="6" fill="#ffffff" />
          <circle cx="55" cy="28" r="3.8" fill="#1e1b18" />
          <circle cx="56" cy="27" r="1.8" fill="#ffffff" />

          {/* Snout */}
          <ellipse cx="45" cy="36" rx="7.5" ry="5" fill="#22c55e" />
          <circle cx="42" cy="35" r="1.5" fill="#14532d" />
          <circle cx="48" cy="35" r="1.5" fill="#14532d" />

          {/* Feet */}
          <ellipse cx="32" cy="78" rx="7.5" ry="5" fill="#14532d" />
          <ellipse cx="58" cy="78" rx="7.5" ry="5" fill="#14532d" />
        </svg>
      </div>
    );
  }

  // 6. WISE OWL PET GRAPHIC
  if (norm.includes('owl')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <radialGradient id="owlBodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
            <linearGradient id="owlBellyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="30" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Ear Tufted Feathers */}
          <polygon points="22,28 32,12 38,30" fill="#451a03" stroke="#290f02" strokeWidth="1.5" />
          <polygon points="68,28 58,12 52,30" fill="#451a03" stroke="#290f02" strokeWidth="1.5" />

          {/* Main Body */}
          <ellipse cx="45" cy="50" rx="26" ry="29" fill="url(#owlBodyGrad)" stroke="#290f02" strokeWidth="2.5" />

          {/* Fluffy Tummy */}
          <ellipse cx="45" cy="56" rx="18" ry="21" fill="url(#owlBellyGrad)" stroke="#d97706" strokeWidth="1.5" />
          <path d="M38 48 Q45 52 52 48" stroke="#b45309" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M38 56 Q45 60 52 56" stroke="#b45309" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Giant Round Glasses & Eyes */}
          <circle cx="33" cy="36" r="14" fill="#ffffff" stroke="#d97706" strokeWidth="3.5" />
          <circle cx="33" cy="36" r="6.5" fill="#1e1b18" />
          <circle cx="31" cy="34" r="2.5" fill="#ffffff" />

          <circle cx="57" cy="36" r="14" fill="#ffffff" stroke="#d97706" strokeWidth="3.5" />
          <circle cx="57" cy="36" r="6.5" fill="#1e1b18" />
          <circle cx="55" cy="34" r="2.5" fill="#ffffff" />

          {/* Gold Spectacle Bridge */}
          <line x1="43" y1="36" x2="47" y2="36" stroke="#d97706" strokeWidth="3.5" />

          {/* Beak */}
          <polygon points="45,40 40,48 50,48" fill="#ea580c" stroke="#9a3412" strokeWidth="1" />

          {/* Feet */}
          <ellipse cx="36" cy="79" rx="6.5" ry="4" fill="#ea580c" />
          <ellipse cx="54" cy="79" rx="6.5" ry="4" fill="#ea580c" />
        </svg>
      </div>
    );
  }

  // 7. GOLDEN PUPPY PET GRAPHIC
  if (norm.includes('dog') || norm.includes('puppy')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <radialGradient id="puppyFur" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="30" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Floppy Ears */}
          <ellipse cx="22" cy="36" rx="8" ry="18" fill="#a16207" transform="rotate(20 22 36)" />
          <ellipse cx="68" cy="36" rx="8" ry="18" fill="#a16207" transform="rotate(-20 68 36)" />

          {/* Body */}
          <circle cx="45" cy="58" r="22" fill="url(#puppyFur)" stroke="#a16207" strokeWidth="2.5" />

          {/* Head */}
          <circle cx="45" cy="38" r="20" fill="url(#puppyFur)" stroke="#a16207" strokeWidth="2.5" />

          {/* Snout */}
          <ellipse cx="45" cy="44" rx="10" ry="8" fill="#ffffff" />
          <ellipse cx="45" cy="40" rx="4.5" ry="3.5" fill="#1e1b18" />

          {/* Sparkling Eyes */}
          <circle cx="35" cy="32" r="4.5" fill="#1e1b18" />
          <circle cx="36" cy="31" r="1.8" fill="#ffffff" />

          <circle cx="55" cy="32" r="4.5" fill="#1e1b18" />
          <circle cx="56" cy="31" r="1.8" fill="#ffffff" />

          {/* Red Collar & Gold Tag */}
          <path d="M28 52 Q45 60 62 52" stroke="#ef4444" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <circle cx="45" cy="56" r="4" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

          {/* Feet */}
          <ellipse cx="32" cy="78" rx="6.5" ry="4.5" fill="#ffffff" stroke="#eab308" strokeWidth="1.5" />
          <ellipse cx="58" cy="78" rx="6.5" ry="4.5" fill="#ffffff" stroke="#eab308" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // 8. MAGIC UNICORN PET GRAPHIC
  if (norm.includes('unicorn')) {
    return (
      <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
        <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
          <defs>
            <linearGradient id="unicornHorn" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="45" cy="84" rx="28" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

          {/* Sparkling Horn */}
          <polygon points="45,2 40,24 50,24" fill="url(#unicornHorn)" stroke="#ca8a04" strokeWidth="1.5" />

          {/* Body */}
          <ellipse cx="45" cy="58" rx="22" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />

          {/* Head */}
          <circle cx="45" cy="38" r="19" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />

          {/* Rainbow Mane */}
          <path d="M30 20 Q20 32 26 44" stroke="#f472b6" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M32 18 Q18 30 22 46" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Ears */}
          <polygon points="26,24 28,12 36,22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <polygon points="64,24 62,12 54,22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Shiny Anime Eye */}
          <circle cx="52" cy="34" r="5" fill="#1e1b18" />
          <circle cx="53" cy="33" r="2" fill="#ffffff" />

          {/* Blushing Cheeks */}
          <circle cx="42" cy="40" r="3.5" fill="#fbcfe8" opacity="0.9" />

          {/* Cute Muzzle */}
          <ellipse cx="56" cy="42" rx="6" ry="4" fill="#fbcfe8" />
          <circle cx="58" cy="41" r="1" fill="#be123c" />

          {/* Hooves */}
          <ellipse cx="32" cy="78" rx="6" ry="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="58" cy="78" rx="6" ry="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 9. DEFAULT PLUSH BUNNY PET GRAPHIC
  return (
    <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 animate-bounce-subtle ${className}`}>
      <svg viewBox="0 0 90 90" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
        <defs>
          <radialGradient id="bunnyFurGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="45" cy="84" rx="30" ry="6" fill="#000000" opacity="0.35" filter="blur(3px)" />

        {/* Floppy Ears */}
        <ellipse cx="31" cy="20" rx="8" ry="20" fill="url(#bunnyFurGrad)" stroke="#94a3b8" strokeWidth="2.5" />
        <ellipse cx="31" cy="20" rx="4.5" ry="14" fill="#f472b6" />

        <ellipse cx="59" cy="20" rx="8" ry="20" fill="url(#bunnyFurGrad)" stroke="#94a3b8" strokeWidth="2.5" />
        <ellipse cx="59" cy="20" rx="4.5" ry="14" fill="#f472b6" />

        {/* Body */}
        <circle cx="45" cy="58" r="22" fill="url(#bunnyFurGrad)" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Head */}
        <circle cx="45" cy="38" r="19" fill="url(#bunnyFurGrad)" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Blushing Cheeks */}
        <circle cx="30" cy="43" r="4" fill="#fbcfe8" opacity="0.95" />
        <circle cx="60" cy="43" r="4" fill="#fbcfe8" opacity="0.95" />

        {/* Anime Eyes */}
        <circle cx="35" cy="34" r="4.5" fill="#1e1b18" />
        <circle cx="36" cy="33" r="1.8" fill="#ffffff" />

        <circle cx="55" cy="34" r="4.5" fill="#1e1b18" />
        <circle cx="56" cy="33" r="1.8" fill="#ffffff" />

        {/* Pink Nose & Whiskers */}
        <polygon points="45,39 43,42 47,42" fill="#f43f5e" />
        <line x1="24" y1="41" x2="34" y2="41" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="24" y1="45" x2="35" y2="43" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="66" y1="41" x2="56" y2="41" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="66" y1="45" x2="55" y2="43" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Feet */}
        <ellipse cx="31" cy="76" rx="6.5" ry="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="59" cy="76" rx="6.5" ry="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
