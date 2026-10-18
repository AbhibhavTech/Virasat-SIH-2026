import { TripDraft } from './TripDraft';
import { useAuth } from '../../contexts/AuthContext';
import { AssistantMessage } from './AssistantMessage';
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Landmark,
  Layers,
  Calendar,
  AlertCircle,
  Bot,
  Train,
  Plane,
  Car,
  Footprints,
  Navigation,
  Crosshair,
  MapPinOff,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  AIChatMessage,
  UserLocationContext,
  TransitComparison,
  GroundingCitation,
  GoogleMapsGroundingItem,
  AIAction,
} from '../../types';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { InsecureContextAlert } from '../common/InsecureContextAlert';

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
  actions?: AIAction[];
  sources?: string[];
  grounding_citations?: GroundingCitation[];
  maps_grounding?: GoogleMapsGroundingItem[];
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

const AI_CONVERSATION_SESSION_KEY = 'virasat_ai_conversation_id';

function getStoredConversationId(): string | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.sessionStorage.getItem(AI_CONVERSATION_SESSION_KEY) || undefined;
  } catch {
    return undefined;
  }
}

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({
  initialPlaceId,
  initialPlaceName,
  onSelectPlace,
  onNavigateTab,
  selectedCity = 'All India',
  initialPrompt,
}) => {
  const navigate = useNavigate();
  const { user: signedInUser } = useAuth();
  const [draft, setDraft] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<Array<{id:string;title:string}>>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [privacyNotice, setPrivacyNotice] = useState('');
  const [retryUntil, setRetryUntil] = useState(0);
  const [clock, setClock] = useState(Date.now());
  const [failedPrompt, setFailedPrompt] = useState('');
  const retrySeconds = Math.max(0, Math.ceil((retryUntil-clock)/1000));
  useEffect(() => { if (!retryUntil) return; const timer = setInterval(()=>setClock(Date.now()),1000); return ()=>clearInterval(timer); },[retryUntil]);
  const location = useLocation();
  const [streamText, setStreamText] = useState('');
  const activeRequest = useRef<AbortController | null>(null);
  useEffect(() => () => activeRequest.current?.abort(), []);
  const [userLocation, setUserLocation] = useState<UserLocationContext | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'granted' | 'denied' | 'error'>('idle');

  const initialGreeting: ExtendedChatMessage = {
    role: 'assistant',
    content: `Namaste! 🙏 Main **Virasat AI** hoon — destinations, heritage, festivals, routes, stays aur trips explore karne mein aapki madad ke liye.\n\nHindi, Hinglish ya English mein apna sawal naturally poochhiye.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggested_actions: ['Jaipur ka 2-day itinerary banao', 'Maharashtra ke heritage places', 'Mumbai se Goa ka route', 'Virasat AI kya kar sakta hai?'],
    actions: [
      { type: 'plan_itinerary', label: 'Plan Itinerary', url: '/itinerary' },
      { type: 'explore_heritage', label: 'UNESCO Monuments', url: '/heritage' },
      { type: 'open_map', label: 'Open Map', url: '/map' },
      { type: 'explore_festival', label: 'Explore Festivals', url: '/festivals' },
    ],
  };

  const handleExecuteAction = (action: AIAction) => {
    if (action.type === 'booking_link' || action.type === 'external_link') {
      if (action.url) {
        window.open(action.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (action.url) {
      if (action.url.startsWith('http://') || action.url.startsWith('https://')) {
        window.open(action.url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(action.url);
      }
      return;
    }

    switch (action.type) {
      case 'open_map':
        navigate('/map');
        break;
      case 'plan_itinerary':
        navigate('/itinerary');
        break;
      case 'explore_festival':
        navigate('/festivals');
        break;
      case 'explore_heritage':
        navigate('/heritage');
        break;
      case 'explore_states':
        navigate('/explore');
        break;
      default:
        navigate('/map');
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'open_map':
        return <Navigation className="w-3.5 h-3.5" />;
      case 'view_destination':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'explore_festival':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'plan_itinerary':
        return <Compass className="w-3.5 h-3.5" />;
      case 'find_hotels':
      case 'nearby_places':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'booking_link':
      case 'external_link':
        return <ExternalLink className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const [messages, setMessages] = useState<ExtendedChatMessage[]>([initialGreeting]);
  const [conversationId, setConversationId] = useState<string | undefined>(getStoredConversationId);
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
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const lastProcessedPrompt = useRef<string | null>(null);

  // Sync active city if changed from props
  useEffect(() => {
    if (selectedCity) setActiveCity(selectedCity);
  }, [selectedCity]);

  // Preserve only the opaque conversation key in this browser tab. Messages and
  // personal conversation content stay in React memory and are not written to storage.
  useEffect(() => {
    try {
      if (conversationId) window.sessionStorage.setItem(AI_CONVERSATION_SESSION_KEY, conversationId);
      else window.sessionStorage.removeItem(AI_CONVERSATION_SESSION_KEY);
    } catch {
      // Private browsing may disable session storage; the live chat still works.
    }
  }, [conversationId]);

  useEffect(() => {
    activeRequest.current?.abort();
    setMessages([initialGreeting]); setDraft(null); setUserLocation(null); setLocationStatus('idle');
    const id = getStoredConversationId();
    let cancelled = false;
    const restore = async () => {
      try { return await api.getAIConversation(id!); }
      catch (error) { if (!signedInUser) throw error; await api.claimAIConversation(id!); return api.getAIConversation(id!); }
    };
    if (id) restore().then(result => {
      if (cancelled) return;
      setMessages(result.messages.length ? result.messages : [initialGreeting]); setDraft(result.draft || null); setConversationId(id);
    }).catch(() => { if (!cancelled) setConversationId(undefined); });
    return () => { cancelled = true; };
  }, [signedInUser?.id]);

  async function showHistory() {
    try { const result = await api.listAIConversations(); setChatHistory(result.conversations); setHistoryOpen(true); setPrivacyNotice('History stays on this server for up to 6 hours and is lost on restart.'); }
    catch { setPrivacyNotice('Could not load chat history.'); }
  }
  async function openHistory(id: string) {
    if (loading) return;
    try { const result = await api.getAIConversation(id); setConversationId(id); setMessages(result.messages); setDraft(result.draft || null); setTravelContext({}); setHistoryOpen(false); }
    catch { setPrivacyNotice('This chat expired or is unavailable.'); }
  }
  async function deleteHistory(id?: string) {
    activeRequest.current?.abort();
    try { await api.deleteAIConversation(id); if (!id || id === conversationId) handleResetConversation(); await showHistory(); }
    catch { setPrivacyNotice('History could not be deleted. Please try again.'); }
  }
  async function clearLocation() {
    activeRequest.current?.abort();
    try {
      if (conversationId) await api.clearAILocation(conversationId);
      setUserLocation(null); setLocationStatus('idle'); setTravelContext({}); setMessages([initialGreeting]);
      setPrivacyNotice('Current location and model dialogue context cleared. Browser permission can be revoked in site settings.');
    } catch { setPrivacyNotice('Could not clear server location. Please try again.'); }
  }

  // Location is requested only after the traveler chooses a location action.

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
                      content: `Namaste! Based on your general area (**${areaName}**), Virasat AI can help you explore nearby places, plan journeys across India, or answer your questions.\n\nAap kahan se shuru karna chahenge?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      suggested_actions: [
                        'Explore Near Me',
                        'Darjeeling ka 3-day trip plan karo',
                        'Jaipur ke best heritage places batao',
                        'Virasat AI kya kar sakta hai?',
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
    { label: 'Plan a Trip', prompt: 'Mujhe Jaipur ka 2-day itinerary banao, heritage aur local food ke saath' },
    { label: 'Hidden Gems', prompt: 'What are a few lesser-known heritage places to explore in Udaipur?' },
    { label: 'Compare Routes', prompt: 'Mumbai se Goa train, flight aur road options compare karo' },
    { label: 'UNESCO Sites', prompt: 'India ke UNESCO World Heritage Sites ke examples batao' },
    { label: 'Festival Guide', prompt: 'Mysore Dasara ka cultural significance samjhao' },
    { label: 'Explain a Topic', prompt: 'Indian stepwells kya hote hain? Simple examples ke saath samjhao' },
    { label: 'Translate', prompt: 'Translate this travel phrase into Hindi: Where is the nearest railway station?' },
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
    if (!trimmed || loading || Date.now() < retryUntil) return;

    // Check if user is asking for nearby places and location is not yet detected
    const activeLoc = locationOverride || userLocation;

    const originalScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const userMsg: ExtendedChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (composerRef.current) composerRef.current.style.height = 'auto';
    setLoading(true);
    setStreamText('');
    setFailedPrompt('');
    activeRequest.current = new AbortController();

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

      const res = await api.streamAIChat({
        language: localStorage.getItem('lang') || 'auto',
        message: trimmed,
        conversation_id: conversationId,
        selectedCity: activeCity === 'All India' ? undefined : activeCity,
        currentRoute: `${location.pathname}${location.search}`,
        place_id: initialPlaceId,
        place_name: initialPlaceName,
        history: historyPayload,
        location: activeLoc || undefined,
        travel_context: travelContext,
      }, text => setStreamText(previous => previous + text), activeRequest.current.signal);

      if (res.conversation_id) setConversationId(res.conversation_id);
      if (res.itinerary_draft) setDraft(res.itinerary_draft);
      if (res.current_location?.city && res.current_location.city !== userLocation?.city) {
        setUserLocation({ city: res.current_location.city } as UserLocationContext); setLocationStatus('granted');
      }

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
        actions: res.actions,
        sources: res.sources && res.sources.length > 0 ? res.sources : undefined,
        grounding_citations: res.grounding_citations,
        maps_grounding: res.maps_grounding,
        grounding_score: res.grounding_score,
        latency_ms: res.latency_ms,
        model_used: res.model_used,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err?.name === 'AbortError') { setInput(trimmed); return; }
      setInput(trimmed);
      setFailedPrompt(trimmed);
      if (Number.isFinite(err.retryAfterSeconds)) setRetryUntil(Date.now() + err.retryAfterSeconds * 1000);
      else if (/429|RATE_LIMIT/.test(err.message || '') && !/billing|quota/.test(err.category || '')) setRetryUntil(Date.now() + 30000);
      setClock(Date.now());
      const isRateLimit = err?.message?.includes('429') || err?.message?.includes('RATE_LIMIT');
      const errorMsg: ExtendedChatMessage = {
        role: 'assistant',
        content: err?.hostedMessage || (err?.message?.includes('MODEL_HTTP_429')
          ? 'The hosted AI provider returned HTTP 429. Its error details are needed to distinguish temporary rate limits from quota or billing restrictions.'
          : isRateLimit
          ? '⏱️ Rate limit reached (30 queries/min). Please wait a few moments before submitting your next cultural inquiry.'
          : err?.message?.includes('MODEL_NOT_CONFIGURED')
            ? 'Hosted AI abhi configure nahi hai. Server par model aur API key set karke restart karna zaroori hai.'
            : /MODEL_HTTP_401|MODEL_HTTP_403/.test(err?.message || '')
              ? 'AI provider authentication or model access failed. Check the server-side configuration.'
              : err?.message?.includes('MODEL_QUOTA_EXHAUSTED')
                ? 'AI provider quota is exhausted. Check the API project billing and limits.'
                : 'The AI model could not generate a reply. Please retry shortly or check the server configuration.'),
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
    activeRequest.current?.abort();
    setDraft(null);
    setFailedPrompt('');
    setStreamText('');
    setConversationId(undefined);
    setTravelContext({});
    setInput('');
    if (composerRef.current) composerRef.current.style.height = 'auto';
    setMessages([
      userLocation
        ? {
          role: 'assistant',
          content: `Namaste! Based on your general area (**${userLocation.locality ? `${userLocation.locality}, ` : ''
            }${userLocation.city || userLocation.state || 'your area'}**), Virasat AI can help you explore nearby places, plan journeys across India, or answer your questions.\n\nAap kahan se shuru karna chahenge?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggested_actions: [
            'Explore Near Me',
            'Darjeeling ka 3-day trip plan karo',
            'Jaipur ke best heritage places batao',
            'Virasat AI kya kar sakta hai?',
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

  const renderMessageContent = (content: string) => <AssistantMessage content={content} />;

  // Render transit comparison card (Train, Flight, Road, Walk)
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
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

          {tc.walk && (
            <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 transition space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900">
                    <Footprints className="w-3.5 h-3.5 text-emerald-600" /> Walking option
                  </span>
                  {tc.walk.approx_duration && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {tc.walk.approx_duration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-800 font-medium mt-1 leading-snug">{tc.walk.summary}</p>
                {tc.walk.notes && (
                  <p className="text-[11px] text-stone-500 mt-1 leading-normal italic">ℹ️ {tc.walk.notes}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSend(`Is it safe and practical to walk from ${tc.origin} to ${tc.destination}?`)}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 pt-1.5 flex items-center gap-1 border-t border-emerald-50 mt-1"
              >
                <span>Walking guidance</span>
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
      <div className="w-full p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#FF671F] to-[#046A38] p-0.5 shadow-warm flex items-center justify-center text-white shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF671F]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-sm sm:text-lg font-bold text-[#0B192C] tracking-tight">
                Virasat AI
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Travel &amp; Culture Copilot
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500">
              Heritage, travel, culture &amp; everyday questions • Hindi, Hinglish &amp; English
            </p>
          </div>
        </div>

        {/* Location Badge, City Selector, and Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-stretch md:self-auto flex-wrap">
          {/* Location Status Pill */}
          {locationStatus === 'granted' && userLocation ? (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] sm:text-xs text-emerald-800 font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[130px] sm:max-w-[220px] truncate">
                Near {userLocation.locality ? `${userLocation.locality}, ` : ''}{userLocation.city || userLocation.state}
              </span>
            </div>
          ) : locationStatus === 'detecting' ? (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] sm:text-xs text-amber-800 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Detecting...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => requestLocation(false)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white hover:bg-orange-50/60 border border-[#EFE8DF] hover:border-orange-300 rounded-xl text-[11px] sm:text-xs font-semibold text-stone-700 hover:text-[#FF671F] transition shadow-2xs"
              title="Detect your device location"
            >
              <Crosshair className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF671F]" />
              <span>Location</span>
            </button>
          )}

          <button type="button" disabled={loading} onClick={showHistory} className="rounded-xl border bg-white px-3 py-2 text-sm">History</button>
          <button type="button" disabled={loading} onClick={clearLocation} className="rounded-xl border bg-white px-3 py-2 text-sm">Clear location</button>
          {/* City selector */}
          <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#FAF8F5] border border-[#EFE8DF] rounded-xl text-[11px] sm:text-xs text-stone-700">
            <select
              value={activeCity}
              onChange={(e) => setActiveCity(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-medium text-[11px] sm:text-xs text-stone-800 cursor-pointer"
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
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white hover:bg-stone-50 border border-[#EFE8DF] rounded-xl text-[11px] sm:text-xs font-semibold text-stone-600 hover:text-stone-900 transition shadow-2xs"
            title="Start New Conversation"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>New chat</span>
          </button>
        </div>
      </div>

      {privacyNotice && <p role="status" className="text-sm text-stone-600">{privacyNotice}</p>}
      {historyOpen && <section aria-label="Chat history" className="rounded-xl border bg-white p-4 space-y-2">
        <div className="flex justify-between"><strong>Recent chats</strong><button onClick={()=>setHistoryOpen(false)}>Close</button></div>
        {chatHistory.length === 0 && <p>No saved conversations yet.</p>}
        {chatHistory.map(chat=><div key={chat.id} className="flex gap-3"><button disabled={loading} className="flex-1 text-left truncate underline" onClick={()=>openHistory(chat.id)}>{chat.title}</button><button disabled={loading} onClick={()=>deleteHistory(chat.id)}>Delete</button></div>)}
        <button disabled={loading} onClick={()=>deleteHistory()} className="text-red-700 underline">Delete all chat history</button>
      </section>}
      {/* Suggested Questions Grid (Full width) */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 px-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
            Start with a prompt
          </span>
          <span className="text-[11px] text-stone-400">Tap to start</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
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
              className="text-left p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-orange-50/50 border border-[#EFE8DF] hover:border-orange-300 text-xs sm:text-sm text-stone-800 hover:text-[#FF671F] transition shadow-2xs group flex items-center justify-between gap-2"
            >
              <span className="font-semibold text-xs sm:text-sm leading-tight truncate">{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 group-hover:text-[#FF671F] group-hover:translate-x-0.5 transition shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Active Dialogue Box */}
      <div className="w-full flex flex-col h-[620px] sm:h-[720px] lg:h-[800px] xl:h-[840px] rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] shadow-warm overflow-hidden">
        {/* Chat Stream Header */}
        <div className="p-2.5 sm:p-3.5 px-3.5 sm:px-6 bg-[#FAF8F5] border-b border-[#EFE8DF] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#FF671F]" />
            <span className="text-xs font-bold text-stone-800">
              Virasat AI conversation
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-400">
              ({messages.length})
            </span>
            {travelContext.destination && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#FF671F] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                Trip Target: {travelContext.destination}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-500">
            <span className="flex items-center gap-1 font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200 text-[10px] sm:text-[11px]">
              <Compass className="w-3 h-3 text-[#FF671F]" />
              {activeCity === 'All India' ? 'India-wide context' : `${activeCity} context`}
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-[#FAF8F5]/30"
        >
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 sm:gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${isUser
                    ? 'w-7 h-7 sm:w-8 sm:h-8 bg-[#FF671F] text-white font-bold'
                    : 'w-7 h-7 sm:w-8 sm:h-8 bg-white border border-stone-200 text-[#FF671F]'
                    }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>

                {/* Bubble - Full extent */}
                <div
                  className={`w-full max-w-[96%] sm:max-w-[94%] lg:max-w-[90%] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 text-sm sm:text-base leading-relaxed shadow-xs relative group ${isUser
                    ? 'bg-[#FF671F] text-white font-medium rounded-tr-sm ml-auto'
                    : 'bg-white border border-[#EFE8DF] text-stone-800 rounded-tl-sm mr-auto'
                    }`}
                >
                  {/* Message Body */}
                  {renderMessageContent(m.content)}

                  {/* Multimodal Transit Comparison Cards */}
                  {!isUser && m.transit_comparison && (m.transit_comparison.train || m.transit_comparison.air || m.transit_comparison.road || m.transit_comparison.walk) && renderTransitComparison(m.transit_comparison)}

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

                  {/* Interactive Website Action Buttons (Open Map, Plan Itinerary, View Destination, IRCTC Booking Link, etc.) */}
                  {!isUser && m.actions && m.actions.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
                        <span>Interactive Actions:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            type="button"
                            onClick={() => handleExecuteAction(act)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-xs hover:shadow-warm transition flex items-center gap-1.5 group cursor-pointer"
                          >
                            {getActionIcon(act.type)}
                            <span>{act.label}</span>
                            {act.type === 'booking_link' || act.type === 'external_link' ? (
                              <ExternalLink className="w-3 h-3 text-white/80" />
                            ) : (
                              <ArrowRight className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition" />
                            )}
                          </button>
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

                  {/* Google Maps Grounded Location Details Card */}
                  {!isUser && m.maps_grounding && m.maps_grounding.length > 0 && (
                    <div className="mt-3.5 p-3 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          Google Maps Verified Locations & Live Intel
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          Google Maps Grounded
                        </span>
                      </div>
                      <div className="space-y-2 pt-1">
                        {m.maps_grounding.map((item, gIdx) => (
                          <div key={gIdx} className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-bold text-xs text-stone-900 truncate">
                                📍 {item.title || 'Location Pin'}
                              </span>
                              {item.uri && (
                                <a
                                  href={item.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shrink-0 shadow-2xs hover:bg-blue-50 transition"
                                >
                                  <span>Open in Google Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            {item.reviewSnippets && item.reviewSnippets.length > 0 && (
                              <div className="space-y-1">
                                {item.reviewSnippets.map((snip, sIdx) => (
                                  <p key={sIdx} className="text-[11px] text-stone-700 italic bg-white/80 p-1.5 rounded-md border border-blue-100/60">
                                    💬 "{snip}"
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata & Actions Footer */}
                  <div
                    className={`mt-3 pt-2 flex items-center justify-between text-[10px] ${isUser ? 'border-t border-white/20 text-white/80' : 'border-t border-stone-100 text-stone-400'
                      }`}
                  >
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span>{m.timestamp || 'Just now'}</span>
                      {!isUser && m.sources && m.sources.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Retrieved sources</span>
                          {m.sources.filter(source => /^https?:\/\//i.test(source)).slice(0, 5).map((source, index) => (
                            <a key={source} href={source} target="_blank" rel="noopener noreferrer" className="underline px-1" aria-label={`Open retrieved source ${index + 1}`}>[{index + 1}]</a>
                          ))}
                        </span>
                      )}
                      {!isUser && m.latency_ms !== undefined && (
                        <span className="text-stone-400">
                          • {m.latency_ms}ms · {m.model_used || 'Virasat AI'}
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
          {draft && conversationId && <TripDraft key={`${conversationId}-${draft.revision}`} draft={draft} conversationId={conversationId} onChange={setDraft} />}
          {failedPrompt && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
            <p>{retrySeconds > 0 ? `Please wait ${retrySeconds}s before trying again. Your message is preserved.` : 'Your message is preserved. You can edit it or try again.'}</p>
            <button type="button" disabled={loading || retrySeconds > 0} onClick={()=>handleSend(input.trim() || failedPrompt)} className="mt-2 rounded-lg bg-orange-700 px-3 py-2 text-white disabled:opacity-50">{retrySeconds > 0 ? `Try again in ${retrySeconds}s` : 'Try again'}</button>
          </div>}
          {loading && streamText && <div className="rounded-xl border bg-white p-4 whitespace-pre-wrap text-sm" aria-live="polite">{streamText}</div>}
          {loading && <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => activeRequest.current?.abort()}>Stop response</button>}
          {loading && (
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-2xl bg-white border border-stone-200 text-[#FF671F] flex items-center justify-center shrink-0 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF671F]" />
              </div>
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EFE8DF] text-xs sm:text-sm text-stone-600 shadow-xs flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF671F] animate-ping" />
                <span>Virasat AI is checking the conversation and preparing an answer…</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar (Full width) */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#EFE8DF]">
          <InsecureContextAlert variant="banner" className="mb-2.5" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              <textarea
                ref={composerRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.currentTarget.style.height = 'auto';
                  e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 144)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Message Virasat AI… (Enter to send, Shift + Enter for a new line)"
                aria-label="Message Virasat AI"
                className="w-full min-h-[56px] max-h-40 resize-none overflow-y-auto pl-5 pr-14 py-3.5 sm:py-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#FF671F] focus:bg-white focus:ring-1 focus:ring-[#FF671F] transition"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <VoiceInputButton
                  variant="ai"
                  title="Speak to Virasat AI"
                  placeholderPrompt="Listening… (e.g. 'Plan a 3-day trip to Jaipur')"
                  onTranscript={(text) => setInput(text)}
                  onFinalTranscript={(text) => {
                    setInput(text);
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#FF671F] hover:bg-[#E65100] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <span>Send</span>
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          {/* Quick Virasat shortcuts footer */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 flex-wrap gap-2 pt-2 border-t border-stone-50">
            <span className="font-medium">Explore with Virasat:</span>
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
                    onClick={() => onNavigateTab('heritage')}
                    className="hover:text-[#FF671F] font-semibold flex items-center gap-1 transition"
                  >
                    <Landmark className="w-3 h-3" /> Monuments
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
