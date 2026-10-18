import React from 'react';
import { Award, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { UnescoStatus } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface UnescoBadgeProps {
  status?: UnescoStatus | string;
  year?: number | null;
  siteName?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UnescoBadge: React.FC<UnescoBadgeProps> = ({
  status,
  year,
  siteName,
  className = '',
  size = 'md',
}) => {
  const { t } = useLanguage();
  const normStatus = (status || 'unverified').toLowerCase();

  // ONLY unesco_status == "inscribed" OR "part_of_inscribed" get the UNESCO badge
  if (normStatus === 'inscribed') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full font-bold shadow-xs border bg-[#FF671F] text-white border-orange-600 ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'
        } ${className}`}
        title="UNESCO Inscribed World Heritage Site"
      >
        <Award className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>{t('unescoWorldHeritage')}{year ? ` (${year})` : ''}</span>
      </div>
    );
  }

  if (normStatus === 'part_of_inscribed') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full font-bold shadow-xs border bg-[#B84A11] text-white border-amber-800 ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'
        } ${className}`}
        title={siteName ? `Part of inscribed site: ${siteName}` : 'Part of UNESCO World Heritage Site'}
      >
        <Award className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>
          {t('unescoWorldHeritage')}{year ? ` (${year})` : ''}
          {siteName ? `: ${siteName}` : ''}
        </span>
      </div>
    );
  }

  // tentative / not_listed / unverified receive distinct labels - NOT the UNESCO badge
  if (normStatus === 'tentative') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold border bg-sky-50 text-sky-800 border-sky-300 ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-1 text-xs'
        } ${className}`}
        title="On UNESCO Tentative List (Nominated for future inscription)"
      >
        <Clock className={size === 'sm' ? 'w-3 h-3 text-sky-600' : 'w-3.5 h-3.5 text-sky-600'} />
        <span>{t('unescoTentative')}</span>
      </div>
    );
  }

  if (normStatus === 'not_listed') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold border bg-stone-100 text-stone-700 border-stone-300 ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-1 text-xs'
        } ${className}`}
        title="National Monument / Protected Heritage (Not Listed on UNESCO)"
      >
        <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-stone-500' : 'w-3.5 h-3.5 text-stone-500'} />
        <span>National Heritage (Not UNESCO Listed)</span>
      </div>
    );
  }

  // unverified
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border bg-zinc-100 text-zinc-600 border-zinc-200 ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-1 text-xs'
      } ${className}`}
      title="UNESCO status has not been independently verified"
    >
      <HelpCircle className={size === 'sm' ? 'w-3 h-3 text-zinc-400' : 'w-3.5 h-3.5 text-zinc-400'} />
      <span>Status Unverified</span>
    </div>
  );
};
