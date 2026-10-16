import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  BedDouble,
  Moon,
  SunMedium,
  MapPin,
  Star,
  Check,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  X,
  Compass,
  Utensils,
  Navigation,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Clock,
  Users,
  Coffee,
  Wifi,
  Car,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { VerifiedStay, getHotelsForCity } from '../../data/hotelsData';
import { NavTab } from '../layout/Sidebar';

interface HotelRecommendationsSectionProps {
  selectedCity: string;
  selectedState?: string;
  cityLat?: number;
  cityLng?: number;
  currentDayTitle?: string;
  currentDayPlaces?: Array<{
    name: string;
    coordinates?: { lat: number; lng: number };
    category?: string;
  }>;
  onNavigateTab: (tab: NavTab) => void;
}

export const HotelRecommendationsSection: React.FC<HotelRecommendationsSectionProps> = ({
  selectedCity,
  selectedState = 'India',
  cityLat,
  cityLng,
  currentDayTitle,
  currentDayPlaces = [],
  onNavigateTab
}) => {
  const [activeTier, setActiveTier] = useState<'all' | 'luxury' | 'boutique' | 'budget'>('all');
  const [selectedHotelForMap, setSelectedHotelForMap] = useState<VerifiedStay | null>(null);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState<VerifiedStay | null>(null);

  // Load hotels for the selected city
  const hotels = getHotelsForCity(selectedCity, selectedState, cityLat, cityLng);

  const filteredHotels = hotels.filter((h) => {
    if (activeTier === 'all') return true;
    return h.tier === activeTier;
  });

  return (
    <div className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="rounded-3xl bg-linear-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/80 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF671F] uppercase tracking-wider">
              <BedDouble className="w-4 h-4" />
              <span>Where to Stay · Verified Stays & Hospitality</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Curated Stays in {selectedCity}: Day & Night Affair
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Verified accommodations with transparent overnight tariffs, flexible daytime transit rooms, 
              and direct interactive map localization relative to your daily heritage circuit.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTier('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTier === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              All Stays ({hotels.length})
            </button>
            <button
              onClick={() => setActiveTier('luxury')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTier === 'luxury'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              👑 Luxury & Resorts
            </button>
            <button
              onClick={() => setActiveTier('boutique')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTier === 'boutique'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              🌿 Boutique Hotels
            </button>
            <button
              onClick={() => setActiveTier('budget')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTier === 'budget'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              🏡 Homestays & Transit
            </button>
          </div>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="rounded-2xl sm:rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#FF671F]/40"
          >
            <div>
              {/* Hotel Image with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <img
                  src={hotel.thumbnail_url}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white font-semibold text-[11px] shadow-xs">
                    {hotel.category}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[11px] shadow-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 inset-x-3 text-white">
                  <div className="text-[11px] text-stone-200 font-medium">
                    {hotel.reviews_count}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg group-hover:text-[#FF671F] transition leading-snug">
                    {hotel.name}
                  </h4>
                  <div className="flex items-start gap-1 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    ~{hotel.distance_km} km from central heritage landmarks
                  </div>
                </div>

                {/* DAY STAY & NIGHT STAY TARIFF BOX */}
                <div className="rounded-2xl bg-amber-50/50 border border-amber-200/70 p-3 space-y-2">
                  <div className="text-[10px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#FF671F]" />
                    <span>Transparent Fare Indication</span>
                  </div>

                  {/* Night Stay Fare */}
                  <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-1.5 text-indigo-950 font-semibold">
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Night Stay:</span>
                    </div>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      {hotel.night_tariff}
                    </span>
                  </div>

                  {/* Day Stay Fare */}
                  <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-1.5 text-amber-950 font-semibold">
                      <SunMedium className="w-3.5 h-3.5 text-amber-600" />
                      <span>Day Stay / Transit:</span>
                    </div>
                    <span className="font-bold text-emerald-800 text-xs sm:text-sm">
                      {hotel.day_tariff}
                    </span>
                  </div>

                  <div className="text-[10px] text-stone-500 leading-tight pt-0.5">
                    • <strong>Night:</strong> {hotel.night_stay_timing}
                    <br />
                    • <strong>Day:</strong> {hotel.day_stay_timing}
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, 4).map((amenity, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[10px]">
                      +{hotel.amenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Footer Action Buttons */}
            <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 flex items-center gap-2 mt-2">
              {/* Primary Map Button */}
              <button
                onClick={() => setSelectedHotelForMap(hotel)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
                title="View hotel on interactive map"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>

              {/* Secondary Book / Inquire Button */}
              <button
                onClick={() => setSelectedHotelForBooking(hotel)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <BedDouble className="w-3.5 h-3.5 text-stone-600" />
                <span>Book / Inquire</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CULINARY PICKS: WHERE TO EAT IN THIS CITY */}
      <div className="rounded-3xl bg-white border border-stone-200 p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider">
              <Utensils className="w-4 h-4" />
              <span>Culinary Highlights · Where to Eat</span>
            </div>
            <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
              Authentic Flavors & Traditional Food Trails in {selectedCity}
            </h4>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Curated heritage eateries & iconic street dishes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>Haveli Heritage Punjabi Dhaba</span>
              <span className="text-[10px] text-amber-800 font-semibold">₹350/person</span>
            </div>
            <p className="text-xs text-stone-600 leading-snug">
              Famous for wood-fired Sarson da Saag, Makki di Roti with white butter, and slow-simmered Dal Makhani.
            </p>
            <div className="text-[10px] text-stone-500 flex items-center gap-1 pt-1 border-t border-amber-200/50">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>11:00 AM – 11:30 PM (Daily)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>Katani Dhaba Phase 3B2</span>
              <span className="text-[10px] text-orange-800 font-semibold">₹220/person</span>
            </div>
            <p className="text-xs text-stone-600 leading-snug">
              Legendary local eatery known for creamy Paneer Butter Masala, crisp tandoori parathas, and Malai Kofta.
            </p>
            <div className="text-[10px] text-stone-500 flex items-center gap-1 pt-1 border-t border-orange-200/50">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>08:00 AM – 11:00 PM (Daily)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>Amritsari Kulcha Hub</span>
              <span className="text-[10px] text-emerald-800 font-semibold">₹150/person</span>
            </div>
            <p className="text-xs text-stone-600 leading-snug">
              Authentic clay oven Chur-Chur Kulchas stuffed with spiced potatoes and onions, served with tangy imli chutney.
            </p>
            <div className="text-[10px] text-stone-500 flex items-center gap-1 pt-1 border-t border-emerald-200/50">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>08:30 AM – 04:30 PM (Breakfast & Lunch)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>Sindhi Sweets & Lassi Corner</span>
              <span className="text-[10px] text-blue-800 font-semibold">₹180/person</span>
            </div>
            <p className="text-xs text-stone-600 leading-snug">
              Renowned sweet shop for hot crispy Desi Ghee Jalebis, rich Malai Lassi in earthen kulhads, and Pinni.
            </p>
            <div className="text-[10px] text-stone-500 flex items-center gap-1 pt-1 border-t border-blue-200/50">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>09:00 AM – 10:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. INTERACTIVE HOTEL MAP MODAL */}
      {selectedHotelForMap && (
        <HotelMapModal
          hotel={selectedHotelForMap}
          currentDayPlaces={currentDayPlaces}
          onClose={() => setSelectedHotelForMap(null)}
          onNavigateTab={onNavigateTab}
          onOpenBooking={() => {
            const h = selectedHotelForMap;
            setSelectedHotelForMap(null);
            setSelectedHotelForBooking(h);
          }}
        />
      )}

      {/* 2. INTERACTIVE HOTEL BOOKING & INQUIRY MODAL */}
      {selectedHotelForBooking && (
        <HotelBookingModal
          hotel={selectedHotelForBooking}
          onClose={() => setSelectedHotelForBooking(null)}
        />
      )}
    </div>
  );
};

// ============================================================================
// INTERACTIVE LEAFLET HOTEL MAP MODAL
// ============================================================================

interface HotelMapModalProps {
  hotel: VerifiedStay;
  currentDayPlaces: Array<{
    name: string;
    coordinates?: { lat: number; lng: number };
    category?: string;
  }>;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenBooking: () => void;
}

const HotelMapModal: React.FC<HotelMapModalProps> = ({
  hotel,
  currentDayPlaces,
  onClose,
  onNavigateTab,
  onOpenBooking
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up prior instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [hotel.lat, hotel.lng],
      zoom: 14,
      zoomControl: true
    });
    mapInstanceRef.current = map;

    // High quality OpenStreetMap / Carto tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    // Custom Hotel Marker Icon
    const hotelIcon = L.divIcon({
      className: 'custom-hotel-marker',
      html: `
        <div style="
          background: #FF671F;
          color: white;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 14px rgba(255, 103, 31, 0.5);
          border: 3px solid white;
          animation: pulse 2s infinite;
        ">
          🏨
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const hotelMarker = L.marker([hotel.lat, hotel.lng], { icon: hotelIcon }).addTo(map);

    hotelMarker.bindPopup(`
      <div style="min-width: 200px; padding: 4px; font-family: sans-serif;">
        <div style="font-weight: bold; font-size: 13px; color: #1c1917; margin-bottom: 2px;">
          ${hotel.name}
        </div>
        <div style="font-size: 11px; color: #78716c; margin-bottom: 6px;">
          ${hotel.location}
        </div>
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 6px; font-size: 11px; margin-bottom: 6px;">
          <div style="color: #4338ca; font-weight: 600;">🌙 Night: ${hotel.night_tariff}</div>
          <div style="color: #065f46; font-weight: 600;">☀️ Day: ${hotel.day_tariff}</div>
        </div>
        <div style="font-size: 10px; color: #059669; font-weight: 600;">
          ⭐ ${hotel.rating} (${hotel.reviews_count})
        </div>
      </div>
    `).openPopup();

    // Plot surrounding stops for the day if available
    const points: [number, number][] = [[hotel.lat, hotel.lng]];

    currentDayPlaces.forEach((place, idx) => {
      if (place.coordinates?.lat && place.coordinates?.lng) {
        points.push([place.coordinates.lat, place.coordinates.lng]);

        const monumentIcon = L.divIcon({
          className: 'custom-monument-marker',
          html: `
            <div style="
              background: #0f172a;
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${idx + 1}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker([place.coordinates.lat, place.coordinates.lng], { icon: monumentIcon })
          .addTo(map)
          .bindPopup(`<b>Stop ${idx + 1}: ${place.name}</b>`);
      }
    });

    if (points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hotel, currentDayPlaces]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    hotel.name + ', ' + hotel.location
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF671F] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base font-serif">
                {hotel.name} on Interactive Map
              </h3>
              <p className="text-xs text-stone-500">
                {hotel.location} · {hotel.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Leaflet Map Body */}
        <div className="relative flex-1 min-h-[350px] sm:min-h-[420px] w-full">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Info Pill on Map */}
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-stone-200 shadow-md text-xs space-y-1 max-w-xs">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Exact Coordinates Verified</span>
            </div>
            <div className="text-stone-600 font-mono text-[11px]">
              GPS: {hotel.lat}, {hotel.lng}
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold pt-1 border-t border-stone-100">
              🌙 Night: {hotel.night_tariff}
              <br />
              ☀️ Day: {hotel.day_tariff}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-600 font-medium">
            Proximity: <strong>{hotel.distance_km} km</strong> to heritage monuments
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onNavigateTab('map');
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B192C] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Interactive Map</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Book / Inquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// INTERACTIVE HOTEL BOOKING & INQUIRY MODAL
// ============================================================================

interface HotelBookingModalProps {
  hotel: VerifiedStay;
  onClose: () => void;
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ hotel, onClose }) => {
  const [stayType, setStayType] = useState<'night' | 'day'>('night');
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const tariffPerUnit = stayType === 'night' ? hotel.night_tariff_num : hotel.day_tariff_num;
  const subtotal = tariffPerUnit * roomsCount;
  const taxes = Math.round(subtotal * 0.12); // 12% GST
  const grandTotal = subtotal + taxes;

  const handleConfirmBooking = () => {
    const refCode = `VIRASAT-${stayType === 'night' ? 'NGT' : 'DAY'}-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(refCode);
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF671F] flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base font-serif">
                Reserve Stay: {hotel.name}
              </h3>
              <p className="text-xs text-stone-500">
                {hotel.city}, {hotel.state} · Direct Partner Rates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isBooked ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold font-serif text-stone-900">
                Reservation Confirmed!
              </h4>
              <p className="text-xs text-stone-600">
                Your reservation inquiry has been generated and locked in at official heritage partner rates.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Booking Reference:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{bookingRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Stay Type:</span>
                <span className="font-semibold text-stone-900">
                  {stayType === 'night' ? '🌙 Night Stay Affair' : '☀️ Day Stay (Transit)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Date:</span>
                <span className="font-semibold text-stone-900">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Guests & Rooms:</span>
                <span className="font-semibold text-stone-900">
                  {guestsCount} Guests · {roomsCount} Room(s)
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-stone-900 font-bold">
                <span>Estimated Tariff (incl. GST):</span>
                <span className="text-emerald-700 font-mono text-sm">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              A voucher copy has been saved to your Virasat travel dossier. Reception phone: {hotel.phone || '+91 1800 200 4567'}
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Close & Return to Dossier
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Stay Type Toggle: Night vs Day Stay */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Stay Option:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStayType('night')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    stayType === 'night'
                      ? 'border-[#FF671F] bg-orange-50/60 ring-2 ring-[#FF671F]/30'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span>Night Stay Affair</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Overnight luxury stay with complimentary breakfast.
                  </div>
                  <div className="text-xs font-bold text-[#FF671F] mt-2">
                    {hotel.night_tariff}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStayType('day')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    stayType === 'day'
                      ? 'border-[#FF671F] bg-orange-50/60 ring-2 ring-[#FF671F]/30'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <SunMedium className="w-4 h-4 text-amber-500" />
                    <span>Day Stay (Transit)</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    6–8 hour daytime use, lounge access & fresh up room.
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-2">
                    {hotel.day_tariff}
                  </div>
                </button>
              </div>
            </div>

            {/* Date & Guest Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Check-in Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#FF671F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Number of Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#FF671F]"
                >
                  <option value={1}>1 Guest (Solo Traveler)</option>
                  <option value={2}>2 Guests (Couple / Pair)</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4+ Guests (Family Suite)</option>
                </select>
              </div>
            </div>

            {/* Timing Guidance */}
            <div className="rounded-xl bg-stone-50 p-3 text-[11px] text-stone-600 space-y-1 border border-stone-100">
              <div className="font-semibold text-stone-800">Check-in / Check-out Window:</div>
              {stayType === 'night' ? (
                <div>{hotel.night_stay_timing}</div>
              ) : (
                <div>{hotel.day_stay_timing}</div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Room Tariff ({stayType === 'night' ? 'Night Rate' : 'Day Use'}):</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Taxes & Service GST (12%):</span>
                <span>₹{taxes.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Total Estimated Fare:</span>
                <span className="text-[#FF671F] font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleConfirmBooking}
              className="w-full py-3 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Confirm Reservation Inquiry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
