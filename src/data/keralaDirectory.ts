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
  pilgrimageNotice?: string;
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
    code: 'IN-KL-COK-ULTIMATE',
    name: 'Kochi (Cochin)',
    nickname: 'Queen of the Arabian Sea',
    tagline: 'Colonial spice ports, cantilevered nets & historic Jewish quarter',
    accentColor: '#0F4C3A',
    bgGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-950/70',
    coverImage: '/images/kerala/kochi-chinese-nets.jpg',
    photoCredit: 'User Photo / Cantilevered Chinese Fishing Nets at Fort Kochi',
    flashcardBlurb:
      "Kerala's historic spice-trading port city, blending Chinese fishing nets, Portuguese colonial mansions, Jewish heritage lanes, and scenic backwaters.",
    topStays: [
      { name: 'Brunton Boatyard', category: 'CGH Earth — Waterfront heritage luxury' },
      { name: 'Taj Malabar Resort & Spa', category: 'Willingdon Island — Luxury Waterfront Resort' },
      { name: 'Eighth Bastion', category: 'Fort Kochi — CGH Earth Colonial Boutique' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Dhe Puttu',
          location: 'Edappally',
          specialties: 'Famous for traditional Kerala puttu variations',
        },
        {
          restaurant: 'Anand Bhavan',
          location: 'Mattancherry',
          specialties: 'Crispy ghee roast dosas, idlis, and traditional vegetarian thali',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Rice Boat',
          location: 'Taj Malabar, Willingdon Island',
          specialties: 'Floating seafood restaurant specializing in fresh catch',
        },
        {
          restaurant: 'Fort House Restaurant',
          location: 'Fort Kochi',
          specialties: 'Kerala fish curry overlooking the harbor',
        },
      ],
      peacefulNote:
        'Kochi cuisine is celebrated for fragrant cold-pressed coconut oil, fresh coastal curry leaves, mustard seeds, and freshly crushed Malabar black pepper.',
    },
    attractions: [
      {
        id: 'IN-KL-COK-ATT-001',
        name: 'Chinese Fishing Nets & Fort Kochi Beach',
        category: 'Nature / Heritage: Landmarks',
        timings: 'Open 24 hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/kerala/kochi-chinese-nets.jpg',
        photoCredit: 'User Photo / Cantilevered Chinese Fishing Nets',
        summary:
          'Iconic cantilevered shore-operated fishing nets silhouetted against Arabian Sea sunsets.',
      },
      {
        id: 'IN-KL-COK-ATT-002',
        name: 'Mattancherry Palace (Dutch Palace)',
        category: 'Heritage: Palaces & Forts',
        timings: '10:00–17:00 (Closed Fridays)',
        fee: { domestic: 'INR 25', foreign: 'INR 25' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Mattancherry_Palace_Cochin.jpg/1280px-Mattancherry_Palace_Cochin.jpg',
        photoCredit: 'Wikimedia Commons / Mattancherry Palace',
        summary:
          '16th-century palace gifted to the Raja of Cochin by the Portuguese, renowned for exquisite Hindu epic mural paintings.',
      },
      {
        id: 'IN-KL-COK-ATT-003',
        name: 'Paradesi Synagogue & Jew Town',
        category: 'Spiritual / Heritage: Architecture',
        timings: '10:00–12:00 & 15:00–17:00 (Closed Fridays & Saturdays)',
        fee: { domestic: 'INR 10', foreign: 'INR 10' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Paradesi_Synagogue_Kochi.jpg/1280px-Paradesi_Synagogue_Kochi.jpg',
        photoCredit: 'Wikimedia Commons / Paradesi Synagogue',
        summary:
          'The oldest active Commonwealth synagogue, featuring hand-painted Chinese floor tiles and Belgian glass chandeliers.',
      },
      {
        id: 'IN-KL-COK-GEM-001',
        name: 'Santa Cruz Cathedral Basilica',
        category: 'Spiritual / Heritage: Christianity',
        timings: '09:00–13:00 & 15:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Santa_Cruz_Basilica_-_200_MP_03.jpg/1280px-Santa_Cruz_Basilica_-_200_MP_03.jpg',
        photoCredit: 'Wikimedia Commons / Santa Cruz Cathedral Basilica',
        summary:
          'One of India\'s finest heritage churches showcasing bright pastel interiors, Gothic arches, and historical oil paintings.',
      },
      {
        id: 'IN-KL-COK-GEM-002',
        name: 'Mangalavanam Bird Sanctuary',
        category: 'Nature: Wildlife-Tourism',
        timings: '09:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Mangalavanam.JPG/1280px-Mangalavanam.JPG',
        photoCredit: 'Wikimedia Commons / Mangalavanam Bird Sanctuary',
        summary:
          'A protected tidal wetland bird sanctuary located right in the middle of Ernakulam urban center.',
      },
    ],
  },
  {
    id: 'munnar',
    code: 'IN-KL-CITY-MUN',
    name: 'Munnar',
    nickname: 'High-Altitude Western Ghats Tea Sanctuary',
    tagline: 'Emerald Tea Carpets, Anamudi Summits, and Endangered Nilgiri Tahr',
    accentColor: '#107C41',
    bgGradient: 'from-emerald-950/60 via-green-950/40 to-slate-950/70',
    coverImage: '/images/kerala/munnar-tea-hills.jpg',
    photoCredit: 'User Photo / Munnar Rolling Tea Hills & Winding Mountain Roads',
    flashcardBlurb:
      'High-altitude Western Ghats hill station blanketed in emerald tea estates, mist-shrouded peaks, and the home of the endangered Nilgiri Tahr.',
    topStays: [
      { name: 'SpiceTree Munnar', category: 'Chinnakanal — Luxury Plantation Wellness Retreat & Spa' },
      { name: 'Windermere Estate', category: 'Pothamedu — Heritage Tea & Cardamom Plantation Haven' },
      { name: 'Elixir Hills', category: 'Mankulam — Luxury Suites Surrounded by Dense Rainforest' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Saravana Bhavan',
          location: 'MG Road',
          specialties: 'Authentic South Indian Thali, crisp Ghee Masala Dosa, hot Sambar, and filter coffee',
        },
        {
          restaurant: 'Rapsy Restaurant',
          location: 'Main Bazaar',
          specialties: 'Layered Kerala Malabar Parotta with rich vegetable kurma, and Spanish omelettes',
        },
      ],
      nonVeg: [
        {
          restaurant: "Guru's Restaurant",
          location: 'Aluva-Munnar Road',
          specialties: 'Spicy Kerala Mutton Fry, Naadan Country Chicken Curry, and beef dry roast',
        },
        {
          restaurant: "Butler's Creek",
          location: 'Chithirapuram',
          specialties: 'Creamy Travancore Fish Molee with hot lace Appams, and grilled Western Ghats trout',
        },
      ],
      peacefulNote:
        'Munnar dining pairs mountain-air appetite with freshly brewed orthodox tea, warm cardamom-scented stews, and hot Kerala banana fritters (Pazham Pori).',
    },
    attractions: [
      {
        id: 'IN-KL-MUN-ATT-001',
        name: 'Eravikulam National Park (Rajamalai)',
        category: 'Nature / Rural · Wildlife-Tourism, Nilgiri Tahr, Anamudi Summit (2,695m)',
        timings: '07:30–16:00 (Closed February to April annually for calving season)',
        fee: { domestic: 'INR 200', foreign: 'INR 500' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Eravikulam Nilgiri Tahr Habitat',
        summary:
          'UNESCO Western Ghats high-altitude sanctuary harboring the world’s largest surviving population of the endangered Nilgiri Tahr (mountain goat). Spread across shola grassland rolling hills at the foot of Anamudi (2,695m), the highest peak in South India.',
      },
      {
        id: 'IN-KL-MUN-ATT-002',
        name: 'KDHP Tea Museum / Lockhart Tea Factory',
        category: 'Gastronomy / Rural · Farm to Table, Crafts-Tourism, Industrial Tea Heritage',
        timings: '09:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 125', foreign: 'INR 125' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Orthodox Tea Processing',
        summary:
          'Fascinating colonial-era processing museum in Nullatanni estate showcasing the evolution of tea production from 1905 manually cranked CTC rollers to modern orthodox leaf grading, complete with live tea-tasting sessions.',
      },
      {
        id: 'IN-KL-MUN-ATT-003',
        name: 'Mattupetty Dam & Echo Point',
        category: 'Nature / Adventure · Rivers & Lakes, Hills & Mountains, Reservoir Boating',
        timings: '09:30–17:00',
        fee: { domestic: 'INR 20 (Speedboat ride: INR 500–700)', foreign: 'INR 20' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Mattupetty_Dam_Munnar.jpg/1280px-Mattupetty_Dam_Munnar.jpg',
        photoCredit: 'Wikimedia Commons / Mattupetty Dam',
        summary:
          'Concrete gravity dam constructed in the 1950s impounding tranquil waters surrounded by tea gardens and eucalyptus forests. Renowned for natural acoustic resonance at Echo Point and speedboat safari rides where wild elephants frequently graze on the grassy waterbanks.',
      },
      {
        id: 'IN-KL-MUN-GEM-001',
        name: 'Top Station',
        category: 'Nature · Hills & Mountains, Highest Point in Munnar (1,868 m) with Spectacular Vistas into Tamil Nadu',
        timings: '06:00–18:00 (Best visited before 08:00 AM for clear valley panoramas)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Top_Station_Munnar.jpg/1280px-Top_Station_Munnar.jpg',
        photoCredit: 'Wikimedia Commons / Top Station Munnar',
        summary:
          'Historic terminal point of the erstwhile Kundala Valley Railway ropeway at 1,868 metres. Perched directly on the Kerala-Tamil Nadu border, it commands breathtaking 360-degree precipice views over the Kurangani hills and plains of Theni.',
      },
      {
        id: 'IN-KL-MUN-GEM-002',
        name: 'Chinnakanal-Mathikettan Elephant Corridor',
        category: 'Nature / Rural · Wildlife-Tourism, Restored Natural Migratory Corridor for Wild Elephants',
        timings: 'Daylight viewing from safe designated road viewpoints',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Wild_Elephant_Corridor_Munnar.jpg/1280px-Wild_Elephant_Corridor_Munnar.jpg',
        photoCredit: 'Wikimedia Commons / Chinnakanal Elephant Trail',
        summary:
          'A critically restored ecological corridor connecting Mathikettan Shola National Park with the Anayirankal reservoir. Enables safe, unhindered seasonal migration of wild Asian elephant herds through Cardamom Hill reserves without human-wildlife conflict.',
      },
    ],
  },
  {
    id: 'alappuzha',
    code: 'IN-KL-CITY-ALP',
    name: 'Alappuzha / Alleppey',
    nickname: 'The Venice of the East',
    tagline: 'Serpentine Backwater Canals, Kettuvallam Houseboats & Below-Sea-Level Paddy Farming',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/60 via-teal-950/40 to-slate-950/70',
    coverImage: '/images/kerala/alleppey-houseboat.jpg',
    photoCredit: 'User Photo / Kettuvallam Houseboat Cruising Serene Backwaters',
    flashcardBlurb:
      '"The Venice of the East", renowned for its serpentine canals, paddy fields cultivated below sea level, and overnight kettuvallam houseboats.',
    topStays: [
      { name: 'Kumarakom Lake Resort', category: 'Vembanad Lake — Ultra Luxury Heritage Waterfront Sanctuary' },
      { name: 'Xandari Riverscapes', category: 'Finest Handcrafted Eco-Fleet of Traditional Kettuvallam Houseboats' },
      { name: 'Lake Palace Resort', category: 'Thirumala Ward — Boutique Water Palace on Private Backwater Island' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Thaff Delicacy',
          location: 'VCSB Road',
          specialties: 'Hot fluffy lace Appam with vegetable coconut milk stew, and authentic Kerala Sadhya on banana leaf',
        },
        {
          restaurant: 'Brothers Hotel',
          location: 'Near KSRTC Stand',
          specialties: 'Crisp hot Uzhunnu Vada, spicy Podi Dosa, and traditional South Indian vegetarian tiffins',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Cassia Restaurant',
          location: 'Beach Road',
          specialties: 'Spicy Alappuzha Duck Roast with Kerala parotta, and Chemmeen (tiger prawn) curry in roasted coconut paste',
        },
        {
          restaurant: 'Halais Restaurant',
          location: 'CCSMB Road',
          specialties: 'Aromatic Thalassery Dum Biryani made with tiny Kaima rice, and tava-fried Karimeen',
        },
      ],
      peacefulNote:
        'Backwater cooks prepare meals aboard drifting houseboats: fresh lake catch pan-seared with shallots, tapioca with fish curry, and warm payasam for dessert.',
    },
    attractions: [
      {
        id: 'IN-KL-ALP-ATT-001',
        name: 'Vembanad Lake Backwater Cruise',
        category: 'Nature · Rivers & Lakes, Sustainable Tourism, Kettuvallam Houseboats & Sunset Catamarans',
        timings: '06:00–18:00 (Houseboats anchor at dusk by maritime law; new 5:30 PM sunset cruises via Sea Kuttanad boats)',
        fee: {
          domestic: 'Shikara boat: ~INR 800/hr | Sunset cruise: ₹200 | Houseboat day/overnight: INR 7,500–15,000',
          foreign: 'Same as domestic',
        },
        isHiddenGem: false,
        image: '/images/kerala/alleppey-houseboat.jpg',
        photoCredit: 'User Photo / Traditional Alleppey Wooden Houseboat',
        summary:
          'Glide through the mirror-calm waters of Vembanad Lake—India’s longest lake—aboard traditional thatched Kettuvallams crafted from wild jackwood planks bound with coir rope without a single nail. Highlights include peaceful village palm canals and Sea Kuttanad sunset cruises.',
      },
      {
        id: 'IN-KL-ALP-ATT-002',
        name: 'Alappuzha Beach & 160-Year-Old Pier',
        category: 'Nature / Heritage · Beaches & Cruises, 1862 Historical Sea Bridge Pier & Striped Lighthouse',
        timings: '05:00–21:00 (Lighthouse open 15:00–17:00)',
        fee: { domestic: 'Beach Free (Lighthouse: INR 20)', foreign: 'Beach Free (Lighthouse: INR 50)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Alleppey_beach_pier.jpg/1280px-Alleppey_beach_pier.jpg',
        photoCredit: 'Wikimedia Commons / 1862 Alappuzha Pier Ruins',
        summary:
          'Extensive golden sand coastline punctuated by the haunting teak-and-iron skeletal pilings of the 1862 sea bridge pier built by Captain Hugh Crawford for spice shipping. Overlooked by the operational 1862 red-and-white coastal lighthouse.',
      },
      {
        id: 'IN-KL-ALP-GEM-001',
        name: 'Kuttanad Below-Sea-Level Farming',
        category: 'Rural / Gastronomy · Agro-Tourism, Live Like a Local, Globally Important Agricultural Heritage System',
        timings: '07:00–17:00',
        fee: { domestic: 'Free (Explored via public SWTD government water ferry for INR 15–40)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Kuttanad Emerald Paddy Dykes',
        summary:
          'Known as the "Rice Bowl of Kerala", this is one of only two places in the world where paddy agriculture is practiced 1.5 to 3 metres below mean sea level, protected by ancient clay dykes and de-watering wheels recognized by FAO as a world agricultural heritage system.',
      },
      {
        id: 'IN-KL-ALP-GEM-002',
        name: 'Pathiramanal Bird Island',
        category: 'Nature · Rivers & Lakes, Wildlife-Tourism, Proposed for Central Government "One State, One Global Destination"',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Speedboat return transfer from Muhamma/Kumarakom: INR 500–800)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Pathiramanal_Island_Vembanad.jpg/1280px-Pathiramanal_Island_Vembanad.jpg',
        photoCredit: 'Wikimedia Commons / Pathiramanal Island Mangroves',
        summary:
          'A secluded 28-hectare uninhabited sandbank island in Vembanad Lake meaning "Sands of Midnight". Accessible solely by watercraft, it provides nesting habitat for over 90 species of resident and migratory waterfowl and was recently proposed for the prestigious "One State, One Global Destination" scheme.',
      },
    ],
  },
  {
    id: 'wayanad',
    code: 'IN-KL-CITY-WAY',
    name: 'Wayanad',
    nickname: 'Land of Paddy Fields & Wilderness',
    tagline: 'Neolithic Petroglyphs, Chembra Heart Lake, and Western Ghats Spice Plateaus',
    accentColor: '#059669',
    bgGradient: 'from-emerald-950/60 via-stone-900/40 to-slate-950/70',
    coverImage: '/images/kerala/edakkal-caves.jpg',
    photoCredit: 'User Photo / Edakkal Prehistoric Rock Cleft & Cavern',
    flashcardBlurb:
      'The "Land of Paddy Fields & Wilderness" on a pristine forested plateau of the Western Ghats, holding Neolithic petroglyphs, spice plantations, and cloud-draped waterfalls, recently heavily promoted under the \'Brand Wayanad\' initiative.',
    topStays: [
      { name: 'Vythiri Resort', category: 'Vythiri — Luxury Rainforest Treehouse & Stream-side Eco-Resort' },
      { name: 'Evolve Back Kuruba Safari Lodge', category: 'Kabini / Wayanad Border — Ultra-Luxury Wildlife Experience' },
      { name: 'Tranquil Resort', category: 'Ambalavayal — 400-Acre Private Coffee & Pepper Plantation Estate' },
    ],
    dining: {
      veg: [
        {
          restaurant: "1980's A Nostalgic Restaurant",
          location: 'Kalpetta',
          specialties: 'Authentic 24-dish traditional Kerala Sadhya served on banana leaf, Avial, Thoran, and Payasam',
        },
        {
          restaurant: 'Udupi Pure Vegetarian',
          location: 'Sulthan Bathery',
          specialties: 'Crispy ghee roast dosas, hot idlis with three chutneys, and classic South Indian meals',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Wilton Restaurant',
          location: 'Sulthan Bathery',
          specialties: 'Crispy Malabar Kozhi Porichathu (fried chicken), bamboo steamed chicken biryani, and beef fry',
        },
        {
          restaurant: 'ClayHut Village Restaurant',
          location: 'Kalpetta',
          specialties: 'Traditional sun-dried fish curry, claypot country mutton, and roasted tapioca',
        },
      ],
      peacefulNote:
        'Wayanad gastronomy thrives on fragrant green cardamom, wild Wayanad black pepper, ginger, and indigenous tribal delicacies cooked inside bamboo canes over wood fires.',
    },
    attractions: [
      {
        id: 'IN-KL-WAY-ATT-001',
        name: 'Edakkal Caves',
        category: 'Heritage · Archeological Sites, Historical Sites, 3,000+ Year-Old Prehistoric Petroglyphic Rock Carvings',
        timings: '09:00–16:00 (Closed Mondays)',
        fee: { domestic: 'INR 50', foreign: 'INR 100' },
        isHiddenGem: false,
        image: '/images/kerala/edakkal-caves.jpg',
        photoCredit: 'User Photo / Edakkal Natural Cave Shelter & Steps',
        summary:
          'Prehistoric rock shelter split across Ambukuthi Mala at 3,900 feet elevation. Not a true cave but a natural fissure formed by a fallen boulder wedge, its stone walls are covered with petroglyphic engravings dating back over 3,000 to 6,000 years, depicting human figures, animals, wheeled carts, and Indus Valley script links.',
      },
      {
        id: 'IN-KL-WAY-ATT-002',
        name: 'Chembra Peak & Heart-Shaped Lake',
        category: "Adventure / Nature · Hiking & Trekking, Hills & Mountains, Wayanad's Highest Peak (2,100 m)",
        timings: '07:00–14:00 (Trek entry permit counter closes at 12:00 PM)',
        fee: { domestic: 'Forest Permit INR 1,000 (Group of up to 5 people)', foreign: 'Forest Permit INR 1,000 (Group of up to 5)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Chembra_Peak_Heart_Lake.jpg/1280px-Chembra_Peak_Heart_Lake.jpg',
        photoCredit: 'Wikimedia Commons / Chembra Heart Lake (Hridaya Thadakam)',
        summary:
          'Highest mountain massif in Wayanad rising to 2,100 metres (6,890 ft). Halfway up the misty trail through tea gardens and shola grasslands lies Hridaya Thadakam—a natural perennial alpine lake formed in the shape of a heart, said to never dry up even in peak summer.',
      },
      {
        id: 'IN-KL-WAY-ATT-003',
        name: 'Banasura Sagar Dam',
        category: "Nature / Adventure · Rivers & Lakes, India's Largest Earth Dam & Asia's Second-Largest",
        timings: '09:00–17:00',
        fee: { domestic: 'INR 40 (Boating extra)', foreign: 'INR 80 (Boating extra)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Banasurasagar_dam_wayanad.jpg/1280px-Banasurasagar_dam_wayanad.jpg',
        photoCredit: 'Wikimedia Commons / Banasura Sagar Dam Reservoir Islands',
        summary:
          'Constructed across the Karamanathodu tributary of the Kabini River using massive boulders and earth embankments. The reservoir submerged surrounding hills, creating a picturesque archipelago of emerald islands with speedboating set against the towering Banasura Peak.',
      },
      {
        id: 'IN-KL-WAY-GEM-001',
        name: 'Muthanga & Tholpetty Wildlife Sanctuary Inner Jeep Track',
        category: 'Nature / Rural · Wildlife-Tourism, Tribal-Tourism, Nilgiri Biosphere Asian Elephant Sanctuary',
        timings: '07:00–10:00 & 15:00–17:00',
        fee: { domestic: 'INR 150 + Jeep Hire (~INR 1,000–1,500/jeep)', foreign: 'INR 360 + Jeep Hire' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Wayanad Wildlife Safari',
        summary:
          'Integral component of the Nilgiri Biosphere Reserve sharing borders with Bandipur and Nagarhole. Guided open-top 4x4 forest department jeep safaris traverse deciduous teak forests with frequent sightings of wild Asian elephant herds, spotted deer, Indian bison (gaur), and Malabar giant squirrels.',
      },
      {
        id: 'IN-KL-WAY-GEM-002',
        name: 'Karlad Lake Adventure Base',
        category: 'Adventure / Nature · Kayaking, Ziplining across Water, Rivers & Lakes, Bamboo Rafting',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 40 entry | Water Zipline: INR 290 | Kayaking: INR 150', foreign: 'INR 40 entry | Zipline: INR 290' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Karlad_Lake_Wayanad.jpg/1280px-Karlad_Lake_Wayanad.jpg',
        photoCredit: 'Wikimedia Commons / Karlad Lake Adventure Base',
        summary:
          'The second-largest freshwater lake in Wayanad, nestled amid tranquil nature 16 km from Kalpetta. Developed as an eco-adventure hub, it boasts South India’s longest aerial zip line gliding directly across the surface of the lake, rock climbing, and calm kayaking.',
      },
    ],
  },
];
