import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  ArrowLeft,
  Clock,
  X,
  Trash2,
  Sparkles,
  ArrowUpRight,
  History,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';
import { analytics } from '../services/analytics';
import { PlaceSummary } from '../types';
import { VoiceInputButton } from '../components/common/VoiceInputButton';

export interface RecentSearchItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
}

const STORAGE_KEY = 'virasat_recent_searches';
const MAX_RECENT_SEARCHES = 10;

const POPULAR_SEARCHES = [
  'Taj Mahal',
  'Ajanta Caves',
  'Hampi',
  'Gateway of India',
  'Qutub Minar',
  'Konark Sun Temple',
  'Meenakshi Temple',
  'Khajuraho',
];

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 45) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

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
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || initialQuery;

  const [query, setQuery] = useState(urlQuery);
  const [lastExecutedQuery, setLastExecutedQuery] = useState('');
  const [results, setResults] = useState<PlaceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    if (!showClearConfirmModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowClearConfirmModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showClearConfirmModal]);

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item && typeof item.query === 'string' && item.query.trim().length > 0
          );
        }
      }
    } catch (e) {
      console.warn('Failed to parse recent searches from localStorage:', e);
    }
    return [];
  });

  // Save to localStorage whenever recentSearches changes
  const saveRecentSearches = useCallback((items: RecentSearchItem[]) => {
    setRecentSearches(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save recent searches to localStorage:', e);
    }
  }, []);

  // Add or bump query to the top of recent searches
  const recordRecentSearch = useCallback(
    (searchTerm: string, resultCount?: number) => {
      const trimmed = searchTerm.trim();
      if (!trimmed || trimmed.length < 2) return;

      const lower = trimmed.toLowerCase();
      const filtered = recentSearches.filter((item) => item.query.toLowerCase() !== lower);
      const newItem: RecentSearchItem = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        query: trimmed,
        timestamp: Date.now(),
        resultCount,
      };

      const updated = [newItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updated);
    },
    [recentSearches, saveRecentSearches]
  );

  // Remove single search item
  const handleRemoveRecentSearch = (queryToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = recentSearches.filter(
      (item) => item.query.toLowerCase() !== queryToRemove.toLowerCase()
    );
    saveRecentSearches(updated);
  };

  // Open confirmation modal to clear all recent searches
  const handleRequestClearAll = () => {
    setShowClearConfirmModal(true);
  };

  // Perform confirmed clear
  const handleConfirmClearAll = () => {
    saveRecentSearches([]);
    setShowClearConfirmModal(false);
  };

  // Execute Search
  const executeSearch = useCallback(
    async (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      setQuery(searchTerm);
      setLastExecutedQuery(trimmed);

      // Update URL query param cleanly without reloading
      if (trimmed) {
        setSearchParams({ q: trimmed }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }

      if (!trimmed) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await api.searchPlaces(trimmed);
        setResults(data);
        analytics.trackSearch(trimmed, data.length);
        recordRecentSearch(trimmed, data.length);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    },
    [recordRecentSearch, setSearchParams]
  );

  // Trigger search on mount or when urlQuery changes externally
  useEffect(() => {
    if (urlQuery && urlQuery !== lastExecutedQuery) {
      executeSearch(urlQuery);
    }
  }, [urlQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredResults = results.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  const hasActiveSearch = Boolean(lastExecutedQuery);

  return (
    <div className="space-y-6 w-full animate-fadeIn pb-12">
      {/* Search Header Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onBack}
          className="p-2 sm:p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition shadow-xs cursor-pointer shrink-0"
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                executeSearch(query);
              }
            }}
            placeholder="Search monuments, forts, temples, cities..."
            className="w-full pl-9 sm:pl-11 pr-28 sm:pr-32 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition shadow-xs"
          />

          <div className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  executeSearch('');
                }}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-full transition cursor-pointer"
                title="Clear input"
                aria-label="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <VoiceInputButton
              variant="search"
              title="Search with voice (e.g., 'Taj Mahal', 'Hampi')"
              placeholderPrompt="Listening... Say 'Taj Mahal', 'Hampi', or any monument"
              onTranscript={(text) => {
                setQuery(text);
              }}
              onFinalTranscript={(text) => {
                setQuery(text);
                executeSearch(text);
              }}
            />
          </div>

          <button
            onClick={() => executeSearch(query)}
            className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-[11px] sm:text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* RECENT SEARCHES: Quick-Access Chips Bar (Visible when history exists & search is active) */}
      {recentSearches.length > 0 && hasActiveSearch && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            <History className="w-3.5 h-3.5 text-[#FF671F]" />
            <span className="hidden sm:inline">Recent:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {recentSearches.map((item) => {
              const isCurrent = item.query.toLowerCase() === lastExecutedQuery.toLowerCase();
              return (
                <div
                  key={item.id}
                  onClick={() => executeSearch(item.query)}
                  className={`group inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border shadow-2xs ${
                    isCurrent
                      ? 'bg-orange-50 text-[#FF671F] border-orange-300 ring-1 ring-[#FF671F]/30'
                      : 'bg-white text-stone-700 hover:text-[#FF671F] hover:bg-stone-50 border-stone-200 hover:border-orange-200'
                  }`}
                  title={`Re-search "${item.query}"`}
                >
                  <Clock className="w-3 h-3 text-stone-400 group-hover:text-[#FF671F] transition-colors" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{item.query}</span>
                  <button
                    onClick={(e) => handleRemoveRecentSearch(item.query, e)}
                    className="p-0.5 rounded-full hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 transition"
                    title={`Remove "${item.query}" from history`}
                    aria-label={`Remove ${item.query}`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRequestClearAll}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-rose-600 transition ml-2 whitespace-nowrap cursor-pointer shrink-0"
            title="Clear all search history"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Filter Chips (Visible when search results exist) */}
      {hasActiveSearch && (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'heritage', 'museum', 'coastal', 'nature'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold capitalize transition whitespace-nowrap cursor-pointer ${
                categoryFilter === c
                  ? 'bg-[#FF671F] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {c === 'all' ? 'All Categories' : c}
            </button>
          ))}
        </div>
      )}

      {/* MAIN VIEW: When NO search has been executed yet OR query is empty */}
      {!hasActiveSearch && (
        <div className="space-y-8 animate-fadeIn pt-2">
          {/* RECENT SEARCHES: Dedicated Panel */}
          {recentSearches.length > 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-[#FF671F] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-stone-900">
                      Recent Searches
                    </h2>
                    <p className="text-[11px] text-stone-500">
                      Quickly re-access your previous queries
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRequestClearAll}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-all px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                  title="Clear all recent searches"
                  aria-label="Clear all recent searches"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Recent Search Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => executeSearch(item.query)}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] hover:bg-orange-50/60 border border-stone-200/80 hover:border-orange-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#FF671F] group-hover:border-orange-200 transition-colors shrink-0">
                        <History className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-[#FF671F] transition-colors truncate">
                          {item.query}
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <span>{formatRelativeTime(item.timestamp)}</span>
                          {typeof item.resultCount === 'number' && (
                            <>
                              <span>•</span>
                              <span>{item.resultCount} {item.resultCount === 1 ? 'place' : 'places'}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-stone-400 group-hover:text-[#FF671F] transition">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                      <button
                        onClick={(e) => handleRemoveRecentSearch(item.query, e)}
                        className="p-1 rounded-md text-stone-300 hover:text-stone-700 hover:bg-stone-200/60 transition"
                        title={`Remove "${item.query}" from history`}
                        aria-label={`Remove ${item.query}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State Prompt when no recent searches yet */
            <div className="bg-white rounded-3xl border border-stone-200/90 p-8 text-center space-y-2 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF671F] mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-stone-900">
                Explore Bharat&apos;s Heritage Catalog
              </h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Search across verified UNESCO monuments, historic temples, fortresses, and cultural landmarks. Your search history will appear here for fast re-access.
              </p>
            </div>
          )}

          {/* Popular / Trending Suggestions for Quick Discovery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF671F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Popular Heritage Searches
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => executeSearch(term)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-orange-50 text-stone-700 hover:text-[#FF671F] border border-stone-200/90 hover:border-orange-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs group"
                >
                  <Search className="w-3 h-3 text-stone-400 group-hover:text-[#FF671F] transition-colors" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS LISTING (When search has executed) */}
      {hasActiveSearch && (
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-4 font-medium">
            <span>
              Found {filteredResults.length} matching {filteredResults.length === 1 ? 'place' : 'places'} for{' '}
              <strong className="text-stone-800">&ldquo;{lastExecutedQuery}&rdquo;</strong>
            </span>

            {results.length > 0 && (
              <button
                onClick={() => executeSearch(lastExecutedQuery)}
                className="inline-flex items-center gap-1 text-[11px] text-[#FF671F] hover:text-[#E65100] font-semibold cursor-pointer"
                title="Refresh search"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 rounded-2xl bg-white border border-stone-200/80 p-8 space-y-3 shadow-xs">
              <div className="w-10 h-10 border-3 border-orange-200 border-t-[#FF671F] rounded-full animate-spin mx-auto" />
              <div className="text-xs text-[#FF671F] font-bold">
                Scanning architectural and heritage catalog...
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white border border-stone-200/80 p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-stone-900">
                  No destinations matched &ldquo;{lastExecutedQuery}&rdquo;
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try broader keywords like &ldquo;Caves&rdquo;, &ldquo;Fort&rdquo;, &ldquo;Gateway&rdquo;, &ldquo;Temple&rdquo;, or choose from your previous searches below.
                </p>
              </div>

              {/* Quick Fallback to Recent Searches */}
              {recentSearches.length > 1 && (
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wider mb-2">
                    Try one of your recent queries
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {recentSearches
                      .filter((s) => s.query.toLowerCase() !== lastExecutedQuery.toLowerCase())
                      .slice(0, 5)
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => executeSearch(item.query)}
                          className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-orange-50 text-stone-700 hover:text-[#FF671F] border border-stone-200 text-xs font-semibold transition cursor-pointer"
                        >
                          {item.query}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPlace(p.id)}
                  className="group cursor-pointer rounded-2xl bg-white hover:bg-stone-50/80 border border-stone-200 hover:border-[#FF671F]/40 p-4 transition-all flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md hover:-translate-y-0.5"
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
                    <h3 className="font-serif font-bold text-stone-900 group-hover:text-[#FF671F] transition line-clamp-1">
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
      )}
      {/* Clear All Confirmation Modal */}
      {showClearConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowClearConfirmModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-stone-200/90 max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="clear-modal-title" className="text-base font-bold text-stone-900">
                    Clear Search History?
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
              <p className="text-xs text-stone-700 leading-relaxed">
                Are you sure you want to remove your entire search history? You will lose quick access to{' '}
                <strong className="text-stone-900 font-bold">
                  {recentSearches.length} {recentSearches.length === 1 ? 'saved search' : 'saved searches'}
                </strong>.
              </p>
              {recentSearches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recentSearches.slice(0, 5).map((s) => (
                    <span
                      key={s.id}
                      className="text-[10px] font-medium bg-white px-2.5 py-0.5 rounded-lg border border-stone-200 text-stone-600 shadow-2xs"
                    >
                      {s.query}
                    </span>
                  ))}
                  {recentSearches.length > 5 && (
                    <span className="text-[10px] font-medium text-stone-400 px-1.5 py-0.5">
                      +{recentSearches.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
