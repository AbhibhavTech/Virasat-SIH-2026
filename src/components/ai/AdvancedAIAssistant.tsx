import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  Loader2,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  Box,
  Layers,
  Calendar,
  AlertCircle,
  Bot,
  Train,
  Plane,
  Car,
  Navigation,
  Crosshair,
  MapPinOff,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { AIChatMessage, UserLocationContext, TransitComparison, GroundingCitation } from '../../types';

interface ExtendedChatMessage extends AIChatMessage {
  suggested_places?: Array<{
    id: string;
    name: string;
    city: string;
    category?: string;
    reason?: string;
    distance_km?: number;
    state?: string;
  }>;
  transit_comparison?: TransitComparison;
  suggested_actions?: string[];
  sources?: string[];
  grounding_citations?: GroundingCitation[];
  grounding_score?: number;
  latency_ms?: number;
  model_used?: string;
  error?: boolean;
}

interface AdvancedAIAssistantProps {
  initialPlaceId?: string;
  initialPlaceName?: string;
  onSelectPlace?: (id: string) => void;
  onNavigateTab?: (tab: any) => void;
  selectedCity?: string;
  initialPrompt?: string;
}

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({
  initialPlaceId,
  initialPlaceName,
  onSelectPlace,
  onNavigateTab,
  selectedCity = 'All India',
  initialPrompt,
}) => {
  const [userLocation, setUserLocation] = useState<UserLocationContext | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'granted' | 'denied' | 'error'>('idle');

  const initialGreeting: ExtendedChatMessage = {
    role: 'assistant',
    content: `Namaste! 👋 I am your Virasat Travel & Heritage Concierge.\n\nWhere would you like to go today? You can choose **Explore Near Me** or name any destination across India.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggested_actions: ['Explore Near Me', 'I want to visit Darjeeling', 'Plan a Trip to Jaipur', 'How does Virasat work?'],
  };

  const [messages, setMessages] = useState<ExtendedChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeCity, setActiveCity] = useState<string>(selectedCity);

  // Travel context memory across turns
  const [travelContext, setTravelContext] = useState<{
    origin?: string;
    destination?: string;
    days?: number;
    preferred_mode?: 'train' | 'flight' | 'road' | 'all';
    pace?: string;
  }>({});

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastProcessedPrompt = useRef<string | null>(null);
  const hasRequestedInitialGeo = useRef<boolean>(false);

  // Sync active city if changed from props
  useEffect(() => {
    if (selectedCity) setActiveCity(selectedCity);
  }, [selectedCity]);

  // Request browser geolocation on component mount
  useEffect(() => {
    if (!hasRequestedInitialGeo.current) {
      hasRequestedInitialGeo.current = true;
      requestLocation(false);
    }
  }, []);

  // Location detection and reverse geocoding
  const requestLocation = (triggerNearMeOnSuccess: boolean = false) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('denied');
      if (triggerNearMeOnSuccess) {
        handleSend('Explore places near me');
      }
      return;
    }

    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const geoRes = await api.reverseGeocode(latitude, longitude);

          if (geoRes && geoRes.success) {
            const detectedLoc: UserLocationContext = {
              latitude,
              longitude,
              locality: geoRes.locality,
              city: geoRes.city,
              state: geoRes.state,
              country: geoRes.country,
              formatted_area: geoRes.formatted_area,
            };

            setUserLocation(detectedLoc);
            setLocationStatus('granted');

            const areaName = geoRes.locality
              ? `${geoRes.locality}, ${geoRes.city || geoRes.state}`
              : `${geoRes.city || geoRes.state}`;

            // If user explicitly pressed "Explore Near Me"
            if (triggerNearMeOnSuccess) {
              handleSend('Explore places near my current location', detectedLoc);
            } else {
              // Update initial greeting naturally without disturbing if user already chatted
              setMessages((prev) => {
                if (prev.length <= 1) {
                  return [
                    {
                      role: 'assistant',
                      content: `Namaste! It looks like you're currently near **${areaName}**.\n\nWhere would you like to go today?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      suggested_actions: [
                        'Explore Near Me',
                        'I want to visit Darjeeling',
                        'Plan a Trip to Jaipur',
                        'How does Virasat work?',
                      ],
                    },
                  ];
                }
                return prev;
              });
            }
          } else {
            setLocationStatus('denied');
            if (triggerNearMeOnSuccess) handleSend('Explore places near me');
          }
        } catch (err) {
          console.warn('Reverse geocode error:', err);
          setLocationStatus('error');
          if (triggerNearMeOnSuccess) handleSend('Explore places near me');
        }
      },
      (err) => {
        console.warn('Geolocation permission not granted:', err.message);
        setLocationStatus('denied');
        if (triggerNearMeOnSuccess) {
          handleSend('Explore places near me');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Neutral, context-driven core suggestions
  const coreSuggestions = [
    { label: 'Explore Near Me', prompt: 'Explore heritage and tourism places near my current location' },
    { label: 'Darjeeling Trip', prompt: 'I want to visit Darjeeling' },
    { label: 'Jaipur Heritage', prompt: 'Help me plan a trip to Jaipur' },
    { label: 'How does map work?', prompt: 'How do I use the interactive map to find places and calculate distances?' },
    { label: 'How does Virasat work?', prompt: 'How does this website work? Explain Virasat features.' },
  ];

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle incoming prompt from Explore card or other links
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && initialPrompt !== lastProcessedPrompt.current) {
      lastProcessedPrompt.current = initialPrompt;
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (userText: string, locationOverride?: UserLocationContext) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;

    // Check if user is asking for nearby places and location is not yet detected
    const isNearbyQuery = /near\s*me|aas\s*paas|nearby|around\s*me|current\s*location/i.test(trimmed);
    const activeLoc = locationOverride || userLocation;

    if (isNearbyQuery && !activeLoc && locationStatus !== 'detecting') {
      requestLocation(true);
      return;
    }

    const originalScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const userMsg: ExtendedChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (typeof window !== 'undefined' && window.scrollY !== originalScrollY) {
      window.scrollTo({ top: originalScrollY, behavior: 'instant' as ScrollBehavior });
    }

    try {
      const historyPayload = messages
        .filter((m) => !m.error)
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await api.chatAI({
        message: trimmed,
        city: activeCity === 'All India' ? undefined : activeCity,
        place_id: initialPlaceId,
        place_name: initialPlaceName,
        history: historyPayload,
        location: activeLoc || undefined,
        travel_context: travelContext,
      });

      // Reset destination memory if user asks to change destination or explore somewhere else without naming a new one
      if (/(change destination|kisi aur jagah|somewhere else|kahi aur|dusri jagah|new destination)/i.test(trimmed) && !res.transit_comparison?.destination) {
        setTravelContext({});
      } else if (res.transit_comparison?.destination) {
        // Update contextual memory if destination or transit was detected
        setTravelContext((prev) => ({
          ...prev,
          destination: res.transit_comparison?.destination,
          origin: res.transit_comparison?.origin || prev.origin,
        }));
      }

      const assistantMsg: ExtendedChatMessage = {
        role: 'assistant',
        content: res.reply || 'Here is the verified heritage intelligence from Virasat.',
        suggested_places: res.suggested_places,
        transit_comparison: res.transit_comparison,
        suggested_actions: res.suggested_actions,
        sources: res.sources && res.sources.length > 0 ? res.sources : undefined,
        grounding_citations: res.grounding_citations,
        grounding_score: res.grounding_score,
        latency_ms: res.latency_ms,
        model_used: res.model_used,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const isRateLimit = err?.message?.includes('429') || err?.message?.includes('RATE_LIMIT');
      const errorMsg: ExtendedChatMessage = {
        role: 'assistant',
        content: isRateLimit
          ? '⏱️ Rate limit reached (30 queries/min). Please wait a few moments before submitting your next cultural inquiry.'
          : 'I had trouble connecting to the cultural archives. Please check your connection or tap Retry to resend.',
        error: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      if (typeof window !== 'undefined' && window.scrollY !== originalScrollY) {
        window.scrollTo({ top: originalScrollY, behavior: 'instant' as ScrollBehavior });
      }
    }
  };

  const handleResetConversation = () => {
    setTravelContext({});
    setMessages([
      userLocation
        ? {
            role: 'assistant',
            content: `Namaste! It looks like you're currently near **${
              userLocation.locality ? `${userLocation.locality}, ` : ''
            }${userLocation.city || userLocation.state || 'your area'}**.\n\nWhere would you like to go today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggested_actions: [
              'Explore Near Me',
              'I want to visit Darjeeling',
              'Plan a Trip to Jaipur',
              'How does Virasat work?',
            ],
          }
        : {
            ...initialGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
    ]);
    lastProcessedPrompt.current = null;
  };

  const copyToClipboard = (text: string, idx: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Helper to render formatted assistant response (handles bold, bullets, headers)
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5">
        {lines.map((line, idx) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) {
            return <div key={idx} className="h-1.5" />;
          }

          // Format bold markers **text**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const renderedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-stone-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#FF671F] font-bold text-xs mt-0.5">•</span>
                <span className="flex-1">{renderedLine}</span>
              </div>
            );
          }

          if (trimmedLine.startsWith('###')) {
            return (
              <h4 key={idx} className="font-serif font-bold text-sm text-[#0B192C] mt-2 pt-1 border-t border-stone-100">
                {trimmedLine.replace(/^###\s*/, '')}
              </h4>
            );
          }

          return <p key={idx}>{renderedLine}</p>;
        })}
      </div>
    );
  };

  // Render transit comparison card (Train, Flight, Road)
  const renderTransitComparison = (tc: TransitComparison) => {
    return (
      <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-3">
        <div className="flex items-center justify-between border-b border-[#EFE8DF] pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-orange-100 text-[#FF671F]">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-stone-900">
              Multimodal Travel Comparison: {tc.origin} ➔ {tc.destination}
            </span>
          </div>
          {tc.distance_km && (
            <span className="text-[11px] font-semibold text-stone-600 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
              ~{tc.distance_km} km aerial corridor
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Train Option */}
          {tc.train && (
            <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs hover:border-blue-300 transition space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900">
                    <Train className="w-3.5 h-3.5 text-blue-600" /> Train Option
                  </span>
                  {tc.train.approx_duration && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {tc.train.approx_duration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-800 font-medium mt-1 leading-snug">{tc.train.summary}</p>
                {tc.train.notes && (
                  <p className="text-[11px] text-stone-500 mt-1 leading-normal italic">
                    ℹ️ {tc.train.notes}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSend(`Tell me detailed train schedule and booking tips for ${tc.destination}`)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 pt-1.5 flex items-center gap-1 border-t border-blue-50 mt-1"
              >
                <span>Rail details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Flight Option */}
          {tc.air && (
            <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-2xs hover:border-sky-300 transition space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-900">
                    <Plane className="w-3.5 h-3.5 text-sky-600" /> Flight Option
                  </span>
                  {tc.air.approx_duration && (
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                      {tc.air.approx_duration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-800 font-medium mt-1 leading-snug">{tc.air.summary}</p>
                {tc.air.notes && (
                  <p className="text-[11px] text-stone-500 mt-1 leading-normal italic">
                    ℹ️ {tc.air.notes}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSend(`What are the flight options and airport connections to ${tc.destination}?`)}
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 pt-1.5 flex items-center gap-1 border-t border-sky-50 mt-1"
              >
                <span>Air travel details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Road Option */}
          {tc.road && (
            <div className="p-3 rounded-xl bg-white border border-amber-100 shadow-2xs hover:border-amber-300 transition space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900">
                    <Car className="w-3.5 h-3.5 text-amber-600" /> Road / Car Option
                  </span>
                  {tc.road.approx_duration && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {tc.road.approx_duration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-800 font-medium mt-1 leading-snug">{tc.road.summary}</p>
                {tc.road.notes && (
                  <p className="text-[11px] text-stone-500 mt-1 leading-normal italic">
                    ℹ️ {tc.road.notes}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSend(`What is the highway route, driving condition, and scenic road stops to ${tc.destination}?`)}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 pt-1.5 flex items-center gap-1 border-t border-amber-50 mt-1"
              >
                <span>Road route details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Controls Bar: Location State & Quick Status */}
      <div className="w-full p-3.5 sm:p-4 rounded-3xl bg-white border border-[#EFE8DF] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF671F] to-[#046A38] p-0.5 shadow-warm flex items-center justify-center text-white shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#FF671F]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#0B192C] tracking-tight">
                Virasat AI Travel & Heritage Concierge
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Grounded
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Location-aware guidance • Dynamic multimodal routing • Verified ASI & UNESCO database
            </p>
          </div>
        </div>

        {/* Location Badge, City Selector, and Reset */}
        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          {/* Location Status Pill */}
          {locationStatus === 'granted' && userLocation ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[180px] sm:max-w-[220px] truncate">
                Near {userLocation.locality ? `${userLocation.locality}, ` : ''}{userLocation.city || userLocation.state}
              </span>
            </div>
          ) : locationStatus === 'detecting' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Detecting location...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => requestLocation(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-orange-50/60 border border-[#EFE8DF] hover:border-orange-300 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#FF671F] transition shadow-2xs"
              title="Detect your device location"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Detect Location</span>
            </button>
          )}

          {/* City selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#EFE8DF] rounded-xl text-xs text-stone-700">
            <select
              value={activeCity}
              onChange={(e) => setActiveCity(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-medium text-xs text-stone-800 cursor-pointer"
              aria-label="Filter context by city"
            >
              <option value="All India">All India</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Agra">Agra</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Darjeeling">Darjeeling</option>
              <option value="Goa">Goa</option>
              <option value="Kochi">Kochi</option>
              <option value="Hampi">Hampi</option>
              <option value="Srinagar">Srinagar</option>
            </select>
          </div>

          <button
            onClick={handleResetConversation}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-[#EFE8DF] rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition shadow-2xs"
            title="Start New Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Grid (Full width) */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 px-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
            Quick Prompts & Actions
          </span>
          <span className="text-[11px] text-stone-400">Tap any question to start</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {coreSuggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (item.label === 'Explore Near Me') {
                  requestLocation(true);
                } else {
                  handleSend(item.prompt);
                }
              }}
              className="text-left p-2.5 rounded-2xl bg-white hover:bg-orange-50/50 border border-[#EFE8DF] hover:border-orange-300 text-xs text-stone-800 hover:text-[#FF671F] transition shadow-2xs group flex items-center justify-between gap-1.5"
            >
              <span className="font-semibold text-xs leading-tight truncate">{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#FF671F] group-hover:translate-x-0.5 transition shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Active Dialogue Box */}
      <div className="w-full flex flex-col h-[580px] sm:h-[640px] lg:h-[680px] rounded-3xl bg-white border border-[#EFE8DF] shadow-warm overflow-hidden">
        {/* Chat Stream Header */}
        <div className="p-3.5 px-5 sm:px-6 bg-[#FAF8F5] border-b border-[#EFE8DF] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Bot className="w-4 h-4 text-[#FF671F]" />
            <span className="text-xs font-bold text-stone-800">
              Active Dialogue Stream
            </span>
            <span className="text-[11px] text-stone-400">
              ({messages.length} messages)
            </span>
            {travelContext.destination && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#FF671F] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                Trip Target: {travelContext.destination}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-500">
            <span className="flex items-center gap-1 font-medium text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
              <Compass className="w-3 h-3 text-[#FF671F]" />
              Verified Knowledge & Transit Hubs
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#FAF8F5]/30"
        >
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'w-8 h-8 bg-[#FF671F] text-white font-bold'
                      : 'w-8 h-8 bg-white border border-stone-200 text-[#FF671F]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble - Full extent */}
                <div
                  className={`w-full max-w-[96%] sm:max-w-[92%] lg:max-w-[88%] rounded-3xl p-4 sm:p-6 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    isUser
                      ? 'bg-[#FF671F] text-white font-medium rounded-tr-sm ml-auto'
                      : 'bg-white border border-[#EFE8DF] text-stone-800 rounded-tl-sm mr-auto'
                  }`}
                >
                  {/* Message Body */}
                  {renderMessageContent(m.content)}

                  {/* Multimodal Transit Comparison Cards */}
                  {!isUser && m.transit_comparison && (m.transit_comparison.train || m.transit_comparison.air || m.transit_comparison.road) && renderTransitComparison(m.transit_comparison)}

                  {/* Suggested Places Cards with Real Distance in Km */}
                  {!isUser && m.suggested_places && m.suggested_places.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-stone-100 space-y-2.5">
                      <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF671F]" /> Recommended Heritage & Tourism Places:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {m.suggested_places.map((place) => (
                          <div
                            key={place.id}
                            className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] hover:border-orange-300 transition shadow-2xs flex flex-col justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-xs text-stone-900 leading-tight">
                                  🏛️ {place.name}
                                </span>
                                {place.distance_km !== undefined && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                    ~{place.distance_km} km (calculated)
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                                {place.reason || `Prominent heritage highlight in ${place.city}.`}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                              {onSelectPlace && (
                                <button
                                  type="button"
                                  onClick={() => onSelectPlace(place.id)}
                                  className="text-[11px] font-bold text-[#FF671F] hover:text-[#E65100] flex items-center gap-1 transition"
                                >
                                  <span>View in Virasat</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleSend(`Tell me more about visiting ${place.name} in ${place.city}.`)}
                                className="text-[11px] font-medium text-stone-500 hover:text-stone-800 transition"
                              >
                                Ask about spot
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contextual Action Chips */}
                  {!isUser && m.suggested_actions && m.suggested_actions.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex flex-wrap gap-1.5">
                      {m.suggested_actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => {
                            if (act.toLowerCase().includes('near me')) {
                              requestLocation(true);
                            } else {
                              handleSend(act);
                            }
                          }}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-[#FF671F] border border-orange-200 transition shadow-2xs flex items-center gap-1"
                        >
                          <span>{act}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Verified Grounding Citations */}
                  {!isUser && m.grounding_citations && m.grounding_citations.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Provenance Citations:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.grounding_citations.map((c, cIdx) => (
                          <a
                            key={cIdx}
                            href={c.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                          >
                            <span>{c.place_name} ({c.field_name}):</span>
                            <span className="underline truncate max-w-[150px]">{c.source_name}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata & Actions Footer */}
                  <div
                    className={`mt-3 pt-2 flex items-center justify-between text-[10px] ${
                      isUser ? 'border-t border-white/20 text-white/80' : 'border-t border-stone-100 text-stone-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span>{m.timestamp || 'Just now'}</span>
                      {!isUser && m.sources && m.sources.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>ASI & Official Tourism Verified</span>
                        </span>
                      )}
                      {!isUser && m.latency_ms !== undefined && (
                        <span className="text-stone-400">
                          • {m.latency_ms}ms {m.model_used ? `(${m.model_used})` : ''}
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(m.content, idx)}
                          className="hover:text-stone-700 transition flex items-center gap-1 px-1.5 py-0.5 rounded"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}

                      {m.error && (
                        <button
                          type="button"
                          onClick={() => {
                            const lastUser = messages.filter((msg) => msg.role === 'user').pop();
                            if (lastUser) handleSend(lastUser.content);
                          }}
                          className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-2xl bg-white border border-stone-200 text-[#FF671F] flex items-center justify-center shrink-0 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF671F]" />
              </div>
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EFE8DF] text-xs sm:text-sm text-stone-600 shadow-xs flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF671F] animate-ping" />
                <span>Virasat AI is analyzing location coordinates, transit corridors, and heritage archives...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar (Full width) */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#EFE8DF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Virasat about any destination, explore near me, compare transit, or plan an itinerary..."
              className="flex-1 px-4 py-3 sm:py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#FF671F] focus:bg-white focus:ring-1 focus:ring-[#FF671F] transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-[#FF671F] hover:bg-[#E65100] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-2 shrink-0"
              aria-label="Send message"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Virasat shortcuts footer */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 flex-wrap gap-2 pt-2 border-t border-stone-50">
            <span className="font-medium">Direct Virasat Tools:</span>
            <div className="flex items-center gap-4">
              {onNavigateTab && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('map')}
                    className="hover:text-[#FF671F] font-semibold flex items-center gap-1 transition"
                  >
                    <Layers className="w-3 h-3" /> Map
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('3d')}
                    className="hover:text-[#FF671F] font-semibold flex items-center gap-1 transition"
                  >
                    <Box className="w-3 h-3" /> 3D Models
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('itinerary')}
                    className="hover:text-[#FF671F] font-semibold flex items-center gap-1 transition"
                  >
                    <Calendar className="w-3 h-3" /> Plan Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('india')}
                    className="hover:text-[#FF671F] font-semibold flex items-center gap-1 transition"
                  >
                    <Compass className="w-3 h-3" /> 36 States/UTs
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
