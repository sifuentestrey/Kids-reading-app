import React, { useState } from 'react';
import { LearnerProfile } from '../types';
import { Sparkles, X } from 'lucide-react';
import { soundService } from '../services/soundService';

interface DiagnosticTestModalProps {
  currentProfile: LearnerProfile;
  onApplyDiagnosticResults: (mapLevel: 1 | 2 | 3) => void;
  onClose: () => void;
}

export const DiagnosticTestModal: React.FC<DiagnosticTestModalProps> = ({
  currentProfile,
  onApplyDiagnosticResults,
  onClose,
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const questions = [
    {
      id: 1,
      prompt: `Can ${currentProfile.name} identify the letter sound for S (/s/)?`,
      options: [
        { text: 'Yes, knows /s/ sound easily', points: 1 },
        { text: 'Needs practice with letter sounds', points: 0 },
      ],
    },
    {
      id: 2,
      prompt: `Can ${currentProfile.name} blend 3-letter CVC words like CAT or DOG?`,
      options: [
        { text: 'Yes, blends simple CVC words', points: 2 },
        { text: 'Just learning letter recognition', points: 0 },
      ],
    },
    {
      id: 3,
      prompt: `Can ${currentProfile.name} read consonant blends like STAR or STOP?`,
      options: [
        { text: 'Yes, reads blends and short sentences', points: 3 },
        { text: 'Not yet', points: 0 },
      ],
    },
  ];

  const handleAnswer = (points: number) => {
    soundService.playPopSound();
    const newScore = score + points;
    setScore(newScore);

    if (questionIdx < questions.length - 1) {
      setQuestionIdx((q) => q + 1);
    } else {
      soundService.playSuccessChime();
      setIsDone(true);
    }
  };

  const recommendedMapLevel: 1 | 2 | 3 = score >= 4 ? 3 : score >= 2 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl p-6 text-center space-y-6">
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-600 fill-amber-400" />
            <h3 className="font-display font-bold text-xl text-slate-900">
              Adaptive Placement Diagnostic
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isDone ? (
          <div className="space-y-6 py-2">
            <span className="bg-amber-200 text-amber-900 font-display font-bold text-xs px-3 py-1 rounded-full">
              Question {questionIdx + 1} of {questions.length}
            </span>

            <h4 className="text-xl font-display font-bold text-slate-900">
              {questions[questionIdx].prompt}
            </h4>

            <div className="space-y-3">
              {questions[questionIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.points)}
                  className="w-full p-4 bg-white hover:bg-amber-100 border-2 border-amber-300 rounded-2xl font-display font-bold text-slate-800 text-left shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2 animate-fade-in">
            <div className="text-6xl animate-bounce">🎯</div>

            <div>
              <h4 className="text-2xl font-display font-bold text-amber-950">
                Placement Complete!
              </h4>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                Based on diagnostic responses, we recommend starting {currentProfile.name} on:
              </p>
              <div className="mt-3 inline-block bg-emerald-500 text-white font-display font-extrabold text-lg px-5 py-2 rounded-2xl shadow-md border-2 border-emerald-600">
                Map Level {recommendedMapLevel}:{' '}
                {recommendedMapLevel === 1
                  ? 'The Magical Zoo (Emergent Pre-K)'
                  : recommendedMapLevel === 2
                  ? 'The Wonder Playground (Kindergarten CVC)'
                  : 'The Adventure Island (Advanced Blends)'}
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playSuccessChime();
                onApplyDiagnosticResults(recommendedMapLevel);
                onClose();
              }}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg rounded-2xl shadow-xl border-2 border-emerald-600 transition-all"
            >
              Apply Recommended Level Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
