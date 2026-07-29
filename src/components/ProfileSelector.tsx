import React from 'react';
import { LearnerProfile, LearnerId } from '../types';
import { Sparkles, Check, BookOpen, Award, X } from 'lucide-react';
import { soundService } from '../services/soundService';
import { AvatarImage } from './AvatarImage';

interface ProfileSelectorProps {
  profiles: LearnerProfile[];
  currentProfileId: LearnerId;
  onSelectProfile: (id: LearnerId) => void;
  onClose: () => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  currentProfileId,
  onSelectProfile,
  onClose,
}) => {
  const getChildBadge = (id: LearnerId) => {
    switch (id) {
      case 'tru':
        return '👦🏻 Boy';
      case 'ava':
        return '👗 White Dress';
      case 'alivia':
        return '👗 Blue Dress';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-full transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl">👋</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-950 mt-1">
            Who is Reading Today?
          </h2>
          <p className="text-amber-800 text-sm font-sans mt-1">
            Select your picture profile below to start reading!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {profiles.map((profile) => {
            const isSelected = profile.id === currentProfileId;
            return (
              <div
                key={profile.id}
                onClick={() => {
                  soundService.playPopSound();
                  soundService.speak(`Hello ${profile.name}! Let's read together!`);
                  onSelectProfile(profile.id);
                  onClose();
                }}
                className={`group relative cursor-pointer rounded-2xl border-4 p-5 text-center transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-95 ${
                  isSelected
                    ? 'border-amber-500 bg-white shadow-lg ring-4 ring-amber-300'
                    : 'border-amber-200 bg-amber-100/70 hover:bg-white'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm z-10">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div
                  className={`w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform group-hover:scale-105 ${profile.bgColor} flex items-center justify-center`}
                >
                  <AvatarImage
                    avatar={profile.avatar}
                    name={profile.name}
                    className="w-full h-full object-cover"
                    fallbackTextSize="text-5xl"
                  />
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 mt-3">
                  {profile.name}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-1 mt-1">
                  <span className="inline-block bg-amber-200 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {getChildBadge(profile.id)}
                  </span>
                  <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Age {profile.age}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200 space-y-1.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      Star Gems
                    </span>
                    <span className="font-bold text-slate-800">{profile.starGems}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                      Map Progress
                    </span>
                    <span className="font-bold text-slate-800">
                      Map {profile.currentMapLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-purple-500" />
                      Hatched Pets
                    </span>
                    <span className="font-bold text-slate-800">
                      {profile.unlockedPets.length} pets
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full mt-4 py-2 px-3 rounded-xl font-display font-bold text-sm shadow-sm transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-200 text-amber-900 group-hover:bg-amber-400 group-hover:text-amber-950'
                  }`}
                >
                  {isSelected ? 'Currently Active' : `Play as ${profile.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
