import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { NavTab } from '../components/layout/Sidebar';
import { PlaceSummary } from '../types';
// Lazy-loaded route pages for optimized bundle splitting & faster initial load
const HomePage = React.lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const CityHubPage = React.lazy(() => import('../pages/CityHubPage').then((m) => ({ default: m.CityHubPage })));
const ItineraryPage = React.lazy(() => import('../pages/ItineraryPage').then((m) => ({ default: m.ItineraryPage })));
const MapPage = React.lazy(() => import('../pages/MapPage').then((m) => ({ default: m.MapPage })));
const AIAssistantPage = React.lazy(() => import('../pages/AIAssistantPage').then((m) => ({ default: m.AIAssistantPage })));
const MyTripsPage = React.lazy(() => import('../pages/MyTripsPage').then((m) => ({ default: m.MyTripsPage })));
const FavoritesPage = React.lazy(() => import('../pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const DestinationDetailPage = React.lazy(() => import('../pages/DestinationDetailPage').then((m) => ({ default: m.DestinationDetailPage })));
const SearchPage = React.lazy(() => import('../pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const HeritageSitesPage = React.lazy(() => import('../pages/HeritageSitesPage').then((m) => ({ default: m.HeritageSitesPage })));
const HeritageDetailPage = React.lazy(() => import('../pages/HeritageDetailPage').then((m) => ({ default: m.HeritageDetailPage })));
const IndiaHierarchyPage = React.lazy(() => import('../pages/IndiaHierarchyPage').then((m) => ({ default: m.IndiaHierarchyPage })));
const AdminDashboardPage = React.lazy(() => import('../pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const FestivalsPage = React.lazy(() => import('../pages/FestivalsPage').then((m) => ({ default: m.FestivalsPage })));

const RouteLoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 py-16 animate-fadeIn">
    <div className="w-9 h-9 border-3 border-amber-200 border-t-[#FF671F] rounded-full animate-spin" />
    <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Loading Virasat...</span>
  </div>
);

export function formatCityName(cityId: string): string {
  if (!cityId) return 'Mumbai';
  const clean = decodeURIComponent(cityId).replace(/-/g, ' ').toLowerCase();
  const knownCities: Record<string, string> = {
    mumbai: 'Mumbai',
    delhi: 'Delhi',
    jaipur: 'Jaipur',
    agra: 'Agra',
    varanasi: 'Varanasi',
    kochi: 'Kochi',
    goa: 'Goa',
    bengaluru: 'Bengaluru',
    hyderabad: 'Hyderabad',
    pune: 'Pune',
    udaipur: 'Udaipur',
    hampi: 'Hampi',
    madurai: 'Madurai',
    'chhatrapati sambhajinagar': 'Chhatrapati Sambhajinagar',
    'bodh gaya': 'Bodh Gaya',
    bhubaneswar: 'Bhubaneswar',
    srinagar: 'Srinagar',
    'port blair': 'Port Blair',
    shimla: 'Shimla',
    jodhpur: 'Jodhpur',
    jaisalmer: 'Jaisalmer',
    gangtok: 'Gangtok',
  };
  if (knownCities[clean]) return knownCities[clean];
  return clean.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function getActiveTabFromPath(pathname: string): NavTab {
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.startsWith('/explore')) return 'india';
  if (pathname.startsWith('/festivals')) return 'festivals';
  if (pathname.startsWith('/city')) return 'dashboard';
  if (pathname.startsWith('/heritage')) return 'heritage';
  if (pathname.startsWith('/itinerary')) return 'itinerary';
  if (pathname.startsWith('/map')) return 'map';
  if (pathname.startsWith('/3d')) return 'heritage';
  if (pathname.startsWith('/ai')) return 'ai';
  if (pathname.startsWith('/trips')) return 'trips';
  if (pathname.startsWith('/favorites')) return 'favorites';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/search')) return 'home';
  if (pathname.startsWith('/place')) return 'dashboard';
  return 'home';
}

export function getPathForTab(tab: NavTab, city?: string): string {
  switch (tab) {
    case 'home':
      return '/';
    case 'festivals':
      return '/festivals';
    case 'india':
      return '/explore';
    case 'dashboard':
      return `/city/${(city && city !== 'All India' ? city : 'mumbai').toLowerCase().replace(/\s+/g, '-')}`;
    case 'heritage':
      return '/heritage';
    case 'itinerary':
      return '/itinerary';
    case 'map':
      return '/map';
    case 'ai':
      return '/ai';
    case 'trips':
      return '/trips';
    case 'favorites':
      return '/favorites';
    case 'profile':
      return '/profile';
    default:
      return '/';
  }
}

interface AppRoutesProps {
  places: PlaceSummary[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: NavTab, city?: string) => void;
  onSearch: (query: string) => void;
}

// -------------------------------------------------------------
// Route Wrappers for Param Extraction & Synchronized State
// -------------------------------------------------------------
const CityHubRoute: React.FC<{
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab, city?: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}> = ({ onSelectPlace, onNavigateTab, selectedCity, onSelectCity }) => {
  const { cityId } = useParams<{ cityId: string }>();

  useEffect(() => {
    if (cityId) {
      const formatted = formatCityName(cityId);
      if (formatted !== selectedCity) {
        onSelectCity(formatted);
      }
    }
  }, [cityId, selectedCity, onSelectCity]);

  const activeCity = cityId ? formatCityName(cityId) : selectedCity;

  return (
    <CityHubPage
      onSelectPlace={onSelectPlace}
      onNavigateTab={onNavigateTab}
      selectedCity={activeCity}
      onSelectCity={onSelectCity}
    />
  );
};

const DestinationDetailRoute: React.FC<{
  onSelectPlace: (id: string) => void;
  onSelectCity: (city: string) => void;
}> = ({ onSelectPlace, onSelectCity }) => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();

  if (!placeId) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <DestinationDetailPage
      placeId={placeId}
      onBack={() => navigate(-1)}
      onSelectPlace={onSelectPlace}
      onSelectCity={onSelectCity}
      onOpenMap={(destinationId, city) => {
        onSelectCity(city);
        navigate(`/map?city=${encodeURIComponent(city)}&destination=${encodeURIComponent(destinationId)}`);
      }}
      onOpenAIChat={(_pId, pName) => {
        navigate(`/ai?prompt=${encodeURIComponent(`Tell me about ${pName}`)}`);
      }}
    />
  );
};

const SearchRoute: React.FC<{
  onSelectPlace: (id: string) => void;
}> = ({ onSelectPlace }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  return (
    <SearchPage
      initialQuery={query}
      onSelectPlace={onSelectPlace}
      onBack={() => navigate(-1)}
    />
  );
};

const AIAssistantRoute: React.FC<{
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity: string;
}> = ({ onSelectPlace, onNavigateTab, selectedCity }) => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || searchParams.get('q') || undefined;

  return (
    <AIAssistantPage
      onSelectPlace={onSelectPlace}
      onNavigateTab={onNavigateTab}
      selectedCity={selectedCity}
      initialPrompt={initialPrompt}
    />
  );
};

export const AppRoutes: React.FC<AppRoutesProps> = ({
  places,
  selectedCity,
  onSelectCity,
  onSelectPlace,
  onNavigateTab,
  onSearch,
}) => {
  const navigate = useNavigate();

  const handleSelectState = (stateId: string) => {
    let city = 'Mumbai';
    if (stateId === 'mumbai') city = 'Mumbai';
    else if (stateId === 'rajasthan') city = 'Jaipur';
    else if (stateId === 'kerala') city = 'Kochi';
    else if (stateId === 'goa') city = 'Goa';
    else if (stateId === 'delhi') city = 'Delhi';
    else if (stateId === 'agra') city = 'Agra';
    onSelectCity(city);
    navigate(`/city/${city.toLowerCase().replace(/\s+/g, '-')}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <React.Suspense fallback={<RouteLoadingSpinner />}>
      <Routes>
      <Route
        path="/"
        element={
          <HomePage
            onSearch={onSearch}
            onNavigateTab={onNavigateTab}
            onSelectPlace={onSelectPlace}
            onSelectState={handleSelectState}
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
            places={places}
            onOpenAIChat={(prompt) => {
              navigate(`/ai${prompt ? `?prompt=${encodeURIComponent(prompt)}` : ''}`);
            }}
          />
        }
      />

      <Route
        path="/explore"
        element={
          <IndiaHierarchyPage
            onSelectPlace={onSelectPlace}
            onNavigateTab={onNavigateTab}
            onSelectCity={onSelectCity}
          />
        }
      />

      <Route
        path="/festivals"
        element={
          <FestivalsPage
            onSelectPlace={onSelectPlace}
            onNavigateTab={onNavigateTab}
          />
        }
      />

      <Route
        path="/city/:cityId"
        element={
          <CityHubRoute
            onSelectPlace={onSelectPlace}
            onNavigateTab={onNavigateTab}
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />
        }
      />

      <Route
        path="/city"
        element={<Navigate to={`/city/${selectedCity && selectedCity !== 'All India' ? selectedCity.toLowerCase().replace(/\s+/g, '-') : 'mumbai'}`} replace />}
      />

      <Route
        path="/place/:placeId"
        element={<DestinationDetailRoute onSelectPlace={onSelectPlace} onSelectCity={onSelectCity} />}
      />

      <Route
        path="/heritage"
        element={
          <HeritageSitesPage
            onSelectPlace={onSelectPlace}
            onNavigateTab={onNavigateTab}
          />
        }
      />

      <Route
        path="/heritage/:slug"
        element={
          <HeritageDetailPage
            onNavigateTab={onNavigateTab}
            onSelectPlace={onSelectPlace}
          />
        }
      />

      <Route
        path="/itinerary"
        element={
          <ItineraryPage
            onSelectPlace={onSelectPlace}
            onNavigateTab={onNavigateTab}
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />
        }
      />

      <Route
        path="/map"
        element={
          <MapPage
            onSelectPlace={onSelectPlace}
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />
        }
      />

      <Route path="/3d" element={<Navigate to="/heritage" replace />} />

      <Route
        path="/ai"
        element={
          <AIAssistantRoute
            onSelectPlace={onSelectPlace}
            onNavigateTab={onNavigateTab}
            selectedCity={selectedCity}
          />
        }
      />

      <Route
        path="/trips"
        element={
          <MyTripsPage
            onNavigateTab={onNavigateTab}
            onSelectPlace={onSelectPlace}
          />
        }
      />

      <Route
        path="/favorites"
        element={
          <FavoritesPage
            onSelectPlace={onSelectPlace}
            places={places}
          />
        }
      />

      <Route
        path="/profile"
        element={<ProfilePage onNavigateTab={onNavigateTab} />}
      />

      <Route
        path="/search"
        element={<SearchRoute onSelectPlace={onSelectPlace} />}
      />

      <Route path="/admin" element={<AdminDashboardPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </React.Suspense>
  );
};
