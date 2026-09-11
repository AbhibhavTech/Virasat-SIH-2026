import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'getEventsCalendar',
  description: 'Discover upcoming cultural festivals, temple celebrations, heritage fairs, and seasonal arts events across India.',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: {
        type: 'STRING',
        description: 'Optional city filter (e.g., "Varanasi", "Kolkata", "Pushkar", "Goa").',
      },
      month: {
        type: 'STRING',
        description: 'Optional month filter (e.g., "October", "November", "January").',
      },
    },
  },
};

const NATIONAL_FESTIVAL_CALENDAR = [
  {
    name: 'Dev Deepawali (Festival of Gods)',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    timing: 'Kartik Purnima (November)',
    significance: 'All 84 ghats illuminated with over a million earthen diyas, Ganga Maha Aarti, and celestial floating lamps.',
    tips: 'Reserve a wooden hand-rowed boat at Dashashwamedh Ghat at least 3 weeks in advance.',
  },
  {
    name: 'Durga Puja Cultural Carnival',
    city: 'Kolkata',
    state: 'West Bengal',
    timing: 'Ashwin (September - October)',
    significance: 'UNESCO Intangible Cultural Heritage celebration with monumental artistic pandals, dhunuchi naach, and bhog offerings.',
    tips: 'Get an authorized VIP Pandal Hopper Pass from West Bengal Tourism.',
  },
  {
    name: 'Pushkar Camel Fair (Pushkar Mela)',
    city: 'Pushkar / Ajmer',
    state: 'Rajasthan',
    timing: 'November',
    significance: 'Vibrant desert carnival featuring thousands of decorated camels, folk musicians, turban-tying contests, and holy lake bathing.',
    tips: 'Visit early mornings at the sand dunes for magical hot air balloon and sunrise camel silhouette photos.',
  },
  {
    name: 'Hornbill Festival',
    city: 'Kohima (Kisama Heritage Village)',
    state: 'Nagaland',
    timing: 'December 1 to 10',
    significance: '"Festival of Festivals" uniting all 17 Naga indigenous tribes in vibrant warrior dances, indigenous sports, and traditional morung architecture.',
    tips: 'Inner Line Permit (ILP) required; book camp stays and transport early.',
  },
  {
    name: 'Hampi Utsav (Vijaya Utsav)',
    city: 'Hampi',
    state: 'Karnataka',
    timing: 'November',
    significance: 'Grand cultural festival among the boulder ruins of the Vijayanagara Empire with illuminated monolithic temples and classical concerts.',
    tips: 'Virupaksha and Vijaya Vittala temple complexes are illuminated brilliantly at night.',
  },
  {
    name: 'Konark Dance Festival',
    city: 'Konark',
    state: 'Odisha',
    timing: 'December 1 to 5',
    significance: 'Classical Odissi, Bharatanatyam, and Kathak performances against the backdrop of the UNESCO Sun Temple.',
    tips: 'Pairs with the International Sand Art Festival at Chandrabhaga Beach.',
  },
];

export async function execute(args: { city?: string; month?: string }): Promise<any> {
  const cityFilter = (args.city || '').trim().toLowerCase();
  const monthFilter = (args.month || '').trim().toLowerCase();

  let matches = NATIONAL_FESTIVAL_CALENDAR;

  if (cityFilter) {
    matches = matches.filter((e) => e.city.toLowerCase().includes(cityFilter) || e.state.toLowerCase().includes(cityFilter));
  }

  if (monthFilter) {
    matches = matches.filter((e) => e.timing.toLowerCase().includes(monthFilter));
  }

  return {
    total_events: matches.length,
    events: matches.map((e) => ({
      festival: e.name,
      location: `${e.city}, ${e.state}`,
      season_timing: e.timing,
      cultural_significance: e.significance,
      visitor_guidance: e.tips,
    })),
    advisory: 'Dates for lunar calendar festivals vary each year. Always verify local temple trust announcements before booking flights.',
  };
}
