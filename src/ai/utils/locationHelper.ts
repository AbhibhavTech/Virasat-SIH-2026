/**
 * Canonical Location Helper
 * Maps Devanagari/Hindi/Regional place and city names to canonical English names
 * for database resolution and multimodal transit routing.
 */

export const DEVANAGARI_LOCATION_MAP: Record<string, string> = {
  'मुंबई': 'Mumbai',
  'बंबई': 'Mumbai',
  'दिल्ली': 'Delhi',
  'नई दिल्ली': 'New Delhi',
  'जयपुर': 'Jaipur',
  'आगरा': 'Agra',
  'वाराणसी': 'Varanasi',
  'बनारस': 'Varanasi',
  'काशी': 'Varanasi',
  'कोलकाता': 'Kolkata',
  'कलकत्ता': 'Kolkata',
  'चेन्नई': 'Chennai',
  'मद्रास': 'Chennai',
  'बेंगलुरु': 'Bengaluru',
  'बैंगलोर': 'Bengaluru',
  'हैदराबाद': 'Hyderabad',
  'पुणे': 'Pune',
  'गोवा': 'Goa',
  'अमृतसर': 'Amritsar',
  'उदयपुर': 'Udaipur',
  'जोधपुर': 'Jodhpur',
  'जैसलमेर': 'Jaisalmer',
  'शिमला': 'Shimla',
  'मनाली': 'Manali',
  'ऋषिकेश': 'Rishikesh',
  'हरिद्वार': 'Haridwar',
  'अयोध्या': 'Ayodhya',
  'प्रयागराज': 'Prayagraj',
  'इलाहाबाद': 'Prayagraj',
  'श्रीनगर': 'Srinagar',
  'लेह': 'Leh',
  'लद्दाख': 'Ladakh',
  'ऊटी': 'Ooty',
  'कोच्चि': 'Kochi',
  'कोचीन': 'Kochi',
  'तिरुवनंतपुरम': 'Thiruvananthapuram',
  'त्रिवेंद्रम': 'Thiruvananthapuram',
  'अहमदाबाद': 'Ahmedabad',
  'सूरत': 'Surat',
  'लखनऊ': 'Lucknow',
  'कानपुर': 'Kanpur',
  'पटना': 'Patna',
  'चंडीगढ़': 'Chandigarh',
  'भोपाल': 'Bhopal',
  'इंदौर': 'Indore',
  'सीएसएमटी': 'CSMT',
  'चर्चगेट': 'Churchgate',
  'दादर': 'Dadar',
  'बांद्रा': 'Bandra',
  'ठाणे': 'Thane',
  'बोरीवली': 'Borivali',
  'अंधेरी': 'Andheri',
  'गेटवे ऑफ इंडिया': 'Gateway of India',
  'ताज महल': 'Taj Mahal',
  'ताजमहल': 'Taj Mahal',
  'हवा महल': 'Hawa Mahal',
  'हवामहल': 'Hawa Mahal',
  'आमेर किला': 'Amber Fort',
  'आमेर फोर्ट': 'Amber Fort',
  'कुतुब मीनार': 'Qutub Minar',
  'लाल किला': 'Red Fort',
  'इंडिया गेट': 'India Gate',
  'स्वर्ण मंदिर': 'Golden Temple',
  'अजंता': 'Ajanta Caves',
  'एलोरा': 'Ellora Caves',
};

export function canonicalizeLocation(name: string): string {
  if (!name || typeof name !== 'string') return '';
  const clean = name.trim().replace(/[?!,.:;]+$/g, '').trim();
  if (DEVANAGARI_LOCATION_MAP[clean]) {
    return DEVANAGARI_LOCATION_MAP[clean];
  }
  for (const [k, v] of Object.entries(DEVANAGARI_LOCATION_MAP)) {
    if (clean.includes(k)) {
      return v;
    }
  }
  return clean;
}

export const ENGLISH_TO_DEVANAGARI_MAP: Record<string, string> = {
  'Jaipur': 'जयपुर',
  'Mumbai': 'मुंबई',
  'Delhi': 'दिल्ली',
  'New Delhi': 'नई दिल्ली',
  'Agra': 'आगरा',
  'Varanasi': 'वाराणसी',
  'Udaipur': 'उदयपुर',
  'Jodhpur': 'जोधपुर',
  'Kolkata': 'कोलकाता',
  'Chennai': 'चेन्नई',
  'Goa': 'गोवा',
  'Amritsar': 'अमृतसर',
  'Bengaluru': 'बेंगलुरु',
  'Pune': 'पुणे',
  'Shimla': 'शिमला',
  'Manali': 'मनाली',
  'Kochi': 'कोच्चि',
  'Leh Ladakh': 'लेह लद्दाख',
  'Leh': 'लेह',
  'Ladakh': 'लद्दाख',
};

export function getHindiLocationName(name: string): string {
  if (!name) return '';
  return ENGLISH_TO_DEVANAGARI_MAP[name] || name;
}

