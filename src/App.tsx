import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './app/queryClient';
import { AppRoutes, getActiveTabFromPath, getPathForTab } from './app/routes';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NavTab } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { ContextualSubNav } from './components/layout/ContextualSubNav';
import { SimpleFooter } from './components/layout/SimpleFooter';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingSurveyModal } from './components/auth/OnboardingSurveyModal';
import { initOfficialGoogleOneTap } from './services/googleAuth';
import { BrandSplashScreen } from './components/common/BrandSplashScreen';
import { DatabaseStatusModal } from './components/database/DatabaseStatusModal';
import { AnalyticsDashboardModal } from './components/analytics/AnalyticsDashboardModal';
import { MonumentARCameraModal } from './components/ar/MonumentARCameraModal';
import { TouristSafetySOSModal } from './components/common/TouristSafetySOSModal';
import { PlaceSummary } from './types';
import { api } from './services/api';
import { useAuth } from './contexts/AuthContext';
import { updatePageSEO, generateWebSiteSchema } from './utils/seo';
import { analytics } from './services/analytics';
import { getMumbaiDestinationById } from './data/mumbaiDestinations';
import { getNearbyDiscoveryPlaceById } from './data/nearbyPlacesMMR';
import { safeLocalStorage } from './utils/storage';
import { AssistantLauncher } from './components/ai/AssistantLauncher';
import { DocumentTranslation } from './i18n/DocumentTranslation';

const SELECTED_CITY_STORAGE_KEY = 'virasat_selected_city';

const AppContent: React.FC = () => {
  const { setIsAuthModalOpen, user, loginWithGoogleDirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState<string>(() =>
    safeLocalStorage.getItem(SELECTED_CITY_STORAGE_KEY) || 'All India'
  );
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [isGlobalARModalOpen, setIsGlobalARModalOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isAppInitializing, setIsAppInitializing] = useState<boolean>(true);

  // Initialize official Google One Tap for frictionless 1-click Google Sign-In
  useEffect(() => {
    if (!user) {
      initOfficialGoogleOneTap((profile) => {
        loginWithGoogleDirect({
          id_token: profile.id_token,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        }).catch((e) => console.warn('Google One Tap sign-in error:', e));
      });
    }
  }, [user, loginWithGoogleDirect]);

  const activeTab: NavTab = getActiveTabFromPath(location.pathname);

  useEffect(() => {
    safeLocalStorage.setItem(SELECTED_CITY_STORAGE_KEY, selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    analytics.trackPageView(location.pathname);

    const isPrivate = ['/profile', '/trips', '/favorites'].some((p) => location.pathname.startsWith(p));
    let title = "Discover India's Living Heritage";
    const desc = "Explore verified monuments, cultural heritage, and living traditions across India with multimodal routing and heritage exploration.";

    if (location.pathname === '/') {
      title = "Discover India's Living Heritage";
    } else if (location.pathname.startsWith('/explore')) {
      title = "Explore Indian States & Living Heritage";
    } else if (location.pathname.startsWith('/festivals')) {
      title = "Festivals of India • Living Heritage & Cultural Calendar";
    } else if (location.pathname.startsWith('/heritage')) {
      title = "Verified Heritage Sites & UNESCO Monuments";
    } else if (location.pathname.startsWith('/itinerary')) {
      title = "AI Multimodal Itinerary & Trip Planner";
    } else if (location.pathname.startsWith('/map')) {
      title = "Interactive Heritage Map & Transport Geometry";
    } else if (location.pathname.startsWith('/ai')) {
      title = "Virasat AI • Heritage, Culture & Travel Assistant";
    } else if (location.pathname.startsWith('/trips')) {
      title = "My Saved Heritage Itineraries";
    } else if (location.pathname.startsWith('/favorites')) {
      title = "My Bookmarked Heritage Destinations";
    } else if (location.pathname.startsWith('/profile')) {
      title = "Traveler Profile & Heritage Pass";
    }

    if (!location.pathname.startsWith('/place/')) {
      updatePageSEO({
        title,
        description: desc,
        noIndex: isPrivate,
        jsonLd: location.pathname === '/' ? generateWebSiteSchema() : undefined,
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;
    const loadAllPlaces = async () => {
      try {
        const res = await api.getPlaces({ limit: 100 });
        if (isMounted && res && Array.isArray(res.data)) {
          setPlaces(res.data);
        } else if (isMounted) {
          setPlaces([]);
        }
      } catch (err) {
        console.error('Failed to load places:', err);
        if (isMounted) setPlaces([]);
      } finally {
        if (isMounted) {
          setIsAppInitializing(false);
        }
      }
    };
    loadAllPlaces();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectPlace = (id: string) => {
    const localDestination = getNearbyDiscoveryPlaceById(id) || getMumbaiDestinationById(id);
    const selectedPlace = localDestination || places.find((place) => place.id === id);
    if (selectedPlace?.city) {
      setSelectedCity(selectedPlace.city);
    }
    navigate(`/place/${encodeURIComponent(id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: NavTab, cityOverride?: string) => {
    const targetPath = getPathForTab(tab, cityOverride || selectedCity);
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCity = useCallback((city: string) => {
    setSelectedCity(city);
    if (location.pathname.startsWith('/city')) {
      navigate(`/city/${city.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative z-10 text-stone-900 selection:bg-amber-800 selection:text-white font-sans">
      {/* WCAG AA Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-amber-800 text-white rounded-xl shadow-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Skip to main content
      </a>

      {/* Branded Startup Splash Experience */}
      <BrandSplashScreen isLoading={isAppInitializing} />

      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        onOpenSearch={() => handleSearch('')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDatabaseStatus={() => setIsDatabaseModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenARCamera={() => setIsGlobalARModalOpen(true)}
        onOpenSOS={() => setIsSOSModalOpen(true)}
      />

      {/* Contextual Sub-Nav Bar */}
      <ContextualSubNav
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 w-full mx-auto min-w-0 focus:outline-none ${
        activeTab === 'ai'
          ? 'max-w-full px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-20 md:pb-6'
          : 'max-w-[98%] xl:max-w-[96%] 2xl:max-w-[1880px] px-3 sm:px-6 lg:px-8 xl:px-10 pt-3 sm:pt-6 pb-20 md:pb-6'
      }`}>
        <AppRoutes
          places={places}
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          onSelectPlace={handleSelectPlace}
          onNavigateTab={handleNavigateTab}
          onSearch={handleSearch}
        />
      </main>

      {/* Simple Clean Footer */}
      <SimpleFooter
        onNavigateTab={handleNavigateTab}
        onSelectCity={handleSelectCity}
        onOpenDatabaseStatus={() => setIsDatabaseModalOpen(true)}
      />

      {/* Native Mobile Bottom Navigation Bar (Hidden on md/tablet/laptop) */}
      <MobileBottomNav
        activeTab={activeTab}
        onNavigateTab={handleNavigateTab}
      />

      {/* Global Modals */}
      <AssistantLauncher selectedCity={selectedCity} />
      <AuthModal />
      <OnboardingSurveyModal />
      <DatabaseStatusModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />
      <AnalyticsDashboardModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
      <MonumentARCameraModal
        isOpen={isGlobalARModalOpen}
        onClose={() => setIsGlobalARModalOpen(false)}
        onSelectPlace={handleSelectPlace}
        onNavigateTab={handleNavigateTab}
      />
      <TouristSafetySOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        selectedCity={selectedCity}
      />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <FavoritesProvider>
              <AppContent />
              <DocumentTranslation />
            </FavoritesProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
