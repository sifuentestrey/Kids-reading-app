import React, { useState } from 'react';
import { LearnerProfile, LearnerId } from '../types';
import {
  ShieldCheck,
  Lock,
  Award,
  Clock,
  Download,
  Sparkles,
  X,
  CheckCircle2,
  Mic,
  Volume2,
  Camera,
  Upload,
  Key,
  RefreshCw,
  Play,
  Check,
  RotateCcw,
  Save,
  Tablet,
  FileSpreadsheet,
} from 'lucide-react';
import { soundService, ELEVENLABS_VOICES } from '../services/soundService';
import { AvatarImage } from './AvatarImage';

interface ParentPortalProps {
  profiles: LearnerProfile[];
  onUpdateProfile?: (updated: LearnerProfile) => void;
  onResetKidsProgress?: (childId?: LearnerId) => void;
  onOpenDiagnostic: () => void;
  onClose: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  profiles,
  onUpdateProfile,
  onResetKidsProgress,
  onOpenDiagnostic,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<'tru' | 'alivia' | 'ava'>('tru');
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const [resetConfirmText, setResetConfirmText] = useState<string | null>(null);

  // ElevenLabs Voice State
  const [elevenEnabled, setElevenEnabled] = useState(soundService.isElevenLabsEnabled());
  const [elevenApiKey, setElevenApiKey] = useState(soundService.getApiKey());
  const [elevenVoiceId, setElevenVoiceId] = useState(soundService.getVoiceId());
  const [ttsTesting, setTtsTesting] = useState(false);
  const [ttsMessage, setTtsMessage] = useState<string | null>(null);

  const parentPIN = '1234';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === parentPIN) {
      soundService.playSuccessChime();
      setIsUnlocked(true);
    } else {
      soundService.playBoopSound();
      alert('Incorrect PIN! Default parent gate PIN is 1234.');
    }
  };

  const selectedChild = profiles.find((p) => p.id === selectedChildId) || profiles[0];

  const handleSaveElevenLabsKey = () => {
    soundService.setApiKey(elevenApiKey);
    soundService.setVoiceId(elevenVoiceId);
    soundService.setElevenLabsEnabled(elevenEnabled);
    soundService.playSuccessChime();
    setTtsMessage('Saved ElevenLabs voice configuration!');
    setTimeout(() => setTtsMessage(null), 3500);
  };

  const handleTestTTS = () => {
    soundService.setApiKey(elevenApiKey);
    soundService.setVoiceId(elevenVoiceId);
    soundService.setElevenLabsEnabled(elevenEnabled);
    setTtsTesting(true);
    setTtsMessage('Generating ElevenLabs studio voice clip...');

    soundService.speak(
      `Hello ${selectedChild.name}! Welcome to your special reading adventure with ElevenLabs voice!`,
      {
        onEnd: () => {
          setTtsTesting(false);
          setTtsMessage('Finished playing studio voice sample!');
          setTimeout(() => setTtsMessage(null), 3000);
        },
      }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && onUpdateProfile) {
        const updated = { ...selectedChild, avatar: dataUrl };
        onUpdateProfile(updated);
        soundService.playSuccessChime();
        setDownloadMsg(`Updated real photo for ${selectedChild.name}!`);
        setTimeout(() => setDownloadMsg(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePrintableWorksheet = (type: string) => {
    soundService.playSuccessChime();
    setDownloadMsg(`Generated offline ${type} worksheet PDF for ${selectedChild.name}!`);

    const printableWindow = window.open('', '_blank');
    if (printableWindow) {
      printableWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ReadWithMe - Offline ${type} Worksheet for ${selectedChild.name}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; text-align: center; }
              h1 { color: #d97706; }
              .box { border: 3px dashed #f59e0b; padding: 30px; margin: 20px auto; max-width: 600px; border-radius: 20px; }
              .letter { font-size: 100px; font-weight: bold; color: #cbd5e1; letter-spacing: 20px; }
            </style>
          </head>
          <body>
            <h1>📖 ReadWithMe Offline ${type} Sheet</h1>
            <h2>Child: ${selectedChild.name} (Age ${selectedChild.age})</h2>
            <div class="box">
              <p>Trace the Mastered Phonics Letters below:</p>
              <div class="letter">${selectedChild.masteredPhonics.slice(0, 3).join(' ')}</div>
            </div>
            <p>Parent Notes: Practiced ${selectedChild.learningMinutes} mins online!</p>
            <button onclick="window.print()">Print Worksheet Now</button>
          </body>
        </html>
      `);
    }

    setTimeout(() => setDownloadMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl p-6 my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">
                Parent Portal & ElevenLabs Studio Settings
              </h2>
              <p className="text-xs text-slate-600">
                Track reading progress, configure ElevenLabs studio voice, and update real child photos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isUnlocked ? (
          <div className="max-w-md mx-auto text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-amber-200 text-amber-900 rounded-full flex items-center justify-center mx-auto border-2 border-amber-400">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Parent Security Gate
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Please enter the parent PIN to view reading analytics and voice settings. (Default PIN: <span className="font-bold text-amber-800">1234</span>)
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 1234"
                className="w-48 text-center text-3xl font-display font-bold tracking-widest px-4 py-3 bg-white border-3 border-amber-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-300"
              />

              <div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold rounded-2xl shadow-md transition-all"
                >
                  Unlock Parent Portal
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Child Selector */}
            <div className="flex items-center gap-2 bg-amber-200/60 p-1.5 rounded-2xl border border-amber-300">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedChildId(p.id)}
                  className={`flex-1 py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    selectedChildId === p.id
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-800 hover:bg-amber-300/60'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center border-2 border-white bg-amber-100">
                    <AvatarImage avatar={p.avatar} name={p.name} fallbackTextSize="text-xs" />
                  </div>
                  <span>
                    {p.name} (Age {p.age})
                  </span>
                </button>
              ))}
            </div>

            {/* Child Profile & Photo Manager */}
            <div className="bg-white border-2 border-amber-300 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group w-16 h-16 rounded-full overflow-hidden border-4 border-amber-400 shadow-md flex items-center justify-center shrink-0 bg-amber-100">
                  <AvatarImage avatar={selectedChild.avatar} name={selectedChild.name} fallbackTextSize="text-3xl" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {selectedChild.name}'s Real Picture Profile
                  </h3>
                  <p className="text-xs text-slate-600">
                    Upload a custom photo or camera picture for {selectedChild.name}.
                  </p>
                </div>
              </div>

              <label className="cursor-pointer bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap">
                <Camera className="w-4 h-4" />
                <span>Upload Real Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Studio AI & ElevenLabs Voice Settings Panel */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-2 border-indigo-700 p-5 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-indigo-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600/80 rounded-xl text-indigo-100">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">
                      Realistic Studio AI Voice Engine
                    </h3>
                    <p className="text-xs text-indigo-200">
                      High-fidelity human storybook voices powered by Gemini AI Studio & ElevenLabs.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-700">
                  <span className="text-xs font-bold text-indigo-200">
                    {elevenEnabled ? 'Studio Voice Active' : 'Browser Speech'}
                  </span>
                  <input
                    type="checkbox"
                    checked={elevenEnabled}
                    onChange={(e) => {
                      setElevenEnabled(e.target.checked);
                      soundService.setElevenLabsEnabled(e.target.checked);
                    }}
                    className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-indigo-200 mb-1 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Select Story Narrator Voice</span>
                  </label>
                  <select
                    value={elevenVoiceId}
                    onChange={(e) => {
                      setElevenVoiceId(e.target.value);
                      soundService.setVoiceId(e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-indigo-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {ELEVENLABS_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.description}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-indigo-300 mt-1">
                    "Kore" & "Elli" provide warm, natural expressive narration for young readers.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-indigo-200 mb-1 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>ElevenLabs API Key (Optional)</span>
                  </label>
                  <input
                    type="password"
                    value={elevenApiKey}
                    onChange={(e) => setElevenApiKey(e.target.value)}
                    placeholder="Paste XI-Api-Key (Optional)"
                    className="w-full bg-slate-950 border border-indigo-700 rounded-xl px-3 py-2 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-indigo-300 mt-1">
                    Gemini AI Studio Voice works out of the box. Add ElevenLabs key if using custom ElevenLabs IDs.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestTTS}
                    disabled={ttsTesting}
                    className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {ttsTesting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                    <span>{ttsTesting ? 'Speaking...' : 'Test Studio Voice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveElevenLabsKey}
                    className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Voice Settings</span>
                  </button>
                </div>

                {ttsMessage && (
                  <span className="text-xs font-bold text-amber-300 animate-fade-in">
                    {ttsMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-amber-300 p-4 rounded-2xl shadow-sm text-center">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Reading Age Equivalent
                </div>
                <div className="text-2xl font-display font-extrabold text-emerald-600 mt-1">
                  {selectedChild.readingAgeEquivalent}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Target Track: {selectedChild.track}
                </div>
              </div>

              <div className="bg-white border-2 border-amber-300 p-4 rounded-2xl shadow-sm text-center">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Learning Time vs Play
                </div>
                <div className="text-xl font-display font-bold text-sky-600 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedChild.learningMinutes}m / {selectedChild.playingMinutes}m</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  High academic engagement ratio
                </div>
              </div>

              <div className="bg-white border-2 border-amber-300 p-4 rounded-2xl shadow-sm text-center">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Star Gems Earned
                </div>
                <div className="text-2xl font-display font-extrabold text-amber-600 mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-5 h-5 fill-amber-400" />
                  <span>{selectedChild.starGems}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {selectedChild.unlockedPets.length} hatched pet companions
                </div>
              </div>
            </div>

            {/* Phonics Mastered */}
            <div className="bg-white border-2 border-amber-300 p-5 rounded-2xl shadow-sm space-y-3">
              <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Mastered Phonic Sounds & Graphemes</span>
              </h4>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedChild.masteredPhonics.map((sound, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-xl font-display font-bold text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>/{sound}/</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Diagnostic */}
            <div className="bg-amber-100 border-2 border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-base text-amber-950">
                  Adaptive Diagnostic Placement Test
                </h4>
                <p className="text-xs text-amber-800">
                  Assess {selectedChild.name}'s current reading level to automatically skip mastered lessons.
                </p>
              </div>

              <button
                onClick={() => {
                  soundService.playPopSound();
                  onOpenDiagnostic();
                }}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all whitespace-nowrap"
              >
                Run Diagnostic Test
              </button>
            </div>

            {/* iPad Local Storage & Restart Progress Manager */}
            <div className="bg-slate-900 text-white border-2 border-slate-700 p-5 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-600/80 rounded-xl text-emerald-100">
                    <Tablet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                      <span>iPad Save Progress & Restart Controls</span>
                      <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-500 px-2 py-0.5 rounded-full">
                        Auto-Saved
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      All stars, completed lessons, and treehouse room items are saved directly to this iPad.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
                  <Save className="w-4 h-4" />
                  <span>iPad LocalStorage Active</span>
                </div>
              </div>

              {/* Progress Reset Buttons */}
              <div className="space-y-2">
                <p className="text-xs text-slate-300">
                  Need to restart learning for your kids starting now? You can reset individual progress or restart all kids' progress.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      if (onResetKidsProgress) {
                        onResetKidsProgress(selectedChild.id);
                        setResetConfirmText(`Restarted ${selectedChild.name}'s progress starting now!`);
                        setTimeout(() => setResetConfirmText(null), 3500);
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restart {selectedChild.name}'s Progress</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onResetKidsProgress) {
                        onResetKidsProgress();
                        setResetConfirmText("Restarted ALL kids' progress starting now!");
                        setTimeout(() => setResetConfirmText(null), 3500);
                      }
                    }}
                    className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restart ALL Kids' Progress</span>
                  </button>
                </div>

                {resetConfirmText && (
                  <div className="p-2.5 bg-emerald-500 text-white font-display font-bold text-xs rounded-xl shadow-sm text-center animate-fade-in">
                    {resetConfirmText}
                  </div>
                )}
              </div>
            </div>

            {/* Printables */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-base text-slate-900">
                Printable Offline Activity Packs
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleGeneratePrintableWorksheet('Letter Tracing')}
                  className="p-3 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-xl text-left shadow-sm transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900">
                      Letter Tracing Sheet
                    </div>
                    <div className="text-[11px] text-slate-500">
                      For {selectedChild.name}'s target letters
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-amber-600" />
                </button>

                <button
                  onClick={() => handleGeneratePrintableWorksheet('Phonics Coloring')}
                  className="p-3 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-xl text-left shadow-sm transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900">
                      Phonics Color Pages
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Fun picture sound coloring
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-amber-600" />
                </button>

                <button
                  onClick={() => handleGeneratePrintableWorksheet('Sight Word Flashcards')}
                  className="p-3 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-xl text-left shadow-sm transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900">
                      Sight Word Cards
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Cut-out flashcards pack
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-amber-600" />
                </button>
              </div>

              {downloadMsg && (
                <div className="p-3 bg-emerald-500 text-white font-display font-bold text-xs rounded-xl shadow-sm text-center animate-fade-in">
                  {downloadMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
