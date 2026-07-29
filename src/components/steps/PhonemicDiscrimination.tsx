import React, { useState } from 'react';
import { Lesson } from '../../types';
import { soundService } from '../../services/soundService';
import { Volume2, ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface PhonemicDiscriminationProps {
  lesson: Lesson;
  onNextStep: () => void;
}

export const PhonemicDiscrimination: React.FC<PhonemicDiscriminationProps> = ({
  lesson,
  onNextStep,
}) => {
  const { instruction, targetSound, items } = lesson.step2;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, boolean>>({});

  const correctItemCount = items.filter((item) => item.startsWithTarget).length;
  const foundCorrectCount = items.filter(
    (item) => item.startsWithTarget && selectedIds.includes(item.id)
  ).length;

  const isAllFound = foundCorrectCount === correctItemCount;

  const handleItemClick = (item: { id: string; word: string; startsWithTarget: boolean }) => {
    // Speak word
    soundService.speak(item.word, { pitch: 1.2 });

    if (selectedIds.includes(item.id)) return;

    setSelectedIds((prev) => [...prev, item.id]);

    if (item.startsWithTarget) {
      soundService.playSuccessChime();
      setFeedbackMap((prev) => ({ ...prev, [item.id]: true }));
    } else {
      soundService.playBoopSound();
      setFeedbackMap((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleHearTarget = () => {
    soundService.speak(`Find words starting with /${targetSound.toLowerCase()}/!`, { pitch: 1.2 });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Step Header Instruction */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-3xl p-5 border-3 border-amber-300 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-display font-extrabold text-amber-800 uppercase tracking-wider mb-1">
            Step 2: Sound Hunt
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-amber-950">
            {instruction}
          </h3>
        </div>

        <button
          onClick={handleHearTarget}
          className="p-3 bg-amber-300 hover:bg-amber-400 text-amber-950 rounded-2xl transition-all shadow-sm flex-shrink-0"
          title="Repeat Instruction"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Gems Bar */}
      <div className="bg-amber-100/70 rounded-2xl p-3 border-2 border-amber-200 flex items-center justify-between text-amber-900 font-display font-bold">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-amber-600 fill-amber-400" />
          Target Stars Found:
        </span>
        <span className="text-lg bg-amber-300 px-3 py-1 rounded-xl">
          {foundCorrectCount} / {correctItemCount}
        </span>
      </div>

      {/* Picture Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isCorrect = feedbackMap[item.id] === true;
          const isWrong = feedbackMap[item.id] === false;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`relative p-5 rounded-3xl border-3 text-center transition-all transform active:scale-95 ${
                isSelected && isCorrect
                  ? 'bg-emerald-100 border-emerald-500 shadow-md scale-102'
                  : isSelected && isWrong
                  ? 'bg-rose-100 border-rose-400 opacity-70'
                  : 'bg-white hover:bg-amber-50 border-amber-300 shadow-sm hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <div className="text-5xl sm:text-6xl mb-2">{item.icon}</div>
              <div className="font-display font-black text-slate-800 text-lg sm:text-xl">
                {item.word}
              </div>

              {isSelected && isCorrect && (
                <div className="absolute top-2 right-2 text-emerald-600">
                  <CheckCircle2 className="w-7 h-7 fill-emerald-200" />
                </div>
              )}

              {isSelected && isWrong && (
                <div className="absolute top-2 right-2 text-rose-500">
                  <XCircle className="w-7 h-7 fill-rose-200" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Banner or Continue button */}
      {isAllFound && (
        <div className="bg-emerald-100 border-2 border-emerald-400 rounded-3xl p-4 text-center space-y-2 animate-bounce">
          <span className="text-3xl">🌟 Great Job! You found all /${targetSound.toLowerCase()}/ words! 🌟</span>
        </div>
      )}

      <div className="pt-2 text-right">
        <button
          onClick={() => {
            soundService.playSuccessChime();
            onNextStep();
          }}
          disabled={!isAllFound && foundCorrectCount === 0}
          className={`w-full sm:w-auto px-8 py-3.5 font-display font-extrabold text-lg rounded-2xl shadow-lg border-2 transition-all flex items-center justify-center gap-2 mx-auto sm:ml-auto ${
            isAllFound || foundCorrectCount > 0
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
          }`}
        >
          <span>Next Step: Letter Trace</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
