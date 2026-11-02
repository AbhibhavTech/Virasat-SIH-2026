import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  id?: string;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  id = 'lang',
  className = '',
  showIcon = true,
  compact = false,
}) => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div
      id={id}
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center gap-1.5 p-1 rounded-xl border border-stone-200 bg-white/95 shadow-2xs transition hover:border-amber-300 ${className}`}
    >
      {showIcon && <Globe className="h-3.5 w-3.5 text-amber-700 ml-1 shrink-0" aria-hidden="true" />}
      <div className="inline-flex items-center rounded-lg bg-stone-100 p-0.5 border border-stone-200/80">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
            currentLanguage === 'en'
              ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-900/5'
              : 'text-stone-500 hover:text-stone-900'
          }`}
          aria-pressed={currentLanguage === 'en'}
          title="Switch to English"
        >
          {compact ? 'EN' : 'English'}
        </button>
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
            currentLanguage === 'hi'
              ? 'bg-[#FF671F] text-white shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
          aria-pressed={currentLanguage === 'hi'}
          title="हिन्दी में बदलें (Switch to Hindi)"
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
};
