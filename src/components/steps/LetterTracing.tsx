import React, { useRef, useState, useEffect } from 'react';
import { Lesson } from '../../types';
import { soundService } from '../../services/soundService';
import { RefreshCw, ArrowRight, Volume2, Sparkles, Check } from 'lucide-react';

interface LetterTracingProps {
  lesson: Lesson;
  onNextStep: () => void;
}

export const LetterTracing: React.FC<LetterTracingProps> = ({ lesson, onNextStep }) => {
  const { letterToTrace, guideLines, matchingPairs } = lesson.step3;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracedPoints, setTracedPoints] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#3b82f6'; // Bright blue trace line
  }, []);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    soundService.playPopSound();

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    checkGuidePointHit(x, y, rect.width, rect.height);
  };

  const handleMoveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    checkGuidePointHit(x, y, rect.width, rect.height);
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
  };

  const checkGuidePointHit = (x: number, y: number, canvasWidth: number, canvasHeight: number) => {
    guideLines.forEach((point, index) => {
      const targetX = (point.x / 100) * canvasWidth;
      const targetY = (point.y / 100) * canvasHeight;

      const dist = Math.hypot(x - targetX, y - targetY);
      if (dist < 35) {
        setTracedPoints((prev) => {
          const next = prev + 1;
          if (next >= guideLines.length && !isCompleted) {
            setIsCompleted(true);
            soundService.playSuccessChime();
            soundService.speak(`Great tracing! Letter ${letterToTrace}!`, { pitch: 1.3 });
          }
          return next;
        });
      }
    });
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTracedPoints(0);
    setIsCompleted(false);
  };

  const handleSpeakLetter = () => {
    soundService.speak(`Letter ${letterToTrace}! Sound /${lesson.targetSound.toLowerCase()}/!`, { pitch: 1.2 });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-3xl p-5 border-3 border-amber-300 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-display font-extrabold text-amber-800 uppercase tracking-wider mb-1">
            Step 3: Letter Trace
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-amber-950">
            Trace the letter {letterToTrace} with your finger or mouse!
          </h3>
        </div>

        <button
          onClick={handleSpeakLetter}
          className="p-3 bg-amber-300 hover:bg-amber-400 text-amber-950 rounded-2xl transition-all shadow-sm flex-shrink-0"
          title="Hear Letter Sound"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Interactive Tracing Canvas Area */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden flex items-center justify-center">
          {/* Guide Letter Ghost Background */}
          <span className="absolute inset-0 flex items-center justify-center text-[180px] sm:text-[200px] font-display font-black text-amber-200 select-none pointer-events-none opacity-60">
            {letterToTrace}
          </span>

          {/* Guide Point Stars */}
          {guideLines.map((point, idx) => (
            <div
              key={idx}
              className="absolute w-7 h-7 rounded-full bg-amber-400 border-2 border-amber-600 text-amber-950 flex items-center justify-center font-display font-bold text-xs shadow-md animate-pulse pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              {idx + 1}
            </div>
          ))}

          {/* Canvas Layer */}
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            onMouseDown={handleStartDraw}
            onMouseMove={handleMoveDraw}
            onMouseUp={handleEndDraw}
            onTouchStart={handleStartDraw}
            onTouchMove={handleMoveDraw}
            onTouchEnd={handleEndDraw}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearCanvas}
            className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl font-display font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Clear Canvas
          </button>

          <button
            onClick={handleSpeakLetter}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl font-display font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Say Letter
          </button>
        </div>
      </div>

      {/* Matching Pair Display */}
      {matchingPairs && matchingPairs.length > 0 && (
        <div className="bg-amber-100/80 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-center gap-4 text-center">
          <span className="text-2xl">{matchingPairs[0].icon}</span>
          <span className="font-display font-extrabold text-amber-950 text-lg">
            {letterToTrace} is for {matchingPairs[0].word}!
          </span>
        </div>
      )}

      {/* Next Step Action */}
      <div className="pt-2 text-right">
        <button
          onClick={() => {
            soundService.playSuccessChime();
            onNextStep();
          }}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg rounded-2xl shadow-lg border-2 border-emerald-600 transition-all flex items-center justify-center gap-2 mx-auto sm:ml-auto"
        >
          <span>Next Step: Word Building</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
