import React from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

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
      className={`relative inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 shadow-2xs transition hover:border-amber-300 ${className}`}
    >
      {showIcon && <Globe className="h-4 w-4 text-amber-700 shrink-0" aria-hidden="true" />}
      <select
        id={id}
        aria-label="Language selection"
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent text-xs sm:text-sm font-semibold text-stone-800 outline-none cursor-pointer pr-4 appearance-none"
      >
        {SUPPORTED_LANGUAGES.map(({ code, name }) => (
          <option key={code} value={code} className="text-stone-900 bg-white font-medium">
            {compact ? code.toUpperCase() : name}
          </option>
        ))}
      </select>
      <ChevronDown className="h-3.5 w-3.5 text-stone-500 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" aria-hidden="true" />
    </div>
  );
};
