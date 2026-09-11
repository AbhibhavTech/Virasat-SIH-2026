import React from 'react';
import {
  X,
  Scale,
  Landmark,
  MapPin,
  Clock,
  Ticket,
  Train,
  ShieldCheck,
  ChevronRight,
  Box,
  Check,
  ArrowRight
} from 'lucide-react';
import { getRealMonumentImage } from '../../data/heritageRealImages';

interface MonumentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteA: any | null;
  siteB: any | null;
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const MonumentComparisonModal: React.FC<MonumentComparisonModalProps> = ({
  isOpen,
  onClose,
  siteA,
  siteB,
  onSelectPlace,
  onNavigateTab,
}) => {
  if (!isOpen || !siteA) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl border border-[#EFE8DF] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 via-white to-emerald-50/50 border-b border-[#EFE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF671F] text-white flex items-center justify-center shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                Comparative Architectural Dossier
              </h3>
              <p className="text-[11px] text-stone-500 font-sans">
                Side-by-side analysis of masonry, historical dynasties, and visiting logistics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!siteB ? (
            <div className="p-8 text-center text-stone-500 text-xs bg-stone-50 rounded-2xl">
              Please select a second monument to compare with <strong>{siteA.name}</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Site A */}
              <div className="space-y-4 rounded-2xl border border-orange-200/80 bg-orange-50/20 p-4">
                <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100 shadow-2xs">
                  <img
                    src={getRealMonumentImage(siteA.id, siteA.name) || siteA.thumbnail_url || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600'}
                    alt={siteA.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF671F] text-white shadow-xs">
                    {siteA.unesco_site ? 'UNESCO World Heritage' : 'National Monument'}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="font-serif font-bold text-base leading-snug">{siteA.name}</h4>
                    <div className="text-[11px] text-stone-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{siteA.city}, {siteA.state}</span>
                    </div>
                  </div>
                </div>

                {/* Specs Table */}
                <div className="space-y-2 text-xs font-sans">
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Architectural Style</span>
                    <span className="font-semibold text-stone-900 text-right">{siteA.architectural_style || 'Monumental Stone'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Historical Era</span>
                    <span className="font-semibold text-stone-900 text-right">{siteA.historical_significance?.slice(0, 35) || 'Ancient / Medieval'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Visiting Hours</span>
                    <span className="font-semibold text-stone-900 text-right">{siteA.visiting_hours || '09:00 AM - 05:30 PM'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Domestic Fee</span>
                    <span className="font-semibold text-[#046A38] text-right">
                      {siteA.entry_fee?.domestic !== undefined ? `₹${siteA.entry_fee.domestic}` : '₹50 standard'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Foreigner Fee</span>
                    <span className="font-semibold text-stone-900 text-right">
                      {siteA.entry_fee?.foreigner !== undefined ? `₹${siteA.entry_fee.foreigner}` : '₹550 standard'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Nearest Rail Corridor</span>
                    <span className="font-semibold text-[#000080] text-right truncate max-w-[180px]">
                      {siteA.nearest_transport?.railway_station || 'Central Station'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectPlace(siteA.id);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Explore {siteA.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column 2: Site B */}
              <div className="space-y-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-4">
                <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100 shadow-2xs">
                  <img
                    src={getRealMonumentImage(siteB.id, siteB.name) || siteB.thumbnail_url || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600'}
                    alt={siteB.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#046A38] text-white shadow-xs">
                    {siteB.unesco_site ? 'UNESCO World Heritage' : 'National Monument'}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="font-serif font-bold text-base leading-snug">{siteB.name}</h4>
                    <div className="text-[11px] text-stone-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{siteB.city}, {siteB.state}</span>
                    </div>
                  </div>
                </div>

                {/* Specs Table */}
                <div className="space-y-2 text-xs font-sans">
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Architectural Style</span>
                    <span className="font-semibold text-stone-900 text-right">{siteB.architectural_style || 'Monumental Stone'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Historical Era</span>
                    <span className="font-semibold text-stone-900 text-right">{siteB.historical_significance?.slice(0, 35) || 'Ancient / Medieval'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Visiting Hours</span>
                    <span className="font-semibold text-stone-900 text-right">{siteB.visiting_hours || '09:00 AM - 05:30 PM'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Domestic Fee</span>
                    <span className="font-semibold text-[#046A38] text-right">
                      {siteB.entry_fee?.domestic !== undefined ? `₹${siteB.entry_fee.domestic}` : '₹50 standard'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Foreigner Fee</span>
                    <span className="font-semibold text-stone-900 text-right">
                      {siteB.entry_fee?.foreigner !== undefined ? `₹${siteB.entry_fee.foreigner}` : '₹600 standard'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex justify-between">
                    <span className="text-stone-500">Nearest Rail Corridor</span>
                    <span className="font-semibold text-[#000080] text-right truncate max-w-[180px]">
                      {siteB.nearest_transport?.railway_station || 'Central Station'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectPlace(siteB.id);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#046A38] hover:bg-[#03542C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Explore {siteB.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
