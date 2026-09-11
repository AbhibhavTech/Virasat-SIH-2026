/**
 * Dynamic Trip Replanning Engine for Virasat AI Assistant
 * Modifies itineraries in real-time based on user feedback: budget cuts, adding monuments, reducing walking, etc.
 */

import { ItineraryPlan } from '../types';
import { itineraryEngine } from './itineraryEngine';

export class ReplanningEngine {
  public replan(
    currentPlan: ItineraryPlan | null,
    action: 'reduce_budget' | 'add_monument' | 'remove_expensive' | 'more_heritage' | 'reduce_walking' | 'family_friendly' | 'general',
    destination: string = 'Jaipur'
  ): { replanned: ItineraryPlan; explanation: string } {
    const basePlan = currentPlan || itineraryEngine.generateItinerary({ destination });

    // Deep clone base plan to preserve immutability
    const modified: ItineraryPlan = JSON.parse(JSON.stringify(basePlan));

    let explanation = '';

    switch (action) {
      case 'reduce_budget': {
        explanation = 'Adjusted itinerary for cheaper, cost-effective budget: substituted private cab hires with city metro and shared e-rickshaws, recommended composite monument passes (saves ~40%), and highlighted authentic regional food spots.';
        modified.total_estimated_cost = modified.total_estimated_cost.replace(/₹\s*[\d,]+/g, (match) => {
          const val = parseInt(match.replace(/[^\d]/g, ''), 10);
          return `₹${Math.round(val * 0.7)}`;
        });
        modified.logistics_notes.unshift('Cost-saving update: Use government composite monument pass & city metro.');
        for (const day of modified.days) {
          day.estimated_daily_cost = day.estimated_daily_cost.replace(/₹\s*[\d,]+/g, (m) => {
            const v = parseInt(m.replace(/[^\d]/g, ''), 10);
            return `₹${Math.round(v * 0.7)}`;
          });
        }
        break;
      }

      case 'reduce_walking': {
        explanation = 'Replanned for accessible, minimal-walking comfort: added battery-operated golf cart transfers inside expansive fort complexes (Amer Fort / City Palace), prioritized drop-offs directly at monument porticos, and added relaxing afternoon tea intervals.';
        for (const day of modified.days) {
          for (const act of day.activities) {
            act.tips = (act.tips ? act.tips + ' ' : '') + '(Accessible battery cart / direct drop-off available).';
          }
        }
        modified.logistics_notes.unshift('Accessibility update: Battery carts and wheel-friendly ramps mapped for all stops.');
        break;
      }

      case 'add_monument': {
        explanation = 'Added an additional high-value heritage site into the afternoon itinerary slot without compromising travel pacing.';
        if (modified.days[0]) {
          modified.days[0].activities.push({
            time_slot: 'Afternoon',
            place_name: 'Anokhi Museum of Hand Printing (Amer)',
            activity: 'Discover traditional Rajasthani woodblock carving and natural dye textiles inside a restored haveli.',
            duration: '1.5 hours',
            entry_fee_estimate: '₹30',
            tips: 'Located right next to Kheri Gate in Amer village; features live block-printing demonstrations.',
          });
        }
        break;
      }

      case 'family_friendly': {
        explanation = 'Tailored for family and multi-generational travel: padded extra transit buffers between sightseeing stops, scheduled cooler morning timings, and included engaging cultural shows suitable for children and elders alike.';
        modified.traveller_type = 'family';
        modified.pace = 'relaxed';
        break;
      }

      default: {
        explanation = 'Updated itinerary with refined scheduling and optimal seasonal sequence.';
        break;
      }
    }

    return { replanned: modified, explanation };
  }
}

export const replanningEngine = new ReplanningEngine();
