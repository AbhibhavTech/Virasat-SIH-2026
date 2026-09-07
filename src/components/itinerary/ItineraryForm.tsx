import React, { useState } from 'react';
import { ItineraryRequest } from '../../types';
import { CalendarDays, Clock, MapPin, Sparkles, Check, CheckSquare } from 'lucide-react';

interface ItineraryFormProps {
  onGenerate: (data: ItineraryRequest) => void;
  loading: boolean;
}

export const ItineraryForm: React.FC<ItineraryFormProps> = ({ onGenerate, loading }) => {
  const [city, setCity] = useState<string>('Mumbai');
  const [origin, setOrigin] = useState<string>('gateway-of-india');
  const [durationHours, setDurationHours] = useState<number>(6);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['heritage', 'coastal']);

  const availableInterests = [
    { id: 'heritage', label: '🏛️ Heritage & Monuments' },
    { id: 'coastal', label: '🏖️ Coastal & Beaches' },
    { id: 'nature', label: '🌿 Nature & Parks' },
    { id: 'spiritual', label: '✨ Spiritual Temples' },
    { id: 'museum', label: '🎨 Art & Museums' },
    { id: 'shopping', label: '🛍️ Markets & Culture' },
  ];

  const getCityOrigins = (cityName: string) => {
    switch (cityName) {
      case 'Delhi':
        return [
          { id: 'india-gate', name: 'India Gate (Central Delhi)' },
          { id: 'red-fort', name: 'Red Fort (Old Delhi)' },
          { id: 'qutub-minar', name: 'Qutub Minar (South Delhi)' },
          { id: 'ndls', name: 'New Delhi Railway Station (NDLS)' },
        ];
      case 'Jaipur':
        return [
          { id: 'hawa-mahal', name: 'Hawa Mahal (Pink City)' },
          { id: 'amber-fort', name: 'Amber Fort (Amer)' },
          { id: 'city-palace-jaipur', name: 'City Palace' },
          { id: 'jaipur-junction', name: 'Jaipur Junction Station' },
        ];
      case 'Kochi':
        return [
          { id: 'fort-kochi', name: 'Fort Kochi Beach & Promenade' },
          { id: 'mattancherry-palace', name: 'Mattancherry Palace' },
          { id: 'marine-drive-kochi', name: 'Marine Drive Kochi' },
          { id: 'ernakulam-junction', name: 'Ernakulam Junction' },
        ];
      case 'Goa':
        return [
          { id: 'basilica-bom-jesus', name: 'Basilica of Bom Jesus (Old Goa)' },
          { id: 'fort-aguada', name: 'Fort Aguada (Sinquerim)' },
          { id: 'panjim-church', name: 'Our Lady of the Immaculate Conception' },
        ];
      case 'Agra':
        return [
          { id: 'taj-mahal', name: 'Taj Mahal (East Gate)' },
          { id: 'agra-fort', name: 'Agra Fort' },
          { id: 'agra-cantt', name: 'Agra Cantt Railway Station' },
        ];
      case 'Varanasi':
        return [
          { id: 'dashashwamedh-ghat', name: 'Dashashwamedh Ghat (Ganga)' },
          { id: 'kashi-vishwanath', name: 'Kashi Vishwanath Temple' },
          { id: 'sarnath', name: 'Sarnath Archaeological Site' },
        ];
      default:
        return [
          { id: 'gateway-of-india', name: 'Gateway of India (South Mumbai)' },
          { id: 'csmt', name: 'CSMT Station (Central Hub)' },
          { id: 'marine-drive', name: 'Marine Drive (Promenade)' },
          { id: 'bandra-fort', name: 'Bandra Fort (West Suburbs)' },
          { id: 'sanjay-gandhi-national-park', name: 'Sanjay Gandhi National Park (North)' },
        ];
    }
  };

  const originsList = getCityOrigins(city);

  const durationOptions = [
    { hours: 2, label: '2 Hours (Quick Tour)' },
    { hours: 4, label: '4 Hours (Half Day)' },
    { hours: 6, label: '6 Hours (Recommended Day Trip)' },
    { hours: 8, label: '8 Hours (Full Day Exploration)' },
    { hours: 12, label: '12 Hours (Comprehensive Odyssey)' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      city,
      origin,
      duration_hours: durationHours,
      interests: selectedInterests,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
        <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80">
          <CalendarDays className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h3 className="text-base font-bold text-stone-900 font-serif">
            Configure Your Day-Trip Tour
          </h3>
          <p className="text-xs text-stone-600">
            Intelligent time-budgeted itinerary matching your pace and interests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City & Starting Origin */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Pilot City:
            </label>
            <select
              value={city}
              onChange={(e) => {
                const newCity = e.target.value;
                setCity(newCity);
                const origins = getCityOrigins(newCity);
                if (origins.length > 0) {
                  setOrigin(origins[0].id);
                }
              }}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-medium focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition cursor-pointer"
            >
              <option value="Mumbai">Mumbai (Maharashtra)</option>
              <option value="Delhi">Delhi (National Capital)</option>
              <option value="Jaipur">Jaipur (Rajasthan)</option>
              <option value="Kochi">Kochi (Kerala)</option>
              <option value="Goa">Goa (West Coast)</option>
              <option value="Agra">Agra (Uttar Pradesh)</option>
              <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Starting Hub / First Attraction:
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-medium focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition cursor-pointer"
            >
              {originsList.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Budget */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Available Time Budget:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {durationOptions.map((opt) => {
              const isSelected = durationHours === opt.hours;
              return (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => setDurationHours(opt.hours)}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold shadow-2xs'
                      : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interests Multi-Select (Checkboxes) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
          Select Your Travel Interests (Checkboxes):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {availableInterests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <label
                key={interest.id}
                className={`p-3 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold shadow-2xs'
                    : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100/70 hover:border-stone-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleInterest(interest.id)}
                  className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                />
                <span className="truncate">{interest.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm transition-all shadow-md shadow-amber-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>{loading ? 'Generating Smart Itinerary...' : 'Generate Day-Trip Tour Itinerary'}</span>
      </button>
    </form>
  );
};

