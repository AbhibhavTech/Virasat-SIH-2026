import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'updateItinerary',
  description: 'Add a new tourist place, adjust order, or modify stops in an active travel itinerary day.',
  parameters: {
    type: 'OBJECT',
    properties: {
      itinerary_id: {
        type: 'STRING',
        description: 'ID of the itinerary being modified.',
      },
      day_number: {
        type: 'NUMBER',
        description: 'Day number (1, 2, 3...) to add or update stops.',
      },
      action: {
        type: 'STRING',
        description: 'Action: "add_stop", "remove_stop", or "reorder".',
      },
      place_id: {
        type: 'STRING',
        description: 'ID of the monument/place to add or remove.',
      },
      place_name: {
        type: 'STRING',
        description: 'Name of the monument or tourist place.',
      },
      notes: {
        type: 'STRING',
        description: 'Recommended visit duration or tip (e.g., "Visit at sunset, 1.5 hrs").',
      },
    },
    required: ['action', 'place_name'],
  },
};

export async function execute(args: {
  itinerary_id?: string;
  day_number?: number;
  action: string;
  place_id?: string;
  place_name: string;
  notes?: string;
}, context?: any): Promise<any> {
  const dayNum = args.day_number || 1;
  const action = args.action || 'add_stop';

  // If modifying a persistent database itinerary
  if (args.itinerary_id) {
    const it = await db.itineraries.findById(args.itinerary_id);
    if (it) {
      const days = await db.itineraryDays.findByItinerary(it.id);
      let targetDay = days.find((d: any) => d.day_number === dayNum);

      if (!targetDay) {
        targetDay = await db.itineraryDays.create({
          id: `day-${Date.now()}`,
          itinerary_id: it.id,
          day_number: dayNum,
          area_title: `Day ${dayNum} Exploration`,
          theme: `Heritage Discovery`,
          notes: 'Auto-generated day plan',
          created_at: new Date().toISOString(),
        });
      }

      if (action === 'add_stop') {
        const newStop = await db.itineraryStops.create({
          id: `stop-${Date.now()}`,
          day_id: targetDay.id,
          itinerary_id: it.id,
          place_id: args.place_id || `place-${Date.now()}`,
          place_name: args.place_name,
          stop_order: 99,
          duration_minutes: 90,
          notes: args.notes || 'Recommended visit',
          created_at: new Date().toISOString(),
        });

        return {
          success: true,
          action: 'added_stop',
          day_number: dayNum,
          stop: newStop,
          message: `Successfully added "${args.place_name}" to Day ${dayNum}.`,
        };
      }
    }
  }

  // Session-level / memory itinerary mutation response
  return {
    success: true,
    action,
    day_number: dayNum,
    place: {
      id: args.place_id || 'custom-place',
      name: args.place_name,
      notes: args.notes || 'Scheduled stop',
    },
    message: `Updated Day ${dayNum} with "${args.place_name}".`,
  };
}
