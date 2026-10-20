export interface AndhraPradeshCityGuideEntry {
  id: string;
  name: string;
  alternateName?: string;
  imageSuggestion: string;
  overview: string;
  history: string;
  famousFor: string[];
  interestingPart: string;
  bestTime: string;
  stayOptions: string;
}

/**
 * Editorial guide copy supplied for Virasat. These notes are not live travel
 * inventory or independently verified facts; confirm official details before
 * presenting them as authoritative or using them for bookings.
 */
export const ANDHRA_PRADESH_CITY_GUIDE: AndhraPradeshCityGuideEntry[] = [
  {
    id: 'amaravati',
    name: 'Amaravati',
    imageSuggestion: 'Amaravati Mahastupa or Amaralingeswara Temple beside the Krishna River',
    overview: 'A heritage town on the banks of the Krishna River, known for its Buddhist past and sacred sites. The wider Amaravati capital region continues to develop.',
    history: 'Ancient Dhanyakataka was an important Buddhist centre during the Satavahana period. Amaravati is remembered for its Buddhist art and the Mahastupa.',
    famousFor: ['Amaravati Mahastupa', 'Amaralingeswara Swamy Temple', 'Archaeological Museum'],
    interestingPart: 'Carved marble panels associated with Amaravati Buddhist art are now held in collections in India and abroad, including Chennai and London.',
    bestTime: 'October to February',
    stayOptions: 'Stay options in Amaravati may be limited. Vijayawada or Guntur are nearby bases; check current travel time and accommodation availability before booking.',
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    alternateName: 'Vizag',
    imageSuggestion: 'RK Beach at sunrise or the city view from Kailasagiri',
    overview: 'A major coastal city where beaches meet the Eastern Ghats, with a long maritime history and a lively waterfront.',
    history: 'Visakhapatnam developed as a port city and has been shaped by successive regional and European maritime influences.',
    famousFor: ['RK Beach', 'Kailasagiri', 'INS Kurusura Submarine Museum', 'Simhachalam Temple', 'Rushikonda and Yarada beaches'],
    interestingPart: 'The city can be used as a base for trips towards Araku Valley and Borra Caves. Sunrise walks and coastal food are popular experiences.',
    bestTime: 'October to March',
    stayOptions: 'The supplied guide names Novotel Visakhapatnam Varun Beach, The Gateway Hotel Beach Road, Radisson Blu, and The Park. Treat these as unverified suggestions and check current operation, location, rates, and availability directly.',
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    imageSuggestion: 'Kanaka Durga Temple or Prakasam Barrage in the evening',
    overview: 'A busy city on the Krishna River and a major transport and pilgrimage hub in Andhra Pradesh.',
    history: 'Local traditions connect the city with the story of Arjuna. The surrounding hills also preserve historic rock-cut sites.',
    famousFor: ['Kanaka Durga Temple', 'Prakasam Barrage', 'Bhavani Island', 'Undavalli Caves', 'Kondapalli Fort and toys'],
    interestingPart: 'Undavalli is known for multi-level rock-cut cave architecture. Andhra meals, gongura and pickles are part of the city’s food identity.',
    bestTime: 'October to February; expect larger crowds around Dussehra at the temple.',
    stayOptions: 'The supplied guide names Novotel Vijayawada Varun, Fortune Murali Park, and Ilapuram. Verify current hotel names, operation, rates, and availability before booking.',
  },
  {
    id: 'tirupati',
    name: 'Tirupati and Tirumala',
    imageSuggestion: 'Tirumala Venkateswara Temple gopuram, photographed from an approved public viewpoint',
    overview: 'A major pilgrimage destination centred on the Venkateswara Temple in the Tirumala hills.',
    history: 'The temple complex has received patronage across several historical periods, including from Pallava, Chola, and Vijayanagara rulers.',
    famousFor: ['Sri Venkateswara Temple', 'Tirupati laddu prasadam', 'Sri Padmavathi Temple at Tiruchanoor', 'Kapila Theertham', 'Chandragiri Fort', 'Nearby Sri Kalahasti'],
    interestingPart: 'Darshan arrangements and visitor rules are managed by TTD and can change. Check the official TTD portal for current booking instructions; the laddu has a Geographical Indication tag.',
    bestTime: 'September to February; major festival periods can be very busy.',
    stayOptions: 'The supplied guide names Taj Tirupati, Fortune Select Grand Ridge, Marasa Sarovar Premiere, and TTD guest houses. Verify current operation and book through official hotel or TTD channels.',
  },
  {
    id: 'rajahmundry',
    name: 'Rajahmundry',
    alternateName: 'Rajamahendravaram',
    imageSuggestion: 'Godavari Arch Bridge or Dowleswaram Barrage',
    overview: 'A cultural city on the Godavari River, often used as a base for exploring the river region.',
    history: 'Rajahmundry was an important centre under the Eastern Chalukyas. Telugu literary tradition closely associates the city with Adikavi Nannaya.',
    famousFor: ['Godavari ghats', 'Dowleswaram Barrage', 'Godavari Arch Bridge', 'Pushkar Ghat', 'Papikondalu river journeys'],
    interestingPart: 'Godavari Pushkaralu is observed on a twelve-year cycle. River trips to Papikondalu depend on current operator schedules, water conditions, and permissions.',
    bestTime: 'October to February; confirm river and boat conditions before travel.',
    stayOptions: 'The supplied guide names Hotel Anand Regency and Quality Inn Gateway, along with other local hotels. Verify current property details, rates, and availability directly.',
  },
  {
    id: 'srisailam',
    name: 'Srisailam',
    imageSuggestion: 'Srisailam Temple or a viewpoint over Srisailam Dam and the Krishna valley',
    overview: 'A pilgrimage town set among the Nallamala hills beside the Krishna River.',
    history: 'Srisailam is an ancient pilgrimage centre whose temple complex received patronage and construction support across historical periods, including the Vijayanagara period.',
    famousFor: ['Mallikarjuna Jyotirlinga Temple', 'Bhramaramba Temple', 'Srisailam Dam', 'Nagarjunasagar–Srisailam Tiger Reserve'],
    interestingPart: 'The Mallikarjuna shrine is revered as a Jyotirlinga and the Bhramaramba shrine as a Shakti Peetha. Forest and reservoir access is subject to current local rules.',
    bestTime: 'October to February; Maha Shivaratri is a very busy period.',
    stayOptions: 'The supplied guide suggests APTDC Haritha Resort and temple-trust guest houses. Confirm current operation, booking channels, and forest-area rules before travelling.',
  },
  {
    id: 'lepakshi',
    name: 'Lepakshi',
    imageSuggestion: 'Veerabhadra Temple Nandi or the temple’s celebrated hanging pillar',
    overview: 'A small settlement known for its Vijayanagara-period temple art and architecture.',
    history: 'The Veerabhadra Temple dates to the 16th century and is associated in local accounts with Virupanna and Viranna.',
    famousFor: ['Veerabhadra Temple', 'Monolithic Nandi', 'Hanging Pillar', 'Painted ceilings', 'Kalyana Mandapa'],
    interestingPart: 'The temple is known for a pillar that appears to hang slightly above the floor and for a partly unfinished Kalyana Mandapa. Do not touch protected fabric or obstruct worshippers.',
    bestTime: 'October to February; summer afternoons can be very hot.',
    stayOptions: 'The supplied guide says stay options in Lepakshi are limited and suggests Hindupur or Puttaparthi as bases. Check current routes and lodging availability.',
  },
  {
    id: 'araku-valley',
    name: 'Araku Valley',
    imageSuggestion: 'Coffee plantations or a valley view from the Visakhapatnam–Araku train',
    overview: 'A hill valley in the Eastern Ghats, around 110–115 km from Visakhapatnam by the supplied estimate.',
    history: 'The wider region is home to Adivasi communities with distinct living cultures. Visits should be respectful and follow community guidance.',
    famousFor: ['Coffee plantations', 'Tribal Museum', 'Borra Caves', 'Padmapuram Gardens', 'Scenic rail journey from Visakhapatnam'],
    interestingPart: 'The train journey passes through tunnels and mountain scenery. Dhimsa dance is a living cultural tradition; attend only community-approved performances.',
    bestTime: 'October to February. Monsoon greenery is attractive, but road and trail conditions can become difficult.',
    stayOptions: 'The supplied guide suggests APTDC Haritha Valley Resort and private homestays or resorts. Verify availability and choose community-respectful stays.',
  },
  {
    id: 'kurnool',
    name: 'Kurnool',
    imageSuggestion: 'Konda Reddy Fort or the natural rock formations at Oravakallu',
    overview: 'A historic Rayalaseema destination with forts, rock landscapes, and wildlife areas nearby.',
    history: 'Kurnool’s history reflects successive regional kingdoms and its strategic position between important routes.',
    famousFor: ['Konda Reddy Fort', 'Oravakallu Rock Garden', 'Rollapadu Wildlife Sanctuary', 'Belum Caves'],
    interestingPart: 'The area brings together an urban fort landmark, unusual natural rock formations, and open grassland habitats.',
    bestTime: 'October to February',
    stayOptions: 'Use Kurnool as a base and check current lodging, sanctuary access, and cave entry arrangements before travel.',
  },
  {
    id: 'guntur',
    name: 'Guntur',
    imageSuggestion: 'Undavalli Caves or the hilltop Kondaveedu Fort',
    overview: 'A cultural and food destination in the Krishna–Guntur region, close to major rock-cut and hill-fort heritage sites.',
    history: 'The surrounding region preserves evidence of Buddhist, Hindu, and medieval fort traditions.',
    famousFor: ['Undavalli Caves', 'Kondaveedu Fort', 'Uppalapadu Bird Sanctuary', 'Guntur Sannam chilli'],
    interestingPart: 'The Guntur region pairs cave architecture and hilltop forts with a strong local food identity.',
    bestTime: 'October to February',
    stayOptions: 'Stay in Guntur or Vijayawada depending on the itinerary; verify transport and accommodation availability.',
  },
];
