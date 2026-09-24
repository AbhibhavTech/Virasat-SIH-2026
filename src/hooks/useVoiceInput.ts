import { useState, useEffect, useRef, useCallback } from 'react';

// Declarations for Web Speech API to satisfy TypeScript without extra packages
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface UseVoiceInputOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onFinalResult?: (transcript: string) => void;
  lang?: string; // defaults to 'en-IN' for optimal Indian heritage recognition
}

export function useVoiceInput({
  onResult,
  onFinalResult,
  lang = 'en-IN',
}: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isManuallyStoppedRef = useRef(false);
  const finalTranscriptAccumulator = useRef('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setErrorMessage(null);
    finalTranscriptAccumulator.current = '';
    setTranscript('');
    isManuallyStoppedRef.current = false;

    if (typeof window === 'undefined') return;

    // Check if permission was already permanently denied at the browser site-settings level
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'denied') {
          setErrorMessage('Microphone blocked in browser. Please enable microphone access in your browser site settings.');
          setIsListening(false);
          return;
        }
      } catch (e) {
        // navigator.permissions.query may not support 'microphone' in some browsers/environments; ignore and proceed
      }
    }

    // Explicitly request browser microphone permission using the native Web Media API
    // directly from the user click event. This triggers the browser's native prompt if not yet decided.
    let audioStream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err: any) {
        console.warn('Microphone permission denied or unavailable:', err);
        const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
        if (isDenied) {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser settings.');
        } else {
          setErrorMessage('Microphone not detected. Please ensure a microphone is connected and allowed.');
        }
        setIsListening(false);
        return;
      }
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsListening(false);
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // no-op
      }
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            currentFinal += text;
          } else {
            currentInterim += text;
          }
        }

        const fullCurrent = (currentFinal || currentInterim).trim();
        if (fullCurrent) {
          setTranscript(fullCurrent);
          if (onResult) {
            onResult(fullCurrent, Boolean(currentFinal));
          }
        }

        if (currentFinal) {
          finalTranscriptAccumulator.current = currentFinal.trim();
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let message = 'Error recognizing speech.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          message = 'Microphone permission was denied. Please allow microphone access in your browser site settings.';
        } else if (event.error === 'no-speech') {
          message = 'No speech detected. Please speak clearly into your microphone.';
        } else if (event.error === 'network') {
          message = 'Network error occurred during speech recognition.';
        } else {
          message = `Voice error: ${event.error}`;
        }

        setErrorMessage(message);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Release audio stream when speech recognition ends
        if (audioStream) {
          try {
            audioStream.getTracks().forEach((track) => track.stop());
          } catch (e) {
            // no-op
          }
        }
        const finalRecorded = finalTranscriptAccumulator.current.trim();
        if (finalRecorded && onFinalResult) {
          onFinalResult(finalRecorded);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      if (audioStream) {
        try {
          audioStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
          // no-op
        }
      }
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Could not initialize voice input.');
      setIsListening(false);
    }
  }, [lang, onFinalResult, onResult]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // no-op
        }
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    errorMessage,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    clearError: () => setErrorMessage(null),
  };
}
