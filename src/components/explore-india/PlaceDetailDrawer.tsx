import React from 'react';
import {
  X,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Navigation,
  BookOpen
} from 'lucide-react';
import { AttractionEntity } from '../../types/indiaHierarchy';

interface PlaceDetailDrawerProps {
  place: AttractionEntity | null;
  stateName?: string;
  cityName?: string;
  districtName?: string;
  onClose: () => void;
  onSelectPlace?: (placeId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const PlaceDetailDrawer: React.FC<PlaceDetailDrawerProps> = ({
  place,
  stateName,
  cityName,
  districtName,
  onClose,
  onSelectPlace,
  onOpenAIChat,
}) => {
  if (!place) return null;

  const isVerified = place.status === 'VERIFIED';
  const isHeritage = place.category === 'heritage';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FCFBF9] rounded-3xl border border-[#EFE8DF] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-200 shrink-0">
          <img
            src={place.image_url || place.thumbnail_url}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition backdrop-blur-xs focus:outline-none"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Location & Title overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase">
                {place.category_label || place.category}
              </span>
              {isHeritage && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#046A38] text-white text-[11px] font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" /> UNESCO / Heritage
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {place.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-stone-200 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {cityName || place.name}, {districtName ? `${districtName} Dist, ` : ''}{stateName || 'India'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#0B192C]">
          {/* Summary / Historical Significance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Cultural & Architectural Overview</span>
            </h3>
            <p className="text-sm text-[#4A3E36] leading-relaxed">
              {place.historical_significance || place.summary}
            </p>
          </div>

          {/* Visiting Essentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#EFE8DF]">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Entry Tariff</span>
              </div>
              <div className="text-xs font-bold text-stone-900">
                {place.fees?.free_entry
                  ? 'Free Entry'
                  : `₹${place.fees?.domestic || 40} Domestic`}
              </div>
              <div className="text-[11px] text-stone-500">
                {place.fees?.free_entry ? 'Open to all' : `Foreign: ₹${place.fees?.international || 500}`}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Visiting Timings</span>
              </div>
              <div className="text-xs font-bold text-stone-900">
                {place.timings?.opening_time || '09:00 AM'} - {place.timings?.closing_time || '05:30 PM'}
              </div>
              <div className="text-[11px] text-stone-500">
                {place.timings?.closed_days && place.timings.closed_days.length > 0
                  ? `Closed: ${place.timings.closed_days.join(', ')}`
                  : 'Open all days'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Ideal Duration</span>
              </div>
              <div className="text-xs font-bold text-stone-900">
                {place.visit_duration?.label || '2 - 3 Hours'}
              </div>
              <div className="text-[11px] text-stone-500">Recommended visit</div>
            </div>
          </div>

          {/* Tags if available */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {place.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EFE8DF] text-[#7A6E65]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#EFE8DF] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              if (onOpenAIChat) {
                onOpenAIChat(`Tell me the historical significance and best time to visit ${place.name} in ${cityName || stateName}.`);
              }
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE5] border border-[#EFE8DF] text-xs font-bold text-[#E65100] transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FF671F]" />
            <span>Ask AI Guide</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
            {onSelectPlace && (
              <button
                onClick={() => {
                  onSelectPlace(place.id);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>View Full Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
