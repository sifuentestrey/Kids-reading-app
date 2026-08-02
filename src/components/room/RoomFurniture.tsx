import React from 'react';

interface GraphicProps {
  className?: string;
  isPlaying?: boolean;
  colorIndex?: number;
}

// Common SVG Filters and Gradients shared across graphics
const SharedDefs = () => (
  <defs>
    {/* Soft Drop Shadow Filter */}
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#020617" floodOpacity="0.4" />
    </filter>

    {/* Glow Effect Filter */}
    <filter id="neonGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    {/* Rich Wood Grain Gradients */}
    <linearGradient id="oakWoodDark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#381302" />
      <stop offset="25%" stopColor="#622907" />
      <stop offset="60%" stopColor="#853a0a" />
      <stop offset="100%" stopColor="#240c01" />
    </linearGradient>

    <linearGradient id="oakWoodLight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f59e0b" />
      <stop offset="30%" stopColor="#d97706" />
      <stop offset="70%" stopColor="#b45309" />
      <stop offset="100%" stopColor="#78350f" />
    </linearGradient>

    <linearGradient id="brassMetallic" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="25%" stopColor="#f59e0b" />
      <stop offset="60%" stopColor="#d97706" />
      <stop offset="100%" stopColor="#78350f" />
    </linearGradient>

    <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#fef9c3" />
      <stop offset="40%" stopColor="#facc15" />
      <stop offset="80%" stopColor="#eab308" />
      <stop offset="100%" stopColor="#ca8a04" />
    </linearGradient>

    <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
    </linearGradient>
  </defs>
);

// 1. CANOPY BUNK BED GRAPHIC
export const TreehouseBedGraphic: React.FC<GraphicProps> = ({ className = "w-36 h-36" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 160 160" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      <defs>
        <linearGradient id="bedCanopyRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="40%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="bedQuiltGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <pattern id="bedStarPattern" width="16" height="16" patternUnits="userSpaceOnUse">
          <polygon points="8,1 10,6 15,6.5 11.5,10 12.5,15 8,12.5 3.5,15 4.5,10 1,6.5 6,6" fill="#fef08a" opacity="0.75" />
        </pattern>
      </defs>

      {/* Under-bed Contact Shadow */}
      <ellipse cx="80" cy="148" rx="68" ry="10" fill="#000000" opacity="0.35" filter="blur(5px)" />

      {/* Back Wooden Posts */}
      <rect x="24" y="20" width="14" height="126" rx="6" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="2" />
      <rect x="122" y="20" width="14" height="126" rx="6" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="2" />

      {/* Roof Canopy Gables */}
      <path d="M10 40 L80 10 L150 40 L140 52 L80 24 L20 52 Z" fill="url(#bedCanopyRoof)" stroke="#881337" strokeWidth="2.5" />
      <path d="M20 52 Q80 64 140 52" fill="none" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" />

      {/* Scalloped Fabric Trim */}
      <path d="M18 52 Q33 63 48 52 Q63 63 78 52 Q93 63 108 52 Q123 63 142 52" fill="none" stroke="#fb7185" strokeWidth="3.5" />

      {/* Twinkling Fairy String Lights */}
      <path d="M22 48 Q50 60 80 48 Q110 60 138 48" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="36" cy="54" r="3.5" fill="#fef08a" className="animate-pulse" />
      <circle cx="64" cy="55" r="3.5" fill="#38bdf8" className="animate-pulse" />
      <circle cx="92" cy="55" r="3.5" fill="#f43f5e" className="animate-pulse" />
      <circle cx="120" cy="54" r="3.5" fill="#a855f7" className="animate-pulse" />

      {/* Front Wooden Frame Posts */}
      <rect x="14" y="32" width="16" height="114" rx="7" fill="url(#oakWoodLight)" stroke="#1c0a00" strokeWidth="2" />
      <rect x="130" y="32" width="16" height="114" rx="7" fill="url(#oakWoodLight)" stroke="#1c0a00" strokeWidth="2" />

      {/* Mattress Wood Box */}
      <rect x="18" y="90" width="124" height="42" rx="12" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="3" />
      <rect x="22" y="82" width="116" height="34" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />

      {/* Quilt Blanket */}
      <path d="M56 82 H138 V118 Q138 126 130 126 H56 Z" fill="url(#bedQuiltGrad)" stroke="#0369a1" strokeWidth="2.5" />
      <path d="M56 82 H138 V118 H56 Z" fill="url(#bedStarPattern)" />

      {/* Folded Sheet Cuff */}
      <path d="M56 82 L56 96 Q96 100 138 96 L138 82 Z" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />

      {/* Soft Fluffy Pillows */}
      <rect x="28" y="84" width="26" height="22" rx="8" fill="url(#goldShine)" stroke="#ca8a04" strokeWidth="2" transform="rotate(-10 28 84)" />
      <rect x="42" y="86" width="24" height="20" rx="7" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />

      {/* Wooden Bunk Ladder */}
      <rect x="34" y="94" width="7" height="48" rx="3.5" fill="url(#oakWoodLight)" stroke="#1c0a00" strokeWidth="1" />
      <rect x="58" y="94" width="7" height="48" rx="3.5" fill="url(#oakWoodLight)" stroke="#1c0a00" strokeWidth="1" />
      <line x1="34" y1="104" x2="65" y2="104" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1="116" x2="65" y2="116" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1="128" x2="65" y2="128" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

// 2. COMFY COUCH GRAPHIC
export const ComfyCouchGraphic: React.FC<GraphicProps> = ({ className = "w-36 h-30" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 150 120" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      <defs>
        <linearGradient id="couchBackGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="couchSeatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="60%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="75" cy="108" rx="68" ry="9" fill="#000000" opacity="0.35" filter="blur(4px)" />

      {/* Wooden Legs */}
      <rect x="22" y="90" width="14" height="20" rx="5" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="2" />
      <rect x="114" y="90" width="14" height="20" rx="5" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="2" />

      {/* Tufted Backrest */}
      <rect x="14" y="20" width="122" height="64" rx="24" fill="url(#couchBackGrad)" stroke="#881337" strokeWidth="3.5" />
      
      {/* Deep Tufting Buttons */}
      <circle cx="38" cy="40" r="4" fill="#881337" />
      <circle cx="75" cy="40" r="4" fill="#881337" />
      <circle cx="112" cy="40" r="4" fill="#881337" />

      {/* Velvet Armrests */}
      <rect x="6" y="46" width="28" height="52" rx="14" fill="#9f1239" stroke="#4c0519" strokeWidth="3.5" />
      <rect x="116" y="46" width="28" height="52" rx="14" fill="#9f1239" stroke="#4c0519" strokeWidth="3.5" />

      {/* Cushions */}
      <rect x="26" y="58" width="98" height="36" rx="14" fill="url(#couchSeatGrad)" stroke="#881337" strokeWidth="3.5" />
      <line x1="75" y1="58" x2="75" y2="94" stroke="#881337" strokeWidth="3" strokeDasharray="4 3" />

      {/* Gold Star Pillow */}
      <polygon points="44,48 47,58 57,58 49,64 52,74 44,68 36,74 39,64 31,58 41,58" fill="url(#goldShine)" stroke="#ca8a04" strokeWidth="2" />

      {/* Velvet Round Pillow */}
      <circle cx="106" cy="62" r="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
      <circle cx="106" cy="62" r="5" fill="#bae6fd" />
    </svg>
  </div>
);

// 3. BOOKSHELF NOOK GRAPHIC
export const BookshelfGraphic: React.FC<GraphicProps> = ({ className = "w-30 h-36" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 130 150" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />

      {/* Shadow */}
      <ellipse cx="65" cy="142" rx="55" ry="7" fill="#000000" opacity="0.35" filter="blur(4px)" />

      {/* Timber Outer Frame */}
      <rect x="10" y="10" width="110" height="130" rx="14" fill="url(#oakWoodLight)" stroke="#1c0a00" strokeWidth="4.5" />
      <rect x="18" y="18" width="94" height="114" fill="#240c01" />

      {/* Shelves */}
      <rect x="16" y="56" width="98" height="10" rx="3" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="1.5" />
      <rect x="16" y="96" width="98" height="10" rx="3" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="1.5" />

      {/* Top Shelf Books */}
      <rect x="22" y="24" width="12" height="32" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
      <rect x="36" y="20" width="14" height="36" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
      <rect x="52" y="26" width="10" height="30" rx="2" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
      <rect x="64" y="22" width="12" height="34" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
      <rect x="78" y="28" width="20" height="26" rx="2" fill="#a855f7" stroke="#6b21a8" strokeWidth="1.5" transform="rotate(12 78 28)" />

      {/* Middle Shelf - Books & Trophy */}
      <rect x="24" y="66" width="14" height="30" rx="2" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
      <rect x="40" y="64" width="12" height="32" rx="2" fill="#06b6d4" stroke="#0e7490" strokeWidth="1.5" />

      {/* Golden Star Trophy */}
      <path d="M78 86 L88 86 L86 94 H80 Z" fill="#b45309" />
      <path d="M75 66 H91 L89 82 Q83 88 77 82 Z" fill="url(#goldShine)" stroke="#d97706" strokeWidth="1.5" />
      <polygon points="83,56 85,61 90,61 86,64 88,69 83,65 78,69 80,64 76,61 81,61" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />

      {/* Bottom Shelf Books */}
      <rect x="22" y="106" width="15" height="28" rx="2" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
      <rect x="39" y="104" width="13" height="30" rx="2" fill="#8b5cf6" stroke="#5b21b6" strokeWidth="1.5" />
      <rect x="54" y="107" width="11" height="27" rx="2" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
      <rect x="67" y="105" width="14" height="29" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
      <rect x="83" y="108" width="18" height="26" rx="2" fill="#e11d48" stroke="#9f1239" strokeWidth="1.5" />
    </svg>
  </div>
);

// 4. STAR TELESCOPE GRAPHIC
export const TelescopeGraphic: React.FC<GraphicProps> = ({ className = "w-30 h-36" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 130 150" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />

      {/* Shadow */}
      <ellipse cx="65" cy="142" rx="45" ry="7" fill="#000000" opacity="0.35" filter="blur(4px)" />

      {/* Tripod Legs */}
      <line x1="65" y1="80" x2="24" y2="140" stroke="url(#oakWoodDark)" strokeWidth="9" strokeLinecap="round" />
      <line x1="65" y1="80" x2="65" y2="142" stroke="#240c01" strokeWidth="8" strokeLinecap="round" />
      <line x1="65" y1="80" x2="106" y2="140" stroke="url(#oakWoodDark)" strokeWidth="9" strokeLinecap="round" />

      {/* Brass Braces */}
      <line x1="45" y1="110" x2="85" y2="110" stroke="#f59e0b" strokeWidth="4" />

      {/* Swivel Mount */}
      <circle cx="65" cy="80" r="12" fill="url(#brassMetallic)" stroke="#78350f" strokeWidth="3" />

      {/* Telescope Barrel */}
      <g transform="rotate(-34 65 65)">
        <rect x="20" y="54" width="96" height="22" rx="7" fill="url(#brassMetallic)" stroke="#78350f" strokeWidth="3.5" />
        <rect x="106" y="50" width="20" height="30" rx="6" fill="#f59e0b" stroke="#78350f" strokeWidth="3" />
        <rect x="10" y="60" width="16" height="10" rx="3" fill="#240c01" />

        {/* Lens Glaze */}
        <ellipse cx="116" cy="65" rx="3.5" ry="13" fill="#38bdf8" opacity="0.9" />
        <ellipse cx="114" cy="60" rx="1.5" ry="7" fill="#ffffff" opacity="0.9" />
      </g>

      {/* Sparkle Star */}
      <path d="M110 12 L113 22 L122 25 L113 28 L110 38 L107 28 L98 25 L107 22 Z" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" className="animate-pulse" />
    </svg>
  </div>
);

// 5. GIANT TEDDY BEAR GRAPHIC
export const TeddyBearGraphic: React.FC<GraphicProps> = ({ className = "w-28 h-32" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 120 130" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      <defs>
        <radialGradient id="bearFurRich" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="60" cy="120" rx="46" ry="8" fill="#000000" opacity="0.35" filter="blur(4px)" />

      {/* Ears */}
      <circle cx="30" cy="28" r="18" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="30" cy="28" r="10" fill="#fde68a" />
      <circle cx="90" cy="28" r="18" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="90" cy="28" r="10" fill="#fde68a" />

      {/* Feet Paws */}
      <ellipse cx="26" cy="102" rx="18" ry="13" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" />
      <ellipse cx="26" cy="102" rx="11" ry="8" fill="#fde68a" />
      <ellipse cx="94" cy="102" rx="18" ry="13" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" />
      <ellipse cx="94" cy="102" rx="11" ry="8" fill="#fde68a" />

      {/* Arms */}
      <ellipse cx="18" cy="72" rx="13" ry="22" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" transform="rotate(24 18 72)" />
      <ellipse cx="102" cy="72" rx="13" ry="22" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" transform="rotate(-24 102 72)" />

      {/* Round Tummy */}
      <circle cx="60" cy="76" r="33" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" />
      <ellipse cx="60" cy="78" rx="22" ry="24" fill="#fde68a" />

      {/* Head */}
      <circle cx="60" cy="44" r="28" fill="url(#bearFurRich)" stroke="#78350f" strokeWidth="2.5" />

      {/* Snout */}
      <ellipse cx="60" cy="50" rx="13" ry="11" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <ellipse cx="60" cy="45" rx="6" ry="4.5" fill="#240c01" />

      {/* Button Eyes */}
      <circle cx="48" cy="40" r="4.5" fill="#1e1b18" />
      <circle cx="49" cy="39" r="1.8" fill="#ffffff" />
      <circle cx="72" cy="40" r="4.5" fill="#1e1b18" />
      <circle cx="73" cy="39" r="1.8" fill="#ffffff" />

      {/* Bow Tie */}
      <polygon points="60,60 46,51 46,69" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
      <polygon points="60,60 74,51 74,69" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="4.5" fill="#be123c" />
    </svg>
  </div>
);

// 6. ALPHABET TRAIN SET GRAPHIC
export const WoodenTrainGraphic: React.FC<GraphicProps> = ({ className = "w-36 h-22" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 170 85" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-xl">
      <SharedDefs />

      {/* Track */}
      <path d="M10 70 Q85 78 160 70" stroke="#881337" strokeWidth="9" fill="none" strokeDasharray="10 5" />

      {/* Engine */}
      <rect x="15" y="30" width="38" height="30" rx="7" fill="#ef4444" stroke="#991b1b" strokeWidth="2.5" />
      <rect x="35" y="15" width="20" height="45" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" />
      <rect x="18" y="10" width="9" height="20" rx="3" fill="#1e293b" />
      <circle cx="22.5" cy="8" r="5" fill="#cbd5e1" />

      {/* Car A */}
      <rect x="62" y="36" width="30" height="24" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
      <text x="77" y="53" textAnchor="middle" fill="#ffffff" fontWeight="black" fontSize="15">A</text>

      {/* Car B */}
      <rect x="98" y="36" width="30" height="24" rx="6" fill="#10b981" stroke="#047857" strokeWidth="2.5" />
      <text x="113" y="53" textAnchor="middle" fill="#ffffff" fontWeight="black" fontSize="15">B</text>

      {/* Car C */}
      <rect x="134" y="36" width="28" height="24" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
      <text x="148" y="53" textAnchor="middle" fill="#ffffff" fontWeight="black" fontSize="15">C</text>

      {/* Wheels */}
      {[22, 43, 68, 84, 104, 120, 140, 154].map((cx, i) => (
        <circle key={i} cx={cx} cy="62" r="5.5" fill="#1e1b18" stroke="#cbd5e1" strokeWidth="1.5" />
      ))}
    </svg>
  </div>
);

// 7. PHONICS DESK GRAPHIC
export const PhonicsDeskGraphic: React.FC<GraphicProps> = ({ className = "w-34 h-34" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 130 130" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />

      {/* Shadow */}
      <ellipse cx="65" cy="118" rx="52" ry="7" fill="#000000" opacity="0.35" filter="blur(4px)" />

      {/* Desk Legs */}
      <rect x="22" y="66" width="9" height="48" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="1.5" />
      <rect x="99" y="66" width="9" height="48" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="1.5" />

      {/* Desk Top */}
      <rect x="14" y="56" width="102" height="18" rx="6" fill="url(#oakWoodLight)" stroke="#1c0a00" strokeWidth="3.5" />

      {/* Lamp */}
      <path d="M26 56 Q24 28 46 28" stroke="#0284c7" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M38 22 L54 32 L40 42 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
      <polygon points="46,34 68,56 40,56" fill="#fef08a" opacity="0.5" />

      {/* Workbook */}
      <rect x="56" y="46" width="40" height="14" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-6 56 46)" />
      <text x="60" y="55" fill="#ef4444" fontWeight="black" fontSize="9">A B C</text>

      {/* Stool */}
      <rect x="54" y="92" width="22" height="7" rx="2.5" fill="#f59e0b" stroke="#1c0a00" strokeWidth="1.5" />
      <rect x="57" y="99" width="4.5" height="20" fill="#78350f" />
      <rect x="68" y="99" width="4.5" height="20" fill="#78350f" />
    </svg>
  </div>
);

// 8. RAINBOW PLUSH RUG GRAPHIC
export const RainbowRugGraphic: React.FC<GraphicProps> = ({ className = "w-52 h-22" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 190 95" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-md">
      <ellipse cx="95" cy="47" rx="90" ry="42" fill="#e11d48" />
      <ellipse cx="95" cy="47" rx="78" ry="36" fill="#f97316" />
      <ellipse cx="95" cy="47" rx="66" ry="30" fill="#eab308" />
      <ellipse cx="95" cy="47" rx="54" ry="24" fill="#22c55e" />
      <ellipse cx="95" cy="47" rx="42" ry="18" fill="#06b6d4" />
      <ellipse cx="95" cy="47" rx="30" ry="13" fill="#a855f7" />
      <ellipse cx="95" cy="47" rx="18" ry="8" opacity="0.45" fill="#ffffff" />
    </svg>
  </div>
);

// 9. SECRET TENT GRAPHIC
export const SecretTentGraphic: React.FC<GraphicProps> = ({ className = "w-36 h-36" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 130 130" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />

      {/* Wooden Poles */}
      <line x1="16" y1="120" x2="70" y2="10" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
      <line x1="114" y1="120" x2="60" y2="10" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />

      {/* Tent Fabric */}
      <polygon points="65,22 14,115 116,115" fill="#06b6d4" stroke="#0891b2" strokeWidth="4" />
      <polygon points="65,22 14,115 65,115" fill="#0891b2" />

      {/* Door Flaps */}
      <polygon points="65,58 36,115 65,115" fill="#164e63" />
      <polygon points="65,58 94,115 65,115" fill="#155e75" />

      {/* Twinkling Fairy Lights */}
      <path d="M22 108 Q65 42 108 108" stroke="#fef08a" strokeWidth="3.5" fill="none" />
      <circle cx="36" cy="85" r="4.5" fill="#ef4444" className="animate-pulse" />
      <circle cx="54" cy="58" r="4.5" fill="#facc15" className="animate-pulse" />
      <circle cx="76" cy="58" r="4.5" fill="#22c55e" className="animate-pulse" />
      <circle cx="94" cy="85" r="4.5" fill="#38bdf8" className="animate-pulse" />
    </svg>
  </div>
);

// 10. TREEHOUSE HAMMOCK GRAPHIC
export const HammockGraphic: React.FC<GraphicProps> = ({ className = "w-40 h-22" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 170 75" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-xl">
      <SharedDefs />
      <line x1="6" y1="12" x2="32" y2="45" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      <line x1="164" y1="12" x2="138" y2="45" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
      <path d="M32 45 Q85 75 138 45 Q85 32 32 45 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="4" />
      <ellipse cx="52" cy="45" rx="16" ry="9" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
    </svg>
  </div>
);

// 11. POTTED PLANT GRAPHIC
export const PottedPlantGraphic: React.FC<GraphicProps> = ({ className = "w-22 h-26" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 110 130" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      <polygon points="26,76 84,76 70,122 40,122" fill="#ea580c" stroke="#9a3412" strokeWidth="4" />
      <rect x="22" y="68" width="66" height="15" rx="6" fill="#c2410c" stroke="#9a3412" strokeWidth="3" />
      <path d="M55 70 Q26 38 12 50 Q34 64 55 70 Z" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
      <path d="M55 70 Q84 38 98 50 Q76 64 55 70 Z" fill="#15803d" stroke="#14532d" strokeWidth="3" />
      <path d="M55 70 Q38 12 55 6 Q72 12 55 70 Z" fill="#22c55e" stroke="#14532d" strokeWidth="3" />
    </svg>
  </div>
);

// 12. RETRO TV GRAPHIC
export const RetroTvGraphic: React.FC<GraphicProps> = ({ className = "w-30 h-30", isPlaying = false }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 130 120" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />

      {/* Antennas */}
      <line x1="65" y1="26" x2="30" y2="6" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
      <line x1="65" y1="26" x2="100" y2="6" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />

      {/* Legs */}
      <rect x="28" y="98" width="9" height="18" rx="3.5" fill="#240c01" transform="rotate(15 28 98)" />
      <rect x="93" y="98" width="9" height="18" rx="3.5" fill="#240c01" transform="rotate(-15 93 98)" />

      {/* TV Body */}
      <rect x="12" y="24" width="106" height="78" rx="16" fill="url(#oakWoodDark)" stroke="#1c0a00" strokeWidth="4.5" />

      {/* TV Screen */}
      <rect x="20" y="32" width="68" height="62" rx="14" fill={isPlaying ? "#0284c7" : "#1e293b"} stroke="#0f172a" strokeWidth="3.5" />

      {/* Content */}
      {isPlaying ? (
        <g>
          <text x="54" y="70" textAnchor="middle" fill="#fef08a" fontWeight="bold" fontSize="28" className="animate-pulse">
            🎵
          </text>
        </g>
      ) : (
        <path d="M26 38 L82 88" stroke="#334155" strokeWidth="3.5" strokeDasharray="6 6" />
      )}

      {/* Dials */}
      <rect x="94" y="32" width="18" height="62" rx="6" fill="#240c01" />
      <circle cx="103" cy="45" r="5.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="103" cy="62" r="5.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  </div>
);

// 13. LAVA LAMP GRAPHIC
export const LavaLampGraphic: React.FC<GraphicProps> = ({ className = "w-18 h-30", colorIndex = 0 }) => {
  const colors = [
    { cap: '#ef4444', fluid: '#fee2e2', blob: '#dc2626' },
    { cap: '#3b82f6', fluid: '#dbeafe', blob: '#2563eb' },
    { cap: '#10b981', fluid: '#d1fae5', blob: '#059669' },
    { cap: '#a855f7', fluid: '#f3e8ff', blob: '#7c3aed' },
  ];
  const theme = colors[colorIndex % colors.length];

  return (
    <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
      <svg viewBox="0 0 75 125" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
        <SharedDefs />
        <polygon points="18,118 57,118 50,92 25,92" fill="#64748b" stroke="#334155" strokeWidth="3" />
        <polygon points="28,26 47,26 43,8 32,8" fill={theme.cap} stroke="#334155" strokeWidth="3" />
        <path d="M28 26 L47 26 L50 92 L25 92 Z" fill={theme.fluid} opacity="0.9" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="37" cy="78" r="9" fill={theme.blob} className="animate-bounce" />
        <circle cx="35" cy="52" r="7" fill={theme.blob} className="animate-pulse" />
      </svg>
    </div>
  );
};

// 14. NEON STAR LIGHT GRAPHIC
export const NeonStarGraphic: React.FC<GraphicProps> = ({ className = "w-26 h-30" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 110 120" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      <rect x="40" y="94" width="30" height="20" rx="7" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
      <rect x="52" y="80" width="6" height="14" fill="#64748b" />
      <polygon
        points="55,10 67,35 93,35 71,52 80,78 55,60 30,78 39,52 17,35 43,35"
        fill="#fef08a"
        stroke="#eab308"
        strokeWidth="6.5"
        strokeLinejoin="round"
        className="animate-pulse"
      />
    </svg>
  </div>
);

// 15. GLOWING AQUARIUM GRAPHIC
export const AquariumGraphic: React.FC<GraphicProps> = ({ className = "w-34 h-30" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 130 110" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      <rect x="12" y="20" width="106" height="72" rx="12" fill="#38bdf8" opacity="0.88" stroke="#0284c7" strokeWidth="5" />
      <rect x="10" y="14" width="110" height="14" rx="5" fill="#0f172a" />
      <rect x="14" y="90" width="102" height="12" rx="5" fill="#0f172a" />
      <ellipse cx="65" cy="88" rx="48" ry="6" fill="#fde047" />
      
      {/* Swimming Fish */}
      <polygon points="60,54 38,46 38,62" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <ellipse cx="66" cy="54" rx="16" ry="9" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <circle cx="75" cy="51" r="3.5" fill="#ffffff" />
      <circle cx="76" cy="51" r="1.8" fill="#000000" />
    </svg>
  </div>
);

// 16. RETRO JUKEBOX GRAPHIC
export const JukeboxGraphic: React.FC<GraphicProps> = ({ className = "w-30 h-34" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-105 duration-300 ${className}`}>
    <svg viewBox="0 0 120 140" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      <path d="M16 130 V54 A44 44 0 0 1 104 54 V130 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="6" />
      <path d="M26 130 V56 A34 34 0 0 1 94 56 V130" fill="none" stroke="#facc15" strokeWidth="7.5" className="animate-pulse" />
      <rect x="38" y="44" width="44" height="48" rx="7" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
      <line x1="38" y1="58" x2="82" y2="58" stroke="#ef4444" strokeWidth="3.5" />
      <line x1="38" y1="74" x2="82" y2="74" stroke="#3b82f6" strokeWidth="3.5" />
      <text x="60" y="115" textAnchor="middle" fill="#fef08a" fontSize="26" fontWeight="bold" className="animate-bounce">
        🎶
      </text>
    </svg>
  </div>
);

// 17. TWINKLING FAIRY LIGHTS GRAPHIC
export const FairyLightsGraphic: React.FC<GraphicProps> = ({ className = "w-full h-12" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto ${className}`}>
    <svg viewBox="0 0 300 40" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-lg">
      <SharedDefs />
      <path d="M10 10 Q75 32 150 12 Q225 32 290 10" fill="none" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="3 2" />
      <circle cx="25" cy="16" r="5" fill="#f43f5e" className="animate-pulse" />
      <circle cx="60" cy="22" r="5" fill="#38bdf8" className="animate-pulse" />
      <circle cx="95" cy="20" r="5" fill="#facc15" className="animate-pulse" />
      <circle cx="130" cy="16" r="5" fill="#a855f7" className="animate-pulse" />
      <circle cx="165" cy="16" r="5" fill="#22c55e" className="animate-pulse" />
      <circle cx="200" cy="20" r="5" fill="#fb923c" className="animate-pulse" />
      <circle cx="235" cy="22" r="5" fill="#f43f5e" className="animate-pulse" />
      <circle cx="270" cy="16" r="5" fill="#38bdf8" className="animate-pulse" />
    </svg>
  </div>
);

// 18. SPARKLE DISCO BALL GRAPHIC
export const DiscoBallGraphic: React.FC<GraphicProps> = ({ className = "w-24 h-28" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 ${className}`}>
    <svg viewBox="0 0 100 120" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-2xl">
      <SharedDefs />
      {/* Hanging Chain */}
      <line x1="50" y1="0" x2="50" y2="30" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 2" />
      
      {/* Disco Mirror Ball */}
      <circle cx="50" cy="65" r="32" fill="url(#glassReflection)" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="50" cy="65" r="32" fill="#e2e8f0" opacity="0.4" />

      {/* Grid Pattern */}
      <path d="M22 65 Q50 50 78 65 M22 65 Q50 80 78 65 M50 33 Q35 65 50 97 M50 33 Q65 65 50 97" stroke="#0284c7" strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* Rotating Light Rays */}
      <polygon points="50,65 10,10 20,5" fill="#fde047" opacity="0.4" className="animate-pulse" />
      <polygon points="50,65 90,10 80,5" fill="#38bdf8" opacity="0.4" className="animate-pulse" />
      <polygon points="50,65 5,100 15,110" fill="#f43f5e" opacity="0.4" className="animate-pulse" />
      <polygon points="50,65 95,100 85,110" fill="#a855f7" opacity="0.4" className="animate-pulse" />
    </svg>
  </div>
);

// 19. SPARKLE STAR WAND GRAPHIC
export const MagicWandGraphic: React.FC<GraphicProps> = ({ className = "w-20 h-24" }) => (
  <div className={`relative flex items-center justify-center bg-transparent p-0 m-0 border-0 shadow-none pointer-events-auto transition-transform hover:scale-110 duration-300 ${className}`}>
    <svg viewBox="0 0 80 100" className="w-full h-full bg-transparent overflow-visible filter drop-shadow-xl">
      <SharedDefs />
      {/* Wooden Wand Shaft */}
      <rect x="36" y="30" width="8" height="60" rx="4" fill="url(#oakWoodLight)" stroke="#78350f" strokeWidth="1.5" transform="rotate(-20 40 60)" />
      
      {/* Glowing Star Top */}
      <polygon
        points="40,5 46,20 62,20 48,30 54,46 40,36 26,46 32,30 18,20 34,20"
        fill="url(#goldShine)"
        stroke="#d97706"
        strokeWidth="2"
        className="animate-pulse"
      />
      {/* Sparkles */}
      <circle cx="15" cy="15" r="2.5" fill="#ffffff" className="animate-ping" />
      <circle cx="65" cy="18" r="3" fill="#38bdf8" className="animate-ping" />
    </svg>
  </div>
);
