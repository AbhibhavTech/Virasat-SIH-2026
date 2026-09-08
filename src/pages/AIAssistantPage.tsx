import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { AdvancedAIAssistant } from '../components/ai/AdvancedAIAssistant';
import { NavTab } from '../components/layout/Sidebar';

interface AIAssistantPageProps {
  onSelectPlace: (id: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
  selectedCity: string;
  initialPrompt?: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity,
  initialPrompt,
}) => {
  return (
    <div className="w-full max-w-none px-0 py-0 animate-fadeIn pb-2">
      <AdvancedAIAssistant
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
        initialPrompt={initialPrompt}
      />
    </div>
  );
};
