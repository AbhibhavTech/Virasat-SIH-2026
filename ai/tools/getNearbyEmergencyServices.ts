import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'getNearbyEmergencyServices',
  description: 'Retrieve national and city-specific emergency helplines, tourist police contacts, hospital locations, and destination health/safety indicators.',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: {
        type: 'STRING',
        description: 'Destination city name (e.g. "Agra", "Mumbai", "Jaipur", "Varanasi", "Delhi").',
      },
    },
  },
};

let cachedHealth: any = null;
function getDestinationHealth() {
  if (!cachedHealth) {
    const p = path.join(process.cwd(), 'data', 'destination_health.json');
    if (fs.existsSync(p)) {
      try {
        cachedHealth = JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch {
        cachedHealth = null;
      }
    }
  }
  return cachedHealth;
}

export async function execute(args: { city?: string }): Promise<any> {
  const cityName = (args.city || '').trim().toLowerCase();

  const healthData = getDestinationHealth();
  let cityMetrics: any = null;

  if (healthData && healthData.cities) {
    cityMetrics = healthData.cities.find((c: any) =>
      c.city_name.toLowerCase().includes(cityName) || c.city_id.toLowerCase().includes(cityName)
    );
  }

  return {
    query_city: args.city || 'National Directory',
    national_emergency_helplines: {
      all_in_one_emergency: '112 (Police, Fire, Ambulance)',
      tourist_helpline_toll_free: '1363 (Ministry of Tourism 24x7 Multi-lingual Tourist Support in 12 languages)',
      medical_emergency_ambulance: '108',
      police_direct: '100',
      women_safety_helpline: '1091',
      railway_security_helpline: '139 (Indian Railways Security & Medical Help)',
      senior_citizen_helpline: '14567',
    },
    local_safety_info: cityMetrics
      ? {
          city: cityMetrics.city_name,
          state: cityMetrics.state,
          accessibility_score: `${cityMetrics.accessibility_score} / 100`,
          sanitation_readiness: `${cityMetrics.sanitation_readiness} / 100`,
          seasonal_safety_advisory: cityMetrics.peak_season_warning,
          recommended_health_precautions: cityMetrics.recommendations || [
            'Drink only bottled or boiled water.',
            'Keep emergency numbers saved offline.',
          ],
        }
      : {
          advisory: 'Tourist police assist booths are situated at all major UNESCO World Heritage monument ticket entry gates and primary railway station exits.',
        },
  };
}
