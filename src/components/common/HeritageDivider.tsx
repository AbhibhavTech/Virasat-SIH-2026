import React from 'react';
import { Compass, Landmark, Sparkles, MapPin, Layers, Heart, BookOpen } from 'lucide-react';

export type HeritageDividerVariant =
  | 'lotus'
  | 'arch'
  | 'chakra'
  | 'mandala'
  | 'compass'
  | 'landmark'
  | 'sparkles'
  | 'heart'
  | 'stories';

export type HeritageDividerAccent = 'saffron' | 'emerald' | 'gold' | 'neutral' | 'tricolour';

export interface HeritageDividerProps {
  /** Visual motif displayed in the center medallion */
  variant?: HeritageDividerVariant;
  /** Accent tone for the gradient rule and icon ring */
  accent?: HeritageDividerAccent;
  /** Optional editorial label or section title centered alongside or beneath */
  label?: string;
  /** Optional secondary subtitle */
  subtitle?: string;
  /** Tighter vertical margins and compact sizing */
  compact?: boolean;
  /** Custom extra classes for spacing and margins */
  className?: string;
  /** ID for accessibility or anchor targeting */
  id?: string;
}

/**
 * Authentic 8-petal blooming Kamal (Indian Lotus) motif
 * Traditional symbol of beauty, purity, and sacred Indian temple friezes
 */
const LotusMotif: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Center core bud */}
    <path d="M12 4.5 C10.8 7.5, 10.8 11.5, 12 15 C13.2 11.5, 13.2 7.5, 12 4.5 Z" />
    {/* Inner left & right petals */}
    <path
      d="M10.5 7 C8 9.5, 7.5 13, 11 16 C8.5 13, 9.5 9, 10.5 7 Z"
      opacity="0.9"
    />
    <path
      d="M13.5 7 C16 9.5, 16.5 13, 13 16 C15.5 13, 14.5 9, 13.5 7 Z"
      opacity="0.9"
    />
    {/* Outer flared petals */}
    <path
      d="M8.2 10.5 C5 12.5, 4.5 16, 9.5 17.2 C6 15.5, 7 12, 8.2 10.5 Z"
      opacity="0.75"
    />
    <path
      d="M15.8 10.5 C19 12.5, 19.5 16, 14.5 17.2 C18 15.5, 17 12, 15.8 10.5 Z"
      opacity="0.75"
    />
    {/* Base lotus calyx cradle */}
    <path
      d="M6 18.5 C9 20, 15 20, 18 18.5 C15.5 19.5, 8.5 19.5, 6 18.5 Z"
      opacity="0.85"
    />
  </svg>
);

/**
 * Traditional Torana / Cusped Indian Gateway Arch motif
 */
const ToranaArchMotif: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Stepped crown kalash */}
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <path d="M12 2 L12 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Outer dome/shikhara arch contour */}
    <path
      d="M6 21 L6 13 C6 9, 9 6.5, 12 5 C15 6.5, 18 9, 18 13 L18 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Cusped inner arch */}
    <path
      d="M8.5 21 L8.5 14.5 C8.5 12, 10.2 10.5, 12 10.5 C13.8 10.5, 15.5 12, 15.5 14.5 L15.5 21"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Base step */}
    <path d="M4 21 L20 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 24-spoke Dharma Wheel / Ashoka Chakra micro motif
 */
const DharmaChakraMotif: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    {/* 8 primary spokes */}
    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1" />
    <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" stroke="currentColor" strokeWidth="1" />
    <line x1="5.6" y1="18.4" x2="18.4" y2="5.6" stroke="currentColor" strokeWidth="1" />
  </svg>
);

/**
 * Sacred Geometric 8-point Mandala Star Rosette
 */
const MandalaRosetteMotif: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Overlapping diamonds forming an authentic 8-point Indian jali star */}
    <rect x="7" y="7" width="10" height="10" rx="1.5" transform="rotate(0 12 12)" opacity="0.6" />
    <rect x="7" y="7" width="10" height="10" rx="1.5" transform="rotate(45 12 12)" opacity="0.9" />
    <circle cx="12" cy="12" r="2" fill="#FAF8F5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const HeritageDivider: React.FC<HeritageDividerProps> = ({
  variant = 'lotus',
  accent = 'saffron',
  label,
  subtitle,
  compact = false,
  className = '',
  id,
}) => {
  // Determine color palettes based on chosen accent
  const accentStyles = {
    saffron: {
      leftGradient: 'from-transparent via-[#FF671F]/20 via-70% to-[#FF671F]/40',
      rightGradient: 'from-[#FF671F]/40 via-30% via-[#FF671F]/20 to-transparent',
      dotColor: 'bg-[#FF671F]',
      badgeBorder: 'border-[#FF671F]/25',
      badgeBg: 'bg-[#FFFBF7]',
      iconColor: 'text-[#FF671F]',
      labelColor: 'text-[#9A3412]',
    },
    emerald: {
      leftGradient: 'from-transparent via-[#046A38]/20 via-70% to-[#046A38]/40',
      rightGradient: 'from-[#046A38]/40 via-30% via-[#046A38]/20 to-transparent',
      dotColor: 'bg-[#046A38]',
      badgeBorder: 'border-[#046A38]/25',
      badgeBg: 'bg-[#F4FAF6]',
      iconColor: 'text-[#046A38]',
      labelColor: 'text-[#065F46]',
    },
    gold: {
      leftGradient: 'from-transparent via-amber-400/25 via-70% to-amber-500/40',
      rightGradient: 'from-amber-500/40 via-30% via-amber-400/25 to-transparent',
      dotColor: 'bg-amber-600',
      badgeBorder: 'border-amber-300',
      badgeBg: 'bg-amber-50/70',
      iconColor: 'text-amber-700',
      labelColor: 'text-amber-900',
    },
    tricolour: {
      leftGradient: 'from-transparent via-[#FF671F]/30 to-[#FF671F]/60',
      rightGradient: 'from-[#046A38]/60 via-[#046A38]/30 to-transparent',
      dotColor: 'bg-[#000080]',
      badgeBorder: 'border-stone-300',
      badgeBg: 'bg-white',
      iconColor: 'text-[#FF671F]',
      labelColor: 'text-stone-800',
    },
    neutral: {
      leftGradient: 'from-transparent via-[#E2D9CF] to-[#C8B8A6]/90',
      rightGradient: 'from-[#C8B8A6]/90 via-[#E2D9CF] to-transparent',
      dotColor: 'bg-[#A89886]',
      badgeBorder: 'border-[#E5DDD2]',
      badgeBg: 'bg-[#FAF8F5]',
      iconColor: 'text-[#8A7969]',
      labelColor: 'text-[#5A4E46]',
    },
  }[accent];

  // Render the requested motif
  const renderIcon = () => {
    switch (variant) {
      case 'lotus':
        return <LotusMotif className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      case 'arch':
        return <ToranaArchMotif className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      case 'chakra':
        return <DharmaChakraMotif className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      case 'mandala':
        return <MandalaRosetteMotif className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      case 'compass':
        return <Compass className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      case 'landmark':
        return <Landmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      case 'sparkles':
        return <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      case 'heart':
        return <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-500 text-rose-500`} />;
      case 'stories':
        return <BookOpen className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
      default:
        return <LotusMotif className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentStyles.iconColor}`} />;
    }
  };

  const verticalSpacing = compact
    ? 'my-4 sm:my-5 lg:my-6'
    : label
    ? 'my-8 sm:my-10 lg:my-12'
    : 'my-6 sm:my-8 lg:my-9';

  return (
    <div
      id={id}
      role="separator"
      aria-label={label ? `${label} divider` : 'Section divider'}
      className={`relative flex flex-col items-center justify-center ${verticalSpacing} select-none pointer-events-none ${className}`}
    >
      <div className="w-full flex items-center justify-center">
        {/* Left Gradient Line */}
        <div className={`h-[1px] flex-1 bg-gradient-to-r ${accentStyles.leftGradient}`} />

        {/* Decorative Flanking Micro Diamonds */}
        <div className="flex items-center gap-1.5 px-2">
          <span className="w-1 h-1 rotate-45 rounded-[0.5px] opacity-60 bg-stone-300" />
          <span className={`w-1.5 h-1.5 rotate-45 rounded-[0.5px] shadow-2xs ${accentStyles.dotColor}`} />
        </div>

        {/* Center Medallion Badge */}
        <div
          className={`flex items-center justify-center ${
            label
              ? 'gap-2 px-3 py-1 rounded-full'
              : 'w-7 h-7 sm:w-8 sm:h-8 rounded-full'
          } ${accentStyles.badgeBg} border ${accentStyles.badgeBorder} shadow-2xs backdrop-blur-xs`}
        >
          <div className="flex items-center justify-center shrink-0">
            {renderIcon()}
          </div>

          {label && (
            <span
              className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-mono ${accentStyles.labelColor} whitespace-nowrap`}
            >
              {label}
            </span>
          )}
        </div>

        {/* Decorative Flanking Micro Diamonds */}
        <div className="flex items-center gap-1.5 px-2">
          <span className={`w-1.5 h-1.5 rotate-45 rounded-[0.5px] shadow-2xs ${accentStyles.dotColor}`} />
          <span className="w-1 h-1 rotate-45 rounded-[0.5px] opacity-60 bg-stone-300" />
        </div>

        {/* Right Gradient Line */}
        <div className={`h-[1px] flex-1 bg-gradient-to-r ${accentStyles.rightGradient}`} />
      </div>

      {subtitle && (
        <span className="text-[10px] sm:text-[11px] text-stone-400 italic mt-1.5 font-serif text-center px-4">
          {subtitle}
        </span>
      )}
    </div>
  );
};
