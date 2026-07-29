import React, { useState } from 'react';
import { Lesson } from '../../types';
import { soundService } from '../../services/soundService';
import { Volume2, ChevronRight, ChevronLeft, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface DecodableBookProps {
  lesson: Lesson;
  onCompleteLesson: () => void;
}

export const DecodableBook: React.FC<DecodableBookProps> = ({ lesson, onCompleteLesson }) => {
  const { bookTitle, coverEmoji, pages, questions } = lesson.step5;
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentPage = pages[currentPageIdx] || pages[0];

  const handleReadPage = () => {
    soundService.speak(currentPage.audioText, { pitch: 1.15, rate: 0.85 });
  };

  const handleNextPage = () => {
    if (currentPageIdx < pages.length - 1) {
      setCurrentPageIdx((prev) => prev + 1);
      soundService.playPopSound();
    } else {
      setShowQuiz(true);
      soundService.playSuccessChime();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx((prev) => prev - 1);
      soundService.playPopSound();
    }
  };

  const handleSelectQuizOption = (qId: number, optionId: string, isCorrect: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionId }));

    if (isCorrect) {
      soundService.playSuccessChime();
    } else {
      soundService.playBoopSound();
    }
  };

  const isQuizPassed = questions.every((q) => {
    const selectedOptId = quizAnswers[q.id];
    return q.options.find((opt) => opt.id === selectedOptId)?.isCorrect;
  });

  const handleFinish = () => {
    soundService.playEggHatchFanfare();
    setIsFinished(true);
    onCompleteLesson();
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-3xl p-5 border-3 border-amber-300 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-display font-extrabold text-amber-800 uppercase tracking-wider mb-1">
            Step 5: Decodable Reader & Quiz
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-amber-950 flex items-center gap-2">
            <span>{coverEmoji}</span> {bookTitle}
          </h3>
        </div>
      </div>

      {!showQuiz ? (
        /* Decodable Story Pages View */
        <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 text-center shadow-xl space-y-6">
          <div className="flex items-center justify-between text-xs font-display font-bold text-amber-800">
            <span>Page {currentPage.pageNumber} of {pages.length}</span>
            <button
              onClick={handleReadPage}
              className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Volume2 className="w-4 h-4" /> Read Aloud
            </button>
          </div>

          <div className="text-7xl sm:text-8xl my-4 animate-bounce">
            {currentPage.imageEmoji}
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 text-2xl sm:text-3xl font-display font-bold text-slate-800 leading-relaxed tracking-wide">
            {currentPage.sentence.split(' ').map((word, idx) => {
              const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
              const isHighlighted = currentPage.highlightWords?.some(
                (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
              );

              return (
                <span
                  key={idx}
                  className={
                    isHighlighted
                      ? 'inline-block bg-amber-300 text-amber-950 px-2 py-0.5 rounded-lg border-b-2 border-amber-500 mx-1'
                      : 'mx-1'
                  }
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIdx === 0}
              className={`px-5 py-2.5 rounded-2xl font-display font-bold text-base flex items-center gap-1 ${
                currentPageIdx === 0
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-amber-200 hover:bg-amber-300 text-amber-950'
              }`}
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            <button
              onClick={handleNextPage}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-display font-extrabold text-lg flex items-center gap-2 shadow-md transition-all"
            >
              <span>{currentPageIdx < pages.length - 1 ? 'Next Page' : 'Start Quick Quiz'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Comprehension Quiz View */
        <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 text-center shadow-xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-200 px-4 py-1.5 rounded-full font-display font-bold text-amber-950 text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" /> Story Comprehension Check
          </div>

          {questions.map((q) => {
            const selectedOptId = quizAnswers[q.id];

            return (
              <div key={q.id} className="space-y-4 text-left bg-amber-50 p-5 rounded-2xl border-2 border-amber-200">
                <h4 className="font-display font-bold text-xl text-slate-900">
                  {q.prompt}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectQuizOption(q.id, opt.id, opt.isCorrect)}
                        className={`p-4 rounded-2xl border-2 font-display font-bold text-base text-left flex items-center gap-3 transition-all ${
                          isSelected && opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-md'
                            : isSelected && !opt.isCorrect
                            ? 'bg-rose-100 border-rose-400 text-rose-950'
                            : 'bg-white hover:bg-amber-100 border-amber-300 text-slate-800'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="flex-1">{opt.text}</span>
                        {isSelected && opt.isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <button
              onClick={handleFinish}
              disabled={!isQuizPassed || isFinished}
              className={`w-full py-4 rounded-2xl font-display font-black text-xl shadow-xl border-2 flex items-center justify-center gap-3 transition-all ${
                isQuizPassed && !isFinished
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 hover:scale-102'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
            >
              <Award className="w-7 h-7" />
              <span>Complete Lesson & Claim Star Gems!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
