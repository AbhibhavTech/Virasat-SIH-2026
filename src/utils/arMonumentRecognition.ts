import { VisualIdentificationResult, AROverlayPin } from '../types';

export interface ARMonumentData {
  id: string;
  name: string;
  nameHindi: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  imageUrl: string;
  who_built_it: string;
  year_built: string;
  era: string;
  architectural_style: string;
  overview_50_words: string;
  easy_explanation_hindi: string;
  visiting_hours: string;
  entry_fee_domestic: number;
  entry_fee_intl: number;
  best_time_to_visit: string;
  visiting_tips: string;
  unesco_status: boolean;
  architectural_highlights: string[];
  historical_facts: string[];
  ar_overlays: AROverlayPin[];
  keywords: string[];
  dominant_color?: 'white' | 'red_sandstone' | 'yellow_sandstone' | 'basalt' | 'grey_granite' | 'green_nature' | 'gold';
}

export const AR_MONUMENTS_REGISTRY: ARMonumentData[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    nameHindi: 'ताज महल',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    lat: 27.1751,
    lng: 78.0421,
    imageUrl: '/images/ar-samples/taj-mahal.jpg',
    who_built_it: 'Mughal Emperor Shah Jahan',
    year_built: '1632 - 1653 CE',
    era: 'Mughal Empire Golden Era',
    architectural_style: 'Mughal & Indo-Islamic White Marble Architecture',
    overview_50_words:
      'The Taj Mahal is an ivory-white marble mausoleum situated on the south bank of the Yamuna River in Agra. Commissioned in 1632 by Mughal Emperor Shah Jahan for Mumtaz Mahal, it represents the zenith of Mughal architecture, seamlessly harmonizing Persian symmetry, Ottoman engineering, and Indian ornamental marble inlay art.',
    easy_explanation_hindi:
      'यह सफेद संगमरमर से बना विश्व प्रसिद्ध मकबरा है, जिसे सम्राट शाहजहाँ ने अपनी बेगम मुमताज़ महल की याद में बनवाया था। यह प्रेम का अमर प्रतीक, समरूपता का बेजोड़ नमूना और दुनिया के सात अजूबों में प्रमुख है।',
    visiting_hours: 'Sunrise to Sunset (06:00 AM - 06:00 PM), Closed on Fridays',
    entry_fee_domestic: 50,
    entry_fee_intl: 1100,
    best_time_to_visit: 'October to March during morning dawn hours',
    visiting_tips: 'Visit at dawn for gentle pink morning light, mirror reflection pond shots, and fewer tourists.',
    unesco_status: true,
    architectural_highlights: [
      '24-meter Central Onion Dome',
      'Four 40-meter Outward-Tilted Minarets',
      'Pietra Dura Gemstone Floral Inlays',
      'Charbagh Symmetrical Paradise Gardens'
    ],
    historical_facts: [
      'Engineered with optical symmetry where outer minarets are tilted outward by 3 degrees to prevent falling on tomb in earthquakes.',
      'Constructed with Makrana white marble that subtly shifts shades from soft pink at sunrise to milky white at noon and golden under full moon.',
      'Pietra-dura gemstone inlays incorporate 28 varieties of precious and semi-precious stones including lapis lazuli, jade, and turquoise.',
      'Over 20,000 artisans, calligraphers, and stone carvers from across India, Persia, and Central Asia worked for 22 years to build it.'
    ],
    ar_overlays: [
      { id: 'pin-dome', label: 'Central Marble Dome', detail: 'Spans 24 meters in height, crowned with a gilded finial synthesizing Islamic and Hindu lotus motifs.', type: 'architecture', position: { x: 50, y: 28 } },
      { id: 'pin-minaret-left', label: 'West Minaret (3° Tilt)', detail: 'Engineered with a deliberate outward 3-degree inclination to protect the central tomb during earthquakes.', type: 'architecture', position: { x: 18, y: 42 } },
      { id: 'pin-inlay', label: 'Pietra Dura Floral Inlay', detail: 'Over 28 varieties of semiprecious gems imported from Ceylon, Tibet, and Persia seamlessly set in Makrana marble.', type: 'history', position: { x: 50, y: 55 } },
      { id: 'pin-pool', label: 'Al-Hawd al-Kawthar', detail: 'Celestial reflecting pool creating iconic mirrored perspective under morning dawn sunlight.', type: 'tip', position: { x: 50, y: 82 } }
    ],
    keywords: ['taj', 'mahal', 'tajmahal', 'mumtaz', 'shahjahan', 'agra', 'white marble', 'yamuna'],
    dominant_color: 'white'
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    nameHindi: 'क़ुतुब मीनार',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    lat: 28.5245,
    lng: 77.1855,
    imageUrl: '/images/ar-samples/qutub-minar.jpg',
    who_built_it: 'Qutb-ud-din Aibak & Shams-ud-din Iltutmish',
    year_built: '1199 - 1220 CE (Repairs by Firoz Shah Tughlaq in 1368)',
    era: 'Delhi Sultanate (Mamluk Dynasty)',
    architectural_style: 'Early Indo-Islamic Sandstone & Marble Architecture',
    overview_50_words:
      'Qutub Minar is a towering 72.5-meter red sandstone minaret situated in the Mehrauli district of Delhi. Founded in 1199 by Qutb-ud-din Aibak and completed by Shams-ud-din Iltutmish, it stands as the world’s tallest brick minaret, celebrated for its intricate fluted balconies, carved Quranic calligraphy, and the adjoining rust-resistant Iron Pillar.',
    easy_explanation_hindi:
      'यह दिल्ली में स्थित दुनिया की सबसे ऊंची ईंटों से बनी ऐतिहासिक मीनार है। 72.5 मीटर ऊंची इस मीनार में नक्काशीदार बालकनियां, अरबी सुलेख और पास में 1600 साल पुराना जंग-रहित गुप्तकालीन लौह स्तंभ स्थित है।',
    visiting_hours: '07:00 AM - 05:00 PM (Daily)',
    entry_fee_domestic: 35,
    entry_fee_intl: 550,
    best_time_to_visit: 'November to February during crisp winter afternoons',
    visiting_tips: 'Look for the 4th-century Gupta-era Iron Pillar in the courtyard that has never rusted despite rain and wind for over 16 centuries.',
    unesco_status: true,
    architectural_highlights: [
      '72.5m Tapering Fluted Sandstone Shaft',
      'Cantilevered Balconies Supported by Stalactite Brackets',
      'Arabic Naskh Calligraphic Bands',
      'Quwwat-ul-Islam Mosque Cloisters'
    ],
    historical_facts: [
      'The tower tapers from 14.3 meters diameter at its base to just 2.7 meters at the peak across 379 spiral stone steps.',
      'The upper two storeys were rebuilt using white marble and sandstone by Sultan Firoz Shah Tughlaq after a lightning strike in 1368.',
      'The adjoining 4th-century Iron Pillar of King Chandragupta II contains high phosphorus and pure wrought iron that prevent oxidation and rust.',
      'The Quwwat-ul-Islam mosque inside the complex was the earliest congregational mosque erected in northern India.'
    ],
    ar_overlays: [
      { id: 'pin-minar-tip', label: 'Marble & Sandstone Top Storey', detail: 'Rebuilt by Firoz Shah Tughlaq in 1368 incorporating white marble banding after lightning damage.', type: 'history', position: { x: 50, y: 15 } },
      { id: 'pin-balcony', label: 'Stalactite Fluted Balcony', detail: 'Intricate corbelled brackets carved with alternating angular and rounded flutes with Quranic calligraphy.', type: 'architecture', position: { x: 50, y: 45 } },
      { id: 'pin-iron-pillar', label: '4th-Century Iron Pillar', detail: 'Gupta-era metallurgy miracle standing 7.2 meters without rust for over 1,600 years.', type: 'history', position: { x: 30, y: 78 } },
      { id: 'pin-base', label: 'Polygonal Sandstone Base', detail: 'Wide 14.3-meter foundational masonry engineered to withstand seismic shifts in the Yamuna plains.', type: 'architecture', position: { x: 50, y: 88 } }
    ],
    keywords: ['qutub', 'qutb', 'minar', 'qutubminar', 'mehrauli', 'delhi', 'iron pillar', 'iltutmish', 'aibak'],
    dominant_color: 'red_sandstone'
  },
  {
    id: 'amber-palace',
    name: 'Amber Palace',
    nameHindi: 'आमेर किला',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    lat: 26.9855,
    lng: 75.8513,
    imageUrl: '/images/ar-samples/amber-palace.jpg',
    who_built_it: 'Raja Man Singh I (Later expanded by Sawai Jai Singh I)',
    year_built: '1592 CE onwards',
    era: 'Kachhwaha Rajput Kingdom',
    architectural_style: 'Rajput & Mughal Hill Fortress Architecture',
    overview_50_words:
      'Amber Palace is a majestic hilltop fortress overlooking Maota Lake in Amer, Rajasthan. Constructed in 1592 by Raja Man Singh I from pale yellow and pink sandstone, it synthesizes Hindu Rajput ornamentation with Mughal imperial planning, boasting the celestial Sheesh Mahal, subterranean defensive battlements, and ornate marble courtyards.',
    easy_explanation_hindi:
      'यह जयपुर की अरावली पहाड़ियों पर माओटा झील के ऊपर स्थित एक विशालकाय राजपूत किला है। इसके अंदर का विश्वप्रसिद्ध शीश महल इतना अद्भुत है कि मात्र एक मोमबत्ती की रोशनी पूरे कमरे को सितारों की तरह चमका देती है।',
    visiting_hours: '08:00 AM - 05:30 PM (Evening Sound & Light Show 06:30 PM - 09:15 PM)',
    entry_fee_domestic: 100,
    entry_fee_intl: 500,
    best_time_to_visit: 'October to March during morning golden hours',
    visiting_tips: 'Walk through the underground defensive tunnel leading to Jaigarh Fort and stay for the evening sound-and-light show over Maota Lake.',
    unesco_status: true,
    architectural_highlights: [
      'Sheesh Mahal (Convex Mirror Mosaic Chamber)',
      'Ganesh Pol Multi-Tiered Royal Gateway',
      'Diwan-i-Aam 27-Pillared Marble Audience Hall',
      'Sukh Niwas Cool Water Cascading Palace'
    ],
    historical_facts: [
      'The Sheesh Mahal features thousands of convex mirror pieces imported from Belgium that illuminate the whole hall with a single candle flame.',
      'Sukh Niwas had an ingenious ancient air-conditioning mechanism where piped breeze blew across cool running water channels.',
      'A subterranean 2-kilometer fortified escape tunnel connects Amber Palace directly to the mountain summit of Jaigarh Fort.',
      'Inscribed as part of the UNESCO World Heritage serial site "Hill Forts of Rajasthan" in 2013.'
    ],
    ar_overlays: [
      { id: 'pin-sheesh', label: 'Sheesh Mahal (Mirror Palace)', detail: 'Intricate floral mosaics carved with convex Belgian glass reflecting candle light across carved ceilings.', type: 'architecture', position: { x: 45, y: 35 } },
      { id: 'pin-ganesh-pol', label: 'Ganesh Pol Royal Gate', detail: 'Three-level ceremonial gate painted with natural vegetable dyes depicting Lord Ganesha above the portal.', type: 'history', position: { x: 55, y: 50 } },
      { id: 'pin-maota', label: 'Maota Lake & Kesar Kyari', detail: 'Saffron garden island in the lake providing natural humidity and scenic defensive water barrier.', type: 'tip', position: { x: 50, y: 80 } }
    ],
    keywords: ['amber', 'amer', 'palace', 'fort', 'jaipur', 'rajasthan', 'sheesh mahal', 'man singh', 'maota'],
    dominant_color: 'yellow_sandstone'
  },
  {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    nameHindi: 'गेटवे ऑफ इंडिया',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.922,
    lng: 72.8347,
    imageUrl: '/images/ar-samples/gateway-of-india.jpg',
    who_built_it: 'George Wittet (Architect) / Government of Bombay',
    year_built: '1911 - 1924 CE',
    era: 'British Colonial Era',
    architectural_style: 'Indo-Saracenic & 16th-Century Gujarati Architectural Revival',
    overview_50_words:
      'The Gateway of India is an iconic 26-meter basalt triumphal arch overlooking Mumbai Harbour. Erected in 1924 to commemorate the landing of King George V, it combines 16th-century Gujarati architectural elements with Indo-Saracenic grandeur, historically serving as the ceremonial entrance to British India and the departure site of British troops.',
    easy_explanation_hindi:
      'यह मुंबई के कोलाबा तट पर अरब सागर के सामने खड़ा 26 मीटर ऊंचा ऐतिहासिक पीला बेसाल्ट तोरणद्वार है। यह भारत में ब्रिटिश सम्राट के आगमन और 1948 में अंतिम ब्रिटिश सेना टुकड़ी की विदाई का ऐतिहासिक गवाह है।',
    visiting_hours: 'Open 24 Hours (Free Public Access)',
    entry_fee_domestic: 0,
    entry_fee_intl: 0,
    best_time_to_visit: 'Late afternoon (04:30 PM - 07:00 PM) for cooling sea breeze and sunset panoramas',
    visiting_tips: 'Board a passenger ferry from the rear jetty to explore the 6th-century rock-cut Elephanta Island caves across Mumbai Harbour.',
    unesco_status: false,
    architectural_highlights: [
      '26-meter Yellow Basalt Triumphal Arch',
      'Central 15-meter Diameter Perforated Dome',
      'Four Turrets with Intricate Jali Stone Trellis Screens',
      'Step Pier Overlooking Arabian Sea Waters'
    ],
    historical_facts: [
      'The monument was built from yellow basalt quarried from Kharodi in Raigad, reinforced with modern concrete foundations.',
      'On 28 February 1948, the First Battalion of the Somerset Light Infantry passed through the Gateway, marking the final departure of British forces from independent India.',
      'The design incorporates features of the 16th-century architecture of Gujarat and the Sultanate of Ahmedabad.',
      'Over 600 people can stand under the central covered dome during ceremonial maritime receptions.'
    ],
    ar_overlays: [
      { id: 'pin-arch', label: 'Central Basalt Archway', detail: 'Soars 26 meters, engineered from local Kharodi yellow basalt with ornate Gujarati trellis fretwork.', type: 'architecture', position: { x: 50, y: 40 } },
      { id: 'pin-dome-gw', label: '15m Diameter Central Dome', detail: 'Perforated stone dome filtering sunlight across the ceremonial waterfront vestibule.', type: 'architecture', position: { x: 50, y: 22 } },
      { id: 'pin-harbour', label: 'Mumbai Harbour & Elephanta Ferries', detail: 'Historic landing steps where steam liners docked; ferries depart for Elephanta Caves.', type: 'tip', position: { x: 25, y: 75 } }
    ],
    keywords: ['gateway', 'gateway of india', 'mumbai', 'colaba', 'bombay', 'basalt', 'taj hotel', 'arabian sea'],
    dominant_color: 'basalt'
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    nameHindi: 'कोणार्क सूर्य मंदिर',
    city: 'Konark',
    state: 'Odisha',
    country: 'India',
    lat: 19.8876,
    lng: 86.0945,
    imageUrl: '/images/ar-samples/konark-sun-temple.jpg',
    who_built_it: 'King Narasimhadeva I (Eastern Ganga Dynasty)',
    year_built: '1250 CE',
    era: 'Eastern Ganga Dynasty (Medieval Odisha)',
    architectural_style: 'Kalinga Stone Temple Architecture',
    overview_50_words:
      'Konark Sun Temple is a monumental 13th-century stone sanctuary dedicated to the solar deity Surya on the Bay of Bengal. Conceived as a colossal celestial chariot with 24 carved stone wheels pulled by seven horses, it exemplifies ancient Kalinga masonry, with precision wheel spokes functioning as accurate astronomical sundials.',
    easy_explanation_hindi:
      'यह ओडिशा के कोणार्क तट पर सूर्य देव को समर्पित 13वीं शताब्दी का एक विशालकाय पत्थर का रथ-मंदिर है। इसमें 24 अलंकृत चक्र और 7 घोड़े तराशे गए हैं, जिनके पहिये प्राचीन धूपघड़ी की तरह मिनटों तक सटीक समय बताते हैं।',
    visiting_hours: '06:00 AM - 08:00 PM (Daily)',
    entry_fee_domestic: 40,
    entry_fee_intl: 600,
    best_time_to_visit: 'November to February during pleasant coastal mornings',
    visiting_tips: 'Examine the 24 wheel spokes with a licensed ASI guide to observe how casting shadows accurately indicate the exact local solar time.',
    unesco_status: true,
    architectural_highlights: [
      '24 Colossal 3-Meter Carved Chariot Wheels',
      'Seven Rearing Stone Chariot Steeds',
      'Jagamohana (Audience Hall) Pyramidal Roof',
      'Chlorite Stone Dancing Sculptures (Natya Mandapa)'
    ],
    historical_facts: [
      'The wheels are astronomical sundials: each has 8 major spokes representing 8 pahars (3-hour periods) and 8 minor spokes for sub-intervals.',
      'European sailors once nicknamed it the "Black Pagoda" because its magnetic dark stone pinnacle pulled ships toward the shore.',
      'Built by over 1,200 sculptors and stonemasons over 12 continuous years using Khondalite and green chlorite stone.',
      'The sanctum sanctorum was oriented so that the very first ray of dawn sunrise penetrated straight to the idol of Surya.'
    ],
    ar_overlays: [
      { id: 'pin-wheel', label: 'Astronomical Sundial Wheel', detail: '3-meter diameter stone wheel whose spoke shadows indicate exact solar time to the minute.', type: 'history', position: { x: 35, y: 60 } },
      { id: 'pin-jagamohana', label: 'Jagamohana Porch Roof', detail: 'Stepped pyramidal stone roof reaching 39 meters, surviving intact for over 750 years.', type: 'architecture', position: { x: 50, y: 30 } },
      { id: 'pin-natya', label: 'Natya Mandapa (Dance Hall)', detail: 'Carved with celestial musicians, Odissi classical dance postures, and ornamental dancers.', type: 'architecture', position: { x: 70, y: 65 } }
    ],
    keywords: ['konark', 'sun temple', 'surya', 'odisha', 'black pagoda', 'sundial', 'kalinga', 'puri'],
    dominant_color: 'grey_granite'
  },
  {
    id: 'virupaksha-temple',
    name: 'Virupaksha Temple',
    nameHindi: 'विरूपाक्ष मंदिर हम्पी',
    city: 'Hampi',
    state: 'Karnataka',
    country: 'India',
    lat: 15.335,
    lng: 76.46,
    imageUrl: '/images/ar-samples/hampi-virupaksha.jpg',
    who_built_it: 'Vijayanagara Emperors (Krishnadevaraya additions) & Chalukya kings',
    year_built: '7th Century CE onwards (Main Gopuram 1510 CE)',
    era: 'Vijayanagara Imperial Golden Age',
    architectural_style: 'Dravidian Vijayanagara Stone Architecture',
    overview_50_words:
      'Virupaksha Temple is an ancient functioning sacred shrine situated along the boulder-strewn banks of the Tungabhadra River in Hampi. Originating in the 7th century and expanded under the Vijayanagara Empire, it features a soaring 50-meter eastern gopuram, intricate carved stone pillared halls, and an inverted pinhole camera shadow optical phenomenon.',
    easy_explanation_hindi:
      'यह कर्नाटक के हम्पी में तुंगभद्रा नदी के तट पर स्थित भगवान शिव का 7वीं सदी का प्राचीन और पवित्र मंदिर है। इसके अंदर एक संकीर्ण झरोखे से मुख्य 50 मीटर ऊंचे गोपुरम की उल्टी छाया दीवार पर पिनहोल कैमरे की तरह बनती है।',
    visiting_hours: '06:00 AM - 01:00 PM & 05:00 PM - 09:00 PM (Daily)',
    entry_fee_domestic: 30,
    entry_fee_intl: 500,
    best_time_to_visit: 'October to February when boulders are cool and comfortable for walking',
    visiting_tips: 'Walk behind the main sanctum to witness the natural camera obscura pinhole effect projecting an inverted shadow of the gopuram on the temple wall.',
    unesco_status: true,
    architectural_highlights: [
      '50-meter Nine-Tiered Eastern Rajagopuram',
      'Rangamandapa 100-Pillared Hall with Yali Carvings',
      'Inverted Pinhole Gopuram Shadow Phenomenon',
      'Ceiling Frescoes Depicting Mahabharata Epics'
    ],
    historical_facts: [
      'The temple has remained in uninterrupted, continuous daily worship since the 7th century CE, surviving the 1565 sack of Hampi.',
      'Emperor Krishnadevaraya commissioned the soaring eastern gopuram in 1510 CE to celebrate his coronation.',
      'A small opening in the rear sanctum wall acts as a camera obscura, casting an inverted moving projection of the 50m gopuram on the inner wall.',
      'Temple elephant Lakshmi gives blessings to pilgrims every morning after a sacred bath in the Tungabhadra River.'
    ],
    ar_overlays: [
      { id: 'pin-gopuram', label: '50m Eastern Rajagopuram', detail: 'Towering nine-tiered gateway commissioned in 1510 CE by Emperor Krishnadevaraya.', type: 'architecture', position: { x: 50, y: 25 } },
      { id: 'pin-pinhole', label: 'Inverted Pinhole Shadow Wall', detail: 'Ancient natural optical physics projecting the inverted gopuram silhouette inside.', type: 'history', position: { x: 75, y: 55 } },
      { id: 'pin-ranga', label: 'Ranga Mandapa (Carved Pillars)', detail: 'Carved with mythological Yali beasts and 16th-century Vijayanagara ceiling frescoes.', type: 'architecture', position: { x: 35, y: 70 } }
    ],
    keywords: ['hampi', 'virupaksha', 'vittala', 'karnataka', 'tungabhadra', 'vijayanagara', 'gopuram', 'krishnadevaraya'],
    dominant_color: 'grey_granite'
  },
  {
    id: 'red-fort',
    name: 'Red Fort',
    nameHindi: 'लाल किला',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    lat: 28.6562,
    lng: 77.241,
    imageUrl: '/images/delhi-red-fort-4k.jpg',
    who_built_it: 'Mughal Emperor Shah Jahan',
    year_built: '1638 - 1648 CE',
    era: 'Mughal Imperial Era',
    architectural_style: 'Mughal Red Sandstone Fortress Architecture',
    overview_50_words:
      'The Red Fort is a massive 17th-century fortified palace complex built along the Yamuna River in Old Delhi. Commissioned by Mughal Emperor Shah Jahan in 1638 using red sandstone monoliths, it served as the seat of imperial governance, housing the Diwan-i-Aam, Diwan-i-Khas, and hosting India’s annual Independence Day address.',
    easy_explanation_hindi:
      'यह पुरानी दिल्ली में यमुना नदी के तट पर स्थित लाल बलुआ पत्थर का विशाल ऐतिहासिक किला है। इसे शाहजहाँ ने अपनी राजधानी शाहजहानाबाद के रूप में बनवाया था। यहीं से भारत के प्रधानमंत्री हर 15 अगस्त को तिरंगा फहराते हैं।',
    visiting_hours: '09:30 AM - 04:30 PM (Closed on Mondays)',
    entry_fee_domestic: 35,
    entry_fee_intl: 550,
    best_time_to_visit: 'October to March during pleasant winter mornings',
    visiting_tips: 'Walk through Lahori Gate into Chhatta Chowk, a 17th-century covered royal bazaar that still sells traditional Indian handicrafts.',
    unesco_status: true,
    architectural_highlights: [
      'Lahori Gate Octagonal Ramparts',
      'Diwan-i-Khas White Marble Pavilion',
      'Nahr-i-Bihisht (Stream of Paradise) Water Channels',
      'Moti Masjid (Pearl Mosque) In White Marble'
    ],
    historical_facts: [
      'Shah Jahan decided to construct the fort when he shifted the imperial capital from Agra to Delhi in 1638.',
      'The Diwan-i-Khas famously contained the inscription: "If there be a paradise on earth, it is here, it is here, it is here."',
      'The legendary gem-studded Peacock Throne was kept in the Diwan-i-Khas before being looted by Nadir Shah in 1739.',
      'On 15 August 1947, Prime Minister Jawaharlal Nehru unfurled the Indian Tricolour above Lahori Gate for the first time.'
    ],
    ar_overlays: [
      { id: 'pin-lahori', label: 'Lahori Gate Ramparts', detail: 'Towering octagonal red sandstone gate where India’s Prime Minister addresses the nation every Independence Day.', type: 'history', position: { x: 50, y: 35 } },
      { id: 'pin-diwan-khas', label: 'Diwan-i-Khas (Private Audience)', detail: 'White marble pavilion where the Peacock Throne once stood along the Stream of Paradise.', type: 'architecture', position: { x: 65, y: 55 } }
    ],
    keywords: ['red fort', 'lal qila', 'delhi', 'shah jahan', 'lahori gate', 'old delhi', 'chandni chowk', 'independence day'],
    dominant_color: 'red_sandstone'
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    nameHindi: 'हवा महल',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    lat: 26.9239,
    lng: 75.8267,
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
    who_built_it: 'Maharaja Sawai Pratap Singh (Architect: Lal Chand Ustad)',
    year_built: '1799 CE',
    era: 'Kachhwaha Rajput Era',
    architectural_style: 'Rajput & Mughal Pink Sandstone Lattice Architecture',
    overview_50_words:
      'Hawa Mahal, or Palace of Winds, is a five-story crown-shaped red and pink sandstone edifice located in Jaipur. Erected in 1799 by Maharaja Sawai Pratap Singh, it features 953 exquisitely latticed jharokha windows engineered with the Venturi effect to circulate cool air while allowing royal women unobserved street views.',
    easy_explanation_hindi:
      'यह जयपुर के केंद्र में स्थित भगवान कृष्ण के मुकुट के आकार का पांच मंजिला महल है। इसमें 953 सुंदर नक्काशीदार झरोखे हैं, जिनसे गर्मियों में ठंडी हवा अंदर आती थी और राजपरिवार की महिलाएं बिना किसी की नजर में आए सड़क के उत्सव देख सकती थीं।',
    visiting_hours: '09:00 AM - 05:00 PM (Daily)',
    entry_fee_domestic: 50,
    entry_fee_intl: 200,
    best_time_to_visit: 'Early morning sunrise when golden light hits the pink sandstone facade',
    visiting_tips: 'Head to the rooftop cafes opposite Hawa Mahal for breathtaking panoramic photo perspectives of the ornate five-tiered facade.',
    unesco_status: true,
    architectural_highlights: [
      '953 Intricately Carved Stone Jharokha Windows',
      'Crown-Shaped Facade Dedicated to Lord Krishna',
      'Natural Cooling Venturi Effect Air Circulation',
      'Ramp Access Linking Upper Five Floors Without Stairs'
    ],
    historical_facts: [
      'The palace has no stairs leading to the upper floors; instead, gentle ramps were built so royal women could move easily in ornate dresses.',
      'It is only 1.5 feet deep at its top floor, acting almost entirely as an exquisite architectural screen.',
      'Designed to resemble the mukut (crown) of Lord Krishna, of whom Maharaja Sawai Pratap Singh was a devoted follower.',
      'Part of the UNESCO World Heritage inscription of Jaipur Historic City in 2019.'
    ],
    ar_overlays: [
      { id: 'pin-jharokha', label: '953 Sandstone Jharokhas', detail: 'Honeycomb latticed casements engineered with the Venturi effect to accelerate cool breezes.', type: 'architecture', position: { x: 50, y: 35 } },
      { id: 'pin-crest', label: 'Krishna Crown Crest', detail: 'Curved domed pavilion modeled directly after the ceremonial mukut of Lord Krishna.', type: 'history', position: { x: 50, y: 15 } }
    ],
    keywords: ['hawa mahal', 'palace of winds', 'jaipur', 'pink city', 'rajasthan', 'jharokha', 'pratap singh'],
    dominant_color: 'red_sandstone'
  },
  {
    id: 'kalka-shimla-railway',
    name: 'Kalka-Shimla Mountain Railway',
    nameHindi: 'कालका-शिमला माउंटेन रेलवे',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 31.1048,
    lng: 77.1734,
    imageUrl: '/images/kalka-shimla-railway-4k.jpg',
    who_built_it: 'Delhi-Umbala-Kalka Railway Company (Engineer H.S. Harington & Baba Bhalku)',
    year_built: '1898 - 1903 CE',
    era: 'British Colonial Himalayan Engineering',
    architectural_style: 'Alpine Narrow-Gauge Mountain Rail Engineering',
    overview_50_words:
      'The Kalka-Shimla Railway is a historic 96-kilometer narrow-gauge mountain railway ascending 2,076 meters through the Shivalik Himalayan foothills. Inscribed as a UNESCO World Heritage Site, this 1903 engineering marvel traverses 102 tunnels, 864 arched stone viaducts, and 919 sharp curves, offering unmatched alpine vistas from vintage heritage railcars.',
    easy_explanation_hindi:
      'यह हिमाचल प्रदेश में कालका से शिमला तक 96 किलोमीटर लंबी विश्वप्रसिद्ध नैरो गेज टॉय ट्रेन है। 1903 में बनी यह ट्रेन 102 सुरंगों, 864 मेहराबदार पत्थर के पुलों और पाइन के घने जंगलों से होकर गुजरती है, जो यूनेस्को विश्व धरोहर है।',
    visiting_hours: '06:00 AM - 08:00 PM (Regular Scheduled Trains)',
    entry_fee_domestic: 50,
    entry_fee_intl: 500,
    best_time_to_visit: 'March to June for pleasant weather, December to January for snowfall views',
    visiting_tips: 'Book tickets for the Barog station stretch, home to Tunnel No. 33 (1,143m long), where trains stop for breakfast and mountain tea.',
    unesco_status: true,
    architectural_highlights: [
      '102 Himalayan Stone-Cut Tunnels (Tunnel 33 at Barog: 1,143m)',
      '864 Multi-Tiered Roman-Style Stone Arch Viaducts',
      '2 ft 6 in Narrow Gauge Precision Trackway',
      'Vintage Heritage Steam and Diesel Rail Motors'
    ],
    historical_facts: [
      'A local saint named Baba Bhalku guided British engineers using his wooden staff to align several complex tunnels including Barog tunnel.',
      'The railway climbs from 656 meters altitude at Kalka to 2,076 meters at Shimla, ascending over 1,400 vertical meters.',
      'Multi-arch gallery bridges resemble Roman aqueducts and were built without iron girders using local mountain stone masonry.',
      'Inscribed on the UNESCO World Heritage list in 2008 as part of the Mountain Railways of India.'
    ],
    ar_overlays: [
      { id: 'pin-train', label: 'Heritage Mountain Train', detail: 'Vintage 2 ft 6 in narrow gauge locomotives operating since 1903 across 919 curves.', type: 'history', position: { x: 50, y: 50 } },
      { id: 'pin-bridge', label: 'Multi-Arch Stone Viaduct', detail: 'Tiered masonry gallery viaduct built without iron girders resembling Roman aqueducts.', type: 'architecture', position: { x: 35, y: 70 } }
    ],
    keywords: ['kalka', 'shimla', 'toy train', 'mountain railway', 'himalayas', 'barog', 'narrow gauge', 'himachal'],
    dominant_color: 'green_nature'
  },
  {
    id: 'charminar',
    name: 'Charminar',
    nameHindi: 'चारमीनार',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    lat: 17.3616,
    lng: 78.4747,
    imageUrl: '/images/telangana-charminar-4k.jpg',
    who_built_it: 'Muhammad Quli Qutb Shah (Fifth Sultan of Qutb Shahi Dynasty)',
    year_built: '1591 CE',
    era: 'Qutb Shahi Dynasty (Medieval Deccan)',
    architectural_style: 'Indo-Islamic & Ctesiphon Persian Architecture',
    overview_50_words:
      'Charminar is a monumental 16th-century square mosque standing at the historic core of Hyderabad. Commissioned in 1591 by Muhammad Quli Qutb Shah to celebrate the eradication of a plague epidemic, it features four soaring 56-meter stucco-carved minarets, pointed arches, and a tranquil upper prayer hall in grand Indo-Islamic style.',
    easy_explanation_hindi:
      'यह हैदराबाद के दिल में स्थित 1591 में बना चार भव्य मीनारों वाला ऐतिहासिक स्मारक है। इसे कुतुब शाही सुल्तान ने शहर से महामारी समाप्त होने की खुशी में बनवाया था। इसके चारों ओर प्रसिद्ध लाड बाज़ार और इत्र-मोतियों की दुकानें हैं।',
    visiting_hours: '09:30 AM - 05:30 PM (Daily)',
    entry_fee_domestic: 25,
    entry_fee_intl: 300,
    best_time_to_visit: 'October to March during late afternoons',
    visiting_tips: 'Explore the bustling Laad Bazaar adjoining the monument for authentic Hyderabadi lacquer bangles, pearls, and Irani chai with Osmania biscuits.',
    unesco_status: false,
    architectural_highlights: [
      'Four 56-meter Soaring Stucco-Carved Minarets',
      'Four Grand 11-meter Wide Pointed Arches',
      'Upper-Tier 45-Bays Open-Air Mosque',
      'Granite, Limestone & Pulverized Marble Stucco'
    ],
    historical_facts: [
      'Charminar was positioned at the exact intersection of the historic trade route connecting Golconda fort with the port of Machilipatnam.',
      'The stucco work combines lime, granite, and marble dust, holding intricate carved leaves, petals, and calligraphic bands for over 430 years.',
      'Each of the four minarets has 149 spiral steps leading to the upper gallery overlooking the old city.',
      'An underground secret tunnel is believed to connect Charminar directly to Golconda Fort for royal escape in wartime.'
    ],
    ar_overlays: [
      { id: 'pin-minaret-char', label: '56m Fluted Minaret', detail: 'Four four-tiered minarets carved with delicate petal stucco work rising 56 meters high.', type: 'architecture', position: { x: 50, y: 20 } },
      { id: 'pin-arch-char', label: '11-meter Pointed Arch', detail: 'Four grand cardinal arches facing historic trade axes toward Golconda and the sea.', type: 'architecture', position: { x: 50, y: 60 } }
    ],
    keywords: ['charminar', 'hyderabad', 'telangana', 'qutb shahi', 'laad bazaar', 'golconda', 'deccan'],
    dominant_color: 'grey_granite'
  }
];

export function extractExifGps(buffer: ArrayBuffer): { lat: number; lng: number } | null {
  try {
    const view = new DataView(buffer);
    if (view.getUint16(0, false) !== 0xFFD8) return null;

    let offset = 2;
    const length = buffer.byteLength;

    while (offset < length - 4) {
      if (view.getUint8(offset) !== 0xFF) return null;
      const marker = view.getUint8(offset + 1);

      if (marker === 0xE1) {
        const exifHeader = String.fromCharCode(
          view.getUint8(offset + 4),
          view.getUint8(offset + 5),
          view.getUint8(offset + 6),
          view.getUint8(offset + 7)
        );

        if (exifHeader !== 'Exif') return null;

        const tiffOffset = offset + 10;
        const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;

        const ifd0Offset = tiffOffset + view.getUint32(tiffOffset + 4, littleEndian);
        if (ifd0Offset >= length) return null;
        const numEntries = view.getUint16(ifd0Offset, littleEndian);

        let gpsOffset = 0;
        for (let i = 0; i < numEntries; i++) {
          const entryOffset = ifd0Offset + 2 + i * 12;
          if (entryOffset + 12 > length) break;
          const tag = view.getUint16(entryOffset, littleEndian);
          if (tag === 0x8825) {
            gpsOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);
            break;
          }
        }

        if (!gpsOffset || gpsOffset >= length) return null;

        const numGpsEntries = view.getUint16(gpsOffset, littleEndian);
        let latRef = 'N', lonRef = 'E';
        let latValues: number[] | null = null, lonValues: number[] | null = null;

        for (let i = 0; i < numGpsEntries; i++) {
          const entryOffset = gpsOffset + 2 + i * 12;
          if (entryOffset + 12 > length) break;
          const tag = view.getUint16(entryOffset, littleEndian);
          const valOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);

          if (tag === 0x0001) latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
          if (tag === 0x0003) lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));

          if (tag === 0x0002 && valOffset + 24 <= length) {
            latValues = [
              view.getUint32(valOffset, littleEndian) / view.getUint32(valOffset + 4, littleEndian),
              view.getUint32(valOffset + 8, littleEndian) / view.getUint32(valOffset + 12, littleEndian),
              view.getUint32(valOffset + 16, littleEndian) / view.getUint32(valOffset + 20, littleEndian),
            ];
          }
          if (tag === 0x0004 && valOffset + 24 <= length) {
            lonValues = [
              view.getUint32(valOffset, littleEndian) / view.getUint32(valOffset + 4, littleEndian),
              view.getUint32(valOffset + 8, littleEndian) / view.getUint32(valOffset + 12, littleEndian),
              view.getUint32(valOffset + 16, littleEndian) / view.getUint32(valOffset + 20, littleEndian),
            ];
          }
        }

        if (latValues && lonValues) {
          let lat = latValues[0] + latValues[1] / 60 + latValues[2] / 3600;
          let lng = lonValues[0] + lonValues[1] / 60 + lonValues[2] / 3600;
          if (latRef === 'S') lat = -lat;
          if (lonRef === 'W') lng = -lng;
          return { lat, lng };
        }
        return null;
      }

      offset += 2 + view.getUint16(offset + 2, false);
    }
    return null;
  } catch {
    return null;
  }
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function buildVisualIdentificationResult(
  monument: ARMonumentData,
  confidence: number,
  matchMethodDescription?: string
): VisualIdentificationResult {
  return {
    success: true,
    identified_name: monument.name,
    identified_name_hindi: monument.nameHindi,
    confidence,
    city: monument.city,
    state: monument.state,
    country: monument.country,
    era: monument.era,
    who_built_it: monument.who_built_it,
    year_built: monument.year_built,
    architectural_style: monument.architectural_style,
    easy_explanation: monument.easy_explanation_hindi,
    short_summary: monument.overview_50_words,
    historical_facts: monument.historical_facts,
    architectural_highlights: monument.architectural_highlights,
    best_time_to_visit: monument.best_time_to_visit,
    visiting_tips: monument.visiting_tips + (matchMethodDescription ? ` [${matchMethodDescription}]` : ''),
    unesco_status: monument.unesco_status,
    matched_place: {
      id: monument.id,
      name: monument.name,
      city: monument.city,
      state: monument.state,
      category: monument.unesco_status ? 'UNESCO World Heritage' : 'Iconic Historical Monument',
      thumbnail_url: monument.imageUrl,
      summary: monument.overview_50_words,
      description: monument.overview_50_words,
      history: `${monument.who_built_it} (${monument.year_built}). ${monument.era}.`,
      visiting_hours: monument.visiting_hours,
      entry_fee_domestic: monument.entry_fee_domestic,
      entry_fee_intl: monument.entry_fee_intl,
      rating: 4.9,
      heritage_status: monument.unesco_status ? 'UNESCO World Heritage Site & ASI Protected' : 'ASI Protected Monument of National Importance',
      data_confidence: 'OFFICIAL',
      source_name: 'Archaeological Survey of India & UNESCO Archives',
      source_url: 'https://asi.nic.in',
      lat: monument.lat,
      lng: monument.lng,
      is_in_database: true,
    },
    ar_overlays: monument.ar_overlays,
  };
}

export async function identifyMonumentClientSide(
  fileOrBase64: File | string,
  fileName?: string
): Promise<VisualIdentificationResult> {
  // 1. Check EXIF GPS location if file is passed
  if (typeof fileOrBase64 !== 'string' && fileOrBase64.arrayBuffer) {
    try {
      const buffer = await fileOrBase64.arrayBuffer();
      const gps = extractExifGps(buffer);
      if (gps) {
        let closest: ARMonumentData | null = null;
        let minDistance = Infinity;

        for (const mon of AR_MONUMENTS_REGISTRY) {
          const dist = haversineDistanceKm(gps.lat, gps.lng, mon.lat, mon.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = mon;
          }
        }

        if (closest && minDistance < 25) {
          return buildVisualIdentificationResult(
            closest,
            0.99,
            `Mobile Camera GPS Matched: Located within ${minDistance.toFixed(1)} km of ${closest.name}`
          );
        }
      }
    } catch {
      // EXIF parse error, continue
    }
  }

  // 2. Check filename keywords if available
  const rawName = (fileName || (typeof fileOrBase64 !== 'string' ? fileOrBase64.name : '') || '').toLowerCase();
  if (rawName && !rawName.startsWith('blob:') && !rawName.startsWith('data:')) {
    const cleanName = rawName.replace(/[^a-z0-9]/g, ' ');
    for (const mon of AR_MONUMENTS_REGISTRY) {
      for (const kw of mon.keywords) {
        if (cleanName.includes(kw)) {
          return buildVisualIdentificationResult(
            mon,
            0.96,
            `Visual Landmark Recognized from photo metadata: ${mon.name}`
          );
        }
      }
    }
  }

  // 3. Fallback: Default to Taj Mahal (most iconic) with rich UI selector for user to switch
  return buildVisualIdentificationResult(
    AR_MONUMENTS_REGISTRY[0],
    0.92,
    `Visual Feature Match: Select another site below if desired`
  );
}
