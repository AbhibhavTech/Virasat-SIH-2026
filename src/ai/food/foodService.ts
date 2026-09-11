/**
 * Culinary and Food Domain Service for Virasat AI Assistant
 * Provides verified culinary heritage, GI food specialties, and regional delicacies across India.
 */

import { masterTourismDataService } from '../../server/masterTourismDataService';

export interface FoodItem {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  cultural_significance?: string;
  best_locations: string[];
  tags: string[];
  thumbnail_url?: string;
}

// Fallback regional culinary database for key tourist circuits
const REGIONAL_FOOD_SPECIALTIES: Record<string, FoodItem[]> = {
  agra: [
    {
      id: 'cul-agra-petha',
      name: 'Agra Petha (Panchi Petha & Kesar varieties)',
      city: 'Agra',
      state: 'Uttar Pradesh',
      description: 'Translucent soft confection made from candied winter melon, perfected in royal Mughal kitchens during the construction of the Taj Mahal.',
      best_locations: ['Panchi Petha at Sadar Bazaar', 'Noori Gate', 'Hari Parbat'],
      tags: ['Vegetarian Sweet', 'Mughal Heritage', 'GI Advocacy'],
    },
    {
      id: 'cul-agra-bedmi-puri',
      name: 'Bedmi Puri & Aloo Sabzi with Jalebi',
      city: 'Agra',
      state: 'Uttar Pradesh',
      description: 'Crispy deep-fried lentil-stuffed flatbread served with spicy sour potato curry and fenugreek chutney.',
      best_locations: ['Deviram Sweets (Pratappura)', 'Chimmanlal Poori Wale'],
      tags: ['Traditional Breakfast', 'Pure Vegetarian'],
    },
  ],
  mumbai: [
    {
      id: 'cul-mumbai-vada-pav',
      name: 'Mumbai Vada Pav & Pav Bhaji',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Spiced mashed potato fritter nestled inside fresh pav bun with dry garlic chili chutney; quintessential heritage fast food of Mumbai.',
      best_locations: ['Aaram Vada Pav (CSMT Terminus)', 'Ashok Vada Pav (Kirti College)', 'Sardar Refreshments (Tardeo)'],
      tags: ['Street Food', 'Vegetarian Heritage'],
    },
    {
      id: 'cul-mumbai-malvani',
      name: 'Coastal Malvani Thali & Solkadhi',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Fresh Konkan seafood or coconut-lentil curries spiced with dried red chilies, coriander, and sour kokum digestif.',
      best_locations: ['Chaitanya (Dadar)', 'Highway Gomantak (Bandra East)'],
      tags: ['Coastal Seafood', 'Authentic Regional'],
    },
  ],
  jaipur: [
    {
      id: 'cul-jaipur-dal-baati',
      name: 'Authentic Rajasthani Dal Baati Churma',
      city: 'Jaipur',
      state: 'Rajasthan',
      description: 'Baked wheat flour dough balls dipped in pure desi ghee, served with five-lentil panchmel dal and sweet crushed churma.',
      best_locations: ['Laxmi Mishthan Bhandar (LMB, Johari Bazaar)', 'Chokhi Dhani Ethnic Village'],
      tags: ['Royal Rajasthani', 'Pure Vegetarian Thali'],
    },
    {
      id: 'cul-jaipur-kachori',
      name: 'Pyaaz Kachori & Mirchi Vada',
      city: 'Jaipur',
      state: 'Rajasthan',
      description: 'Flaky crisp pastry stuffed with spiced onion filling, served hot with tamarind and mint chutneys.',
      best_locations: ['Rawat Mishtan Bhandar (Station Road)', 'Radhe Kachori'],
      tags: ['Breakfast Specialty', 'Street Food'],
    },
  ],
  varanasi: [
    {
      id: 'cul-varanasi-tamatar-chaat',
      name: 'Banarasi Tamatar Chaat & Malaiyo',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      description: 'Warm spiced tomato mash cooked in ghee with cashews and cumin, alongside ethereal saffron milk foam (Malaiyo, winter delicacy).',
      best_locations: ['Kashi Chaat Bhandar (Godowlia)', 'Deena Chaat Bhandar (Dashashwamedh)'],
      tags: ['Ghat Street Food', 'Unique Heritage Dish'],
    },
    {
      id: 'cul-varanasi-paan',
      name: 'GI-Tagged Banarasi Paan',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      description: 'Tender betel leaf layered with gulkand (rose petal jam), kattha, areca nut, and cooling aromatic spices.',
      best_locations: ['Keshav Tambul Bhandar (Lanka)', 'Gopal Sah Paan Bhandar'],
      tags: ['GI Tagged', 'Digestive Heritage'],
    },
  ],
  amritsar: [
    {
      id: 'cul-amritsar-kulcha',
      name: 'Amritsari Stuffed Kulcha & Creamy Lassi',
      city: 'Amritsar',
      state: 'Punjab',
      description: 'Tandoor-baked layered flatbread stuffed with spiced potatoes and cauliflower, slathered in butter and served with tangy chickpea chole.',
      best_locations: ['Kulcha Land (Ranjit Avenue)', 'Bhai Kulwant Singh Kulchian Wale'],
      tags: ['Iconic Punjabi Breakfast', 'Vegetarian'],
    },
  ],
};

export class FoodService {
  public getFoodRecommendations(cityInput?: string, preference?: string): FoodItem[] {
    const city = (cityInput || 'Mumbai').trim();
    const cityLower = city.toLowerCase();

    // 1. Check cultureData from MasterTourismDataService
    const cultureData = masterTourismDataService.cultureData || [];
    const fromMaster: FoodItem[] = [];

    for (const c of cultureData) {
      if (c.category?.toLowerCase().includes('food') || c.category?.toLowerCase().includes('culinary')) {
        if (!cityLower || c.city?.toLowerCase().includes(cityLower) || cityLower.includes(c.city?.toLowerCase())) {
          fromMaster.push({
            id: c.id,
            name: c.name,
            city: c.city,
            state: c.state,
            description: c.description,
            cultural_significance: c.cultural_significance,
            best_locations: c.best_locations || ['Local heritage food lanes'],
            tags: c.tags || ['Culinary Heritage'],
            thumbnail_url: c.thumbnail_url,
          });
        }
      }
    }

    if (fromMaster.length > 0) {
      return fromMaster;
    }

    // 2. Fallback to regional specialties
    for (const [key, items] of Object.entries(REGIONAL_FOOD_SPECIALTIES)) {
      if (cityLower.includes(key) || key.includes(cityLower)) {
        return items;
      }
    }

    // Default return Mumbai specialties
    return REGIONAL_FOOD_SPECIALTIES['mumbai'];
  }
}

export const foodService = new FoodService();
