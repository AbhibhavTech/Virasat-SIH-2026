/**
 * Ambiguity Handler for Indian heritage locations and monuments.
 * Handles duplicate names across different cities (e.g., City Palace, Jama Masjid, Sun Temple).
 */

export interface AmbiguousPlaceEntry {
  queryTerm: string;
  options: Array<{
    name: string;
    city: string;
    state: string;
    isPrimary?: boolean;
    description: string;
  }>;
}

const AMBIGUOUS_PLACES: AmbiguousPlaceEntry[] = [
  {
    queryTerm: 'city palace',
    options: [
      {
        name: 'City Palace, Jaipur',
        city: 'Jaipur',
        state: 'Rajasthan',
        isPrimary: true,
        description: 'Vibrant blend of Rajasthani and Mughal architecture in the heart of Jaipur.',
      },
      {
        name: 'City Palace, Udaipur',
        city: 'Udaipur',
        state: 'Rajasthan',
        description: 'Magnificent palace complex on the banks of Lake Pichola in Udaipur.',
      },
    ],
  },
  {
    queryTerm: 'sun temple',
    options: [
      {
        name: 'Konark Sun Temple',
        city: 'Puri / Konark',
        state: 'Odisha',
        isPrimary: true,
        description: 'UNESCO World Heritage 13th-century chariot temple dedicated to Surya.',
      },
      {
        name: 'Sun Temple, Modhera',
        city: 'Mehsana / Modhera',
        state: 'Gujarat',
        description: '11th-century Solanki dynasty Sun temple with renowned Surya Kund stepped tank.',
      },
      {
        name: 'Sun Temple, Gwalior',
        city: 'Gwalior',
        state: 'Madhya Pradesh',
        description: 'Modern red sandstone temple inspired by the Konark Sun Temple.',
      },
    ],
  },
  {
    queryTerm: 'jama masjid',
    options: [
      {
        name: 'Jama Masjid, Delhi',
        city: 'Delhi',
        state: 'Delhi',
        isPrimary: true,
        description: 'Grand 17th-century Mughal mosque built by Shah Jahan in Old Delhi.',
      },
      {
        name: 'Jama Masjid, Agra',
        city: 'Agra',
        state: 'Uttar Pradesh',
        description: '17th-century mosque built by Shah Jahan in honor of his daughter Jahanara.',
      },
      {
        name: 'Jama Masjid, Fatehpur Sikri',
        city: 'Fatehpur Sikri',
        state: 'Uttar Pradesh',
        description: 'Colossal congregational mosque housing Salim Chishti’s white marble tomb.',
      },
    ],
  },
  {
    queryTerm: 'amber fort',
    options: [
      {
        name: 'Amber (Amer) Fort, Jaipur',
        city: 'Jaipur',
        state: 'Rajasthan',
        isPrimary: true,
        description: 'Historic hilltop fort of Amer famous for Sheesh Mahal and Maota Lake views.',
      },
    ],
  },
];

export function checkLocationAmbiguity(
  searchTerm: string,
  activeCityContext?: string
): { isAmbiguous: boolean; selectedOption?: any; possibleMatches: string[] } {
  if (!searchTerm) return { isAmbiguous: false, possibleMatches: [] };
  const lower = searchTerm.toLowerCase().trim();

  for (const entry of AMBIGUOUS_PLACES) {
    if (lower.includes(entry.queryTerm) || entry.queryTerm.includes(lower)) {
      if (activeCityContext) {
        const cityLower = activeCityContext.toLowerCase();
        const matched = entry.options.find(
          (opt) =>
            opt.city.toLowerCase().includes(cityLower) ||
            cityLower.includes(opt.city.toLowerCase()) ||
            opt.state.toLowerCase().includes(cityLower)
        );
        if (matched) {
          return {
            isAmbiguous: false,
            selectedOption: matched,
            possibleMatches: [matched.name],
          };
        }
      }

      // If no contextual match or query didn't specify the city
      const matchNames = entry.options.map((o) => `${o.name} (${o.city}, ${o.state})`);
      return {
        isAmbiguous: true,
        selectedOption: entry.options.find((o) => o.isPrimary) || entry.options[0],
        possibleMatches: matchNames,
      };
    }
  }

  return { isAmbiguous: false, possibleMatches: [] };
}
