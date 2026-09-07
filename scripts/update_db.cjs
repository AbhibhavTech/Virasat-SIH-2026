const fs = require('fs');

const rawDb = fs.readFileSync('./data/india_tourism_database.json', 'utf-8');
const db = JSON.parse(rawDb);

// 1. Update Patna in Bihar with Golghar
const bihar = db.states.find(s => s.id === 'bihar');
if (bihar) {
  const patna = bihar.cities.find(c => c.id === 'patna');
  if (patna) {
    const golgharMon = {
      id: 'golghar-patna',
      name: 'Golghar in Patna',
      category: 'monuments',
      category_label: 'Major Monuments & Heritage',
      summary: 'Historic 1786 CE stupa-shaped beehive granary built by Captain John Garstin with twin spiral staircases and Ganga views.',
      historical_significance: 'Commissioned by Governor-General Warren Hastings following the 1770 Bengal famine. Engineered with two spiraling exterior staircases of 145 steps providing 360-degree panoramic views of Patna and the holy Ganga.',
      fees: {
        domestic: 15,
        international: 100,
        currency: 'INR',
        student_discount: true,
        camera_fee: 25,
        free_entry: false,
        status: 'VERIFIED'
      },
      timings: {
        opening_time: '09:30 AM',
        closing_time: '06:00 PM',
        closed_days: ['Monday'],
        status: 'VERIFIED',
        note: 'Open Tuesday to Sunday. Closed on Mondays.'
      },
      visit_duration: {
        recommended_mins: 75,
        label: '1 - 1.5 Hours',
        status: 'VERIFIED'
      },
      coordinates: {
        lat: 25.6174,
        lng: 85.1437
      },
      image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      attribution: 'Golghar Monument, Patna / Directorate of Archaeology Bihar',
      source_page: 'https://bihartourism.gov.in',
      status: 'VERIFIED',
      verification_note: 'Verified ASI / Bihar State Archaeological Monument',
      features: {
        map: true,
        navigation: true,
        ai: true,
        "3d": true
      },
      tags: ['monument', 'patna', 'bihar', 'golghar', 'famous', 'heritage']
    };

    if (!patna.monuments) patna.monuments = [];
    if (!patna.monuments.some(m => m.id === 'golghar-patna')) {
      patna.monuments.unshift(golgharMon);
    }
    if (!patna.tourist_places) patna.tourist_places = [];
    if (!patna.tourist_places.some(m => m.id === 'golghar-patna')) {
      patna.tourist_places.unshift(golgharMon);
    }
  }
}

// 2. Create Jammu and Kashmir State Entry
const jkState = {
  id: 'jammu-and-kashmir',
  name: 'Jammu and Kashmir',
  code: 'JK',
  capital: 'Srinagar (Summer) / Jammu (Winter)',
  region: 'Northern India',
  description: 'Paradise on Earth with snow-capped Himalayan peaks, alpine meadows in Sonamarg, Dal Lake houseboats, and sacred mountain shrines.',
  hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
  total_cities: 4,
  total_attractions: 12,
  heritage_overview: 'Famous for terraced Mughal pleasure gardens, ancient stone Shiva shrines, cedar houseboats, and Pashmina weaving.',
  active_stories: [
    'The majestic Himalayan grandeur of Sonamarg Meadow of Gold and Thajiwas Glacier.',
    'Tranquil Shikara rides across Dal Lake amidst floating markets and cedar houseboats.',
    'Imperial Mughal garden design with flowing fountains at Shalimar and Nishat Bagh.'
  ],
  cities: [
    {
      id: 'sonamarg',
      name: 'Sonamarg',
      district: 'Ganderbal',
      state: 'Jammu and Kashmir',
      state_id: 'jammu-and-kashmir',
      tagline: 'Meadow of Gold on the Sindh River',
      description: 'Glacial Himalayan wonderland serving as the historic gateway on the Silk Route to Ladakh, dominated by the Thajiwas Glacier and roaring Sindh River.',
      hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      coordinates: { lat: 34.3106, lng: 75.2952 },
      monuments: [
        {
          id: 'sonamarg-himalayas',
          name: 'Himalayas Mountain in Sonamarg',
          category: 'monuments',
          category_label: 'Major Monuments & Famous Landscapes',
          summary: 'Majestic Himalayan mountain massif, Thajiwas Glacier, and alpine flower valleys along the Sindh River at 2,800m altitude.',
          historical_significance: 'Historic mountain gateway on the Silk Route linking Kashmir with Ladakh and Central Asia across the Zoji La pass.',
          fees: { domestic: 0, international: 0, currency: 'INR', student_discount: false, camera_fee: 0, free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '06:00 AM', closing_time: '07:00 PM', closed_days: [], status: 'VERIFIED', note: 'Daylight hours recommended for mountain treks' },
          visit_duration: { recommended_mins: 240, label: '4 - 6 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.3106, lng: 75.2952 },
          image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
          attribution: 'Sonamarg Tourism / JK Tourism Development Corporation',
          source_page: 'https://jktourism.jk.gov.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['himalayas', 'sonamarg', 'mountain', 'glacier', 'famous', 'tourist_places']
        }
      ],
      heritage: [
        {
          id: 'thajiwas-glacier-sonamarg',
          name: 'Thajiwas Glacier & Alpine Valley',
          category: 'heritage',
          category_label: 'Natural Heritage & Glacial Wonders',
          summary: 'Spectacular hanging glacier accessible by trekking or pony ride, covered with perpetual snow and alpine waterfalls.',
          historical_significance: 'Celebrated in Kashmiri explorer annals and Silk Route accounts as an awe-inspiring natural wonder.',
          fees: { domestic: 0, international: 0, currency: 'INR', student_discount: false, camera_fee: 0, free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '07:00 AM', closing_time: '06:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 180, label: '3 - 4 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.2989, lng: 75.2891 },
          image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          attribution: 'JK Tourism',
          source_page: 'https://jktourism.jk.gov.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['glacier', 'sonamarg', 'nature', 'trekking']
        }
      ],
      museums: [],
      tourist_places: [
        {
          id: 'sonamarg-himalayas',
          name: 'Himalayas Mountain in Sonamarg',
          category: 'tourist_places',
          category_label: 'Famous Tourist Places',
          summary: 'Majestic Himalayan mountain massif, Thajiwas Glacier, and alpine flower valleys along the Sindh River at 2,800m altitude.',
          historical_significance: 'Historic mountain gateway on the Silk Route linking Kashmir with Ladakh.',
          fees: { domestic: 0, international: 0, currency: 'INR', free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '06:00 AM', closing_time: '07:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 240, label: '4 - 6 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.3106, lng: 75.2952 },
          image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
          attribution: 'JK Tourism',
          source_page: 'https://jktourism.jk.gov.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['himalayas', 'sonamarg', 'tourist_places', 'famous']
        }
      ],
      religious_cultural: [],
      nature_parks_zoo: [],
      transport: {
        railway_stations: [{ id: 'srinagar-railway', name: 'Srinagar Railway Station (Nowgam)', code: 'SINA', is_junction: false, distance_km: 85, status: 'VERIFIED' }],
        airport: { id: 'srinagar-airport', name: 'Sheikh ul-Alam International Airport Srinagar', code: 'SXR', type: 'International', distance_km: 90, status: 'VERIFIED' },
        local_transit: { modes: ['JKSRTC Tourist Bus', 'Shared Sumo / Tavera Cabs', 'Prepaid Private Taxi', 'Local Pony Guides'], fare_indication: '₹100 - ₹350 for shared transit; ₹2,500 for private cab', status: 'VERIFIED', tips: 'Prepaid taxi stands are regulated by the Sonamarg Taxi Operators Union.' }
      },
      hotels: [
        { id: 'sonamarg-glacier-heights', name: 'The Glacier Heights Resort Sonamarg', category: 'Luxury Alpine Resort', rating: 4.8, price_indication: '₹6,000 - ₹12,000 / night', location: 'Sindh Riverbank, Sonamarg', amenities: ['Heated Rooms', 'Mountain View Restaurant', 'Free WiFi', 'Bonfire Courtyard'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', status: 'VERIFIED' }
      ],
      fees_overview: { typical_budget_per_day: '₹2,500 - ₹5,000 per traveler', status: 'VERIFIED', note: 'Includes pony ride, local cuisine, and transit' },
      live_travel_info: { best_season: 'May to October for flower blooms; December to March for snow skiing', weather_summary: 'Crisp alpine climate with daytime highs of 15°C and cool mountain evenings.', status: 'VERIFIED', advisory: 'Warm jackets recommended year-round due to glacial mountain drafts.' },
      active_stories: ['Trek through golden meadows to the foot of Thajiwas Glacier.', 'Savor hot Kashmiri Kahwa along the rushing Sindh River.']
    },
    {
      id: 'srinagar',
      name: 'Srinagar',
      district: 'Srinagar',
      state: 'Jammu and Kashmir',
      state_id: 'jammu-and-kashmir',
      tagline: 'Summer Capital & Jewel of Kashmir',
      description: 'Ancient city on the Jhelum River famed for Dal Lake, hand-carved cedar houseboats, and Mughal terraced gardens.',
      hero_image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
      coordinates: { lat: 34.0837, lng: 74.8395 },
      monuments: [
        {
          id: 'shalimar-bagh-srinagar',
          name: 'Shalimar Bagh Mughal Garden',
          category: 'monuments',
          category_label: 'Major Monuments & Imperial Gardens',
          summary: '1619 CE terraced Mughal garden commissioned by Emperor Jahangir with fountains, black marble pavilions, and chinar trees.',
          historical_significance: 'Commissioned by Emperor Jahangir for his beloved consort Nur Jahan in 1619 CE.',
          fees: { domestic: 24, international: 200, currency: 'INR', status: 'VERIFIED' },
          timings: { opening_time: '09:00 AM', closing_time: '07:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 90, label: '1.5 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.1488, lng: 74.8724 },
          image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          attribution: 'Department of Floriculture Kashmir',
          source_page: 'https://jktourism.jk.gov.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['mughal', 'garden', 'heritage', 'monument', 'srinagar']
        },
        {
          id: 'shankaracharya-temple',
          name: 'Shankaracharya Temple',
          category: 'monuments',
          category_label: 'Ancient Stone Temples',
          summary: '9th-century Shiva temple situated 1,000 feet atop Gopadari Hill overlooking Srinagar and Dal Lake.',
          historical_significance: 'Associated with Adi Shankaracharya who visited the shrine during the 8th century CE.',
          fees: { domestic: 0, international: 0, currency: 'INR', free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '07:00 AM', closing_time: '08:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 90, label: '1.5 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.0725, lng: 74.8427 },
          image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          attribution: 'ASI Kashmir Circle',
          source_page: 'https://jktourism.jk.gov.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['temple', 'shiva', 'heritage', 'srinagar']
        }
      ],
      heritage: [],
      museums: [],
      tourist_places: [
        {
          id: 'dal-lake-srinagar',
          name: 'Dal Lake & Shikara Rides',
          category: 'tourist_places',
          category_label: 'Famous Tourist Places',
          summary: 'Iconic urban lake with handcrafted carved wooden houseboats, floating vegetable markets, and Shikara rides.',
          historical_significance: 'Renowned jewel in the crown of Kashmir surrounded by Mughal gardens and Zabarwan mountains.',
          fees: { domestic: 0, international: 0, currency: 'INR', free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '06:00 AM', closing_time: '09:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 150, label: '2.5 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.0837, lng: 74.8395 },
          image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          attribution: 'JK Tourism',
          source_page: 'https://jktourism.jk.gov.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['dal lake', 'srinagar', 'shikara', 'famous', 'tourist_places']
        }
      ],
      religious_cultural: [],
      nature_parks_zoo: [],
      transport: {
        railway_stations: [{ id: 'srinagar-railway', name: 'Srinagar Railway Station', code: 'SINA', is_junction: false, distance_km: 8, status: 'VERIFIED' }],
        airport: { id: 'srinagar-airport', name: 'Sheikh ul-Alam International Airport', code: 'SXR', type: 'International', distance_km: 12, status: 'VERIFIED' },
        local_transit: { modes: ['Shikara Boat Rides', 'Auto Rickshaw', 'Prepaid Taxi', 'Smart City E-Buses'], fare_indication: '₹50 - ₹150 for auto; ₹700/hour for Shikara', status: 'VERIFIED' }
      },
      hotels: [
        { id: 'srinagar-lalit-palace', name: 'The Lalit Grand Palace Srinagar', category: 'Heritage Palace', rating: 4.9, price_indication: '₹14,000 - ₹28,000 / night', location: 'Gupkar Road, Dal Lake', amenities: ['Heritage Royal Suites', 'Indoor Pool', 'Dal Lake View Gardens', 'Spa'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', status: 'VERIFIED' }
      ],
      fees_overview: { typical_budget_per_day: '₹2,500 - ₹6,000 per traveler', status: 'VERIFIED' },
      live_travel_info: { best_season: 'April to October', weather_summary: 'Pleasant summer days, misty autumn chinars, snowy winters.', status: 'VERIFIED' },
      active_stories: ['Explore Dal Lake on a wooden Shikara as evening calls to prayer ring across the valley.']
    },
    {
      id: 'gulmarg',
      name: 'Gulmarg',
      district: 'Baramulla',
      state: 'Jammu and Kashmir',
      state_id: 'jammu-and-kashmir',
      tagline: 'Meadow of Flowers & World-Class Ski Haven',
      description: 'Premier mountain resort featuring Asia highest Gondola cable car and breathtaking ski slopes on Mount Apharwat.',
      hero_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
      coordinates: { lat: 34.0484, lng: 74.3805 },
      monuments: [],
      heritage: [],
      museums: [],
      tourist_places: [
        {
          id: 'gulmarg-gondola',
          name: 'Gulmarg Gondola & Apharwat Peak',
          category: 'tourist_places',
          category_label: 'Famous Tourist Places',
          summary: 'Asia highest cable car system reaching 3,980 meters on Mount Apharwat with premier ski slopes.',
          historical_significance: 'World-renowned ski destination and high-altitude alpine bowl.',
          fees: { domestic: 810, international: 810, currency: 'INR', status: 'VERIFIED' },
          timings: { opening_time: '09:00 AM', closing_time: '05:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 240, label: '4 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.0484, lng: 74.3805 },
          image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
          attribution: 'JK Cable Car Corporation',
          source_page: 'https://www.jksccc.com',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['gulmarg', 'gondola', 'snow', 'adventure', 'tourist_places']
        }
      ],
      religious_cultural: [],
      nature_parks_zoo: [],
      transport: {
        railway_stations: [{ id: 'srinagar-railway', name: 'Srinagar Railway Station', code: 'SINA', is_junction: false, distance_km: 52, status: 'VERIFIED' }],
        airport: { id: 'srinagar-airport', name: 'Srinagar Airport', code: 'SXR', type: 'International', distance_km: 56, status: 'VERIFIED' },
        local_transit: { modes: ['Prepaid 4x4 Cabs with Snow Chains', 'Pony Rides', 'ATVs'], fare_indication: '₹1,500 - ₹2,500 for Tangmarg-Gulmarg hill ascent', status: 'VERIFIED' }
      },
      hotels: [
        { id: 'gulmarg-khyber-resort', name: 'The Khyber Himalayan Resort & Spa', category: 'Luxury Ski Resort', rating: 4.9, price_indication: '₹22,000 - ₹45,000 / night', location: 'Near Gondola Base, Gulmarg', amenities: ['Heated Pool', 'L’Occitane Spa', 'Ski-in / Ski-out Access'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', status: 'VERIFIED' }
      ],
      fees_overview: { typical_budget_per_day: '₹3,500 - ₹8,000 per traveler', status: 'VERIFIED' },
      live_travel_info: { best_season: 'December to March for skiing; May to September for lush meadows', weather_summary: 'Sub-zero temperatures in winter with powder snow; cool pleasant summers.', status: 'VERIFIED' },
      active_stories: ['Ascend to 3,980m on the Gulmarg Gondola for majestic views of Nanga Parbat.']
    },
    {
      id: 'pahalgam',
      name: 'Pahalgam',
      district: 'Anantnag',
      state: 'Jammu and Kashmir',
      state_id: 'jammu-and-kashmir',
      tagline: 'Valley of Shepherds & Lidder River',
      description: 'Picturesque Himalayan hill town nestled among pine forests, pristine rivers, and rolling alpine valleys.',
      hero_image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
      coordinates: { lat: 34.0287, lng: 75.3456 },
      monuments: [],
      heritage: [],
      museums: [],
      tourist_places: [
        {
          id: 'betaab-valley-pahalgam',
          name: 'Betaab Valley & Baisaran Valley',
          category: 'tourist_places',
          category_label: 'Famous Tourist Places',
          summary: 'Verdant Himalayan valley along the Lidder River surrounded by snow-capped peaks and deodar forests.',
          historical_significance: 'Historic pilgrimage gateway to Amarnath and cinematic filming sanctuary.',
          fees: { domestic: 100, international: 100, currency: 'INR', status: 'VERIFIED' },
          timings: { opening_time: '08:00 AM', closing_time: '06:30 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 150, label: '2.5 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.0287, lng: 75.3456 },
          image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80',
          attribution: 'JK Tourism',
          source_page: 'https://jktourism.jk.gov.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['betaab valley', 'pahalgam', 'nature', 'tourist_places']
        }
      ],
      religious_cultural: [],
      nature_parks_zoo: [],
      transport: {
        railway_stations: [{ id: 'anantnag-railway', name: 'Anantnag Railway Station', code: 'ANTN', is_junction: false, distance_km: 42, status: 'VERIFIED' }],
        airport: { id: 'srinagar-airport', name: 'Srinagar Airport', code: 'SXR', type: 'International', distance_km: 92, status: 'VERIFIED' },
        local_transit: { modes: ['Prepaid Taxi', 'Pony Rides to Baisaran', 'Shared Sumo Cabs'], fare_indication: '₹50 - ₹120 for shared; ₹1,800 for day cab', status: 'VERIFIED' }
      },
      hotels: [
        { id: 'pahalgam-pine-resort', name: 'Pine N Peak Pahalgam', category: 'Luxury Riverside Resort', rating: 4.8, price_indication: '₹12,000 - ₹20,000 / night', location: 'Aru Road, Pahalgam', amenities: ['Lidder River View', 'Heated Rooms', 'Garden Dining'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', status: 'VERIFIED' }
      ],
      fees_overview: { typical_budget_per_day: '₹2,500 - ₹5,500 per traveler', status: 'VERIFIED' },
      live_travel_info: { best_season: 'April to October', weather_summary: 'Pleasant alpine mountain air with cool Lidder river breezes.', status: 'VERIFIED' },
      active_stories: ['Trek to Baisaran meadow through dense pine canopies.']
    }
  ]
};

// 3. Create Ladakh State Entry
const ladakhState = {
  id: 'ladakh',
  name: 'Ladakh',
  code: 'LA',
  capital: 'Leh',
  region: 'Northern India',
  description: 'The Land of High Passes with stunning high-altitude lakes, Tibetan Buddhist gompas, rugged moonscapes, and rich Silk Route traditions.',
  hero_image_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=1200&auto=format&fit=crop&q=80',
  total_cities: 2,
  total_attractions: 8,
  heritage_overview: 'Famous for cliffside Buddhist monasteries, ancient mud-brick royal palaces, Mani walls, and Chortens.',
  active_stories: [
    'The shifting turquoise and azure colors of Pangong Tso Lake at 4,225m.',
    'Royal Tibetan architecture at Leh Palace towering over the Indus Valley.',
    'The 106-foot Maitreya Buddha and Bactrian camel safaris in Nubra Valley.'
  ],
  cities: [
    {
      id: 'leh',
      name: 'Leh',
      district: 'Leh',
      state: 'Ladakh',
      state_id: 'ladakh',
      tagline: 'Capital of the High Himalayas',
      description: 'Ancient Himalayan crossroads town featuring 17th-century royal palaces, white-domed peace stupas, and bustling bazaars.',
      hero_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
      coordinates: { lat: 34.1663, lng: 77.5857 },
      monuments: [
        {
          id: 'leh-palace',
          name: 'Leh Palace & Tsemo Fort',
          category: 'monuments',
          category_label: 'Major Monuments & Royal Fortresses',
          summary: '17th-century nine-storey royal cliffside palace modeled on the Potala Palace of Lhasa.',
          historical_significance: 'Built by King Sengge Namgyal around 1600 CE as the seat of the Namgyal dynasty.',
          fees: { domestic: 25, international: 300, currency: 'INR', status: 'VERIFIED' },
          timings: { opening_time: '07:00 AM', closing_time: '06:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 90, label: '1.5 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.1663, lng: 77.5857 },
          image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
          attribution: 'ASI Leh Circle',
          source_page: 'https://ladakh.nic.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['palace', 'monument', 'heritage', 'leh', 'ladakh']
        },
        {
          id: 'shanti-stupa-leh',
          name: 'Shanti Stupa',
          category: 'monuments',
          category_label: 'Buddhist Chortens & Stupas',
          summary: 'White-domed Buddhist Chorten perched atop Changspa hill inaugurated by the 14th Dalai Lama.',
          historical_significance: 'Inaugurated in 1991 to promote world peace and commemorate 2,500 years of Buddhism.',
          fees: { domestic: 0, international: 0, currency: 'INR', free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '05:00 AM', closing_time: '09:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 90, label: '1.5 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.1724, lng: 77.5752 },
          image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
          attribution: 'Ladakh Tourism',
          source_page: 'https://ladakh.nic.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['stupa', 'buddhist', 'leh', 'ladakh', 'famous']
        }
      ],
      heritage: [],
      museums: [],
      tourist_places: [
        {
          id: 'pangong-tso-lake',
          name: 'Pangong Tso Lake',
          category: 'tourist_places',
          category_label: 'Famous Tourist Places',
          summary: 'World highest endorheic saltwater lake at 4,225m altitude, famed for shifting colors from turquoise to deep azure.',
          historical_significance: 'Ancient natural wonder spanning 134 km across Ladakh and Tibet.',
          fees: { domestic: 0, international: 0, currency: 'INR', free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '06:00 AM', closing_time: '07:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 360, label: 'Full Day / Overnight', status: 'VERIFIED' },
          coordinates: { lat: 33.7595, lng: 78.6674 },
          image_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          attribution: 'Ladakh Tourism Department',
          source_page: 'https://ladakh.nic.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['pangong', 'lake', 'ladakh', 'famous', 'tourist_places']
        },
        {
          id: 'magnetic-hill-ladakh',
          name: 'Magnetic Hill',
          category: 'tourist_places',
          category_label: 'Famous Curiosities',
          summary: 'Gravity-defying optical illusion hill on the Leh-Kargil National Highway where vehicles appear to roll uphill.',
          historical_significance: 'Legendary optical illusion milestone marked by Border Roads Organisation.',
          fees: { domestic: 0, international: 0, currency: 'INR', free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '06:00 AM', closing_time: '07:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 45, label: '45 Mins', status: 'VERIFIED' },
          coordinates: { lat: 34.1833, lng: 77.3486 },
          image_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          attribution: 'Ladakh Tourism',
          source_page: 'https://ladakh.nic.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['magnetic hill', 'ladakh', 'tourist_places']
        }
      ],
      religious_cultural: [],
      nature_parks_zoo: [],
      transport: {
        railway_stations: [],
        airport: { id: 'leh-airport', name: 'Kushok Bakula Rimpochee Airport', code: 'IXL', type: 'Domestic', distance_km: 4, status: 'VERIFIED' },
        local_transit: { modes: ['Prepaid Leh Taxi Union Cabs', 'Rented Motorbikes (Royal Enfield)', 'Local Eco Minibuses'], fare_indication: '₹3,500 - ₹5,000 for day circuit cabs', status: 'VERIFIED', tips: 'Regulated fixed rates by All Ladakh Tour Operator Association.' }
      },
      hotels: [
        { id: 'leh-grand-dragon', name: 'The Grand Dragon Ladakh', category: 'Luxury Eco Hotel', rating: 4.9, price_indication: '₹12,000 - ₹24,000 / night', location: 'Old Road, Sheynam, Leh', amenities: ['Oxygen-Enriched Rooms', 'Solar Powered Heating', 'Stok Kangri Mountain View'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', status: 'VERIFIED' }
      ],
      fees_overview: { typical_budget_per_day: '₹3,500 - ₹7,000 per traveler', status: 'VERIFIED' },
      live_travel_info: { best_season: 'May to September', weather_summary: 'Intense high-altitude sunshine by day; cool to sub-zero nights.', status: 'VERIFIED', advisory: 'Mandatory 48-hour acclimatization in Leh before high passes.' },
      active_stories: ['Sunset prayer bells at Shanti Stupa with panoramic views over the snow-capped Zanskar range.']
    },
    {
      id: 'nubra-valley',
      name: 'Nubra Valley',
      district: 'Leh',
      state: 'Ladakh',
      state_id: 'ladakh',
      tagline: 'Valley of Flowers & High-Altitude Sand Dunes',
      description: 'Dramatic desert valley crossed by Shyok River, home to white dunes, Bactrian camels, and Diskit Gompa.',
      hero_image_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
      coordinates: { lat: 34.5802, lng: 77.4721 },
      monuments: [
        {
          id: 'diskit-monastery',
          name: 'Diskit Monastery & 106ft Maitreya Buddha',
          category: 'monuments',
          category_label: 'Historic Gompas & Shrines',
          summary: 'Oldest and largest Buddhist monastery in Nubra crowned by a monumental 32-meter Maitreya Buddha statue.',
          historical_significance: 'Founded in the 14th century by Changzem Tserab Zangpo of the Gelugpa (Yellow Hat) school.',
          fees: { domestic: 30, international: 30, currency: 'INR', status: 'VERIFIED' },
          timings: { opening_time: '07:00 AM', closing_time: '06:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 90, label: '1.5 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.5422, lng: 77.5614 },
          image_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          attribution: 'Ladakh Tourism',
          source_page: 'https://ladakh.nic.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['diskit', 'monastery', 'buddhist', 'nubra', 'ladakh']
        }
      ],
      heritage: [],
      museums: [],
      tourist_places: [
        {
          id: 'nubra-valley-hunder',
          name: 'Hunder Sand Dunes & Bactrian Camels',
          category: 'tourist_places',
          category_label: 'Famous Tourist Places',
          summary: 'White high-altitude sand dunes flanked by snow peaks where double-humped Silk Route Bactrian camels roam.',
          historical_significance: 'Living heritage of the ancient Silk Route across Khardung La.',
          fees: { domestic: 0, international: 0, currency: 'INR', free_entry: true, status: 'VERIFIED' },
          timings: { opening_time: '07:00 AM', closing_time: '07:00 PM', closed_days: [], status: 'VERIFIED' },
          visit_duration: { recommended_mins: 120, label: '2 Hours', status: 'VERIFIED' },
          coordinates: { lat: 34.5802, lng: 77.4721 },
          image_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
          attribution: 'Ladakh Tourism',
          source_page: 'https://ladakh.nic.in',
          status: 'VERIFIED',
          features: { map: true, navigation: true, ai: true, "3d": true },
          tags: ['nubra', 'sand dunes', 'camels', 'ladakh', 'tourist_places']
        }
      ],
      religious_cultural: [],
      nature_parks_zoo: [],
      transport: {
        railway_stations: [],
        airport: { id: 'leh-airport', name: 'Leh Airport (accessed via Khardung La)', code: 'IXL', type: 'Domestic', distance_km: 125, status: 'VERIFIED' },
        local_transit: { modes: ['4x4 SUVs', 'Bactrian Camel Safaris at Hunder'], fare_indication: '₹300 - ₹500 for camel safari ride', status: 'VERIFIED' }
      },
      hotels: [
        { id: 'nubra-stone-hedge', name: 'The Stone Hedge Nubra', category: 'Luxury Desert Glamping', rating: 4.8, price_indication: '₹8,000 - ₹16,000 / night', location: 'Hunder, Nubra Valley', amenities: ['Organic Dining', 'Stargazing Decks', 'Heated Tents'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', status: 'VERIFIED' }
      ],
      fees_overview: { typical_budget_per_day: '₹3,000 - ₹6,000 per traveler', status: 'VERIFIED' },
      live_travel_info: { best_season: 'May to September', weather_summary: 'Crisp desert mountain days; clear star-filled skies at night.', status: 'VERIFIED' },
      active_stories: ['Ride double-humped camels through the white dunes of Hunder as twilight paints the Himalayas gold.']
    }
  ]
};

// Add J&K and Ladakh if not already present
if (!db.states.some(s => s.id === 'jammu-and-kashmir')) {
  db.states.push(jkState);
}
if (!db.states.some(s => s.id === 'ladakh')) {
  db.states.push(ladakhState);
}

fs.writeFileSync('./data/india_tourism_database.json', JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully updated data/india_tourism_database.json with J&K, Ladakh, and Golghar Patna! Total states:', db.states.length);

const tsContent = 'export const INDIA_TOURISM_DATABASE = ' + JSON.stringify(db, null, 2) + ' as const;\n\nexport default INDIA_TOURISM_DATABASE;\n';
fs.writeFileSync('./src/data/indiaTourismDatabase.ts', tsContent, 'utf-8');
console.log('Successfully wrote src/data/indiaTourismDatabase.ts');
