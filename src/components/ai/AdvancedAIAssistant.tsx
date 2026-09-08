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
  Bot
} from 'lucide-react';
import { api } from '../../services/api';
import { AIChatMessage } from '../../types';

interface ExtendedChatMessage extends AIChatMessage {
  suggested_places?: Array<{ id: string; name: string; city: string; reason?: string }>;
  sources?: string[];
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
  const initialGreeting: ExtendedChatMessage = {
    role: 'assistant',
    content: `Namaste! 👋 How can I help you today?\n\nI am your **Virasat AI Assistant**, directly grounded in India's master cultural database — covering 45 UNESCO & ASI verified heritage monuments, multimodal transit networks (suburban rail, metro), and all 36 States & Union Territories.\n\nAsk me about heritage monuments, customized 3-day travel circuits, how our interactive map works, or what is available near you!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ExtendedChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeCity, setActiveCity] = useState<string>(selectedCity);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastProcessedPrompt = useRef<string | null>(null);

  // Sync active city if changed from props
  useEffect(() => {
    if (selectedCity) setActiveCity(selectedCity);
  }, [selectedCity]);

  // Specific query suggestions as requested by user guidelines
  const coreSuggestions = [
    { label: 'What can I explore in Mumbai?', prompt: 'What can I explore in Mumbai? Suggest a balanced heritage and coastal circuit.' },
    { label: 'Tell me about Hampi', prompt: 'Tell me about Hampi: history, Vijayanagara dynasty, key monuments, timings, and ticket price.' },
    { label: 'Plan a 3-day heritage trip', prompt: 'Plan a 3-day heritage trip in India with morning, afternoon, and evening recommendations.' },
    { label: 'How does this website work?', prompt: 'How does this website work? Explain Virasat’s features and sections.' },
    { label: 'How do I use the map?', prompt: 'How do I use the map to find heritage monuments, stations, and calculate distances?' },
    { label: 'What is available near me?', prompt: 'What is available near me? How does geospatial discovery work in Virasat?' },
  ];

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      // Scroll ONLY the internal chat container; never scroll the browser window
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

  const handleSend = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;

    // Snapshot window scroll position so typing and submitting never scrolls the window up or down
    const originalScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const userMsg: ExtendedChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Keep window scroll unchanged
    if (typeof window !== 'undefined' && window.scrollY !== originalScrollY) {
      window.scrollTo({ top: originalScrollY, behavior: 'instant' as ScrollBehavior });
    }

    try {
      // Build conversation history for context continuity
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
        history: historyPayload,
      });

      const assistantMsg: ExtendedChatMessage = {
        role: 'assistant',
        content: res.reply || 'Here is the verified heritage intelligence from Virasat.',
        suggested_places: res.suggested_places,
        sources: res.sources || ['Virasat Master Heritage Database', 'ASI & UNESCO Gazette Records'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ExtendedChatMessage = {
        role: 'assistant',
        content: 'I had trouble connecting to the cultural archives. Please check your connection or tap Retry to resend.',
        error: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      // Guarantee window scroll is still locked in place
      if (typeof window !== 'undefined' && window.scrollY !== originalScrollY) {
        window.scrollTo({ top: originalScrollY, behavior: 'instant' as ScrollBehavior });
      }
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
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

  // Helper to render formatted assistant response (handles bold, bullets, and breaks cleanly)
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

          return <p key={idx}>{renderedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EFE8DF] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF671F] to-[#046A38] p-0.5 shadow-warm flex items-center justify-center text-white">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#FF671F]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-[#0B192C] tracking-tight">
                Virasat AI Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Grounded
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Verified ASI & UNESCO archives • Context-aware travel intelligence
            </p>
          </div>
        </div>

        {/* Region selector & Reset button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#EFE8DF] rounded-xl text-xs text-stone-700">
            <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
            <select
              value={activeCity}
              onChange={(e) => setActiveCity(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-medium text-xs text-stone-800 cursor-pointer"
              aria-label="Filter context by city"
            >
              <option value="All India">All India</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Delhi">Delhi</option>
              <option value="Agra">Agra</option>
              <option value="Kochi">Kochi</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Hampi">Hampi</option>
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

      {/* Suggested Questions Grid (Accessible anytime) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
            Frequently Asked Heritage Questions
          </span>
          <span className="text-[11px] text-stone-400">Click any question to ask</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {coreSuggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(item.prompt)}
              className="text-left p-3 rounded-2xl bg-white hover:bg-orange-50/50 border border-[#EFE8DF] hover:border-orange-300 text-xs text-stone-700 hover:text-[#FF671F] transition shadow-2xs group flex items-start justify-between gap-2"
            >
              <span className="font-medium leading-snug">{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#FF671F] group-hover:translate-x-0.5 transition shrink-0 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="flex flex-col h-[620px] rounded-3xl bg-white border border-[#EFE8DF] shadow-warm overflow-hidden">
        {/* Chat Stream Header */}
        <div className="p-3.5 px-5 bg-[#FAF8F5] border-b border-[#EFE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#FF671F]" />
            <span className="text-xs font-bold text-stone-800">
              Active Dialogue
            </span>
            <span className="text-[11px] text-stone-400">
              ({messages.length} messages)
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-500">
            <span className="flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified ASI Grounding
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF8F5]/30"
        >
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
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

                {/* Bubble */}
                <div
                  className={`max-w-[90%] sm:max-w-[82%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    isUser
                      ? 'bg-[#FF671F] text-white font-medium rounded-tr-sm'
                      : 'bg-white border border-[#EFE8DF] text-stone-800 rounded-tl-sm'
                  }`}
                >
                  {/* Message Body */}
                  {renderMessageContent(m.content)}

                  {/* Place recommendations chips (if returned) */}
                  {!isUser && m.suggested_places && m.suggested_places.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF671F]" /> Recommended Destinations:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {m.suggested_places.map((place) => (
                          <button
                            key={place.id}
                            type="button"
                            onClick={() => onSelectPlace && onSelectPlace(place.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-orange-50 border border-[#EFE8DF] hover:border-orange-300 text-stone-800 hover:text-[#FF671F] text-xs font-semibold transition shadow-2xs"
                          >
                            <span>📍 {place.name}</span>
                            <span className="text-[10px] text-stone-400 font-normal">({place.city})</span>
                            <ArrowRight className="w-3 h-3 text-stone-400" />
                          </button>
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
                    <span>{m.timestamp || 'Just now'}</span>

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
                              <span className="text-emerald-600">Copied</span>
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

          {/* Loading Bubble */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-2xl bg-white border border-stone-200 text-[#FF671F] flex items-center justify-center shrink-0 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF671F]" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-[#EFE8DF] text-xs text-stone-600 shadow-xs flex items-center gap-2.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF671F] animate-ping" />
                <span>Virasat AI is analyzing heritage archives, transit tables, and daily itineraries...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
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
              placeholder="Ask Virasat: e.g. What can I explore in Mumbai? Tell me about Hampi... (Enter to send)"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#FF671F] focus:bg-white focus:ring-1 focus:ring-[#FF671F] transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-[#FF671F] hover:bg-[#E65100] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
              aria-label="Send message"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Virasat tools shortcut footer */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 flex-wrap gap-2 pt-2 border-t border-stone-50">
            <span>Explore directly in Virasat:</span>
            <div className="flex items-center gap-3">
              {onNavigateTab && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('map')}
                    className="hover:text-[#FF671F] font-medium flex items-center gap-1 transition"
                  >
                    <Layers className="w-3 h-3" /> Map
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('3d')}
                    className="hover:text-[#FF671F] font-medium flex items-center gap-1 transition"
                  >
                    <Box className="w-3 h-3" /> 3D Models
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('itinerary')}
                    className="hover:text-[#FF671F] font-medium flex items-center gap-1 transition"
                  >
                    <Calendar className="w-3 h-3" /> Plan Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('india')}
                    className="hover:text-[#FF671F] font-medium flex items-center gap-1 transition"
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
