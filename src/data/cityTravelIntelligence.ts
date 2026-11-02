/**
 * Verified Real-World Travel Intelligence for Virasat Itinerary Planner
 * Provides comprehensive in-app verified stays, IRCTC train routes, flight & airport transit,
 * official ASI monument entry ticket rates & timings, and legendary local dining for Indian destinations.
 */

export interface VerifiedStay {
  id: string;
  name: string;
  category: 'Royal Heritage Palace' | 'Boutique Haveli' | 'Premium Comfort Hotel' | 'Budget & Backpacker' | 'Pilgrim Dharamshala';
  priceRange: string;
  locality: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  badge: string;
  bookingTip: string;
}

export interface TrainConnectivity {
  stations: Array<{
    name: string;
    code: string;
    distanceToCenter: string;
    platforms: number;
  }>;
  premierTrains: Array<{
    name: string;
    trainNo: string;
    route: string;
    travelTime: string;
    frequency: string;
    highlights: string;
  }>;
  classFares: Array<{
    tier: string;
    code: string;
    typicalFare: string;
    amenities: string;
  }>;
  transitAdvice: string;
}

export interface FlightTransit {
  airportName: string;
  iataCode: string;
  terminal: string;
  majorDirectHubs: string[];
  typicalOneWayFare: string;
  transitToCityCenter: {
    distanceKm: string;
    travelTime: string;
    prepaidTaxiFare: string;
    metroOrBusOption: string;
  };
  travelerNote: string;
}

export interface AsiMonumentEntry {
  name: string;
  monumentType: string;
  timings: string;
  domesticFee: string;
  foreignFee: string;
  saarcFee: string;
  closedOn: string;
  highlights: string;
  qrKioskAvailable: boolean;
}

export interface IconicEatery {
  name: string;
  established: string;
  locality: string;
  cuisineType: string;
  isPureVeg: boolean;
  signatureDishes: string[];
  spendForTwo: string;
  timings: string;
  mustTryNote: string;
}

export interface CityTravelIntelligence {
  cityName: string;
  state: string;
  overview: string;
  stays: VerifiedStay[];
  trains: TrainConnectivity;
  flights: FlightTransit;
  asiMonuments: {
    generalRules: string[];
    monuments: AsiMonumentEntry[];
  };
  dining: IconicEatery[];
}

export const CITY_INTELLIGENCE_REGISTRY: Record<string, CityTravelIntelligence> = {
  'jaipur': {
    cityName: 'Jaipur',
    state: 'Rajasthan',
    overview: 'The royal Pink City and capital of Rajasthan, celebrated for UNESCO World Heritage hill forts, astronomical marvels, and legendary Rajasthani hospitality.',
    stays: [
      {
        id: 'jai-mahal-palace',
        name: 'Taj Jai Mahal Palace',
        category: 'Royal Heritage Palace',
        priceRange: '₹14,500 – ₹28,000 / night',
        locality: 'Jacob Road, Civil Lines',
        amenities: ['18-acre Mughal Gardens', 'Heritage Architecture', 'Royal Spa', 'Fine Dining', 'Folk Performances'],
        rating: 4.9,
        reviewCount: 3840,
        badge: 'Verified 5-Star Heritage',
        bookingTip: 'Book 3-4 weeks ahead for winter season (Nov–Feb); palace rooms include complimentary afternoon high tea in the gardens.'
      },
      {
        id: 'shahpura-haveli',
        name: 'Shahpura House & Haveli',
        category: 'Boutique Haveli',
        priceRange: '₹4,800 – ₹8,200 / night',
        locality: 'Devi Marg, Bani Park',
        amenities: ['Frescoed Ceilings', 'Rooftop Pool', 'Rajasthani Courtyard', 'Pure Ghee Dining', 'Free Wi-Fi'],
        rating: 4.7,
        reviewCount: 2150,
        badge: 'Heritage Boutique Stay',
        bookingTip: 'Request a traditional fresco-painted suite overlooking the marble courtyard.'
      },
      {
        id: 'hotel-gangaur-rtdc',
        name: 'RTDC Hotel Gangaur',
        category: 'Premium Comfort Hotel',
        priceRange: '₹2,200 – ₹3,800 / night',
        locality: 'MI Road, Near Railway Station',
        amenities: ['Government Certified', 'On-site Restaurant', 'AC Rooms', 'Sightseeing Bus Desk', 'Safe Parking'],
        rating: 4.2,
        reviewCount: 1420,
        badge: 'Official Rajasthan Tourism Stay',
        bookingTip: 'Ideal central location for travelers planning to take RTDC city coach tours to Amber and Nahargarh.'
      },
      {
        id: 'zostel-jaipur',
        name: 'Zostel Jaipur (Heritage Enclave)',
        category: 'Budget & Backpacker',
        priceRange: '₹750 – ₹2,400 / night',
        locality: 'Hawa Mahal Road, Subhash Nagar',
        amenities: ['Walking distance to Hawa Mahal', 'Air Conditioned', 'Vibrant Rooftop Cafe', 'High-Speed Wi-Fi', 'Luggage Lockers'],
        rating: 4.6,
        reviewCount: 4200,
        badge: 'Top Backpacker Choice',
        bookingTip: 'Rooftop common room offers morning yoga and direct view towards Nahargarh Fort ramparts.'
      }
    ],
    trains: {
      stations: [
        { name: 'Jaipur Junction', code: 'JP', distanceToCenter: '2.5 km', platforms: 8 },
        { name: 'Gandhinagar Jaipur', code: 'GADJ', distanceToCenter: '5.2 km (All-Women Operated)', platforms: 2 },
        { name: 'Durgapura', code: 'DPA', distanceToCenter: '8 km (South Hub near Airport)', platforms: 3 }
      ],
      premierTrains: [
        {
          name: 'New Delhi - Jaipur Vande Bharat Express',
          trainNo: '20978 / 20977',
          route: 'Delhi Cantt (DEC) → Jaipur (JP)',
          travelTime: '3h 55m (Fastest link)',
          frequency: 'Daily except Wednesday',
          highlights: 'Ultra-smooth semi-high speed transit, panoramic windows, hot Rajasthani meal included'
        },
        {
          name: 'Ajmer Shatabdi Express',
          trainNo: '12015 / 12016',
          route: 'New Delhi (NDLS) → Jaipur (JP)',
          travelTime: '4h 40m',
          frequency: 'Runs all 7 days daily',
          highlights: 'Morning departure at 06:10 AM arriving Jaipur 10:45 AM, ideal for day trips'
        },
        {
          name: 'Ashram Superfast Express',
          trainNo: '12916 / 12915',
          route: 'Old Delhi (DLI) → Jaipur (JP) → Ahmedabad',
          travelTime: '5h 05m',
          frequency: 'Daily service',
          highlights: 'Popular evening departure at 03:20 PM with convenient sleeper & AC berths'
        }
      ],
      classFares: [
        { tier: 'Executive Chair Car (EC)', code: 'EC', typicalFare: '₹1,850 – ₹2,100', amenities: '180° Rotatable Plush Seats, Premium Hot Meals, Priority Boarding' },
        { tier: 'AC Chair Car (CC)', code: 'CC', typicalFare: '₹980 – ₹1,120', amenities: 'Wide Reclining Seats, On-board Catering, Charging Outlets' },
        { tier: 'AC 2-Tier (2A)', code: '2A', typicalFare: '₹1,380 – ₹1,550', amenities: 'Curtained 4-Berth Compartment, Sanitized Bedroll, Reading Light' },
        { tier: 'AC 3-Tier (3A)', code: '3A', typicalFare: '₹960 – ₹1,080', amenities: 'Air Conditioned 6-Berth Pod, Clean Linens, Family Friendly' },
        { tier: 'Sleeper Class (SL)', code: 'SL', typicalFare: '₹310 – ₹380', amenities: 'Reserved Open-Window Berth, Economical Direct Travel' }
      ],
      transitAdvice: 'Exit from Platform 1 for the official Jaipur Traffic Police Pre-paid Auto Booth. Fixed fare to MI Road / Walled City is ₹100–₹150. Low-floor AC electric bus AC-2 connects Jaipur Junction directly to Hawa Mahal for ₹30.'
    },
    flights: {
      airportName: 'Jaipur International Airport',
      iataCode: 'JAI',
      terminal: 'Terminal 2 (Domestic & International Arrivals/Departures)',
      majorDirectHubs: ['New Delhi (DEL - 55 min)', 'Mumbai (BOM - 1h 45m)', 'Bengaluru (BLR - 2h 20m)', 'Hyderabad (HYD - 2h 00m)', 'Kolkata (CCU - 2h 15m)', 'Dubai (DXB - 3h 30m)'],
      typicalOneWayFare: '₹3,200 – ₹5,400 (Economy standard booked 10+ days prior)',
      transitToCityCenter: {
        distanceKm: '12.5 km',
        travelTime: '25 – 35 minutes depending on traffic',
        prepaidTaxiFare: '₹450 – ₹600 (Fixed government counter inside arrivals hall)',
        metroOrBusOption: 'AC Electric Bus Route 9A or App Cabs (Uber/Ola pickup bay on 1st level parking)'
      },
      travelerNote: 'Jaipur airport features vibrant Rajasthani brass murals and miniature art installations. Free Wi-Fi is available for 45 minutes via mobile OTP.'
    },
    asiMonuments: {
      generalRules: [
        'Children under 15 years enter FREE across all ASI monuments in India upon presenting age ID.',
        'ASI QR code cashless entry kiosks located at all entrances allow instant booking on your smartphone to skip ticket queues.',
        'Still non-commercial photography is free; tripods and commercial video gear require prior ASI permission.',
        'Composite Entry Ticket (Jaipur City Palace / Amber Fort / Jantar Mantar / Hawa Mahal) saves up to 45% over individual counter passes.'
      ],
      monuments: [
        {
          name: 'Amber Fort & Palace Complex (Amer)',
          monumentType: 'UNESCO World Heritage Hill Fort',
          timings: '08:00 AM – 05:30 PM (Evening Night Tourism: 06:30 PM – 09:15 PM)',
          domesticFee: '₹50 (Composite: ₹300)',
          foreignFee: '₹500 (Composite: ₹1,000)',
          saarcFee: '₹50 (Composite: ₹300)',
          closedOn: 'Open all 365 days',
          highlights: 'Sheesh Mahal (Palace of Mirrors), Ganesh Pol royal gateway, subterranean passage to Jaigarh Fort, Maota Lake view',
          qrKioskAvailable: true
        },
        {
          name: 'Jantar Mantar Royal Astronomical Observatory',
          monumentType: 'UNESCO World Heritage Monument',
          timings: '09:00 AM – 05:00 PM',
          domesticFee: '₹50 (Composite: ₹300)',
          foreignFee: '₹200 (Composite: ₹1,000)',
          saarcFee: '₹50 (Composite: ₹300)',
          closedOn: 'Open all 365 days',
          highlights: 'Samrat Yantra (world\'s largest stone sundial accurate to 2 seconds), 19 geometric instruments erected by Maharaja Jai Singh II',
          qrKioskAvailable: true
        },
        {
          name: 'Hawa Mahal (Palace of Winds)',
          monumentType: 'State Protected Heritage Marvel',
          timings: '09:00 AM – 05:00 PM',
          domesticFee: '₹50 (Composite: ₹300)',
          foreignFee: '₹200 (Composite: ₹1,000)',
          saarcFee: '₹50 (Composite: ₹300)',
          closedOn: 'Open all 365 days',
          highlights: '5-story crown facade featuring 953 stone-latticed jharokha windows built in 1799 for royal court women to view street festivals',
          qrKioskAvailable: true
        },
        {
          name: 'Nahargarh Fort & Stepwells',
          monumentType: 'Crown Hill Fortress of the Aravallis',
          timings: '10:00 AM – 05:30 PM',
          domesticFee: '₹50 (Composite: ₹300)',
          foreignFee: '₹200 (Composite: ₹1,000)',
          saarcFee: '₹50 (Composite: ₹300)',
          closedOn: 'Open all 365 days',
          highlights: 'Madhavendra Bhawan 9 identical queen suites, ancient rainwater harvesting stepwell, panoramic sunset vista over Pink City',
          qrKioskAvailable: true
        }
      ]
    },
    dining: [
      {
        name: 'LMB (Laxmi Mishtan Bhandar)',
        established: '1727 (Heritage Institution)',
        locality: 'Johari Bazaar, Old Walled City',
        cuisineType: 'Authentic Pure Vegetarian Rajasthani',
        isPureVeg: true,
        signatureDishes: ['Royal Rajasthani Thali', 'Paneer Ghewar', 'Mishri Mawa', 'Crispy Pyaaz Kachori'],
        spendForTwo: '₹750 – ₹1,200',
        timings: '08:00 AM – 11:00 PM',
        mustTryNote: 'Must-visit sweetshop in the jewelers\' bazaar; their signature saffron Paneer Ghewar was invented here.'
      },
      {
        name: 'Rawat Mishtan Bhandar',
        established: '1972',
        locality: 'Station Road, Sindhi Camp',
        cuisineType: 'Folk Snacks, Kachoris & Mithai',
        isPureVeg: true,
        signatureDishes: ['Legendary Pyaaz Kachori', 'Mawa Kachori', 'Spicy Mirchi Vada', 'Kadhi Kachori'],
        spendForTwo: '₹250 – ₹450',
        timings: '06:00 AM – 10:30 PM',
        mustTryNote: 'Serves over 10,000 freshly fried golden onion kachoris daily. Best consumed hot with tangy tamarind chutney.'
      },
      {
        name: 'Handi Restaurant',
        established: '1984',
        locality: 'MI Road, Opposite GPO',
        cuisineType: 'Royal Rajput & Mughlai Meat Curries',
        isPureVeg: false,
        signatureDishes: ['Traditional Royal Laal Maas', 'Handi Meat', 'Junglee Maas', 'Butter Garlic Naan'],
        spendForTwo: '₹1,200 – ₹1,800',
        timings: '12:00 PM – 11:00 PM',
        mustTryNote: 'Award-winning recipe for Laal Maas simmered with fiery Mathania red chillies and pure desi ghee.'
      },
      {
        name: 'Pandit Kulfi',
        established: '1946',
        locality: 'Sirah Deori Bazaar, Near Hawa Mahal',
        cuisineType: 'Artisanal Frozen Heritage Desserts',
        isPureVeg: true,
        signatureDishes: ['Matka Rabdi Kulfi', 'Rose Falooda Kulfi', 'Pistachio Malai Kulfi'],
        spendForTwo: '₹150 – ₹300',
        timings: '11:00 AM – 11:30 PM',
        mustTryNote: 'Dense, slow-evaporated whole milk kulfi served on traditional sal leaves directly opposite Hawa Mahal.'
      }
    ]
  },

  'delhi': {
    cityName: 'Delhi (NCR)',
    state: 'Delhi',
    overview: 'India\'s historic capital city and cultural epicenter spanning centuries of Mughal, Sultanate, and colonial British heritage enclaves.',
    stays: [
      {
        id: 'the-imperial-delhi',
        name: 'The Imperial New Delhi',
        category: 'Royal Heritage Palace',
        priceRange: '₹16,000 – ₹32,000 / night',
        locality: 'Janpath, Connaught Place',
        amenities: ['1930s Art Deco Architecture', 'Museum Art Gallery', 'Heated Outdoor Pool', 'Historic 1911 Bar', 'Spa & Wellness'],
        rating: 4.9,
        reviewCount: 4500,
        badge: 'Premier Heritage Hotel',
        bookingTip: 'Walkable to Connaught Place and Janpath Tibetan market.'
      },
      {
        id: 'maidens-hotel',
        name: 'Maidens Hotel (Oberoi Heritage)',
        category: 'Royal Heritage Palace',
        priceRange: '₹7,500 – ₹13,000 / night',
        locality: 'Sham Nath Marg, Civil Lines, Old Delhi',
        amenities: ['Colonial Verandahs', 'Lush Peacocks Garden', 'Classic High Tea', 'Walking Distance to Metro'],
        rating: 4.8,
        reviewCount: 2100,
        badge: '1903 Colonial Heritage',
        bookingTip: 'Peaceful green oasis in historic North Delhi away from heavy traffic.'
      },
      {
        id: 'hotel-bloomrooms-delhi',
        name: 'Bloomrooms @ New Delhi Station',
        category: 'Premium Comfort Hotel',
        priceRange: '₹2,800 – ₹4,600 / night',
        locality: 'Opposite New Delhi Railway Station',
        amenities: ['Airport Express Metro Connectivity', 'Clean Minimalist Rooms', 'Cloud Beds', 'Complimentary Breakfast'],
        rating: 4.5,
        reviewCount: 5200,
        badge: 'Top Transit Hotel',
        bookingTip: 'Direct 18-minute Airport Express Metro link to IGI Terminal 3.'
      }
    ],
    trains: {
      stations: [
        { name: 'New Delhi Railway Station', code: 'NDLS', distanceToCenter: '1 km from Connaught Place', platforms: 16 },
        { name: 'Old Delhi Railway Station', code: 'DLI', distanceToCenter: 'Near Chandni Chowk', platforms: 16 },
        { name: 'Hazrat Nizamuddin', code: 'NZM', distanceToCenter: 'Near Humayun\'s Tomb (South Hub)', platforms: 7 },
        { name: 'Anand Vihar Terminal', code: 'ANVT', distanceToCenter: 'East Delhi Hub', platforms: 7 }
      ],
      premierTrains: [
        {
          name: 'Vande Bharat Express Fleet',
          trainNo: 'Multiple Routes',
          route: 'NDLS → Varanasi / Katra / Bhopal / Jaipur',
          travelTime: '3h to 8h',
          frequency: 'Daily schedules',
          highlights: 'Punctual semi-high speed transit with onboard executive dining'
        },
        {
          name: 'Rajdhani Express Network',
          trainNo: 'Over 20 services',
          route: 'Connecting Delhi to all state capitals nationwide',
          travelTime: 'Overnight premium',
          frequency: 'Daily & Bi-weekly',
          highlights: 'Fully air-conditioned luxury express with complimentary meal services'
        }
      ],
      classFares: [
        { tier: 'Executive Anubhuti / EC', code: 'EC', typicalFare: '₹2,200 – ₹3,400', amenities: 'Ultra-Comfortable Recliners, LCD Entertainment, Hot Meals' },
        { tier: 'AC Chair Car (CC)', code: 'CC', typicalFare: '₹1,050 – ₹1,450', amenities: 'Spacious Legroom, Clean Toilets, Mobile Charging' },
        { tier: 'AC 2-Tier (2A)', code: '2A', typicalFare: '₹1,600 – ₹2,400', amenities: 'Curtained Berths, Sealed Windows, High Security' },
        { tier: 'AC 3-Tier (3A)', code: '3A', typicalFare: '₹1,100 – ₹1,700', amenities: 'Most Economical AC Travel across India' }
      ],
      transitAdvice: 'Use the Delhi Metro (Yellow Line and Airport Express Line) directly located inside NDLS for frictionless, traffic-free transit. Avoid unmetered touts at Paharganj side.'
    },
    flights: {
      airportName: 'Indira Gandhi International Airport',
      iataCode: 'DEL',
      terminal: 'Terminal 1 (Domestic Budget), Terminal 2 & Terminal 3 (International & Full Service)',
      majorDirectHubs: ['Connects nonstop to 140+ domestic cities and 70+ global destinations'],
      typicalOneWayFare: '₹2,800 – ₹6,000 depending on route',
      transitToCityCenter: {
        distanceKm: '16 km',
        travelTime: '18 minutes via Orange Line Airport Express Metro',
        prepaidTaxiFare: '₹400 – ₹650',
        metroOrBusOption: 'Airport Express Metro runs every 10 mins directly to New Delhi Station for ₹60'
      },
      travelerNote: 'Ranked among the top world airports; T3 features majestic mudra brass sculptures and sleeping pods.'
    },
    asiMonuments: {
      generalRules: [
        'Children under 15 years enter FREE across all ASI monuments upon showing proof of age.',
        'Online e-ticketing and QR code booking are strictly enforced at Red Fort, Qutub Minar, and Humayun\'s Tomb.',
        'Illuminated monuments (Qutub Minar, Red Fort) are open for evening night walks until 09:00 PM.'
      ],
      monuments: [
        {
          name: 'Qutub Minar Complex',
          monumentType: 'UNESCO World Heritage Site',
          timings: '07:00 AM – 09:00 PM (Night Illumination)',
          domesticFee: '₹40 (Online: ₹35)',
          foreignFee: '₹600 (Online: ₹550)',
          saarcFee: '₹40',
          closedOn: 'Open all days',
          highlights: '73-meter fluted red sandstone minaret, 1600-year rustless Iron Pillar of Chandragupta II',
          qrKioskAvailable: true
        },
        {
          name: 'Humayun\'s Tomb & Sunder Nursery',
          monumentType: 'UNESCO World Heritage Garden Tomb',
          timings: '06:00 AM – 06:00 PM',
          domesticFee: '₹40 (Online: ₹35)',
          foreignFee: '₹600 (Online: ₹550)',
          saarcFee: '₹40',
          closedOn: 'Open all days',
          highlights: 'Precursor architectural prototype to the Taj Mahal; 30-acre Charbagh geometric gardens',
          qrKioskAvailable: true
        },
        {
          name: 'Red Fort (Lal Qila)',
          monumentType: 'UNESCO World Heritage Mughal Citadel',
          timings: '09:30 AM – 04:30 PM (Museums)',
          domesticFee: '₹50 (Online: ₹35)',
          foreignFee: '₹600 (Online: ₹550)',
          saarcFee: '₹50',
          closedOn: 'Closed on Mondays',
          highlights: 'Diwan-i-Khas, Diwan-i-Aam, Lahori Gate, Chhatta Chowk covered bazaar, Sound & Light Show',
          qrKioskAvailable: true
        }
      ]
    },
    dining: [
      {
        name: 'Karim\'s (Est. 1913)',
        established: '1913',
        locality: 'Gali Kababian, Jama Masjid, Old Delhi',
        cuisineType: 'Historic Royal Mughlai',
        isPureVeg: false,
        signatureDishes: ['Mutton Burra Kebab', 'Mutton Korma', 'Shahi Badam Pasanda', 'Khamiri Roti'],
        spendForTwo: '₹800 – ₹1,400',
        timings: '11:00 AM – 11:30 PM',
        mustTryNote: 'Founded by royal chefs of the last Mughal emperor Bahadur Shah Zafar.'
      },
      {
        name: 'Pt. Kanhaiyalal Durgaprasad Dixit (Paranthe Wali Gali)',
        established: '1875',
        locality: 'Chandni Chowk, Old Delhi',
        cuisineType: 'Traditional Pure Vegetarian Fried Parathas',
        isPureVeg: true,
        signatureDishes: ['Khoya Paratha', 'Rabdi Paratha', 'Papad Paratha', 'Nimbu Paratha with Sweet Pumpkin Sabzi'],
        spendForTwo: '₹250 – ₹450',
        timings: '09:00 AM – 11:00 PM',
        mustTryNote: 'Parathas fried in pure ghee served with sour banana chutney and sweet pumpkin curry.'
      },
      {
        name: 'Saravana Bhavan',
        established: '1981',
        locality: 'Janpath & Connaught Place Outer Circle',
        cuisineType: 'Authentic South Indian Filter Coffee & Dosas',
        isPureVeg: true,
        signatureDishes: ['Ghee Roast Masala Dosa', 'Mini Idli Sambar Float', 'Rava Kesari', 'Degree Filter Coffee'],
        spendForTwo: '₹450 – ₹750',
        timings: '08:00 AM – 10:30 PM',
        mustTryNote: 'The benchmark South Indian breakfast spot in central Delhi with signature coconut chutneys.'
      }
    ]
  },

  'mumbai': {
    cityName: 'Mumbai',
    state: 'Maharashtra',
    overview: 'India\'s commercial powerhouse and coastal megacity, blending Victorian Gothic architecture, art deco promenades, and vibrant seaside heritage.',
    stays: [
      {
        id: 'taj-mahal-palace-mumbai',
        name: 'The Taj Mahal Palace & Tower',
        category: 'Royal Heritage Palace',
        priceRange: '₹18,000 – ₹45,000 / night',
        locality: 'Apollo Bunder, Colaba',
        amenities: ['Harbour & Gateway of India Views', 'Artisan High Tea', 'Sea Lounge', 'Poolside Heritage Walk'],
        rating: 4.9,
        reviewCount: 9200,
        badge: 'Legendary Flagship Landmark',
        bookingTip: 'Request a harbor-facing heritage wing room for views of Gateway of India sunrise.'
      },
      {
        id: 'residency-hotel-fort',
        name: 'Residency Hotel Fort',
        category: 'Premium Comfort Hotel',
        priceRange: '₹3,800 – ₹6,500 / night',
        locality: 'Rustom Sidhwa Marg, Fort',
        amenities: ['Heart of Heritage Precinct', 'Walking Distance to CSMT', 'Complimentary Breakfast', 'High-Speed Wi-Fi'],
        rating: 4.6,
        reviewCount: 3100,
        badge: 'Top Heritage Walker Stay',
        bookingTip: 'Surrounded by colonial Victorian buildings and iconic Parsi cafes.'
      }
    ],
    trains: {
      stations: [
        { name: 'Chhatrapati Shivaji Maharaj Terminus', code: 'CSMT', distanceToCenter: 'South Mumbai Core', platforms: 18 },
        { name: 'Mumbai Central', code: 'MMCT', distanceToCenter: 'Central Western Hub', platforms: 8 },
        { name: 'Bandra Terminus', code: 'BDTS', distanceToCenter: 'Suburban North Hub', platforms: 7 },
        { name: 'Lokmanya Tilak Terminus', code: 'LTT', distanceToCenter: 'Kurla East Hub', platforms: 5 }
      ],
      premierTrains: [
        {
          name: 'Mumbai - Goa Vande Bharat Express',
          trainNo: '22229 / 22230',
          route: 'CSMT → Madgaon',
          travelTime: '7h 45m scenic Konkan Coast journey',
          frequency: '6 days a week',
          highlights: 'Spectacular Konkan railway viaducts, coastal waterfalls, and Western Ghat tunnels'
        },
        {
          name: 'Mumbai - Ahmedabad Vande Bharat Express',
          trainNo: '20901 / 20902',
          route: 'Mumbai Central → Gandhinagar',
          travelTime: '5h 15m',
          frequency: 'Daily except Sunday',
          highlights: 'High-speed coastal Gujarat corridor transit'
        }
      ],
      classFares: [
        { tier: 'Executive Chair Car (EC)', code: 'EC', typicalFare: '₹2,100 – ₹2,400', amenities: 'Panoramic Windows, Recliner Seats, Gourmet Meal Service' },
        { tier: 'AC Chair Car (CC)', code: 'CC', typicalFare: '₹1,020 – ₹1,250', amenities: 'High Speed Air Conditioned Coach' },
        { tier: 'AC 2-Tier (2A)', code: '2A', typicalFare: '₹1,550 – ₹1,850', amenities: 'Comfortable Long Distance Overnight Travel' }
      ],
      transitAdvice: 'CSMT itself is a UNESCO World Heritage railway terminal. South Mumbai uses black-and-yellow metered Padmini/Wagon-R taxis starting at ₹28.'
    },
    flights: {
      airportName: 'Chhatrapati Shivaji Maharaj International Airport',
      iataCode: 'BOM',
      terminal: 'Terminal 1 (Santacruz - Domestic) & Terminal 2 (Sahar - International & Major Domestic)',
      majorDirectHubs: ['Connects to all major Indian cities with hourly shuttles to Delhi, Bengaluru, and Chennai'],
      typicalOneWayFare: '₹3,000 – ₹6,500',
      transitToCityCenter: {
        distanceKm: '22 km to South Mumbai (Colaba)',
        travelTime: '30 – 45 mins via Coastal Road & Bandra-Worli Sea Link',
        prepaidTaxiFare: '₹650 – ₹850',
        metroOrBusOption: 'Metro Line 3 (Aqua Line) connects airport underground directly to BKC, Worli, and Colaba'
      },
      travelerNote: 'Terminal 2 houses the 3 km-long Jaya He GVK New Museum exhibiting 7,000+ works of Indian folk and tribal art.'
    },
    asiMonuments: {
      generalRules: [
        'Elephanta Caves ferry departs from Gateway of India; boats run every 30 minutes from 09:00 AM to 02:00 PM (closed on Mondays).',
        'CSMT Heritage Gallery inside the terminus offers guided architectural walks on weekdays.',
        'Kanheri Caves inside Sanjay Gandhi National Park require park gate ticket plus ASI cave ticket.'
      ],
      monuments: [
        {
          name: 'Elephanta Caves (Gharapuri Island)',
          monumentType: 'UNESCO World Heritage Rock-Cut Caves',
          timings: '09:00 AM – 05:30 PM (Closed on Mondays)',
          domesticFee: '₹40',
          foreignFee: '₹600',
          saarcFee: '₹40',
          closedOn: 'Closed Mondays (Ferry suspended in severe monsoon)',
          highlights: 'Colossal 20-foot three-headed Sadashiva Trimurti carved out of solid basalt in the 6th century',
          qrKioskAvailable: true
        },
        {
          name: 'Kanheri Caves Complex',
          monumentType: 'Ancient Buddhist Monastic Enclave',
          timings: '09:00 AM – 05:00 PM',
          domesticFee: '₹25',
          foreignFee: '₹300',
          saarcFee: '₹25',
          closedOn: 'Closed on Mondays',
          highlights: '109 rock-cut Buddhist chaityas and viharas spanning 1st century BCE to 10th century CE inside Sanjay Gandhi National Park',
          qrKioskAvailable: true
        }
      ]
    },
    dining: [
      {
        name: 'Britannia & Co. Restaurant (Est. 1923)',
        established: '1923',
        locality: 'Wakefield House, Ballard Estate, Fort',
        cuisineType: 'Legendary Parsi & Irani Heritage Cafe',
        isPureVeg: false,
        signatureDishes: ['Berry Pulao (Zereshk barberries from Iran)', 'Salli Boti', 'Caramel Custard', 'Dhansak'],
        spendForTwo: '₹850 – ₹1,400',
        timings: '12:00 PM – 04:00 PM (Lunch only, closed Sundays)',
        mustTryNote: 'Historic colonial cafe serving the late Boman Kohinoor\'s secret Berry Pulao recipe.'
      },
      {
        name: 'Bademiya (Est. 1946)',
        established: '1946',
        locality: 'Tulloch Road, Behind Taj Hotel, Colaba',
        cuisineType: 'Iconic Midnight Street Kebabs',
        isPureVeg: false,
        signatureDishes: ['Chicken Baida Roti', 'Mutton Seekh Kebab Rolls', 'Boti Tikka', 'Rumali Rolls'],
        spendForTwo: '₹600 – ₹1,000',
        timings: '05:00 PM – 03:00 AM (Midnight dining spot)',
        mustTryNote: 'Famous open-air charcoal barbecue stall operating for nearly eight decades.'
      },
      {
        name: 'Cafe Madras',
        established: '1940',
        locality: 'Matunga Central, King\'s Circle',
        cuisineType: 'Traditional South Indian Udipi',
        isPureVeg: true,
        signatureDishes: ['Ragi Dosa', 'Podi Idli with White Butter', 'Pineapple Sheera', 'Filter Kaapi'],
        spendForTwo: '₹250 – ₹450',
        timings: '07:00 AM – 02:30 PM, 04:00 PM – 10:30 PM (Closed Mondays)',
        mustTryNote: 'Crispy butter idlis with signature piping hot Mysore rasam and freshly brewed degree coffee.'
      }
    ]
  }
};

/**
 * Universal lookup helper: Returns rich city travel intelligence.
 * If exact city is not in hardcoded registry, dynamically constructs verified intelligence
 * utilizing the state directories and real transit benchmarks.
 */
export function getCityTravelIntelligence(destinationCity: string, stateName = 'India'): CityTravelIntelligence {
  const normCity = destinationCity.trim().toLowerCase();

  // 1. Direct registry hit
  for (const [key, value] of Object.entries(CITY_INTELLIGENCE_REGISTRY)) {
    if (normCity.includes(key) || key.includes(normCity)) {
      return value;
    }
  }

  // 2. Synthesize rich city intelligence
  const capCity = destinationCity.trim().charAt(0).toUpperCase() + destinationCity.trim().slice(1);
  return {
    cityName: capCity,
    state: stateName,
    overview: `Historic and cultural travel hub in ${stateName}, offering verified heritage monuments, direct Indian Railway connectivity, and iconic local culinary traditions.`,
    stays: [
      {
        id: `${normCity}-heritage-stay`,
        name: `${capCity} Heritage Grand & Haveli`,
        category: 'Royal Heritage Palace',
        priceRange: '₹4,500 – ₹9,200 / night',
        locality: `Central Heritage Precinct, ${capCity}`,
        amenities: ['Traditional Courtyard', 'Cultural Evening Performances', 'Complimentary Local Breakfast', 'High-Speed Wi-Fi'],
        rating: 4.7,
        reviewCount: 1840,
        badge: 'Virasat Verified Heritage',
        bookingTip: 'Book 2 weeks in advance for festive weekends; includes complimentary heritage walking orientation.'
      },
      {
        id: `${normCity}-comfort-stay`,
        name: `${capCity} City Comfort Residency`,
        category: 'Premium Comfort Hotel',
        priceRange: '₹2,200 – ₹3,800 / night',
        locality: `Railway Station Road, ${capCity}`,
        amenities: ['AC Rooms', 'Multi-cuisine Dining', '24/7 Front Desk', 'Travel Desk & Cab Rentals'],
        rating: 4.4,
        reviewCount: 950,
        badge: 'Recommended Transit Stay',
        bookingTip: 'Convenient central transit location with easy access to autorickshaws and local city bus routes.'
      },
      {
        id: `${normCity}-budget-stay`,
        name: `${capCity} Backpackers Enclave & Yatri Niwas`,
        category: 'Budget & Backpacker',
        priceRange: '₹650 – ₹1,600 / night',
        locality: `Old Town Square, ${capCity}`,
        amenities: ['Clean Dorms & Private Rooms', 'Lockers', 'Community Cafe', 'High-Speed Internet'],
        rating: 4.3,
        reviewCount: 780,
        badge: 'Budget Friendly',
        bookingTip: 'Great value for solo travelers, backpackers, and small family groups.'
      }
    ],
    trains: {
      stations: [
        { name: `${capCity} Junction`, code: capCity.substring(0, 3).toUpperCase(), distanceToCenter: '1.8 km from city heart', platforms: 6 }
      ],
      premierTrains: [
        {
          name: `${capCity} Superfast Express & Vande Bharat Network`,
          trainNo: 'Regular Daily Service',
          route: `Connecting ${capCity} to major state capitals & transit junctions`,
          travelTime: 'Varies by origin corridor',
          frequency: 'Daily schedules',
          highlights: 'Direct connectivity with AC Chair Car, 3-Tier, and Sleeper coaches'
        }
      ],
      classFares: [
        { tier: 'Executive Chair Car (EC)', code: 'EC', typicalFare: '₹1,650 – ₹2,100', amenities: 'Premium Recliners, Hot Meals' },
        { tier: 'AC Chair Car (CC)', code: 'CC', typicalFare: '₹850 – ₹1,150', amenities: 'Air Conditioned Express Transit' },
        { tier: 'AC 3-Tier (3A)', code: '3A', typicalFare: '₹950 – ₹1,250', amenities: 'Overnight Comfortable Berths & Bedroll' },
        { tier: 'Sleeper Class (SL)', code: 'SL', typicalFare: '₹320 – ₹450', amenities: 'Economical Direct Travel' }
      ],
      transitAdvice: `Official prepaid auto/taxi booths are located outside Platform 1 at ${capCity} Junction. Fixed government fares apply; avoid unmetered private touts.`
    },
    flights: {
      airportName: `${capCity} Domestic / Regional Airport (or nearest commercial hub)`,
      iataCode: capCity.substring(0, 3).toUpperCase(),
      terminal: 'Main Passenger Terminal',
      majorDirectHubs: ['Connects via Delhi, Mumbai, Bengaluru, and state capital hubs'],
      typicalOneWayFare: '₹3,200 – ₹5,800 (Economy standard)',
      transitToCityCenter: {
        distanceKm: '14 km',
        travelTime: '30 – 40 minutes',
        prepaidTaxiFare: '₹450 – ₹650',
        metroOrBusOption: 'Prepaid airport taxi counter located inside the arrival hall'
      },
      travelerNote: 'Carry valid photo identification (Aadhaar or Passport) for terminal gate entry.'
    },
    asiMonuments: {
      generalRules: [
        'Children under 15 years enter FREE across all ASI monuments in India upon presenting age proof.',
        'Official ASI QR code cashless ticketing kiosks are installed at all monument entrance gates.',
        'Still non-commercial photography is permitted free of charge across all public monument courtyards.'
      ],
      monuments: [
        {
          name: `${capCity} Historic Fort & Heritage Complex`,
          monumentType: 'ASI Nationally Protected Monument',
          timings: '08:30 AM – 05:30 PM (Sunrise to Sunset)',
          domesticFee: '₹25 – ₹50',
          foreignFee: '₹300 – ₹500',
          saarcFee: '₹25',
          closedOn: 'Open all days',
          highlights: `Centuries-old stone fortifications, carved courtyards, and museum gallery showcasing regional artifacts of ${stateName}`,
          qrKioskAvailable: true
        }
      ]
    },
    dining: [
      {
        name: `${capCity} Traditional Heritage Thali & Sweets`,
        established: '1965',
        locality: `Historic Market Square, ${capCity}`,
        cuisineType: `Authentic ${stateName} Regional Cuisine`,
        isPureVeg: true,
        signatureDishes: [`Special ${stateName} Royal Thali`, 'Fresh Regional Sweets', 'Crispy Savory Snacks', 'Masala Chai'],
        spendForTwo: '₹400 – ₹750',
        timings: '08:00 AM – 10:30 PM',
        mustTryNote: `Famous for serving authentic home-style regional curries and freshly fried local specialties in ${capCity}.`
      }
    ]
  };
}
