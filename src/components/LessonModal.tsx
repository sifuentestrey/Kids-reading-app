import React, { useState } from 'react';
import { Lesson } from '../types';
import { AnimatedLead } from './steps/AnimatedLead';
import { PhonemicDiscrimination } from './steps/PhonemicDiscrimination';
import { LetterTracing } from './steps/LetterTracing';
import { WordBuilding } from './steps/WordBuilding';
import { DecodableBook } from './steps/DecodableBook';
import { X } from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
  onFinishLesson: (lessonId: number) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  onClose,
  onFinishLesson,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const steps = [
    { num: 1, title: 'Sound Intro' },
    { num: 2, title: 'Sound Hunt' },
    { num: 3, title: 'Letter Trace' },
    { num: 4, title: 'Word Build' },
    { num: 5, title: 'Story & Quiz' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl p-4 sm:p-6 my-auto max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-2xl">
              Lesson {lesson.id}
            </span>
            <span className="text-sm font-display font-semibold text-slate-700 hidden sm:inline">
              {lesson.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-full transition-all"
            title="Exit Lesson"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-6">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;

            return (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num <= currentStep) {
                    setCurrentStep(s.num as 1 | 2 | 3 | 4 | 5);
                  }
                }}
                className={`py-2 px-1 rounded-2xl text-center border-2 transition-all font-display ${
                  isActive
                    ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-md font-bold scale-105'
                    : isDone
                    ? 'bg-emerald-500 border-emerald-600 text-white font-bold'
                    : 'bg-amber-100 border-amber-200 text-amber-700 opacity-60'
                }`}
              >
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  Step {s.num}
                </div>
                <div className="text-[11px] font-extrabold truncate hidden xs:block">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        <div>
          {currentStep === 1 && (
            <AnimatedLead
              lesson={lesson}
              onNextStep={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <PhonemicDiscrimination
              lesson={lesson}
              onNextStep={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <LetterTracing
              lesson={lesson}
              onNextStep={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <WordBuilding
              lesson={lesson}
              onNextStep={() => setCurrentStep(5)}
            />
          )}

          {currentStep === 5 && (
            <DecodableBook
              lesson={lesson}
              onCompleteLesson={() => onFinishLesson(lesson.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
