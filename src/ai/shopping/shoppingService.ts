/**
 * Shopping, Handlooms, and Artisans Domain Service for Virasat AI Assistant
 * Provides verified GI craft recommendations, authentic artisan studios, and fair-pricing guidance.
 */

import { masterTourismDataService } from '../../server/masterTourismDataService';

export interface ArtisanItem {
  id: string;
  artisan_name: string;
  craft_tradition: string;
  gi_tag_status: boolean;
  city: string;
  state: string;
  story: string;
  workshop_location: string;
  demonstration_available: boolean;
  price_range: string;
  products: string[];
  thumbnail_url?: string;
  fair_trade_tips?: string;
}

const REGIONAL_ARTISANS: Record<string, ArtisanItem[]> = {
  varanasi: [
    {
      id: 'art-02-varanasi-weaver',
      artisan_name: 'Bunkar Heritage Handloom Collective',
      craft_tradition: 'Banarasi Kadhwa Silk Brocade & Sarees',
      gi_tag_status: true,
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      story: 'Guild of third-generation master weavers using pit looms where each floral motif is individually engraved without float threads.',
      workshop_location: 'Reori Talab, Madanpura Heritage Corridor, Varanasi',
      demonstration_available: true,
      price_range: '₹4,500 – ₹85,000',
      products: ['Kadhwa Sarees', 'Zari Stoles', 'Silk Brocade Fabric', 'Dupattas'],
      fair_trade_tips: 'Buy directly from government-certified weaver societies or the Handloom Bhavan; avoid auto/rickshaw driver commission shops.',
    },
  ],
  jaipur: [
    {
      id: 'art-01-jaipur-pottery',
      artisan_name: 'Kripal Kumbh Heritage Pottery Studio',
      craft_tradition: 'Jaipur Blue Pottery',
      gi_tag_status: true,
      city: 'Jaipur',
      state: 'Rajasthan',
      story: 'Studio carrying forward the revival work of Padma Shri Kripal Singh Shekhawat. Uses ground quartz, fuller earth, and natural mineral pigments without clay.',
      workshop_location: 'B-18, Shiv Marg, Bani Park, Jaipur',
      demonstration_available: true,
      price_range: '₹300 – ₹12,000',
      products: ['Glazed Tiles', 'Vases', 'Platters', 'Door Knobs', 'Planters'],
      fair_trade_tips: 'Rajasthan Government Emporium (Rajasthali on MI Road) offers fixed-price authenticity certification.',
    },
    {
      id: 'art-03-jaipur-gemstones',
      artisan_name: 'Johari Bazaar Gemstone & Meenakari Guild',
      craft_tradition: 'Kundan Meenakari Enameling & Jewellery',
      gi_tag_status: true,
      city: 'Jaipur',
      state: 'Rajasthan',
      story: 'Ancient enameling tradition patronized by Raja Man Singh I, setting precious stones into pure 24K gold foil frameworks.',
      workshop_location: 'Gopalji Ka Rasta, Johari Bazaar, Jaipur',
      demonstration_available: true,
      price_range: '₹1,500 – ₹1,50,000',
      products: ['Meenakari Earrings', 'Silver Filigree', 'Precious Gem Necklaces'],
      fair_trade_tips: 'Always demand a BIS Hallmark certificate and gemological laboratory test report.',
    },
  ],
  agra: [
    {
      id: 'art-agra-marble-inlay',
      artisan_name: 'Parchin Kari (Marble Inlay) Artisan Society',
      craft_tradition: 'Pietra Dura / Parchin Kari Marble Inlay',
      gi_tag_status: true,
      city: 'Agra',
      state: 'Uttar Pradesh',
      story: 'Descendants of the master craftsmen who built the Taj Mahal, hand-carving semi-precious stones into Makrana white marble.',
      workshop_location: 'Fatehabad Road / Tajganj, Agra',
      demonstration_available: true,
      price_range: '₹500 – ₹45,000',
      products: ['Inlaid Coasters', 'Marble Boxes', 'Tabletops', 'Plates'],
      fair_trade_tips: 'UP State Handloom Emporium (Gangotri) guarantees genuine Makrana marble rather than soapstone imitations.',
    },
  ],
};

export class ShoppingService {
  public getShoppingRecommendations(cityInput?: string): ArtisanItem[] {
    const city = (cityInput || 'Jaipur').trim();
    const cityLower = city.toLowerCase();

    // 1. Check artisansData in MasterTourismDataService
    const fromMaster = masterTourismDataService.artisansData || [];
    const matched: ArtisanItem[] = [];

    for (const a of fromMaster) {
      if (!cityLower || (a.city && a.city.toLowerCase().includes(cityLower)) || cityLower.includes((a.city || '').toLowerCase())) {
        matched.push({
          id: a.id,
          artisan_name: a.artisan_name,
          craft_tradition: a.craft_tradition,
          gi_tag_status: a.gi_tag_status ?? true,
          city: a.city,
          state: a.state,
          story: a.story,
          workshop_location: a.workshop_location,
          demonstration_available: a.demonstration_available ?? true,
          price_range: a.price_range || '₹500 – ₹15,000',
          products: a.products || ['Handmade crafts'],
          thumbnail_url: a.thumbnail_url,
          fair_trade_tips: 'Purchase directly from verified artisans or state government handloom emporia.',
        });
      }
    }

    if (matched.length > 0) return matched;

    // 2. Check regional artisans fallback
    for (const [key, items] of Object.entries(REGIONAL_ARTISANS)) {
      if (cityLower.includes(key) || key.includes(cityLower)) {
        return items;
      }
    }

    return REGIONAL_ARTISANS['jaipur'];
  }
}

export const shoppingService = new ShoppingService();
