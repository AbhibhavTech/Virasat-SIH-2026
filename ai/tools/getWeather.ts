export const declaration = {
  name: 'getWeather',
  description: 'Return broad seasonal travel guidance only. This tool has no live weather provider and must not be used for current temperatures, forecasts, humidity, or alerts.',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: {
        type: 'STRING',
        description: 'Target Indian city (e.g., "Jaipur", "Mumbai", "Shimla", "Varanasi", "Srinagar").',
      },
      month: {
        type: 'STRING',
        description: 'Optional month of travel (e.g., "October", "December", "May").',
      },
    },
    required: ['city'],
  },
};

export async function execute(args: { city: string; month?: string }): Promise<any> {
  const city = (args.city || '').trim();
  if (!city) return { error: 'A destination is required for seasonal travel guidance.' };
  const cleanCity = city.toLowerCase();

  let bestTimeToVisit = 'Seasonal conditions vary; check a current forecast before travel.';
  let advisory = 'This is general seasonal guidance, not a current weather forecast.';

  if (['leh', 'ladakh', 'srinagar', 'shimla', 'manali', 'dharamshala'].some((place) => cleanCity.includes(place))) {
    bestTimeToVisit = 'April to June for milder conditions; winter travel can be affected by snow and road closures.';
    advisory = 'Check current high-altitude road, weather, and access advisories before departure.';
  } else if (['jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'agra'].some((place) => cleanCity.includes(place))) {
    bestTimeToVisit = 'October to March is generally preferred for sightseeing.';
    advisory = 'Heat can affect outdoor sightseeing in warmer months; verify the forecast near your travel date.';
  } else if (['mumbai', 'goa', 'kochi', 'chennai', 'puri'].some((place) => cleanCity.includes(place))) {
    bestTimeToVisit = 'November to February is generally preferred for outdoor visits.';
    advisory = 'Monsoon conditions can affect coastal travel; verify local weather and advisories near your travel date.';
  } else if (['varanasi', 'kolkata', 'patna', 'lucknow'].some((place) => cleanCity.includes(place))) {
    bestTimeToVisit = 'October to March is generally preferred for sightseeing.';
    advisory = 'This is broad seasonal guidance only; check a current forecast before travel.';
  }

  return {
    city,
    requested_month: args.month || null,
    live_weather_available: false,
    temperature_range: null,
    condition: null,
    humidity: null,
    best_time_to_visit: bestTimeToVisit,
    travel_advisory: advisory,
    disclaimer: 'No live weather service is configured for this build.',
  };
}
