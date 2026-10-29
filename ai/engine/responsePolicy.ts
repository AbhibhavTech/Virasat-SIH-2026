const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', as: 'Assamese', bn: 'Bengali', brx: 'Bodo', doi: 'Dogri', gu: 'Gujarati', hi: 'Hindi',
  kn: 'Kannada', ks: 'Kashmiri', kok: 'Konkani', mai: 'Maithili', ml: 'Malayalam', mni: 'Manipuri',
  mr: 'Marathi', ne: 'Nepali', or: 'Odia', pa: 'Punjabi', sa: 'Sanskrit', sat: 'Santali', sd: 'Sindhi', ta: 'Tamil', te: 'Telugu', ur: 'Urdu',
};

/** A separate system instruction makes the UI language a response constraint, not loose context. */
export function responseLanguageInstruction(language: string | undefined, latestMessage: string): string {
  if (language && language !== 'auto' && LANGUAGE_NAMES[language]) {
    const name = LANGUAGE_NAMES[language];
    const script = language === 'hi' ? 'Use Devanagari script.' : language === 'en' ? 'Use English in Latin script.' : `Use the normal script for ${name}.`;
    return `LANGUAGE REQUIREMENT: Reply only in ${name}. ${script} Keep place names recognizable. Do not switch to Hindi, Hinglish, or another language unless the user explicitly requests translation or a language change.`;
  }
  const romanizedHindi = /\b(kya|hai|hain|ka|ki|ko|mein|se|batao|bataiye|kaise|kahan|aur|chahiye|mujhe|aap|mera|meri|kar do|karo|ke baare)\b/i.test(latestMessage)
    || /\b(mera|meri|mujhe|batao|bataiye|kahan|kaise|chahiye|kar do|karo)\b/i.test(latestMessage);
  if (romanizedHindi) return 'LANGUAGE REQUIREMENT: The latest user message is Romanized Hindi/Hinglish. Reply naturally in Romanized Hindi/Hinglish using Latin script. Do not unexpectedly switch to Devanagari or English.';
  if (/[\u0900-\u097f]/.test(latestMessage)) return 'LANGUAGE REQUIREMENT: Reply in the same language and script as the latest user message (Hindi in Devanagari when applicable).';
  return 'LANGUAGE REQUIREMENT: Reply in the same language as the latest user message. India-related subject matter alone is not a reason to switch languages.';
}

export type TravelMode = 'train' | 'air' | 'road' | 'walk';
const MODE_PATTERNS: Record<TravelMode, RegExp> = {
  train: /\b(train|rail|railway|trains)\b|ट्रेन|रेल/i,
  air: /\b(flight|flights|airline|airlines|airport|air travel)\b|हवाई|फ्लाइट|एयरपोर्ट/i,
  road: /\b(drive|driving|car|road|bus|buses)\b|ड्राइव|गाड़ी|बस/i,
  walk: /\b(walk|walking|on foot)\b|पैदल/i,
};

/** null means the user asked for a broad comparison; otherwise list only explicitly requested modes. */
export function requestedTravelModes(message: string): TravelMode[] | null {
  const modes = (Object.entries(MODE_PATTERNS) as [TravelMode, RegExp][]).filter(([, pattern]) => pattern.test(message)).map(([mode]) => mode);
  return modes.length ? modes : null;
}

export function scopeTransportOptions(result: any, modes: TravelMode[] | null): any {
  if (!modes || !result || result.error || !result.transit_options) return result;
  const transit_options = Object.fromEntries(modes.filter(mode => result.transit_options[mode]).map(mode => [mode, result.transit_options[mode]]));
  const scoped: any = { ...result, transit_options };
  if (!modes.includes('air')) delete scoped.airport_access;
  delete scoped.recommendation;
  return scoped;
}

/** Overall record verification does not establish that changing operational facts are current. */
export function markOperationalDetailsUnverified(place: any): any {
  if (!place || typeof place !== 'object') return place;
  const { timings: _timings, visiting_hours: _visitingHours, opening_hours: _openingHours, entry_fee: _entryFee, ticket_price: _ticketPrice, ...stable } = place;
  return {
    ...stable,
    operational_data: {
      opening_hours: { value: null, status: 'needs_verification' },
      closing_day: { value: null, status: 'needs_verification' },
      entry_fee: { value: null, status: 'needs_verification' },
    },
  };
}
