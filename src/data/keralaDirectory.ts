export interface KeralaStay {
  name: string;
  category: string;
}

export interface KeralaFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface KeralaDining {
  veg: KeralaFoodSpot[];
  nonVeg: KeralaFoodSpot[];
  peacefulNote?: string;
}

export interface KeralaAttraction {
  id: string;
  name: string;
  category: string;
  timings: string;
  fee: {
    domestic: string;
    foreign: string;
  };
  isHiddenGem: boolean;
  image: string;
  photoCredit: string;
  summary: string;
}

export interface KeralaCity {
  id: string;
  code: string;
  name: string;
  nickname: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  flashcardBlurb: string;
  coverImage: string;
  photoCredit: string;
  topStays: KeralaStay[];
  dining: KeralaDining;
  attractions: KeralaAttraction[];
}

export const KERALA_DIRECTORY: KeralaCity[] = [
  {
    id: 'kochi',
    code: 'IN-KL-CITY-COK',
    name: 'Kochi / Cochin',
    nickname: 'Queen of the Arabian Sea',
    tagline: 'Colonial spice ports, cantilevered nets & historic Jewish quarter',
    accentColor: '#0F4C3A',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-cyan-50/30',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Fort Kochi',
    flashcardBlurb:
      'The Queen of the Arabian Sea, weaving together Portuguese fort churches, Dutch waterfront palaces, Jewish quarter antique lanes, and Chinese cantilevered fishing nets.',
    topStays: [
      { name: 'Brunton Boatyard', category: 'Luxury Heritage Waterfront' },
      { name: 'Old Harbour Hotel', category: 'Boutique Colonial Haveli' },
      { name: 'Grand Hyatt Kochi Bolgatty', category: 'Modern Waterfront Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Sri Krishna Cafe', location: 'Mattancherry', specialties: 'Crispy Ghee Roast Dosa, Authentic Malabar Filter Coffee' },
        { restaurant: 'Gokul Oottupura', location: 'Kadavanthra', specialties: 'Kerala Traditional Vegetarian Sadhya & Tiffin Delicacies' },
      ],
      nonVeg: [
        { restaurant: 'Grand Pavilion / Grand Hotel', location: 'MG Road', specialties: 'Karimeen Pollichathu (Pearl Spot in Banana Leaf), Malabar Fish Curry' },
        { restaurant: 'Dhe Puttu', location: 'Edappally', specialties: 'Erachi Puttu (Steamed Rice Cylinders with Meat), Slow-cooked Duck Mappas' },
      ],
      peacefulNote: 'Kochi cuisine is celebrated for fragrant coconut milk gravies, fresh coastal spices, and slow claypot simmering.',
    },
    attractions: [
      {
        id: 'IN-KL-COK-ATT-001',
        name: 'Chinese Fishing Nets & Fort Kochi Beach',
        category: 'Heritage / Arts · Historical Sites & Traditional Livelihoods',
        timings: 'Open 24 Hours (Best viewed 06:00–08:30 & 17:00–18:30)',
        fee: { domestic: 'Free (hauling tips expected)', foreign: 'Free (hauling tips expected)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Kochi Harbor',
        summary:
          'Iconic cantilevered shore-operated fishing nets gifted by 14th-century Chinese court traders, silhouetted gracefully against Arabian Sea sunsets.',
      },
      {
        id: 'IN-KL-COK-ATT-002',
        name: 'Mattancherry Palace / Dutch Palace',
        category: 'Heritage · Historical Buildings, Museums & Ramayana Murals',
        timings: '09:45–13:00 & 14:00–16:45 (Closed Fridays)',
        fee: { domestic: 'INR 5', foreign: 'INR 25' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Mattancherry_Palace_Cochin.jpg/1280px-Mattancherry_Palace_Cochin.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '16th-century palace gifted by Portuguese and renovated by the Dutch, celebrated for its world-renowned Ramayana wall tempera murals and Kochi royal regalia.',
      },
      {
        id: 'IN-KL-COK-ATT-003',
        name: 'Paradesi Synagogue & Jew Town',
        category: 'Spiritual / Heritage · Jewish Sanctuary & Antique Quarter',
        timings: '10:00–13:00 & 14:00–17:00 (Closed Fri, Sat & Jewish Holidays)',
        fee: { domestic: 'INR 10', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Paradesi_Synagogue_Kochi.jpg/1280px-Paradesi_Synagogue_Kochi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Built in 1568, this historic synagogue is adorned with hundreds of hand-painted 18th-century Chinese blue-willow porcelain tiles and Belgian chandeliers.',
      },
      {
        id: 'IN-KL-COK-ATT-004',
        name: 'St. Francis Church',
        category: 'Heritage / Spiritual · Christianity (Oldest European Church in India)',
        timings: '07:00–18:00 (Sundays 08:30–18:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/St._Francis_Church%2C_Kochi_01.jpg/1280px-St._Francis_Church%2C_Kochi_01.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Oldest existing European church in India (1503), originally constructed by Portuguese Franciscan friars and the first burial place of explorer Vasco da Gama.',
      },
      {
        id: 'IN-KL-COK-GEM-001',
        name: 'Kumbalangi Integrated Tourism Village',
        category: 'Rural / Nature · Agro-Tourism, Crab Farming & Bioluminescence',
        timings: '08:00–18:00',
        fee: { domestic: 'Free (Canoe tours: INR 500–1,200)', foreign: 'Free (Canoe tours: INR 500–1,200)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Kumbalangi Backwaters',
        summary:
          'India’s first designated model eco-village where travelers experience authentic country boat rides through mangrove creeks, crab farming, and magical nocturnal kavaru (bioluminescence).',
      },
      {
        id: 'IN-KL-COK-GEM-002',
        name: 'Hill Palace Museum, Tripunithura',
        category: 'Heritage · Palaces & Forts, Museums & Archeological Sites',
        timings: '09:30–16:30 (Closed Mondays)',
        fee: { domestic: 'INR 30', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Hill_Palace_Tripunithura.jpg/1280px-Hill_Palace_Tripunithura.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Kerala’s largest archaeological complex spread across 54 terraced acres with 49 buildings, showcasing Kochi Maharaja crowns studded with uncut diamonds, precious gold, and megalithic relics.',
      },
    ],
  },
  {
    id: 'munnar',
    code: 'IN-KL-CITY-MUN',
    name: 'Munnar',
    nickname: 'High-Altitude Tea Haven',
    tagline: 'Emerald tea plantations, mist-veiled ridges & Nilgiri Tahr habitat',
    accentColor: '#107C41',
    bgGradient: 'from-emerald-50 via-green-50/40 to-lime-50/30',
    coverImage: 'https://images.unsplash.com/photo-1588096344356-9b59b1285268?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Munnar Tea Hills',
    flashcardBlurb:
      'High-altitude Western Ghats hill station blanketed in emerald tea estates, mist-shrouded peaks, and the home of the endangered Nilgiri Tahr.',
    topStays: [
      { name: 'SpiceTree Munnar', category: 'Luxury Plantation Wellness' },
      { name: 'Windermere Estate', category: 'Heritage Tea Plantation Retreat' },
      { name: 'Elixir Hills', category: 'Luxury Suites & Spa' },
    ],
    dining: {
      veg: [
        { restaurant: 'Saravana Bhavan', location: 'MG Road', specialties: 'South Indian Meal Thali, Crisp Ghee Masala Dosa' },
        { restaurant: 'Rapsy Restaurant', location: 'Main Bazaar', specialties: 'Kerala Flaky Parotta with aromatic Veg Kurma' },
      ],
      nonVeg: [
        { restaurant: "Guru's Restaurant", location: 'Aluva-Munnar Road', specialties: 'Traditional Kerala Mutton Fry, Spiced Naadan Chicken Curry' },
        { restaurant: "Butler's Creek", location: 'Chithirapuram', specialties: 'Creamy Travancore Fish Molee with Appam' },
      ],
      peacefulNote: 'Warm hill-station comfort cuisine pairs delightfully with freshly steeped single-estate orthodox teas.',
    },
    attractions: [
      {
        id: 'IN-KL-MUN-ATT-001',
        name: 'Eravikulam National Park (Rajamalai)',
        category: 'Nature / Rural · Wildlife-Tourism, Nilgiri Tahr & Shola Peaks',
        timings: '07:30–16:00 (Closed Feb–March annually for calving)',
        fee: { domestic: 'INR 200', foreign: 'INR 500' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Eravikulam',
        summary:
          'UNESCO Western Ghats high-altitude sanctuary housing the world’s largest breeding population of the endangered Nilgiri Tahr against the slopes of Anamudi (2,695m).',
      },
      {
        id: 'IN-KL-MUN-ATT-002',
        name: 'KDHP Tea Museum / Lockhart Tea Factory',
        category: 'Gastronomy / Rural · Farm to Table, Crafts & Industrial Heritage',
        timings: '09:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 125', foreign: 'INR 125' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Tea Processing',
        summary:
          'Fascinating colonial-era industrial museum showcasing the transformation of green hand-plucked two leaves and a bud into world-class orthodox black teas.',
      },
      {
        id: 'IN-KL-MUN-ATT-003',
        name: 'Mattupetty Dam & Echo Point',
        category: 'Nature / Adventure · Rivers & Lakes, Mountain Boating',
        timings: '09:30–17:00',
        fee: { domestic: 'INR 20 (Speedboat: INR 500–700)', foreign: 'INR 20 (Speedboat: INR 500–700)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Mattupetty_Dam_Munnar.jpg/1280px-Mattupetty_Dam_Munnar.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Scenic concrete gravity reservoir surrounded by pine-forested slopes where visitors enjoy speedboating and crisp natural acoustic echo acoustics.',
      },
      {
        id: 'IN-KL-MUN-GEM-001',
        name: 'Kolukkumalai Tea Estate & Peak',
        category: 'Nature / Adventure · Hiking & Trekking (World’s Highest Tea Plantation)',
        timings: '04:30–17:00 (Sunrise jeep safari departs 04:30)',
        fee: { domestic: 'Estate: INR 100 (Jeep hire: INR 2,500–3,000)', foreign: 'Estate: INR 100 (Jeep hire: INR 2,500–3,000)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Kolukkumalai Sunrise',
        summary:
          'Standing at 7,900 ft above sea level, Kolukkumalai is the highest organic tea estate on Earth, renowned for thrilling 4x4 off-road trails and breathtaking sea-of-clouds sunrises.',
      },
      {
        id: 'IN-KL-MUN-GEM-002',
        name: 'Anakulam Wild Elephant Stream',
        category: 'Nature / Rural · Wildlife-Tourism, Natural Saline Stream Gathering',
        timings: '15:00–18:30 (Best viewing late afternoon)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Wild Elephants',
        summary:
          'A tranquil jungle stream where wild elephant herds emerge from dense reserve forests in peaceful family groups to drink mineral-rich natural saline waters.',
      },
    ],
  },
  {
    id: 'alappuzha',
    code: 'IN-KL-CITY-ALP',
    name: 'Alappuzha / Alleppey',
    nickname: 'Venice of the East',
    tagline: 'Quiet backwater lagoons, coir houseboats & sub-sea paddy wetlands',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-teal-50/40 to-blue-50/30',
    coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Alleppey Houseboat',
    flashcardBlurb:
      'The Venetian water-realm of Kerala, renowned for its serpentine canals, paddy fields cultivated below sea level, and overnight kettuvallam houseboats.',
    topStays: [
      { name: 'Kumarakom Lake Resort', category: 'Ultra Luxury Heritage Lakeside' },
      { name: 'Xandari Riverscapes', category: 'Eco Houseboat Fleet' },
      { name: 'Lake Palace Resort', category: 'Lakeside Boutique' },
    ],
    dining: {
      veg: [
        { restaurant: 'Thaff Delicacy', location: 'VCSB Road', specialties: 'Fluffy Lace Appam with Coconut Milk Vegetable Stew, Kerala Sadhya' },
        { restaurant: 'Brothers Hotel', location: 'Near KSRTC Stand', specialties: 'Crispy Uzhunnu Vada, Podi Idli, Traditional Vegetarian Tiffins' },
      ],
      nonVeg: [
        { restaurant: 'Cassia Restaurant', location: 'Beach Road', specialties: 'Spicy Alappuzha Duck Roast, Chemmeen (Prawn) Curry in Roasted Coconut' },
        { restaurant: 'Halais Restaurant', location: 'CCSMB Road', specialties: 'Fragrant Kaima Rice Thalassery Biryani, Tava Fried Pearl Spot' },
      ],
      peacefulNote: 'Slow backwater dining emphasizes hand-pounded spices, fresh garden coconut, and locally harvested red Matta rice.',
    },
    attractions: [
      {
        id: 'IN-KL-ALP-ATT-001',
        name: 'Vembanad Lake Backwater Cruise',
        category: 'Nature · Rivers & Lakes, Sustainable Tourism & Houseboats',
        timings: '06:00–18:00 (Houseboats anchor at dusk by state maritime law)',
        fee: { domestic: 'Shikara: INR 800/hr | Houseboat: INR 7,500–15,000', foreign: 'Shikara: INR 800/hr | Houseboat: INR 7,500–15,000' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Backwater Lagoon',
        summary:
          'Glide along India’s largest freshwater wetland aboard traditional anjili wood kettuvallam houseboats, observing village life, lily pads, and palm-lined banks.',
      },
      {
        id: 'IN-KL-ALP-ATT-002',
        name: 'Alappuzha Beach & 160-Year-Old Pier',
        category: 'Nature / Heritage · Beaches & Coastal Heritage',
        timings: '05:00–21:00 (Lighthouse: 15:00–17:00)',
        fee: { domestic: 'Beach: Free (Lighthouse: INR 20)', foreign: 'Beach: Free (Lighthouse: INR 50)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Alleppey_beach_pier.jpg/1280px-Alleppey_beach_pier.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Broad golden-sand coastline framed by the picturesque skeletal remains of an 1862 sea bridge pier and a 28-meter striped lighthouse overlooking the Arabian Sea.',
      },
      {
        id: 'IN-KL-ALP-GEM-001',
        name: 'Kuttanad Below-Sea-Level Farming',
        category: 'Rural / Gastronomy · Agro-Tourism, UNESCO Heritage Farming System',
        timings: '07:00–17:00',
        fee: { domestic: 'Free (Public SWTD ferry: INR 15–40)', foreign: 'Free (Public SWTD ferry: INR 15–40)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Kuttanad Paddy Fields',
        summary:
          'One of the few places on Earth where agriculture is practiced 1.2 to 3 meters below sea level, protected by bio-bunds and engineered backwater waterwheels.',
      },
      {
        id: 'IN-KL-ALP-GEM-002',
        name: 'Pathiramanal Bird Island',
        category: 'Nature · Rivers & Lakes, Wildlife-Tourism & Mangrove Haven',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Speedboat from Muhamma: INR 500–800)', foreign: 'Free (Speedboat from Muhamma: INR 500–800)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Pathiramanal_Island_Vembanad.jpg/1280px-Pathiramanal_Island_Vembanad.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A tranquil uninhabited sandbank in Vembanad Lake hosting over 90 migratory bird species, including darters, cormorants, and rare night herons.',
      },
    ],
  },
  {
    id: 'wayanad',
    code: 'IN-KL-CITY-WAY',
    name: 'Wayanad',
    nickname: 'Spice Highlands & Neolithic Cradle',
    tagline: 'Ancient petroglyphs, mist-shrouded rainforests & heart-shaped lake',
    accentColor: '#2E7D32',
    bgGradient: 'from-emerald-50 via-stone-50/40 to-teal-50/30',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Wayanad Mist',
    flashcardBlurb:
      'A pristine forested plateau of the Western Ghats holding Neolithic petroglyphs, spice plantations, tribal heritage, and cloud-draped waterfalls.',
    topStays: [
      { name: 'Vythiri Resort', category: 'Luxury Rainforest Treehouse Resort' },
      { name: 'Evolve Back Kuruba Safari Lodge', category: 'Wildlife Sanctuary Border' },
      { name: 'Tranquil Resort', category: 'Plantation Hideaway' },
    ],
    dining: {
      veg: [
        { restaurant: "1980's A Nostalgic Restaurant", location: 'Kalpetta', specialties: 'Authentic 24-dish Traditional Kerala Sadhya served on fresh Plantain Leaf' },
        { restaurant: 'Udupi Pure Vegetarian', location: 'Sulthan Bathery', specialties: 'Ghee Podi Roast Dosa, Authentic Keralite Meals' },
      ],
      nonVeg: [
        { restaurant: 'Wilton Restaurant', location: 'Sultan Bathery', specialties: 'Crispy Malabar Kozhi Porichathu, Aromatic Bamboo Steamed Biryani' },
        { restaurant: 'ClayHut Village Restaurant', location: 'Kalpetta', specialties: 'Sun-dried Village Fish Curry, Earthy Mudpot Country Curries' },
      ],
      peacefulNote: 'Highland spice kitchens combine wild pepper, cardamom, and mountain tapioca into soul-warming tribal and planters recipes.',
    },
    attractions: [
      {
        id: 'IN-KL-WAY-ATT-001',
        name: 'Edakkal Caves',
        category: 'Heritage · Archeological Sites, Neolithic Rock Art',
        timings: '09:00–16:00 (Closed Mondays)',
        fee: { domestic: 'INR 50', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Edakkal_Caves_Rock_Art.jpg/1280px-Edakkal_Caves_Rock_Art.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Natural cleft rock shelter containing Stone Age petroglyphic etchings dating back over 6,000 years, the sole known prehistoric rock art site in South India.',
      },
      {
        id: 'IN-KL-WAY-ATT-002',
        name: 'Banasura Sagar Dam',
        category: 'Nature / Adventure · Rivers & Lakes (India’s Largest Earth Dam)',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 40 (Foreign: INR 80, Boating extra)', foreign: 'INR 80 (Boating extra)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Banasurasagar_dam_wayanad.jpg/1280px-Banasurasagar_dam_wayanad.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Monumental earth and boulder dam impounding emerald waters, forming picturesque forested islands set against the dramatic backdrop of Banasura Peak.',
      },
      {
        id: 'IN-KL-WAY-ATT-003',
        name: 'Chembra Peak & Heart-Shaped Lake',
        category: 'Adventure / Nature · Hiking & Trekking, Hills & Mountains',
        timings: '07:00–14:00 (Trek entry closes 12:00)',
        fee: { domestic: 'Forest Permit INR 1,000 (Group up to 5)', foreign: 'Forest Permit INR 1,000 (Group up to 5)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Chembra_Peak_Heart_Lake.jpg/1280px-Chembra_Peak_Heart_Lake.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Wayanad’s loftiest peak (2,100 m) featuring the misty perennial Hridaya Thadakam lake, naturally carved in the shape of a heart midway to the summit.',
      },
      {
        id: 'IN-KL-WAY-GEM-001',
        name: 'Muthanga & Tholpetty Wildlife Sanctuary Inner Jeep Track',
        category: 'Nature / Rural · Wildlife-Tourism, Nilgiri Biosphere & Tribal Trackers',
        timings: '07:00–10:00 & 15:00–17:00',
        fee: { domestic: 'INR 150 + Jeep Hire', foreign: 'INR 360 + Jeep Hire' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Wildlife Sanctuary',
        summary:
          'Deep rainforest safari corridors guided by indigenous forest wardens, offering high chances of observing Asian elephant herds, leopards, gaur, and hornbills.',
      },
      {
        id: 'IN-KL-WAY-GEM-002',
        name: 'Karlad Lake Adventure Base',
        category: 'Adventure / Nature · Kayaking, Lake Zipline & Bamboo Groves',
        timings: '09:00–17:00',
        fee: { domestic: 'Entry: INR 40 | Zipline: INR 290', foreign: 'Entry: INR 40 | Zipline: INR 290' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Karlad Lake',
        summary:
          'Quiet freshwater lake surrounded by rolling tea plantations, hosting South India’s longest aerial water-crossing zipline, serene kayaking, and archery lawns.',
      },
    ],
  },
  {
    id: 'thiruvananthapuram',
    code: 'IN-KL-CITY-TRV',
    name: 'Thiruvananthapuram / Trivandrum',
    nickname: 'The Royal Capital & Sacred Shore',
    tagline: 'Padmanabhaswamy temple vaults, clifftop beaches & Travancore arts',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-teal-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Sree_Padmanabhaswamy_Temple%2C_Thiruvananthapuram.jpg/1280px-Sree_Padmanabhaswamy_Temple%2C_Thiruvananthapuram.jpg',
    photoCredit: 'Wikimedia Commons / Padmanabhaswamy Temple',
    flashcardBlurb:
      'Kerala’s capital, where the legendary wealth of the Sree Padmanabhaswamy temple stands beside clifftop beaches and Travancore royal academies.',
    topStays: [
      { name: 'The Leela Kovalam', category: 'Luxury Cliff Edge Resort' },
      { name: 'Niraamaya Retreats Surya Samudra', category: 'Clifftop Ayurveda Resort' },
      { name: 'Vivanta Thiruvananthapuram', category: 'City Central Heritage' },
    ],
    dining: {
      veg: [
        { restaurant: 'Mothers Veg Plaza', location: 'Bakery Junction', specialties: 'Celebrated 30+ item Traditional Royal Sadhya served fresh daily' },
        { restaurant: 'Arya Nivas', location: 'Aristo Junction', specialties: 'Authentic South Indian Filter Kaapi, Crispy Ghee Dosas & Thalis' },
      ],
      nonVeg: [
        { restaurant: 'Zam Zam Restaurant', location: 'Palayam', specialties: 'Authentic Malabar Biryani, Slow-roasted Arabian Mutton Mandi' },
        { restaurant: 'Villa Maya', location: 'Enjakkal', specialties: '18th-century Restored Dutch Manor Fine Dining & Travancore Seafood' },
      ],
      peacefulNote: 'Trivandrum blends royal Travancore palace vegetarian banquets with fresh coastal catch from the Arabian sea.',
    },
    attractions: [
      {
        id: 'IN-KL-TRV-ATT-001',
        name: 'Sree Padmanabhaswamy Temple',
        category: 'Spiritual · Hinduism, Dravidian Gopuram & Ancient Vaults',
        timings: '03:30–12:00 & 17:00–19:20 (Strict dhoti/sari dress code)',
        fee: { domestic: 'Free (Special Darshan INR 150–500)', foreign: 'Free (Special Darshan INR 150–500)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Sree_Padmanabhaswamy_Temple%2C_Thiruvananthapuram.jpg/1280px-Sree_Padmanabhaswamy_Temple%2C_Thiruvananthapuram.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Magnificent 16th-century Dravidian gopuram dedicated to Lord Vishnu in Anantha Shayana posture, holding subterranean treasure vaults of immense cultural and spiritual significance.',
      },
      {
        id: 'IN-KL-TRV-ATT-002',
        name: 'Napier Museum & Kanakakkunnu Palace Grounds',
        category: 'Heritage / Arts · Indo-Saracenic Architecture, Bronzes & Royal Gardens',
        timings: '10:00–16:45 (Closed Mondays & Wednesday forenoons)',
        fee: { domestic: 'INR 20', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Napier_Museum_Trivandrum.jpg/1280px-Napier_Museum_Trivandrum.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '19th-century Indo-Saracenic landmark featuring ornamental gothic roofs, natural cooling vents, and an extraordinary collection of ancient bronze idols, ivory carvings, and royal artifacts.',
      },
      {
        id: 'IN-KL-TRV-GEM-001',
        name: 'Varkala Cliff & Papanasam Beach',
        category: 'Nature / Spiritual · Geological Geo-Heritage Cliffs & Holy Waters',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Varkala Cliffs',
        summary:
          'Spectacular red laterite cliffs jutting above the Arabian Sea, featuring clifftop promenades, natural mineral springs, and holy cleansing ocean waters at Papanasam.',
      },
      {
        id: 'IN-KL-TRV-GEM-002',
        name: "Jatayu Earth's Center",
        category: 'Heritage / Adventure · World’s Largest Bird Sculpture & Cable Car',
        timings: '10:00–18:00',
        fee: { domestic: 'INR 450–550 + Cable Car', foreign: 'INR 450–550 + Cable Car' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Jatayu_Earth_Center_Sculpture.jpg/1280px-Jatayu_Earth_Center_Sculpture.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Awe-inspiring 200-ft-long granite sculpture perched atop Chadayamangalam rock honoring Jatayu’s sacrifice from the Ramayana, reached by a scenic aerial ropeway cable car.',
      },
    ],
  },
];
