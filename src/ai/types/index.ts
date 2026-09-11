import { TransitComparison, UserLocationContext, GroundingCitation } from '../../types';
export type { GroundingCitation };

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'hinglish';

export type AIIntent =
  | 'GENERAL_TOURISM'
  | 'PLACE_INFORMATION'
  | 'HERITAGE_INFORMATION'
  | 'UNESCO_INFORMATION'
  | 'NEARBY_SEARCH'
  | 'ROUTE_SEARCH'
  | 'TRANSPORT_RECOMMENDATION'
  | 'HOTEL_SEARCH'
  | 'RESTAURANT_SEARCH'
  | 'FOOD_RECOMMENDATION'
  | 'SHOPPING_SEARCH'
  | 'BUDGET_PLANNING'
  | 'ITINERARY_PLANNING'
  | 'TRIP_PLANNING'
  | 'TRIP_REPLAN'
  | 'PLACE_COMPARISON'
  | 'FARE_ESTIMATE'
  | 'TRAVEL_TIME'
  | 'WEATHER_PLANNING'
  | 'ACCESSIBILITY_SEARCH'
  | 'EMERGENCY_SEARCH'
  | 'IMAGE_RECOGNITION'
  | 'FOLLOW_UP'
  | 'CLARIFICATION'
  | 'GREETING'
  | 'UNKNOWN';

export interface AIRequest {
  message: string;
  conversation_id?: string;
  place_id?: string;
  place_name?: string;
  city?: string;
  history?: Array<{ role: 'user' | 'model' | 'assistant'; text?: string; content?: string }>;
  location?: {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
    city?: string;
    state?: string;
    locality?: string;
  };
  travel_context?: {
    destination?: string;
    origin?: string;
    days?: number;
    budget?: number;
    traveller_type?: 'solo' | 'family' | 'couple' | 'friends' | 'budget';
    pace?: 'relaxed' | 'moderate' | 'fast';
    interests?: string[];
  };
  image?: {
    data_base64?: string;
    mime_type?: string;
    image_url?: string;
  };
}

export interface ExtractedEntities {
  places: string[];
  cities: string[];
  states: string[];
  stations: string[];
  origin?: string;
  destination?: string;
  days?: number;
  budget?: number;
  traveller_type?: 'solo' | 'family' | 'couple' | 'friends' | 'budget';
  pace?: 'relaxed' | 'moderate' | 'fast';
  transit_mode?: 'train' | 'air' | 'road' | 'metro' | 'bus' | 'taxi' | 'auto' | 'walking' | 'all';
  food_preferences?: string[];
  hotel_preferences?: {
    max_budget?: number;
    min_rating?: number;
    category?: string;
  };
  accessibility_needs?: string[];
  replanning_action?: 'reduce_budget' | 'add_monument' | 'remove_expensive' | 'more_heritage' | 'reduce_walking' | 'family_friendly' | 'general';
}

export interface ResolvedLocation {
  name: string;
  entity_type: 'poi' | 'city' | 'state' | 'station' | 'airport' | 'landmark' | 'unknown';
  city?: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  confidence: number;
  is_verified: boolean;
  station_code?: string;
  is_ambiguous?: boolean;
  possible_matches?: string[];
}

export interface RouteOption {
  origin: string;
  destination: string;
  mode: string;
  distance_km: number;
  duration: string;
  fare_estimate: string;
  is_same_city: boolean;
  city?: string;
  transfers?: string[];
  notes?: string;
  suburban_lines?: string[];
  walking_segments?: Array<{ from: string; to: string; duration: string; distance_km: number }>;
}

export interface ItineraryDayActivity {
  time_slot: 'Morning' | 'Afternoon' | 'Evening';
  place_name: string;
  place_id?: string;
  activity: string;
  duration: string;
  travel_from_prev?: string;
  entry_fee_estimate?: string;
  tips?: string;
  is_indoor?: boolean;
}

export interface ItineraryDay {
  day_number: number;
  theme: string;
  activities: ItineraryDayActivity[];
  meal_suggestions: { lunch?: string; dinner?: string };
  estimated_daily_cost: string;
}

export interface ItineraryPlan {
  destination: string;
  days_count: number;
  traveller_type: string;
  pace: string;
  days: ItineraryDay[];
  total_estimated_cost: string;
  logistics_notes: string[];
}

export interface BudgetBreakdown {
  currency: string;
  destination: string;
  duration_days: number;
  travellers_count: number;
  stay_cost: { min: number; max: number; label: string };
  transport_cost: { min: number; max: number; label: string };
  food_cost: { min: number; max: number; label: string };
  tickets_entry_cost: { min: number; max: number; label: string };
  shopping_souvenirs_cost: { min: number; max: number; label: string };
  buffer_miscellaneous_cost: { min: number; max: number; label: string };
  total_estimated_range: { min: number; max: number; formatted: string };
  money_saving_tips: string[];
}

export interface StructuredAIResponse {
  success: boolean;
  type: string;
  intent: AIIntent;
  answer: string;
  confidence: number;
  locations: ResolvedLocation[];
  recommendations: Array<{
    id: string;
    name: string;
    category?: string;
    city: string;
    state?: string;
    reason?: string;
    distance_km?: number;
    rating?: number;
    price_indication?: string;
    thumbnail_url?: string;
    source_url?: string;
    data_confidence?: string;
  }>;
  routes: RouteOption[];
  itinerary: ItineraryPlan | null;
  budget: BudgetBreakdown | null;
  sources: string[];
  warnings: string[];
  followUpQuestions: string[];

  // Backward-compatible fields expected by existing Virasat frontend
  reply: string;
  suggested_places?: any[];
  transit_comparison?: TransitComparison | null;
  suggested_actions?: string[];
  grounding_citations?: GroundingCitation[];
  grounding_score?: number;
  latency_ms?: number;
  model_used?: string;
}
