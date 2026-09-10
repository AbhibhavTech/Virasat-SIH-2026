// =====================================================================
// Virasat Taxonomy: 11 Core Tourism & Heritage Topics and Subtopics
// =====================================================================

export const TOPICS_AND_SUBTOPICS = {
  Wildlife: [
    'Wildlife Sanctuaries',
    'Zoological Parks',
    'Bird Watching',
    'Marine Life',
    'National Parks',
  ],
  Heritage: [
    'Monuments',
    'Museums',
    'Historical Buildings',
    'UNESCO World Heritage Sites',
    'Archaeological Sites',
    'Historical Sites',
    'Palaces and Forts',
  ],
  Spiritual: [
    'Hinduism',
    'Islam',
    'Buddhism',
    'Sikhism',
    'Jainism',
    'Christianity',
    'Judaism',
  ],
  Adventure: [
    'Rafting',
    'Paragliding',
    'Parasailing',
    'Skiing',
    'Sky Diving',
    'Bungee Jumping',
    'Mountain Biking',
    'Hiking and Trekking',
    'Scuba Diving and Snorkeling',
    'Mountaineering and Rock Climbing',
  ],
  Gastronomy: [
    'Street Food',
    'Authentic Local Food',
    'Beverages',
    'Farm to Table',
    'Spices',
  ],
  Weddings: [
    'Palace Weddings',
    'Beach Weddings',
    'Mountain Weddings',
    'Island Weddings',
    'Vineyard Weddings',
    'Sustainable Weddings',
    'Cruise Weddings',
    'Adventure Weddings',
  ],
  Wellness: [
    'Yoga',
    'Ayurveda',
    'Meditation',
    'Naturopathy',
  ],
  Arts: [
    'Dance',
    'Music',
    'Painting',
    'Literature',
    'Theatre',
    'Textiles',
  ],
  Rural: [
    'Agro-Tourism',
    'Crafts Tourism',
    'Tribal Tourism',
    'Eco-Tourism',
    'Wildlife Tourism',
    'Live Like a Local',
  ],
  Nature: [
    'Deserts',
    'Sustainable Tourism',
    'Beaches and Cruises',
    'Hills and Mountains',
    'Forests and Gardens',
    'Rivers and Lakes',
  ],
  Recreation: [
    'Cinema',
    'Nightlife',
    'Sports',
    'Amusement and Theme Parks',
  ],
} as const;

export type TopicName = keyof typeof TOPICS_AND_SUBTOPICS;
export type SubtopicName = typeof TOPICS_AND_SUBTOPICS[TopicName][number];

export interface PlaceCategoryLink {
  topic: TopicName | string;
  subtopic: string;
}

export type EntityType =
  | 'city'
  | 'town'
  | 'district'
  | 'valley'
  | 'island'
  | 'region'
  | 'village';

export type VerificationStatus =
  | 'draft'
  | 'pending'
  | 'verified'
  | 'needs_review'
  | 'rejected';

export type SourceType =
  | 'state_tourism'
  | 'district_administration'
  | 'asi'
  | 'unesco'
  | 'forest_department'
  | 'ministry_of_tourism'
  | 'official_institution'
  | 'google_maps'
  | 'openstreetmap'
  | 'other';

export const ALLOWED_SOURCE_TYPES: { id: SourceType; label: string; official: boolean }[] = [
  { id: 'state_tourism', label: 'State Tourism Department', official: true },
  { id: 'district_administration', label: 'District Administration Portal', official: true },
  { id: 'asi', label: 'Archaeological Survey of India (ASI)', official: true },
  { id: 'unesco', label: 'UNESCO World Heritage Centre', official: true },
  { id: 'forest_department', label: 'State Forest / Wildlife Department', official: true },
  { id: 'ministry_of_tourism', label: 'Ministry of Tourism / Incredible India', official: true },
  { id: 'official_institution', label: 'Official Trust / Museum / Temple Authority', official: true },
  { id: 'google_maps', label: 'Google Maps (Location & Geo-coordinates only)', official: false },
  { id: 'openstreetmap', label: 'OpenStreetMap (Spatial verification only)', official: false },
  { id: 'other', label: 'Other Trustworthy Documented Source', official: false },
];

export type SourceQualityTier = 'place_specific' | 'official_site' | 'generic_homepage' | 'missing';

export const OFFICIAL_SITE_ALLOWLIST = [
  'shrikashivishwanath.org',
  'partitionmuseum.org',
  'eternalmewar.in',
  'somnath.org',
];

export function computeSourceQuality(url?: string): SourceQualityTier {
  if (!url || typeof url !== 'string' || !url.trim()) return 'missing';
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (OFFICIAL_SITE_ALLOWLIST.some(allowed => host === allowed || host.endsWith('.' + allowed))) {
      return 'official_site';
    }
    const path = parsed.pathname;
    if (path && path !== '/' && path.length > 1) {
      return 'place_specific';
    }
    return 'generic_homepage';
  } catch {
    return 'missing';
  }
}

