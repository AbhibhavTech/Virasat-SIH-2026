/**
 * Emergency and Tourist Facilities Domain Service for Virasat AI Assistant
 * Provides verified tourist police posts, hospitals, 24x7 emergency helplines, and safety advisories.
 */

import { masterTourismDataService } from '../../server/masterTourismDataService';

export interface EmergencyFacility {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  contact: string;
  description: string;
  is_24x7: boolean;
}

export interface EmergencyResponse {
  city: string;
  national_helplines: Array<{ service: string; number: string; description: string }>;
  local_facilities: EmergencyFacility[];
  safety_advisories: string[];
}

export class EmergencyService {
  public getEmergencyInfo(cityInput?: string): EmergencyResponse {
    const city = (cityInput || 'General').trim();
    const cityLower = city.toLowerCase();

    const nationalHelplines = [
      { service: 'National All-in-One Emergency', number: '112', description: 'Immediate police, fire, or medical dispatch across India' },
      { service: 'Incredible India Tourist Helpline', number: '1363 / 1800-11-1363', description: '24x7 Toll-Free Multilingual Tourist Support (12 languages)' },
      { service: 'Railway Protection Force (RPF)', number: '139', description: 'Security and passenger assistance across all Indian trains & stations' },
      { service: 'Women Helpline', number: '1091 / 181', description: '24x7 dedicated emergency assistance for women travellers' },
      { service: 'Ambulance / Medical', number: '108 / 102', description: 'Emergency medical response' },
    ];

    const facilities = masterTourismDataService.facilitiesData || [];
    const matchedFacilities: EmergencyFacility[] = [];

    for (const f of facilities) {
      if (!cityLower || cityLower === 'general' || (f.city && f.city.toLowerCase().includes(cityLower)) || cityLower.includes((f.city || '').toLowerCase())) {
        matchedFacilities.push({
          id: f.id,
          name: f.name,
          type: f.type,
          city: f.city,
          address: f.address,
          contact: f.contact,
          description: f.description,
          is_24x7: Boolean(f.is_24x7),
        });
      }
    }

    const safetyAdvisories = [
      'Engage only ASI-licensed guides displaying official identity badges at monument ticketing counters.',
      'Use prepaid taxi/auto booths operated by the local traffic police at airports and primary railway junctions.',
      'Drink bottled ISI-marked mineral water or use RO water stations.',
      'Keep copies of travel insurance, government ID, and hotel address saved on your mobile device.',
    ];

    return {
      city: cityLower === 'general' ? 'India (National)' : city,
      national_helplines: nationalHelplines,
      local_facilities: matchedFacilities.slice(0, 4),
      safety_advisories: safetyAdvisories,
    };
  }
}

export const emergencyService = new EmergencyService();
