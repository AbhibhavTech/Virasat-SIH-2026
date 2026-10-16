import React from 'react';
import { ShoppingBag, Sparkles, HeartHandshake, CheckCircle2, ExternalLink } from 'lucide-react';
import { PlaceDetail } from '../../types';

interface LocalArtisansGICraftsCardProps {
  place: PlaceDetail;
}

interface GICraftItem {
  name: string;
  category: string;
  description: string;
  origin: string;
  icon: string;
}

export const LocalArtisansGICraftsCard: React.FC<LocalArtisansGICraftsCardProps> = ({ place }) => {
  const getCraftsForRegion = (stateName?: string, cityName?: string): GICraftItem[] => {
    const s = (stateName || '').toLowerCase();
    const c = (cityName || '').toLowerCase();

    if (s.includes('maharashtra') || c.includes('mumbai') || c.includes('panvel')) {
      return [
        {
          name: 'Paithani Silk Handloom',
          category: 'Handloom & Textile (GI Tagged)',
          description: 'Prestigious handwoven silk sarees with peacock motifs and pure gold zari borders, woven since the Satavahana era.',
          origin: 'Maharashtra',
          icon: '🥻',
        },
        {
          name: 'Warli Tribal Painting',
          category: 'Indigenous Folk Art (GI Tagged)',
          description: 'Geometrical white rice paste paintings on mud walls depicting harvest, sacred rituals, and the circle of life.',
          origin: 'Northern Maharashtra',
          icon: '🎨',
        },
        {
          name: 'Kolhapuri Leather Craft',
          category: 'Handmade Footwear (GI Tagged)',
          description: 'Authentic vegetable-tanned leather footwear handcrafted by traditional artisan families.',
          origin: 'Kolhapur, Maharashtra',
          icon: '👞',
        },
      ];
    }

    if (s.includes('rajasthan') || c.includes('jaipur')) {
      return [
        {
          name: 'Jaipur Blue Pottery',
          category: 'Ceramic Art (GI Tagged)',
          description: 'Traditional Egyptian paste pottery crafted without clay, hand-painted with cobalt oxide and floral motifs.',
          origin: 'Jaipur, Rajasthan',
          icon: '🏺',
        },
        {
          name: 'Sanganeri Hand Block Print',
          category: 'Textile Printing (GI Tagged)',
          description: 'Centuries-old wooden block printing using natural vegetable dyes on fine cotton muslin.',
          origin: 'Sanganer, Rajasthan',
          icon: '🧵',
        },
        {
          name: 'Rajasthani Kathputli Puppets',
          category: 'Traditional Folk Craft',
          description: 'Handcrafted wooden marionettes adorned with bright bandhani garments, preserving folk storytelling.',
          origin: 'Rajasthan',
          icon: '🎭',
        },
      ];
    }

    if (s.includes('uttar pradesh') || c.includes('agra') || c.includes('varanasi')) {
      return [
        {
          name: 'Agra Marble Inlay (Pietra Dura)',
          category: 'Stone Craft (GI Tagged)',
          description: 'Intricate marble carving and semi-precious stone inlay as seen on the Taj Mahal and Agra Fort.',
          origin: 'Agra, Uttar Pradesh',
          icon: '🏛️',
        },
        {
          name: 'Banarasi Brocade & Silk',
          category: 'Handloom & Textile (GI Tagged)',
          description: 'Finest handwoven silk with silver and gold zari work, woven by master weavers of the Kashi ghats.',
          origin: 'Varanasi, Uttar Pradesh',
          icon: '✨',
        },
        {
          name: 'Lucknow Chikan Embroidery',
          category: 'Needle Craft (GI Tagged)',
          description: 'Delicate and shadow needle embroidery practiced on fine cotton and muslin.',
          origin: 'Uttar Pradesh',
          icon: '🪡',
        },
      ];
    }

    // Default pan-India authentic craft list
    return [
      {
        name: 'Dhokra Brass Metal Casting',
        category: 'Ancient Lost-Wax Metal Art',
        description: 'Over 4,000 years old non-ferrous metal casting heritage tracing back to the Dancing Girl of Mohenjo-Daro.',
        origin: 'Tribal India',
        icon: '🪙',
      },
      {
        name: 'Traditional Terracotta Pottery',
        category: 'Eco-Friendly Pottery',
        description: 'Handmade earthen crafts, diyas, and temple figurines crafted by generational village potters.',
        origin: 'Traditional India',
        icon: '🏺',
      },
      {
        name: 'Natural Handloom Khadi & Cotton',
        category: 'Sustainable Handloom',
        description: 'Spun on traditional charkha handlooms, empowering rural women artisans across the country.',
        origin: 'All-India Rural Weavers',
        icon: '🧶',
      },
    ];
  };

  const crafts = getCraftsForRegion(place.state, place.city);

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF671F] flex items-center justify-center shrink-0 border border-orange-200">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-1.5">
              <span>Vocal for Local • GI-Tagged Handicrafts</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Support Artisans
              </span>
            </h3>
            <p className="text-[11px] text-stone-600">
              Verified local artisanal traditions and souvenir bazaars near {place.name}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-orange-800 font-semibold flex items-center gap-1">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Fair Trade Rural Initiative</span>
        </span>
      </div>

      {/* Craft Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {crafts.map((craft, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-2 hover:shadow-xs transition"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">{craft.icon}</span>
              <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold border border-stone-200 truncate max-w-[140px]">
                {craft.origin}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-xs text-stone-900 font-serif line-clamp-1">
                {craft.name}
              </h4>
              <p className="text-[10px] font-semibold text-orange-700">
                {craft.category}
              </p>
            </div>

            <p className="text-[11px] text-stone-600 leading-snug line-clamp-3">
              {craft.description}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-1 flex items-center justify-between text-[11px] text-stone-600 flex-wrap gap-2">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Purchasing directly from certified artisan cooperatives supports indigenous heritage conservation.</span>
        </span>
      </div>
    </div>
  );
};
