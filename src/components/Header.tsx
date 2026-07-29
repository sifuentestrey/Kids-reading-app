import React from 'react';
import { LearnerProfile } from '../types';
import { Sparkles, Home, ShieldCheck, Volume2, VolumeX, MapPin } from 'lucide-react';
import { AvatarImage } from './AvatarImage';

interface HeaderProps {
  currentProfile: LearnerProfile;
  onOpenProfileSelector: () => void;
  onOpenTreehouse: () => void;
  onOpenParentPortal: () => void;
  activeMapLevel: 1 | 2 | 3;
  onChangeMapLevel: (level: 1 | 2 | 3) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  onOpenProfileSelector,
  onOpenTreehouse,
  onOpenParentPortal,
  activeMapLevel,
  onChangeMapLevel,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-amber-100/95 backdrop-blur-md border-b-4 border-amber-300 px-3 sm:px-4 py-2 shadow-md touch-manipulation">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-display text-lg sm:text-2xl font-bold px-3 py-1.5 rounded-2xl shadow-sm border-2 border-amber-500 shrink-0">
            <span>📖</span>
            <span className="hidden xs:inline">ReadWithMe</span>
          </div>

          <button
            onClick={onOpenProfileSelector}
            className={`flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-full border-2 border-white shadow-sm transition-all transform hover:scale-105 active:scale-95 ${currentProfile.bgColor} text-white font-display font-semibold select-none`}
            title="Switch Profile"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 shrink-0 flex items-center justify-center bg-white/20">
              <AvatarImage avatar={currentProfile.avatar} name={currentProfile.name} fallbackTextSize="text-xl" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm leading-none font-bold">{currentProfile.name}</div>
              <div className="text-[10px] opacity-90 leading-tight">Age {currentProfile.age}</div>
            </div>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">Switch</span>
          </button>
        </div>

        {/* Map Level Selector - iPad Touch Friendly */}
        <div className="flex items-center gap-1 bg-amber-200/90 p-1 rounded-2xl border-2 border-amber-300">
          <button
            onClick={() => onChangeMapLevel(1)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 min-h-[38px] rounded-xl font-display font-bold text-xs sm:text-sm transition-all select-none ${
              activeMapLevel === 1
                ? 'bg-rose-500 text-white shadow-sm scale-105'
                : 'text-amber-900 hover:bg-amber-300/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map 1 (Zoo)</span>
          </button>

          <button
            onClick={() => onChangeMapLevel(2)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 min-h-[38px] rounded-xl font-display font-bold text-xs sm:text-sm transition-all select-none ${
              activeMapLevel === 2
                ? 'bg-emerald-600 text-white shadow-sm scale-105'
                : 'text-amber-900 hover:bg-amber-300/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map 2 (Playground)</span>
          </button>

          <button
            onClick={() => onChangeMapLevel(3)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 min-h-[38px] rounded-xl font-display font-bold text-xs sm:text-sm transition-all select-none ${
              activeMapLevel === 3
                ? 'bg-sky-600 text-white shadow-sm scale-105'
                : 'text-amber-900 hover:bg-amber-300/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map 3 (Island)</span>
          </button>
        </div>

        {/* Gems, Treehouse & Parent Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-yellow-300 border-2 border-yellow-500 text-yellow-950 px-3 py-1.5 min-h-[40px] rounded-full font-display font-bold text-sm shadow-inner shrink-0">
            <Sparkles className="w-4 h-4 text-amber-700 fill-amber-500" />
            <span>{currentProfile.starGems} Stars</span>
          </div>

          <button
            onClick={onOpenTreehouse}
            className="flex items-center gap-1.5 bg-lime-500 hover:bg-lime-600 active:scale-95 text-white font-display font-bold px-3 py-2 min-h-[44px] rounded-2xl border-2 border-lime-600 shadow-md transition-all select-none"
            title="Visit Treehouse & Shop"
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Treehouse Room</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-2xl border-2 border-amber-400 transition-all select-none"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-rose-500" />}
          </button>

          <button
            onClick={onOpenParentPortal}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-slate-100 font-display text-xs font-semibold px-3 py-2 min-h-[44px] rounded-2xl border-2 border-slate-900 shadow-sm transition-all select-none"
            title="Parent Portal & Save Controls"
          >
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
            <span className="hidden lg:inline">Parents</span>
          </button>
        </div>
      </div>
    </header>
  );
};
