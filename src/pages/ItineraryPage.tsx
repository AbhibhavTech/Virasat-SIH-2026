import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  IndianRupee,
  Sparkles,
  MapPin,
  Check,
  Loader2,
  Share2,
  Download,
  Map as MapIcon,
  ShoppingBag,
  Leaf,
  ShieldCheck,
  Compass,
  HeartHandshake,
  Luggage,
  ChevronRight,
  Search,
  X,
  Bookmark,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Hotel,
  Utensils,
  Bus,
  Train,
  Car,
  Footprints,
  Wallet,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  Eye,
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse, ItineraryDay } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { ALL_INDIAN_TOURISM_CITIES, CityOption } from '../data/cityItineraryData';
import { MUMBAI_LOCAL_PICKS, MUMBAI_STAYS, MUMBAI_TRANSPORTATION } from '../data/mumbaiMasterData';
import { DestinationGalleryCarousel } from '../components/itinerary/DestinationGalleryCarousel';
import { IncredibleIndiaVideoGallery } from '../components/itinerary/IncredibleIndiaVideoGallery';
import { ItineraryCostDonutChart } from '../components/itinerary/ItineraryCostDonutChart';

interface ItineraryPageProps {
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity: string;
}

interface PreferencePill {
  id: string;
  label: string;
  icon: string;
}

const PREFERENCE_PILLS: PreferencePill[] = [
  { id: 'heritage', label: 'Heritage & Monuments', icon: '🏛️' },
  { id: 'beaches_nature', label: 'Beaches & Nature', icon: '🌴' },
  { id: 'food_markets', label: 'Food & Local Markets', icon: '🍲' },
  { id: 'museums_arts', label: 'Museums & Arts', icon: '🎨' },
  { id: 'spiritual', label: 'Spiritual & Temples', icon: '🪷' },
  { id: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦' },
];

export const ItineraryPage: React.FC<ItineraryPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity = 'Mumbai',
}) => {
  // Destination state
  const [selectedCityObj, setSelectedCityObj] = useState<CityOption>(() => {
    const found = ALL_INDIAN_TOURISM_CITIES.find(
      (c) => c.name.toLowerCase() === selectedCity.toLowerCase() || c.id.toLowerCase() === selectedCity.toLowerCase()
    );
    return found || ALL_INDIAN_TOURISM_CITIES[0]; // Default to Mumbai
  });

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Form selections
  const [daysCount, setDaysCount] = useState<number>(5);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'fast'>('moderate');
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'heritage',
    'beaches_nature',
  ]);

  // Plan generation state
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const isMumbai = selectedCityObj.name.toLowerCase().includes('mumbai') || selectedCityObj.id.toLowerCase().includes('mumbai');
  const isPune = selectedCityObj.name.toLowerCase().includes('pune') || selectedCityObj.id.toLowerCase().includes('pune');
  const isChennai = selectedCityObj.name.toLowerCase().includes('chennai') || selectedCityObj.id.toLowerCase().includes('chennai') || selectedCityObj.state.toLowerCase().includes('tamil nadu');
  const isHimachal = selectedCityObj.state.toLowerCase().includes('himachal') || ['shimla', 'manali', 'dharamshala'].some((c) => selectedCityObj.name.toLowerCase().includes(c));

  // Stays filtered by budget
  const stays = useMemo(() => {
    if (isMumbai) {
      return (MUMBAI_STAYS as any)[budget] || MUMBAI_STAYS.moderate;
    }
    if (isPune) {
      if (budget === 'budget') {
        return [
          {
            name: 'Zostel Pune & Backpacker Hub',
            type: 'Heritage Hostel / Pod Stay',
            area: 'Viman Nagar / Koregaon Park, Pune',
            price_range: '₹900 – ₹1,800 / night',
            rating: 4.4,
            highlights: ['Youth & backpacker friendly', 'High-speed Wi-Fi', 'Close to cafes & transit'],
            thumbnail_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
          },
        ];
      }
      if (budget === 'luxury') {
        return [
          {
            name: 'The Ritz-Carlton / JW Marriott Pune',
            type: '5-Star Luxury Landmark',
            area: 'Senapati Bapat Road / Airport Road, Pune',
            price_range: '₹14,000 – ₹24,000 / night',
            rating: 4.9,
            highlights: ['Panoramic city vistas', 'Award-winning spa & fine dining', 'Exclusive heritage concierge'],
            thumbnail_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
          },
        ];
      }
      return [
        {
          name: 'Hotel Shreyas & Deccan Heritage',
          type: 'Mid-range Cultural Boutique Hotel',
          area: 'Apte Road, Deccan Gymkhana, Pune',
          price_range: '₹3,500 – ₹5,500 / night',
          rating: 4.6,
          highlights: ['Prime central heritage location', 'World-famous authentic Maharashtrian Thali', 'Valet parking'],
          thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
        },
      ];
    }
    if (isChennai) {
      if (budget === 'budget') {
        return [
          {
            name: 'Broad Lands Heritage Lodge',
            type: 'Colonial Budget Lodge',
            area: 'Triplicane, Chennai',
            price_range: '₹1,100 – ₹2,000 / night',
            rating: 4.3,
            highlights: ['Walking distance to Marina Beach', 'Historic courtyard architecture', 'Clean & peaceful'],
            thumbnail_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
          },
        ];
      }
      if (budget === 'luxury') {
        return [
          {
            name: 'Taj Coromandel / ITC Grand Chola',
            type: 'Iconic South Indian Luxury Palace',
            area: 'Nungambakkam / Guindy, Chennai',
            price_range: '₹15,000 – ₹28,000 / night',
            rating: 4.9,
            highlights: ['Chola architectural grandeur', 'Southern Spice award-winning dining', 'Royal presidential suites'],
            thumbnail_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
          },
        ];
      }
      return [
        {
          name: 'The Residency Towers',
          type: 'Boutique Business & Heritage Hotel',
          area: 'T. Nagar, Chennai',
          price_range: '₹4,000 – ₹7,000 / night',
          rating: 4.6,
          highlights: ['Heart of shopping & silk district', 'Rooftop dining & pool', 'South Indian breakfast buffet'],
          thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
        },
      ];
    }
    if (isHimachal) {
      if (budget === 'budget') {
        return [
          {
            name: 'The Hosteller / Zostel Mountain Stay',
            type: 'Alpine Backpacker Hostel',
            area: `Scenic Hills, ${selectedCityObj.name}`,
            price_range: '₹1,200 – ₹2,200 / night',
            rating: 4.5,
            highlights: ['Panoramic snow peaks view', 'Cozy cedar wood interiors', 'Cafe & common lounge'],
            thumbnail_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
          },
        ];
      }
      if (budget === 'luxury') {
        return [
          {
            name: 'The Oberoi Cecil / Wildflower Hall',
            type: 'Grand Colonial Himalayan Resort',
            area: 'Chaura Maidan, Shimla & Environs',
            price_range: '₹22,000 – ₹45,000 / night',
            rating: 4.9,
            highlights: ['Over 100 years of colonial history', 'Heated indoor pool with valley views', 'Fine dining ballroom'],
            thumbnail_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
          },
        ];
      }
      return [
        {
          name: 'Clarkes Hotel (A Heritage Grand)',
          type: 'Historic British Heritage Hotel',
          area: 'Mall Road, Shimla',
          price_range: '₹5,500 – ₹9,500 / night',
          rating: 4.7,
          highlights: ['Direct access to vehicle-free Mall Road', 'Classic English timber architecture', 'Mountain view terrace'],
          thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
        },
      ];
    }
    if (budget === 'budget') {
      return [
        {
          name: `${selectedCityObj.name} Heritage Backpackers`,
          type: 'Budget Stay / Hostel',
          area: `Central ${selectedCityObj.name}`,
          price_range: '₹1,200 – ₹2,200 / night',
          rating: 4.3,
          highlights: ['Centrally located', 'Clean AC rooms', 'Transit friendly'],
          thumbnail_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
        },
      ];
    }
    if (budget === 'luxury') {
      return [
        {
          name: `The Grand Palace Hotel ${selectedCityObj.name}`,
          type: 'Luxury Heritage Hotel',
          area: `Heritage Quarter, ${selectedCityObj.name}`,
          price_range: '₹18,000 – ₹32,000 / night',
          rating: 4.8,
          highlights: ['Signature luxury suites', 'Fine dining restaurant', 'Concierge touring'],
          thumbnail_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
        },
      ];
    }
    return [
      {
        name: `${selectedCityObj.name} Heritage Residency`,
        type: 'Mid-range Boutique Hotel',
        area: `Station / City Hub, ${selectedCityObj.name}`,
        price_range: '₹3,500 – ₹6,000 / night',
        rating: 4.5,
        highlights: ['Convenient location', 'Buffet breakfast', 'Modern amenities'],
        thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
      },
    ];
  }, [isMumbai, isPune, isChennai, isHimachal, budget, selectedCityObj.name]);

  // Transportation filtered by budget
  const transportation = useMemo(() => {
    if (isMumbai) {
      return (MUMBAI_TRANSPORTATION as any)[budget] || MUMBAI_TRANSPORTATION.moderate;
    }
    if (isPune) {
      if (budget === 'budget') {
        return [
          { mode: 'Pune Metro (Purple & Aqua Lines)', icon: 'train', cost_indication: '₹10 – ₹35 per ride', description: 'Modern, fast urban metro linking PCMC, Civil Court, Ruby Hall & Vanaz.' },
          { mode: 'PMPML City Buses & Walking', icon: 'bus', cost_indication: '₹5 – ₹25 per trip', description: 'Extensive public bus transit connecting Swargate, Pune Station & Katraj.' },
        ];
      }
      if (budget === 'luxury') {
        return [
          { mode: 'Chauffeur-Driven AC SUV / Executive Sedan', icon: 'car', cost_indication: '₹3,200 – ₹5,000 / day', description: 'Dedicated executive vehicle with hill-experienced driver for city & Sinhagad excursions.' },
          { mode: 'Private Airport & Intercity Transfer', icon: 'car', cost_indication: '₹1,800 – ₹3,200', description: 'Pre-arranged door-to-door transit between Pune airport, hotels, and Mumbai expressway.' },
        ];
      }
      return [
        { mode: 'App Cabs (Uber / Ola) & Auto-Rickshaws', icon: 'car', cost_indication: '₹80 – ₹250 per ride', description: 'Prompt and reliable on-demand auto rickshaws and AC cabs across Pune.' },
        { mode: 'Pune Metro Rail', icon: 'train', cost_indication: '₹15 – ₹30 per trip', description: 'Breeze past peak Deccan and Shivaji Nagar traffic in air-conditioned comfort.' },
      ];
    }
    if (isChennai) {
      if (budget === 'budget') {
        return [
          { mode: 'Chennai Metro & Suburban Train', icon: 'train', cost_indication: '₹10 – ₹40 per trip', description: 'Air-conditioned metro & coastal suburban railway connecting Central to Beach & Airport.' },
          { mode: 'MTC City Buses', icon: 'bus', cost_indication: '₹5 – ₹20 per trip', description: 'Thorough public bus network serving Marina, Mylapore and Besant Nagar.' },
        ];
      }
      if (budget === 'luxury') {
        return [
          { mode: 'Private Chauffeur AC Sedan', icon: 'car', cost_indication: '₹3,500 – ₹5,500 / day', description: 'Dedicated air-conditioned vehicle for exploring Chennai monuments and ECR coastal temples.' },
          { mode: 'Airport Executive Pickup', icon: 'car', cost_indication: '₹1,500 – ₹2,500', description: 'Premium door-to-door transfer with luggage assistance.' },
        ];
      }
      return [
        { mode: 'App Cabs (Uber / Ola) & Fast Autos', icon: 'car', cost_indication: '₹100 – ₹300 per trip', description: 'Convenient AC rides and quick city auto-rickshaws for sightseeing.' },
        { mode: 'Chennai Metro', icon: 'train', cost_indication: '₹20 – ₹50 per trip', description: 'Rapid transit avoiding city heat and road congestion.' },
      ];
    }
    if (isHimachal) {
      if (budget === 'budget') {
        return [
          { mode: 'UNESCO Heritage Toy Train & HRTC Mountain Buses', icon: 'train', cost_indication: '₹50 – ₹120 per trip', description: 'Iconic scenic railway journey and sturdy state mountain buses linking hill towns.' },
          { mode: 'Foot Exploration on Pedestrian Malls', icon: 'walk', cost_indication: 'Free & Scenic', description: 'Walking along vehicle-free Mall Road, The Ridge, and deodar forest nature trails.' },
        ];
      }
      if (budget === 'luxury') {
        return [
          { mode: 'Dedicated Mountain 4x4 / AC Innova with Hill Chauffeur', icon: 'car', cost_indication: '₹4,000 – ₹6,500 / day', description: 'Skilled mountain driver navigating panoramic passes, Kufri, and viewpoints safely.' },
          { mode: 'Private Heli-Taxi & Scenic Flights', icon: 'car', cost_indication: '₹3,500 – ₹8,000', description: 'Rapid aerial transfer connecting Shimla, Kullu and Chandigarh heliports.' },
        ];
      }
      return [
        { mode: 'Pre-paid Local Hill Taxis', icon: 'car', cost_indication: '₹300 – ₹800 per excursion', description: 'Regulated taxi union vehicles for local sightseeing (Jakhu, Kufri, Naldera).' },
        { mode: 'Heritage Stroll & Mountain Walks', icon: 'walk', cost_indication: 'Free', description: 'Pleasant pedestrian explorations in the crisp mountain air.' },
      ];
    }
    if (budget === 'budget') {
      return [
        { mode: 'City Bus & Local Transit', icon: 'bus', cost_indication: '₹10 – ₹30 per trip', description: 'Affordable public transit network covering all key city zones.' },
        { mode: 'Auto-Rickshaws & Walking', icon: 'walk', cost_indication: '₹30 – ₹100 per ride', description: 'Metered or shared three-wheelers and foot exploration in historic bazaars.' },
      ];
    }
    if (budget === 'luxury') {
      return [
        { mode: 'Chauffeur-Driven Air-Conditioned Sedan', icon: 'car', cost_indication: '₹3,000 – ₹5,500 / day', description: 'Dedicated executive car with experienced local chauffeur for the day.' },
        { mode: 'Private Airport Transfers', icon: 'car', cost_indication: '₹1,500 – ₹3,000', description: 'Pre-arranged door-to-door transfer with luggage assistance.' },
      ];
    }
    return [
      { mode: 'App Cabs (Uber / Ola)', icon: 'car', cost_indication: '₹150 – ₹350 per ride', description: 'Fast and comfortable on-demand cabs for city sightseeing.' },
      { mode: 'Auto-Rickshaws', icon: 'walk', cost_indication: '₹50 – ₹150 per trip', description: 'Convenient last-mile transit navigating historic streets easily.' },
    ];
  }, [isMumbai, isPune, isChennai, isHimachal, budget]);

  // Local Food & Famous Shopping Picks (Invariant across all budgets)
  const localPicks = useMemo(() => {
    if (isMumbai) {
      return MUMBAI_LOCAL_PICKS;
    }
    if (isPune) {
      return {
        restaurants: [
          { name: 'Shabree Restaurant (FC Road)', specialty: 'Authentic Maharashtrian Thali & Puran Poli', area: 'Fergusson College Road, Deccan', price_range: '₹₹ (Moderate)', highlights: 'Legendary cultural establishment serving authentic multi-course Maharashtrian culinary feasts.' },
          { name: 'Chitale Bandhu Mithaiwale', specialty: 'World-Famous Pune Bakarwadi & Mango Barfi', area: 'Bajirao Road / Deccan Gymkhana', price_range: '₹ (Affordable)', highlights: 'Century-old Maharashtrian confectionery institution renowned across the world for crispy Bakarwadi.' },
          { name: 'Cafe Goodluck (Est. 1935)', specialty: 'Signature Bun Maska, Irani Chai & Kheema Pav', area: 'FC Road Deccan', price_range: '₹ (Affordable)', highlights: 'Pune’s most cherished heritage Irani cafe at the iconic Goodluck Chowk crossroads.' },
          { name: 'Vaishali Restaurant', specialty: 'Mysore Masala Dosa & Fresh Filter Coffee', area: 'FC Road, Pune', price_range: '₹ (Affordable)', highlights: 'Beloved cultural hotspot where generations of scholars, authors, and locals congregate daily.' },
        ],
        shops: [
          { name: 'Tulsi Baug Historic Market', specialty: 'Traditional Brass Utensils & Maharashtrian Jewellery', area: 'Old Pune / Budhwar Peth', highlights: 'Vibrant centuries-old shopping alleys behind the historic Tulshibaug Ram Temple.' },
          { name: 'Laxmi Road Silk Quarter', specialty: 'Authentic Handwoven Paithani Sarees & Traditional Wear', area: 'Central Pune', highlights: 'The definitive textile market of Maharashtra boasting royal heritage Paithani weaves.' },
        ],
      };
    }
    if (isChennai) {
      return {
        restaurants: [
          { name: 'Murugan Idli Shop', specialty: 'Velvety Steamed Idlis with Podi & 4 Signature Chutneys', area: 'T. Nagar / Besant Nagar', price_range: '₹ (Affordable)', highlights: 'Internationally celebrated Tamil culinary legend serving pristine South Indian breakfast staples.' },
          { name: 'Rayar’s Mess (Est. 1935)', specialty: 'Crispy Medu Vadas, Pongal & Kaapi', area: 'Mylapore, Chennai', price_range: '₹ (Affordable)', highlights: 'A tiny heritage mess in the historic alleys of Mylapore revered by filter-coffee connoisseurs.' },
          { name: 'Annalakshmi Culinary Institution', specialty: 'Traditional Tamil Vegetarian Thali & Festive Meals', area: 'Egmore, Chennai', price_range: '₹₹ (Moderate)', highlights: 'Fine traditional dining where cultural preservation and culinary artistry meet.' },
        ],
        shops: [
          { name: 'Nalli Chinnasami Chetty (Est. 1928)', specialty: 'Pure Kanchipuram Silk & Traditional Handlooms', area: 'Panagal Park, T. Nagar', highlights: 'Iconic flagship textile emporium famous for authentic silk sarees and traditional weaves.' },
          { name: 'Mylapore Temple Bazaar', specialty: 'Tanjore Art, Bronze Deities & Brass Pooja Items', area: 'Around Kapaleeswarar Temple Tank', highlights: 'Bustling heritage stalls with handmade incense, temple jewellery, and sacred art.' },
        ],
      };
    }
    if (isHimachal) {
      return {
        restaurants: [
          { name: 'Himachali Rasoi (Mall Road)', specialty: 'Authentic Kangri & Mandi Dham Served on Brassware', area: 'Middle Bazaar / Mall Road, Shimla', price_range: '₹₹ (Moderate)', highlights: 'Dedicated heritage eatery serving slow-cooked Madra, Sepu Vadi, and festive mountain Dham.' },
          { name: 'Cafe Simla Times', specialty: 'Wood-Fired Pizza & Artisanal Bakery with Valley Views', area: 'The Ridge, Shimla', price_range: '₹₹ (Moderate)', highlights: 'Charming heritage cafe offering unmatched sunset panoramas over the snow-capped ranges.' },
          { name: 'Wake & Bake Cafe', specialty: 'French Crepes, Organic Herbal Teas & Apple Pies', area: 'Mall Road, Shimla', price_range: '₹ (Affordable)', highlights: 'A favorite creative retreat for travellers overlooking the bustling Himalayan promenade.' },
        ],
        shops: [
          { name: 'Lakkar Bazaar Crafts Market', specialty: 'Carved Deodar Wood Artifacts & Walking Sticks', area: 'Near The Ridge, Shimla', highlights: 'Historic mountain carpentry market famous for handcrafted pine and deodar keepsakes.' },
          { name: 'Himachal State Handloom Emporium', specialty: 'Pure Kullu Shawls, Kinnauri Caps & Chamba Rumals', area: 'The Mall, Shimla', highlights: 'Government-certified authentic Himalayan woollens and traditional embroidery.' },
        ],
      };
    }
    return {
      restaurants: [
        { name: `Traditional Thali House of ${selectedCityObj.name}`, specialty: 'Authentic Regional Thali & Specialties', area: 'City Centre', price_range: '₹₹ (Moderate)', highlights: 'Beloved multi-generational eatery serving authentic local culinary staples.' },
        { name: `${selectedCityObj.name} Heritage Sweets & Chaat`, specialty: 'Famous Street Delicacies & Fresh Sweets', area: 'Old Bazaar Area', price_range: '₹ (Affordable)', highlights: 'Iconic street food counter frequented by locals for decades.' },
      ],
      shops: [
        { name: `Central Heritage Bazaar of ${selectedCityObj.name}`, specialty: 'Handicrafts, Textiles & Souvenirs', area: 'Old City', highlights: 'Bustling traditional market lanes featuring local artisans and state emporiums.' },
      ],
    };
  }, [isMumbai, isPune, isChennai, isHimachal, selectedCityObj.name]);

  // Dynamic Estimated Trip Cost based on Budget
  const estimatedTotalCost = useMemo(() => {
    const dailyCost = budget === 'budget' ? 1800 : budget === 'luxury' ? 22000 : 5500;
    return daysCount * dailyCost;
  }, [budget, daysCount]);

  const handleSelectCarouselDestination = (cityId: string, cityName: string) => {
    // Find matching city in tourism registry
    const targetCityLower = cityName.toLowerCase();
    const targetIdLower = cityId.toLowerCase();
    const foundCity = ALL_INDIAN_TOURISM_CITIES.find(
      (c) =>
        c.id.toLowerCase() === targetIdLower ||
        c.name.toLowerCase() === targetCityLower ||
        targetCityLower.includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(targetCityLower)
    );

    if (foundCity) {
      setSelectedCityObj(foundCity);
      handleGeneratePlan(foundCity.name, daysCount);
    } else {
      handleGeneratePlan(cityName, daysCount);
    }

    // Smooth scroll down to planner form
    setTimeout(() => {
      const plannerSection = document.getElementById('trip-planner-form');
      if (plannerSection) {
        plannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Filter cities for search
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) {
      return ALL_INDIAN_TOURISM_CITIES;
    }
    const q = citySearchQuery.toLowerCase();
    return ALL_INDIAN_TOURISM_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q)
    );
  }, [citySearchQuery]);

  // Close city dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial load: Generate Mumbai 5 Days (or chosen city) on mount
  useEffect(() => {
    handleGeneratePlan(selectedCityObj.name, daysCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTogglePreference = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectCity = (c: CityOption) => {
    setSelectedCityObj(c);
    setCitySearchQuery('');
    setIsCityDropdownOpen(false);
  };

  const handleGeneratePlan = async (targetCityName?: string, targetDays?: number) => {
    const cityToQuery = targetCityName || selectedCityObj.name;
    const daysToQuery = targetDays || daysCount;

    setLoading(true);
    setSaveSuccess(false);
    setShareSuccess(false);

    try {
      const plan = await api.generateItinerary({
        city: cityToQuery,
        days: daysToQuery,
        days_count: daysToQuery,
        duration_hours: daysToQuery * 8,
        pace,
        budget_level: budget,
        interests: selectedPreferences,
      });
      setItinerary(plan);
    } catch (err) {
      console.error('Failed to generate city trip itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!itinerary) return;
    try {
      const stopsList = itinerary.stops || itinerary.timeline || [];
      // Save full relational itinerary to /v1/itineraries
      await api.saveItinerary({
        title: itinerary.title || `${selectedCityObj.name} ${daysCount}-Day Tour`,
        destination: selectedCityObj.name,
        city: itinerary.city || selectedCityObj.name,
        state: selectedCityObj.state,
        days_count: daysCount,
        pace,
        budget_level: budget,
        summary: itinerary.summary,
        total_cost: itinerary.estimated_total_cost || 3500,
        is_public: true,
        days: itinerary.days?.map((d: any, dIdx: number) => ({
          day_number: d.day_number || dIdx + 1,
          area_title: d.area_title || `Day ${dIdx + 1}`,
          theme: d.theme,
          notes: d.description,
          stops: (d.places || []).map((p: any, pIdx: number) => ({
            place_id: p.id || p.place_id,
            place_name: p.name,
            stop_order: pIdx + 1,
            duration_minutes: p.recommended_duration_minutes || 75,
            travel_mode: p.travel_mode_from_previous || 'Auto-Rickshaw / Local Transit',
            travel_duration_minutes: p.travel_time_from_previous_minutes || 20,
            travel_distance_km: p.distance_from_previous_km || 2.5,
            estimated_cost: p.estimated_cost || 60,
          })),
        })),
      });

      // Also persist to trips repository for user profile synchronization
      await api.saveTrip({
        title: itinerary.title || `${selectedCityObj.name} ${daysCount}-Day Tour`,
        city: itinerary.city || selectedCityObj.name,
        duration_hours: daysCount * 8,
        estimated_cost: itinerary.estimated_total_cost || 3500,
        stops: stopsList.map((item, idx) => ({
          place_id: item.place_id,
          place_name: item.name || item.place_name || `Stop ${idx + 1}`,
          order: idx + 1,
          visit_minutes: item.recommended_duration_minutes || 60,
        })),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save trip:', err);
    }
  };

  const handleSharePlan = () => {
    if (!itinerary) return;
    const url = window.location.href;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`${itinerary.title} - Planned with VIRASAT: ${url}`)
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        })
        .catch(() => {
          // Safe ignore if clipboard permission denied
        });
    }
  };

  const handleDownloadPlan = () => {
    if (!itinerary) return;
    const content = [
      `=============================================================`,
      `VIRASAT AI CITY TRIP PLANNER`,
      `${itinerary.title || `${selectedCityObj.name} ${daysCount}-Day Itinerary`}`,
      `City: ${selectedCityObj.name}, ${selectedCityObj.state}`,
      `Duration: ${daysCount} Days`,
      `Pace: ${pace.toUpperCase()} | Budget: ${budget.toUpperCase()}`,
      `=============================================================`,
      ``,
      `${itinerary.summary || ''}`,
      ``,
      ...(itinerary.days || []).map((d) => [
        `-------------------------------------------------------------`,
        `DAY ${d.day_number}: ${d.area_title.toUpperCase()}`,
        `${d.subtitle || ''}`,
        `-------------------------------------------------------------`,
        `PLACES & ATTRACTIONS:`,
        ...d.places.map((p, i) => `  ${i + 1}. ${p.name} (${p.distance_info})`),
        ``,
        `NEARBY SHOPPING & MARKETS:`,
        ...d.shopping.map((s) => `  • ${s}`),
        ``,
      ].join('\n')),
      `=============================================================`,
      `Verified Heritage Data - Government of India Tourism Standards`,
      `VIRASAT | Smart Tourism for Bharat`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCityObj.name.toLowerCase().replace(/\s+/g, '_')}_${daysCount}_days_itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 w-full py-2 sm:py-4 animate-fadeIn text-stone-800 pb-12">
      {/* 1. TOP BAR: PLAN YOUR JOURNEY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Smart Day Planner & Circuits</span>
          </div>
        </div>

        {/* Selected Destination Pill / Quick Switch */}
        <div className="relative" ref={cityDropdownRef}>
          <button
            onClick={() => setIsCityDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 shadow-xs text-xs text-stone-700 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF671F] shrink-0" />
            <div className="text-left">
              <div className="font-bold text-stone-900 leading-tight">
                {selectedCityObj.name}
              </div>
              <div className="text-[10px] text-stone-500 leading-tight">
                {selectedCityObj.state}, India
              </div>
            </div>
            <span className="text-[11px] text-[#FF671F] font-semibold ml-1">
              Change ▾
            </span>
          </button>

          {/* Quick city dropdown */}
          {isCityDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 max-h-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-stone-100 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Indian cities..."
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-hidden text-stone-800 placeholder-stone-400"
                  autoFocus
                />
                {citySearchQuery && (
                  <button onClick={() => setCitySearchQuery('')} className="text-stone-400 hover:text-stone-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1 divide-y divide-stone-50">
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCity(c)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50/70 rounded-lg transition ${
                      selectedCityObj.id === c.id ? 'bg-orange-50 text-[#0B192C] font-bold' : 'text-stone-700'
                    }`}
                  >
                    <div>
                      <div>{c.name}</div>
                      <div className="text-[10px] text-stone-400">{c.state}</div>
                    </div>
                    {c.popular && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-[#FF671F] font-medium">
                        Popular
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. FULL-SIZE LIVING HERITAGE VIDEO GALLERY (BRIGHT TONE & INCREDIBLE INDIA AESTHETIC) */}
      <IncredibleIndiaVideoGallery
        onSelectDestination={handleSelectCarouselDestination}
        selectedCityId={selectedCityObj.id}
      />

      {/* 3. DESTINATION HIGHLIGHTS GALLERY CAROUSEL (INCREDIBLE INDIA AESTHETIC) */}
      <DestinationGalleryCarousel
        onSelectDestination={handleSelectCarouselDestination}
        selectedCityId={selectedCityObj.id}
      />

      {/* 4. INPUT CARD: DESTINATION, DAYS, PACE, BUDGET & PREFERENCES */}
      <div id="trip-planner-form" className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-6 scroll-mt-6">
        {/* Row 1: 4 Selectors + Plan Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Destination / City</span>
            </label>
            <select
              value={selectedCityObj.id}
              onChange={(e) => {
                const found = ALL_INDIAN_TOURISM_CITIES.find((c) => c.id === e.target.value);
                if (found) setSelectedCityObj(found);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <optgroup label="Major Popular Hubs">
                {ALL_INDIAN_TOURISM_CITIES.filter((c) => c.popular).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All Indian States & UTs">
                {ALL_INDIAN_TOURISM_CITIES.filter((c) => !c.popular).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Number of Days */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Number of Days</span>
            </label>
            <select
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
              <option value={4}>4 Days</option>
              <option value={5}>5 Days</option>
              <option value={6}>6 Days</option>
              <option value={7}>7 Days</option>
            </select>
          </div>

          {/* Travel Pace */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Travel Pace</span>
            </label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="fast">Fast-paced</option>
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Budget Range</span>
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <option value="budget">Budget</option>
              <option value="moderate">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          {/* Plan My Trip Button */}
          <div>
            <button
              onClick={() => handleGeneratePlan()}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Plan My Trip</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Trip Preferences (Optional) Pills */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="text-xs font-bold text-stone-700">
            Trip Preferences (Optional)
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PREFERENCE_PILLS.map((pref) => {
              const isSelected = selectedPreferences.includes(pref.id);
              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => handleTogglePreference(pref.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 text-[#0B192C] border border-orange-200 shadow-xs'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span>{pref.icon}</span>
                  <span>{pref.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. ITINERARY RESULTS SECTION */}
      {itinerary && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section Header with Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                Your {itinerary.days_count || daysCount}-Day Itinerary for {itinerary.city || selectedCityObj.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
                {itinerary.summary ||
                  'A perfect mix of heritage, culture, beaches, food and local experiences — planned with nearby places to make your journey smooth and enjoyable.'}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => onNavigateTab('map')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5 text-stone-600" />
                <span>View on Map</span>
              </button>

              <button
                onClick={handleDownloadPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Download Plan</span>
              </button>

              <button
                onClick={handleSharePlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                {shareSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSavePlan}
                disabled={saveSuccess}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-white" />
                    <span>Save Trip</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* D3-BASED ESTIMATED COST BREAKDOWN DONUT CHART */}
          <ItineraryCostDonutChart
            itinerary={itinerary}
            selectedCityName={selectedCityObj.name}
            initialBudgetTier={budget}
            daysCount={daysCount}
          />

          {/* DAY-BY-DAY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {(itinerary.days || []).map((day: ItineraryDay) => (
              <div
                key={day.day_number}
                className="rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Day Header */}
                  <div className="p-4 space-y-2 border-b border-stone-100">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-[#0B192C] text-[11px] font-bold">
                      Day {day.day_number}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-sm leading-snug group-hover:text-[#FF671F] transition">
                      {day.area_title}
                    </h3>
                    <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                      {day.subtitle}
                    </p>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="px-4 pt-3">
                    <div className="h-28 w-full rounded-xl overflow-hidden bg-stone-100 relative">
                      <img
                        src={day.hero_image_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80'}
                        alt={day.area_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* List of Ordered Places */}
                  <div className="p-4 space-y-3">
                    {day.places.map((place, idx) => (
                      <div
                        key={idx}
                        onClick={() => place.id && onSelectPlace(place.id)}
                        className="flex items-start gap-2.5 text-xs cursor-pointer group/place"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-stone-800 group-hover/place:text-[#FF671F] transition leading-tight">
                            {place.name}
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                            <span>📍 {place.distance_info || '0 km'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby Shopping Box */}
                <div className="p-3 m-3 mt-0 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-800">
                    <div className="flex items-center gap-1 text-stone-700">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#FF671F]" />
                      <span>Nearby Shopping</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="text-[11px] text-stone-600 space-y-0.5 pl-4">
                    {day.shopping.map((shop, sIdx) => (
                      <div key={sIdx} className="leading-snug list-disc">
                        • {shop}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4B. TRIP COST BREAKDOWN & BUDGET SEPARATION BANNER */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Wallet className="w-4 h-4 text-[#FF671F]" />
                <h3 className="text-base font-bold text-stone-900">
                  Estimated Trip Cost: ₹{estimatedTotalCost.toLocaleString('en-IN')} for {daysCount} Days
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF671F] text-[11px] font-bold uppercase tracking-wider">
                  {budget} Tier
                </span>
              </div>
              <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                Estimated for {daysCount} days in {selectedCityObj.name}. Selecting Budget, Mid-range, or Luxury customizes your stays, transit, and estimated trip costs — while the verified heritage attractions and authentic local food picks remain strictly invariant!
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-center">
              <div className="px-3 py-2 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] text-stone-500">Stays / Night</div>
                <div className="text-xs font-bold text-stone-900">
                  {budget === 'budget' ? '₹1,200 – ₹2,500' : budget === 'luxury' ? '₹18,000 – ₹45,000' : '₹4,000 – ₹7,500'}
                </div>
              </div>
              <div className="px-3 py-2 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="text-[10px] text-stone-500">Daily Transit</div>
                <div className="text-xs font-bold text-stone-900">
                  {budget === 'budget' ? '₹50 – ₹150' : budget === 'luxury' ? '₹3,500 – ₹6,000' : '₹300 – ₹800'}
                </div>
              </div>
            </div>
          </div>

          {/* 4C. RECOMMENDED STAYS (CHANGES WITH BUDGET DROPDOWN) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#FF671F]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Recommended Stays ({budget.charAt(0).toUpperCase() + budget.slice(1)})
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                Updates dynamically with budget tier
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stays.map((stay: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-36 w-full overflow-hidden bg-stone-100">
                      <img
                        src={stay.thumbnail_url}
                        alt={stay.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/70 text-white text-[10px] font-bold backdrop-blur-xs">
                        {stay.type}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-stone-950" />
                        <span>{stay.rating}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div>
                        <h4 className="font-serif font-bold text-stone-900 text-sm leading-snug">
                          {stay.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#FF671F] shrink-0" />
                          <span className="truncate">{stay.area}</span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-[#FF671F] pt-1">
                        {stay.price_range}
                      </div>

                      <div className="space-y-1 pt-2 border-t border-stone-100">
                        {stay.highlights.map((h: string, hIdx: number) => (
                          <div key={hIdx} className="text-[11px] text-stone-600 flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4D. RECOMMENDED TRANSPORTATION (CHANGES WITH BUDGET DROPDOWN) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF671F]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Recommended Transportation ({budget.charAt(0).toUpperCase() + budget.slice(1)})
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                Destination-aware transit options
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {transportation.map((trans: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-stone-200/90 p-4 shadow-xs hover:shadow-md transition space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF671F] flex items-center justify-center font-bold">
                      {trans.icon === 'train' ? <Train className="w-4 h-4" /> : trans.icon === 'bus' ? <Bus className="w-4 h-4" /> : trans.icon === 'walk' ? <Footprints className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 leading-snug">
                        {trans.mode}
                      </h4>
                      <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {trans.cost_indication}
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {trans.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4E. LOCAL FOOD & FAMOUS SHOPPING PICKS (INVARIANT ACROSS BUDGETS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#FF671F]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Local Food &amp; Famous Shopping Picks
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                Same for all budgets
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Local Food Picks */}
              <div className="rounded-2xl bg-white border border-stone-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF671F] pb-2 border-b border-stone-100">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Authentic Restaurants &amp; Culinary Institutions</span>
                </div>

                <div className="space-y-3">
                  {localPicks.restaurants.map((res: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-bold text-xs text-stone-900">{res.name}</h5>
                        <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded bg-white border border-stone-200 shrink-0">
                          {res.price_range}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#FF671F] font-semibold">
                        🍲 {res.specialty}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        📍 {res.area}
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
                        {res.highlights}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Famous Shopping Picks */}
              <div className="rounded-2xl bg-white border border-stone-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 pb-2 border-b border-stone-100">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Famous Local Markets &amp; Bazaars</span>
                </div>

                <div className="space-y-3">
                  {localPicks.shops.map((shop: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <h5 className="font-bold text-xs text-stone-900">{shop.name}</h5>
                      <div className="text-[11px] text-emerald-800 font-semibold">
                        🛍️ {shop.specialty}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        📍 {shop.area}
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
                        {shop.highlights}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. TRAVEL RESPONSIBLY GREEN BANNER */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/90 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-950">
                  Travel Responsibly
                </h4>
                <p className="text-xs text-emerald-800 max-w-2xl leading-relaxed">
                  Help preserve India's heritage, respect local culture, keep places clean, and support local communities.
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-900/80 italic text-right self-end sm:self-center">
              "A smarter journey. A greener tomorrow."
            </div>
          </div>

          {/* 6. BOTTOM 4 VALUE PROPOSITION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-200/80">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF671F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Verified Information</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  From government and trusted sources
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Nearby Places</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Smartly grouped for less travel
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-800 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Local Experiences</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Discover more than just the famous
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Luggage className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Your Perfect Journey</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Simple, cozy and personalized
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
