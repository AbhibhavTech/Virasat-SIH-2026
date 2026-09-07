import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { AdvancedAIAssistant } from '../components/ai/AdvancedAIAssistant';

interface AIAssistantPageProps {
  onSelectPlace: (id: string) => void;
  selectedCity: string;
  initialPrompt?: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onSelectPlace,
  selectedCity,
  initialPrompt,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-fadeIn space-y-6">
      {/* Editorial Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
          <span>Ask Virasat • Cultural Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight">
          Ask Virasat
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
          Your intelligent guide to India's living heritage, architecture, and journeys.
        </p>
      </div>

      <AdvancedAIAssistant
        onSelectPlace={onSelectPlace}
        selectedCity={selectedCity}
        initialPrompt={initialPrompt}
      />
    </div>
  );
};
