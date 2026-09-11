import React, { useState } from 'react';
import { X, Sparkles, Compass, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { OnboardingSurvey } from '../../types';

export const OnboardingSurveyModal: React.FC = () => {
  const { isOnboardingModalOpen, setIsOnboardingModalOpen, saveSurvey } = useAuth();
  const [style, setStyle] = useState('heritage_culture');
  const [interests, setInterests] = useState<string[]>(['History & Architecture', 'Photography']);
  const [transport, setTransport] = useState('Public Transit & Local Train');
  const [budget, setBudget] = useState('Moderate');
  const [submitting, setSubmitting] = useState(false);

  if (!isOnboardingModalOpen) return null;

  const allInterests = [
    'History & Architecture',
    'Photography',
    'Street Food & Dining',
    'Religious & Spiritual',
    'Nature & Coastline',
    'Art & Museums',
  ];

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const survey: OnboardingSurvey = {
        travel_style: style,
        interests,
        preferred_transport: transport,
        budget_preference: budget,
      };
      await saveSurvey(survey);
    } catch (err) {
      console.error('Failed to save survey', err);
      setIsOnboardingModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsOnboardingModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF671F] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalize Your Travel Profile</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900">Tailor Your Heritage Journeys</h2>
          <p className="text-xs text-stone-600">
            We use these preferences to rank monuments, recommend optimal transit modes, and build personalized itineraries.
          </p>
        </div>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-900">Travel Archetype</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'heritage_culture', label: 'Heritage & Culture' },
              { id: 'leisure_explorer', label: 'Leisure Explorer' },
              { id: 'budget_backpacker', label: 'Budget Backpacker' },
              { id: 'fast_paced', label: 'Speed & Transit Focused' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyle(item.id)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                  style === item.id
                    ? 'bg-orange-50 text-[#FF671F] border-[#FF671F]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Core Interests */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-900">Interests & Activities</label>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((item) => {
              const active = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-amber-600" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Transport */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-900">Preferred Transit Mode</label>
          <select
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#FF671F] transition cursor-pointer"
          >
            <option value="Public Transit & Local Train">Suburban Trains & Metros (Fast & Authentic)</option>
            <option value="Taxis & Auto-rickshaws">Taxis / Cabs & Autos (Convenient)</option>
            <option value="Walking & Self Exploration">Walking & Heritage Trails (Slow Travel)</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 px-4 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
        >
          <span>Save Preferences</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
