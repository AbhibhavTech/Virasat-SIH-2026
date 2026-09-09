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
import { PlaceSummary } from './types';
import { api } from './services/api';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { setIsAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState<string>('All India');
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isAppInitializing, setIsAppInitializing] = useState<boolean>(true);

  const activeTab: NavTab = getActiveTabFromPath(location.pathname);

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
      />

      {/* Contextual Sub-Nav Bar */}
      <ContextualSubNav
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto min-w-0 ${
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
