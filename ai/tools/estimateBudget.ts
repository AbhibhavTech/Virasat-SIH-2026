import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'estimateBudget',
  description: 'Calculate an itemized travel budget estimate for any Indian circuit or city, broken down by accommodation, meals, monument entry fees, and local transit.',
  parameters: {
    type: 'OBJECT',
    properties: {
      destination: {
        type: 'STRING',
        description: 'Destination city or circuit (e.g. "Jaipur", "Agra", "Golden Triangle", "Varanasi", "Goa").',
      },
      duration_days: {
        type: 'NUMBER',
        description: 'Number of travel days (default 3).',
      },
      party_size: {
        type: 'NUMBER',
        description: 'Number of travelers (default 2).',
      },
      travel_style: {
        type: 'STRING',
        description: 'Travel tier: "budget" (hostels/dharamshalas, street food, buses), "mid_range" (3-4 star hotels, cabs, restaurants), or "luxury" (heritage palace hotels, private chauffeur, fine dining).',
      },
    },
    required: ['destination'],
  },
};

export async function execute(args: {
  destination: string;
  duration_days?: number;
  party_size?: number;
  travel_style?: string;
}): Promise<any> {
  const dest = args.destination.trim();
  const days = Math.max(args.duration_days || 3, 1);
  const people = Math.max(args.party_size || 2, 1);
  const style = (args.travel_style || 'mid_range').toLowerCase();

  let hotelPerNight = 4500;
  let foodPerDayPerPerson = 800;
  let localTransitPerDay = 1200;
  let entryFeesPerPersonPerDay = 350;

  if (style === 'budget') {
    hotelPerNight = 1500;
    foodPerDayPerPerson = 400;
    localTransitPerDay = 500;
    entryFeesPerPersonPerDay = 250;
  } else if (style === 'luxury') {
    hotelPerNight = 18000;
    foodPerDayPerPerson = 2500;
    localTransitPerDay = 3500;
    entryFeesPerPersonPerDay = 800;
  }

  const nights = Math.max(days - 1, 1);
  const totalHotel = hotelPerNight * nights * Math.ceil(people / 2);
  const totalFood = foodPerDayPerPerson * people * days;
  const totalLocalTransit = localTransitPerDay * days;
  const totalEntryFees = entryFeesPerPersonPerDay * people * days;
  const grandTotal = totalHotel + totalFood + totalLocalTransit + totalEntryFees;
  const perPerson = Math.round(grandTotal / people);

  return {
    destination: dest,
    duration: `${days} Days / ${nights} Nights`,
    party_size: `${people} Travelers`,
    travel_style: style.replace('_', ' ').toUpperCase(),
    breakdown_inr: {
      accommodation: `₹${totalHotel.toLocaleString('en-IN')} (approx. ₹${hotelPerNight.toLocaleString('en-IN')}/room/night)`,
      food_dining: `₹${totalFood.toLocaleString('en-IN')} (approx. ₹${foodPerDayPerPerson.toLocaleString('en-IN')}/person/day)`,
      local_transit: `₹${totalLocalTransit.toLocaleString('en-IN')} (cabs/autos/e-rickshaws for ${days} days)`,
      monument_tickets: `₹${totalEntryFees.toLocaleString('en-IN')} (ASI monuments & museum entries)`,
    },
    total_estimated_budget: `₹${grandTotal.toLocaleString('en-IN')}`,
    estimated_per_person: `₹${perPerson.toLocaleString('en-IN')}`,
    cost_saving_tips: [
      'Book ASI monument entry tickets online on the official ASI portal for a ₹5 to ₹10 discount per ticket.',
      'Use government prepaid auto/taxi booths at major railway stations to avoid inflated fares.',
      'Check combo tickets for state tourism sites (e.g. Jaipur Composite Entry Ticket).',
    ],
  };
}
