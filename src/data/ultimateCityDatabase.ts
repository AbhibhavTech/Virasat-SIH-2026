/**
 * Ultimate Comprehensive City Database: Destinations, Restaurants & Hotels
 * (IN-ULTIMATE-CITY-DATABASE-15)
 * 
 * Curated master database covering 24 key cultural hubs across India.
 * Each city entry contains Top 15 Hotels (spanning ultra-luxury, heritage palaces, and boutique stays),
 * Top Attractions & Hidden Gems, and Famous Vegetarian & Non-Vegetarian Restaurants with iconic dishes.
 */

export interface UltimateHotel {
  id: string;
  name: string;
  locality: string;
  description: string;
  tier: 'ultra-luxury' | 'heritage-palace' | 'luxury' | 'boutique' | 'upscale' | 'comfort';
  stars: number;
  lat: number;
  lng: number;
}

export interface UltimateRestaurant {
  id: string;
  name: string;
  locality: string;
  type: 'veg' | 'non-veg';
  cuisine: string;
  specialties: string;
  lat: number;
  lng: number;
}

export interface UltimateAttraction {
  id: string;
  name: string;
  category: string;
  description: string;
  isHiddenGem: boolean;
  lat: number;
  lng: number;
}

export interface UltimateCityRecord {
  id: string;
  code: string;
  name: string;
  state: string;
  zone: 'West' | 'North' | 'South' | 'East' | 'Central' | 'Northeast' | 'Himalaya';
  flashcardBlurb: string;
  lat: number;
  lng: number;
  hotels: UltimateHotel[];
  restaurants: {
    veg: UltimateRestaurant[];
    nonVeg: UltimateRestaurant[];
  };
  attractions: UltimateAttraction[];
}

export const ULTIMATE_CITY_DATABASE_15: UltimateCityRecord[] = [
  {
    "id": "mumbai",
    "code": "IN-MH-MUM-FULL",
    "name": "Mumbai",
    "state": "Maharashtra",
    "zone": "West",
    "lat": 18.922,
    "lng": 72.8347,
    "flashcardBlurb": "India's vibrant commercial and entertainment capital, sprawling across a coastal peninsula with Victorian Gothic architecture, Bollywood glamour, and dynamic coastal street life.",
    "hotels": [
      {
        "id": "mumbai-hotel-1-the-taj-mahal-palace",
        "name": "The Taj Mahal Palace",
        "locality": "Colaba",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Iconic waterfront heritage landmark facing the Gateway of India since 1903.",
        "lat": 18.930649,
        "lng": 72.8347
      },
      {
        "id": "mumbai-hotel-2-the-oberoi-mumbai",
        "name": "The Oberoi Mumbai",
        "locality": "Nariman Point",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Sophisticated sea-facing luxury overlooking the Arabian Sea.",
        "lat": 18.933851,
        "lng": 72.840278
      },
      {
        "id": "mumbai-hotel-3-four-seasons-hotel",
        "name": "Four Seasons Hotel",
        "locality": "Worli",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Sleek high-rise luxury with a renowned rooftop lounge.",
        "lat": 18.933574,
        "lng": 72.848289
      },
      {
        "id": "mumbai-hotel-4-the-st-regis-mumbai",
        "name": "The St. Regis Mumbai",
        "locality": "Lower Parel",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Towering luxury hotel located in India's premier lifestyle and business district.",
        "lat": 18.928681,
        "lng": 72.856438
      },
      {
        "id": "mumbai-hotel-5-trident-nariman-point",
        "name": "Trident, Nariman Point",
        "locality": "Nariman Point",
        "tier": "luxury",
        "stars": 5,
        "description": "Elegant business and leisure hotel right along Marine Drive.",
        "lat": 18.919288,
        "lng": 72.861978
      },
      {
        "id": "mumbai-hotel-6-itc-maratha",
        "name": "ITC Maratha",
        "locality": "Andheri East",
        "tier": "luxury",
        "stars": 5,
        "description": "Luxury hotel showcasing Maratha architecture, grand domes, and fine dining.",
        "lat": 18.917676,
        "lng": 72.842618
      },
      {
        "id": "mumbai-hotel-7-sofitel-mumbai-bkc",
        "name": "Sofitel Mumbai BKC",
        "locality": "Bandra Kurla Complex",
        "tier": "luxury",
        "stars": 5,
        "description": "Chic French-Indian luxury in the financial district.",
        "lat": 18.911505,
        "lng": 72.842761
      },
      {
        "id": "mumbai-hotel-8-the-leela-mumbai",
        "name": "The Leela Mumbai",
        "locality": "Andheri East",
        "tier": "luxury",
        "stars": 5,
        "description": "Resort-style luxury oasis set amid lush waterfalls and gardens near the airport.",
        "lat": 18.905081,
        "lng": 72.838502
      },
      {
        "id": "mumbai-hotel-9-abode-bombay",
        "name": "Abode Bombay",
        "locality": "Colaba",
        "tier": "boutique",
        "stars": 4,
        "description": "Charming eco-conscious boutique heritage hotel set in a 20th-century building.",
        "lat": 18.900851,
        "lng": 72.829948
      },
      {
        "id": "mumbai-hotel-10-the-gordon-house-hotel",
        "name": "The Gordon House Hotel",
        "locality": "Colaba",
        "tier": "boutique",
        "stars": 4,
        "description": "Quirky, theme-based boutique hotel popular with travelers.",
        "lat": 18.901009,
        "lng": 72.818578
      },
      {
        "id": "mumbai-hotel-11-hotel-sea-princess",
        "name": "Hotel Sea Princess",
        "locality": "Juhu",
        "tier": "upscale",
        "stars": 4,
        "description": "Beachfront hotel offering direct views of the Arabian Sea.",
        "lat": 18.917676,
        "lng": 72.826782
      },
      {
        "id": "mumbai-hotel-12-lemon-tree-premier",
        "name": "Lemon Tree Premier",
        "locality": "Malad",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary upscale business hotel in the northern business hub.",
        "lat": 18.920644,
        "lng": 72.821061
      },
      {
        "id": "mumbai-hotel-13-goldfinch-hotel",
        "name": "Goldfinch Hotel",
        "locality": "Andheri East",
        "tier": "upscale",
        "stars": 4,
        "description": "Modern 4-star hotel well-known for its vibrant dining and pub scene.",
        "lat": 18.927345,
        "lng": 72.81731
      },
      {
        "id": "mumbai-hotel-14-residency-hotel-fort",
        "name": "Residency Hotel Fort",
        "locality": "Fort",
        "tier": "boutique",
        "stars": 3,
        "description": "Highly-rated heritage business hotel in south Mumbai's commercial core.",
        "lat": 18.936468,
        "lng": 72.817714
      },
      {
        "id": "mumbai-hotel-15-the-taj-mahal-tower",
        "name": "The Taj Mahal Tower",
        "locality": "Colaba",
        "tier": "luxury",
        "stars": 5,
        "description": "The modern architectural wing complementing the historic Taj Palace.",
        "lat": 18.945703,
        "lng": 72.823544
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "mumbai-rest-veg-1-ram-ashraya",
          "name": "Ram Ashraya",
          "locality": "Matunga",
          "type": "veg",
          "cuisine": "South Indian",
          "specialties": "Legendary filter coffee and idlis",
          "lat": 18.917627,
          "lng": 72.831341
        },
        {
          "id": "mumbai-rest-veg-2-soam",
          "name": "Soam",
          "locality": "Girgaon",
          "type": "veg",
          "cuisine": "Gujarati & Maharashtrian",
          "specialties": "Authentic heritage Maharashtrian and Gujarati snacks",
          "lat": 18.916832,
          "lng": 72.828096
        },
        {
          "id": "mumbai-rest-veg-3-swati-snacks",
          "name": "Swati Snacks",
          "locality": "Tardeo",
          "type": "veg",
          "cuisine": "Street Food & Chaat",
          "specialties": "Panki and fresh sugarcane juice",
          "lat": 18.917397,
          "lng": 72.824359
        }
      ],
      "nonVeg": [
        {
          "id": "mumbai-rest-nonveg-1-britannia-co-restaurant",
          "name": "Britannia & Co. Restaurant",
          "locality": "Ballard Estate",
          "type": "non-veg",
          "cuisine": "Parsi & Irani",
          "specialties": "Historic Parsi Cafe serving Berry Pulao",
          "lat": 18.919468,
          "lng": 72.820668
        },
        {
          "id": "mumbai-rest-nonveg-2-trishna",
          "name": "Trishna",
          "locality": "Kala Ghoda",
          "type": "non-veg",
          "cuisine": "Seafood",
          "specialties": "Famous Butter Garlic Crab",
          "lat": 18.923018,
          "lng": 72.817591
        },
        {
          "id": "mumbai-rest-nonveg-3-gajalee",
          "name": "Gajalee",
          "locality": "Vile Parle",
          "type": "non-veg",
          "cuisine": "Malvani Coastal Seafood",
          "specialties": "Coastal Malvani seafood and green-masala crab",
          "lat": 18.92367,
          "lng": 72.829265
        }
      ]
    },
    "attractions": [
      {
        "id": "mumbai-att-1-gateway-of-india-colaba-causeway",
        "name": "Gateway of India & Colaba Causeway",
        "category": "Monuments",
        "description": "Iconic 26-meter basalt triumphal arch overlooking Mumbai Harbour.",
        "isHiddenGem": false,
        "lat": 18.91974,
        "lng": 72.811968
      },
      {
        "id": "mumbai-att-2-marine-drive-chowpatty",
        "name": "Marine Drive & Chowpatty",
        "category": "Promenade",
        "description": "3.6-km arc-shaped coastal boulevard (\"Queen's Necklace\").",
        "isHiddenGem": false,
        "lat": 18.924825,
        "lng": 72.806286
      },
      {
        "id": "mumbai-att-3-chhatrapati-shivaji-maharaj-terminus-csmt-",
        "name": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Victorian Gothic railway architectural masterpiece.",
        "isHiddenGem": false,
        "lat": 18.932022,
        "lng": 72.802093
      },
      {
        "id": "mumbai-att-4-khotachiwadi-village",
        "name": "Khotachiwadi Village",
        "category": "Heritage Enclave",
        "description": "19th-century heritage pocket with Portuguese-style wooden bungalows in Girgaon.",
        "isHiddenGem": true,
        "lat": 18.927405,
        "lng": 72.824803
      },
      {
        "id": "mumbai-att-5-gilbert-hill",
        "name": "Gilbert Hill",
        "category": "Geological Wonder",
        "description": "Rare 200-foot monolithic black basalt rock column in Andheri.",
        "isHiddenGem": true,
        "lat": 18.932851,
        "lng": 72.821961
      }
    ]
  },
  {
    "id": "jaipur",
    "code": "IN-RJ-JAI-FULL",
    "name": "Jaipur",
    "state": "Rajasthan",
    "zone": "West",
    "lat": 26.9124,
    "lng": 75.7873,
    "flashcardBlurb": "India's iconic \"Pink City\" and royal capital of Rajasthan, celebrated for its majestic hilltop fortresses, pink-hued palaces, bustling bazaars, and astronomical heritage.",
    "hotels": [
      {
        "id": "jaipur-hotel-1-rambagh-palace",
        "name": "Rambagh Palace",
        "locality": "Bhawani Singh Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Former residence of the Maharaja of Jaipur, operating as a legendary luxury palace hotel.",
        "lat": 26.921049,
        "lng": 75.7873
      },
      {
        "id": "jaipur-hotel-2-fairmont-jaipur",
        "name": "Fairmont Jaipur",
        "locality": "Kukas, Aravalli Hills",
        "tier": "luxury",
        "stars": 5,
        "description": "Majestic luxury palace hotel nestled in the Aravalli hills.",
        "lat": 26.924251,
        "lng": 75.793217
      },
      {
        "id": "jaipur-hotel-3-the-oberoi-rajvilas",
        "name": "The Oberoi Rajvilas",
        "locality": "Goner Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Peaceful luxury resort featuring royal villas, tented rooms, and reflection pools.",
        "lat": 26.923974,
        "lng": 75.801716
      },
      {
        "id": "jaipur-hotel-4-samode-haveli",
        "name": "Samode Haveli",
        "locality": "Gangapole",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "175-year-old traditional haveli offering authentic royal heritage hospitality.",
        "lat": 26.919081,
        "lng": 75.810361
      },
      {
        "id": "jaipur-hotel-5-taj-jai-mahal-palace",
        "name": "Taj Jai Mahal Palace",
        "locality": "Jacob Road, Civil Lines",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "18th-century palace set amidst 18 acres of landscaped Moghul gardens.",
        "lat": 26.909688,
        "lng": 75.816238
      },
      {
        "id": "jaipur-hotel-6-raffles-jaipur",
        "name": "Raffles Jaipur",
        "locality": "Kukas",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Ultra-luxury experiential hotel reflecting exquisite Rajasthani craftsmanship.",
        "lat": 26.908076,
        "lng": 75.7957
      },
      {
        "id": "jaipur-hotel-7-alsisar-haveli",
        "name": "Alsisar Haveli",
        "locality": "Sansar Chandra Road",
        "tier": "boutique",
        "stars": 4,
        "description": "Beautifully restored heritage mansion in the heart of the city.",
        "lat": 26.901905,
        "lng": 75.795851
      },
      {
        "id": "jaipur-hotel-8-umaid-bhawan-a-royal-heritage-style-hotel",
        "name": "Umaid Bhawan - A Royal Heritage Style Hotel",
        "locality": "Bani Park",
        "tier": "boutique",
        "stars": 4,
        "description": "Boutique heritage hotel featuring traditional jharokhas and courtyards.",
        "lat": 26.895481,
        "lng": 75.791333
      },
      {
        "id": "jaipur-hotel-9-devi-ratn-ihcl-seleqtions-",
        "name": "Devi Ratn (IHCL SeleQtions)",
        "locality": "Jamdoli",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary architectural masterpiece inspired by Jantar Mantar.",
        "lat": 26.891251,
        "lng": 75.782259
      },
      {
        "id": "jaipur-hotel-10-clarks-amer",
        "name": "Clarks Amer",
        "locality": "JLN Marg",
        "tier": "luxury",
        "stars": 5,
        "description": "Long-standing 5-star hotel committed to sustainable hospitality and art.",
        "lat": 26.891409,
        "lng": 75.770197
      },
      {
        "id": "jaipur-hotel-11-ramada-by-wyndham-jaipur",
        "name": "Ramada by Wyndham Jaipur",
        "locality": "Raja Park",
        "tier": "upscale",
        "stars": 4,
        "description": "Polished business and leisure hotel with multiple international dining outlets.",
        "lat": 26.908076,
        "lng": 75.7789
      },
      {
        "id": "jaipur-hotel-12-shahpura-house",
        "name": "Shahpura House",
        "locality": "Bani Park",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Traditional heritage hotel managed by the royal family of Shahpura.",
        "lat": 26.911044,
        "lng": 75.772831
      },
      {
        "id": "jaipur-hotel-13-hotel-arya-niwas",
        "name": "Hotel Arya Niwas",
        "locality": "Sansar Chandra Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Peaceful, eco-friendly heritage home known for quiet courtyards and home-style veg food.",
        "lat": 26.917745,
        "lng": 75.768851
      },
      {
        "id": "jaipur-hotel-14-trident-jaipur",
        "name": "Trident Jaipur",
        "locality": "Amber Fort Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Picturesque luxury hotel offering sweeping views of Mansagar Lake and Jal Mahal.",
        "lat": 26.926868,
        "lng": 75.76928
      },
      {
        "id": "jaipur-hotel-15-hotel-jaipur-heritage",
        "name": "Hotel Jaipur Heritage",
        "locality": "Amer Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Charming heritage stay located close to the historic walled city bazaars.",
        "lat": 26.936103,
        "lng": 75.775465
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "jaipur-rest-veg-1-laxmi-mishthan-bhandar-lmb-",
          "name": "Laxmi Mishthan Bhandar (LMB)",
          "locality": "Johari Bazaar",
          "type": "veg",
          "cuisine": "Rajasthani Mithai & Snacks",
          "specialties": "Legendary Pyaaz Kachori and Ghevar",
          "lat": 26.908027,
          "lng": 75.783737
        },
        {
          "id": "jaipur-rest-veg-2-rawat-mishthan-bhandar",
          "name": "Rawat Mishthan Bhandar",
          "locality": "Sindhi Camp",
          "type": "veg",
          "cuisine": "Rajasthani Street Snacks",
          "specialties": "Famous Mirchi Bada and Mawa Kachori",
          "lat": 26.907232,
          "lng": 75.780294
        }
      ],
      "nonVeg": [
        {
          "id": "jaipur-rest-nonveg-1-suvarna-mahal",
          "name": "Suvarna Mahal",
          "locality": "Rambagh Palace",
          "type": "non-veg",
          "cuisine": "Royal Mughlai & Indian",
          "specialties": "Royal Indian fine dining in a regal ballroom",
          "lat": 26.909868,
          "lng": 75.772414
        },
        {
          "id": "jaipur-rest-nonveg-2-1135-ad",
          "name": "1135 AD",
          "locality": "Amber Fort",
          "type": "non-veg",
          "cuisine": "Rajasthani Royal Cuisine",
          "specialties": "Authentic Rajasthani non-veg thalis and Laal Maas",
          "lat": 26.913418,
          "lng": 75.76915
        }
      ]
    },
    "attractions": [
      {
        "id": "jaipur-att-1-amber-fort-palace",
        "name": "Amber Fort & Palace",
        "category": "Palaces & Forts",
        "description": "Hilltop fortress complex featuring the mirror-adorned Sheesh Mahal.",
        "isHiddenGem": false,
        "lat": 26.91014,
        "lng": 75.763185
      },
      {
        "id": "jaipur-att-2-hawa-mahal",
        "name": "Hawa Mahal",
        "category": "Monuments",
        "description": "5-story honeycomb stone-screened window facade overlooking royal processions.",
        "isHiddenGem": false,
        "lat": 26.915225,
        "lng": 75.757156
      },
      {
        "id": "jaipur-att-3-city-palace-jantar-mantar",
        "name": "City Palace & Jantar Mantar",
        "category": "UNESCO Heritage",
        "description": "Royal residence museum and UNESCO astronomical observatory.",
        "isHiddenGem": false,
        "lat": 26.922422,
        "lng": 75.752709
      },
      {
        "id": "jaipur-att-4-panna-meena-ka-kund",
        "name": "Panna Meena ka Kund",
        "category": "Stepwell",
        "description": "16th-century geometric stepwell with intersecting staircases.",
        "isHiddenGem": true,
        "lat": 26.917805,
        "lng": 75.7768
      },
      {
        "id": "jaipur-att-5-nahargarh-biological-park",
        "name": "Nahargarh Biological Park",
        "category": "Nature & Wildlife",
        "description": "Forest reserve at the foothills housing leopards and lions.",
        "isHiddenGem": true,
        "lat": 26.923251,
        "lng": 75.773785
      }
    ]
  },
  {
    "id": "varanasi",
    "code": "IN-UP-VNS-FULL",
    "name": "Varanasi",
    "state": "Uttar Pradesh",
    "zone": "North",
    "lat": 25.3176,
    "lng": 82.9739,
    "flashcardBlurb": "One of the world's oldest continuously inhabited cities sitting on the crescent banks of the Ganges, serving as the spiritual heartland of India.",
    "hotels": [
      {
        "id": "varanasi-hotel-1-brijrama-palace",
        "name": "Brijrama Palace",
        "locality": "Darbhanga Ghat",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Restored 18th-century heritage palace right on the riverbank, accessible by boat.",
        "lat": 25.326249,
        "lng": 82.9739
      },
      {
        "id": "varanasi-hotel-2-taj-ganges-varanasi",
        "name": "Taj Ganges, Varanasi",
        "locality": "Cantonment",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling luxury hotel set amidst lush gardens in the quiet cantonment area.",
        "lat": 25.329451,
        "lng": 82.979737
      },
      {
        "id": "varanasi-hotel-3-brijganga",
        "name": "BrijGanga",
        "locality": "Assi Ghat",
        "tier": "boutique",
        "stars": 4,
        "description": "Elegant riverfront boutique hotel offering serene sunrise views over the Ganges.",
        "lat": 25.329174,
        "lng": 82.98812
      },
      {
        "id": "varanasi-hotel-4-hotel-surya-kaiser-palace",
        "name": "Hotel Surya, Kaiser Palace",
        "locality": "Cantonment",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Heritage-style hotel reflecting colonial Banarasi architecture and local art.",
        "lat": 25.324281,
        "lng": 82.996648
      },
      {
        "id": "varanasi-hotel-5-radisson-hotel-varanasi",
        "name": "Radisson Hotel Varanasi",
        "locality": "Cantonment",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium upscale business hotel located near city cultural centers.",
        "lat": 25.314888,
        "lng": 83.002446
      },
      {
        "id": "varanasi-hotel-6-hotel-ganges-grand",
        "name": "Hotel Ganges Grand",
        "locality": "Chetganj",
        "tier": "upscale",
        "stars": 4,
        "description": "Comfortable heritage-styled hotel close to the main temple corridors.",
        "lat": 25.313276,
        "lng": 82.982186
      },
      {
        "id": "varanasi-hotel-7-dwivedi-hotels-ganges-view",
        "name": "Dwivedi Hotels Ganges View",
        "locality": "Assi Ghat",
        "tier": "boutique",
        "stars": 3,
        "description": "Intimate river-facing heritage home popular among writers and pilgrims.",
        "lat": 25.307105,
        "lng": 82.982336
      },
      {
        "id": "varanasi-hotel-8-hotel-alka",
        "name": "Hotel Alka",
        "locality": "Panchganga Ghat",
        "tier": "comfort",
        "stars": 3,
        "description": "Prime riverfront hotel right near historic ghat steps.",
        "lat": 25.300681,
        "lng": 82.977878
      },
      {
        "id": "varanasi-hotel-9-clarks-hotel-varanasi",
        "name": "Clarks Hotel, Varanasi",
        "locality": "Cantonment",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Historic legacy hotel operating in Varanasi for over a century.",
        "lat": 25.296451,
        "lng": 82.968927
      },
      {
        "id": "varanasi-hotel-10-the-amayaa-hotel",
        "name": "The Amayaa Hotel",
        "locality": "Godowla",
        "tier": "boutique",
        "stars": 4,
        "description": "Contemporary boutique hotel located near central market crossings.",
        "lat": 25.296609,
        "lng": 82.957029
      },
      {
        "id": "varanasi-hotel-11-hotel-costa-riviera",
        "name": "Hotel Costa Riviera",
        "locality": "Cantonment",
        "tier": "upscale",
        "stars": 4,
        "description": "Modern upscale property offering comfortable transit amenities.",
        "lat": 25.313276,
        "lng": 82.965614
      },
      {
        "id": "varanasi-hotel-12-hhi-varanasi-hotel-hindustan-international-",
        "name": "HHI Varanasi (Hotel Hindustan International)",
        "locality": "Maldahiya",
        "tier": "luxury",
        "stars": 4,
        "description": "Well-established luxury hotel with popular rooftop dining.",
        "lat": 25.316244,
        "lng": 82.959627
      },
      {
        "id": "varanasi-hotel-13-hotel-central-residency",
        "name": "Hotel Central Residency",
        "locality": "Sigra",
        "tier": "comfort",
        "stars": 3,
        "description": "Centrally located business and leisure hotel.",
        "lat": 25.322945,
        "lng": 82.955701
      },
      {
        "id": "varanasi-hotel-14-sona-international",
        "name": "Sona International",
        "locality": "Cantonment",
        "tier": "comfort",
        "stars": 3,
        "description": "Clean, reliable mid-range hotel near the cantonment.",
        "lat": 25.332068,
        "lng": 82.956125
      },
      {
        "id": "varanasi-hotel-15-suryauday-haveli",
        "name": "Suryauday Haveli",
        "locality": "Shivala Ghat",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Restored heritage ghat-front property managed with traditional hospitality.",
        "lat": 25.341303,
        "lng": 82.962226
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "varanasi-rest-veg-1-kashi-chat-bhandar",
          "name": "Kashi Chat Bhandar",
          "locality": "Godowla",
          "type": "veg",
          "cuisine": "Banarasi Street Food",
          "specialties": "Iconic Tamatar Chaat and Aloo Tikki",
          "lat": 25.313227,
          "lng": 82.970385
        },
        {
          "id": "varanasi-rest-veg-2-blue-lassi",
          "name": "Blue Lassi",
          "locality": "Chauk",
          "type": "veg",
          "cuisine": "Dessert & Lassi",
          "specialties": "Legendary fruit lassis served in clay pots",
          "lat": 25.312432,
          "lng": 82.966989
        }
      ],
      "nonVeg": [
        {
          "id": "varanasi-rest-nonveg-1-the-gateway-hotel-pavilion",
          "name": "The Gateway Hotel Pavilion",
          "locality": "Cantonment",
          "type": "non-veg",
          "cuisine": "Awadhi & Regional Indian",
          "specialties": "Multi-cuisine Awadhi and regional non-veg specialties",
          "lat": 25.315068,
          "lng": 82.959215
        }
      ]
    },
    "attractions": [
      {
        "id": "varanasi-att-1-dashashwamedh-ghat-ganga-aarti",
        "name": "Dashashwamedh Ghat & Ganga Aarti",
        "category": "Spiritual",
        "description": "Main ghat hosting the grand evening ritual fire worship.",
        "isHiddenGem": false,
        "lat": 25.31534,
        "lng": 82.950112
      },
      {
        "id": "varanasi-att-2-kashi-vishwanath-temple-corridor",
        "name": "Kashi Vishwanath Temple Corridor",
        "category": "Spiritual",
        "description": "Revered Jyotirlinga shrine dedicated to Lord Shiva.",
        "isHiddenGem": false,
        "lat": 25.320425,
        "lng": 82.944165
      },
      {
        "id": "varanasi-att-3-sarnath-archaeological-site",
        "name": "Sarnath Archaeological Site",
        "category": "Buddhist Heritage",
        "description": "Sacred deer park where Buddha delivered his first sermon.",
        "isHiddenGem": false,
        "lat": 25.327622,
        "lng": 82.939777
      },
      {
        "id": "varanasi-att-4-chausath-yogini-temple",
        "name": "Chausath Yogini Temple",
        "category": "Ancient Shrine",
        "description": "9th-century ancient stone temple tucked away near Assi Ghat.",
        "isHiddenGem": true,
        "lat": 25.323005,
        "lng": 82.963543
      },
      {
        "id": "varanasi-att-5-man-mandir-observatory",
        "name": "Man Mandir Observatory",
        "category": "Astronomical Heritage",
        "description": "18th-century rooftop astronomical observatory overlooking the Ganges.",
        "isHiddenGem": true,
        "lat": 25.328451,
        "lng": 82.960569
      }
    ]
  },
  {
    "id": "bengaluru",
    "code": "IN-KA-BLR-FULL",
    "name": "Bengaluru",
    "state": "Karnataka",
    "zone": "South",
    "lat": 12.9716,
    "lng": 77.5946,
    "flashcardBlurb": "India's vibrant \"Silicon Valley\" and Garden City, blending a rich royal heritage with lush botanical parks, craft breweries, and tech-driven innovation.",
    "hotels": [
      {
        "id": "bengaluru-hotel-1-the-leela-palace-bengaluru",
        "name": "The Leela Palace Bengaluru",
        "locality": "Old Airport Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Grand neo-classical architecture reflecting royal Mysore design.",
        "lat": 12.980249,
        "lng": 77.5946
      },
      {
        "id": "bengaluru-hotel-2-the-oberoi-bengaluru",
        "name": "The Oberoi, Bengaluru",
        "locality": "MG Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Iconic luxury hotel centered around a magnificent 120-year-old raintree.",
        "lat": 12.983451,
        "lng": 77.600015
      },
      {
        "id": "bengaluru-hotel-3-itc-gardenia",
        "name": "ITC Gardenia",
        "locality": "Residency Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Luxury LEED Platinum-rated hotel set amidst lush vertical gardens.",
        "lat": 12.983174,
        "lng": 77.607791
      },
      {
        "id": "bengaluru-hotel-4-taj-west-end",
        "name": "Taj West End",
        "locality": "Race Course Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Historic luxury legacy hotel spread across 20 acres of tropical gardens since 1887.",
        "lat": 12.978281,
        "lng": 77.615702
      },
      {
        "id": "bengaluru-hotel-5-conrad-bengaluru",
        "name": "Conrad Bengaluru",
        "locality": "Ulsoor Lake",
        "tier": "luxury",
        "stars": 5,
        "description": "Sleek luxury high-rise offering panoramic views over Ulsoor Lake.",
        "lat": 12.968888,
        "lng": 77.62108
      },
      {
        "id": "bengaluru-hotel-6-jw-marriott-hotel-bengaluru",
        "name": "JW Marriott Hotel Bengaluru",
        "locality": "Vittal Mallya Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium luxury hotel located next to UB City.",
        "lat": 12.967276,
        "lng": 77.602286
      },
      {
        "id": "bengaluru-hotel-7-shangri-la-bengaluru",
        "name": "Shangri-La Bengaluru",
        "locality": "Bellary Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Five-star luxury featuring multiple award-winning dining venues.",
        "lat": 12.961105,
        "lng": 77.602425
      },
      {
        "id": "bengaluru-hotel-8-the-ritz-carlton-bengaluru",
        "name": "The Ritz-Carlton, Bengaluru",
        "locality": "Residency Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Sophisticated luxury hotel featuring exquisite spa and dining options.",
        "lat": 12.954681,
        "lng": 77.59829
      },
      {
        "id": "bengaluru-hotel-9-fortune-park-jayanagar",
        "name": "Fortune Park Jayanagar",
        "locality": "Jayanagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Upscale business hotel located in South Bangalore's cultural hub.",
        "lat": 12.950451,
        "lng": 77.589987
      },
      {
        "id": "bengaluru-hotel-10-the-chancery-pavilion",
        "name": "The Chancery Pavilion",
        "locality": "Residency Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Central business hotel with spacious rooms and fine dining.",
        "lat": 12.950609,
        "lng": 77.57895
      },
      {
        "id": "bengaluru-hotel-11-the-park-bangalore",
        "name": "The Park, Bangalore",
        "locality": "MG Road",
        "tier": "boutique",
        "stars": 5,
        "description": "Trendy boutique luxury hotel known for avant-garde design.",
        "lat": 12.967276,
        "lng": 77.586914
      },
      {
        "id": "bengaluru-hotel-12-movenpick-hotel-convention-centre",
        "name": "Movenpick Hotel & Convention Centre",
        "locality": "Gokula Extension",
        "tier": "luxury",
        "stars": 5,
        "description": "Swiss-hospitality luxury hotel located in North Bangalore.",
        "lat": 12.970244,
        "lng": 77.58136
      },
      {
        "id": "bengaluru-hotel-13-lemon-tree-premier-ulsoor-lake",
        "name": "Lemon Tree Premier, Ulsoor Lake",
        "locality": "Kensington Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Vibrant upscale hotel overlooking Ulsoor Lake.",
        "lat": 12.976945,
        "lng": 77.577719
      },
      {
        "id": "bengaluru-hotel-14-st-mark-s-hotel",
        "name": "St. Mark's Hotel",
        "locality": "St. Mark's Road",
        "tier": "boutique",
        "stars": 4,
        "description": "Independent 5-star boutique hotel known for personalized service.",
        "lat": 12.986068,
        "lng": 77.578111
      },
      {
        "id": "bengaluru-hotel-15-iris-hotel",
        "name": "Iris Hotel",
        "locality": "Brigade Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Comfortable central business hotel near commercial shopping hubs.",
        "lat": 12.995303,
        "lng": 77.58377
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "bengaluru-rest-veg-1-mtr-mavalli-tiffin-room-",
          "name": "MTR (Mavalli Tiffin Room)",
          "locality": "Near Lalbagh",
          "type": "veg",
          "cuisine": "Authentic Karnataka Tiffin",
          "specialties": "Legendary Rava Idli and filter coffee since 1924",
          "lat": 12.967227,
          "lng": 77.59134
        },
        {
          "id": "bengaluru-rest-veg-2-vidyarthi-bhavan",
          "name": "Vidyarthi Bhavan",
          "locality": "Basavanagudi",
          "type": "veg",
          "cuisine": "South Indian Breakfast",
          "specialties": "Legendary crispy Masala Dosa",
          "lat": 12.966432,
          "lng": 77.588189
        }
      ],
      "nonVeg": [
        {
          "id": "bengaluru-rest-nonveg-1-empire-restaurant",
          "name": "Empire Restaurant",
          "locality": "Central Bangalore",
          "type": "non-veg",
          "cuisine": "Mughlai & Kerala Street Food",
          "specialties": "Famous pepper chicken and parottas",
          "lat": 12.969068,
          "lng": 77.580978
        },
        {
          "id": "bengaluru-rest-nonveg-2-karavalli",
          "name": "Karavalli",
          "locality": "The Gateway Hotel, Residency Road",
          "type": "non-veg",
          "cuisine": "Coastal Mangalorean & Goan",
          "specialties": "Coastal Mangalorean seafood and ghee roast",
          "lat": 12.972618,
          "lng": 77.577992
        }
      ]
    },
    "attractions": [
      {
        "id": "bengaluru-att-1-bangalore-palace",
        "name": "Bangalore Palace",
        "category": "Palaces & Forts",
        "description": "19th-century royal residence modeled after Windsor Castle.",
        "isHiddenGem": false,
        "lat": 12.96934,
        "lng": 77.572534
      },
      {
        "id": "bengaluru-att-2-lalbagh-botanical-garden",
        "name": "Lalbagh Botanical Garden",
        "category": "Gardens & Nature",
        "description": "240-acre garden housing a massive glasshouse and historic rock formation.",
        "isHiddenGem": false,
        "lat": 12.974425,
        "lng": 77.567017
      },
      {
        "id": "bengaluru-att-3-vidhana-soudha",
        "name": "Vidhana Soudha",
        "category": "Monuments",
        "description": "Largest state legislative building in neo-Dravidian architecture.",
        "isHiddenGem": false,
        "lat": 12.981622,
        "lng": 77.562947
      },
      {
        "id": "bengaluru-att-4-tipu-sultan-s-summer-palace",
        "name": "Tipu Sultan's Summer Palace",
        "category": "Historical Architecture",
        "description": "18th-century teakwood palace showcasing Indo-Islamic arches.",
        "isHiddenGem": true,
        "lat": 12.977005,
        "lng": 77.584992
      },
      {
        "id": "bengaluru-att-5-dodda-basavana-gudi-bull-temple-",
        "name": "Dodda Basavana Gudi (Bull Temple)",
        "category": "Spiritual",
        "description": "16th-century temple housing a colossal monolithic granite Nandi.",
        "isHiddenGem": true,
        "lat": 12.982451,
        "lng": 77.582233
      }
    ]
  },
  {
    "id": "delhi",
    "code": "IN-DEL-NCR-ULTIMATE",
    "name": "Delhi NCR",
    "state": "Delhi",
    "zone": "North",
    "lat": 28.6139,
    "lng": 77.209,
    "flashcardBlurb": "India's historic capital territory, blending magnificent Mughal monuments, British colonial architecture, vibrant street food, and modern metropolis energy.",
    "hotels": [
      {
        "id": "delhi-hotel-1-the-leela-palace-new-delhi",
        "name": "The Leela Palace New Delhi",
        "locality": "Chanakyapuri",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Ultra-luxury neo-classical palace hotel in the diplomatic enclave.",
        "lat": 28.622549,
        "lng": 77.209
      },
      {
        "id": "delhi-hotel-2-the-taj-mahal-hotel",
        "name": "The Taj Mahal Hotel",
        "locality": "Man Singh Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Iconic luxury landmark in the diplomatic enclave.",
        "lat": 28.625751,
        "lng": 77.215011
      },
      {
        "id": "delhi-hotel-3-the-oberoi-new-delhi",
        "name": "The Oberoi, New Delhi",
        "locality": "Dr. Zakir Hussain Marg",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Sophisticated luxury hotel offering views over Humayun’s Tomb and Delhi Golf Club.",
        "lat": 28.625474,
        "lng": 77.223643
      },
      {
        "id": "delhi-hotel-4-itc-maurya-new-delhi",
        "name": "ITC Maurya, New Delhi",
        "locality": "Sardar Patel Marg",
        "tier": "luxury",
        "stars": 5,
        "description": "Famed for housing the world-renowned Bukhara restaurant.",
        "lat": 28.620581,
        "lng": 77.232424
      },
      {
        "id": "delhi-hotel-5-the-imperial-new-delhi",
        "name": "The Imperial, New Delhi",
        "locality": "Janpath, Connaught Place",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Legendary 1930s colonial art deco luxury hotel near Connaught Place.",
        "lat": 28.611188,
        "lng": 77.238394
      },
      {
        "id": "delhi-hotel-6-shangri-la-eros-new-delhi",
        "name": "Shangri-La Eros New Delhi",
        "locality": "Ashoka Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Five-star central luxury with award-winning dining.",
        "lat": 28.609576,
        "lng": 77.217532
      },
      {
        "id": "delhi-hotel-7-hyatt-regency-delhi",
        "name": "Hyatt Regency Delhi",
        "locality": "Bhikaji Cama Place",
        "tier": "luxury",
        "stars": 5,
        "description": "Established upscale business and leisure hotel in Bhikaji Cama Place.",
        "lat": 28.603405,
        "lng": 77.217686
      },
      {
        "id": "delhi-hotel-8-jw-marriott-hotel-new-delhi-aerocity",
        "name": "JW Marriott Hotel New Delhi Aerocity",
        "locality": "Aerocity",
        "tier": "luxury",
        "stars": 5,
        "description": "Premier luxury transit hotel near IGI Airport.",
        "lat": 28.596981,
        "lng": 77.213097
      },
      {
        "id": "delhi-hotel-9-roseate-house-new-delhi",
        "name": "Roseate House New Delhi",
        "locality": "Aerocity",
        "tier": "boutique",
        "stars": 5,
        "description": "Contemporary upscale boutique hotel in Aerocity.",
        "lat": 28.592751,
        "lng": 77.203879
      },
      {
        "id": "delhi-hotel-10-radisson-blu-plaza-delhi-airport",
        "name": "Radisson Blu Plaza Delhi Airport",
        "locality": "Mahipalpur",
        "tier": "luxury",
        "stars": 5,
        "description": "Iconic garden-style luxury hotel near the airport.",
        "lat": 28.592909,
        "lng": 77.191628
      },
      {
        "id": "delhi-hotel-11-the-claridges-new-delhi",
        "name": "The Claridges, New Delhi",
        "locality": "Aurangzeb Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Boutique heritage luxury hotel established in the 1950s.",
        "lat": 28.609576,
        "lng": 77.200468
      },
      {
        "id": "delhi-hotel-12-haveli-dharampura",
        "name": "Haveli Dharampura",
        "locality": "Old Delhi, Chandni Chowk",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Restored 19th-century Mughal heritage hotel in the heart of Chandni Chowk.",
        "lat": 28.612544,
        "lng": 77.194303
      },
      {
        "id": "delhi-hotel-13-taj-city-centre-gurugram",
        "name": "Taj City Centre Gurugram",
        "locality": "Sector 44, Gurugram",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern luxury business hotel in the heart of Cyber City.",
        "lat": 28.619245,
        "lng": 77.190261
      },
      {
        "id": "delhi-hotel-14-the-oberoi-gurgaon",
        "name": "The Oberoi, Gurgaon",
        "locality": "Udyog Vihar, Gurugram",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Minimalist glass-and-water luxury architectural masterpiece.",
        "lat": 28.628368,
        "lng": 77.190697
      },
      {
        "id": "delhi-hotel-15-le-meridien-new-delhi",
        "name": "Le Meridien New Delhi",
        "locality": "Windsor Place",
        "tier": "luxury",
        "stars": 5,
        "description": "Iconic cylindrical luxury hotel near government hubs.",
        "lat": 28.637603,
        "lng": 77.196979
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "delhi-rest-veg-1-saravana-bhavan",
          "name": "Saravana Bhavan",
          "locality": "Connaught Place",
          "type": "veg",
          "cuisine": "South Indian",
          "specialties": "Authentic South Indian tiffin",
          "lat": 28.609527,
          "lng": 77.205381
        },
        {
          "id": "delhi-rest-veg-2-haldiram-s-bikanerwala",
          "name": "Haldiram's / Bikanerwala",
          "locality": "Connaught Place & Old Delhi",
          "type": "veg",
          "cuisine": "North Indian & Chaat",
          "specialties": "Iconic chaat, chhole bhature, and traditional sweets",
          "lat": 28.608732,
          "lng": 77.201883
        },
        {
          "id": "delhi-rest-veg-3-sita-ram-diwan-chand",
          "name": "Sita Ram Diwan Chand",
          "locality": "Paharganj",
          "type": "veg",
          "cuisine": "North Indian Street Food",
          "specialties": "Legendary Chhole Bhature",
          "lat": 28.609297,
          "lng": 77.197857
        }
      ],
      "nonVeg": [
        {
          "id": "delhi-rest-nonveg-1-bukhara",
          "name": "Bukhara",
          "locality": "ITC Maurya, Chanakyapuri",
          "type": "non-veg",
          "cuisine": "North-West Frontier",
          "specialties": "Legendary tandoori kebabs and Dal Bukhara",
          "lat": 28.611368,
          "lng": 77.193879
        },
        {
          "id": "delhi-rest-nonveg-2-karim-s",
          "name": "Karim's",
          "locality": "Jama Masjid, Old Delhi",
          "type": "non-veg",
          "cuisine": "Mughlai",
          "specialties": "Historic 100-year-old Mughlai mutton curries and biryani",
          "lat": 28.614918,
          "lng": 77.190564
        },
        {
          "id": "delhi-rest-nonveg-3-al-jawahar",
          "name": "Al-Jawahar",
          "locality": "Jama Masjid, Old Delhi",
          "type": "non-veg",
          "cuisine": "Mughlai & Awadhi",
          "specialties": "Famous for Nihari, seekh kebabs, and chicken changezi",
          "lat": 28.61557,
          "lng": 77.203144
        }
      ]
    },
    "attractions": [
      {
        "id": "delhi-att-1-qutub-minar-red-fort",
        "name": "Qutub Minar & Red Fort",
        "category": "UNESCO Heritage",
        "description": "UNESCO World Heritage Mughal and Sultanate monuments.",
        "isHiddenGem": false,
        "lat": 28.61164,
        "lng": 77.184505
      },
      {
        "id": "delhi-att-2-india-gate-rashtrapati-bhavan",
        "name": "India Gate & Rashtrapati Bhavan",
        "category": "Monuments",
        "description": "Iconic national war memorial and presidential avenue.",
        "isHiddenGem": false,
        "lat": 28.616725,
        "lng": 77.178381
      },
      {
        "id": "delhi-att-3-humayun-s-tomb",
        "name": "Humayun's Tomb",
        "category": "UNESCO Heritage",
        "description": "Stunning 16th-century garden mausoleum inspiring the Taj Mahal.",
        "isHiddenGem": false,
        "lat": 28.623922,
        "lng": 77.173864
      },
      {
        "id": "delhi-att-4-agrasen-ki-baoli",
        "name": "Agrasen ki Baoli",
        "category": "Stepwell",
        "description": "Ancient 60-meter-long historic stepwell hidden amidst skyscrapers.",
        "isHiddenGem": true,
        "lat": 28.619305,
        "lng": 77.198335
      },
      {
        "id": "delhi-att-5-nizamuddin-dargah",
        "name": "Nizamuddin Dargah",
        "category": "Sufi Heritage",
        "description": "Historic Sufi shrine renowned for live Qawwali evenings.",
        "isHiddenGem": true,
        "lat": 28.624751,
        "lng": 77.195272
      }
    ]
  },
  {
    "id": "kolkata",
    "code": "IN-WB-KOL-ULTIMATE",
    "name": "Kolkata",
    "state": "West Bengal",
    "zone": "East",
    "lat": 22.5726,
    "lng": 88.3639,
    "flashcardBlurb": "India's cultural capital and City of Joy, celebrated for its colonial Victorian architecture, art galleries, literature, yellow trams, and legendary sweets.",
    "hotels": [
      {
        "id": "kolkata-hotel-1-the-oberoi-grand",
        "name": "The Oberoi Grand",
        "locality": "Esplanade",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "The \"Grand Dame of Chowringhee\" offering timeless colonial luxury.",
        "lat": 22.581249,
        "lng": 88.3639
      },
      {
        "id": "kolkata-hotel-2-taj-bengal",
        "name": "Taj Bengal",
        "locality": "Alipore",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium luxury hotel surrounded by lush greenery and art collections.",
        "lat": 22.584451,
        "lng": 88.369614
      },
      {
        "id": "kolkata-hotel-3-itc-sonar-kolkata",
        "name": "ITC Sonar, Kolkata",
        "locality": "JBS Haldane Avenue",
        "tier": "luxury",
        "stars": 5,
        "description": "Luxury eco-resort featuring sprawling water bodies and fine dining.",
        "lat": 22.584174,
        "lng": 88.377821
      },
      {
        "id": "kolkata-hotel-4-jw-marriott-hotel-kolkata",
        "name": "JW Marriott Hotel Kolkata",
        "locality": "JBS Haldane Avenue",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary five-star luxury on JBS Haldane Avenue.",
        "lat": 22.579281,
        "lng": 88.386169
      },
      {
        "id": "kolkata-hotel-5-the-park-kolkata",
        "name": "The Park, Kolkata",
        "locality": "Park Street",
        "tier": "boutique",
        "stars": 5,
        "description": "India's first boutique luxury hotel known for vibrant nightlife.",
        "lat": 22.569888,
        "lng": 88.391845
      },
      {
        "id": "kolkata-hotel-6-swissotel-kolkata",
        "name": "Swissotel Kolkata",
        "locality": "City Centre New Town",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern upscale hotel connected to City Centre New Town.",
        "lat": 22.568276,
        "lng": 88.372011
      },
      {
        "id": "kolkata-hotel-7-novotel-kolkata-hotel-and-residences",
        "name": "Novotel Kolkata Hotel and Residences",
        "locality": "New Town",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling contemporary business and leisure hotel.",
        "lat": 22.562105,
        "lng": 88.372158
      },
      {
        "id": "kolkata-hotel-8-the-peerless-inn",
        "name": "The Peerless Inn",
        "locality": "New Market",
        "tier": "upscale",
        "stars": 4,
        "description": "Established heritage business hotel in central Kolkata.",
        "lat": 22.555681,
        "lng": 88.367795
      },
      {
        "id": "kolkata-hotel-9-hyatt-regency-kolkata",
        "name": "Hyatt Regency Kolkata",
        "locality": "Salt Lake Sector III",
        "tier": "luxury",
        "stars": 5,
        "description": "Five-star luxury hotel in Salt Lake Sector III.",
        "lat": 22.551451,
        "lng": 88.359032
      },
      {
        "id": "kolkata-hotel-10-the-lindsay",
        "name": "The Lindsay",
        "locality": "New Market",
        "tier": "comfort",
        "stars": 3,
        "description": "Classic central hotel offering comfortable transit and shopping access.",
        "lat": 22.551609,
        "lng": 88.347384
      },
      {
        "id": "kolkata-hotel-11-hotel-hindusthan-international-hhi-",
        "name": "Hotel Hindusthan International (HHI)",
        "locality": "AJC Bose Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Well-known business hotel on AJC Bose Road.",
        "lat": 22.568276,
        "lng": 88.355789
      },
      {
        "id": "kolkata-hotel-12-fairlawn-hotel",
        "name": "Fairlawn Hotel",
        "locality": "Park Street",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Historic 200-year-old British colonial heritage hotel.",
        "lat": 22.571244,
        "lng": 88.349928
      },
      {
        "id": "kolkata-hotel-13-lemon-tree-premier-kolkata",
        "name": "Lemon Tree Premier, Kolkata",
        "locality": "New Town",
        "tier": "upscale",
        "stars": 4,
        "description": "Upscale modern hotel near New Town business parks.",
        "lat": 22.577945,
        "lng": 88.346085
      },
      {
        "id": "kolkata-hotel-14-pride-plaza-hotel-kolkata",
        "name": "Pride Plaza Hotel, Kolkata",
        "locality": "Rajarhat",
        "tier": "upscale",
        "stars": 4,
        "description": "Eco-friendly five-star property in Rajarhat.",
        "lat": 22.587068,
        "lng": 88.346499
      },
      {
        "id": "kolkata-hotel-15-de-mandarin",
        "name": "De Mandarin",
        "locality": "Purna Das Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Elegant boutique hotel located in central Kolkata.",
        "lat": 22.596303,
        "lng": 88.352471
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "kolkata-rest-veg-1-flurys",
          "name": "Flurys",
          "locality": "Park Street",
          "type": "veg",
          "cuisine": "European Tearoom",
          "specialties": "Historic tearoom for breakfast, pastries, and hot chocolate",
          "lat": 22.568227,
          "lng": 88.360459
        },
        {
          "id": "kolkata-rest-veg-2-ganguram",
          "name": "Ganguram",
          "locality": "Bowbazar & Park Street",
          "type": "veg",
          "cuisine": "Bengali Sweets",
          "specialties": "Traditional Bengali sweets, mishti doi, and rasgulla",
          "lat": 22.567432,
          "lng": 88.357134
        }
      ],
      "nonVeg": [
        {
          "id": "kolkata-rest-nonveg-1-arsalan",
          "name": "Arsalan",
          "locality": "Park Circus",
          "type": "non-veg",
          "cuisine": "Kolkata Biryani",
          "specialties": "Legendary Kolkata Mutton Biryani with potato and boiled egg",
          "lat": 22.570068,
          "lng": 88.349525
        },
        {
          "id": "kolkata-rest-nonveg-2-peter-cat",
          "name": "Peter Cat",
          "locality": "Park Street",
          "type": "non-veg",
          "cuisine": "Continental & Indian",
          "specialties": "World-famous Chelo Kebabs",
          "lat": 22.573618,
          "lng": 88.346373
        },
        {
          "id": "kolkata-rest-nonveg-3-6-ballygunge-place",
          "name": "6 Ballygunge Place",
          "locality": "Ballygunge",
          "type": "non-veg",
          "cuisine": "Traditional Bengali",
          "specialties": "Authentic Bengali thalis and kosha mangsho",
          "lat": 22.57427,
          "lng": 88.358333
        }
      ]
    },
    "attractions": [
      {
        "id": "kolkata-att-1-victoria-memorial",
        "name": "Victoria Memorial",
        "category": "Museums & Monuments",
        "description": "Iconic 20th-century white marble monument and museum.",
        "isHiddenGem": false,
        "lat": 22.57034,
        "lng": 88.340613
      },
      {
        "id": "kolkata-att-2-howrah-bridge",
        "name": "Howrah Bridge",
        "category": "Landmarks",
        "description": "Massive balanced cantilever bridge spanning the Hooghly River.",
        "isHiddenGem": false,
        "lat": 22.575425,
        "lng": 88.334791
      },
      {
        "id": "kolkata-att-3-dakshineswar-kali-temple",
        "name": "Dakshineswar Kali Temple",
        "category": "Spiritual",
        "description": "19th-century riverbank temple associated with Ramakrishna.",
        "isHiddenGem": false,
        "lat": 22.582622,
        "lng": 88.330496
      },
      {
        "id": "kolkata-att-4-marble-palace",
        "name": "Marble Palace",
        "category": "Heritage Mansions",
        "description": "19th-century neoclassical mansion housing Victorian art and statues.",
        "isHiddenGem": true,
        "lat": 22.578005,
        "lng": 88.353761
      },
      {
        "id": "kolkata-att-5-kumartuli",
        "name": "Kumartuli",
        "category": "Artisan Quarters",
        "description": "Traditional potters' quarter where clay idols for Durga Puja are sculpted.",
        "isHiddenGem": true,
        "lat": 22.583451,
        "lng": 88.350849
      }
    ]
  },
  {
    "id": "chennai",
    "code": "IN-TN-CHE-ULTIMATE",
    "name": "Chennai",
    "state": "Tamil Nadu",
    "zone": "South",
    "lat": 13.0827,
    "lng": 80.2707,
    "flashcardBlurb": "The cultural capital of South India, set along the Coromandel Coast, famous for classical Carnatic music, Dravidian architecture, and long sandy beaches.",
    "hotels": [
      {
        "id": "chennai-hotel-1-the-leela-palace-chennai",
        "name": "The Leela Palace Chennai",
        "locality": "MRC Nagar",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Magnificent seafront luxury property with classical aesthetics.",
        "lat": 13.091349,
        "lng": 80.2707
      },
      {
        "id": "chennai-hotel-2-itc-grand-chola",
        "name": "ITC Grand Chola",
        "locality": "Guindy",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Colossal luxury hotel inspired by Chola dynasty architecture.",
        "lat": 13.094551,
        "lng": 80.276117
      },
      {
        "id": "chennai-hotel-3-taj-coromandel",
        "name": "Taj Coromandel",
        "locality": "Nungambakkam",
        "tier": "luxury",
        "stars": 5,
        "description": "Legendary luxury hotel hosting heads of state and celebrities.",
        "lat": 13.094274,
        "lng": 80.283897
      },
      {
        "id": "chennai-hotel-4-vivanta-chennai-it-expressway",
        "name": "Vivanta Chennai, IT Expressway",
        "locality": "Sholinganallur",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary upscale business hotel in Sholinganallur.",
        "lat": 13.089381,
        "lng": 80.291811
      },
      {
        "id": "chennai-hotel-5-the-oberoi-chennai",
        "name": "The Oberoi, Chennai",
        "locality": "Anna Salai",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "High-end luxury property in central commercial zones.",
        "lat": 13.079988,
        "lng": 80.297191
      },
      {
        "id": "chennai-hotel-6-hyatt-regency-chennai",
        "name": "Hyatt Regency Chennai",
        "locality": "Anna Salai",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium business hotel on Anna Salai with art galleries.",
        "lat": 13.078376,
        "lng": 80.27839
      },
      {
        "id": "chennai-hotel-7-taj-connemara",
        "name": "Taj Connemara",
        "locality": "Binny Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "South India's oldest heritage hotel, operating since 1854.",
        "lat": 13.072205,
        "lng": 80.278529
      },
      {
        "id": "chennai-hotel-8-radisson-blu-hotel-chennai-city-centre",
        "name": "Radisson Blu Hotel Chennai City Centre",
        "locality": "Egmore",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern upscale hotel close to Egmore and Marina Beach.",
        "lat": 13.065781,
        "lng": 80.274392
      },
      {
        "id": "chennai-hotel-9-the-residency-towers",
        "name": "The Residency Towers",
        "locality": "T. Nagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Central luxury hotel located in Chennai's premier shopping hub.",
        "lat": 13.061551,
        "lng": 80.266085
      },
      {
        "id": "chennai-hotel-10-feathers-a-radha-hotel",
        "name": "Feathers - A Radha Hotel",
        "locality": "Porur",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling modern luxury hotel near Porur.",
        "lat": 13.061709,
        "lng": 80.255043
      },
      {
        "id": "chennai-hotel-11-grt-grand",
        "name": "GRT Grand",
        "locality": "T. Nagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Well-established upscale hotel renowned for authentic South Indian restaurants.",
        "lat": 13.078376,
        "lng": 80.26301
      },
      {
        "id": "chennai-hotel-12-accord-metropolitan",
        "name": "Accord Metropolitan",
        "locality": "T. Nagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Central business luxury hotel.",
        "lat": 13.081344,
        "lng": 80.257454
      },
      {
        "id": "chennai-hotel-13-taj-fisherman-s-cove-resort-spa",
        "name": "Taj Fisherman's Cove Resort & Spa",
        "locality": "Covelong",
        "tier": "luxury",
        "stars": 5,
        "description": "Beachfront luxury resort set on a historic Dutch fort.",
        "lat": 13.088045,
        "lng": 80.253811
      },
      {
        "id": "chennai-hotel-14-novotel-chennai-chamiers-road",
        "name": "Novotel Chennai Chamiers Road",
        "locality": "Nandanam",
        "tier": "luxury",
        "stars": 5,
        "description": "Sleek urban design hotel in central Chennai.",
        "lat": 13.097168,
        "lng": 80.254204
      },
      {
        "id": "chennai-hotel-15-lemon-tree-hotel-chennai",
        "name": "Lemon Tree Hotel, Chennai",
        "locality": "Guindy",
        "tier": "upscale",
        "stars": 4,
        "description": "Comfortable mid-scale business hotel in Guindy.",
        "lat": 13.106403,
        "lng": 80.259866
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "chennai-rest-veg-1-ratna-cafe",
          "name": "Ratna Cafe",
          "locality": "Triplicane",
          "type": "veg",
          "cuisine": "South Indian Tiffin",
          "specialties": "Legendary Sambar Idli with unlimited sambar",
          "lat": 13.078327,
          "lng": 80.267438
        },
        {
          "id": "chennai-rest-veg-2-murugan-idli-shop",
          "name": "Murugan Idli Shop",
          "locality": "T. Nagar",
          "type": "veg",
          "cuisine": "Chettinad Tiffin",
          "specialties": "Iconic fluffy idlis with specialized chutneys",
          "lat": 13.077532,
          "lng": 80.264286
        }
      ],
      "nonVeg": [
        {
          "id": "chennai-rest-nonveg-1-buhari-hotel",
          "name": "Buhari Hotel",
          "locality": "Mount Road",
          "type": "non-veg",
          "cuisine": "Mughlai & South Indian",
          "specialties": "Reputed birthplace of Chicken 65 and Chennai biryani",
          "lat": 13.080168,
          "lng": 80.257072
        },
        {
          "id": "chennai-rest-nonveg-2-junior-kuppanna",
          "name": "Junior Kuppanna",
          "locality": "T. Nagar",
          "type": "non-veg",
          "cuisine": "Kongu-Style Tamil Non-Veg",
          "specialties": "Kongu-style non-veg meals and mutton chukka",
          "lat": 13.083718,
          "lng": 80.254085
        }
      ]
    },
    "attractions": [
      {
        "id": "chennai-att-1-marina-beach",
        "name": "Marina Beach",
        "category": "Coastal & Beaches",
        "description": "Country's longest natural urban coastal beach.",
        "isHiddenGem": false,
        "lat": 13.08044,
        "lng": 80.248624
      },
      {
        "id": "chennai-att-2-kapaleeshwarar-temple",
        "name": "Kapaleeshwarar Temple",
        "category": "Dravidian Architecture",
        "description": "7th-century classical Dravidian temple with a towering gopuram.",
        "isHiddenGem": false,
        "lat": 13.085525,
        "lng": 80.243105
      },
      {
        "id": "chennai-att-3-government-museum-egmore",
        "name": "Government Museum, Egmore",
        "category": "Museums",
        "description": "Exceptional collection of South Indian bronze sculptures.",
        "isHiddenGem": false,
        "lat": 13.092722,
        "lng": 80.239033
      },
      {
        "id": "chennai-att-4-dakshinachitra-heritage-museum",
        "name": "DakshinaChitra Heritage Museum",
        "category": "Living Heritage",
        "description": "Open-air cultural village preserving historic South Indian houses.",
        "isHiddenGem": true,
        "lat": 13.088105,
        "lng": 80.261088
      },
      {
        "id": "chennai-att-5-san-thome-basilica",
        "name": "San Thome Basilica",
        "category": "Heritage Cathedrals",
        "description": "Neo-Gothic cathedral built over the tomb of St. Thomas.",
        "isHiddenGem": true,
        "lat": 13.093551,
        "lng": 80.258328
      }
    ]
  },
  {
    "id": "hyderabad",
    "code": "IN-TG-HYD-ULTIMATE",
    "name": "Hyderabad",
    "state": "Telangana",
    "zone": "South",
    "lat": 17.385,
    "lng": 78.4867,
    "flashcardBlurb": "The historic \"City of Pearls\" and tech hub, blending grand Nizami architecture, monumental medieval fortresses, and world-famous Hyderabadi Dum Biryani.",
    "hotels": [
      {
        "id": "hyderabad-hotel-1-taj-falaknuma-palace",
        "name": "Taj Falaknuma Palace",
        "locality": "Engine Bowli, Falaknuma",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Opulent former Nizam palace perched high above the city.",
        "lat": 17.393649,
        "lng": 78.4867
      },
      {
        "id": "hyderabad-hotel-2-itc-kakatiya",
        "name": "ITC Kakatiya",
        "locality": "Begumpet",
        "tier": "luxury",
        "stars": 5,
        "description": "Luxury business hotel known for fine dining and authentic Hyderabadi cuisine.",
        "lat": 17.396851,
        "lng": 78.492229
      },
      {
        "id": "hyderabad-hotel-3-park-hyatt-hyderabad",
        "name": "Park Hyatt Hyderabad",
        "locality": "Banjara Hills",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Ultra-luxury hotel featuring striking architecture and art spaces.",
        "lat": 17.396574,
        "lng": 78.50017
      },
      {
        "id": "hyderabad-hotel-4-taj-krishna",
        "name": "Taj Krishna",
        "locality": "Banjara Hills",
        "tier": "luxury",
        "stars": 5,
        "description": "Established luxury hotel set amidst lush landscaped gardens.",
        "lat": 17.391681,
        "lng": 78.508248
      },
      {
        "id": "hyderabad-hotel-5-the-westin-hyderabad-mindspace",
        "name": "The Westin Hyderabad Mindspace",
        "locality": "HITEC City",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium business hotel in HITEC City.",
        "lat": 17.382288,
        "lng": 78.513739
      },
      {
        "id": "hyderabad-hotel-6-novotel-hyderabad-convention-centre",
        "name": "Novotel Hyderabad Convention Centre",
        "locality": "Hitec City",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling business hotel attached to HICC.",
        "lat": 17.380676,
        "lng": 78.494548
      },
      {
        "id": "hyderabad-hotel-7-trident-hyderabad",
        "name": "Trident, Hyderabad",
        "locality": "HITEC City",
        "tier": "luxury",
        "stars": 5,
        "description": "Sleek luxury hotel overlooking rock formations and tech parks.",
        "lat": 17.374505,
        "lng": 78.49469
      },
      {
        "id": "hyderabad-hotel-8-taj-banjara",
        "name": "Taj Banjara",
        "locality": "Banjara Hills",
        "tier": "luxury",
        "stars": 5,
        "description": "Lakeside luxury hotel set on the banks of Banjara Lake.",
        "lat": 17.368081,
        "lng": 78.490468
      },
      {
        "id": "hyderabad-hotel-9-lemon-tree-premier-hitech-city",
        "name": "Lemon Tree Premier, Hitech City",
        "locality": "Madhapur",
        "tier": "upscale",
        "stars": 4,
        "description": "Upscale modern hotel in the tech corridor.",
        "lat": 17.363851,
        "lng": 78.481989
      },
      {
        "id": "hyderabad-hotel-10-radisson-blu-plaza-hotel-hyderabad-banjara-hills",
        "name": "Radisson Blu Plaza Hotel Hyderabad Banjara Hills",
        "locality": "Banjara Hills",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary upscale property.",
        "lat": 17.364009,
        "lng": 78.470719
      },
      {
        "id": "hyderabad-hotel-11-marriott-executive-apartments-hyderabad",
        "name": "Marriott Executive Apartments Hyderabad",
        "locality": "Gachibowli",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium serviced luxury near Hussain Sagar Lake.",
        "lat": 17.380676,
        "lng": 78.478852
      },
      {
        "id": "hyderabad-hotel-12-hyderabad-marriott-hotel-convention-centre",
        "name": "Hyderabad Marriott Hotel & Convention Centre",
        "locality": "Tank Bund Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Lakefront luxury hotel with panoramic views.",
        "lat": 17.383644,
        "lng": 78.473181
      },
      {
        "id": "hyderabad-hotel-13-fidalgo-hyderabad",
        "name": "Fidalgo Hyderabad",
        "locality": "Banjara Hills",
        "tier": "comfort",
        "stars": 3,
        "description": "Comfortable central business hotel.",
        "lat": 17.390345,
        "lng": 78.469462
      },
      {
        "id": "hyderabad-hotel-14-avasa-hotel",
        "name": "Avasa Hotel",
        "locality": "HITEC City",
        "tier": "boutique",
        "stars": 5,
        "description": "Trendy design-focused upscale hotel in the tech district.",
        "lat": 17.399468,
        "lng": 78.469863
      },
      {
        "id": "hyderabad-hotel-15-the-golkonda-hotel",
        "name": "The Golkonda Hotel",
        "locality": "Masab Tank",
        "tier": "upscale",
        "stars": 4,
        "description": "Heritage-inspired business hotel close to historical monuments.",
        "lat": 17.408703,
        "lng": 78.475642
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "hyderabad-rest-veg-1-chutneys",
          "name": "Chutneys",
          "locality": "Banjara Hills",
          "type": "veg",
          "cuisine": "South Indian Tiffin",
          "specialties": "Famous for unique dosas and multi-variety chutneys",
          "lat": 17.380627,
          "lng": 78.483371
        },
        {
          "id": "hyderabad-rest-veg-2-minerva-coffee-shop",
          "name": "Minerva Coffee Shop",
          "locality": "Himayatnagar",
          "type": "veg",
          "cuisine": "South Indian Vegetarian",
          "specialties": "Classic South Indian filter coffee, idlis, and thalis",
          "lat": 17.379832,
          "lng": 78.480154
        }
      ],
      "nonVeg": [
        {
          "id": "hyderabad-rest-nonveg-1-paradise-circle",
          "name": "Paradise Circle",
          "locality": "Secunderabad",
          "type": "non-veg",
          "cuisine": "Hyderabadi Biryani",
          "specialties": "Legendary Hyderabadi Dum Biryani",
          "lat": 17.382468,
          "lng": 78.47279
        },
        {
          "id": "hyderabad-rest-nonveg-2-shadab-hotel",
          "name": "Shadab Hotel",
          "locality": "Near Charminar, Madina Circle",
          "type": "non-veg",
          "cuisine": "Nizami Non-Veg",
          "specialties": "Authentic Haleem, biryani, and paya",
          "lat": 17.386018,
          "lng": 78.469741
        }
      ]
    },
    "attractions": [
      {
        "id": "hyderabad-att-1-charminar",
        "name": "Charminar",
        "category": "Monuments",
        "description": "16th-century monument anchoring the historic old city bazaars.",
        "isHiddenGem": false,
        "lat": 17.38274,
        "lng": 78.464168
      },
      {
        "id": "hyderabad-att-2-golconda-fort",
        "name": "Golconda Fort",
        "category": "Palaces & Forts",
        "description": "13th-century fortress renowned for acoustic engineering and diamond history.",
        "isHiddenGem": false,
        "lat": 17.387825,
        "lng": 78.458534
      },
      {
        "id": "hyderabad-att-3-chowmahalla-palace",
        "name": "Chowmahalla Palace",
        "category": "Nizami Palaces",
        "description": "18th-century seat of the Asaf Jahi Nizams.",
        "isHiddenGem": false,
        "lat": 17.395022,
        "lng": 78.454378
      },
      {
        "id": "hyderabad-att-4-qutb-shahi-tombs",
        "name": "Qutb Shahi Tombs",
        "category": "Heritage Necropolis",
        "description": "Cluster of majestic domed granite mausoleums.",
        "isHiddenGem": true,
        "lat": 17.390405,
        "lng": 78.476889
      },
      {
        "id": "hyderabad-att-5-salar-jung-museum",
        "name": "Salar Jung Museum",
        "category": "Museums",
        "description": "One of the world's largest one-man art collections.",
        "isHiddenGem": true,
        "lat": 17.395851,
        "lng": 78.474072
      }
    ]
  },
  {
    "id": "ahmedabad",
    "code": "IN-GJ-AMD-FULL",
    "name": "Ahmedabad",
    "state": "Gujarat",
    "zone": "West",
    "lat": 23.0225,
    "lng": 72.5714,
    "flashcardBlurb": "India's first UNESCO World Heritage City, seamlessly balancing a rich Sultanate textile heritage with modern architectural masterworks and Mahatma Gandhi's freedom footprints.",
    "hotels": [
      {
        "id": "ahmedabad-hotel-1-the-house-of-mg",
        "name": "The House of MG",
        "locality": "Opposite Sidi Saiyyed Mosque, Lal Darwaja",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "1920s heritage boutique mansion featuring traditional Gujarati fine dining.",
        "lat": 23.031149,
        "lng": 72.5714
      },
      {
        "id": "ahmedabad-hotel-2-taj-skyline-ahmedabad",
        "name": "Taj Skyline Ahmedabad",
        "locality": "Sindhu Bhavan Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium luxury business hotel offering contemporary elegance.",
        "lat": 23.034351,
        "lng": 72.577133
      },
      {
        "id": "ahmedabad-hotel-3-hyatt-regency-ahmedabad",
        "name": "Hyatt Regency Ahmedabad",
        "locality": "Sabarmati Riverfront, Ashram Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale luxury hotel with direct views over the Sabarmati Riverfront.",
        "lat": 23.034074,
        "lng": 72.585367
      },
      {
        "id": "ahmedabad-hotel-4-courtyard-by-marriott-ahmedabad",
        "name": "Courtyard by Marriott Ahmedabad",
        "locality": "Ramdev Nagar, Satellite",
        "tier": "luxury",
        "stars": 5,
        "description": "Sophisticated business hotel in the commercial heart.",
        "lat": 23.029181,
        "lng": 72.593743
      },
      {
        "id": "ahmedabad-hotel-5-novotel-ahmedabad",
        "name": "Novotel Ahmedabad",
        "locality": "SG Highway",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling contemporary hotel with multiple dining options and outdoor pool.",
        "lat": 23.019788,
        "lng": 72.599437
      },
      {
        "id": "ahmedabad-hotel-6-radisson-blu-ahmedabad",
        "name": "Radisson Blu Ahmedabad",
        "locality": "Near Panchvati Cross Roads, Ambawadi",
        "tier": "luxury",
        "stars": 5,
        "description": "Established upscale hotel renowned for hospitality and fine dining.",
        "lat": 23.018176,
        "lng": 72.579538
      },
      {
        "id": "ahmedabad-hotel-7-hyatt-ahmedabad",
        "name": "Hyatt Ahmedabad",
        "locality": "Near Vastrapur Lake",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern luxury hotel overlooking Vastrapur Lake.",
        "lat": 23.012005,
        "lng": 72.579685
      },
      {
        "id": "ahmedabad-hotel-8-lemon-tree-premier-the-atrium",
        "name": "Lemon Tree Premier, The Atrium",
        "locality": "Khanpur",
        "tier": "upscale",
        "stars": 4,
        "description": "Central business hotel with open-to-sky atrium architecture.",
        "lat": 23.005581,
        "lng": 72.575308
      },
      {
        "id": "ahmedabad-hotel-9-four-points-by-sheraton-ahmedabad",
        "name": "Four Points by Sheraton Ahmedabad",
        "locality": "Ellisbridge",
        "tier": "upscale",
        "stars": 4,
        "description": "Reliable international comfort close to historical city centers.",
        "lat": 23.001351,
        "lng": 72.566516
      },
      {
        "id": "ahmedabad-hotel-10-cama-hotel",
        "name": "Cama Hotel",
        "locality": "Khanpur",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Historic heritage hotel overlooking the Sabarmati River since the 1950s.",
        "lat": 23.001509,
        "lng": 72.55483
      },
      {
        "id": "ahmedabad-hotel-11-fairfield-by-marriott-ahmedabad",
        "name": "Fairfield by Marriott Ahmedabad",
        "locality": "Ashram Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Clean, efficient business transit accommodation.",
        "lat": 23.018176,
        "lng": 72.563262
      },
      {
        "id": "ahmedabad-hotel-12-pride-plaza-hotel-ahmedabad",
        "name": "Pride Plaza Hotel Ahmedabad",
        "locality": "SG Highway, Bodakdev",
        "tier": "upscale",
        "stars": 4,
        "description": "Eco-friendly luxury hotel with grand convention facilities.",
        "lat": 23.021144,
        "lng": 72.557382
      },
      {
        "id": "ahmedabad-hotel-13-aloft-ahmedabad-sg-highway",
        "name": "Aloft Ahmedabad SG Highway",
        "locality": "SG Highway, Sola",
        "tier": "boutique",
        "stars": 4,
        "description": "Trendy, design-focused hotel popular with younger business travelers.",
        "lat": 23.027845,
        "lng": 72.553526
      },
      {
        "id": "ahmedabad-hotel-14-ummed-ahmedabad-airport-hotel",
        "name": "Ummed Ahmedabad Airport Hotel",
        "locality": "International Airport Circle",
        "tier": "luxury",
        "stars": 5,
        "description": "Resort-style luxury property located minutes from Sardar Vallabhbhai Patel Airport.",
        "lat": 23.036968,
        "lng": 72.553941
      },
      {
        "id": "ahmedabad-hotel-15-regenta-hotel-ahmedabad",
        "name": "Regenta Hotel Ahmedabad",
        "locality": "Mirzapur",
        "tier": "comfort",
        "stars": 3,
        "description": "Central business stay offering comfortable amenities and dining.",
        "lat": 23.046203,
        "lng": 72.559934
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "ahmedabad-rest-veg-1-agashiye",
          "name": "Agashiye",
          "locality": "The House of MG, Lal Darwaja",
          "type": "veg",
          "cuisine": "Authentic Gujarati Thali",
          "specialties": "Iconic rooftop traditional Gujarati thali served in silverware",
          "lat": 23.018127,
          "lng": 72.567948
        },
        {
          "id": "ahmedabad-rest-veg-2-manek-chowk",
          "name": "Manek Chowk",
          "locality": "Old City",
          "type": "veg",
          "cuisine": "Late-Night Street Food",
          "specialties": "Late-night street food market famous for Ganthiya and pav bhaji",
          "lat": 23.017332,
          "lng": 72.564612
        }
      ],
      "nonVeg": [
        {
          "id": "ahmedabad-rest-nonveg-1-bhatiyar-gali",
          "name": "Bhatiyar Gali",
          "locality": "Near Three Gates, Old City",
          "type": "non-veg",
          "cuisine": "Mughlai & Bohra",
          "specialties": "Historic alley serving authentic Mughlai kebabs, biryani, and mutton curries",
          "lat": 23.019968,
          "lng": 72.556977
        }
      ]
    },
    "attractions": [
      {
        "id": "ahmedabad-att-1-sabarmati-ashram",
        "name": "Sabarmati Ashram",
        "category": "National Heritage",
        "description": "Gandhi's peaceful riverside headquarters from where he led the Dandi March.",
        "isHiddenGem": false,
        "lat": 23.02024,
        "lng": 72.548036
      },
      {
        "id": "ahmedabad-att-2-sabarmati-riverfront",
        "name": "Sabarmati Riverfront",
        "category": "Urban Promenade",
        "description": "Multi-level pedestrian promenade along the Sabarmati River.",
        "isHiddenGem": false,
        "lat": 23.025325,
        "lng": 72.542195
      },
      {
        "id": "ahmedabad-att-3-adalaj-stepwell",
        "name": "Adalaj Stepwell",
        "category": "Stepwell",
        "description": "15th-century five-story subterranean architectural stepwell.",
        "isHiddenGem": false,
        "lat": 23.032522,
        "lng": 72.537886
      },
      {
        "id": "ahmedabad-att-4-calico-museum-of-textiles",
        "name": "Calico Museum of Textiles",
        "category": "Specialized Museums",
        "description": "Premier textile museum showcasing antique fabrics and royal court costumes.",
        "isHiddenGem": true,
        "lat": 23.027905,
        "lng": 72.561227
      },
      {
        "id": "ahmedabad-att-5-sarkhej-roza",
        "name": "Sarkhej Roza",
        "category": "Sufi Heritage",
        "description": "Elegant 15th-century Sufi mosque and royal tomb complex surrounding an artificial lake.",
        "isHiddenGem": true,
        "lat": 23.033351,
        "lng": 72.558306
      }
    ]
  },
  {
    "id": "pune",
    "code": "IN-MH-PUN-FULL",
    "name": "Pune",
    "state": "Maharashtra",
    "zone": "West",
    "lat": 18.5204,
    "lng": 73.8567,
    "flashcardBlurb": "Maharashtra's cultural and intellectual capital, blending Maratha imperial history, 8th-century rock-cut architecture, vibrant student districts, and serene hill sanctuaries.",
    "hotels": [
      {
        "id": "pune-hotel-1-jw-marriott-pune",
        "name": "JW Marriott Pune",
        "locality": "Senapati Bapat Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Landmark luxury hotel with award-winning dining and rooftop lounge.",
        "lat": 18.529049,
        "lng": 73.8567
      },
      {
        "id": "pune-hotel-2-conrad-pune",
        "name": "Conrad Pune",
        "locality": "Mangaldas Road, Bund Garden",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Striking art deco luxury hotel featuring sophisticated rooms and fine dining.",
        "lat": 18.532251,
        "lng": 73.862265
      },
      {
        "id": "pune-hotel-3-the-ritz-carlton-pune",
        "name": "The Ritz-Carlton, Pune",
        "locality": "Golf Course Road, Airport Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Ultra-luxury hotel overlooking the Poona Club Golf Course.",
        "lat": 18.531974,
        "lng": 73.870256
      },
      {
        "id": "pune-hotel-4-the-corinthians-resort-club",
        "name": "The Corinthians Resort & Club",
        "locality": "Nyati County, Undri",
        "tier": "luxury",
        "stars": 5,
        "description": "Mediterranean-style resort set amidst lush lawns and microbreweries.",
        "lat": 18.527081,
        "lng": 73.878387
      },
      {
        "id": "pune-hotel-5-hyatt-regency-pune",
        "name": "Hyatt Regency Pune",
        "locality": "Kalyani Nagar / Viman Nagar",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale urban stay located near Pune's premier dining and entertainment district.",
        "lat": 18.517688,
        "lng": 73.883913
      },
      {
        "id": "pune-hotel-6-sheraton-grand-pune-bund-garden-hotel",
        "name": "Sheraton Grand Pune Bund Garden Hotel",
        "locality": "RBM Road, Sangamvadi",
        "tier": "luxury",
        "stars": 5,
        "description": "Established landmark luxury hotel in central Pune.",
        "lat": 18.516076,
        "lng": 73.864599
      },
      {
        "id": "pune-hotel-7-novotel-pune-nagar-road",
        "name": "Novotel Pune Nagar Road",
        "locality": "Viman Nagar",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern business hotel with vibrant co-working spaces and restaurants.",
        "lat": 18.509905,
        "lng": 73.864742
      },
      {
        "id": "pune-hotel-8-the-pride-hotel-pune",
        "name": "The Pride Hotel, Pune",
        "locality": "Shivajinagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Central business hotel with spacious rooms and reliable dining.",
        "lat": 18.503481,
        "lng": 73.860493
      },
      {
        "id": "pune-hotel-9-hotel-deccan-rendezvous",
        "name": "Hotel Deccan Rendezvous",
        "locality": "Deccan Gymkhana",
        "tier": "boutique",
        "stars": 4,
        "description": "Classic city hotel close to historic student and cultural hubs.",
        "lat": 18.499251,
        "lng": 73.851959
      },
      {
        "id": "pune-hotel-10-sentosa-resorts-water-park",
        "name": "Sentosa Resorts & Water Park",
        "locality": "Ravet, Expressway",
        "tier": "comfort",
        "stars": 3,
        "description": "Family-friendly leisure resort located on the Mumbai-Pune highway.",
        "lat": 18.499409,
        "lng": 73.840616
      },
      {
        "id": "pune-hotel-11-vivanta-pune-hinjawadi",
        "name": "Vivanta Pune, Hinjawadi",
        "locality": "Hinjawadi Tech Zone",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale tech-corridor hotel offering contemporary comfort.",
        "lat": 18.516076,
        "lng": 73.848801
      },
      {
        "id": "pune-hotel-12-lemon-tree-premier-pune-city-center",
        "name": "Lemon Tree Premier, Pune City Center",
        "locality": "Connaught Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Vibrant business hotel in central Pune.",
        "lat": 18.519044,
        "lng": 73.843093
      },
      {
        "id": "pune-hotel-13-oxford-golf-resort",
        "name": "Oxford Golf Resort",
        "locality": "Bavdhan",
        "tier": "luxury",
        "stars": 5,
        "description": "Scenic hillside golf resort with panoramic views over Sahyadri valleys.",
        "lat": 18.525745,
        "lng": 73.839351
      },
      {
        "id": "pune-hotel-14-royal-orchid-central-pune",
        "name": "Royal Orchid Central, Pune",
        "locality": "Kalyani Nagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Boutique business hotel close to commercial hubs.",
        "lat": 18.534868,
        "lng": 73.839754
      },
      {
        "id": "pune-hotel-15-radisson-blu-hotel-pune-hinjawadi",
        "name": "Radisson Blu Hotel Pune Hinjawadi",
        "locality": "Hinjawadi",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern upscale stay tailored for corporate travelers.",
        "lat": 18.544103,
        "lng": 73.84557
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "pune-rest-veg-1-vaishali",
          "name": "Vaishali",
          "locality": "FC Road",
          "type": "veg",
          "cuisine": "South Indian & Maharashtrian",
          "specialties": "Iconic student hangout for SPDP (Sev Potato Dahi Puri) and South Indian tiffin",
          "lat": 18.516027,
          "lng": 73.853349
        },
        {
          "id": "pune-rest-veg-2-sujata-mastani",
          "name": "Sujata Mastani",
          "locality": "Sadashiv Peth & FC Road",
          "type": "veg",
          "cuisine": "Dessert Drink",
          "specialties": "Thick fruit milkshakes with ice cream (Mastani)",
          "lat": 18.515232,
          "lng": 73.850111
        }
      ],
      "nonVeg": [
        {
          "id": "pune-rest-nonveg-1-hotel-shreyas-surve-s",
          "name": "Hotel Shreyas / Surve's",
          "locality": "Deccan Gymkhana & FC Road",
          "type": "non-veg",
          "cuisine": "Maharashtrian Non-Veg",
          "specialties": "Traditional Maharashtrian mutton thalis and Sukka mutton",
          "lat": 18.517868,
          "lng": 73.842701
        },
        {
          "id": "pune-rest-nonveg-2-marz-o-dan",
          "name": "Marz-O-Dan",
          "locality": "MG Road, Camp",
          "type": "non-veg",
          "cuisine": "Parsi Cafe Snacks",
          "specialties": "Legendary Parsi cafe chicken mayo rolls and cold coffee",
          "lat": 18.521418,
          "lng": 73.839632
        }
      ]
    },
    "attractions": [
      {
        "id": "pune-att-1-shaniwar-wada",
        "name": "Shaniwar Wada",
        "category": "Palaces & Forts",
        "description": "18th-century historical fortification and seat of the Peshwa rulers.",
        "isHiddenGem": false,
        "lat": 18.51814,
        "lng": 73.834022
      },
      {
        "id": "pune-att-2-aga-khan-palace",
        "name": "Aga Khan Palace",
        "category": "National Heritage",
        "description": "Monument holding profound national importance in India's freedom struggle.",
        "isHiddenGem": false,
        "lat": 18.523225,
        "lng": 73.828353
      },
      {
        "id": "pune-att-3-sinhagad-fort",
        "name": "Sinhagad Fort",
        "category": "Hill Forts",
        "description": "Historic hilltop fortress perched on the Sahyadri edge.",
        "isHiddenGem": false,
        "lat": 18.530422,
        "lng": 73.82417
      },
      {
        "id": "pune-att-4-zapurza-museum-of-art-culture",
        "name": "Zapurza Museum of Art & Culture",
        "category": "Living Arts",
        "description": "Sprawling lakeside museum campus showcasing traditional Indian decorative arts.",
        "isHiddenGem": true,
        "lat": 18.525805,
        "lng": 73.846826
      },
      {
        "id": "pune-att-5-taljai-hills-woods",
        "name": "Taljai Hills & Woods",
        "category": "Nature Reserves",
        "description": "Protected forest hill within city limits offering walking trails and deer sightings.",
        "isHiddenGem": true,
        "lat": 18.531251,
        "lng": 73.843991
      }
    ]
  },
  {
    "id": "surat",
    "code": "IN-GJ-ST-FULL",
    "name": "Surat",
    "state": "Gujarat",
    "zone": "West",
    "lat": 21.1702,
    "lng": 72.8311,
    "flashcardBlurb": "India's thriving textile and diamond capital along the Tapti River, renowned for its rich maritime history, architectural landmarks, and legendary street food culture.",
    "hotels": [
      {
        "id": "surat-hotel-1-surat-marriott-hotel",
        "name": "Surat Marriott Hotel",
        "locality": "Athwalines",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Waterfront luxury hotel overlooking the Tapti River with premium dining.",
        "lat": 21.178849,
        "lng": 72.8311
      },
      {
        "id": "surat-hotel-2-courtyard-by-marriott-surat",
        "name": "Courtyard by Marriott Surat",
        "locality": "Hazira Road, Vesu",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale modern business hotel in Surat's growing commercial district.",
        "lat": 21.182051,
        "lng": 72.836758
      },
      {
        "id": "surat-hotel-3-vivanta-surat",
        "name": "Vivanta Surat",
        "locality": "Athwa Gate",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium luxury hospitality by IHCL featuring modern design and fine dining.",
        "lat": 21.181774,
        "lng": 72.844885
      },
      {
        "id": "surat-hotel-4-lords-plaza-surat",
        "name": "Lords Plaza Surat",
        "locality": "Ring Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Established central business hotel close to textile and diamond markets.",
        "lat": 21.176881,
        "lng": 72.853152
      },
      {
        "id": "surat-hotel-5-hotel-orange-international",
        "name": "Hotel Orange International",
        "locality": "Railway Station",
        "tier": "comfort",
        "stars": 3,
        "description": "Convenient transit hotel offering reliable hospitality.",
        "lat": 21.167488,
        "lng": 72.858771
      },
      {
        "id": "surat-hotel-6-best-western-plus-surat",
        "name": "Best Western Plus Surat",
        "locality": "Bhatar",
        "tier": "upscale",
        "stars": 4,
        "description": "Modern mid-scale comfort tailored for business and leisure guests.",
        "lat": 21.165876,
        "lng": 72.839132
      },
      {
        "id": "surat-hotel-7-hotel-tex-palazzo",
        "name": "Hotel Tex Palazzo",
        "locality": "Ring Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Specialized business stay situated in the textile hub.",
        "lat": 21.159705,
        "lng": 72.839277
      },
      {
        "id": "surat-hotel-8-hotel-ramee-international-surat",
        "name": "Hotel Ramee International Surat",
        "locality": "Majura Gate",
        "tier": "comfort",
        "stars": 3,
        "description": "Central dining and stay option with banquet facilities.",
        "lat": 21.153281,
        "lng": 72.834957
      },
      {
        "id": "surat-hotel-9-ginger-surat",
        "name": "Ginger Surat",
        "locality": "Athwalines",
        "tier": "comfort",
        "stars": 3,
        "description": "Smart lean-luxe hotel offering efficient, clean, and modern accommodations.",
        "lat": 21.149051,
        "lng": 72.826279
      },
      {
        "id": "surat-hotel-10-hotel-emperor-surat",
        "name": "Hotel Emperor Surat",
        "locality": "Ring Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Contemporary city hotel with well-appointed rooms.",
        "lat": 21.149209,
        "lng": 72.814746
      },
      {
        "id": "surat-hotel-11-lalji-tourist-resort-surat",
        "name": "Lalji Tourist Resort Surat",
        "locality": "Dumas Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Leisure-oriented property with garden spaces.",
        "lat": 21.165876,
        "lng": 72.823068
      },
      {
        "id": "surat-hotel-12-the-grand-bhagwati-surat",
        "name": "The Grand Bhagwati Surat",
        "locality": "Magdalla, Dumas Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling luxury hospitality and convention hub.",
        "lat": 21.168844,
        "lng": 72.817264
      },
      {
        "id": "surat-hotel-13-hotel-sidharth-surat",
        "name": "Hotel Sidharth Surat",
        "locality": "Station Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Central business stay close to commercial markets.",
        "lat": 21.175545,
        "lng": 72.813459
      },
      {
        "id": "surat-hotel-14-hotel-apex-international",
        "name": "Hotel Apex International",
        "locality": "Station Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Convenient transit option near city transport hubs.",
        "lat": 21.184668,
        "lng": 72.813869
      },
      {
        "id": "surat-hotel-15-hotel-amrit-boulevard",
        "name": "Hotel Amrit Boulevard",
        "locality": "City Light Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Modern city stay offering comfortable transit amenities.",
        "lat": 21.193903,
        "lng": 72.819783
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "surat-rest-veg-1-kansar-gujarati-thali",
          "name": "Kansar Gujarati Thali",
          "locality": "Ring Road",
          "type": "veg",
          "cuisine": "Gujarati Thali",
          "specialties": "Traditional unlimited Gujarati thali",
          "lat": 21.165827,
          "lng": 72.827693
        },
        {
          "id": "surat-rest-veg-2-jamnadas-khaman-house",
          "name": "Jamnadas Khaman House",
          "locality": "Chauta Bazar",
          "type": "veg",
          "cuisine": "Surti Farsan",
          "specialties": "Famous Surti Khaman and Locho",
          "lat": 21.165032,
          "lng": 72.8244
        }
      ],
      "nonVeg": [
        {
          "id": "surat-rest-nonveg-1-nanawala-stalls",
          "name": "Nanawala Stalls",
          "locality": "Zampa Bazaar",
          "type": "non-veg",
          "cuisine": "Street Food & Egg Delicacies",
          "specialties": "Surti Locho and creative egg specialties",
          "lat": 21.167668,
          "lng": 72.816865
        },
        {
          "id": "surat-rest-nonveg-2-sheetal-restaurant",
          "name": "Sheetal Restaurant",
          "locality": "Ring Road",
          "type": "non-veg",
          "cuisine": "Mughlai & Seafood",
          "specialties": "Rich Mughlai gravies and coastal fish curries",
          "lat": 21.171218,
          "lng": 72.813744
        }
      ]
    },
    "attractions": [
      {
        "id": "surat-att-1-dumas-beach",
        "name": "Dumas Beach",
        "category": "Coastal & Beaches",
        "description": "Volcanic black sand beach along the Arabian Sea.",
        "isHiddenGem": false,
        "lat": 21.16794,
        "lng": 72.808041
      },
      {
        "id": "surat-att-2-surat-castle-old-fort-",
        "name": "Surat Castle (Old Fort)",
        "category": "Palaces & Forts",
        "description": "16th-century fortification built along the Tapti River.",
        "isHiddenGem": false,
        "lat": 21.173025,
        "lng": 72.802276
      },
      {
        "id": "surat-att-3-sarthana-nature-park",
        "name": "Sarthana Nature Park",
        "category": "Nature & Wildlife",
        "description": "Zoological park and botanical garden.",
        "isHiddenGem": false,
        "lat": 21.180222,
        "lng": 72.798023
      },
      {
        "id": "surat-att-4-dutch-garden-cemetery",
        "name": "Dutch Garden & Cemetery",
        "category": "Colonial Heritage",
        "description": "Historic 17th-century European tombs surrounded by landscaped gardens.",
        "isHiddenGem": true,
        "lat": 21.175605,
        "lng": 72.82106
      },
      {
        "id": "surat-att-5-gopi-talav",
        "name": "Gopi Talav",
        "category": "Historical Lakes",
        "description": "Historic 15th-century lake restored as a public recreational park.",
        "isHiddenGem": true,
        "lat": 21.181051,
        "lng": 72.818177
      }
    ]
  },
  {
    "id": "lucknow",
    "code": "IN-UP-LKO-FULL",
    "name": "Lucknow",
    "state": "Uttar Pradesh",
    "zone": "North",
    "lat": 26.8467,
    "lng": 80.9462,
    "flashcardBlurb": "The historic \"City of Nawabs\" on the banks of the Gomti River, celebrated for its refined Awadhi culture, exquisite Urdu literature, architectural marvels, and legendary kebabs.",
    "hotels": [
      {
        "id": "lucknow-hotel-1-taj-mahal-lucknow",
        "name": "Taj Mahal Lucknow",
        "locality": "Vipin Khand, Gomti Nagar",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Premium luxury oasis set in 25 acres of landscaped gardens.",
        "lat": 26.855349,
        "lng": 80.9462
      },
      {
        "id": "lucknow-hotel-2-hyatt-regency-lucknow",
        "name": "Hyatt Regency Lucknow",
        "locality": "Vibhuti Khand, Gomti Nagar",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary business luxury hotel with multiple dining options.",
        "lat": 26.858551,
        "lng": 80.952114
      },
      {
        "id": "lucknow-hotel-3-novotel-lucknow-gomti-nagar",
        "name": "Novotel Lucknow Gomti Nagar",
        "locality": "Viraj Khand",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale international hotel offering comfortable business and leisure stays.",
        "lat": 26.858274,
        "lng": 80.960607
      },
      {
        "id": "lucknow-hotel-4-renaissance-lucknow-hotel",
        "name": "Renaissance Lucknow Hotel",
        "locality": "Vipin Khand, Gomti Nagar",
        "tier": "luxury",
        "stars": 5,
        "description": "High-rise luxury hotel with a rooftop infinity pool overlooking the Gomti River.",
        "lat": 26.853381,
        "lng": 80.969247
      },
      {
        "id": "lucknow-hotel-5-the-centrum-lucknow",
        "name": "The Centrum Lucknow",
        "locality": "Sushant Golf City",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling luxury resort and convention center.",
        "lat": 26.843988,
        "lng": 80.975121
      },
      {
        "id": "lucknow-hotel-6-lebua-lucknow",
        "name": "Lebua Lucknow",
        "locality": "Mall Avenue",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Heritage luxury boutique hotel set in a restored colonial-era villa.",
        "lat": 26.842376,
        "lng": 80.954595
      },
      {
        "id": "lucknow-hotel-7-fairfield-by-marriott-lucknow",
        "name": "Fairfield by Marriott Lucknow",
        "locality": "Vibhuti Khand",
        "tier": "upscale",
        "stars": 4,
        "description": "Clean, modern business comfort.",
        "lat": 26.836205,
        "lng": 80.954746
      },
      {
        "id": "lucknow-hotel-8-clarks-avadh",
        "name": "Clarks Avadh",
        "locality": "MG Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Established historic landmark luxury hotel near the riverfront.",
        "lat": 26.829781,
        "lng": 80.950231
      },
      {
        "id": "lucknow-hotel-9-hotel-ss-royal-lucknow",
        "name": "Hotel SS Royal Lucknow",
        "locality": "Charbagh",
        "tier": "comfort",
        "stars": 3,
        "description": "Premium cultural stay close to city monuments.",
        "lat": 26.825551,
        "lng": 80.941162
      },
      {
        "id": "lucknow-hotel-10-ramada-by-wyndham-lucknow-hotel-convention-center",
        "name": "Ramada by Wyndham Lucknow Hotel & Convention Center",
        "locality": "Kanpur Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Large-scale luxury property with extensive lawns.",
        "lat": 26.825709,
        "lng": 80.929107
      },
      {
        "id": "lucknow-hotel-11-silvete-hotel-lucknow",
        "name": "Silvete Hotel Lucknow",
        "locality": "Hazratganj",
        "tier": "boutique",
        "stars": 4,
        "description": "Boutique city stay offering personalized hospitality.",
        "lat": 26.842376,
        "lng": 80.937805
      },
      {
        "id": "lucknow-hotel-12-lemon-tree-hotel-lucknow",
        "name": "Lemon Tree Hotel, Lucknow",
        "locality": "Transport Nagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Modern mid-scale business hotel in Gomti Nagar.",
        "lat": 26.845344,
        "lng": 80.93174
      },
      {
        "id": "lucknow-hotel-13-hotel-deep-palace",
        "name": "Hotel Deep Palace",
        "locality": "Hazratganj",
        "tier": "comfort",
        "stars": 3,
        "description": "Centrally located comfort stay close to shopping hubs.",
        "lat": 26.852045,
        "lng": 80.927762
      },
      {
        "id": "lucknow-hotel-14-hyatt-place-lucknow",
        "name": "Hyatt Place Lucknow",
        "locality": "Golf City",
        "tier": "upscale",
        "stars": 4,
        "description": "Upscale select-service hotel with modern workstations.",
        "lat": 26.861168,
        "lng": 80.928191
      },
      {
        "id": "lucknow-hotel-15-hotel-lineage",
        "name": "Hotel Lineage",
        "locality": "Gomti Nagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary upscale hotel with banquet facilities.",
        "lat": 26.870403,
        "lng": 80.934372
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "lucknow-rest-veg-1-royal-cafe",
          "name": "Royal Cafe",
          "locality": "Hazratganj",
          "type": "veg",
          "cuisine": "Awadhi Street Food",
          "specialties": "Famous Basket Chaat and street snacks",
          "lat": 26.842327,
          "lng": 80.942639
        },
        {
          "id": "lucknow-rest-veg-2-madan-sweets",
          "name": "Madan Sweets",
          "locality": "Aminabad",
          "type": "veg",
          "cuisine": "Awadhi Mithai",
          "specialties": "Traditional Lucknowi mithai and malai gilori",
          "lat": 26.841532,
          "lng": 80.939198
        }
      ],
      "nonVeg": [
        {
          "id": "lucknow-rest-nonveg-1-tunday-kababi",
          "name": "Tunday Kababi",
          "locality": "Akbari Gate / Aminabad",
          "type": "non-veg",
          "cuisine": "Awadhi Kebabs",
          "specialties": "Legendary melt-in-the-mouth Galouti kebabs",
          "lat": 26.844168,
          "lng": 80.931322
        },
        {
          "id": "lucknow-rest-nonveg-2-dastarkhwan",
          "name": "Dastarkhwan",
          "locality": "Hazratganj",
          "type": "non-veg",
          "cuisine": "Awadhi Curries",
          "specialties": "Authentic Awadhi mutton korma, chicken masala, and ulte tawa ka paratha",
          "lat": 26.847718,
          "lng": 80.928061
        }
      ]
    },
    "attractions": [
      {
        "id": "lucknow-att-1-bara-imambara-bhulbhulaiya",
        "name": "Bara Imambara & Bhulbhulaiya",
        "category": "Awadhi Architecture",
        "description": "18th-century architectural marvel featuring a massive central hall and labyrinth maze.",
        "isHiddenGem": false,
        "lat": 26.84444,
        "lng": 80.922099
      },
      {
        "id": "lucknow-att-2-rumi-darwaza",
        "name": "Rumi Darwaza",
        "category": "Monuments",
        "description": "Iconic 60-foot-tall imposing gateway symbolizing Lucknow.",
        "isHiddenGem": false,
        "lat": 26.849525,
        "lng": 80.916074
      },
      {
        "id": "lucknow-att-3-british-residency",
        "name": "British Residency",
        "category": "Historical Sites",
        "description": "Historic ruins chronicling the 1857 siege.",
        "isHiddenGem": false,
        "lat": 26.856722,
        "lng": 80.911629
      },
      {
        "id": "lucknow-att-4-chota-imambara-hussainabad-imambara-",
        "name": "Chota Imambara (Hussainabad Imambara)",
        "category": "Heritage Shrines",
        "description": "Ornate 19th-century shrine adorned with chandeliers and silver minarets.",
        "isHiddenGem": true,
        "lat": 26.852105,
        "lng": 80.935707
      },
      {
        "id": "lucknow-att-5-dilkusha-kothi",
        "name": "Dilkusha Kothi",
        "category": "Colonial Ruins",
        "description": "Atmospheric English Baroque villa ruins set in a quiet wooded park.",
        "isHiddenGem": true,
        "lat": 26.857551,
        "lng": 80.932693
      }
    ]
  },
  {
    "id": "patna",
    "code": "IN-BR-PAT-FULL",
    "name": "Patna",
    "state": "Bihar",
    "zone": "East",
    "lat": 25.5941,
    "lng": 85.1376,
    "flashcardBlurb": "The historic ancient capital of Bihar (Pataliputra) sitting along the Ganges, serving as the modern gateway to Nalanda, Bodh Gaya, and Buddhist pilgrim trails.",
    "hotels": [
      {
        "id": "patna-hotel-1-hotel-maurya",
        "name": "Hotel Maurya",
        "locality": "South Gandhi Maidan",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium luxury landmark in Patna with established hospitality.",
        "lat": 25.602749,
        "lng": 85.1376
      },
      {
        "id": "patna-hotel-2-lemon-tree-premier-patna",
        "name": "Lemon Tree Premier, Patna",
        "locality": "Exhibition Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary upscale business hotel in the commercial center.",
        "lat": 25.605951,
        "lng": 85.143451
      },
      {
        "id": "patna-hotel-3-hotel-patliputra-ashok",
        "name": "Hotel Patliputra Ashok",
        "locality": "Beer Chand Patel Path",
        "tier": "upscale",
        "stars": 4,
        "description": "Established state luxury hotel set amidst green lawns.",
        "lat": 25.605674,
        "lng": 85.151853
      },
      {
        "id": "patna-hotel-4-hotel-chanakya",
        "name": "Hotel Chanakya",
        "locality": "Beer Chand Patel Path",
        "tier": "upscale",
        "stars": 4,
        "description": "Centrally located business hotel with popular dining venues.",
        "lat": 25.600781,
        "lng": 85.160401
      },
      {
        "id": "patna-hotel-5-gargee-grand-patna",
        "name": "Gargee Grand Patna",
        "locality": "Gandhi Maidan",
        "tier": "boutique",
        "stars": 4,
        "description": "Boutique luxury hotel offering fine dining and banquet services.",
        "lat": 25.591388,
        "lng": 85.166211
      },
      {
        "id": "patna-hotel-6-hotel-republic-patna",
        "name": "Hotel Republic Patna",
        "locality": "Fraser Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Modern business comfort close to the railway station.",
        "lat": 25.589776,
        "lng": 85.145905
      },
      {
        "id": "patna-hotel-7-ginger-patna",
        "name": "Ginger Patna",
        "locality": "Station Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Smart efficient lean-luxe hotel offering reliable transit stay.",
        "lat": 25.583605,
        "lng": 85.146055
      },
      {
        "id": "patna-hotel-8-hotel-pataliputra-continental",
        "name": "Hotel Pataliputra Continental",
        "locality": "Bailey Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale luxury stay catering to corporate and family travelers.",
        "lat": 25.577181,
        "lng": 85.141588
      },
      {
        "id": "patna-hotel-9-the-panache",
        "name": "The Panache",
        "locality": "South Gandhi Maidan",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary business hotel with panoramic city views.",
        "lat": 25.572951,
        "lng": 85.132616
      },
      {
        "id": "patna-hotel-10-hotel-windsor-patna",
        "name": "Hotel Windsor Patna",
        "locality": "Exhibition Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Central city stay close to administrative hubs.",
        "lat": 25.573109,
        "lng": 85.12069
      },
      {
        "id": "patna-hotel-11-hotel-amalfi-grand",
        "name": "Hotel Amalfi Grand",
        "locality": "Patliputra Colony",
        "tier": "boutique",
        "stars": 4,
        "description": "Boutique upscale property in a quiet residential zone.",
        "lat": 25.589776,
        "lng": 85.129295
      },
      {
        "id": "patna-hotel-12-hotel-maple-inn",
        "name": "Hotel Maple Inn",
        "locality": "Fraser Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Convenient transit hotel near major transport hubs.",
        "lat": 25.592744,
        "lng": 85.123294
      },
      {
        "id": "patna-hotel-13-hotel-city-centre-patna",
        "name": "Hotel City Centre Patna",
        "locality": "Buddha Marg",
        "tier": "comfort",
        "stars": 3,
        "description": "Commercial hub stay with easy market access.",
        "lat": 25.599445,
        "lng": 85.119359
      },
      {
        "id": "patna-hotel-14-hotel-raj-continental",
        "name": "Hotel Raj Continental",
        "locality": "Exhibition Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Modern mid-scale hotel offering comfortable rooms.",
        "lat": 25.608568,
        "lng": 85.119784
      },
      {
        "id": "patna-hotel-15-orchid-hotel-patna",
        "name": "Orchid Hotel Patna",
        "locality": "Fraser Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Clean business stay with essential amenities.",
        "lat": 25.617803,
        "lng": 85.125899
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "patna-rest-veg-1-maurya-bakery-sweets",
          "name": "Maurya Bakery & Sweets",
          "locality": "Gandhi Maidan",
          "type": "veg",
          "cuisine": "Bihari Sweets & Snacks",
          "specialties": "Traditional Bihari Litti Chokha and Khaja sweets",
          "lat": 25.589727,
          "lng": 85.134077
        },
        {
          "id": "patna-rest-veg-2-pind-balluchi",
          "name": "Pind Balluchi",
          "locality": "Hotel Maurya Complex",
          "type": "veg",
          "cuisine": "North Indian Thalis",
          "specialties": "North Indian thalis and paneer specialties",
          "lat": 25.588932,
          "lng": 85.130673
        }
      ],
      "nonVeg": [
        {
          "id": "patna-rest-nonveg-1-republic-hotel-dining",
          "name": "Republic Hotel Dining",
          "locality": "Fraser Road",
          "type": "non-veg",
          "cuisine": "Bihari & Awadhi",
          "specialties": "Awadhi and Bihari non-veg preparations",
          "lat": 25.591568,
          "lng": 85.122882
        },
        {
          "id": "patna-rest-nonveg-2-biryani-mahal",
          "name": "Biryani Mahal",
          "locality": "Fraser Road",
          "type": "non-veg",
          "cuisine": "Local Biryani",
          "specialties": "Local spiced mutton biryani",
          "lat": 25.595118,
          "lng": 85.119655
        }
      ]
    },
    "attractions": [
      {
        "id": "patna-att-1-golghar",
        "name": "Golghar",
        "category": "Monuments",
        "description": "18th-century beehive-shaped granary with a spiral staircase leading to panoramic city views.",
        "isHiddenGem": false,
        "lat": 25.59184,
        "lng": 85.113757
      },
      {
        "id": "patna-att-2-patna-sahib-gurdwara",
        "name": "Patna Sahib Gurdwara",
        "category": "Spiritual",
        "description": "Sacred Takht shrine marking the birthplace of Guru Gobind Singh Ji.",
        "isHiddenGem": false,
        "lat": 25.596925,
        "lng": 85.107797
      },
      {
        "id": "patna-att-3-bihar-museum",
        "name": "Bihar Museum",
        "category": "Museums",
        "description": "World-class modern museum showcasing ancient artifacts and the Didarganj Yakshi.",
        "isHiddenGem": false,
        "lat": 25.604122,
        "lng": 85.103399
      },
      {
        "id": "patna-att-4-buddha-smriti-park",
        "name": "Buddha Smriti Park",
        "category": "Memorial Parks",
        "description": "Urban memorial park featuring a central stupa containing sacred Buddha relics.",
        "isHiddenGem": true,
        "lat": 25.599505,
        "lng": 85.127219
      },
      {
        "id": "patna-att-5-kumrahar-archaeological-park",
        "name": "Kumrahar Archaeological Park",
        "category": "Archaeological Ruins",
        "description": "Excavated remains of the ancient Mauryan imperial palace of Pataliputra.",
        "isHiddenGem": true,
        "lat": 25.604951,
        "lng": 85.124238
      }
    ]
  },
  {
    "id": "agra",
    "code": "IN-UP-AGR-FULL",
    "name": "Agra",
    "state": "Uttar Pradesh",
    "zone": "North",
    "lat": 27.1767,
    "lng": 78.0081,
    "flashcardBlurb": "The legendary Mughal capital on the Yamuna River, globally celebrated as home to the Taj Mahal, massive red sandstone forts, and exquisite marble inlay craftsmanship.",
    "hotels": [
      {
        "id": "agra-hotel-1-the-oberoi-amarvilas",
        "name": "The Oberoi Amarvilas",
        "locality": "Taj East Gate Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Unmatched luxury with direct, unobstructed views of the Taj Mahal from every room.",
        "lat": 27.185349,
        "lng": 78.0081
      },
      {
        "id": "agra-hotel-2-itc-mughal",
        "name": "ITC Mughal",
        "locality": "Fatehabad Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Luxury spa resort spread over 23 acres of landscaped gardens, reflecting Mughal architectural grandeur.",
        "lat": 27.188551,
        "lng": 78.014031
      },
      {
        "id": "agra-hotel-3-taj-hotel-convention-centre-agra",
        "name": "Taj Hotel & Convention Centre, Agra",
        "locality": "Taj East Gate Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Five-star luxury property offering panoramic rooftop views of the Taj Mahal.",
        "lat": 27.188274,
        "lng": 78.02255
      },
      {
        "id": "agra-hotel-4-trident-agra",
        "name": "Trident, Agra",
        "locality": "Fatehabad Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Low-rise luxury hotel set amidst lush gardens, reflection pools, and Mughal-style courtyards.",
        "lat": 27.183381,
        "lng": 78.031215
      },
      {
        "id": "agra-hotel-5-courtyard-by-marriott-agra",
        "name": "Courtyard by Marriott Agra",
        "locality": "Fatehabad Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary upscale business and leisure hotel with multi-cuisine dining.",
        "lat": 27.173988,
        "lng": 78.037106
      },
      {
        "id": "agra-hotel-6-radisson-hotel-agra",
        "name": "Radisson Hotel Agra",
        "locality": "Tajganj",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern upscale hotel located just minutes from the Taj Mahal East Gate.",
        "lat": 27.172376,
        "lng": 78.016519
      },
      {
        "id": "agra-hotel-7-jaypee-palace-hotel-convention-centre",
        "name": "Jaypee Palace Hotel & Convention Centre",
        "locality": "Fatehabad Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling 5-star hotel built with red sandstone and marble, offering extensive leisure facilities.",
        "lat": 27.166205,
        "lng": 78.016672
      },
      {
        "id": "agra-hotel-8-doubletree-by-hilton-agra",
        "name": "DoubleTree by Hilton Agra",
        "locality": "Shamsabad Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary upscale hotel featuring rooftop dining overlooking the Taj Mahal.",
        "lat": 27.159781,
        "lng": 78.012143
      },
      {
        "id": "agra-hotel-9-hotel-clarks-shiraz",
        "name": "Hotel Clarks Shiraz",
        "locality": "Taj Road, Cantonment",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Established legacy hotel operating in Agra for decades, known for rooftop dining.",
        "lat": 27.155551,
        "lng": 78.003047
      },
      {
        "id": "agra-hotel-10-the-grand-imperial-heritage-hotel",
        "name": "The Grand Imperial - Heritage Hotel",
        "locality": "Rakabganj",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Restored colonial heritage hotel built in 1916, frequented by historic figures.",
        "lat": 27.155709,
        "lng": 77.990957
      },
      {
        "id": "agra-hotel-11-hotel-atulyaa-taj",
        "name": "Hotel Atulyaa Taj",
        "locality": "Taj East Gate",
        "tier": "boutique",
        "stars": 4,
        "description": "Boutique property offering rooftop pool and direct views of the Taj Mahal.",
        "lat": 27.172376,
        "lng": 77.999681
      },
      {
        "id": "agra-hotel-12-mansi-silver-oak-hotel",
        "name": "Mansi Silver Oak Hotel",
        "locality": "Fatehabad Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Comfortable mid-scale hotel offering reliable hospitality near city tourist hubs.",
        "lat": 27.175344,
        "lng": 77.993597
      },
      {
        "id": "agra-hotel-13-hotel-taj-resorts",
        "name": "Hotel Taj Resorts",
        "locality": "Taj East Gate",
        "tier": "boutique",
        "stars": 3,
        "description": "Boutique leisure hotel located within walking distance of the Taj Mahal.",
        "lat": 27.182045,
        "lng": 77.989608
      },
      {
        "id": "agra-hotel-14-howard-plaza-the-fern-agra",
        "name": "Howard Plaza The Fern, Agra",
        "locality": "Fatehabad Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Eco-sensitive upscale hotel offering comfortable wellness and dining options.",
        "lat": 27.191168,
        "lng": 77.990038
      },
      {
        "id": "agra-hotel-15-hotel-amar",
        "name": "Hotel Amar",
        "locality": "Fatehabad Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Well-established leisure hotel with sprawling lawns and swimming pool.",
        "lat": 27.200403,
        "lng": 77.996237
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "agra-rest-veg-1-deviram-sweets",
          "name": "Deviram Sweets",
          "locality": "Civil Lines",
          "type": "veg",
          "cuisine": "Agra Breakfast & Mithai",
          "specialties": "Famous for bedmi puri, aloo sabzi, and rabri jalebi",
          "lat": 27.172327,
          "lng": 78.004528
        },
        {
          "id": "agra-rest-veg-2-panchhi-petha-store",
          "name": "Panchhi Petha Store",
          "locality": "Sadar Bazar & Hari Parwat",
          "type": "veg",
          "cuisine": "Traditional Agra Petha",
          "specialties": "Iconic Agra petha varieties including angori and chocolate petha",
          "lat": 27.171532,
          "lng": 78.001077
        }
      ],
      "nonVeg": [
        {
          "id": "agra-rest-nonveg-1-peshawri",
          "name": "Peshawri",
          "locality": "ITC Mughal, Fatehabad Road",
          "type": "non-veg",
          "cuisine": "North-West Frontier",
          "specialties": "Award-winning North Indian tandoori delicacies and Dal Bukhara",
          "lat": 27.174168,
          "lng": 77.993179
        },
        {
          "id": "agra-rest-nonveg-2-pinch-of-spice",
          "name": "Pinch of Spice",
          "locality": "Fatehabad Road",
          "type": "non-veg",
          "cuisine": "Mughlai & North Indian",
          "specialties": "Mughlai non-veg sizzlers and curries",
          "lat": 27.177718,
          "lng": 77.989907
        }
      ]
    },
    "attractions": [
      {
        "id": "agra-att-1-taj-mahal",
        "name": "Taj Mahal",
        "category": "UNESCO World Heritage",
        "description": "World-famous 17th-century white marble mausoleum built by Shah Jahan.",
        "isHiddenGem": false,
        "lat": 27.17444,
        "lng": 77.983928
      },
      {
        "id": "agra-att-2-agra-fort",
        "name": "Agra Fort",
        "category": "Palaces & Forts",
        "description": "16th-century red sandstone imperial fortress overlooking the Yamuna.",
        "isHiddenGem": false,
        "lat": 27.179525,
        "lng": 77.977885
      },
      {
        "id": "agra-att-3-fatehpur-sikri",
        "name": "Fatehpur Sikri",
        "category": "UNESCO World Heritage",
        "description": "Deserted red sandstone imperial capital built by Akbar.",
        "isHiddenGem": false,
        "lat": 27.186722,
        "lng": 77.973427
      },
      {
        "id": "agra-att-4-mehtab-bagh",
        "name": "Mehtab Bagh",
        "category": "Mughal Gardens",
        "description": "Charbagh garden complex across the Yamuna offering serene sunset views of the Taj.",
        "isHiddenGem": true,
        "lat": 27.182105,
        "lng": 77.997576
      },
      {
        "id": "agra-att-5-akbar-s-tomb-sikandra",
        "name": "Akbar's Tomb, Sikandra",
        "category": "Imperial Mausoleums",
        "description": "Grand mausoleum set within a walled garden inhabited by freely roaming deer.",
        "isHiddenGem": true,
        "lat": 27.187551,
        "lng": 77.994553
      }
    ]
  },
  {
    "id": "amritsar",
    "code": "IN-PB-ASR-FULL",
    "name": "Amritsar",
    "state": "Punjab",
    "zone": "North",
    "lat": 31.634,
    "lng": 74.8723,
    "flashcardBlurb": "The spiritual and cultural center of Sikhism, celebrated worldwide for the breathtaking Golden Temple, heroic history, and legendary Punjabi hospitality and street food.",
    "hotels": [
      {
        "id": "amritsar-hotel-1-taj-swarna",
        "name": "Taj Swarna",
        "locality": "Majitha Verka Bypass",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Contemporary luxury comfort set amidst manicured lawns and fine dining.",
        "lat": 31.642649,
        "lng": 74.8723
      },
      {
        "id": "amritsar-hotel-2-hyatt-regency-amritsar",
        "name": "Hyatt Regency Amritsar",
        "locality": "GT Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium international hotel offering modern luxury near commercial hubs.",
        "lat": 31.645851,
        "lng": 74.878497
      },
      {
        "id": "amritsar-hotel-3-welcomhotel-by-itc-hotels-amritsar",
        "name": "Welcomhotel by ITC Hotels, Amritsar",
        "locality": "Raja Sansi",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale luxury resort reflecting Punjabi heritage and fine culinary arts.",
        "lat": 31.645574,
        "lng": 74.887398
      },
      {
        "id": "amritsar-hotel-4-radisson-blu-hotel-amritsar",
        "name": "Radisson Blu Hotel Amritsar",
        "locality": "Airport Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling 5-star hotel offering world-class spa and dining facilities.",
        "lat": 31.640681,
        "lng": 74.896452
      },
      {
        "id": "amritsar-hotel-5-fairfield-by-marriott-amritsar",
        "name": "Fairfield by Marriott Amritsar",
        "locality": "Albert Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Clean, modern upscale business hotel located near city landmarks.",
        "lat": 31.631288,
        "lng": 74.902607
      },
      {
        "id": "amritsar-hotel-6-hotel-ritz-plaza",
        "name": "Hotel Ritz Plaza",
        "locality": "Mall Road",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Established heritage-style hotel set within colonial-era gardens.",
        "lat": 31.629676,
        "lng": 74.881097
      },
      {
        "id": "amritsar-hotel-7-courtyard-by-marriott-amritsar",
        "name": "Courtyard by Marriott Amritsar",
        "locality": "Mall Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary business and leisure hotel with efficient hospitality.",
        "lat": 31.623505,
        "lng": 74.881256
      },
      {
        "id": "amritsar-hotel-8-holiday-inn-amritsar-ranjit-avenue",
        "name": "Holiday Inn Amritsar Ranjit Avenue",
        "locality": "Ranjit Avenue",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern upscale hotel featuring rooftop pool and dining.",
        "lat": 31.617081,
        "lng": 74.876524
      },
      {
        "id": "amritsar-hotel-9-taj-gateway-hotel-amritsar",
        "name": "Taj Gateway Hotel Amritsar",
        "locality": "Cantonment",
        "tier": "upscale",
        "stars": 4,
        "description": "Traditional hospitality brand offering comfortable stay near cantonment.",
        "lat": 31.612851,
        "lng": 74.86702
      },
      {
        "id": "amritsar-hotel-10-hotel-cj-classic",
        "name": "Hotel CJ Classic",
        "locality": "Near Golden Temple",
        "tier": "comfort",
        "stars": 3,
        "description": "Popular pilgrimage hotel located within walking distance of Harmandir Sahib.",
        "lat": 31.613009,
        "lng": 74.854388
      },
      {
        "id": "amritsar-hotel-11-sarovar-portico-amritsar",
        "name": "Sarovar Portico Amritsar",
        "locality": "Court Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Comfortable upscale hotel near historical bazaars.",
        "lat": 31.629676,
        "lng": 74.863503
      },
      {
        "id": "amritsar-hotel-12-regenta-inn-amritsar",
        "name": "Regenta Inn Amritsar",
        "locality": "Airport Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Modern mid-scale hotel tailored for transit and pilgrim travelers.",
        "lat": 31.632644,
        "lng": 74.857147
      },
      {
        "id": "amritsar-hotel-13-hotel-city-park-amritsar",
        "name": "Hotel City Park Amritsar",
        "locality": "Near Golden Temple",
        "tier": "comfort",
        "stars": 3,
        "description": "Central city stay offering essential modern amenities.",
        "lat": 31.639345,
        "lng": 74.852978
      },
      {
        "id": "amritsar-hotel-14-golden-tulip-amritsar",
        "name": "Golden Tulip Amritsar",
        "locality": "GT Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary upscale property near industrial and tourist zones.",
        "lat": 31.648468,
        "lng": 74.853428
      },
      {
        "id": "amritsar-hotel-15-hotel-sapphire",
        "name": "Hotel Sapphire",
        "locality": "Near Golden Temple",
        "tier": "comfort",
        "stars": 3,
        "description": "Convenient pilgrimage hotel offering clean rooms and easy temple access.",
        "lat": 31.657703,
        "lng": 74.859905
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "amritsar-rest-veg-1-kesar-da-dhaba",
          "name": "Kesar Da Dhaba",
          "locality": "Chowk Shastri Market",
          "type": "veg",
          "cuisine": "Punjabi Dhaba",
          "specialties": "Legendary Dal Makhani and stuffed parathas since 1916",
          "lat": 31.629627,
          "lng": 74.868568
        },
        {
          "id": "amritsar-rest-veg-2-kanha-sweets",
          "name": "Kanha Sweets",
          "locality": "Lawrence Road",
          "type": "veg",
          "cuisine": "Punjabi Breakfast & Lassi",
          "specialties": "Famous Chhole Puri and sweet lassi",
          "lat": 31.628832,
          "lng": 74.864962
        }
      ],
      "nonVeg": [
        {
          "id": "amritsar-rest-nonveg-1-beera-chicken-house",
          "name": "Beera Chicken House",
          "locality": "Majitha Road",
          "type": "non-veg",
          "cuisine": "Punjabi Tandoori",
          "specialties": "World-famous smoky tandoori chicken and tikka",
          "lat": 31.631468,
          "lng": 74.856709
        },
        {
          "id": "amritsar-rest-nonveg-2-makhan-fish-chicken-corner",
          "name": "Makhan Fish & Chicken Corner",
          "locality": "Majitha Road",
          "type": "non-veg",
          "cuisine": "Amritsari Seafood",
          "specialties": "Famous Amritsari Fried Fish with ajwain flavor",
          "lat": 31.635018,
          "lng": 74.853291
        }
      ]
    },
    "attractions": [
      {
        "id": "amritsar-att-1-sri-harmandir-sahib-golden-temple-",
        "name": "Sri Harmandir Sahib (Golden Temple)",
        "category": "Spiritual",
        "description": "Holiest Sikh gurdwara enveloped in gold leaf, operating the world's largest langar.",
        "isHiddenGem": false,
        "lat": 31.63174,
        "lng": 74.847044
      },
      {
        "id": "amritsar-att-2-jallianwala-bagh",
        "name": "Jallianwala Bagh",
        "category": "Memorials",
        "description": "Historic public garden memorial preserving bullet marks from the 1919 massacre.",
        "isHiddenGem": false,
        "lat": 31.636825,
        "lng": 74.84073
      },
      {
        "id": "amritsar-att-3-wagah-border-ceremony",
        "name": "Wagah Border Ceremony",
        "category": "Cultural Ceremony",
        "description": "High-energy military Beating Retreat ceremony conducted daily at sunset.",
        "isHiddenGem": false,
        "lat": 31.644022,
        "lng": 74.836072
      },
      {
        "id": "amritsar-att-4-gobindgarh-fort",
        "name": "Gobindgarh Fort",
        "category": "Palaces & Forts",
        "description": "19th-century military fort converted into a cultural theme park showcasing Punjabi heritage.",
        "isHiddenGem": true,
        "lat": 31.639405,
        "lng": 74.861304
      }
    ]
  },
  {
    "id": "udaipur",
    "code": "IN-RJ-UDP-FULL",
    "name": "Udaipur",
    "state": "Rajasthan",
    "zone": "West",
    "lat": 24.5854,
    "lng": 73.7125,
    "flashcardBlurb": "Known as the \"Venice of the East\" and \"City of Lakes,\" Udaipur is a romantic desert oasis framed by the Aravalli hills, marble palaces, and shimmering blue waters.",
    "hotels": [
      {
        "id": "udaipur-hotel-1-taj-lake-palace",
        "name": "Taj Lake Palace",
        "locality": "Lake Pichola",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "White marble palace floating magically in the middle of Lake Pichola.",
        "lat": 24.594049,
        "lng": 73.7125
      },
      {
        "id": "udaipur-hotel-2-the-oberoi-udaivilas",
        "name": "The Oberoi Udaivilas",
        "locality": "Haridas Ji Ki Magri",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Ultra-luxury palace resort featuring sweeping lake views, private pools, and courtyards.",
        "lat": 24.597251,
        "lng": 73.718303
      },
      {
        "id": "udaipur-hotel-3-leela-palace-udaipur",
        "name": "Leela Palace Udaipur",
        "locality": "Lake Pichola",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Grand luxury palace hotel reflecting Mewar architecture along the water's edge.",
        "lat": 24.596974,
        "lng": 73.726636
      },
      {
        "id": "udaipur-hotel-4-taj-fateh-prakash-palace",
        "name": "Taj Fateh Prakash Palace",
        "locality": "City Palace Complex",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Historic palace hotel offering authentic royal hospitality and museum-grade artifacts.",
        "lat": 24.592081,
        "lng": 73.735113
      },
      {
        "id": "udaipur-hotel-5-jagat-niwas-palace-hotel",
        "name": "Jagat Niwas Palace Hotel",
        "locality": "Lal Ghat",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "17th-century heritage haveli converted into a charming boutique lakefront stay.",
        "lat": 24.582688,
        "lng": 73.740876
      },
      {
        "id": "udaipur-hotel-6-shiv-niwas-palace",
        "name": "Shiv Niwas Palace",
        "locality": "City Palace Complex",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Crescent-shaped royal heritage hotel once hosting British royalty.",
        "lat": 24.581076,
        "lng": 73.720737
      },
      {
        "id": "udaipur-hotel-7-trident-udaipur",
        "name": "Trident, Udaipur",
        "locality": "Haridas Ji Ki Magri",
        "tier": "luxury",
        "stars": 5,
        "description": "Luxury resort set amidst 43 acres of gardens near the banks of Lake Pichola.",
        "lat": 24.574905,
        "lng": 73.720886
      },
      {
        "id": "udaipur-hotel-8-radisson-blu-udaipur-palace-resort-spa",
        "name": "Radisson Blu Udaipur Palace Resort & Spa",
        "locality": "Fateh Sagar Lake",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling luxury resort overlooking Fateh Sagar Lake.",
        "lat": 24.568481,
        "lng": 73.716455
      },
      {
        "id": "udaipur-hotel-9-fateh-garh-heritage-resort",
        "name": "Fateh Garh Heritage Resort",
        "locality": "Sisarma",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Hilltop heritage resort offering panoramic sunset vistas over the Aravallis.",
        "lat": 24.564251,
        "lng": 73.707556
      },
      {
        "id": "udaipur-hotel-10-raas-devigarh",
        "name": "RAAS Devigarh",
        "locality": "Delwara",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "18th-century palace restored into an ultra-luxury design boutique hotel (Excursion Hub).",
        "lat": 24.564409,
        "lng": 73.695729
      },
      {
        "id": "udaipur-hotel-11-ananta-udaipur",
        "name": "Ananta Udaipur",
        "locality": "Kodiyat Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling luxury resort set amidst the lush green hills of the Aravalli range.",
        "lat": 24.581076,
        "lng": 73.704263
      },
      {
        "id": "udaipur-hotel-12-ramada-by-wyndham-udaipur-resort-spa",
        "name": "Ramada by Wyndham Udaipur Resort & Spa",
        "locality": "Rampura Circle",
        "tier": "luxury",
        "stars": 5,
        "description": "Traditional Mewari-style resort overlooking Sahiyar Lake.",
        "lat": 24.584044,
        "lng": 73.698312
      },
      {
        "id": "udaipur-hotel-13-hotel-udai-kothi",
        "name": "Hotel Udai Kothi",
        "locality": "Hanuman Ghat",
        "tier": "boutique",
        "stars": 4,
        "description": "Boutique heritage hotel known for its rooftop pool and classic Mewari architecture.",
        "lat": 24.590745,
        "lng": 73.694409
      },
      {
        "id": "udaipur-hotel-14-aurika-udaipur-luxury-by-lemon-tree-hotels",
        "name": "Aurika, Udaipur - Luxury by Lemon Tree Hotels",
        "locality": "Kala Rohi",
        "tier": "luxury",
        "stars": 5,
        "description": "Hilltop luxury resort offering sweeping views of the city lakes.",
        "lat": 24.599868,
        "lng": 73.69483
      },
      {
        "id": "udaipur-hotel-15-hotel-lake-pichola",
        "name": "Hotel Lake Pichola",
        "locality": "Trilok Nath Temple, Outside Chand Pole",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Heritage lakeside hotel offering traditional hospitality and boat access.",
        "lat": 24.609103,
        "lng": 73.700895
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "udaipur-rest-veg-1-ambrai-restaurant",
          "name": "Ambrai Restaurant",
          "locality": "Amet Haveli, Hanuman Ghat",
          "type": "veg",
          "cuisine": "North Indian & Mewari",
          "specialties": "Waterside dining overlooking Lake Pichola and City Palace",
          "lat": 24.581027,
          "lng": 73.709006
        },
        {
          "id": "udaipur-rest-veg-2-jheel-s-ginger-coffee-bar",
          "name": "Jheel's Ginger Coffee Bar",
          "locality": "Lal Ghat",
          "type": "veg",
          "cuisine": "Bakes & Cafe",
          "specialties": "Vegan bakes and coffee by the water",
          "lat": 24.580232,
          "lng": 73.70563
        }
      ],
      "nonVeg": [
        {
          "id": "udaipur-rest-nonveg-1-vantage-by-pameys",
          "name": "Vantage By Pameys",
          "locality": "Pichola",
          "type": "non-veg",
          "cuisine": "Rajasthani Non-Veg",
          "specialties": "Rooftop dining serving traditional Laal Maas and non-veg delicacies",
          "lat": 24.582868,
          "lng": 73.697902
        },
        {
          "id": "udaipur-rest-nonveg-2-charcoal-by-carlsson",
          "name": "Charcoal By Carlsson",
          "locality": "Haridas Ji Ki Magri",
          "type": "non-veg",
          "cuisine": "Barbecue & Grills",
          "specialties": "Fine grilled non-veg dishes with Rajasthani rubs",
          "lat": 24.586418,
          "lng": 73.694702
        }
      ]
    },
    "attractions": [
      {
        "id": "udaipur-att-1-city-palace-udaipur",
        "name": "City Palace Udaipur",
        "category": "Palaces & Forts",
        "description": "400-year-old palace complex overlooking Lake Pichola.",
        "isHiddenGem": false,
        "lat": 24.58314,
        "lng": 73.688853
      },
      {
        "id": "udaipur-att-2-lake-pichola-boat-cruise",
        "name": "Lake Pichola Boat Cruise",
        "category": "Lakes & Cruising",
        "description": "Scenic boat ride passing Jag Mandir and the City Palace.",
        "isHiddenGem": false,
        "lat": 24.588225,
        "lng": 73.682941
      },
      {
        "id": "udaipur-att-3-saheliyon-ki-bari",
        "name": "Saheliyon-ki-Bari",
        "category": "Royal Gardens",
        "description": "18th-century royal garden featuring marble fountains and lotus pools.",
        "isHiddenGem": false,
        "lat": 24.595422,
        "lng": 73.67858
      },
      {
        "id": "udaipur-att-4-sajjangarh-monsoon-palace",
        "name": "Sajjangarh Monsoon Palace",
        "category": "Hilltop Palaces",
        "description": "Hilltop 19th-century palace offering panoramic sunset vistas.",
        "isHiddenGem": true,
        "lat": 24.590805,
        "lng": 73.702204
      },
      {
        "id": "udaipur-att-5-eklingji-temple-complex",
        "name": "Eklingji Temple Complex",
        "category": "Spiritual",
        "description": "Ancient 8th-century marble temple town dedicated to Lord Shiva (22 km away).",
        "isHiddenGem": true,
        "lat": 24.596251,
        "lng": 73.699248
      }
    ]
  },
  {
    "id": "bhopal",
    "code": "IN-MP-BHO-FULL",
    "name": "Bhopal",
    "state": "Madhya Pradesh",
    "zone": "Central",
    "lat": 23.2599,
    "lng": 77.4126,
    "flashcardBlurb": "The scenic \"City of Lakes,\" balancing rugged natural reservoirs, historical Indo-Islamic mosques, and proximity to prehistoric rock paintings and Buddhist stupas.",
    "hotels": [
      {
        "id": "bhopal-hotel-1-jehan-numa-palace-hotel",
        "name": "Jehan Numa Palace Hotel",
        "locality": "Shamla Hills",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Royal heritage palace hotel set amidst green lawns overlooking the Upper Lake.",
        "lat": 23.268549,
        "lng": 77.4126
      },
      {
        "id": "bhopal-hotel-2-noor-us-sabah-palace",
        "name": "Noor-Us-Sabah Palace",
        "locality": "Kohefiza",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Historic 1920s palace of the Nawabs converted into a luxury heritage hotel on a hilltop.",
        "lat": 23.271751,
        "lng": 77.418343
      },
      {
        "id": "bhopal-hotel-3-courtyard-by-marriott-bhopal",
        "name": "Courtyard by Marriott Bhopal",
        "locality": "DB City Mall Area, MP Nagar",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary upscale business hotel in the commercial center.",
        "lat": 23.271474,
        "lng": 77.426592
      },
      {
        "id": "bhopal-hotel-4-sayaji-hotel-bhopal",
        "name": "Sayaji Hotel Bhopal",
        "locality": "AB Road, Van Vihar Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale luxury hotel renowned for multi-cuisine dining and hospitality.",
        "lat": 23.266581,
        "lng": 77.434983
      },
      {
        "id": "bhopal-hotel-5-radisson-bhopal",
        "name": "Radisson Bhopal",
        "locality": "Gulmohar Colony, Habibganj",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern upscale hotel offering comfortable business and leisure amenities.",
        "lat": 23.257188,
        "lng": 77.440687
      },
      {
        "id": "bhopal-hotel-6-jehan-numa-retreat",
        "name": "Jehan Numa Retreat",
        "locality": "Prempura, Habibganj",
        "tier": "luxury",
        "stars": 5,
        "description": "Eco-luxury resort set amidst sprawling forest groves near Kaliasot Lake.",
        "lat": 23.255576,
        "lng": 77.420753
      },
      {
        "id": "bhopal-hotel-7-lemon-tree-hotel-bhopal",
        "name": "Lemon Tree Hotel, Bhopal",
        "locality": "MP Nagar Zone-II",
        "tier": "upscale",
        "stars": 4,
        "description": "Vibrant business hotel in the commercial district.",
        "lat": 23.249405,
        "lng": 77.4209
      },
      {
        "id": "bhopal-hotel-8-hotel-amer-palace",
        "name": "Hotel Amer Palace",
        "locality": "Zone-I, MP Nagar",
        "tier": "upscale",
        "stars": 4,
        "description": "Well-established central city hotel offering reliable banquet and stay facilities.",
        "lat": 23.242981,
        "lng": 77.416514
      },
      {
        "id": "bhopal-hotel-9-taj-lakefront-bhopal",
        "name": "Taj Lakefront Bhopal",
        "locality": "Near Van Vihar, Bhadbhada Road",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Premium luxury hotel offering sweeping views over the Upper Lake.",
        "lat": 23.238751,
        "lng": 77.407707
      },
      {
        "id": "bhopal-hotel-10-hotel-shagun",
        "name": "Hotel Shagun",
        "locality": "Bhopal Station",
        "tier": "comfort",
        "stars": 3,
        "description": "Convenient transit hotel close to transport hubs.",
        "lat": 23.238909,
        "lng": 77.396
      },
      {
        "id": "bhopal-hotel-11-hotel-palash-regency",
        "name": "Hotel Palash Regency",
        "locality": "TT Nagar",
        "tier": "comfort",
        "stars": 3,
        "description": "State tourism property offering comfortable, budget-friendly stays near lakes.",
        "lat": 23.255576,
        "lng": 77.404447
      },
      {
        "id": "bhopal-hotel-12-residency-hotel-bhopal",
        "name": "Residency Hotel Bhopal",
        "locality": "MP Nagar",
        "tier": "comfort",
        "stars": 3,
        "description": "Central business stay with essential modern amenities.",
        "lat": 23.258544,
        "lng": 77.398557
      },
      {
        "id": "bhopal-hotel-13-hotel-nisarga",
        "name": "Hotel Nisarga",
        "locality": "Zone-I, MP Nagar",
        "tier": "comfort",
        "stars": 3,
        "description": "Scenic hillside hotel offering quiet nature proximity.",
        "lat": 23.265245,
        "lng": 77.394694
      },
      {
        "id": "bhopal-hotel-14-hotel-lake-view-ashok",
        "name": "Hotel Lake View Ashok",
        "locality": "Shamla Hills",
        "tier": "upscale",
        "stars": 4,
        "description": "Established lakefront hotel overlooking the Bhojtal waters.",
        "lat": 23.274368,
        "lng": 77.395111
      },
      {
        "id": "bhopal-hotel-15-hotel-capital-bhopal",
        "name": "Hotel Capital Bhopal",
        "locality": "Hamidia Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Modern mid-scale hotel tailored for corporate and transit travelers.",
        "lat": 23.283603,
        "lng": 77.401113
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "bhopal-rest-veg-1-manohar-dairy-restaurant",
          "name": "Manohar Dairy & Restaurant",
          "locality": "DB Mall Area & Hamidia Road",
          "type": "veg",
          "cuisine": "Bhopali Breakfast & Mithai",
          "specialties": "Famous for Poha-Jalebi breakfast, chaat, and vegetarian thalis",
          "lat": 23.255527,
          "lng": 77.409142
        }
      ],
      "nonVeg": [
        {
          "id": "bhopal-rest-nonveg-1-under-the-mango-tree",
          "name": "Under the Mango Tree",
          "locality": "Jehan Numa Palace, Shamla Hills",
          "type": "non-veg",
          "cuisine": "Nawabi Awadhi & Bhopali",
          "specialties": "Fine dining serving authentic Nawab-era non-veg preparations and Shami kebabs",
          "lat": 23.257368,
          "lng": 77.398152
        },
        {
          "id": "bhopal-rest-nonveg-2-hakeem-restaurant",
          "name": "Hakeem Restaurant",
          "locality": "Chowk Area & MP Nagar",
          "type": "non-veg",
          "cuisine": "Mughlai & Biryani",
          "specialties": "Famous Bhopal-style chicken changezi and biryani",
          "lat": 23.260918,
          "lng": 77.394984
        }
      ]
    },
    "attractions": [
      {
        "id": "bhopal-att-1-upper-lake-bhojtal-van-vihar-national-park",
        "name": "Upper Lake (Bhojtal) & Van Vihar National Park",
        "category": "Lakes & Wildlife",
        "description": "Massive freshwater lake alongside an open-air national park zoo housing tigers and leopards.",
        "isHiddenGem": false,
        "lat": 23.25764,
        "lng": 77.389194
      },
      {
        "id": "bhopal-att-2-taj-ul-masajid",
        "name": "Taj-ul-Masajid",
        "category": "Mosques & Architecture",
        "description": "One of the largest mosques in India, featuring striking pink sandstone facades and massive domes.",
        "isHiddenGem": false,
        "lat": 23.262725,
        "lng": 77.383343
      },
      {
        "id": "bhopal-att-3-bharat-bhavan",
        "name": "Bharat Bhavan",
        "category": "Arts & Culture",
        "description": "Multi-arts complex designed by Charles Correa celebrating contemporary Indian art and theatre.",
        "isHiddenGem": false,
        "lat": 23.269922,
        "lng": 77.379026
      },
      {
        "id": "bhopal-att-4-sanchi-stupa-excursion-hub-",
        "name": "Sanchi Stupa (Excursion Hub)",
        "category": "UNESCO World Heritage",
        "description": "Magnificent 3rd-century BCE Buddhist stone complex located 46 km from Bhopal.",
        "isHiddenGem": true,
        "lat": 23.265305,
        "lng": 77.402409
      },
      {
        "id": "bhopal-att-5-bhimbetka-rock-shelters",
        "name": "Bhimbetka Rock Shelters",
        "category": "UNESCO World Heritage",
        "description": "UNESCO World Heritage prehistoric rock shelters containing cave paintings dating back 30,000 years.",
        "isHiddenGem": true,
        "lat": 23.270751,
        "lng": 77.399483
      }
    ]
  },
  {
    "id": "kochi",
    "code": "IN-KL-COK-FULL",
    "name": "Kochi (Cochin)",
    "state": "Kerala",
    "zone": "South",
    "lat": 9.9312,
    "lng": 76.2673,
    "flashcardBlurb": "Kerala's historic spice-trading port city, blending Chinese fishing nets, Portuguese colonial mansions, Jewish heritage lanes, and scenic backwaters.",
    "hotels": [
      {
        "id": "kochi-hotel-1-brunton-boatyard-cgh-earth-",
        "name": "Brunton Boatyard (CGH Earth)",
        "locality": "Fort Kochi",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Restored 19th-century colonial shipbuilding yard overlooking Fort Kochi harbor.",
        "lat": 9.939849,
        "lng": 76.2673
      },
      {
        "id": "kochi-hotel-2-taj-malabar-resort-spa",
        "name": "Taj Malabar Resort & Spa",
        "locality": "Willingdon Island",
        "tier": "luxury",
        "stars": 5,
        "description": "Luxury waterfront resort offering panoramic views of Cochin harbor.",
        "lat": 9.943051,
        "lng": 76.272657
      },
      {
        "id": "kochi-hotel-3-grand-hyatt-kochi-bolgatty",
        "name": "Grand Hyatt Kochi Bolgatty",
        "locality": "Bolgatty Island",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Waterfront luxury resort set on Bolgatty Island with extensive convention facilities.",
        "lat": 9.942774,
        "lng": 76.28035
      },
      {
        "id": "kochi-hotel-4-le-meridien-kochi",
        "name": "Le Meridien Kochi",
        "locality": "Maradu",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling backwater luxury resort located along the Maradu backwater stretches.",
        "lat": 9.937881,
        "lng": 76.288176
      },
      {
        "id": "kochi-hotel-5-eighth-bastion-cgh-earth-",
        "name": "Eighth Bastion (CGH Earth)",
        "locality": "Fort Kochi",
        "tier": "boutique",
        "stars": 4,
        "description": "CGH Earth boutique heritage hotel reflecting Dutch and Portuguese design.",
        "lat": 9.928488,
        "lng": 76.293496
      },
      {
        "id": "kochi-hotel-6-radisson-blu-kochi",
        "name": "Radisson Blu Kochi",
        "locality": "Elamkulam, Ernakulam",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium upscale business hotel located in the heart of Ernakulam.",
        "lat": 9.926876,
        "lng": 76.274904
      },
      {
        "id": "kochi-hotel-7-courtyard-by-marriott-kochi-airport",
        "name": "Courtyard by Marriott Kochi Airport",
        "locality": "Nedumbassery",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary upscale hotel located minutes from Cochin International Airport.",
        "lat": 9.920705,
        "lng": 76.275041
      },
      {
        "id": "kochi-hotel-8-casino-hotel-cgh-earth-",
        "name": "Casino Hotel (CGH Earth)",
        "locality": "Willingdon Island",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "CGH Earth pioneer hotel famous for authentic coastal seafood dining.",
        "lat": 9.914281,
        "lng": 76.270951
      },
      {
        "id": "kochi-hotel-9-ramada-resort-kochi",
        "name": "Ramada Resort Kochi",
        "locality": "Kumbalam",
        "tier": "luxury",
        "stars": 5,
        "description": "Waterfront leisure resort set around a scenic backwater lagoon.",
        "lat": 9.910051,
        "lng": 76.262736
      },
      {
        "id": "kochi-hotel-10-fragrant-nature-kochi",
        "name": "Fragrant Nature Kochi",
        "locality": "Fort Kochi",
        "tier": "boutique",
        "stars": 5,
        "description": "Boutique heritage luxury hotel overlooking the backwaters in Fort Kochi.",
        "lat": 9.910209,
        "lng": 76.251817
      },
      {
        "id": "kochi-hotel-11-forte-kochi",
        "name": "Forte Kochi",
        "locality": "Princess Street, Fort Kochi",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Restored 19th-century luxury boutique heritage hotel in Princess Street.",
        "lat": 9.926876,
        "lng": 76.259696
      },
      {
        "id": "kochi-hotel-12-crowne-plaza-kochi",
        "name": "Crowne Plaza Kochi",
        "locality": "Kundannoor, Maradu",
        "tier": "luxury",
        "stars": 5,
        "description": "Five-star modern business hotel offering scenic backwater vistas.",
        "lat": 9.929844,
        "lng": 76.254202
      },
      {
        "id": "kochi-hotel-13-hotel-abad-plaza",
        "name": "Hotel Abad Plaza",
        "locality": "MG Road, Ernakulam",
        "tier": "comfort",
        "stars": 3,
        "description": "Established central business hotel in MG Road.",
        "lat": 9.936545,
        "lng": 76.250599
      },
      {
        "id": "kochi-hotel-14-bolgatty-palace-heritage-hotel",
        "name": "Bolgatty Palace Heritage Hotel",
        "locality": "Bolgatty Island",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Historic 18th-century Dutch mansion operated as a heritage resort.",
        "lat": 9.945668,
        "lng": 76.250988
      },
      {
        "id": "kochi-hotel-15-old-harbour-hotel",
        "name": "Old Harbour Hotel",
        "locality": "Fort Kochi",
        "tier": "boutique",
        "stars": 4,
        "description": "Charming heritage boutique hotel set in a 300-year-old building.",
        "lat": 9.954903,
        "lng": 76.256586
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "kochi-rest-veg-1-dhe-puttu",
          "name": "Dhe Puttu",
          "locality": "Edappally",
          "type": "veg",
          "cuisine": "Traditional Kerala Cuisine",
          "specialties": "Famous for traditional Kerala puttu variations",
          "lat": 9.926827,
          "lng": 76.264074
        },
        {
          "id": "kochi-rest-veg-2-anand-bhavan",
          "name": "Anand Bhavan",
          "locality": "Mattancherry",
          "type": "veg",
          "cuisine": "Pure Veg South Indian",
          "specialties": "Pure veg South Indian tiffin, meals, and filter coffee",
          "lat": 9.926032,
          "lng": 76.260958
        }
      ],
      "nonVeg": [
        {
          "id": "kochi-rest-nonveg-1-rice-boat",
          "name": "Rice Boat",
          "locality": "Taj Malabar, Willingdon Island",
          "type": "non-veg",
          "cuisine": "Kerala Seafood",
          "specialties": "Floating seafood restaurant specializing in fresh catch",
          "lat": 9.928668,
          "lng": 76.253824
        },
        {
          "id": "kochi-rest-nonveg-2-fort-house-restaurant",
          "name": "Fort House Restaurant",
          "locality": "Calvathy Road, Fort Kochi",
          "type": "non-veg",
          "cuisine": "Kerala Coastal",
          "specialties": "Kerala fish curry overlooking the harbor",
          "lat": 9.932218,
          "lng": 76.25087
        }
      ]
    },
    "attractions": [
      {
        "id": "kochi-att-1-chinese-fishing-nets-fort-kochi-beach",
        "name": "Chinese Fishing Nets & Fort Kochi Beach",
        "category": "Maritime Heritage",
        "description": "Iconic cantilevered shore-operated fishing nets.",
        "isHiddenGem": false,
        "lat": 9.92894,
        "lng": 76.24547
      },
      {
        "id": "kochi-att-2-mattancherry-palace-dutch-palace-",
        "name": "Mattancherry Palace (Dutch Palace)",
        "category": "Palaces & Murals",
        "description": "16th-century palace renowned for Hindu epic mural paintings.",
        "isHiddenGem": false,
        "lat": 9.934025,
        "lng": 76.240012
      },
      {
        "id": "kochi-att-3-paradesi-synagogue-jew-town",
        "name": "Paradesi Synagogue & Jew Town",
        "category": "Historic Shrines",
        "description": "Oldest active Commonwealth synagogue featuring hand-painted Chinese tiles.",
        "isHiddenGem": false,
        "lat": 9.941222,
        "lng": 76.235986
      },
      {
        "id": "kochi-att-4-santa-cruz-cathedral-basilica",
        "name": "Santa Cruz Cathedral Basilica",
        "category": "Heritage Cathedrals",
        "description": "Fine heritage church showcasing bright pastel interiors and Gothic arches.",
        "isHiddenGem": true,
        "lat": 9.936605,
        "lng": 76.257795
      },
      {
        "id": "kochi-att-5-mangalavanam-bird-sanctuary",
        "name": "Mangalavanam Bird Sanctuary",
        "category": "Nature Reserves",
        "description": "Protected tidal wetland bird sanctuary in the urban center.",
        "isHiddenGem": true,
        "lat": 9.942051,
        "lng": 76.255066
      }
    ]
  },
  {
    "id": "srinagar",
    "code": "IN-JK-SRA-FULL",
    "name": "Srinagar",
    "state": "Jammu & Kashmir",
    "zone": "Himalaya",
    "lat": 34.0837,
    "lng": 74.7973,
    "flashcardBlurb": "The enchanting summer capital of Jammu & Kashmir nestled in the Kashmir Valley, renowned for its iconic Dal Lake houseboats, shikaras, terraced Mughal gardens, and Kashmiri Wazwan.",
    "hotels": [
      {
        "id": "srinagar-hotel-1-the-lalit-grand-palace-srinagar",
        "name": "The LaLiT Grand Palace Srinagar",
        "locality": "Gupkar Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Historic former palace nestled against the Zabarwan hills overlooking Dal Lake.",
        "lat": 34.092349,
        "lng": 74.7973
      },
      {
        "id": "srinagar-hotel-2-vivanta-dal-view-srinagar",
        "name": "Vivanta Dal View Srinagar",
        "locality": "Kralsangri, Brein",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Luxury hillside hotel offering breathtaking panoramic views over Dal Lake.",
        "lat": 34.095551,
        "lng": 74.803671
      },
      {
        "id": "srinagar-hotel-3-houseboat-wangnoo-heritage",
        "name": "Houseboat Wangnoo Heritage",
        "locality": "Dal Lake",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Premium traditional carved cedarwood luxury houseboat experience.",
        "lat": 34.095274,
        "lng": 74.812821
      },
      {
        "id": "srinagar-hotel-4-radisson-srinagar",
        "name": "Radisson Srinagar",
        "locality": "Sonawar Bagh",
        "tier": "luxury",
        "stars": 5,
        "description": "Modern upscale hotel offering comfortable business and leisure amenities.",
        "lat": 34.090381,
        "lng": 74.822128
      },
      {
        "id": "srinagar-hotel-5-four-points-by-sheraton-srinagar",
        "name": "Four Points by Sheraton Srinagar",
        "locality": "Badami Bagh",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary international hotel near government hubs and tourist sites.",
        "lat": 34.080988,
        "lng": 74.828456
      },
      {
        "id": "srinagar-hotel-6-hotel-broadway",
        "name": "Hotel Broadway",
        "locality": "Maulana Azad Road",
        "tier": "luxury",
        "stars": 4,
        "description": "Established legacy luxury hotel operating in Srinagar for decades.",
        "lat": 34.079376,
        "lng": 74.806343
      },
      {
        "id": "srinagar-hotel-7-rk-sarovar-portico-srinagar",
        "name": "RK Sarovar Portico Srinagar",
        "locality": "Gupkar Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Upscale modern hotel tailored for comfortable pilgrim and leisure stays.",
        "lat": 34.073205,
        "lng": 74.806507
      },
      {
        "id": "srinagar-hotel-8-hotel-grand-mumtaz",
        "name": "Hotel Grand Mumtaz",
        "locality": "Boulevard Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Well-established hotel located right along the Dal Lake promenade.",
        "lat": 34.066781,
        "lng": 74.801642
      },
      {
        "id": "srinagar-hotel-9-mascot-houseboats",
        "name": "Mascot Houseboats",
        "locality": "Dal Lake, Nagin Lake",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Luxury floating heritage accommodations featuring hand-carved walnut woodwork.",
        "lat": 34.062551,
        "lng": 74.791872
      },
      {
        "id": "srinagar-hotel-10-shelter-group-of-houseboats",
        "name": "Shelter Group of Houseboats",
        "locality": "Nigeen Lake",
        "tier": "boutique",
        "stars": 4,
        "description": "Peaceful luxury houseboats anchored on the tranquil waters of Nigeen Lake.",
        "lat": 34.062709,
        "lng": 74.778886
      },
      {
        "id": "srinagar-hotel-11-hotel-pine-spring-srinagar",
        "name": "Hotel Pine Spring Srinagar",
        "locality": "Humhama",
        "tier": "comfort",
        "stars": 3,
        "description": "Comfortable mid-scale hotel offering warm Kashmiri hospitality.",
        "lat": 34.079376,
        "lng": 74.788257
      },
      {
        "id": "srinagar-hotel-12-heritage-luxury-houseboat",
        "name": "Heritage Luxury Houseboat",
        "locality": "Dal Lake Jetty",
        "tier": "boutique",
        "stars": 4,
        "description": "Premium traditional floating stay with modern heating and ensuite baths.",
        "lat": 34.082344,
        "lng": 74.781722
      },
      {
        "id": "srinagar-hotel-13-hotel-city-grace",
        "name": "Hotel City Grace",
        "locality": "Rajbagh",
        "tier": "comfort",
        "stars": 3,
        "description": "Contemporary boutique city stay close to central commercial markets.",
        "lat": 34.089045,
        "lng": 74.777437
      },
      {
        "id": "srinagar-hotel-14-hotel-akbar-international",
        "name": "Hotel Akbar International",
        "locality": "Dal Lake Boulevard",
        "tier": "comfort",
        "stars": 3,
        "description": "Established leisure hotel offering spacious rooms and dining.",
        "lat": 34.098168,
        "lng": 74.777899
      },
      {
        "id": "srinagar-hotel-15-hotel-heevan-srinagar",
        "name": "Hotel Heevan Srinagar",
        "locality": "Shalimar Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Scenic hotel located close to the historic Mughal gardens.",
        "lat": 34.107403,
        "lng": 74.784558
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "srinagar-rest-veg-1-ahdoos-bakery",
          "name": "Ahdoos Bakery",
          "locality": "Regal Chowk",
          "type": "veg",
          "cuisine": "Kashmiri Bakes & Tearoom",
          "specialties": "Traditional Kashmiri bakery, roasted breads, and vegetarian snacks",
          "lat": 34.079327,
          "lng": 74.793464
        }
      ],
      "nonVeg": [
        {
          "id": "srinagar-rest-nonveg-1-mughal-darbar",
          "name": "Mughal Darbar",
          "locality": "Residency Road",
          "type": "non-veg",
          "cuisine": "Kashmiri Wazwan",
          "specialties": "Legendary Kashmiri Wazwan serving Rogan Josh, Rista, and Tabakh Maaz",
          "lat": 34.081168,
          "lng": 74.781273
        },
        {
          "id": "srinagar-rest-nonveg-2-ahdoos-restaurant",
          "name": "Ahdoos Restaurant",
          "locality": "Regal Chowk",
          "type": "non-veg",
          "cuisine": "Authentic Wazwan",
          "specialties": "Authentic Wazwan and multi-cuisine heritage preparations",
          "lat": 34.084718,
          "lng": 74.777759
        }
      ]
    },
    "attractions": [
      {
        "id": "srinagar-att-1-dal-lake-shikara-ride",
        "name": "Dal Lake & Shikara Ride",
        "category": "Lakes & Waterways",
        "description": "Expansive urban lake famous for floating flower markets and houseboats.",
        "isHiddenGem": false,
        "lat": 34.08144,
        "lng": 74.771337
      },
      {
        "id": "srinagar-att-2-mughal-gardens-shalimar-bagh-nishat-bagh-",
        "name": "Mughal Gardens (Shalimar Bagh & Nishat Bagh)",
        "category": "Terraced Gardens",
        "description": "17th-century terraced imperial gardens with fountains and water channels.",
        "isHiddenGem": false,
        "lat": 34.086525,
        "lng": 74.764846
      },
      {
        "id": "srinagar-att-3-shankaracharya-temple",
        "name": "Shankaracharya Temple",
        "category": "Spiritual",
        "description": "Ancient hilltop stone temple offering panoramic bird's-eye views over Srinagar.",
        "isHiddenGem": false,
        "lat": 34.093722,
        "lng": 74.760057
      },
      {
        "id": "srinagar-att-4-pari-mahal",
        "name": "Pari Mahal",
        "category": "Observatory & Terraces",
        "description": "Seven-terraced garden and historic observatory built by Mughal Prince Dara Shikoh.",
        "isHiddenGem": true,
        "lat": 34.089105,
        "lng": 74.785996
      },
      {
        "id": "srinagar-att-5-hazratbal-shrine",
        "name": "Hazratbal Shrine",
        "category": "Spiritual",
        "description": "Revered mosque on the western shore of Dal Lake housing a sacred Islamic relic.",
        "isHiddenGem": true,
        "lat": 34.094551,
        "lng": 74.78275
      }
    ]
  },
  {
    "id": "leh",
    "code": "IN-LA-LEH-FULL",
    "name": "Leh (Ladakh)",
    "state": "Ladakh",
    "zone": "Himalaya",
    "lat": 34.1526,
    "lng": 77.5771,
    "flashcardBlurb": "The high-altitude desert capital of Ladakh, surrounded by rugged snow-capped mountain ranges, ancient Tibetan Buddhist monasteries, and vibrant Himalayan culture.",
    "hotels": [
      {
        "id": "leh-hotel-1-the-grand-dragon-ladakh",
        "name": "The Grand Dragon Ladakh",
        "locality": "Sheynam",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Luxury mountain comfort combining modern amenities with traditional Ladakhi art.",
        "lat": 34.161249,
        "lng": 77.5771
      },
      {
        "id": "leh-hotel-2-chamba-camp-thiksey",
        "name": "Chamba Camp Thiksey",
        "locality": "Thiksey Valley",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Ultra-luxury tented camp set amidst the stunning landscapes of Thiksey valley.",
        "lat": 34.164451,
        "lng": 77.583476
      },
      {
        "id": "leh-hotel-3-the-abduz",
        "name": "The Abduz",
        "locality": "Old Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary boutique luxury hotel reflecting authentic Ladakhi heritage design.",
        "lat": 34.164174,
        "lng": 77.592633
      },
      {
        "id": "leh-hotel-4-hotel-spic-n-span",
        "name": "Hotel Spic N Span",
        "locality": "Old Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Well-established upscale hotel known for comfortable altitude hospitality.",
        "lat": 34.159281,
        "lng": 77.601949
      },
      {
        "id": "leh-hotel-5-gomang-boutique-hotel",
        "name": "Gomang Boutique Hotel",
        "locality": "Upper Changspa",
        "tier": "boutique",
        "stars": 4,
        "description": "Intimate luxury boutique hotel featuring traditional woodwork and cozy courtyards.",
        "lat": 34.149888,
        "lng": 77.608281
      },
      {
        "id": "leh-hotel-6-lehchen-hotel",
        "name": "Lehchen Hotel",
        "locality": "Fort Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Modern upscale hotel offering panoramic mountain views and refined dining.",
        "lat": 34.148276,
        "lng": 77.586151
      },
      {
        "id": "leh-hotel-7-ladakh-sarai-resort",
        "name": "Ladakh Sarai Resort",
        "locality": "Spituk",
        "tier": "boutique",
        "stars": 4,
        "description": "Eco-friendly resort cottages set amidst scenic apricot orchards.",
        "lat": 34.142105,
        "lng": 77.586314
      },
      {
        "id": "leh-hotel-8-hotel-zen-ladakh",
        "name": "Hotel Zen Ladakh",
        "locality": "Sheynam",
        "tier": "luxury",
        "stars": 4,
        "description": "Traditional Ladakhi-style hotel with tranquil garden courtyards.",
        "lat": 34.135681,
        "lng": 77.581446
      },
      {
        "id": "leh-hotel-9-hotel-omasila",
        "name": "Hotel Omasila",
        "locality": "Changspa",
        "tier": "comfort",
        "stars": 3,
        "description": "Established mid-scale hotel offering warm hospitality and valley views.",
        "lat": 34.131451,
        "lng": 77.571668
      },
      {
        "id": "leh-hotel-10-stok-palace-heritage-hotel",
        "name": "Stok Palace Heritage Hotel",
        "locality": "Stok Village",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Authentic royal heritage stay located within the historic Stok Palace.",
        "lat": 34.131609,
        "lng": 77.558671
      },
      {
        "id": "leh-hotel-11-hotel-singge-palace",
        "name": "Hotel Singge Palace",
        "locality": "Old Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Comfortable central hotel close to Leh Main Bazaar.",
        "lat": 34.148276,
        "lng": 77.568049
      },
      {
        "id": "leh-hotel-12-hotel-shanti",
        "name": "Hotel Shanti",
        "locality": "Shanti Stupa Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Peaceful hotel located near the foothills of Shanti Stupa.",
        "lat": 34.151244,
        "lng": 77.561509
      },
      {
        "id": "leh-hotel-13-hotel-lasermo",
        "name": "Hotel Lasermo",
        "locality": "Chulungs",
        "tier": "comfort",
        "stars": 3,
        "description": "Traditional family-run hotel offering cozy rooms and hearty meals.",
        "lat": 34.157945,
        "lng": 77.557221
      },
      {
        "id": "leh-hotel-14-ladakh-residency",
        "name": "Ladakh Residency",
        "locality": "Kyagar, Changspa",
        "tier": "upscale",
        "stars": 4,
        "description": "Well-located upscale hotel offering modern amenities and scenic terraces.",
        "lat": 34.167068,
        "lng": 77.557684
      },
      {
        "id": "leh-hotel-15-hotel-spituk-palace",
        "name": "Hotel Spituk Palace",
        "locality": "Spituk",
        "tier": "comfort",
        "stars": 3,
        "description": "Quiet suburban hotel offering comfortable transit and leisure stays.",
        "lat": 34.176303,
        "lng": 77.564348
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "leh-rest-veg-1-gesmo-restaurant",
          "name": "Gesmo Restaurant",
          "locality": "Main Bazaar",
          "type": "veg",
          "cuisine": "Tibetan & Bakery",
          "specialties": "Popular bakery, wood-fired pizzas, and vegetarian Tibetan dishes",
          "lat": 34.148227,
          "lng": 77.573261
        },
        {
          "id": "leh-rest-veg-2-open-hand-cafe",
          "name": "Open Hand Cafe",
          "locality": "Zangsti",
          "type": "veg",
          "cuisine": "Artisan Cafe",
          "specialties": "Artistic cafe serving coffee and vegetarian grain bowls",
          "lat": 34.147432,
          "lng": 77.569551
        }
      ],
      "nonVeg": [
        {
          "id": "leh-rest-nonveg-1-chopsticks-restaurant",
          "name": "Chopsticks Restaurant",
          "locality": "Main Bazaar",
          "type": "non-veg",
          "cuisine": "Ladakhi & Tibetan",
          "specialties": "Authentic momos, thukpa, and Ladakhi meat specialties",
          "lat": 34.150068,
          "lng": 77.56106
        },
        {
          "id": "leh-rest-nonveg-2-the-grand-dragon-restaurant",
          "name": "The Grand Dragon Restaurant",
          "locality": "Sheynam",
          "type": "non-veg",
          "cuisine": "Ladakhi & Multi-Cuisine",
          "specialties": "Fine dining serving regional yak meat and multi-cuisine fare",
          "lat": 34.153618,
          "lng": 77.557543
        }
      ]
    },
    "attractions": [
      {
        "id": "leh-att-1-shanti-stupa",
        "name": "Shanti Stupa",
        "category": "Buddhist Monuments",
        "description": "White-domed Buddhist stupa on a hilltop offering stunning sunset panoramas.",
        "isHiddenGem": false,
        "lat": 34.15034,
        "lng": 77.551116
      },
      {
        "id": "leh-att-2-leh-palace",
        "name": "Leh Palace",
        "category": "Palaces & Forts",
        "description": "17th-century former royal palace modeled after the Potala Palace in Lhasa.",
        "isHiddenGem": false,
        "lat": 34.155425,
        "lng": 77.54462
      },
      {
        "id": "leh-att-3-thiksey-monastery",
        "name": "Thiksey Monastery",
        "category": "Monasteries",
        "description": "Twelve-story monastic complex housing a towering 49-foot Maitreya Buddha statue.",
        "isHiddenGem": false,
        "lat": 34.162622,
        "lng": 77.539827
      },
      {
        "id": "leh-att-4-hall-of-fame-museum",
        "name": "Hall of Fame Museum",
        "category": "Military & History",
        "description": "Museum maintained by the Indian Army showcasing Ladakhi culture and history.",
        "isHiddenGem": true,
        "lat": 34.158005,
        "lng": 77.565786
      },
      {
        "id": "leh-att-5-stok-palace-museum",
        "name": "Stok Palace Museum",
        "category": "Royal Museum",
        "description": "Current residence of the royal family showcasing royal artifacts and thangkas.",
        "isHiddenGem": true,
        "lat": 34.163451,
        "lng": 77.562538
      }
    ]
  },
  {
    "id": "guwahati",
    "code": "IN-AS-GHY-FULL",
    "name": "Guwahati",
    "state": "Assam",
    "zone": "Northeast",
    "lat": 26.1445,
    "lng": 91.7362,
    "flashcardBlurb": "The bustling gateway to Northeast India set along the majestic Brahmaputra River, famed for ancient hill shrines, wildlife reserves, and rich Assamese cultural traditions.",
    "hotels": [
      {
        "id": "guwahati-hotel-1-radisson-blu-hotel-guwahati",
        "name": "Radisson Blu Hotel Guwahati",
        "locality": "NH 37, Gotanagar",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Luxury hillside hotel offering panoramic views, fine dining, and spa facilities.",
        "lat": 26.153149,
        "lng": 91.7362
      },
      {
        "id": "guwahati-hotel-2-vivanta-guwahati",
        "name": "Vivanta Guwahati",
        "locality": "Khanapara, GS Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Premium contemporary luxury hotel showcasing Assamese artistic touches.",
        "lat": 26.156351,
        "lng": 91.742078
      },
      {
        "id": "guwahati-hotel-3-novotel-guwahati-gs-road",
        "name": "Novotel Guwahati GS Road",
        "locality": "GS Road, Dispur",
        "tier": "luxury",
        "stars": 5,
        "description": "Upscale international business hotel with vibrant co-working spaces.",
        "lat": 26.156074,
        "lng": 91.750519
      },
      {
        "id": "guwahati-hotel-4-hotel-brahmaputra-ashok",
        "name": "Hotel Brahmaputra Ashok",
        "locality": "MG Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Scenic hotel overlooking the mighty Brahmaputra River.",
        "lat": 26.151181,
        "lng": 91.759107
      },
      {
        "id": "guwahati-hotel-5-hotel-gateway-grandeur",
        "name": "Hotel Gateway Grandeur",
        "locality": "Christian Basti",
        "tier": "upscale",
        "stars": 4,
        "description": "Upscale business hotel in the commercial heart of Guwahati.",
        "lat": 26.141788,
        "lng": 91.764945
      },
      {
        "id": "guwahati-hotel-6-kiranshree-grand",
        "name": "Kiranshree Grand",
        "locality": "Airport Road, Azara",
        "tier": "luxury",
        "stars": 5,
        "description": "Sprawling luxury resort and convention property near the airport.",
        "lat": 26.140176,
        "lng": 91.744544
      },
      {
        "id": "guwahati-hotel-7-hotel-dynasty",
        "name": "Hotel Dynasty",
        "locality": "SS Road, Lakhtokia, Paltan Bazar",
        "tier": "upscale",
        "stars": 4,
        "description": "Central business hotel located close to the railway station.",
        "lat": 26.134005,
        "lng": 91.744694
      },
      {
        "id": "guwahati-hotel-8-hotel-prag-continental",
        "name": "Hotel Prag Continental",
        "locality": "Pan Bazar",
        "tier": "comfort",
        "stars": 3,
        "description": "Well-established hotel offering comfortable transit and corporate stays.",
        "lat": 26.127581,
        "lng": 91.740206
      },
      {
        "id": "guwahati-hotel-9-hotel-star-field",
        "name": "Hotel Star Field",
        "locality": "GS Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Modern mid-scale hotel with banquet and dining facilities.",
        "lat": 26.123351,
        "lng": 91.731192
      },
      {
        "id": "guwahati-hotel-10-hotel-lily",
        "name": "Hotel Lily",
        "locality": "GS Road, Khanapara",
        "tier": "upscale",
        "stars": 4,
        "description": "Established city hotel known for banquet halls and traditional hospitality.",
        "lat": 26.123509,
        "lng": 91.719211
      },
      {
        "id": "guwahati-hotel-11-hotel-lilawati-grand",
        "name": "Hotel Lilawati Grand",
        "locality": "Paltan Bazar",
        "tier": "comfort",
        "stars": 3,
        "description": "Contemporary urban hotel offering clean business accommodations.",
        "lat": 26.140176,
        "lng": 91.727856
      },
      {
        "id": "guwahati-hotel-12-hotel-raj-palace",
        "name": "Hotel Raj Palace",
        "locality": "Zoo Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Comfortable central hotel close to major city attractions.",
        "lat": 26.143144,
        "lng": 91.721828
      },
      {
        "id": "guwahati-hotel-13-landmark-hotel",
        "name": "Landmark Hotel",
        "locality": "Dr B Baruah Road, Ulubari",
        "tier": "comfort",
        "stars": 3,
        "description": "Accessible mid-scale hotel with multi-cuisine dining options.",
        "lat": 26.149845,
        "lng": 91.717874
      },
      {
        "id": "guwahati-hotel-14-hotel-nandan",
        "name": "Hotel Nandan",
        "locality": "GS Road, Paltan Bazar",
        "tier": "comfort",
        "stars": 3,
        "description": "Established legacy hotel offering reliable transit stay.",
        "lat": 26.158968,
        "lng": 91.718301
      },
      {
        "id": "guwahati-hotel-15-hotel-kiranshree-portico",
        "name": "Hotel Kiranshree Portico",
        "locality": "Paltan Bazar",
        "tier": "upscale",
        "stars": 4,
        "description": "Convenient business hotel located near central transport hubs.",
        "lat": 26.168203,
        "lng": 91.724444
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "guwahati-rest-veg-1-caf-b-direct",
          "name": "Café B Direct",
          "locality": "GS Road",
          "type": "veg",
          "cuisine": "Continental & Indian Veg",
          "specialties": "Continental and North Indian veg snacks and coffee",
          "lat": 26.140127,
          "lng": 91.732661
        }
      ],
      "nonVeg": [
        {
          "id": "guwahati-rest-nonveg-1-paradise-restaurant",
          "name": "Paradise Restaurant",
          "locality": "Maniram Dewan Road, Pan Bazar",
          "type": "non-veg",
          "cuisine": "Traditional Assamese Thali",
          "specialties": "Legendary traditional Assamese thalis featuring local fish curries and duck meat",
          "lat": 26.141968,
          "lng": 91.721413
        },
        {
          "id": "guwahati-rest-nonveg-2-khorikaa",
          "name": "Khorikaa",
          "locality": "GS Road, Ulubari",
          "type": "non-veg",
          "cuisine": "Assamese Indigenous Barbecue",
          "specialties": "Authentic Assamese tribal and non-veg barbecue specialties",
          "lat": 26.145518,
          "lng": 91.718171
        }
      ]
    },
    "attractions": [
      {
        "id": "guwahati-att-1-kamakhya-temple",
        "name": "Kamakhya Temple",
        "category": "Shakti Peethas",
        "description": "Revered hill shrine and Shakti Peetha on Nilachal Hill.",
        "isHiddenGem": false,
        "lat": 26.14224,
        "lng": 91.712246
      },
      {
        "id": "guwahati-att-2-umananda-island-temple",
        "name": "Umananda Island & Temple",
        "category": "River Islands",
        "description": "World's smallest inhabited river island housing a Shiva temple.",
        "isHiddenGem": false,
        "lat": 26.147325,
        "lng": 91.706257
      },
      {
        "id": "guwahati-att-3-srimanta-sankaradeva-kalakshetra",
        "name": "Srimanta Sankaradeva Kalakshetra",
        "category": "Cultural Centers",
        "description": "Cultural complex preserving Assamese performing arts and tribal artifacts.",
        "isHiddenGem": false,
        "lat": 26.154522,
        "lng": 91.701839
      },
      {
        "id": "guwahati-att-4-pobitora-wildlife-sanctuary",
        "name": "Pobitora Wildlife Sanctuary",
        "category": "Wildlife Sanctuaries",
        "description": "Wetland sanctuary boasting the world's highest density of One-Horned Rhinos (40 km away).",
        "isHiddenGem": true,
        "lat": 26.149905,
        "lng": 91.72577
      },
      {
        "id": "guwahati-att-5-basistha-ashram",
        "name": "Basistha Ashram",
        "category": "Sacred Hermitages",
        "description": "Peaceful ancient ashram and waterfall nestled in the foothills of the Meghalaya plateau.",
        "isHiddenGem": true,
        "lat": 26.155351,
        "lng": 91.722775
      }
    ]
  },
  {
    "id": "darjeeling",
    "code": "IN-WB-DJL-FULL",
    "name": "Darjeeling",
    "state": "West Bengal",
    "zone": "Himalaya",
    "lat": 27.041,
    "lng": 88.2663,
    "flashcardBlurb": "The legendary \"Queen of the Himalayas,\" cradled in high mountain ridges surrounded by emerald-green tea plantations, colonial charm, and panoramic views of Kanchenjunga.",
    "hotels": [
      {
        "id": "darjeeling-hotel-1-mayfair-darjeeling",
        "name": "Mayfair Darjeeling",
        "locality": "The Mall, Opposite Governor House",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Heritage luxury retreat offering colonial architecture and panoramic valley views.",
        "lat": 27.049649,
        "lng": 88.2663
      },
      {
        "id": "darjeeling-hotel-2-the-elgin-darjeeling",
        "name": "The Elgin Darjeeling",
        "locality": "HD Lama Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Historic 187-year-old heritage hotel reflecting the grandeur of the British Raj.",
        "lat": 27.052851,
        "lng": 88.272224
      },
      {
        "id": "darjeeling-hotel-3-sinclairs-darjeeling",
        "name": "Sinclairs Darjeeling",
        "locality": "Gandhi Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Mountain-view upscale hotel surrounded by pine trees.",
        "lat": 27.052574,
        "lng": 88.280732
      },
      {
        "id": "darjeeling-hotel-4-windamere-hotel",
        "name": "Windamere Hotel",
        "locality": "Observatory Hill",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Legendary heritage hotel preserving authentic 19th-century colonial hilltop charm.",
        "lat": 27.047681,
        "lng": 88.289387
      },
      {
        "id": "darjeeling-hotel-5-villa-everest",
        "name": "Villa Everest",
        "locality": "Gandhi Road",
        "tier": "boutique",
        "stars": 4,
        "description": "Historic boutique heritage villa offering intimate mountain hospitality.",
        "lat": 27.038288,
        "lng": 88.295271
      },
      {
        "id": "darjeeling-hotel-6-central-heritage-resort",
        "name": "Central Heritage Resort",
        "locality": "HD Lama Road",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Traditional heritage-styled hotel close to Chowrasta Mall.",
        "lat": 27.036676,
        "lng": 88.274709
      },
      {
        "id": "darjeeling-hotel-7-hotel-viceroy",
        "name": "Hotel Viceroy",
        "locality": "Gandhi Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Mountain-facing upscale hotel offering classic Victorian-style architecture.",
        "lat": 27.030505,
        "lng": 88.274861
      },
      {
        "id": "darjeeling-hotel-8-summit-swiss-hotel",
        "name": "Summit Swiss Hotel",
        "locality": "Near Mall",
        "tier": "boutique",
        "stars": 4,
        "description": "Cozy boutique hotel featuring wooden interiors and warm mountain hospitality.",
        "lat": 27.024081,
        "lng": 88.270338
      },
      {
        "id": "darjeeling-hotel-9-cedar-inn",
        "name": "Cedar Inn",
        "locality": "Dr. Zakir Hussain Road",
        "tier": "boutique",
        "stars": 4,
        "description": "Scenic eco-friendly hotel offering unobstructed views of the Kanchenjunga range.",
        "lat": 27.019851,
        "lng": 88.261253
      },
      {
        "id": "darjeeling-hotel-10-heritage-park-hotel",
        "name": "Heritage Park Hotel",
        "locality": "Chowrasta Mall",
        "tier": "comfort",
        "stars": 3,
        "description": "Peaceful property set amidst landscaped gardens near the town center.",
        "lat": 27.020009,
        "lng": 88.249178
      },
      {
        "id": "darjeeling-hotel-11-hotel-mount-rosa",
        "name": "Hotel Mount Rosa",
        "locality": "HD Lama Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Established mid-scale hotel offering comfortable rooms and valley vistas.",
        "lat": 27.036676,
        "lng": 88.257891
      },
      {
        "id": "darjeeling-hotel-12-hotel-sinclairs-retreat",
        "name": "Hotel Sinclairs Retreat",
        "locality": "Gandhi Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Relaxing mountain-side property offering family-friendly leisure amenities.",
        "lat": 27.039644,
        "lng": 88.251815
      },
      {
        "id": "darjeeling-hotel-13-hotel-shangri-la",
        "name": "Hotel Shangri-La",
        "locality": "Nehru Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Traditional hotel located near the vibrant market squares.",
        "lat": 27.046345,
        "lng": 88.24783
      },
      {
        "id": "darjeeling-hotel-14-hotel-sterling-darjeeling",
        "name": "Hotel Sterling Darjeeling",
        "locality": "Ghoom Monastery Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Contemporary mountain resort offering guided nature walks and spa facilities.",
        "lat": 27.055468,
        "lng": 88.24826
      },
      {
        "id": "darjeeling-hotel-15-glenary-s-bakery-lodge",
        "name": "Glenary's Bakery & Lodge",
        "locality": "Nehru Road, The Mall",
        "tier": "boutique",
        "stars": 3,
        "description": "Historic bakery lodge offering cozy rooms right above the iconic tearoom.",
        "lat": 27.064703,
        "lng": 88.254452
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "darjeeling-rest-veg-1-glenary-s-bakery",
          "name": "Glenary's Bakery",
          "locality": "The Mall",
          "type": "veg",
          "cuisine": "Colonial Bakery & Cafe",
          "specialties": "Iconic colonial bakery for warm pastries, pies, and coffee",
          "lat": 27.036627,
          "lng": 88.262733
        },
        {
          "id": "darjeeling-rest-veg-2-keventer-s",
          "name": "Keventer's",
          "locality": "Clubside, Nehru Road",
          "type": "veg",
          "cuisine": "British Hill Cafe",
          "specialties": "Famous for English breakfasts, sausages, and hot chocolate",
          "lat": 27.035832,
          "lng": 88.259286
        }
      ],
      "nonVeg": [
        {
          "id": "darjeeling-rest-nonveg-1-kunga-restaurant",
          "name": "Kunga Restaurant",
          "locality": "Chowdhary Lane, Gandhi Road",
          "type": "non-veg",
          "cuisine": "Tibetan Specialties",
          "specialties": "Authentic Tibetan momos, thukpa, and beef/pork noodles",
          "lat": 27.038468,
          "lng": 88.251397
        },
        {
          "id": "darjeeling-rest-nonveg-2-glenary-s-restaurant",
          "name": "Glenary's Restaurant",
          "locality": "Nehru Road",
          "type": "non-veg",
          "cuisine": "Continental & Anglo-Indian",
          "specialties": "Multi-cuisine sizzlers and non-veg dishes with live music",
          "lat": 27.042018,
          "lng": 88.248129
        }
      ]
    },
    "attractions": [
      {
        "id": "darjeeling-att-1-tiger-hill-sunrise-view",
        "name": "Tiger Hill Sunrise View",
        "category": "Vantage Points",
        "description": "Vantage point at 2,590 meters offering dawn views of Mount Kanchenjunga.",
        "isHiddenGem": false,
        "lat": 27.03874,
        "lng": 88.242158
      },
      {
        "id": "darjeeling-att-2-batasia-loop-toy-train",
        "name": "Batasia Loop & Toy Train",
        "category": "UNESCO Mountain Railway",
        "description": "Spiraling railway loop of the Darjeeling Himalayan Railway.",
        "isHiddenGem": false,
        "lat": 27.043825,
        "lng": 88.236122
      },
      {
        "id": "darjeeling-att-3-himalayan-mountaineering-institute-zoo",
        "name": "Himalayan Mountaineering Institute & Zoo",
        "category": "Mountaineering & Fauna",
        "description": "Museum and rescue center housing red pandas and mountaineering gear.",
        "isHiddenGem": false,
        "lat": 27.051022,
        "lng": 88.231669
      },
      {
        "id": "darjeeling-att-4-happy-valley-tea-estate",
        "name": "Happy Valley Tea Estate",
        "category": "Tea Plantations",
        "description": "One of Darjeeling's oldest operating tea gardens offering guided estate walks.",
        "isHiddenGem": true,
        "lat": 27.046405,
        "lng": 88.255788
      },
      {
        "id": "darjeeling-att-5-japanese-peace-pagoda",
        "name": "Japanese Peace Pagoda",
        "category": "Spiritual Stupas",
        "description": "Serene Buddhist stupa promoting world peace, offering meditation spaces.",
        "isHiddenGem": true,
        "lat": 27.051851,
        "lng": 88.25277
      }
    ]
  },
  {
    "id": "gangtok",
    "code": "IN-SK-GTK-FULL",
    "name": "Gangtok",
    "state": "Sikkim",
    "zone": "Himalaya",
    "lat": 27.3389,
    "lng": 88.6065,
    "flashcardBlurb": "The picturesque Himalayan capital of Sikkim nestled in the clouds, famous for sweeping mountain vistas, vibrant monasteries, orchid sanctuaries, and bustling pedestrian bazaars.",
    "hotels": [
      {
        "id": "gangtok-hotel-1-mayfair-spa-resort-casino",
        "name": "Mayfair Spa Resort & Casino",
        "locality": "Ranipool",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Palatial luxury resort set amidst lush forest ravines, featuring a grand spa and casino.",
        "lat": 27.347549,
        "lng": 88.6065
      },
      {
        "id": "gangtok-hotel-2-the-elgin-nor-khill",
        "name": "The Elgin Nor-Khill",
        "locality": "Paljor Stadium Road",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Historic heritage luxury hotel built in 1932, reflecting traditional Sikkimese royal architecture.",
        "lat": 27.350751,
        "lng": 88.61244
      },
      {
        "id": "gangtok-hotel-3-vivanta-gangtok-tashiling",
        "name": "Vivanta Gangtok, Tashiling",
        "locality": "Pangthang Road",
        "tier": "luxury",
        "stars": 5,
        "description": "Contemporary luxury hotel offering panoramic views over the valley and hills.",
        "lat": 27.350474,
        "lng": 88.620971
      },
      {
        "id": "gangtok-hotel-4-denzong-regency",
        "name": "Denzong Regency",
        "locality": "Development Area",
        "tier": "luxury",
        "stars": 5,
        "description": "Five-star luxury mountain hotel offering sweeping views of Mount Kanchenjunga.",
        "lat": 27.345581,
        "lng": 88.629649
      },
      {
        "id": "gangtok-hotel-5-lemon-tree-hotel-gangtok",
        "name": "Lemon Tree Hotel, Gangtok",
        "locality": "Palzor Stadium Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Vibrant upscale business and leisure hotel with modern amenities.",
        "lat": 27.336188,
        "lng": 88.635548
      },
      {
        "id": "gangtok-hotel-6-netuk-house",
        "name": "Netuk House",
        "locality": "Tibet Road",
        "tier": "boutique",
        "stars": 4,
        "description": "Charming family-run heritage boutique hotel showcasing traditional Sikkimese architecture.",
        "lat": 27.334576,
        "lng": 88.614932
      },
      {
        "id": "gangtok-hotel-7-hotel-tashi-delek",
        "name": "Hotel Tashi Delek",
        "locality": "MG Marg",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Established central hotel located right next to the vibrant pedestrian shopping hub.",
        "lat": 27.328405,
        "lng": 88.615084
      },
      {
        "id": "gangtok-hotel-8-hotel-mount-siniolchu",
        "name": "Hotel Mount Siniolchu",
        "locality": "Enchey Monastery Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Scenic hillside hotel offering unobstructed views of snow-capped peaks.",
        "lat": 27.321981,
        "lng": 88.610549
      },
      {
        "id": "gangtok-hotel-9-summit-ttaktsang-hotel",
        "name": "Summit Ttaktsang Hotel",
        "locality": "Palzor Stadium Road",
        "tier": "boutique",
        "stars": 4,
        "description": "Boutique mountain stay combining modern comforts with Sikkimese hospitality.",
        "lat": 27.317751,
        "lng": 88.601439
      },
      {
        "id": "gangtok-hotel-10-the-fern-denzong-hotel-spa",
        "name": "The Fern Denzong Hotel & Spa",
        "locality": "Kazi Road",
        "tier": "upscale",
        "stars": 4,
        "description": "Eco-sensitive upscale hotel offering wellness facilities and scenic valley views.",
        "lat": 27.317909,
        "lng": 88.589332
      },
      {
        "id": "gangtok-hotel-11-hotel-golden-crest",
        "name": "Hotel Golden Crest",
        "locality": "Development Area",
        "tier": "comfort",
        "stars": 3,
        "description": "Comfortable central hotel located near local transport and markets.",
        "lat": 27.334576,
        "lng": 88.598068
      },
      {
        "id": "gangtok-hotel-12-hotel-bamboo-grove-retreat",
        "name": "Hotel Bamboo Grove Retreat",
        "locality": "Kazi Road",
        "tier": "boutique",
        "stars": 3,
        "description": "Eco-friendly boutique hotel set amidst quiet bamboo groves.",
        "lat": 27.337544,
        "lng": 88.591976
      },
      {
        "id": "gangtok-hotel-13-hotel-new-castle",
        "name": "Hotel New Castle",
        "locality": "Deorali",
        "tier": "comfort",
        "stars": 3,
        "description": "Modern mid-scale hotel offering clean and comfortable rooms.",
        "lat": 27.344245,
        "lng": 88.587981
      },
      {
        "id": "gangtok-hotel-14-hotel-mayal",
        "name": "Hotel Mayal",
        "locality": "Tibet Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Traditional hotel offering warm hospitality and local cuisine.",
        "lat": 27.353368,
        "lng": 88.588412
      },
      {
        "id": "gangtok-hotel-15-summit-golden-crescent-resort",
        "name": "Summit Golden Crescent Resort",
        "locality": "Chandmari",
        "tier": "upscale",
        "stars": 4,
        "description": "Upscale mountain resort offering spacious rooms and leisure amenities.",
        "lat": 27.362603,
        "lng": 88.59462
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "gangtok-rest-veg-1-baker-s-cafe",
          "name": "Baker's Cafe",
          "locality": "MG Marg",
          "type": "veg",
          "cuisine": "Himalayan Bakery & Cafe",
          "specialties": "Popular bakery for coffee, pastries, and continental bites",
          "lat": 27.334527,
          "lng": 88.602923
        },
        {
          "id": "gangtok-rest-veg-2-taste-of-tibet",
          "name": "Taste of Tibet",
          "locality": "MG Marg",
          "type": "veg",
          "cuisine": "Tibetan & Sikkimese",
          "specialties": "Renowned for authentic momos, thukpa, and vegetarian noodle bowls",
          "lat": 27.333732,
          "lng": 88.599467
        }
      ],
      "nonVeg": [
        {
          "id": "gangtok-rest-nonveg-1-nimtho",
          "name": "Nimtho",
          "locality": "MG Marg",
          "type": "non-veg",
          "cuisine": "Traditional Sikkimese & Nepali",
          "specialties": "Authentic traditional Sikkimese cuisine, thalis, and pork dishes",
          "lat": 27.336368,
          "lng": 88.591557
        },
        {
          "id": "gangtok-rest-nonveg-2-roll-house",
          "name": "Roll House",
          "locality": "MG Marg",
          "type": "non-veg",
          "cuisine": "Local Rolls & Street Bites",
          "specialties": "Famous for fresh parotta chicken and egg rolls",
          "lat": 27.339918,
          "lng": 88.588281
        }
      ]
    },
    "attractions": [
      {
        "id": "gangtok-att-1-mg-marg",
        "name": "MG Marg",
        "category": "Pedestrian Promenades",
        "description": "Vibrant pedestrian-only shopping and dining boulevard in the heart of Gangtok.",
        "isHiddenGem": false,
        "lat": 27.33664,
        "lng": 88.582293
      },
      {
        "id": "gangtok-att-2-rumtek-monastery",
        "name": "Rumtek Monastery",
        "category": "Tibetan Monasteries",
        "description": "Grand 16th-century seat of the Karmapa Lama showcasing exquisite Tibetan architecture.",
        "isHiddenGem": false,
        "lat": 27.341725,
        "lng": 88.576241
      },
      {
        "id": "gangtok-att-3-enchey-monastery",
        "name": "Enchey Monastery",
        "category": "Hilltop Monasteries",
        "description": "200-year-old secluded hilltop monastery surrounded by dense pine forests.",
        "isHiddenGem": false,
        "lat": 27.348922,
        "lng": 88.571777
      },
      {
        "id": "gangtok-att-4-banjhakri-falls-energy-park",
        "name": "Banjhakri Falls & Energy Park",
        "category": "Waterfalls & Folklore",
        "description": "Picturesque waterfall park featuring cascading streams and Sikkimese folklore statues.",
        "isHiddenGem": true,
        "lat": 27.344305,
        "lng": 88.59596
      },
      {
        "id": "gangtok-att-5-tsomgo-lake-changu-lake-",
        "name": "Tsomgo Lake (Changu Lake)",
        "category": "Glacial Lakes",
        "description": "Glacial high-altitude lake sacred to locals, situated at 12,310 feet (Excursion Hub).",
        "isHiddenGem": true,
        "lat": 27.349751,
        "lng": 88.592934
      }
    ]
  },
  {
    "id": "shillong",
    "code": "IN-ML-SHL-FULL",
    "name": "Shillong",
    "state": "Meghalaya",
    "zone": "Northeast",
    "lat": 25.5788,
    "lng": 91.8933,
    "flashcardBlurb": "The \"Scotland of the East\" and capital of Meghalaya, celebrated for rolling pine-covered hills, cascading waterfalls, British colonial charm, and vibrant rock music culture.",
    "hotels": [
      {
        "id": "shillong-hotel-1-vivanta-meghalaya-shillong",
        "name": "Vivanta Meghalaya Shillong",
        "locality": "Police Bazar",
        "tier": "ultra-luxury",
        "stars": 5,
        "description": "Premium luxury hotel blending modern design with Khasi cultural motifs.",
        "lat": 25.587449,
        "lng": 91.8933
      },
      {
        "id": "shillong-hotel-2-ri-kynti-the-heritage-hotel",
        "name": "Ri Kynti - The Heritage Hotel",
        "locality": "Risa Colony",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Historic 1940s colonial mansion turned luxury heritage boutique hotel overlooking pine hills.",
        "lat": 25.590651,
        "lng": 91.89915
      },
      {
        "id": "shillong-hotel-3-heritage-club-tripura-castle",
        "name": "Heritage Club - Tripura Castle",
        "locality": "Cleve Colony",
        "tier": "heritage-palace",
        "stars": 5,
        "description": "Historic royal palace hotel set amidst wooded hills, offering art galleries and fine dining.",
        "lat": 25.590374,
        "lng": 91.907551
      },
      {
        "id": "shillong-hotel-4-hotel-centre-point",
        "name": "Hotel Centre Point",
        "locality": "Police Bazar",
        "tier": "upscale",
        "stars": 4,
        "description": "Established central hotel located right in Shillong's primary commercial hub.",
        "lat": 25.585481,
        "lng": 91.916098
      },
      {
        "id": "shillong-hotel-5-hotel-pinewood",
        "name": "Hotel Pinewood",
        "locality": "European Ward",
        "tier": "heritage-palace",
        "stars": 4,
        "description": "Heritage government hotel set within sprawling colonial-era gardens.",
        "lat": 25.576088,
        "lng": 91.921908
      },
      {
        "id": "shillong-hotel-6-hotel-alpine-continental",
        "name": "Hotel Alpine Continental",
        "locality": "Police Bazar",
        "tier": "comfort",
        "stars": 3,
        "description": "Central business hotel known for its popular multi-cuisine restaurants.",
        "lat": 25.574476,
        "lng": 91.901604
      },
      {
        "id": "shillong-hotel-7-hotel-pegasus-crown",
        "name": "Hotel Pegasus Crown",
        "locality": "Police Bazar",
        "tier": "comfort",
        "stars": 3,
        "description": "Well-established transit and leisure hotel with banquet facilities.",
        "lat": 25.568305,
        "lng": 91.901754
      },
      {
        "id": "shillong-hotel-8-m-crown-hotel",
        "name": "M Crown Hotel",
        "locality": "Police Bazar",
        "tier": "upscale",
        "stars": 4,
        "description": "Modern upscale hotel offering comfortable urban accommodations.",
        "lat": 25.561881,
        "lng": 91.897287
      },
      {
        "id": "shillong-hotel-9-cafe-shillong-bed-breakfast",
        "name": "Cafe Shillong Bed & Breakfast",
        "locality": "Laitumkhrah",
        "tier": "boutique",
        "stars": 3,
        "description": "Cozy boutique stay operated by local musicians, attached to a popular cafe.",
        "lat": 25.557651,
        "lng": 91.888316
      },
      {
        "id": "shillong-hotel-10-hotel-orchid-lake-resort",
        "name": "Hotel Orchid Lake Resort",
        "locality": "Barapani, Umiam",
        "tier": "upscale",
        "stars": 4,
        "description": "Scenic lakeside resort managed by Meghalaya tourism overlooking Umiam Lake.",
        "lat": 25.557809,
        "lng": 91.876392
      },
      {
        "id": "shillong-hotel-11-sunrise-guest-house",
        "name": "Sunrise Guest House",
        "locality": "Nongthymmai",
        "tier": "comfort",
        "stars": 3,
        "description": "Quiet bed-and-breakfast offering warm homestyle hospitality.",
        "lat": 25.574476,
        "lng": 91.884996
      },
      {
        "id": "shillong-hotel-12-hotel-woodland",
        "name": "Hotel Woodland",
        "locality": "Police Bazar",
        "tier": "comfort",
        "stars": 3,
        "description": "Central budget-friendly hotel with easy market and transport access.",
        "lat": 25.577444,
        "lng": 91.878996
      },
      {
        "id": "shillong-hotel-13-hotel-knight-inn",
        "name": "Hotel Knight Inn",
        "locality": "Keating Road",
        "tier": "comfort",
        "stars": 3,
        "description": "Contemporary city stay offering essential modern amenities.",
        "lat": 25.584145,
        "lng": 91.875062
      },
      {
        "id": "shillong-hotel-14-hotel-heiga-shillong",
        "name": "Hotel Heiga Shillong",
        "locality": "Dhankheti",
        "tier": "boutique",
        "stars": 4,
        "description": "Peaceful suburban hotel surrounded by green hills.",
        "lat": 25.593268,
        "lng": 91.875486
      },
      {
        "id": "shillong-hotel-15-hotel-shillong-towers",
        "name": "Hotel Shillong Towers",
        "locality": "Police Bazar",
        "tier": "comfort",
        "stars": 3,
        "description": "Central city stay offering panoramic views over the hill station.",
        "lat": 25.602503,
        "lng": 91.8816
      }
    ],
    "restaurants": {
      "veg": [
        {
          "id": "shillong-rest-veg-1-jiva-veg",
          "name": "Jiva Veg",
          "locality": "Police Bazar & GS Road",
          "type": "veg",
          "cuisine": "Pure Vegetarian Thalis",
          "specialties": "Pure vegetarian North Indian and South Indian thalis",
          "lat": 25.574427,
          "lng": 91.889778
        },
        {
          "id": "shillong-rest-veg-2-madras-cafe",
          "name": "Madras Cafe",
          "locality": "Jail Road, Police Bazar",
          "type": "veg",
          "cuisine": "South Indian Tiffin",
          "specialties": "Classic dosas, idlis, and filter coffee",
          "lat": 25.573632,
          "lng": 91.886374
        }
      ],
      "nonVeg": [
        {
          "id": "shillong-rest-nonveg-1-trattoria",
          "name": "Trattoria",
          "locality": "Police Bazar",
          "type": "non-veg",
          "cuisine": "Authentic Khasi Cuisine",
          "specialties": "Legendary local Khasi spot for authentic Jadoh (rice and pork) and Dohneiiong",
          "lat": 25.576268,
          "lng": 91.878584
        },
        {
          "id": "shillong-rest-nonveg-2-cafe-shillong",
          "name": "Cafe Shillong",
          "locality": "Laitumkhrah",
          "type": "non-veg",
          "cuisine": "Continental & Grills",
          "specialties": "Continental non-veg grills and live acoustic music",
          "lat": 25.579818,
          "lng": 91.875357
        }
      ]
    },
    "attractions": [
      {
        "id": "shillong-att-1-umiam-lake-barapani-",
        "name": "Umiam Lake (Barapani)",
        "category": "Lakes & Water Sports",
        "description": "Expansive artificial reservoir surrounded by pine-clad hills offering water sports.",
        "isHiddenGem": false,
        "lat": 25.57654,
        "lng": 91.86946
      },
      {
        "id": "shillong-att-2-elephant-falls",
        "name": "Elephant Falls",
        "category": "Waterfalls",
        "description": "Multi-tiered cascading waterfall set amidst lush green fern forests.",
        "isHiddenGem": false,
        "lat": 25.581625,
        "lng": 91.8635
      },
      {
        "id": "shillong-att-3-shillong-peak",
        "name": "Shillong Peak",
        "category": "Mountain Vantage Points",
        "description": "Highest vantage point offering panoramic bird's-eye views over Shillong city and valleys.",
        "isHiddenGem": false,
        "lat": 25.588822,
        "lng": 91.859103
      },
      {
        "id": "shillong-att-4-don-bosco-museum-of-indigenous-cultures",
        "name": "Don Bosco Museum of Indigenous Cultures",
        "category": "Tribal & Indigenous Heritage",
        "description": "World-class 7-story museum showcasing the lifestyle, art, and heritage of Northeast tribes.",
        "isHiddenGem": true,
        "lat": 25.584205,
        "lng": 91.88292
      },
      {
        "id": "shillong-att-5-laitlum-canyons",
        "name": "Laitlum Canyons",
        "category": "Gorges & Canyons",
        "description": "Breathtaking dramatic gorges and grassy cliffs offering sweeping valley views (Excursion Hub).",
        "isHiddenGem": true,
        "lat": 25.589651,
        "lng": 91.87994
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// Normalization & Lookup Engine
// ---------------------------------------------------------------------------

const norm = (s: string) => s.toLowerCase().replace(/\b(city|district|full|ultimate)\b/g, '').replace(/[^a-z0-9]/g, '');

const ALIASES: Record<string, string[]> = {
  mumbai: ['bombay'],
  bengaluru: ['bangalore'],
  delhi: ['newdelhi', 'delhincr', 'ncr'],
  kolkata: ['calcutta'],
  chennai: ['madras'],
  varanasi: ['banaras', 'kashi'],
  kochi: ['cochin'],
  leh: ['ladakh'],
};

export function getUltimateCityRecord(query: string): UltimateCityRecord | null {
  if (!query) return null;
  const q = norm(query);
  
  // 1. Direct ID or Name match
  const direct = ULTIMATE_CITY_DATABASE_15.find(c => norm(c.id) === q || norm(c.name) === q || norm(c.code) === q);
  if (direct) return direct;

  // 2. Alias match
  for (const [key, aliasList] of Object.entries(ALIASES)) {
    if (aliasList.includes(q) || q === key) {
      const match = ULTIMATE_CITY_DATABASE_15.find(c => c.id === key);
      if (match) return match;
    }
  }

  // 3. Substring match
  const sub = ULTIMATE_CITY_DATABASE_15.find(c => norm(c.name).includes(q) || q.includes(norm(c.name)));
  return sub || null;
}

export function getTop15HotelsForCity(query: string): UltimateHotel[] {
  const city = getUltimateCityRecord(query);
  return city ? city.hotels : [];
}

export function getDiningForCity(query: string): { veg: UltimateRestaurant[]; nonVeg: UltimateRestaurant[] } {
  const city = getUltimateCityRecord(query);
  return city ? city.restaurants : { veg: [], nonVeg: [] };
}

export function getAttractionsForCity(query: string): UltimateAttraction[] {
  const city = getUltimateCityRecord(query);
  return city ? city.attractions : [];
}

export function getAllMapPointsFromUltimateDatabase(): Array<{
  id: string;
  name: string;
  type: 'hotel' | 'dining' | 'hidden_gem' | 'heritage';
  lat: number;
  lng: number;
  city: string;
  state: string;
  details: string;
  subtext: string;
  stars?: number;
  tier?: string;
  specialties?: string;
}> {
  const points: Array<{
    id: string;
    name: string;
    type: 'hotel' | 'dining' | 'hidden_gem' | 'heritage';
    lat: number;
    lng: number;
    city: string;
    state: string;
    details: string;
    subtext: string;
    stars?: number;
    tier?: string;
    specialties?: string;
  }> = [];

  for (const city of ULTIMATE_CITY_DATABASE_15) {
    // Hotels
    for (const h of city.hotels) {
      points.push({
        id: h.id,
        name: h.name,
        type: 'hotel',
        lat: h.lat,
        lng: h.lng,
        city: city.name,
        state: city.state,
        details: h.description,
        subtext: `${h.locality} · ${h.tier.toUpperCase()}`,
        stars: h.stars,
        tier: h.tier,
      });
    }

    // Dining
    for (const r of city.restaurants.veg) {
      points.push({
        id: r.id,
        name: r.name,
        type: 'dining',
        lat: r.lat,
        lng: r.lng,
        city: city.name,
        state: city.state,
        details: `Specialty: ${r.specialties}`,
        subtext: `Pure Veg · ${r.locality}`,
        specialties: r.specialties,
      });
    }

    for (const r of city.restaurants.nonVeg) {
      points.push({
        id: r.id,
        name: r.name,
        type: 'dining',
        lat: r.lat,
        lng: r.lng,
        city: city.name,
        state: city.state,
        details: `Specialty: ${r.specialties}`,
        subtext: `Non-Veg · ${r.locality}`,
        specialties: r.specialties,
      });
    }

    // Attractions & Hidden Gems
    for (const a of city.attractions) {
      points.push({
        id: a.id,
        name: a.name,
        type: a.isHiddenGem ? 'hidden_gem' : 'heritage',
        lat: a.lat,
        lng: a.lng,
        city: city.name,
        state: city.state,
        details: a.description,
        subtext: a.category,
      });
    }
  }

  return points;
}
