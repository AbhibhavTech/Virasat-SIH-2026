import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'searchMarkets',
  description: 'Discover traditional craft markets, GI-tagged artisan studios, historic bazaars, and shopping enclaves across Indian cities.',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: {
        type: 'STRING',
        description: 'City to explore markets in (e.g. "Jaipur", "Varanasi", "Agra", "Kolkata", "Delhi", "Srinagar").',
      },
      craft_type: {
        type: 'STRING',
        description: 'Type of craft or product (e.g. "silk", "pottery", "spices", "jewelry", "leather", "marble inlay", "carpet").',
      },
    },
  },
};

let cachedArtisans: any[] | null = null;
function getArtisansData() {
  if (!cachedArtisans) {
    const p = path.join(process.cwd(), 'data', 'artisans.json');
    if (fs.existsSync(p)) {
      try {
        cachedArtisans = JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch {
        cachedArtisans = [];
      }
    } else {
      cachedArtisans = [];
    }
  }
  return cachedArtisans;
}

export async function execute(args: { city?: string; craft_type?: string }): Promise<any> {
  const cityFilter = (args.city || '').trim().toLowerCase();
  const craftFilter = (args.craft_type || '').trim().toLowerCase();

  const artisans = getArtisansData() || [];
  const results: any[] = [];

  for (const art of artisans) {
    if (cityFilter && !art.city.toLowerCase().includes(cityFilter)) continue;
    if (craftFilter) {
      const match = art.craft_tradition.toLowerCase().includes(craftFilter) ||
                    (art.products || []).some((p: string) => p.toLowerCase().includes(craftFilter));
      if (!match) continue;
    }

    results.push({
      id: art.id,
      name: art.artisan_name,
      craft: art.craft_tradition,
      gi_tagged: art.gi_tag_status,
      city: art.city,
      location: art.workshop_location,
      visiting_allowed: art.visiting_allowed,
      live_demo: art.demonstration_available,
      typical_products: art.products,
      price_range: art.price_range,
      story: art.story,
    });
  }

  // Famous bazaars if city matched
  const famousBazaars: Record<string, any[]> = {
    jaipur: [
      { name: 'Johari Bazaar', specialty: 'Kundan jewelry, precious gems, silver trinkets', timing: '10:30 AM - 8:30 PM' },
      { name: 'Bapu Bazaar', specialty: 'Mojaris (camel leather footwear), bandhani textiles, block prints', timing: '11:00 AM - 9:00 PM' },
    ],
    delhi: [
      { name: 'Khari Baoli', specialty: "Asia's largest spice market with saffron, dry fruits, and heritage aromatics", timing: '10:00 AM - 7:30 PM (Closed Sundays)' },
      { name: 'Dilli Haat INA', specialty: 'State tourism handicraft pavilions with rotational rural artisans', timing: '10:30 AM - 10:00 PM' },
    ],
    varanasi: [
      { name: 'Godowlia Market & Chowk', specialty: 'Pure Banarasi silk brocades, brass religious idols, gulabi meenakari', timing: '11:00 AM - 9:30 PM' },
    ],
    mumbai: [
      { name: 'Colaba Causeway', specialty: 'Eclectic antiques, brassware, curios, Indian cotton apparel', timing: '10:00 AM - 9:30 PM' },
      { name: 'Crawford Market (Mahatma Jyotirao Phule Market)', specialty: 'Heritage Victorian market for dry fruits, pets, home decor', timing: '10:00 AM - 8:00 PM' },
    ],
  };

  const extraBazaars = cityFilter ? famousBazaars[cityFilter] || [] : [];

  return {
    city: args.city || 'India',
    artisan_workshops_found: results.length,
    artisan_studios: results,
    prominent_heritage_bazaars: extraBazaars,
    shopping_advice: 'Look for GI (Geographical Indication) certification marks on silks, pashminas, and handicrafts for verified authenticity.',
  };
}
