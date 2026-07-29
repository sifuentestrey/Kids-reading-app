import React, { useState, useEffect } from 'react';
import { LearnerProfile } from '../types';
import { X, Heart, RotateCcw } from 'lucide-react';
import { soundService } from '../services/soundService';

interface MiniGameModalProps {
  gameId: string;
  currentProfile: LearnerProfile;
  onClose: () => void;
}

export const MiniGameModal: React.FC<MiniGameModalProps> = ({
  gameId,
  currentProfile,
  onClose,
}) => {
  const [bubbles, setBubbles] = useState<
    { id: number; text: string; x: number; y: number; popped: boolean }[]
  >([]);
  const [score, setScore] = useState(0);

  const [stickersOnCanvas, setStickersOnCanvas] = useState<
    { id: number; emoji: string; x: number; y: number }[]
  >([]);

  const [selectedPetIdx] = useState(0);
  const [petHappiness, setPetHappiness] = useState(80);

  useEffect(() => {
    if (gameId === 'bubble_pop_game') {
      spawnBubbles();
    }
  }, [gameId]);

  const spawnBubbles = () => {
    const phonemes = ['S', 'A', 'T', 'P', 'I', 'N', 'C', 'K', 'E', 'O'];
    const newBubbles = Array.from({ length: 8 }, (_, idx) => ({
      id: idx,
      text: phonemes[Math.floor(Math.random() * phonemes.length)],
      x: 10 + Math.random() * 75,
      y: 10 + Math.random() * 70,
      popped: false,
    }));
    setBubbles(newBubbles);
  };

  const handlePopBubble = (id: number, text: string) => {
    soundService.playPopSound();
    soundService.speakPhoneme(text);

    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setScore((s) => s + 1);
  };

  const handleAddSticker = (emoji: string) => {
    soundService.playPopSound();
    setStickersOnCanvas((prev) => [
      ...prev,
      {
        id: Date.now(),
        emoji,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      },
    ]);
  };

  const activePet = currentProfile.unlockedPets[selectedPetIdx] || {
    name: 'Barnaby',
    icon: '🐻',
    species: 'Reading Bear',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl p-6">
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <h2 className="text-2xl font-display font-bold text-amber-950">
              {gameId === 'bubble_pop_game'
                ? 'Pop the Sound Bubbles!'
                : gameId === 'sticker_book'
                ? 'Sticker Studio'
                : 'Pet Playpen'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {gameId === 'bubble_pop_game' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-between bg-amber-100 p-3 rounded-2xl border border-amber-300 font-display font-bold text-amber-900">
              <span>Pop bubbles to hear their phoneme sounds!</span>
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs">
                Score: {score}
              </span>
            </div>

            <div className="relative w-full h-80 bg-gradient-to-b from-sky-200 to-indigo-200 rounded-3xl border-4 border-sky-300 overflow-hidden shadow-inner">
              {bubbles.map((b) => {
                if (b.popped) return null;
                return (
                  <button
                    key={b.id}
                    onClick={() => handlePopBubble(b.id, b.text)}
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    className="absolute w-16 h-16 bg-white/60 hover:bg-white/90 border-2 border-white rounded-full flex items-center justify-center font-display text-2xl font-extrabold text-sky-900 shadow-lg transform hover:scale-110 active:scale-90 transition-transform animate-float"
                  >
                    {b.text}
                  </button>
                );
              })}
            </div>

            <button
              onClick={spawnBubbles}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold px-4 py-2 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Spawn More Bubbles</span>
            </button>
          </div>
        )}

        {gameId === 'sticker_book' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 bg-amber-100 p-2.5 rounded-2xl border border-amber-300 font-display text-xs font-bold text-amber-900">
              <span>Tap a sticker below to place it on your playground canvas!</span>
            </div>

            <div className="relative w-full h-72 bg-gradient-to-b from-amber-100 via-teal-50 to-emerald-100 rounded-3xl border-4 border-amber-300 overflow-hidden shadow-inner">
              {stickersOnCanvas.map((st) => (
                <div
                  key={st.id}
                  style={{ left: `${st.x}%`, top: `${st.y}%` }}
                  className="absolute text-5xl animate-bounce"
                >
                  {st.emoji}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 bg-white p-3 rounded-2xl border border-amber-200 flex-wrap">
              {['⭐', '🌈', '👑', '🚀', '🦄', '🍎', '🎈', '🎨'].map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSticker(st)}
                  className="text-3xl p-2 hover:bg-amber-100 rounded-xl transition-all transform hover:scale-125 active:scale-95"
                >
                  {st}
                </button>
              ))}

              <button
                onClick={() => setStickersOnCanvas([])}
                className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-display font-bold text-xs px-3 py-2 rounded-xl ml-2"
              >
                Clear Canvas
              </button>
            </div>
          </div>
        )}

        {gameId !== 'bubble_pop_game' && gameId !== 'sticker_book' && (
          <div className="space-y-6 text-center">
            <div className="bg-amber-100 p-3 rounded-2xl border border-amber-300 font-display text-sm font-bold text-amber-950">
              Pet, feed, and play with your hatched reading companions!
            </div>

            <div className="p-8 bg-gradient-to-b from-amber-100 to-amber-200 rounded-3xl border-4 border-amber-300 text-center space-y-4">
              <div className="text-8xl animate-bounce">{activePet.icon}</div>
              <h3 className="text-2xl font-display font-bold text-slate-900">
                {activePet.name}
              </h3>

              <div className="max-w-xs mx-auto bg-white p-2 rounded-xl border border-amber-300 flex items-center justify-between font-display text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Happiness
                </span>
                <span className="text-emerald-700">{petHappiness}%</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    soundService.playSuccessChime();
                    soundService.speak(`Yum! ${activePet.name} loved the treat!`);
                    setPetHappiness((h) => Math.min(100, h + 10));
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md"
                >
                  🍎 Feed Treat
                </button>

                <button
                  onClick={() => {
                    soundService.playPopSound();
                    soundService.speak(`Purr! ${activePet.name} feels happy!`);
                    setPetHappiness((h) => Math.min(100, h + 10));
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md"
                >
                  🎾 Play Ball
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
