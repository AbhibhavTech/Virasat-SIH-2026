import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { PlaceSummary } from '../types';

interface SearchPageProps {
  initialQuery?: string;
  onSelectPlace: (id: string) => void;
  onBack: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onSelectPlace,
  onBack,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PlaceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const executeSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const data = await api.searchPlaces(searchTerm);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const filteredResults = results.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 w-full animate-fadeIn pb-8">
      {/* Search Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch(query)}
            placeholder="Search monuments, forts, temples, or cities across India..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition shadow-xs"
          />
          <button
            onClick={() => executeSearch(query)}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'heritage', 'museum', 'coastal', 'nature'].map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              categoryFilter === c
                ? 'bg-[#FF671F] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      {/* Results */}
      <div>
        <div className="text-xs text-stone-500 mb-4 font-medium">
          Found {filteredResults.length} matching places
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#FF671F] font-semibold animate-pulse">
            Scanning architectural catalog...
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-stone-200 p-8 space-y-2 shadow-xs">
            <p className="text-sm font-bold text-stone-900">No destinations matched "{query}"</p>
            <p className="text-xs text-stone-500">
              Try broader search terms like "Caves", "Fort", "Gateway", "Church", or "Palace".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredResults.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectPlace(p.id)}
                className="group cursor-pointer rounded-2xl bg-white hover:bg-stone-50/80 border border-stone-200 hover:border-[#FF671F]/40 p-4 transition-all flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                      {p.category}
                    </span>
                    {p.rating && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 group-hover:text-[#FF671F] transition">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3 h-3 text-[#FF671F]" />
                    <span>
                      {p.city}, {p.state}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                    {p.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500 font-medium">
                  <span>{(p as any).best_time_to_visit || 'Year-round'}</span>
                  <span className="text-[#FF671F] group-hover:translate-x-0.5 transition font-semibold">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
