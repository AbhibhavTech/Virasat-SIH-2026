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
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 animate-fadeIn space-y-6 pb-12">
      {/* Editorial Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200 text-xs font-semibold shadow-2xs">
          <Bot className="w-3.5 h-3.5 text-[#FF671F]" />
          <span>Virasat AI Assistant • Grounded Heritage Guide</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight">
          Virasat AI Assistant
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
          “Namaste! 👋 How can I help you today?” Ask anything about Indian heritage, 3-day travel circuits, or how to explore.
        </p>
      </div>

      <AdvancedAIAssistant
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
        initialPrompt={initialPrompt}
      />
    </div>
  );
};
