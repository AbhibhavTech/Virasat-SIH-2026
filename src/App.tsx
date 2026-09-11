import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './app/queryClient';
import { AppRoutes, getActiveTabFromPath, getPathForTab } from './app/routes';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { NavTab } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { ContextualSubNav } from './components/layout/ContextualSubNav';
import { SimpleFooter } from './components/layout/SimpleFooter';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingSurveyModal } from './components/auth/OnboardingSurveyModal';
import { BrandSplashScreen } from './components/common/BrandSplashScreen';
import { DatabaseStatusModal } from './components/database/DatabaseStatusModal';
import { AnalyticsDashboardModal } from './components/analytics/AnalyticsDashboardModal';
import { PlaceSummary } from './types';
import { api } from './services/api';
import { useAuth } from './contexts/AuthContext';
import { updatePageSEO, generateWebSiteSchema } from './utils/seo';
import { analytics } from './services/analytics';

const AppContent: React.FC = () => {
  const { setIsAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState<string>('All India');
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [isAppInitializing, setIsAppInitializing] = useState<boolean>(true);

  const activeTab: NavTab = getActiveTabFromPath(location.pathname);

  useEffect(() => {
    analytics.trackPageView(location.pathname);

    const isPrivate = ['/profile', '/trips', '/favorites'].some((p) => location.pathname.startsWith(p));
    let title = "Discover India's Living Heritage";
    const desc = "Explore verified monuments, cultural heritage, and living traditions across India with multimodal routing and 3D exploration.";

    if (location.pathname === '/') {
      title = "Discover India's Living Heritage";
    } else if (location.pathname.startsWith('/explore')) {
      title = "Explore Indian States & Living Heritage";
    } else if (location.pathname.startsWith('/heritage')) {
      title = "Verified Heritage Sites & UNESCO Monuments";
    } else if (location.pathname.startsWith('/itinerary')) {
      title = "AI Multimodal Itinerary & Trip Planner";
    } else if (location.pathname.startsWith('/map')) {
      title = "Interactive Heritage Map & Transport Geometry";
    } else if (location.pathname.startsWith('/3d')) {
      title = "Interactive 3D Heritage Monument Explorer";
    } else if (location.pathname.startsWith('/ai')) {
      title = "Virasat AI Heritage Concierge & Travel Guide";
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
        const res = await api.getPlaces({ limit: 1000 });
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
    navigate(`/place/${encodeURIComponent(id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: NavTab) => {
    const targetPath = getPathForTab(tab, selectedCity);
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    if (location.pathname.startsWith('/city')) {
      navigate(`/city/${city.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-800 selection:text-white font-sans">
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
          ? 'max-w-full px-2 sm:px-4 lg:px-6 pt-3 pb-4'
          : 'max-w-[96%] lg:max-w-[94%] xl:max-w-[92%] 2xl:max-w-[1760px] px-3 sm:px-6 lg:px-8 xl:px-10 pt-6'
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

      {/* Global Modals */}
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
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
