export interface IndianAirport {
  iata: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  aliases: string[];
}

export const INDIAN_AIRPORTS: IndianAirport[] = [
  { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000, aliases: ['new delhi', 'ncr', 'gurugram', 'noida'] },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra', lat: 19.0896, lng: 72.8656, aliases: ['bombay', 'navi mumbai', 'thane'] },
  { iata: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka', lat: 13.1986, lng: 77.7066, aliases: ['bangalore'] },
  { iata: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9941, lng: 80.1709, aliases: ['madras', 'meenambakkam'] },
  { iata: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal', lat: 22.6547, lng: 88.4467, aliases: ['calcutta', 'dum dum'] },
  { iata: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lng: 78.4294, aliases: ['shamshabad', 'secunderabad'] },
  { iata: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala', lat: 10.1518, lng: 76.3930, aliases: ['cochin', 'nedumbassery', 'ernakulam'] },
  { iata: 'GOI', name: 'Dabolim Airport', city: 'Goa', state: 'Goa', lat: 15.3808, lng: 73.8314, aliases: ['south goa', 'vasco'] },
  { iata: 'GOX', name: 'Manohar International Airport (Mopa)', city: 'Goa', state: 'Goa', lat: 15.7667, lng: 73.8667, aliases: ['north goa', 'mopa'] },
  { iata: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra', lat: 18.5822, lng: 73.9197, aliases: ['lohegaon', 'poona'] },
  { iata: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan', lat: 26.8242, lng: 75.8122, aliases: ['sanganer', 'pink city'] },
  { iata: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.4524, lng: 82.8593, aliases: ['banaras', 'kashi', 'babatpur'] },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0726, lng: 72.6347, aliases: ['ahmedabad', 'gandhinagar'] },
  { iata: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', state: 'Punjab', lat: 31.7096, lng: 74.7973, aliases: ['rajasansi', 'golden temple'] },
  { iata: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 33.9871, lng: 74.7744, aliases: ['kashmir', 'dal lake'] },
  { iata: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', state: 'Rajasthan', lat: 24.6178, lng: 73.8961, aliases: ['dabok', 'lake city'] },
  { iata: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2514, lng: 73.0489, aliases: ['blue city'] },
  { iata: 'IXU', name: 'Chhatrapati Sambhaji Nagar Airport (Aurangabad)', city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8631, lng: 75.3981, aliases: ['aurangabad', 'ajanta', 'ellora', 'daulatabad'] },
  { iata: 'HJR', name: 'Khajuraho Airport', city: 'Khajuraho', state: 'Madhya Pradesh', lat: 24.8172, lng: 79.9189, aliases: ['khajuraho temples', 'chhatarpur'] },
  { iata: 'AGR', name: 'Agra Airport (Kheria)', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1558, lng: 77.9609, aliases: ['taj mahal', 'kheria', 'fatehpur sikri'] },
  { iata: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam', lat: 26.1061, lng: 91.5859, aliases: ['borjhar', 'kamakhya', 'assam'] },
  { iata: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2444, lng: 85.8178, aliases: ['puri', 'konark', 'cuttack'] },
  { iata: 'PAT', name: 'Jay Prakash Narayan Airport', city: 'Patna', state: 'Bihar', lat: 25.5913, lng: 85.0880, aliases: ['nalanda', 'bodh gaya', 'patna airport'] },
  { iata: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.7606, lng: 80.8893, aliases: ['amausi', 'ayodhya hub'] },
  { iata: 'IXC', name: 'Shaheed Bhagat Singh International Airport', city: 'Chandigarh', state: 'Chandigarh', lat: 30.6735, lng: 76.7885, aliases: ['mohali', 'panchkula'] },
  { iata: 'TRV', name: 'Thiruvananthapuram International Airport', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4821, lng: 76.9200, aliases: ['trivandrum', 'kovalam'] },
  { iata: 'IXB', name: 'Bagdogra International Airport', city: 'Siliguri', state: 'West Bengal', lat: 26.6812, lng: 88.3286, aliases: ['darjeeling', 'gangtok', 'sikkim'] },
  { iata: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra', lat: 21.0922, lng: 79.0472, aliases: ['sonegaon', 'orange city'] },
  { iata: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand', lat: 23.3143, lng: 85.3217, aliases: ['ranchi'] },
  { iata: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat', lat: 22.3325, lng: 73.2264, aliases: ['baroda', 'statue of unity'] },
  { iata: 'VDY', name: 'Jindal Vijayanagar Airport', city: 'Toranagallu', state: 'Karnataka', lat: 15.1683, lng: 76.6342, aliases: ['hampi', 'ballari', 'bellary'] },
  { iata: 'HBX', name: 'Hubballi Airport', city: 'Hubballi', state: 'Karnataka', lat: 15.3617, lng: 75.0849, aliases: ['hubli', 'dharwad', 'hampi'] },
  { iata: 'IXM', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu', lat: 9.8345, lng: 78.0934, aliases: ['meenakshi amman temple'] },
  { iata: 'TIR', name: 'Tirupati Airport', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6325, lng: 79.5433, aliases: ['renigunta', 'tirumala'] },
  { iata: 'DED', name: 'Jolly Grant Airport', city: 'Dehradun', state: 'Uttarakhand', lat: 30.1897, lng: 78.1803, aliases: ['rishikesh', 'haridwar'] },
  { iata: 'IXJ', name: 'Jammu Airport', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.6891, lng: 74.8374, aliases: ['satwari', 'vaishno devi'] },
  { iata: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh', lat: 21.1804, lng: 81.7388, aliases: ['mana'] },
  { iata: 'IDR', name: 'Devi Ahilya Bai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7217, lng: 75.8011, aliases: ['ujjain gateway', 'indore'] },
  { iata: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2875, lng: 77.3378, aliases: ['sanchi gateway', 'bhopal'] },
];

export const STATE_COORDINATES: Record<string, { lat: number; lng: number; zoom: number; capital: string }> = {
  'andhra-pradesh': { lat: 15.9129, lng: 79.7400, zoom: 7, capital: 'Amaravati' },
  'arunachal-pradesh': { lat: 28.2180, lng: 94.7278, zoom: 7, capital: 'Itanagar' },
  'assam': { lat: 26.2006, lng: 92.9376, zoom: 7, capital: 'Dispur' },
  'bihar': { lat: 25.0961, lng: 85.3131, zoom: 7, capital: 'Patna' },
  'chhattisgarh': { lat: 21.2787, lng: 81.8661, zoom: 7, capital: 'Raipur' },
  'goa': { lat: 15.2993, lng: 74.1240, zoom: 9, capital: 'Panaji' },
  'gujarat': { lat: 22.2587, lng: 71.1924, zoom: 7, capital: 'Gandhinagar' },
  'haryana': { lat: 29.0588, lng: 76.0856, zoom: 7, capital: 'Chandigarh' },
  'himachal-pradesh': { lat: 31.1048, lng: 77.1734, zoom: 7, capital: 'Shimla' },
  'jharkhand': { lat: 23.6102, lng: 85.2799, zoom: 7, capital: 'Ranchi' },
  'karnataka': { lat: 15.3173, lng: 75.7139, zoom: 7, capital: 'Bengaluru' },
  'kerala': { lat: 10.8505, lng: 76.2711, zoom: 7, capital: 'Thiruvananthapuram' },
  'madhya-pradesh': { lat: 22.9734, lng: 78.6569, zoom: 6.5, capital: 'Bhopal' },
  'maharashtra': { lat: 19.7515, lng: 75.7139, zoom: 6.5, capital: 'Mumbai' },
  'manipur': { lat: 24.6637, lng: 93.9063, zoom: 8, capital: 'Imphal' },
  'meghalaya': { lat: 25.4670, lng: 91.3662, zoom: 8, capital: 'Shillong' },
  'mizoram': { lat: 23.1645, lng: 92.9376, zoom: 8, capital: 'Aizawl' },
  'nagaland': { lat: 26.1584, lng: 94.5624, zoom: 8, capital: 'Kohima' },
  'odisha': { lat: 20.9517, lng: 85.0985, zoom: 7, capital: 'Bhubaneswar' },
  'punjab': { lat: 31.1471, lng: 75.3412, zoom: 7, capital: 'Chandigarh' },
  'rajasthan': { lat: 27.0238, lng: 74.2179, zoom: 6.5, capital: 'Jaipur' },
  'sikkim': { lat: 27.5330, lng: 88.5122, zoom: 8, capital: 'Gangtok' },
  'tamil-nadu': { lat: 11.1271, lng: 78.6569, zoom: 7, capital: 'Chennai' },
  'telangana': { lat: 18.1124, lng: 79.0193, zoom: 7, capital: 'Hyderabad' },
  'tripura': { lat: 23.9408, lng: 91.9882, zoom: 8, capital: 'Agartala' },
  'uttar-pradesh': { lat: 26.8467, lng: 80.9462, zoom: 6.5, capital: 'Lucknow' },
  'uttarakhand': { lat: 30.0668, lng: 79.0193, zoom: 7, capital: 'Dehradun' },
  'west-bengal': { lat: 22.9868, lng: 87.8550, zoom: 7, capital: 'Kolkata' },
  'delhi': { lat: 28.6139, lng: 77.2090, zoom: 11, capital: 'New Delhi' },
  'jammu-and-kashmir': { lat: 33.7782, lng: 76.5762, zoom: 7, capital: 'Srinagar' },
  'ladakh': { lat: 34.1526, lng: 77.5771, zoom: 7, capital: 'Leh' },
  'andaman-and-nicobar-islands': { lat: 11.7401, lng: 92.6586, zoom: 8, capital: 'Port Blair' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, zoom: 12, capital: 'Chandigarh' },
  'dadra-and-nagar-haveli-and-daman-and-diu': { lat: 20.4283, lng: 72.8397, zoom: 10, capital: 'Daman' },
  'lakshadweep': { lat: 10.5667, lng: 72.6417, zoom: 9, capital: 'Kavaratti' },
  'puducherry': { lat: 11.9416, lng: 79.8083, zoom: 12, capital: 'Puducherry' },
};

export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function findNearestAirport(lat: number, lng: number): { airport: IndianAirport; distanceKm: number } {
  let nearest = INDIAN_AIRPORTS[0];
  let minDistance = Infinity;
  for (const ap of INDIAN_AIRPORTS) {
    const d = haversineDistanceKm(lat, lng, ap.lat, ap.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = ap;
    }
  }
  return { airport: nearest, distanceKm: minDistance };
}

export function searchAirports(query: string): IndianAirport[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return INDIAN_AIRPORTS.filter((ap) => {
    if (ap.iata.toLowerCase() === q) return true;
    if (ap.city.toLowerCase() === q || ap.city.toLowerCase().startsWith(q)) return true;
    if (ap.name.toLowerCase().includes(q)) return true;
    if (ap.city.toLowerCase().includes(q)) return true;
    if (ap.state.toLowerCase().includes(q)) return true;
    if (ap.aliases.some((al) => al.includes(q))) return true;
    return false;
  });
}

export function generateFlightArc(p1: [number, number], p2: [number, number], numPoints = 60): [number, number][] {
  const [lat1, lng1] = p1;
  const [lat2, lng2] = p2;
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const curveFactor = Math.min(Math.max(dist * 0.16, 1.2), 6.5);
  const normalLat = -dLng / (dist || 1);
  const normalLng = dLat / (dist || 1);
  const ctrlLat = midLat + normalLat * curveFactor;
  const ctrlLng = midLng + normalLng * curveFactor;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * ctrlLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * ctrlLng + t * t * lng2;
    points.push([Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
  }
  return points;
}

export function getGoogleFlightsUrl(originQuery: string, destQuery: string, dateStr: string): string {
  return `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(destQuery)}+from+${encodeURIComponent(originQuery)}+on+${encodeURIComponent(dateStr)}`;
}

export interface IndianHeritageMarket {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  specialty: string;
  badge?: string;
}

export const HISTORIC_INDIAN_MARKETS: IndianHeritageMarket[] = [
  { id: 'mkt-crawford-mumbai', name: 'Crawford Market (Mahatma Jyotiba Phule Mandai)', city: 'Mumbai', state: 'Maharashtra', lat: 18.9472, lng: 72.8347, specialty: 'Colonial 1869 market hall, spices, dry fruits & fresh produce', badge: 'Historic Market' },
  { id: 'mkt-johari-bazaar-jaipur', name: 'Johari Bazaar (Jewellery & Gems)', city: 'Jaipur', state: 'Rajasthan', lat: 26.9208, lng: 75.8242, specialty: 'Precious Kundan jewellery, gemstones, silver & bandhani', badge: 'Heritage Bazaar' },
  { id: 'mkt-bapu-bazaar-jaipur', name: 'Bapu Bazaar', city: 'Jaipur', state: 'Rajasthan', lat: 26.9179, lng: 75.8203, specialty: 'Rajasthani textiles, Jaipuri juttis, handicrafts & perfumes', badge: 'Traditional Market' },
  { id: 'mkt-chandni-chowk-delhi', name: 'Chandni Chowk Mughal Market', city: 'Old Delhi', state: 'Delhi', lat: 28.6562, lng: 77.2300, specialty: '17th-century Mughal commercial artery, silver, street food & textiles', badge: 'Historic Market' },
  { id: 'mkt-devaraja-market-mysore', name: 'Devaraja Market', city: 'Mysuru', state: 'Karnataka', lat: 12.3086, lng: 76.6508, specialty: 'Century-old bazaar for Mysore silk, sandalwood, flowers & betel leaf', badge: 'Heritage Bazaar' },
  { id: 'mkt-ima-keithel-imphal', name: 'Ima Keithel (Mother’s Market)', city: 'Imphal', state: 'Manipur', lat: 24.8078, lng: 93.9368, specialty: '500-year-old historic market managed entirely by women traders', badge: 'Heritage Market' },
  { id: 'mkt-laad-bazaar-hyderabad', name: 'Laad Bazaar (Choodi Bazaar)', city: 'Hyderabad', state: 'Telangana', lat: 17.3616, lng: 78.4735, specialty: 'Historic bangle, pearl, semi-precious stone market adjacent to Charminar', badge: 'Heritage Bazaar' },
  { id: 'mkt-new-market-kolkata', name: 'New Market (Sir Stuart Hogg Market)', city: 'Kolkata', state: 'West Bengal', lat: 22.5604, lng: 88.3524, specialty: 'Gothic 1874 arcade with 2,000+ stalls for Bengali sweets, silk & crafts', badge: 'Historic Market' },
  { id: 'mkt-jew-town-kochi', name: 'Jew Town Spice Market', city: 'Kochi', state: 'Kerala', lat: 9.9582, lng: 76.2594, specialty: 'Ancient port spice trade warehouses, antiques & cardamom aroma', badge: 'Spice Market' },
  { id: 'mkt-hazratganj-lucknow', name: 'Hazratganj Heritage Market', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8524, lng: 80.9462, specialty: 'Colonial-era high street for Chikankari embroidery, Awadhi sweets & books', badge: 'Historic Market' },
  { id: 'mkt-sarafa-bazaar-indore', name: 'Sarafa Bazaar', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7177, lng: 75.8544, specialty: 'Daytime gold & jewellery bazaar, bustling night street-food market', badge: 'Heritage Bazaar' },
  { id: 'mkt-anjuna-goa', name: 'Anjuna Flea Market', city: 'Anjuna', state: 'Goa', lat: 15.5733, lng: 73.7410, specialty: 'Coastal flea market for handicrafts, Tibetan jewellery, handmade garments', badge: 'Heritage Bazaar' },
];
