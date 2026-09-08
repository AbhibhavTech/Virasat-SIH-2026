import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { NavTab } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { ContextualSubNav } from './components/layout/ContextualSubNav';
import { SimpleFooter } from './components/layout/SimpleFooter';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingSurveyModal } from './components/auth/OnboardingSurveyModal';
import { HomePage } from './pages/HomePage';
import { CityHubPage } from './pages/CityHubPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { Heritage3DPage } from './pages/Heritage3DPage';
import { MapPage } from './pages/MapPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { SearchPage } from './pages/SearchPage';
import { HeritageSitesPage } from './pages/HeritageSitesPage';
import { IndiaHierarchyPage } from './pages/IndiaHierarchyPage';
import { BrandSplashScreen } from './components/common/BrandSplashScreen';
import { DatabaseStatusModal } from './components/database/DatabaseStatusModal';
import { PlaceSummary } from './types';
import { api } from './services/api';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('All India');
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [initialAIPrompt, setInitialAIPrompt] = useState<string | undefined>(undefined);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadAllPlaces = async () => {
      try {
        const res = await api.getPlaces({ limit: 100 });
        if (res && Array.isArray(res.data)) {
          setPlaces(res.data);
        } else {
          setPlaces([]);
        }
      } catch (err) {
        console.error('Failed to load places:', err);
        setPlaces([]);
      }
    };
    loadAllPlaces();
  }, []);

  const handleSelectPlace = (id: string) => {
    setSelectedPlaceId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedPlaceId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedPlaceId(null);
    setSearchQuery(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectState = (stateId: string) => {
    if (stateId === 'mumbai') setSelectedCity('Mumbai');
    else if (stateId === 'rajasthan') setSelectedCity('Jaipur');
    else if (stateId === 'kerala') setSelectedCity('Kochi');
    else if (stateId === 'goa') setSelectedCity('Goa');
    else if (stateId === 'delhi') setSelectedCity('Delhi');
    else if (stateId === 'agra') setSelectedCity('Agra');
    setActiveTab('dashboard');
    setSelectedPlaceId(null);
    setSearchQuery(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-800 selection:text-white font-sans">
      {/* Branded Startup Splash Experience */}
      <BrandSplashScreen />

      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
        }}
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
      <main className="flex-1 w-full max-w-[96%] lg:max-w-[94%] xl:max-w-[92%] 2xl:max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-6 min-w-0">
        {selectedPlaceId ? (
          <DestinationDetailPage
            placeId={selectedPlaceId}
            onBack={() => setSelectedPlaceId(null)}
            onSelectPlace={handleSelectPlace}
            onOpenAIChat={(pId, pName) => {
              setActiveTab('ai');
              setSelectedPlaceId(null);
            }}
          />
        ) : searchQuery !== null ? (
          <SearchPage
            initialQuery={searchQuery}
            onSelectPlace={handleSelectPlace}
            onBack={() => setSearchQuery(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                onSearch={handleSearch}
                onNavigateTab={handleNavigateTab}
                onSelectPlace={handleSelectPlace}
                onSelectState={handleSelectState}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                places={places}
                onOpenAIChat={(prompt) => {
                  setInitialAIPrompt(prompt);
                  setActiveTab('ai');
                  setSelectedPlaceId(null);
                  setSearchQuery(null);
                }}
              />
            )}

            {activeTab === 'india' && (
              <IndiaHierarchyPage
                onSelectPlace={handleSelectPlace}
                onNavigateTab={handleNavigateTab}
                onSelectCity={setSelectedCity}
              />
            )}

            {activeTab === 'dashboard' && (
              <CityHubPage
                onSelectPlace={handleSelectPlace}
                onNavigateTab={handleNavigateTab}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
              />
            )}

            {activeTab === 'heritage' && (
              <HeritageSitesPage
                onSelectPlace={handleSelectPlace}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'itinerary' && (
              <ItineraryPage
                onSelectPlace={handleSelectPlace}
                onNavigateTab={handleNavigateTab}
                selectedCity={selectedCity}
              />
            )}

            {activeTab === 'map' && (
              <MapPage
                onSelectPlace={handleSelectPlace}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                onView3DPlace={(placeId) => {
                  setActiveTab('3d');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === '3d' && <Heritage3DPage />}

            {activeTab === 'ai' && (
              <AIAssistantPage
                onSelectPlace={handleSelectPlace}
                onNavigateTab={handleNavigateTab}
                selectedCity={selectedCity}
                initialPrompt={initialAIPrompt}
              />
            )}

            {activeTab === 'trips' && (
              <MyTripsPage
                onNavigateTab={handleNavigateTab}
                onSelectPlace={handleSelectPlace}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesPage
                onSelectPlace={handleSelectPlace}
                places={places}
              />
            )}

            {activeTab === 'profile' && (
              <ProfilePage onNavigateTab={handleNavigateTab} />
            )}
          </>
        )}
      </main>

      {/* Simple Clean Footer */}
      <SimpleFooter
        onNavigateTab={handleNavigateTab}
        onSelectCity={setSelectedCity}
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
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
}
