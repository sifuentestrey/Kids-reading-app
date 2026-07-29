import React, { useEffect, useState } from 'react';
import { Lesson } from '../../types';
import { Volume2, ArrowRight, Sparkles, VolumeX } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface AnimatedLeadProps {
  lesson: Lesson;
  onNextStep: () => void;
}

export const AnimatedLead: React.FC<AnimatedLeadProps> = ({ lesson, onNextStep }) => {
  const { mascotName, mascotEmoji, vocalMouth, instructionText, phonicAudioText, exampleWords } = lesson.step1;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Automatically play phonics introductory speech on load
    handlePlayPhonics();
  }, [lesson.id]);

  const handlePlayPhonics = () => {
    setIsPlaying(true);
    soundService.speak(phonicAudioText, {
      onEnd: () => setIsPlaying(false),
    });
  };

  const handlePlayWord = (word: string) => {
    soundService.playPopSound();
    soundService.speak(word, { pitch: 1.25, rate: 0.8 });
  };

  const getMouthGraphic = () => {
    switch (vocalMouth) {
      case 'open':
        return '👄'; // Big open mouth
      case 'round':
        return '😮'; // O mouth
      case 'wide':
        return '😀'; // Wide smile mouth
      default:
        return '🗣️';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Mascot Banner Header */}
      <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 rounded-3xl p-6 border-3 border-amber-300 shadow-md flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="relative flex-shrink-0">
          <div className="text-7xl sm:text-8xl animate-bounce drop-shadow-md">
            {mascotEmoji}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full border-2 border-amber-400 text-2xl shadow-sm" title={`Mouth shape: ${vocalMouth}`}>
            {getMouthGraphic()}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-300/80 px-3 py-1 rounded-full text-amber-950 font-display font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Sound Guide: {mascotName}
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-amber-950">
            Learn Sound /{lesson.targetSound.toLowerCase()}/ with Letter {lesson.targetLetter}!
          </h3>
          <p className="text-slate-700 font-medium text-base leading-relaxed">
            {instructionText}
          </p>
        </div>
      </div>

      {/* Primary Target Sound Interactive Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 text-center shadow-lg space-y-4">
        <div className="inline-block bg-amber-100 rounded-2xl px-8 py-4 border-2 border-amber-300 shadow-inner">
          <span className="text-6xl sm:text-7xl font-display font-black text-amber-900 tracking-wider">
            {lesson.targetLetter}
          </span>
          <span className="text-3xl font-display font-bold text-amber-600 ml-3">
            /{lesson.targetSound.toLowerCase()}/
          </span>
        </div>

        <div>
          <button
            onClick={handlePlayPhonics}
            disabled={isPlaying}
            className={`px-6 py-3 rounded-2xl font-display font-black text-lg flex items-center justify-center gap-3 mx-auto shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-300 text-amber-900 scale-95'
                : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-6 h-6 animate-pulse" /> Listening...
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6" /> Press to Listen Phonics
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Words Grid */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-lg text-amber-950 text-center sm:text-left">
          Tap an Example Word to Hear It:
        </h4>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {exampleWords.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handlePlayWord(item.word)}
              className="group bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              <div className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="font-display font-extrabold text-slate-800 text-base sm:text-lg">
                {item.word}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Next Step Action */}
      <div className="pt-2 text-right">
        <button
          onClick={() => {
            soundService.playSuccessChime();
            onNextStep();
          }}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg rounded-2xl shadow-lg border-2 border-emerald-600 transition-all flex items-center justify-center gap-2 mx-auto sm:ml-auto"
        >
          <span>Next Step: Sound Hunt</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
