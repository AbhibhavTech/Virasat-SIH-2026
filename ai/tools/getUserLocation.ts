export const declaration = {
  name: 'getUserLocation',
  description: "Get the traveler's active geolocation (latitude, longitude, detected city, and state) passed from the browser session.",
  parameters: {
    type: 'OBJECT',
    properties: {},
  },
};

export async function execute(_args: any, context?: any): Promise<any> {
  const loc = context?.userLocation || context?.location;

  if (loc && (loc.latitude || loc.lat)) {
    return {
      available: true,
      latitude: loc.latitude || loc.lat,
      longitude: loc.longitude || loc.lng,
      city: loc.city || 'Detected Location',
      state: loc.state || 'India',
      source: 'Browser Geolocation Context',
    };
  }

  // If city is specified in current page context
  if (context?.city || context?.currentCity) {
    return {
      available: true,
      city: context.city || context.currentCity,
      state: context.state || 'India',
      source: 'Page Navigation Context',
    };
  }

  return {
    available: false,
    default_anchor: {
      city: 'New Delhi',
      state: 'Delhi (NCT)',
      coordinates: { lat: 28.6139, lng: 77.209 },
      note: 'Location permission not granted; defaulted to National Capital Region anchor.',
    },
  };
}
