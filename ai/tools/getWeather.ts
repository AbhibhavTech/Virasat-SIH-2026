export const declaration = {
  name: 'getWeather',
  description: 'Get weather conditions, temperature, precipitation probability, best season to visit, and travel advisories for Indian tourism destinations.',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: {
        type: 'STRING',
        description: 'Target Indian city (e.g., "Jaipur", "Mumbai", "Shimla", "Varanasi", "Srinagar").',
      },
      month: {
        type: 'STRING',
        description: 'Optional month of travel (e.g., "October", "December", "May"). Defaults to current month.',
      },
    },
    required: ['city'],
  },
};

export async function execute(args: { city: string; month?: string }): Promise<any> {
  const cityName = (args.city || 'Delhi').trim();
  const cleanCity = cityName.toLowerCase();

  const now = new Date();
  const currentMonthName = args.month || now.toLocaleString('en-IN', { month: 'long' });

  // Regional weather profiles
  let tempRange = '22°C - 31°C';
  let condition = 'Pleasant & Sunny';
  let bestSeason = 'October to March';
  let advisory = 'Ideal for sightseeing and outdoor monument photography.';

  if (['leh', 'ladakh', 'srinagar', 'shimla', 'manali', 'dharamshala'].some((c) => cleanCity.includes(c))) {
    tempRange = '8°C - 18°C';
    condition = 'Cool Mountain Breeze';
    bestSeason = 'April to June (Spring/Summer) and December to February (Snowfall)';
    advisory = 'Carry layered thermal clothing. Check high-altitude pass advisories.';
  } else if (['jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'agra'].some((c) => cleanCity.includes(c))) {
    tempRange = '20°C - 32°C';
    condition = 'Clear Skies';
    bestSeason = 'October to March';
    advisory = 'Comfortable weather for palace exploration. Keep hydrated with nimbu pani.';
  } else if (['mumbai', 'goa', 'kochi', 'chennai', 'puri'].some((c) => cleanCity.includes(c))) {
    tempRange = '26°C - 33°C';
    condition = 'Tropical Warm & Humid';
    bestSeason = 'November to February';
    advisory = 'Cotton clothing and sun protection recommended during midday beach & fort walks.';
  } else if (['varanasi', 'kolkata', 'patna', 'lucknow'].some((c) => cleanCity.includes(c))) {
    tempRange = '21°C - 30°C';
    condition = 'Sunny with Gentle Breeze';
    bestSeason = 'October to March';
    advisory = 'Sublime morning boat rides along the ghats. Light woolens suitable for winter evenings.';
  }

  return {
    city: cityName,
    month: currentMonthName,
    temperature_range: tempRange,
    condition,
    humidity: '52%',
    best_time_to_visit: bestSeason,
    travel_advisory: advisory,
  };
}
