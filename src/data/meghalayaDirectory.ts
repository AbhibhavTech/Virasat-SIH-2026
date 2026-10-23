export interface MeghalayaStay {
  name: string;
  category: string;
}

export interface MeghalayaFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface MeghalayaDining {
  veg: MeghalayaFoodSpot[];
  nonVeg: MeghalayaFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface MeghalayaAttraction {
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

export interface MeghalayaCity {
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
  topStays: MeghalayaStay[];
  dining: MeghalayaDining;
  attractions: MeghalayaAttraction[];
}

export const MEGHALAYA_DIRECTORY: MeghalayaCity[] = [
  {
    id: 'shillong',
    code: 'IN-ML-CITY-SHL',
    name: 'Shillong',
    nickname: 'The Scotland of the East & Rock Music Capital',
    tagline: 'Pine-Clad Ridges, Khasi Tribal Markets, and Crystal Highland Lakes',
    accentColor: '#059669',
    bgGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-950/70',
    flashcardBlurb:
      '"The Scotland of the East" and rock music capital of India, set amidst pine-clad ridges, colonial heritage cottages, tribal Khasi bazaars, and crystal highland lakes.',
    coverImage: '/images/meghalaya/umiam-lake.png',
    photoCredit: 'User Photo / Umiam Lake Barapani',
    topStays: [
      { name: 'Ri Kynjai - Serenity by the Lake', category: 'Umiam — Luxury Khasi Thatch Architecture & Spa' },
      { name: 'Vivanta Meghalaya', category: 'Police Bazar — City Center Contemporary Luxury' },
      { name: 'Heritage Club - Tripura Castle', category: 'Cleve Colony — Royal Manikya Summer Palace' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Madras Cafe',
          location: 'Police Bazar',
          specialties: 'Crispy golden dosas, hot idlis, filter coffee, and homestyle South Indian thalis',
        },
        {
          restaurant: "Dylan's Cafe",
          location: 'Risa Colony',
          specialties: 'Tribute cafe to Bob Dylan serving fluffy blueberry pancakes, Belgian waffles, thick shakes, and pasta',
        },
        {
          restaurant: 'City Hut Dhaba',
          location: 'Police Bazar',
          specialties: 'North Indian vegetarian delicacies, Paneer Butter Masala, Dal Makhani, and fresh tandoori naans',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Trattoria',
          location: 'Police Bazar',
          specialties: 'Authentic Khasi Jadoh (rice cooked in meat stock), spicy Dohkhlieh pork salad, and fermented Tungrymbai chutney',
        },
        {
          restaurant: 'The Wok',
          location: 'Laitumkhrah',
          specialties: 'Pan-Asian spiced pork belly, Tibetan steamed momos, and crispy chilly chicken',
        },
        {
          restaurant: 'Lamee Restaurant',
          location: 'Police Bazar',
          specialties: 'Multi-cuisine Chinese, authentic Khasi meat stews, and smoky tandoori kebabs',
        },
      ],
      peacefulNote:
        'Shillong boasts a rich cafe and music lounge culture with live acoustic guitar sets, organic ginger tea, and authentic Khasi home-cooked pork and bamboo shoot curries.',
    },
    attractions: [
      {
        id: 'IN-ML-SHL-ATT-001',
        name: 'Umiam Lake (Barapani)',
        category: 'Nature / Adventure · Rivers & Lakes, Water Sports Complex, Speedboating & Kayaking',
        timings: '09:00–17:00',
        fee: { domestic: 'Free shore access (Boating: INR 100–500)', foreign: 'Free shore access (Boating: INR 100–500)' },
        isHiddenGem: false,
        image: '/images/meghalaya/umiam-lake.png',
        photoCredit: 'User Photo / Umiam Lake at Dusk',
        summary:
          'Sprawling reservoir 15 km north of Shillong, formed by damming the Umiam River in the early 1960s. Encircled by lush coniferous pine groves, it is a premier highland water-sports haven offering speedboating, paddle-boating, kayaking, and serene sunset promenades.',
      },
      {
        id: 'IN-ML-SHL-ATT-002',
        name: 'Don Bosco Museum of Indigenous Cultures',
        category: 'Arts / Rural · Museums, Tribal-Tourism, 7-Storey Gallery of Northeast Tribes & Skywalk',
        timings: '09:00–17:30 (Monday–Saturday; closed Sundays & major holidays)',
        fee: { domestic: 'INR 100', foreign: 'INR 200' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Don_Bosco_Museum_Shillong.jpg/1280px-Don_Bosco_Museum_Shillong.jpg',
        photoCredit: 'Wikimedia Commons / Don Bosco Museum',
        summary:
          'Acclaimed seven-storey hexagonal museum in Mawlai showcasing the rich anthropological heritage, costumes, musical instruments, weaponry, and traditional dwellings of all eight northeastern states, crowned by a panoramic rooftop skywalk over Shillong.',
      },
      {
        id: 'IN-ML-SHL-ATT-003',
        name: 'Elephant Falls',
        category: 'Nature · Rivers & Lakes, 3-Tiered Waterfall along Fern Glades, Mountain Stream',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 20 per person + Camera: INR 20', foreign: 'INR 20 per person + Camera: INR 20' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Elephant_Falls_Shillong.jpg/1280px-Elephant_Falls_Shillong.jpg',
        photoCredit: 'Wikimedia Commons / Elephant Falls',
        summary:
          'Known locally as Ka Kshaid Lai Pateng Khohsiew ("Three Steps Waterfalls"). The stream tumbles over dark fern-draped rocks across three successive cascading tiers, accessible via well-paved stone stairs and railed footbridges 12 km from the city.',
      },
      {
        id: 'IN-ML-SHL-ATT-004',
        name: 'Shillong Peak & Laitkor Viewpoint',
        category: "Nature · Hills & Mountains, Highest Point in Meghalaya (1,965 m) with Bird's-Eye City Panoramas",
        timings: '09:00–16:00 (Air Force security area; valid government photo ID mandatory)',
        fee: { domestic: 'INR 30–50', foreign: 'INR 30–50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shillong_Peak_View.jpg/1280px-Shillong_Peak_View.jpg',
        photoCredit: 'Wikimedia Commons / Shillong Peak View',
        summary:
          'Highest elevation in Meghalaya at 1,965 metres (6,447 ft). Venerated in local Khasi religion as the sacred dwelling of the deity U Shulong. Features telescope observation towers providing 360-degree views of Shillong and on clear days, the distant Bangladesh plains.',
      },
      {
        id: 'IN-ML-SHL-GEM-001',
        name: 'Laitlum Canyons',
        category: 'Nature / Adventure · Hills & Mountains, Hiking & Trekking, "End of the World" Mist Amphitheater Gorge',
        timings: '06:00–17:30',
        fee: { domestic: 'INR 50 entry/parking', foreign: 'INR 50 entry/parking' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Laitlum_Canyon_Meghalaya.jpg/1280px-Laitlum_Canyon_Meghalaya.jpg',
        photoCredit: 'Wikimedia Commons / Laitlum Canyon',
        summary:
          'Dramatic razor-edge ridge plunging into sheer abyss canyons 25 km south of Shillong. Meaning "End of the Hills", Laitlum offers an amphitheater of swirling mists, cascading waterfalls, and a steep 3,000-step stone trail descending to the isolated bamboo hamlet of Rasong.',
      },
      {
        id: 'IN-ML-SHL-GEM-002',
        name: 'Mawphlang Sacred Forest & David Scott Trail',
        category: 'Spiritual / Nature · Eco-Tourism, Ancient Khasi Monoliths, Protected Grove where Nothing May Be Taken',
        timings: '09:00–16:30',
        fee: { domestic: 'INR 50 | Mandatory guide: INR 300–500', foreign: 'INR 100 | Mandatory guide: INR 300–500' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mawphlang_Sacred_Grove.jpg/1280px-Mawphlang_Sacred_Grove.jpg',
        photoCredit: 'Wikimedia Commons / Mawphlang Sacred Grove',
        summary:
          'Ancient 192-acre virgin rainforest preserved for over 800 years by the Hima Mawphlang Khasi clan. Guarded by stone sacrificial coronation monoliths, strict lore dictates that taking anything from the grove—even a pebble or leaf—invites divine misfortune.',
      },
    ],
  },
  {
    id: 'cherrapunji-sohra',
    code: 'IN-ML-CITY-SHR',
    name: 'Cherrapunji / Sohra',
    nickname: 'The Abode of Cloudbursts & Living Root Bridges',
    tagline: 'India’s Tallest Plunges, Prehistoric Limestone Caves, and Double Decker Roots',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/60 via-blue-950/40 to-slate-950/70',
    flashcardBlurb:
      'The legendary rain realm perched along the southern edge of the Meghalayan plateau, dropping sheer into the Bangladeshi plains through giant plunging waterfalls and prehistoric limestone caverns.',
    coverImage: '/images/meghalaya/nohkalikai-falls.jpg',
    photoCredit: 'User Photo / Nohkalikai Falls & Emerald Plunge Pool',
    topStays: [
      { name: 'Polo Orchid Resort', category: 'Nongsohphan — Clifftop Luxury Overlooking Bangladesh Plains' },
      { name: 'Jiva Resort', category: 'Sohra-Shella Road — Modern Boutique with Organic Farms' },
      { name: 'Kutmadan Resort', category: 'Sohra Rim — Quiet Valley Edge Cottages' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Orange Roots',
          location: 'Sohra-Shella Road',
          specialties: '100% Pure Vegetarian South Indian Thalis, crisp Butter Masala Dosas, Idli Vada, and Jain food options',
        },
        {
          restaurant: 'Jiva Grill',
          location: 'Sohra',
          specialties: 'Artisanal wood-fired vegetarian pizzas, creamy pasta alfredo, farm salads, and freshly baked garlic bread',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Halari Restaurant',
          location: 'Sohra Market',
          specialties: 'Local Khasi smoked pork with bamboo shoot, country chicken curry, and fresh red mountain rice',
        },
        {
          restaurant: 'Avron Restaurant',
          location: 'Nongrim',
          specialties: 'Chinese chilly pork, Indian mutton curries, and spicy Khasi meat stir-fries',
        },
      ],
      peacefulNote:
        'Sohra is legendary for crisp mountain showers, local red rice, wild pepper curries, and warm cinnamon-spiced tea enjoyed overlooking mist-veiled gorges.',
    },
    attractions: [
      {
        id: 'IN-ML-SHR-ATT-001',
        name: 'Nohkalikai Falls',
        category: 'Nature · Rivers & Lakes, Tallest Plunge Waterfall in India (340 m) descending into an emerald pool',
        timings: 'Sunrise to Sunset (06:00–18:00)',
        fee: { domestic: 'INR 20 (Camera: INR 20–50)', foreign: 'INR 20 (Camera: INR 20–50)' },
        isHiddenGem: false,
        image: '/images/meghalaya/nohkalikai-falls.jpg',
        photoCredit: 'User Photo / Nohkalikai Waterfall',
        summary:
          'Tallest single-drop plunge waterfall in India dropping 340 metres (1,115 ft) sheer down red cliff faces into an ethereal turquoise-green splash pool. Tied to the poignant Khasi tragedy of Ka Likai, the canyon viewpoint offers breathtaking views of the southern plateau.',
      },
      {
        id: 'IN-ML-SHR-ATT-002',
        name: 'Mawsmai Cave & Arwah Lumshynna Cave',
        category: 'Adventure / Nature · Geological Caves, Prehistoric Marine Fossils, Limestone Stalactites & Squeezes',
        timings: '09:30–17:30',
        fee: { domestic: 'Mawsmai: INR 20–50 | Arwah: INR 20–50', foreign: 'Mawsmai: INR 20–50 | Arwah: INR 20–50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Mawsmai_Cave_Cherrapunji.jpg/1280px-Mawsmai_Cave_Cherrapunji.jpg',
        photoCredit: 'Wikimedia Commons / Mawsmai Cave',
        summary:
          'Twin subterranean wonders: Mawsmai is an illuminated 150-metre limestone passage with dramatic stalagmites, stalactites, and narrow crawl spaces; Arwah features vast chambers retaining millions-of-years-old crustacean and marine fish fossils embedded in stone walls.',
      },
      {
        id: 'IN-ML-SHR-ATT-003',
        name: 'Seven Sisters Falls (Nohsngithiang Falls) & Mawkdok Valley',
        category: 'Nature / Adventure · Rivers & Lakes, Ziplining across 1,200-ft Deep Gorges, 7-Segmented Cliff Cascade',
        timings: '06:00–18:00',
        fee: { domestic: 'Free viewpoint access (Ziplining: INR 500–800)', foreign: 'Free viewpoint access' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nohsngithiang_Falls_Cherrapunji.jpg/1280px-Nohsngithiang_Falls_Cherrapunji.jpg',
        photoCredit: 'Wikimedia Commons / Nohsngithiang Falls',
        summary:
          'Seven-segmented cliff waterfall dropping 315 meters across sheer limestone cliffs, symbolizing the seven northeastern sister states. En route, the Mawkdok Dympep Valley viewpoint offers high-adrenaline zipline glides soaring 1,200 feet above the valley gorge.',
      },
      {
        id: 'IN-ML-SHR-GEM-001',
        name: 'Double Decker Living Root Bridge, Nongriat',
        category: 'Rural / Adventure · UNESCO Tentative, Bio-Engineering Marvel made from rubber fig roots (3,500 Steps)',
        timings: '06:00–17:00 (Start trek by 08:00; overnight stay in Nongriat recommended)',
        fee: { domestic: 'Village entry: INR 50 | Guide: INR 300–500', foreign: 'Village entry: INR 50 | Guide: INR 300–500' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Double_decker_living_root_bridge_Nongriat.jpg/1280px-Double_decker_living_root_bridge_Nongriat.jpg',
        photoCredit: 'Wikimedia Commons / Nongriat Double Decker Root Bridge',
        summary:
          'World-famous indigenous bio-engineering marvel crafted over generations by the Khasi people, who guide aerial roots of Ficus elastica trees across roaring mountain rivers. Reached via a demanding 3,500-step stone descent from Tyrna village.',
      },
      {
        id: 'IN-ML-SHR-GEM-002',
        name: 'Rainbow Falls Trek',
        category: 'Adventure / Nature · Hiking & Trekking, Hidden Turquoise Plunge Pool producing perpetual rainbows',
        timings: 'Daylight hours',
        fee: { domestic: 'Free beyond Nongriat trail', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Rainbow Falls Nongriat',
        summary:
          'Hidden 1.5 hours further into the jungle beyond Nongriat village. Water cascades over an immense monolithic boulder into a crystal-clear turquoise basin, where afternoon sun rays consistently cast radiant circular rainbows across the spray.',
      },
      {
        id: 'IN-ML-SHR-GEM-003',
        name: 'Wei Sawdong 3-Tiered Waterfall',
        category: 'Nature / Adventure · Hiking & Trekking, Three Stepped Emerald Pools accessible via bamboo ladders',
        timings: '08:00–16:30',
        fee: { domestic: 'INR 30–50', foreign: 'INR 30–50' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Wei_Sawdong_Falls_Meghalaya.jpg/1280px-Wei_Sawdong_Falls_Meghalaya.jpg',
        photoCredit: 'Wikimedia Commons / Wei Sawdong Falls',
        summary:
          'Three-tiered horseshoe waterfall tumbling through dense subtropical wilderness into stacked turquoise lagoons. Reached via an adventurous 20-minute descent down steep timber, bamboo ladders, and tree roots off the Sohra-Shella highway.',
      },
    ],
  },
  {
    id: 'dawki-shnongpdeng',
    code: 'IN-ML-CITY-DWK',
    name: 'Dawki & Shnongpdeng',
    nickname: 'The Floating River Paradise & Border Gateway',
    tagline: 'Transparent Waters of the Umngot, Cliff Diving, and Luminous Krang Shuri Plunge',
    accentColor: '#0D9488',
    bgGradient: 'from-teal-950/60 via-emerald-950/40 to-slate-950/70',
    flashcardBlurb:
      'The international border outpost along the southern slopes of the Jaintia Hills, famous for the transparent emerald waters of the Umngot River where boats appear to float on glass air.',
    coverImage: '/images/meghalaya/umngot-river-dawki.png',
    photoCredit: 'User Photo / Umngot River Boat Floating on Transparent Water',
    topStays: [
      { name: 'Betelnut Resort', category: 'Shnongpdeng — Riverside Eco-Cottages & Pebble Beach' },
      { name: 'Riverside Glamping Tents', category: 'Pioneer Adventure / Shnongpdeng Campsites' },
      { name: 'Boscage Riverside Camp', category: 'Dawki Riverbank — Wilderness Tented Stays' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Riverside Camp Messes',
          location: 'Shnongpdeng',
          specialties: 'Homestyle yellow dal, steamed rice, mixed mountain vegetables, hot Aloo Gobi, and freshly rolled parathas',
        },
        {
          restaurant: 'Cafe Umngot',
          location: 'Dawki',
          specialties: 'Steaming Maggi noodles, hot ginger milk tea, samosas, and travel snacks overlooking the suspension bridge',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Shnongpdeng Village Stalls',
          location: 'Riverbank',
          specialties: 'Freshly netted Umngot river fish fry with lemon, country chicken curry, and Khasi pork stew cooked with black sesame paste',
        },
      ],
      peacefulNote:
        'Evenings at Shnongpdeng feature riverside bonfires on the white pebble beach, barbecued sweet corn, and freshly grilled river fish under starlit canyon skies.',
    },
    attractions: [
      {
        id: 'IN-ML-DWK-ATT-001',
        name: 'Umngot River Boating at Dawki & Suspension Bridge',
        category: 'Nature / Adventure · Rivers & Lakes, Transparent Waters (Peak clarity Nov–Mar), 1932 Suspension Bridge',
        timings: '07:00–17:00',
        fee: { domestic: 'Regulated boat ride ~INR 800–1,000/boat (seats 3–4)', foreign: 'Regulated boat ride ~INR 800–1,000/boat' },
        isHiddenGem: false,
        image: '/images/meghalaya/umngot-river-dawki.png',
        photoCredit: 'User Photo / Dawki River Boating',
        summary:
          'Famed worldwide for its mirror-like clarity where wooden dugout boats cast sharp shadows on the riverbed 15–20 feet below, creating the optical illusion of flying through air. Overlooked by the British-era single-lane Dawki suspension bridge constructed in 1932.',
      },
      {
        id: 'IN-ML-DWK-ATT-002',
        name: 'Tamabil Indo-Bangladesh Border Post',
        category: 'Heritage · International Borders, Friendly Zero-Point Checkpost where Visitors Mingle',
        timings: '09:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tamabil_Border_Dawki.jpg/1280px-Tamabil_Border_Dawki.jpg',
        photoCredit: 'Wikimedia Commons / Tamabil Border Post',
        summary:
          'Located 2 km south of Dawki town, Tamabil is the friendly zero-point border outpost separating Meghalaya from Sylhet division in Bangladesh. Tourists can stand by the border pillar and watch international truck commerce across the border gate.',
      },
      {
        id: 'IN-ML-DWK-GEM-001',
        name: 'Shnongpdeng Adventure Hub',
        category: 'Adventure / Nature · Scuba Diving, Snorkeling, Cliff Jumping, Kayaking, Canyon Ziplining',
        timings: '07:00–17:30',
        fee: { domestic: 'Kayak: INR 300–400/hr | Snorkel: INR 500 | Scuba: INR 2,500–3,500', foreign: 'Same as domestic' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Shnongpdeng Clear Water Kayak',
        summary:
          'Located 8 km upstream from crowded Dawki, Shnongpdeng is a tranquil Khasi tribal village along a wider, cleaner bend of the Umngot River. Renowned for adrenaline-pumping water activities including cliff jumping from limestone boulders and scuba diving in crystal waters.',
      },
      {
        id: 'IN-ML-DWK-GEM-002',
        name: 'Krang Shuri Waterfalls, Amlarem',
        category: 'Nature / Adventure · Rivers & Lakes, Luminous Cyan Waterfall Plunge Pool with Life-Jacket Swimming',
        timings: '08:00–17:30',
        fee: { domestic: 'INR 50 entry | Life-jacket rental: INR 100', foreign: 'INR 50 entry | Life-jacket: INR 100' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Krang_Suri_Falls_Meghalaya.jpg/1280px-Krang_Suri_Falls_Meghalaya.jpg',
        photoCredit: 'Wikimedia Commons / Krang Shuri Waterfalls',
        summary:
          'Picture-perfect waterfall in the Jaintia Hills where a broad mountain river plunges over a limestone ledge into an immense, luminous blue-green pool. Chiseled stone footpaths lead down to the water, where visitors swim in life jackets under the falls.',
      },
    ],
  },
  {
    id: 'mawlynnong',
    code: 'IN-ML-CITY-MWL',
    name: 'Mawlynnong',
    nickname: "God's Own Garden & Asia's Cleanest Village",
    tagline: '100% Literacy, Conical Woven Bamboo Dustbins, and Riwai Root Bridges',
    accentColor: '#16A34A',
    bgGradient: 'from-green-950/60 via-emerald-950/40 to-slate-950/70',
    flashcardBlurb:
      '"God\'s Own Garden" in the East Khasi Hills, recognized as Asia\'s cleanest village, celebrated for 100% literacy, community-woven bamboo dustbins, and living root structures.',
    coverImage: '/images/meghalaya/mawlynnong-village.jpg',
    photoCredit: 'User Photo / Mawlynnong Stream & Forest Steps',
    topStays: [
      { name: 'Mawlynnong Bamboo Cottage', category: 'Village Center — Traditional Eco-Stay' },
      { name: 'Ila Jong Homestay', category: 'Pristine Village Home & Khasi Family Hospitality' },
      { name: 'Areca Palm Tree House', category: 'Treetop Wooden Cottage overlooking Forest Canopy' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Stream View Restaurant',
          location: 'Village Main',
          specialties: 'Organic vegetarian thalis, tender bamboo shoots with turmeric, stir-fried wild mountain spinach, and lentil dal',
        },
        {
          restaurant: 'Emdorini Restaurant',
          location: 'Village Center',
          specialties: 'Traditional Khasi rice platters, seasonal vegetable fries, crispy potato fritters, and herbal tea',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Village Homestay Kitchens',
          location: 'Mawlynnong',
          specialties: 'Local country chicken curry with fresh ginger paste, pork with wild forest mushrooms, and pan-fried stream fish',
        },
      ],
      peacefulNote:
        'Mawlynnong practices community-wide cleanliness with conical bamboo dustbins (Khoh) stationed outside every flower-lined cottage; all organic waste is composted for village gardens.',
    },
    attractions: [
      {
        id: 'IN-ML-MWL-ATT-001',
        name: 'Mawlynnong Flower Village Walk',
        category: 'Rural / Nature · Sustainable Tourism, Live Like a Local, Conical Bamboo Waste Baskets (Khoh)',
        timings: 'Daylight hours (07:00–17:30; respect local privacy)',
        fee: { domestic: 'Village entry: INR 50 per vehicle/visitor', foreign: 'INR 50 per vehicle/visitor' },
        isHiddenGem: false,
        image: '/images/meghalaya/mawlynnong-village.jpg',
        photoCredit: 'User Photo / Mawlynnong Village Pathways',
        summary:
          'Awarded the title of "Cleanest Village in Asia" by Discover India in 2003. This matrilineal Khasi community features spotless paved paths bordered by blooming hibiscus, orchids, pitcher plants, and conical woven bamboo baskets (Khoh) placed outside every home.',
      },
      {
        id: 'IN-ML-MWL-ATT-002',
        name: 'Sky Walk Bamboo Viewpoint',
        category: 'Nature / Adventure · 85-ft High Bamboo Tower woven into treetop branches overlooking Bangladesh',
        timings: '07:00–17:30',
        fee: { domestic: 'INR 20–30 per person', foreign: 'INR 20–30 per person' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Mawlynnong_Sky_Walk.jpg/1280px-Mawlynnong_Sky_Walk.jpg',
        photoCredit: 'Wikimedia Commons / Mawlynnong Sky Walk',
        summary:
          'Ingenious 85-foot-high watchtower constructed entirely of local bamboo and tied with cane ropes woven through the branches of a giant forest tree. Climbing the sloping ramp rewards visitors with breathtaking panoramas of the Bangladesh plains.',
      },
      {
        id: 'IN-ML-MWL-ATT-003',
        name: 'Church of the Epiphany',
        category: 'Heritage / Spiritual · Christianity, 120-Year-Old Historic Stone Gothic Church amidst orange orchards',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Church_of_the_Epiphany_Mawlynnong.jpg/1280px-Church_of_the_Epiphany_Mawlynnong.jpg',
        photoCredit: 'Wikimedia Commons / Church of the Epiphany',
        summary:
          'Constructed in 1902 by Welsh Christian missionaries, this picturesque stone church with red sloped roof, arched windows, and a quaint bell tower sits enveloped in manicured gardens, betel nut trees, and orange orchards in the heart of the village.',
      },
      {
        id: 'IN-ML-MWL-GEM-001',
        name: 'Riwai Single-Decker Living Root Bridge (Jingmaham)',
        category: 'Rural / Heritage · UNESCO Tentative, Accessible 30-metre Root Bridge spanning a stream',
        timings: '07:00–17:30',
        fee: { domestic: 'INR 30–50 per person', foreign: 'INR 30–50 per person' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Living_Root_Bridge_Riwai.jpg/1280px-Living_Root_Bridge_Riwai.jpg',
        photoCredit: 'Wikimedia Commons / Riwai Living Root Bridge',
        summary:
          'Located in neighbouring Riwai village just 2 km before Mawlynnong. Unlike the strenuous 3,500-step trek to Nongriat, this majestic 30-metre living root bridge spanning the Thyllong River is reachable via an easy 10-minute flat stone forest path.',
      },
      {
        id: 'IN-ML-MWL-GEM-002',
        name: 'Natural Balancing Rock, Riwai',
        category: 'Nature / Spiritual · Geological Oddity, Massive Prehistoric Boulder on a small stone base',
        timings: '08:00–17:00',
        fee: { domestic: 'INR 20', foreign: 'INR 20' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Balancing_Rock_Mawlynnong.jpg/1280px-Balancing_Rock_Mawlynnong.jpg',
        photoCredit: 'Wikimedia Commons / Balancing Rock Mawlynnong',
        summary:
          'Fascinating geological phenomenon where a massive multi-ton rounded boulder balances precariously upon a tiny stone pedestal without falling, defying powerful earthquakes and monsoon cyclones for centuries. Ancient Khasis venerated the site as a sacred sacrificial spot.',
      },
    ],
  },
];
