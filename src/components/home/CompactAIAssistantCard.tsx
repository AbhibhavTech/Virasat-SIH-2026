import React, { useState } from 'react';
import { Bot, ArrowRight, Sparkles, Compass, MapPin } from 'lucide-react';

interface CompactAIAssistantCardProps {
  onOpenAIChat?: (prompt: string) => void;
  onNavigateTab?: (tab: any) => void;
  className?: string;
}

export const CompactAIAssistantCard: React.FC<CompactAIAssistantCardProps> = ({
  onOpenAIChat,
  onNavigateTab,
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleOpen = (promptText?: string) => {
    const finalPrompt = (promptText || query).trim();
    if (onOpenAIChat) {
      onOpenAIChat(finalPrompt || 'Namaste! How can I help you explore India?');
    } else if (onNavigateTab) {
      onNavigateTab('ai');
    }
  };

  const suggestions = [
    { label: 'Tell me about Hampi', icon: Sparkles },
    { label: 'Plan my trip', icon: Compass },
    { label: 'Places near me', icon: MapPin },
  ];

  return (
    <div
      id="explore-virasat-assistant-card"
      className={`rounded-3xl bg-white border border-[#EFE8DF] hover:border-[#4F46E5]/40 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative group ${className}`}
    >
      {/* Subtle tricolour/accent top strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF671F] via-stone-200 to-[#046A38]" />

      <div>
        {/* Header: Icon + Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-stone-900 font-serif tracking-tight">
                  🤖 Virasat Assistant
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                AI Cultural Concierge
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpen()}
            type="button"
            className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 text-stone-600 hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] flex items-center justify-center transition shadow-2xs"
            aria-label="Open Virasat AI Assistant"
            title="Open Dedicated AI Assistant"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Greeting */}
        <div className="mt-4">
          <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900 tracking-tight">
            Namaste! What would you like to explore?
          </h4>
          <p className="text-xs text-stone-500 mt-0.5">
            Ask about monuments, 3-day plans, transport, or site features.
          </p>
        </div>

        {/* 3 Quick Suggestions */}
        <div className="mt-3.5 flex flex-wrap gap-2">
          {suggestions.map((s, idx) => {
            const Icon = s.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(s.label);
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-indigo-50 border border-[#EFE8DF] hover:border-indigo-200 text-stone-700 hover:text-indigo-700 transition flex items-center gap-1.5 shadow-2xs group/btn"
              >
                <Icon className="w-3 h-3 text-indigo-500 group-hover/btn:scale-110 transition-transform" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini input + Ask CTA */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOpen();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything or pick a topic..."
            className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 whitespace-nowrap shrink-0 group-hover:bg-indigo-700"
          >
            <span>Ask Virasat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
