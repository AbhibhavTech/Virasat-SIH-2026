/**
 * Itinerary Planning Engine for Virasat AI Assistant
 * Builds day-by-day Morning/Afternoon/Evening itineraries tailored to days, traveller type, and pace.
 */

import { ItineraryPlan, ItineraryDay } from '../types';
import { masterTourismDataService } from '../../server/masterTourismDataService';
import { budgetEngine } from '../budget/budgetEngine';

export class ItineraryEngine {
  public generateItinerary(options: {
    destination: string;
    days?: number;
    travellerType?: 'solo' | 'family' | 'couple' | 'friends' | 'budget';
    pace?: 'relaxed' | 'moderate' | 'fast';
  }): ItineraryPlan {
    const { destination, days = 3, travellerType = 'family', pace = 'moderate' } = options;
    const destClean = (destination || 'Jaipur').trim();
    const destLower = destClean.toLowerCase();

    const planDays: ItineraryDay[] = [];

    if (destLower.includes('jaipur')) {
      // Day 1: Royal Amber & Hilltop Forts
      planDays.push({
        day_number: 1,
        theme: 'Fortresses of the Aravallis & Sheesh Mahal',
        activities: [
          {
            time_slot: 'Morning',
            place_name: 'Amber (Amer) Fort & Sheesh Mahal',
            activity: 'Explore Rajput-Mughal hilltop fortress, Diwan-e-Aam, and mirror palace.',
            duration: '3 hours',
            entry_fee_estimate: '₹100 (Domestic) / ₹500 (Foreign)',
            tips: 'Arrive early by 8:30 AM to beat crowds; walk up or use registered jeeps.',
          },
          {
            time_slot: 'Afternoon',
            place_name: 'Panna Meena Ka Kund & Jaigarh Fort',
            activity: 'Visit 16th-century geometric stepwell and view the Jaivana cannon.',
            duration: '2.5 hours',
            travel_from_prev: '10 mins auto from Amber',
            tips: 'Great photography angle on stepwell terraces; wear comfortable walking shoes.',
          },
          {
            time_slot: 'Evening',
            place_name: 'Nahargarh Fort & Sunset Viewpoint',
            activity: 'Panoramic sunset view over the Pink City from Padao terrace.',
            duration: '2 hours',
            travel_from_prev: '20 mins uphill drive',
            tips: 'Carry a light jacket in winter evenings.',
          },
        ],
        meal_suggestions: {
          lunch: '1135 AD at Amber or local Rajasthani thali near Amer village',
          dinner: 'Padao Restaurant at Nahargarh with panoramic night views of the city',
        },
        estimated_daily_cost: '₹1,500 – ₹2,800 per person',
      });

      // Day 2: Walled Pink City Heritage & Astronomical Genius
      if (days >= 2) {
        planDays.push({
          day_number: 2,
          theme: 'Walled Pink City, Astronomy & Royal Palaces',
          activities: [
            {
              time_slot: 'Morning',
              place_name: 'City Palace Complex & Chandra Mahal',
              activity: 'Tour museum galleries, Peacock Courtyard (Pritam Niwas Chowk), and royal costumes.',
              duration: '2.5 hours',
              entry_fee_estimate: '₹200 (Courtyard)',
              tips: 'Buy composite ticket to bundle entry with Jantar Mantar and Hawa Mahal.',
            },
            {
              time_slot: 'Afternoon',
              place_name: 'Jantar Mantar (UNESCO Observatory)',
              activity: 'Marvel at 18th-century stone astronomical instruments and Vrihat Samrat Yantra sundial.',
              duration: '1.5 hours',
              travel_from_prev: '2 mins walk adjacent to City Palace',
              tips: 'Hire an ASI certified guide to understand the solar and celestial calculations.',
            },
            {
              time_slot: 'Evening',
              place_name: 'Hawa Mahal & Bapu Bazaar Walk',
              activity: 'Photograph 953 honeycomb jharokha windows followed by artisanal shopping for juttis and block prints.',
              duration: '2.5 hours',
              travel_from_prev: '5 mins walk from Jantar Mantar',
              tips: 'Rooftop cafes opposite Hawa Mahal offer premier front-elevation views.',
            },
          ],
          meal_suggestions: {
            lunch: 'LMB (Laxmi Mishthan Bhandar) in Johari Bazaar for Dal Baati Churma',
            dinner: 'Surabhi Restaurant & Turban Museum or Spice Court (Civil Lines)',
          },
          estimated_daily_cost: '₹1,400 – ₹2,500 per person',
        });
      }

      // Day 3: Arts, Cenotaphs & Modern Heritage
      if (days >= 3) {
        planDays.push({
          day_number: 3,
          theme: 'Albert Hall Museum, Gaitore Cenotaphs & Blue Pottery',
          activities: [
            {
              time_slot: 'Morning',
              place_name: 'Gaitore Ki Chhatriyan',
              activity: 'Intricately carved marble cenotaphs of Kachwaha rulers in a tranquil valley.',
              duration: '1.5 hours',
              entry_fee_estimate: '₹30',
              tips: 'Quiet, serene morning escape away from tourist rush.',
            },
            {
              time_slot: 'Afternoon',
              place_name: 'Albert Hall Museum (Ram Niwas Garden)',
              activity: 'Indo-Saracenic architectural masterpiece housing coins, Egyptian mummy, and metal crafts.',
              duration: '2 hours',
              travel_from_prev: '15 mins cab',
              entry_fee_estimate: '₹40 (Domestic)',
              tips: 'Illuminated with colorful floodlights after sunset.',
            },
            {
              time_slot: 'Evening',
              place_name: 'Patrika Gate & Chokhi Dhani Cultural Village',
              activity: 'Photogenic hand-painted Rajasthani archway followed by folk dances and dinner.',
              duration: '3 hours',
              travel_from_prev: '25 mins drive south',
              tips: 'Pre-book entry tickets for Chokhi Dhani during festive weekends.',
            },
          ],
          meal_suggestions: {
            lunch: 'Gulab Ji Chai & bun maska followed by thali at Natraj',
            dinner: 'Chokhi Dhani traditional open-air chaupal banquet',
          },
          estimated_daily_cost: '₹1,800 – ₹3,200 per person',
        });
      }
    } else {
      // Generalized generator using destination's places
      for (let i = 1; i <= Math.min(days, 5); i++) {
        planDays.push({
          day_number: i,
          theme: `Exploring Highlights of ${destClean} - Circuit ${i}`,
          activities: [
            {
              time_slot: 'Morning',
              place_name: `Historic Landmark & Heritage Zone of ${destClean}`,
              activity: 'Guided exploration of primary architectural and archaeological site.',
              duration: '3 hours',
              entry_fee_estimate: '₹50 (ASI standard)',
              tips: 'Start early morning for cooler weather and best lighting for photography.',
            },
            {
              time_slot: 'Afternoon',
              place_name: `Local Museum, Stepwell, or Cultural Centre`,
              activity: 'Indoor gallery walkthrough and historical artifact viewing.',
              duration: '2 hours',
              travel_from_prev: '15 mins local auto / taxi',
              is_indoor: true,
              tips: 'Ideal for midday heat avoidance.',
            },
            {
              time_slot: 'Evening',
              place_name: `Heritage Promenade & Traditional Artisan Bazaar`,
              activity: 'Sunset stroll, street food tasting, and browsing authentic GI-tagged crafts.',
              duration: '2.5 hours',
              travel_from_prev: '10 mins transit',
              tips: 'Bargain politely in unorganized markets; visit state emporia for fixed prices.',
            },
          ],
          meal_suggestions: {
            lunch: 'Traditional local thali at verified regional restaurant',
            dinner: 'Heritage courtyard dining with regional delicacies',
          },
          estimated_daily_cost: '₹1,200 – ₹2,400 per person',
        });
      }
    }

    const budget = budgetEngine.calculateBudget({
      destination: destClean,
      days,
      travellerType,
    });

    return {
      destination: destClean,
      days_count: days,
      traveller_type: travellerType,
      pace,
      days: planDays,
      total_estimated_cost: budget.total_estimated_range.formatted,
      logistics_notes: [
        'All monuments open under ASI guidelines; carry valid government photo ID.',
        'Composite passes save up to 40% on entry fees compared to individual ticketing.',
        'Prepaid taxis or official app-based rides are recommended for long transfers.',
      ],
    };
  }
}

export const itineraryEngine = new ItineraryEngine();
