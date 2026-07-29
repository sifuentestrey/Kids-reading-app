import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Pet } from '../types';
import { soundService } from '../services/soundService';
import { Sparkles, Heart, Check } from 'lucide-react';

interface EggHatchingModalProps {
  pet: Pet;
  onClose: () => void;
}

export const EggHatchingModal: React.FC<EggHatchingModalProps> = ({ pet, onClose }) => {
  const [isHatched, setIsHatched] = useState(false);

  useEffect(() => {
    soundService.playEggHatchFanfare();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => {
      setIsHatched(true);
      soundService.speak(`A mysterious egg hatched into ${pet.name} the ${pet.species}!`);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pet]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl p-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-950 font-display font-bold text-xs px-3 py-1 rounded-full border border-amber-400">
          <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
          <span>Milestone Achievement Unlocked!</span>
        </div>

        {!isHatched ? (
          <div className="space-y-4 py-6">
            <div className="text-8xl animate-wobble inline-block cursor-pointer">
              🥚
            </div>
            <h2 className="text-2xl font-display font-extrabold text-amber-950">
              The Egg is Cracking...
            </h2>
            <p className="text-sm text-amber-800">
              Look closely! A new reading companion is hatching!
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in py-2">
            <div className="relative inline-block">
              <div className="text-8xl animate-bounce p-4 bg-amber-200/60 rounded-3xl border-2 border-amber-300 shadow-lg">
                {pet.icon}
              </div>
              <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-2 shadow-md">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-display font-extrabold text-amber-950">
                Meet {pet.name}!
              </h2>
              <span className="inline-block bg-amber-200 text-amber-900 font-display font-bold text-xs px-3 py-1 rounded-full mt-1">
                {pet.species}
              </span>
              <p className="text-sm text-slate-700 font-medium mt-3 bg-white p-3 rounded-2xl border border-amber-200">
                "{pet.description}"
              </p>
            </div>

            <button
              onClick={() => {
                soundService.playSuccessChime();
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg py-3.5 rounded-2xl border-2 border-emerald-600 shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>Welcome {pet.name} to Your Treehouse!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
