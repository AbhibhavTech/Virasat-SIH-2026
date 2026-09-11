/**
 * Budget Calculation Engine for Virasat AI Assistant
 * Provides detailed, grounded category-by-category budget breakdowns across Indian destinations.
 */

import { BudgetBreakdown } from '../types';
import { formatINR, formatRangeINR } from '../utils/formatters';

export class BudgetEngine {
  public calculateBudget(options: {
    destination: string;
    days?: number;
    travellers?: number;
    travellerType?: 'solo' | 'family' | 'couple' | 'friends' | 'budget';
  }): BudgetBreakdown {
    const { destination, days = 3, travellers = 1, travellerType = 'solo' } = options;
    const dest = destination || 'Jaipur';

    // Daily per-person/room rates based on traveller profile
    let dailyStayMin = 1200;
    let dailyStayMax = 2500;
    let dailyFoodMin = 500;
    let dailyFoodMax = 1200;
    let dailyTransportMin = 300;
    let dailyTransportMax = 700;
    let dailyTicketsMin = 150;
    let dailyTicketsMax = 350;

    if (travellerType === 'budget' || travellerType === 'solo') {
      dailyStayMin = 800;
      dailyStayMax = 1800;
      dailyFoodMin = 350;
      dailyFoodMax = 800;
      dailyTransportMin = 150;
      dailyTransportMax = 400;
    } else if (travellerType === 'couple') {
      dailyStayMin = 2200;
      dailyStayMax = 4500;
      dailyFoodMin = 1000;
      dailyFoodMax = 2200;
      dailyTransportMin = 600;
      dailyTransportMax = 1200;
    } else if (travellerType === 'family') {
      dailyStayMin = 3500;
      dailyStayMax = 7500;
      dailyFoodMin = 1800;
      dailyFoodMax = 3800;
      dailyTransportMin = 1000;
      dailyTransportMax = 2000;
      dailyTicketsMin = 400;
      dailyTicketsMax = 900;
    }

    const totalStayMin = dailyStayMin * days;
    const totalStayMax = dailyStayMax * days;
    const totalFoodMin = dailyFoodMin * days;
    const totalFoodMax = dailyFoodMax * days;
    const totalTransportMin = dailyTransportMin * days;
    const totalTransportMax = dailyTransportMax * days;
    const totalTicketsMin = dailyTicketsMin * days;
    const totalTicketsMax = dailyTicketsMax * days;
    const totalShoppingMin = 800;
    const totalShoppingMax = 3500;

    const subtotalMin = totalStayMin + totalFoodMin + totalTransportMin + totalTicketsMin + totalShoppingMin;
    const subtotalMax = totalStayMax + totalFoodMax + totalTransportMax + totalTicketsMax + totalShoppingMax;

    const bufferMin = Math.round(subtotalMin * 0.1);
    const bufferMax = Math.round(subtotalMax * 0.1);

    const grandTotalMin = subtotalMin + bufferMin;
    const grandTotalMax = subtotalMax + bufferMax;

    return {
      currency: 'INR',
      destination: dest,
      duration_days: days,
      travellers_count: travellers,
      stay_cost: {
        min: totalStayMin,
        max: totalStayMax,
        label: `${formatRangeINR(totalStayMin, totalStayMax)} (${days} nights accommodation)`,
      },
      transport_cost: {
        min: totalTransportMin,
        max: totalTransportMax,
        label: `${formatRangeINR(totalTransportMin, totalTransportMax)} (local metro, autos & cabs)`,
      },
      food_cost: {
        min: totalFoodMin,
        max: totalFoodMax,
        label: `${formatRangeINR(totalFoodMin, totalFoodMax)} (breakfast, thalis, street food & tea)`,
      },
      tickets_entry_cost: {
        min: totalTicketsMin,
        max: totalTicketsMax,
        label: `${formatRangeINR(totalTicketsMin, totalTicketsMax)} (ASI & monument entry tickets)`,
      },
      shopping_souvenirs_cost: {
        min: totalShoppingMin,
        max: totalShoppingMax,
        label: `${formatRangeINR(totalShoppingMin, totalShoppingMax)} (local crafts, textiles, spices)`,
      },
      buffer_miscellaneous_cost: {
        min: bufferMin,
        max: bufferMax,
        label: `${formatRangeINR(bufferMin, bufferMax)} (10% contingency & tips)`,
      },
      total_estimated_range: {
        min: grandTotalMin,
        max: grandTotalMax,
        formatted: formatRangeINR(grandTotalMin, grandTotalMax),
      },
      money_saving_tips: [
        'Book ASI monument entry tickets in advance on the official ASI portal (asi.payumoney.com) for a online booking discount.',
        'Buy composite multi-monument passes where available (e.g. Jaipur composite pass covers Amber, Hawa Mahal, Jantar Mantar, and Albert Hall).',
        'Use city metro networks or government prepaid auto booths at railway stations instead of unmetered street cabs.',
        'Savor authentic regional thalis at heritage dining halls for generous portions and authentic regional flavors at modest rates.',
      ],
    };
  }
}

export const budgetEngine = new BudgetEngine();
