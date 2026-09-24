import React, { useState } from 'react';
import { Mic, MicOff, AlertCircle, X } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';

interface VoiceInputButtonProps {
  onTranscript: (text: string, isFinal: boolean) => void;
  onFinalTranscript?: (text: string) => void;
  placeholderPrompt?: string;
  className?: string;
  variant?: 'search' | 'ai' | 'minimal';
  title?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  onFinalTranscript,
  placeholderPrompt = 'Listening... Speak heritage destination, monument, or question',
  className = '',
  variant = 'search',
  title = 'Search with Voice',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const {
    isListening,
    isSupported,
    errorMessage,
    transcript,
    toggleListening,
    clearError,
  } = useVoiceInput({
    onResult: (text, isFinal) => {
      onTranscript(text, isFinal);
    },
    onFinalResult: (text) => {
      if (onFinalTranscript) {
        onFinalTranscript(text);
      }
    },
    lang: 'en-IN',
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (errorMessage) {
      clearError();
    }
    if (!isSupported) {
      alert('Voice search is not supported by your browser. Please try Chrome, Edge, or Safari.');
      return;
    }
    toggleListening();
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
          isListening
            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
            : variant === 'ai'
            ? 'bg-white hover:bg-orange-50 text-stone-600 hover:text-[#FF671F] border border-stone-200 hover:border-orange-300'
            : 'text-stone-400 hover:text-[#FF671F] hover:bg-orange-50/80'
        } ${className}`}
        title={isListening ? 'Click to stop listening' : title}
        aria-label={isListening ? 'Stop listening' : title}
      >
        {/* Pulsing beacon animation when actively listening */}
        {isListening && (
          <>
            <span className="absolute -inset-1 rounded-xl bg-rose-500/40 animate-ping opacity-75 pointer-events-none" />
            <span className="absolute -inset-0.5 rounded-xl bg-rose-400 animate-pulse pointer-events-none" />
          </>
        )}

        <div className="relative z-10">
          {isListening ? (
            <Mic className="w-4 h-4 animate-bounce" />
          ) : !isSupported ? (
            <MicOff className="w-4 h-4 text-stone-300" />
          ) : (
            <Mic className="w-4 h-4 transition-transform group-hover:scale-110" />
          )}
        </div>
      </button>

      {/* Floating Listening Banner / Live Feedback */}
      {isListening && (
        <div
          className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-stone-900/95 text-white shadow-2xl backdrop-blur-md border border-stone-700/80 flex items-center gap-3 animate-fadeIn max-w-sm sm:max-w-md w-[90%]"
          role="status"
          aria-live="polite"
        >
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Listening to Voice</span>
              <div className="flex items-center gap-0.5 h-2.5">
                <span className="w-0.5 h-2 bg-rose-400 animate-pulse" />
                <span className="w-0.5 h-3 bg-rose-400 animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-rose-400 animate-pulse delay-150" />
              </div>
            </div>
            <p className="text-xs text-stone-200 truncate mt-0.5 font-medium">
              {transcript || placeholderPrompt}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 hover:text-white transition cursor-pointer shrink-0"
          >
            Done
          </button>
        </div>
      )}

      {/* Error message popup: Positioned ABOVE input area with high z-index, compact design, anchored near mic */}
      {errorMessage && (
        <div
          className="absolute bottom-full mb-2.5 right-0 z-50 w-64 sm:w-72 max-w-[calc(100vw-2rem)] p-2.5 sm:p-3 rounded-xl bg-white border border-rose-200 text-stone-800 shadow-xl space-y-1.5 animate-fadeIn select-none"
          role="alert"
          aria-live="assertive"
        >
          {/* Header with Title and Close X Button */}
          <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-rose-100">
            <div className="flex items-center gap-1.5 font-bold text-rose-800 text-[11px] sm:text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Microphone access denied</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearError();
              }}
              className="p-0.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100 transition cursor-pointer"
              title="Close notice"
              aria-label="Close notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compact error message (1-2 lines) */}
          <p className="text-[11px] text-stone-600 leading-snug font-sans line-clamp-2">
            {errorMessage}
          </p>

          {/* Actions: Small Retry & Dismiss */}
          <div className="flex items-center justify-end gap-1.5 pt-0.5 text-[10px] sm:text-[11px]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearError();
                toggleListening();
              }}
              className="px-2 py-0.5 font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition cursor-pointer shadow-2xs"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearError();
              }}
              className="px-2 py-0.5 font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-md transition border border-stone-200 cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          {/* Downward indicator pointer anchored to microphone button */}
          <div
            className="absolute -bottom-1 right-3.5 w-2.5 h-2.5 bg-white border-r border-b border-rose-200 rotate-45 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Simple Hover Tooltip when not listening */}
      {!isListening && showTooltip && !errorMessage && (
        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-40 px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[10px] font-medium whitespace-nowrap shadow-md pointer-events-none">
          {title}
        </div>
      )}
    </div>
  );
};
