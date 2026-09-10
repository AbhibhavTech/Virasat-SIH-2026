import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { NavTab } from '../components/layout/Sidebar';
import { PlaceSummary } from '../types';
import { HomePage } from '../pages/HomePage';
import { CityHubPage } from '../pages/CityHubPage';
import { ItineraryPage } from '../pages/ItineraryPage';
import { Heritage3DPage } from '../pages/Heritage3DPage';
import { MapPage } from '../pages/MapPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';
import { MyTripsPage } from '../pages/MyTripsPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { ProfilePage } from '../pages/ProfilePage';
import { DestinationDetailPage } from '../pages/DestinationDetailPage';
import { SearchPage } from '../pages/SearchPage';
import { HeritageSitesPage } from '../pages/HeritageSitesPage';
import { IndiaHierarchyPage } from '../pages/IndiaHierarchyPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

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
  if (pathname.startsWith('/city')) return 'dashboard';
  if (pathname.startsWith('/heritage')) return 'heritage';
  if (pathname.startsWith('/itinerary')) return 'itinerary';
  if (pathname.startsWith('/map')) return 'map';
  if (pathname.startsWith('/3d')) return '3d';
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
    case '3d':
      return '/3d';
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
  onNavigateTab: (tab: NavTab) => void;
  onSearch: (query: string) => void;
}

// -------------------------------------------------------------
// Route Wrappers for Param Extraction & Synchronized State
// -------------------------------------------------------------
const CityHubRoute: React.FC<{
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
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
}> = ({ onSelectPlace }) => {
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
  const initialPrompt = searchParams.get('prompt') || undefined;

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
        element={<DestinationDetailRoute onSelectPlace={onSelectPlace} />}
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
        path="/itinerary"
        element={
          <ItineraryPage
            onSelectPlace={onSelectPlace}
            onNavigateTab={onNavigateTab}
            selectedCity={selectedCity}
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
            onView3DPlace={() => {
              navigate('/3d');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        }
      />

      <Route path="/3d" element={<Heritage3DPage />} />

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
  );
};
