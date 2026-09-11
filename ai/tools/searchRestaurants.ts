import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'searchRestaurants',
  description: 'Search authentic culinary heritage, iconic food streets, regional cuisine specialties, and traditional dining spots across India. Filter by city or cuisine style (Mughlai, Awadhi, South Indian, Bengali, Rajasthani, Street Food).',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: {
        type: 'STRING',
        description: 'City to search culinary options in (e.g. "Agra", "Delhi", "Mumbai", "Varanasi", "Kolkata", "Jaipur", "Hyderabad").',
      },
      cuisine: {
        type: 'STRING',
        description: 'Cuisine style or specialty (e.g. "street food", "thali", "sweets", "biryani", "chaat", "seafood").',
      },
      limit: {
        type: 'NUMBER',
        description: 'Maximum recommendations to return (default 4).',
      },
    },
  },
};

let cachedCulture: any[] | null = null;
function getCultureData() {
  if (!cachedCulture) {
    const cPath = path.join(process.cwd(), 'data', 'culture.json');
    if (fs.existsSync(cPath)) {
      try {
        cachedCulture = JSON.parse(fs.readFileSync(cPath, 'utf8'));
      } catch {
        cachedCulture = [];
      }
    } else {
      cachedCulture = [];
    }
  }
  return cachedCulture;
}

export async function execute(args: {
  city?: string;
  cuisine?: string;
  limit?: number;
}): Promise<any> {
  const cityFilter = (args.city || '').trim().toLowerCase();
  const cuisineFilter = (args.cuisine || '').trim().toLowerCase();
  const limit = Math.min(Math.max(args.limit || 4, 1), 10);

  const culture = getCultureData() || [];
  const results: any[] = [];

  for (const item of culture) {
    const isFood = (item.category || '').toLowerCase().includes('food') ||
                   (item.category || '').toLowerCase().includes('culinary') ||
                   (item.tags || []).some((t: string) => t.toLowerCase().includes('food') || t.toLowerCase().includes('cuisine'));
    if (!isFood) continue;

    if (cityFilter && !item.city.toLowerCase().includes(cityFilter)) continue;
    if (cuisineFilter) {
      const match = item.name.toLowerCase().includes(cuisineFilter) ||
                    item.description.toLowerCase().includes(cuisineFilter) ||
                    (item.tags || []).some((t: string) => t.toLowerCase().includes(cuisineFilter));
      if (!match) continue;
    }

    results.push({
      id: item.id,
      name: item.name,
      city: item.city,
      state: item.state,
      description: item.description,
      cultural_significance: item.cultural_significance,
      popular_locations: item.best_locations || ['Local heritage lanes and market streets'],
      specialty_tags: item.tags || ['Authentic Heritage Dining'],
      average_price_per_person: '₹200 - ₹800',
    });

    if (results.length >= limit) break;
  }

  // Fallback defaults for popular cities if no culture item matches
  if (results.length === 0 && cityFilter) {
    const defaultCityFoods: Record<string, any[]> = {
      jaipur: [
        { name: 'LMB (Laxmi Misthan Bhandar)', area: 'Johari Bazaar', specialty: 'Dal Baati Churma, Ghewar', type: 'Heritage Vegetarian Restaurant' },
        { name: 'Rawat Mishthan Bhandar', area: 'Station Road', specialty: 'Pyaaz Kachori, Mawa Kachori', type: 'Iconic Breakfast & Sweets' },
      ],
      mumbai: [
        { name: 'Britannia & Co. Restaurant', area: 'Ballard Estate, Fort', specialty: 'Berry Pulao, Sali Boti, Caramel Custard', type: 'Parsi Heritage Cafe' },
        { name: 'Gajalee & Trishna', area: 'Fort / Vile Parle', specialty: 'Butter Garlic Crab, Coastal Malvani Fish Curry', type: 'Coastal Seafood Institution' },
      ],
      varanasi: [
        { name: 'Kashi Chaat Bhandar', area: 'Godowlia Chowk', specialty: 'Tamatar Chaat, Palak Chaat', type: 'Iconic Ghatside Chaat' },
        { name: 'Blue Lassi Shop', area: 'Bangali Tola', specialty: 'Hand-churned seasonal fruit Malai Lassi', type: 'Heritage Drink Stall' },
      ],
      delhi: [
        { name: 'Karim Hotel', area: 'Gali Kababian, Jama Masjid', specialty: 'Mutton Burra, Nihari, Rogan Josh', type: 'Mughal Culinary Institution (est. 1913)' },
        { name: 'Paranthe Wali Gali', area: 'Chandni Chowk', specialty: 'Stuffed fried paranthas with pumpkin dip', type: 'Historic Food Lane' },
      ],
    };

    const foundDefaults = defaultCityFoods[cityFilter] || [];
    for (const d of foundDefaults) {
      results.push({
        id: `food-${cityFilter}-${results.length + 1}`,
        name: d.name,
        city: args.city,
        description: `Renowned culinary stop in ${d.area} celebrated for authentic ${d.specialty}.`,
        popular_locations: [d.area],
        specialty_tags: [d.specialty, d.type],
        average_price_per_person: '₹250 - ₹650',
      });
    }
  }

  return {
    total_found: results.length,
    recommendations: results,
  };
}
