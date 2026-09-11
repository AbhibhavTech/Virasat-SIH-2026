/**
 * Weather and Seasonal Travel Planning Service for Virasat AI Assistant
 * Provides verified climate patterns, best travel seasons, and packing advisories across India.
 */

export interface WeatherSeasonInfo {
  destination: string;
  best_months: string;
  current_season_profile: string;
  temperature_range: string;
  rainfall_profile: string;
  favorable_for: string[];
  travel_advisories: string[];
  packing_recommendations: string[];
}

const REGIONAL_CLIMATES: Record<string, WeatherSeasonInfo> = {
  rajasthan: {
    destination: 'Jaipur & Rajasthan',
    best_months: 'October to March',
    current_season_profile: 'Dry subtropical desert climate with mild, sunny winter days and chilly desert nights.',
    temperature_range: '12°C – 28°C (Winter) | 32°C – 45°C (Peak Summer Apr–Jun)',
    rainfall_profile: 'Scant rainfall (under 500mm annually), mostly during July–August monsoon showers.',
    favorable_for: ['Heritage fort exploration', 'Desert camping & camel safaris', 'Cultural festivals & open-air bazaars'],
    travel_advisories: [
      'In summer (Apr–Jun), schedule sightseeing between 6:30 AM – 10:30 AM and rest during peak afternoon heat.',
      'In winter (Dec–Jan), carry warm layers as desert night temperatures can drop sharply to 8°C.',
    ],
    packing_recommendations: ['Breathable cotton wear', 'Sunglasses & SPF 50 sunblock', 'Warm jacket for evenings', 'Comfortable walking shoes with grip'],
  },
  goa: {
    destination: 'Goa & Konkan Coast',
    best_months: 'November to February (Beach & Water Sports) | July to September (Lush Monsoon & Waterfalls)',
    current_season_profile: 'Tropical maritime climate with balmy sea breezes.',
    temperature_range: '24°C – 32°C (Pleasant Winter) | 28°C – 34°C (Humid Summer)',
    rainfall_profile: 'Heavy southwest monsoon rainfall (approx 3,000mm) from June through September.',
    favorable_for: ['Heritage churches of Old Goa', 'Spice plantation tours', 'Dudhsagar waterfall trekking in monsoon', 'Coastal relaxation'],
    travel_advisories: [
      'Sea swimming and water sports are suspended by lifeguards from June to mid-October due to high tides and rough undertow.',
      'Monsoon season offers dramatic greenery, low hotel rates, and vibrant cultural feasts (Sao Joao).',
    ],
    packing_recommendations: ['Light quick-dry clothing', 'Waterproof footwear / sandals', 'Umbrella or rain poncho', 'Sun hat & mosquito repellent'],
  },
  ladakh: {
    destination: 'Leh Ladakh & High Himalayas',
    best_months: 'June to September (High Passes Open)',
    current_season_profile: 'High-altitude cold desert with strong UV radiation and crisp alpine air.',
    temperature_range: '10°C – 24°C (Summer) | -15°C – 2°C (Harsh Winter)',
    rainfall_profile: 'Extremely dry rain-shadow zone; receives less than 100mm rainfall per year.',
    favorable_for: ['Pangong Tso & Nubra Valley', 'Ancient Buddhist monasteries (Hemis, Thiksey)', 'Mountain biking & high-altitude passes'],
    travel_advisories: [
      'Mandatory 48-hour acclimatization rest in Leh before crossing Khardung La (17,982 ft) or Chang La to prevent AMS (Acute Mountain Sickness).',
      'Obtain Inner Line Permits (ILP) online through the official LAHDC portal.',
    ],
    packing_recommendations: ['Thermal innerwear & fleece jacket', 'UV 400 sunglasses', 'High SPF sunscreen & lip balm', 'Diamox (consult physician)', 'Sturdy trekking boots'],
  },
  varanasi: {
    destination: 'Varanasi & Uttar Pradesh',
    best_months: 'October to March',
    current_season_profile: 'Subtropical river basin climate with cool, misty winter mornings and balmy evenings.',
    temperature_range: '10°C – 26°C (Winter) | 32°C – 44°C (Summer)',
    rainfall_profile: 'Moderate to heavy monsoon showers along the Ganges from July to September.',
    favorable_for: ['Sunrise rowing boat rides on the Ganges', 'Evening Dashashwamedh Ghat Aarti', 'Walking ancient gali alleys'],
    travel_advisories: [
      'Winter brings early morning fog; plan dawn boat rides after 6:30 AM when visibility clears.',
      'Ghat water levels rise substantially in July–August during monsoon, partially submerging lower steps.',
    ],
    packing_recommendations: ['Modest cotton attire covering shoulders and knees for temple visits', 'Slip-on footwear easy to remove outside shrines', 'Light shawl for evening breeze on the ghats'],
  },
};

export class WeatherPlanner {
  public getWeatherGuidance(destinationInput?: string): WeatherSeasonInfo {
    const dest = (destinationInput || 'Rajasthan').trim();
    const lower = dest.toLowerCase();

    for (const [k, info] of Object.entries(REGIONAL_CLIMATES)) {
      if (lower.includes(k) || k.includes(lower)) {
        return info;
      }
    }

    // Default to Rajasthan profile with customized title
    return {
      ...REGIONAL_CLIMATES['rajasthan'],
      destination: dest,
    };
  }
}

export const weatherPlanner = new WeatherPlanner();
