import React, { useState } from 'react';
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
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Globe
} from 'lucide-react';
import { AttractionEntity } from '../../types/indiaHierarchy';
import { OfficialImagePending } from '../common/OfficialImagePending';

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
  const [imageError, setImageError] = useState(false);

  if (!place) return null;

  const isVerified =
    place.verification_status === 'verified' ||
    place.status === 'VERIFIED';

  const isHeritage =
    place.category === 'heritage' ||
    place.topic === 'Heritage' ||
    place.subtopic?.toLowerCase().includes('unesco');

  const primarySource =
    place.sources && place.sources.length > 0
      ? place.sources[0]
      : place.source_url
      ? {
          source_name: place.source_name || 'Official Tourism Authority',
          source_url: place.source_url,
          source_type: place.source_type || 'state_tourism',
          accessed_on: place.last_verified_on || '2026-03-01',
        }
      : null;

  const lat = place.coordinates?.lat;
  const lng = place.coordinates?.lng;
  const hasCoordinates = typeof lat === 'number' && typeof lng === 'number';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FCFBF9] rounded-3xl border border-[#EFE8DF] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Image or Neutral Placeholder */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-200 shrink-0 overflow-hidden">
          {imageError || (!place.image_url && !place.thumbnail_url) ? (
            <OfficialImagePending
              heightClass="h-full"
              label="Official image pending"
              showBadge={false}
            />
          ) : (
            <img
              src={place.image_url || place.thumbnail_url}
              alt={place.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition backdrop-blur-xs focus:outline-none cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Location & Title overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {place.topic && (
                <span className="px-2.5 py-0.5 rounded-full bg-orange-600/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs">
                  {place.topic}
                </span>
              )}
              {place.subtopic && (
                <span className="px-2.5 py-0.5 rounded-full bg-stone-800/80 text-amber-200 text-[10px] font-medium backdrop-blur-xs">
                  {place.subtopic}
                </span>
              )}
              {isHeritage && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#046A38] text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-xs">
                  <Award className="w-3 h-3" /> UNESCO / Heritage
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm">
              {place.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-stone-200 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                {cityName || place.name}
                {districtName ? `, ${districtName} Dist` : ''}
                {stateName ? `, ${stateName}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#0B192C]">
          {/* Trust & Verification Header Status */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#EFE8DF] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified source</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Under verification</span>
                </span>
              )}

              {place.last_verified_on && (
                <span className="text-[11px] text-stone-500">
                  Verified on: <strong className="text-stone-700">{place.last_verified_on}</strong>
                </span>
              )}
            </div>

            {hasCoordinates && (
              <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                <span>GPS:</span>
                <span className="text-stone-700 font-semibold">{lat?.toFixed(4)}° N, {lng?.toFixed(4)}° E</span>
              </div>
            )}
          </div>

          {/* Source Attribution Box */}
          {primarySource && (
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-xs space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                Verified Documentation Source
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-stone-500" />
                  <span>{primarySource.source_name}</span>
                  {primarySource.source_type && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-600">
                      {primarySource.source_type.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                {primarySource.source_url && (
                  <a
                    href={primarySource.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#046A38] hover:text-[#03542C] font-semibold underline decoration-emerald-300"
                  >
                    <span>View Official Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {primarySource.evidence_note && (
                <div className="text-[11px] text-stone-500 italic">
                  Note: {primarySource.evidence_note}
                </div>
              )}
            </div>
          )}

          {/* Short Factual Description & Detailed Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-4 h-4 text-[#FF671F]" />
              <span>Cultural &amp; Architectural Overview</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed">
              {place.detailed_description || place.short_description || place.summary || place.historical_significance}
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
                {place.entry_fee
                  ? typeof place.entry_fee === 'number' ? `₹${place.entry_fee}` : place.entry_fee
                  : place.fees?.free_entry
                  ? 'Free Entry'
                  : `₹${place.fees?.domestic || 0} Domestic`}
              </div>
              <div className="text-[11px] text-stone-500">
                {place.fees?.free_entry ? 'Open to all' : `Foreign: ₹${place.fees?.international || 0}`}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Visiting Timings</span>
              </div>
              <div className="text-xs font-bold text-stone-900 truncate">
                {place.opening_hours || `${place.timings?.opening_time || '09:00 AM'} - ${place.timings?.closing_time || '05:30 PM'}`}
              </div>
              <div className="text-[11px] text-stone-500 truncate">
                {place.timings?.closed_days && place.timings.closed_days.length > 0
                  ? `Closed: ${place.timings.closed_days.join(', ')}`
                  : 'Open all days'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Best Time</span>
              </div>
              <div className="text-xs font-bold text-stone-900 truncate">
                {place.best_time_to_visit || place.visit_duration?.label || 'Content under verification'}
              </div>
              <div className="text-[11px] text-stone-500">Ideal season</div>
            </div>
          </div>

          {/* Contact or Official Website if provided */}
          {(place.official_website || place.contact_information) && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              {place.contact_information && (
                <div className="text-stone-600">
                  <span className="font-semibold text-stone-800">Contact:</span> {place.contact_information}
                </div>
              )}
              {place.official_website && (
                <a
                  href={place.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 underline"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#EFE8DF] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenAIChat) {
                  onOpenAIChat(`Tell me the historical significance, architectural style, and visiting tips for ${place.name} in ${cityName || stateName}.`);
                }
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE5] border border-[#EFE8DF] text-xs font-bold text-[#E65100] transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FF671F]" />
              <span>Ask AI Guide</span>
            </button>

            {hasCoordinates && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-white text-stone-700 hover:text-amber-800 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="View on Google Maps for navigation and coordinates check"
              >
                <Navigation className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>Map Coordinates</span>
              </a>
            )}
          </div>

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

export default PlaceDetailDrawer;
