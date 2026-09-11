/**
 * Language detection and localization utilities for Virasat AI Assistant
 * Supports English (en), Hindi (hi), Marathi (mr), and Hinglish.
 */

import { SupportedLanguage } from '../types';

const HINDI_DEVANAGARI_REGEX = /[\u0900-\u097F]/;

const HINDI_KEYWORDS = [
  'kaise', 'kahan', 'kitna', 'kitni', 'jana', 'jaun', 'ja sakte', 'hai', 'hain',
  'batao', 'kripya', 'yatra', 'samay', 'kiraya', 'mandir', 'ghoomne', 'kharcha',
  'sasta', 'achha', 'accha', 'shandar', 'paas', 'dur', 'kaunsa', 'tarika', 'sujhav',
  'chahiye', 'karo', 'karna', 'ghumne', 'ghumana', 'dekhein', 'dekh', 'raha', 'rahe',
  'meri', 'mera', 'mere', 'bhai', 'yaar', 'bata', 'dost', 'hoga', 'hogi', 'hote'
];

const MARATHI_KEYWORDS = [
  'kuthe', 'kasa', 'kiti', 'jaayche', 'jaun shakto', 'ahe', 'aahe', 'ahet',
  'sang', 'sanga', 'vel', 'bhade', 'mandir', 'phirayla', 'jast', 'kami',
  'javal', 'lamb', 'konte', 'pahat', 'suvichar', 'maharashtratil', 'marathit'
];

export interface LanguageSwitchResult {
  isSwitch: boolean;
  targetLanguage?: SupportedLanguage;
  confirmationMessage?: string;
}

export function checkLanguageSwitchRequest(text: string): LanguageSwitchResult {
  if (!text) return { isSwitch: false };
  const lower = text.toLowerCase().trim();

  // English switch
  if (
    /^(speak in english|english please|reply in english|answer in english|tell me in english|english mein batao|english me batao|english me bolo|in english)\b/i.test(lower) ||
    lower === 'english'
  ) {
    return {
      isSwitch: true,
      targetLanguage: 'en',
      confirmationMessage: 'Sure! I have switched to English. How can I help with your travel plans across India? 😊',
    };
  }

  // Hinglish switch
  if (
    /^(speak in hinglish|hinglish please|reply in hinglish|hinglish mein batao|hinglish me batao|hinglish me bolo|in hinglish)\b/i.test(lower) ||
    lower === 'hinglish'
  ) {
    return {
      isSwitch: true,
      targetLanguage: 'hinglish',
      confirmationMessage: 'Haan bilkul! 😊 Ab se main aapse Hinglish mein baat karunga. Bataiye, kahan ghoomne ka plan hai?',
    };
  }

  // Hindi switch
  if (
    /^(speak in hindi|hindi please|reply in hindi|hindi mein batao|hindi me batao|hindi me bolo|हिंदी में बताओ|हिंदी में बोलिए|in hindi)\b/i.test(lower) ||
    lower === 'hindi' ||
    lower === 'हिंदी'
  ) {
    return {
      isSwitch: true,
      targetLanguage: 'hi',
      confirmationMessage: 'बिल्कुल! 😊 अब से मैं आपसे हिंदी में बात करूँगा। बताइए, आप भारत में कहाँ यात्रा करने की योजना बना रहे हैं?',
    };
  }

  // Marathi switch
  if (
    /^(speak in marathi|marathi please|marathit sanga|मराठीत सांगा|मराठीमध्ये सांगा|in marathi)\b/i.test(lower) ||
    lower === 'marathi' ||
    lower === 'मराठी'
  ) {
    return {
      isSwitch: true,
      targetLanguage: 'mr',
      confirmationMessage: 'नक्कीच! 😊 आतापासून मी आपल्याशी मराठीत संवाद साधेन. सांगा, आपल्याला कुठे भेट द्यायला आवडेल?',
    };
  }

  return { isSwitch: false };
}

export function detectLanguage(text: string): SupportedLanguage {
  if (!text || typeof text !== 'string') return 'en';
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // 1. Check for explicit switch commands
  const switchCheck = checkLanguageSwitchRequest(clean);
  if (switchCheck.isSwitch && switchCheck.targetLanguage) {
    return switchCheck.targetLanguage;
  }

  // 2. Devanagari script checks
  const hasDevanagari = HINDI_DEVANAGARI_REGEX.test(clean);
  if (hasDevanagari) {
    if (
      clean.includes('कसे') ||
      clean.includes('कुठे') ||
      clean.includes('किती') ||
      clean.includes('आहे') ||
      clean.includes('सांगा') ||
      clean.includes('जायचे') ||
      clean.includes('जवळ') ||
      clean.includes('ठिकाणे')
    ) {
      return 'mr';
    }
    return 'hi';
  }

  // 3. Latin script checks
  const words = lower.split(/[^a-z]+/);
  let marathiCount = 0;
  let hindiCount = 0;

  for (const w of words) {
    if (MARATHI_KEYWORDS.includes(w)) marathiCount++;
    if (HINDI_KEYWORDS.includes(w)) hindiCount++;
  }

  if (marathiCount > 0 && marathiCount >= hindiCount) {
    return 'mr';
  }

  if (hindiCount > 0) {
    // Conversational Indian Latin script is Hinglish
    return 'hinglish';
  }

  return 'en';
}

export function getLanguageInstruction(lang: SupportedLanguage): string {
  switch (lang) {
    case 'hi':
      return 'Respond in natural, polite Indian Hindi (Devanagari script). Use everyday conversational tone and keep common travel loanwords natural (ट्रेन, बस, टैक्सी, होटल, रूट, बजट, टाइमिंग, इटिनरेरी). Avoid overly archaic or bookish words.';
    case 'mr':
      return 'Respond in natural, polite Marathi (Devanagari script), using authentic regional terminology.';
    case 'hinglish':
      return 'Respond in friendly, natural Indian Hinglish (conversational Hindi written in Latin/English script, using phrases like "Haan bilkul! 😊", "aapke liye", "ghumne ke liye", "main explain karta hoon"). Be warm, intelligent, and engaging like ChatGPT.';
    default:
      return 'Respond in engaging, warm, professional Indian English. Explain options conversationally and offer clear travel recommendations.';
  }
}
