import React from 'react';
import { NavTab } from '../components/layout/Sidebar';
import { PlaceSummary } from '../types';
import { VirasatDashboard } from '../components/home/VirasatDashboard';

interface HomePageProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace: (placeId: string) => void;
  onSelectState?: (stateId: string) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  places?: PlaceSummary[];
  onPlanTripParams?: (params: {
    city: string;
    durationDays: number;
    interests: string[];
    pace: 'relaxed' | 'moderate' | 'fast';
  }) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onNavigateTab,
  onSelectPlace,
  onSelectCity,
  onOpenAIChat,
  places,
}) => {
  return (
    <VirasatDashboard
      onSearch={onSearch}
      onNavigateTab={onNavigateTab}
      onSelectPlace={onSelectPlace}
      onSelectCity={onSelectCity}
      onOpenAIChat={onOpenAIChat}
      places={places}
    />
  );
};

