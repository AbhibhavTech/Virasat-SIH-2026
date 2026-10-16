import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Headphones, Globe2, Sparkles } from 'lucide-react';
import { PlaceDetail } from '../../types';

interface MonumentAudioGuidePlayerProps {
  place: PlaceDetail;
}

export const MonumentAudioGuidePlayer: React.FC<MonumentAudioGuidePlayerProps> = ({ place }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop when place changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [place.id]);

  if (!isSupported) return null;

  // Build audio narrative text in English & Hindi
  const getNarrationText = (): string => {
    if (language === 'hi') {
      return (
        `स्वागत है ${place.name} में। यह ऐतिहासिक धरोहर ${place.city}, ${place.state} में स्थित है। ` +
        `${place.summary || place.description || ''} ` +
        `इसकी वास्तुकला और शिल्प कौशल भारत की प्राचीन संस्कृति और विरासत का अनुपम उदाहरण है। ` +
        `आर्किओलॉजिकल सर्वे ऑफ इंडिया के अनुसार, यह स्थान हमारे देश के गौरवशाली इतिहास का प्रतीक है।`
      );
    }

    return (
      `Welcome to ${place.name}, located in ${place.city}, ${place.state}, India. ` +
      `${place.summary || place.description || ''} ` +
      `Recognized for its timeless architecture and historical significance, ${place.name} showcases the master craftsmanship and cultural heritage of India. ` +
      `Thank you for traveling responsibly with Virasat, preserving our living traditions.`
    );
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const text = getNarrationText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (language === 'hi') {
      const hiVoice = voices.find((v) => v.lang.includes('hi') || v.name.includes('Hindi'));
      if (hiVoice) utterance.voice = hiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const enInVoice = voices.find((v) => v.lang === 'en-IN' || v.name.includes('India'));
      if (enInVoice) utterance.voice = enInVoice;
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-4 sm:p-5 shadow-warm border border-stone-800 space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Title & Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF671F] to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight font-serif text-white flex items-center gap-1.5">
                <span>Virasat Audio Tour Guide</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                  Museum Audio
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-stone-300">
              {language === 'hi' ? 'स्मार्ट ऑडियो गाइड सुनें (Hindi / हिन्दी)' : `Listen to curated audio narrative for ${place.name}`}
            </p>
          </div>
        </div>

        {/* Controls Cluster */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Language Toggle */}
          <div className="flex items-center bg-stone-800/80 rounded-xl p-0.5 border border-stone-700 text-xs">
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                if (isPlaying) handleStop();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                language === 'en' ? 'bg-[#FF671F] text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage('hi');
                if (isPlaying) handleStop();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                language === 'hi' ? 'bg-[#FF671F] text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Speed Selector */}
          <button
            type="button"
            onClick={() => {
              const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 0.9 : 1.0;
              setPlaybackRate(nextRate);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-[11px] font-bold text-stone-300 cursor-pointer"
            title="Adjust Narration Speed"
          >
            {playbackRate}x
          </button>

          {/* Play / Pause Primary Button */}
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Listen / सुनें'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePause}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition cursor-pointer"
                title="Stop Audio"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Audio Waveform Simulation when playing */}
      {isPlaying && (
        <div className="flex items-center gap-1 h-3 pt-1 animate-fadeIn">
          <span className="text-[10px] text-orange-400 font-bold mr-2">Audio Playing:</span>
          {[40, 80, 60, 100, 70, 45, 90, 60, 85, 50, 95, 65, 30].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-[#FF671F] rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '600ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
