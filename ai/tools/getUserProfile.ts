import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'getUserProfile',
  description: "Get the traveler's registered profile, travel preferences (budget tier, heritage interests, dietary requirements, home city, accessibility needs) for tailored recommendations.",
  parameters: {
    type: 'OBJECT',
    properties: {},
  },
};

export async function execute(_args: any, context?: any): Promise<any> {
  const userId = context?.userId || context?.user?.id;

  if (userId) {
    const user = await db.users.findById(userId);
    if (user) {
      return {
        is_authenticated: true,
        user_id: user.id,
        name: user.name,
        home_city: user.home_city || 'Not specified',
        travel_preferences: user.preferences || user.survey || {
          pace: 'moderate',
          interests: ['heritage', 'architecture', 'local food'],
          budget_tier: 'mid-range',
        },
      };
    }
  }

  // Fallback to session context
  if (context?.user) {
    return {
      is_authenticated: true,
      name: context.user.name || 'Traveler',
      home_city: context.user.home_city || 'Delhi',
      travel_preferences: context.user.travel_preferences || context.user.preferences || {
        pace: 'moderate',
        interests: ['culture', 'sightseeing'],
      },
    };
  }

  return {
    is_authenticated: false,
    guest_profile: {
      traveler_type: 'Independent Cultural Explorer',
      default_interests: ['Historical Monuments', 'Authentic Local Food', 'Scenic Viewpoints'],
      recommended_pace: '2 to 3 major sights per day',
    },
  };
}
