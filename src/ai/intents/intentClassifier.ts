/**
 * Intent Classifier for Virasat AI Assistant
 * Classifies queries across 24+ travel & heritage intents, supporting natural conversational queries.
 */

import { AIIntent, AIRequest } from '../types';

export function classifyIntent(request: AIRequest): AIIntent {
  const text = (request.message || '').trim().toLowerCase();

  // If image provided
  if (request.image?.data_base64 || request.image?.image_url) {
    if (!text || text.length < 10 || /\b(identify|image|photo|picture|monument|landmark|what is this)\b/i.test(text)) {
      return 'IMAGE_RECOGNITION';
    }
  }

  // Greetings & conversational check-in
  if (
    /^(hi|hello|hey|namaste|pranam|khammaghani|vanakkam|good morning|good evening|good afternoon)\b/i.test(text) ||
    /\b(bhai kya haal|kya haal hai|kaise ho|sab badhiya|kya hal chal)\b/i.test(text)
  ) {
    return 'GREETING';
  }

  // Conversational trip planning follow-up (e.g. "family ke liye", "family ke saath", "friends ke saath", "5 din", "3 days")
  if (
    /\b(family ke liye|family ke saath|solo trip|friends ke saath|couple trip)\b/i.test(text) ||
    /^\s*([1-9]\d*)\s*(?:days?|din|दिन)(?:\s*(?:ka|ka trip|trip))?\s*$/i.test(text)
  ) {
    return 'ITINERARY_PLANNING';
  }

  // Budget query or budget follow-up (e.g. "budget 30k", "budget 20000", "₹30,000 budget")
  if (
    /\b(budget breakdown|how much will it cost|cost breakdown|estimated cost|trip cost|expense breakdown|travel expenses|per day cost|budget for .* days)\b/i.test(text) ||
    /\b(budget\s*\d+\s*k|budget\s*\d[\d,]*|\d+\s*k\s*budget|kitna kharcha|budget hai)\b/i.test(text)
  ) {
    return 'BUDGET_PLANNING';
  }

  // Replanning actions (contextual modification of existing plan)
  if (
    /\b(make it cheaper|reduce budget|cut cost|add another monument|add more places|less walking|remove expensive|reduce walking|make it family friendly|modify trip|replan)\b/i.test(text) ||
    (request.travel_context?.destination && /\b(cheaper|less walking|add|change|modify)\b/i.test(text))
  ) {
    return 'TRIP_REPLAN';
  }

  // Emergency & Facilities
  if (
    /\b(emergency|police|tourist police|hospital|medical|doctor|ambulance|helpline|lost|safety|scam|sos|first aid)\b/i.test(text)
  ) {
    return 'EMERGENCY_SEARCH';
  }

  // Accessibility
  if (
    /\b(wheelchair|accessible|ramp|disability|disabled|handicap|elderly|lift|elevator|step free|mobility)\b/i.test(text)
  ) {
    return 'ACCESSIBILITY_SEARCH';
  }

  // Weather & Seasonal Best Time
  if (
    /\b(weather|monsoon|summer|winter|rain|temperature|best time to visit|best season|when to visit|climate|heat)\b/i.test(text)
  ) {
    return 'WEATHER_PLANNING';
  }

  // Fare Estimate
  if (
    /\b(auto fare|taxi fare|cab fare|ticket price|bus fare|train fare|how much does auto charge|fare estimate|rate card|tariff|meter fare)\b/i.test(text)
  ) {
    return 'FARE_ESTIMATE';
  }

  // Travel Time
  if (
    /\b(how long will it take|how much time|travel time|duration from|duration between|how many hours to reach)\b/i.test(text)
  ) {
    return 'TRAVEL_TIME';
  }

  // Multimodal Route & Transit
  if (
    /\b(travel from|how to reach|route from|way to travel|how do i go from|from .* to .*|reach .* from .*|train to|flight to|drive to|bus to|transit)\b/i.test(text) ||
    /\b(csmt to churchgate|delhi to agra|mumbai to goa|how to go)\b/i.test(text) ||
    /\b(kasa jaycha|kaise jaye|kaise pauche|kaise jaaun|kaise jaun|se .* kaise|se .* jana|se .* jaana)\b/i.test(text) ||
    /(से.*कैसे|कसे जायचे|कसे जावे|जाऊ शकतो|काहे जाना|कैसे जाऊं)/i.test(text)
  ) {
    return 'ROUTE_SEARCH';
  }

  // General Transport Recommendation
  if (
    /\b(transport options|metro line|suburban line|local train|best mode of transport|which train|which bus)\b/i.test(text)
  ) {
    return 'TRANSPORT_RECOMMENDATION';
  }

  // Itinerary Planning
  if (
    /\b(itinerary|plan a trip|plan .* day|trip to|travel plan|circuit|day by day|day wise|multi day|tour plan|schedule for)\b/i.test(text) ||
    /([1-9]\d*\s*(?:days?|din)\s*(?:ka\s*)?(?:trip|tour|itinerary|plan|ka trip)\b)/i.test(text) ||
    /([1-9]\d*\s*दिन(?:\s*का)?(?:\s*ट्रिप|\s*टूर|\s*प्लान)?)/i.test(text) ||
    /\b(trip planner|ghoomne ka plan|trip bana|trip plan|plan bana|jaana hai|jana hai)\b/i.test(text) ||
    /(दिन का ट्रिप|ट्रिप बना|दिन का प्लान|प्लान बना|जाना है)/i.test(text)
  ) {
    return 'ITINERARY_PLANNING';
  }

  // Shopping & Artisans & Handloom
  if (
    /\b(shopping|where to buy|artisan|handloom|handicraft|craft|silk|sari|saree|souvenir|bazaar|market|pottery|embroidery)\b/i.test(text)
  ) {
    return 'SHOPPING_SEARCH';
  }

  // Food & Culinary Heritage
  if (
    /\b(food|eat|restaurant|cuisine|culinary|dish|dishes|famous food|local food|street food|breakfast|dinner|lunch|sweets|mithai|thali)\b/i.test(text) ||
    /\b(khane ke liye|kya khaye|prasiddh khadya)\b/i.test(text)
  ) {
    return 'FOOD_RECOMMENDATION';
  }

  // Hotels & Accommodation
  if (
    /\b(hotel|stay|resort|homestay|dharamshala|guest house|accommodation|lodging|where to stay|room)\b/i.test(text)
  ) {
    return 'HOTEL_SEARCH';
  }

  // Comparison
  if (
    /\b(compare|versus|vs|or should i go|which is better|jaipur or udaipur)\b/i.test(text)
  ) {
    return 'PLACE_COMPARISON';
  }

  // UNESCO Heritage
  if (
    /\b(unesco|world heritage|heritage site|historical site|protected monument|ancient monument)\b/i.test(text)
  ) {
    return 'UNESCO_INFORMATION';
  }

  // Nearby Search
  if (
    /\b(near me|nearby|around me|close to|surrounding|in the vicinity|attractions around)\b/i.test(text) ||
    /\b(javal|paas mein)\b/i.test(text)
  ) {
    return 'NEARBY_SEARCH';
  }

  // Place Information & Timings
  if (
    /\b(timings|opening hours|entry fee|ticket|history|significance|architecture|closed on|about|details of|who built|kaha hai|where is)\b/i.test(text)
  ) {
    return 'PLACE_INFORMATION';
  }

  // Fallback to General Tourism
  return 'GENERAL_TOURISM';
}
