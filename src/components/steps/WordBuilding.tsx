import React, { useState } from 'react';
import { Lesson } from '../../types';
import { soundService } from '../../services/soundService';
import { Volume2, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

interface WordBuildingProps {
  lesson: Lesson;
  onNextStep: () => void;
}

export const WordBuilding: React.FC<WordBuildingProps> = ({ lesson, onNextStep }) => {
  const { targetWords } = lesson.step4;
  const [wordIdx, setWordIdx] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isWordComplete, setIsWordComplete] = useState(false);

  const currentTarget = targetWords[wordIdx] || targetWords[0];

  const handleSelectTile = (letter: string) => {
    soundService.playPopSound();
    soundService.speak(letter, { pitch: 1.3 });
    setSelectedLetter(letter);

    if (letter === currentTarget.missingLetter) {
      setIsWordComplete(true);
      soundService.playSuccessChime();
      soundService.speak(`Awesome! ${currentTarget.word}!`, { pitch: 1.2 });
    } else {
      soundService.playBoopSound();
    }
  };

  const handleNextWord = () => {
    if (wordIdx < targetWords.length - 1) {
      setWordIdx((prev) => prev + 1);
      setSelectedLetter(null);
      setIsWordComplete(false);
    } else {
      onNextStep();
    }
  };

  const handleSpeakFullWord = () => {
    soundService.speak(currentTarget.word, { pitch: 1.2 });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-3xl p-5 border-3 border-amber-300 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-display font-extrabold text-amber-800 uppercase tracking-wider mb-1">
            Step 4: Word Building
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-amber-950">
            Tap the correct letter to build the word!
          </h3>
        </div>

        <button
          onClick={handleSpeakFullWord}
          className="p-3 bg-amber-300 hover:bg-amber-400 text-amber-950 rounded-2xl transition-all shadow-sm flex-shrink-0"
          title="Hear Word"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Main Word Builder Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-300 p-6 text-center shadow-lg space-y-6">
        <div className="text-7xl sm:text-8xl animate-bounce">
          {currentTarget.icon}
        </div>

        {/* Letter Slots */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {currentTarget.word.split('').map((char, index) => {
            const isMissing = char === currentTarget.missingLetter;
            const filled = isMissing ? isWordComplete ? currentTarget.missingLetter : selectedLetter : char;

            return (
              <div
                key={index}
                className={`w-14 h-16 sm:w-18 sm:h-20 rounded-2xl border-3 flex items-center justify-center text-3xl sm:text-4xl font-display font-black shadow-md transition-all ${
                  isMissing
                    ? isWordComplete
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 scale-105'
                      : 'bg-amber-100 border-dashed border-amber-400 text-amber-900'
                    : 'bg-amber-200 border-amber-400 text-amber-950'
                }`}
              >
                {filled || '?'}
              </div>
            );
          })}
        </div>

        {/* Scrambled Letter Choice Buttons */}
        <div className="pt-2 space-y-3">
          <div className="text-xs font-display font-bold uppercase tracking-wider text-amber-800">
            Choose a letter tile:
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {currentTarget.scrambledLetters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectTile(letter)}
                disabled={isWordComplete}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-display font-black text-2xl sm:text-3xl border-3 shadow-md transition-all transform active:scale-95 ${
                  selectedLetter === letter && isWordComplete
                    ? 'bg-emerald-500 border-emerald-600 text-white scale-110'
                    : 'bg-amber-300 hover:bg-amber-400 border-amber-500 text-amber-950 hover:scale-105'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isWordComplete && (
        <div className="bg-emerald-100 border-2 border-emerald-400 rounded-3xl p-4 text-center space-y-2 animate-bounce">
          <div className="flex items-center justify-center gap-2 text-emerald-900 font-display font-black text-xl">
            <CheckCircle className="w-6 h-6 text-emerald-600" /> Word Complete: {currentTarget.word}!
          </div>
        </div>
      )}

      {/* Next Step Action */}
      <div className="pt-2 text-right">
        <button
          onClick={handleNextWord}
          disabled={!isWordComplete}
          className={`w-full sm:w-auto px-8 py-3.5 font-display font-extrabold text-lg rounded-2xl shadow-lg border-2 transition-all flex items-center justify-center gap-2 mx-auto sm:ml-auto ${
            isWordComplete
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
          }`}
        >
          <span>
            {wordIdx < targetWords.length - 1 ? 'Next Word' : 'Next Step: Decodable Book'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
