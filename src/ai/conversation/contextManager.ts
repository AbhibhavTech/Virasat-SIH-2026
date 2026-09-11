/**
 * Multi-turn Conversation Context Manager for Virasat AI Assistant
 * Tracks ongoing conversational state, active destination, trip duration, traveller type, budget,
 * language preference, and missing-info follow-up state.
 */

import { AIRequest, SupportedLanguage } from '../types';
import { detectLanguage, checkLanguageSwitchRequest } from '../utils/language';
import { canonicalizeLocation } from '../utils/locationHelper';

export interface ConversationState {
  activeDestination?: string;
  activeOrigin?: string;
  activeDays?: number;
  activeBudget?: number;
  travellerType?: 'solo' | 'family' | 'couple' | 'friends' | 'budget';
  pace?: 'relaxed' | 'moderate' | 'fast';
  conversationLanguage?: SupportedLanguage;
  lastQuestionAsked?: 'ASKED_DESTINATION' | 'ASKED_DURATION' | 'ASKED_TRAVELLER_TYPE' | 'ASKED_BUDGET' | null;
  historyLength: number;
  turnCount: number;
}

export class ContextManager {
  private sessions: Map<string, ConversationState> = new Map();

  public extractContext(request: AIRequest): ConversationState {
    const history = request.history || [];
    const sessionId = request.conversation_id || 'default_session';

    // Retrieve or initialize session state
    let state = this.sessions.get(sessionId);
    if (!state) {
      state = {
        historyLength: history.length,
        turnCount: 0,
      };
      this.sessions.set(sessionId, state);
    }

    state.turnCount++;
    state.historyLength = history.length;

    const rawMessage = (request.message || '').trim();
    const lower = rawMessage.toLowerCase();

    // 1. Language Preference Tracking
    const switchCheck = checkLanguageSwitchRequest(rawMessage);
    if (switchCheck.isSwitch && switchCheck.targetLanguage) {
      state.conversationLanguage = switchCheck.targetLanguage;
    } else if (!state.conversationLanguage) {
      state.conversationLanguage = detectLanguage(rawMessage);
    }

    // 2. Explicit travel_context overrides from request
    if (request.travel_context?.destination) state.activeDestination = canonicalizeLocation(request.travel_context.destination);
    if (request.travel_context?.origin) state.activeOrigin = canonicalizeLocation(request.travel_context.origin);
    if (request.travel_context?.days) state.activeDays = request.travel_context.days;
    if (request.travel_context?.budget) state.activeBudget = request.travel_context.budget;
    if (request.travel_context?.traveller_type) state.travellerType = request.travel_context.traveller_type;
    if (request.travel_context?.pace) state.pace = request.travel_context.pace;
    if (request.city && !state.activeDestination) state.activeDestination = canonicalizeLocation(request.city);
    if (request.place_name && !state.activeDestination) state.activeDestination = canonicalizeLocation(request.place_name);

    // 3. Progressive updates from current message:
    // Destination detection
    const knownCities = [
      'jaipur', 'mumbai', 'delhi', 'agra', 'varanasi', 'udaipur', 'goa',
      'amritsar', 'kolkata', 'chennai', 'bengaluru', 'kochi', 'ladakh', 'leh'
    ];
    for (const city of knownCities) {
      if (new RegExp(`\\b${city}\\b`, 'i').test(lower)) {
        state.activeDestination = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }

    if (!state.activeDestination) {
      const canon = canonicalizeLocation(rawMessage);
      if (canon && canon !== rawMessage) {
        state.activeDestination = canon;
      }
    }

    // Duration detection (e.g. "5 din", "5 days", "3-day", "a week", "5 दिन")
    const daysMatch = lower.match(/(\d+)\s*(?:-|–|\s*)?(?:days?|divas|din|d)\b/i) || lower.match(/(\d+)\s*दिन/i) || lower.match(/^(\d+)\s*$/);
    if (daysMatch) {
      state.activeDays = parseInt(daysMatch[1], 10);
    } else if (/\b(weekend|2 days)\b/i.test(lower)) {
      state.activeDays = 2;
    } else if (/\b(week|7 days)\b/i.test(lower)) {
      state.activeDays = 7;
    }

    // Traveller Type detection (e.g. "family ke saath", "family ke liye", "solo", "couple", "friends")
    if (/\b(family|baccho|parents|family ke saath|family ke liye)\b/i.test(lower)) {
      state.travellerType = 'family';
    } else if (/\b(solo|alone|kela|single)\b/i.test(lower)) {
      state.travellerType = 'solo';
    } else if (/\b(couple|husband|wife|honeymoon|partner)\b/i.test(lower)) {
      state.travellerType = 'couple';
    } else if (/\b(friends|dost|group|buddies)\b/i.test(lower)) {
      state.travellerType = 'friends';
    } else if (/\b(budget|backpacker|sasta|cheap)\b/i.test(lower)) {
      state.travellerType = 'budget';
    }

    // Budget detection (e.g. "budget 30k", "budget 20000", "₹30,000", "30k hai")
    const kMatch = lower.match(/(?:budget|kharcha|₹|rs\.?|inr)?\s*(\d+)\s*k\b/i);
    const numMatch = lower.match(/(?:budget|kharcha|₹|rs\.?|inr)\s*(\d[\d,]*)/i);
    if (kMatch) {
      state.activeBudget = parseInt(kMatch[1], 10) * 1000;
    } else if (numMatch) {
      state.activeBudget = parseInt(numMatch[1].replace(/,/g, ''), 10);
    }

    // 4. Fallback scan of recent request history if memory lacked destination/days
    if (!state.activeDestination || !state.activeDays) {
      for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i];
        const text = (msg.text || msg.content || '').toLowerCase();

        if (!state.activeDestination) {
          for (const city of knownCities) {
            if (new RegExp(`\\b${city}\\b`, 'i').test(text)) {
              state.activeDestination = city.charAt(0).toUpperCase() + city.slice(1);
              break;
            }
          }
        }

        if (!state.activeDays) {
          const hDays = text.match(/(\d+)\s*(?:-|–|\s*)?(?:days?|divas|din)\b/i);
          if (hDays) state.activeDays = parseInt(hDays[1], 10);
        }

        if (!state.travellerType) {
          if (/\b(family)\b/i.test(text)) state.travellerType = 'family';
          else if (/\b(solo)\b/i.test(text)) state.travellerType = 'solo';
          else if (/\b(couple)\b/i.test(text)) state.travellerType = 'couple';
          else if (/\b(friends)\b/i.test(text)) state.travellerType = 'friends';
        }
      }
    }

    this.sessions.set(sessionId, state);
    return state;
  }

  public setLastQuestion(sessionId: string, question: 'ASKED_DESTINATION' | 'ASKED_DURATION' | 'ASKED_TRAVELLER_TYPE' | 'ASKED_BUDGET' | null): void {
    const s = this.sessions.get(sessionId);
    if (s) {
      s.lastQuestionAsked = question;
      this.sessions.set(sessionId, s);
    }
  }

  public resetSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const contextManager = new ContextManager();
