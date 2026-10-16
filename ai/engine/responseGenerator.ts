import { UserIntent, IntentResult } from './intentEngine';
import { TripMemoryState } from './conversationMemory';
import { GeneratedTripPlan } from './itineraryPlanner';
import { ResolvedPlace } from './placeResolver';

export interface AIAction {
  id?: string;
  type:
    | 'open_map'
    | 'view_destination'
    | 'explore_festival'
    | 'plan_itinerary'
    | 'nearby_places'
    | 'view_transport'
    | 'find_hotels'
    | 'booking_link'
    | 'explore_heritage'
    | 'explore_states'
    | 'external_link';
  label: string;
  url?: string;
  payload?: Record<string, any>;
}

export interface FormattedResponse {
  reply: string;
  suggested_actions: string[];
  actions?: AIAction[];
  sources?: string[];
  grounding_score?: number;
}

/**
 * Crafts personalized, culturally grounded responses matching user language
 * (English vs Roman Hindi/Hinglish) with dynamic quick action chips and interactive website action controls.
 */
export function buildResponseForIntent(
  intentResult: IntentResult,
  state: TripMemoryState,
  plan?: GeneratedTripPlan,
  dataPayload?: any
): FormattedResponse {
  const isHinglish = intentResult.isHinglish;
  const intent = intentResult.intent;
  const rawQuery = (intentResult.rawQuery || '').toLowerCase();

  // 1. GREETING
  if (intent === 'GREETING') {
    return {
      reply: isHinglish
        ? 'Namaste! 👋 Main Virasat hoon — aapka AI Travel & Heritage Concierge. Aaj koi trip plan karni hai, kisi specific destination ko explore karna hai, ya Bharat ke royal heritage ke baare mein jaanna hai?'
        : "Namaste! 👋 I am Virasat — your AI Travel & Heritage Concierge. Would you like to plan a tailored circuit, explore a destination, or discover India's magnificent monuments today?",
      suggested_actions: ['Plan a Trip', 'Explore Near Me', 'Explore Heritage', 'Tell me about Jaipur'],
      actions: [
        { type: 'plan_itinerary', label: 'Plan Itinerary', url: '/itinerary' },
        { type: 'explore_heritage', label: 'Explore Heritage', url: '/heritage' },
        { type: 'open_map', label: 'Open Map', url: '/map' },
      ],
    };
  }

  // 2. CASUAL_CONVERSATION ("kaise ho", "how are you")
  if (intent === 'CASUAL_CONVERSATION') {
    if (/(tell me (?:a )?joke|make me laugh|koi joke|joke sunao|mazaak sunao|mazaak suna)/i.test(rawQuery)) {
      return {
        reply: isHinglish
          ? 'Ek travel joke 😄: Tourist ne guide se poocha, “Yahan ka sabse purana monument kaunsa hai?” Guide bola, “Aapka patience — ticket line mein subah se khada hai!”'
          : 'A travel joke 😄: A tourist asked the guide, “What is the oldest monument here?” The guide said, “Your patience—it has been standing in the ticket line since morning!”',
        suggested_actions: ['Plan a trip', 'Explore heritage', 'Tell me something fun'],
        actions: [{ type: 'explore_heritage', label: 'Explore Heritage', url: '/heritage' }],
      };
    }
    if (/(i love you|love you)/i.test(rawQuery)) {
      return {
        reply: isHinglish
          ? 'Aww, shukriya! 😊 Main AI assistant hoon, par aapki trip planning aur India explore karne mein hamesha madad kar sakta hoon.'
          : 'That’s sweet of you 😊 I’m an AI assistant, and I’m always here to help with trip planning and exploring India.',
        suggested_actions: ['Plan a trip', 'Explore nearby places'],
      };
    }
    if (/(are you human|are you real|do you have feelings)/i.test(rawQuery)) {
      return {
        reply: isHinglish
          ? 'Main Virasat AI ka software assistant hoon, insaan nahi. Main local tourism data aur app tools se madad karta hoon; mere paas insaanon jaise feelings nahi hain.'
          : 'I’m Virasat AI, a software assistant rather than a person. I use local tourism data and app tools; I don’t have human feelings.',
        suggested_actions: ['What can you do?', 'Explore destinations'],
        actions: [{ type: 'explore_states', label: 'Discover Bharat', url: '/explore' }],
      };
    }
    return {
      reply: isHinglish
        ? 'Main bilkul badhiya hoon! 😄 Bharat ke 28 States aur 8 Union Territories ke travel insights ke saath ready hoon. Aap batao, aaj kahan ghumne ka plan hai?'
        : "I'm doing wonderful, thank you! 😄 Ready to help you discover heritage and travel circuits across all 36 regions of India. What's on your travel mind today?",
      suggested_actions: ['Plan a 3-Day Trip', 'Best places in Rajasthan', 'Explore Near Me', 'Budget Travel Tips'],
      actions: [
        { type: 'plan_itinerary', label: 'Plan Itinerary', url: '/itinerary' },
        { type: 'explore_states', label: '36 States & UTs', url: '/explore' },
        { type: 'open_map', label: 'Open Map', url: '/map' },
      ],
    };
  }

  // 3. ABOUT_VIRASAT ("what is this", "who are you")
  if (intent === 'ABOUT_VIRASAT') {
    return {
      reply: isHinglish
        ? "Aap Virasat AI ke local travel assistant se baat kar rahe hain. Main app ke tourism records aur tools se heritage, destinations, festivals, trips aur routes dhoondhne mein madad karta hoon."
        : "You’re chatting with Virasat AI, an intelligent travel assistant. I use the app’s tourism records and tools to help with heritage, destinations, festivals, trips, and routes.",
      suggested_actions: ['Plan a Trip', 'Explore 28 States & 8 UTs', 'Top Monuments', 'How does Virasat work?'],
      actions: [
        { type: 'explore_heritage', label: 'Verified Monuments', url: '/heritage' },
        { type: 'explore_states', label: 'Explore States', url: '/explore' },
        { type: 'open_map', label: 'Interactive Map', url: '/map' },
      ],
    };
  }

  // 4. HELP ("what can you do")
  if (intent === 'HELP') {
    return {
      reply: isHinglish
        ? "Main Virasat ke local tourism data par based requests handle karta hoon:\n\n" +
          "• **Heritage**: *'Gateway of India ka history batao'*\n" +
          "• **Trip planning**: *'Jaipur ka 2-day itinerary banao'*\n" +
          "• **Transport**: *'Mumbai se Pune train kaise jaun?'*\n" +
          "• **Festivals, stays, food aur markets**: *'Maharashtra ke festivals dikhao'*\n" +
          "• **App tabs**: *'Discover Bharat kholo'*, *'Mere saved trips dikhao'*\n\n" +
          "Live fares, hotel availability aur current weather ke liye active provider ki zaroorat hai. Private account data ke liye sign in karein."
        : "I can handle questions grounded in Virasat's local tourism data:\n\n" +
          "• **Heritage**: *'Tell me the history of Gateway of India'*\n" +
          "• **Trip planning**: *'Build a 2-day Jaipur itinerary'*\n" +
          "• **Transport**: *'How do I travel from Mumbai to Pune by train?'*\n" +
          "• **Festivals, stays, food, and markets**: *'Show Maharashtra festivals'*\n" +
          "• **App tabs**: *'Open Discover Bharat'*, *'Show my saved trips'*\n\n" +
          "Live fares, hotel availability, and current weather need an active provider connection. Sign in to access private account data.",
      suggested_actions: ['Plan a 3-Day Trip', 'Explore Near Me', 'Top UNESCO Sites', 'Mysore Dasara Info'],
      actions: [
        { type: 'plan_itinerary', label: 'Plan Itinerary', url: '/itinerary' },
        { type: 'explore_heritage', label: 'UNESCO Sites', url: '/heritage' },
        { type: 'open_map', label: 'Open Map', url: '/map' },
        { type: 'explore_festival', label: 'Festivals', url: '/festivals' },
      ],
    };
  }

  // 5. FAREWELL & THANKS
  if (intent === 'FAREWELL') {
    return {
      reply: isHinglish
        ? 'Shubh Yatra! 🙏 Jab bhi nayi yatra plan karni ho, Virasat hamesha yahan hai. Safe travels!'
        : 'Happy journey! 🙏 Whenever you are ready to explore your next Indian destination, Virasat is right here. Safe travels!',
      suggested_actions: ['Start New Trip', 'Save Itinerary', 'Explore Near Me'],
    };
  }
  if (intent === 'THANKS') {
    return {
      reply: isHinglish
        ? 'Shukriya! 😊 Khushi hui madad karke. Agar hotel, transport ya kisi monument ke baare mein aur jaanna ho toh zaroor bataiye.'
        : "You're most welcome! 😊 Always a pleasure to help. Feel free to ask if you need hotel options, transit timings, or ticket advice.",
      suggested_actions: ['Check Hotels', 'Transit Options', 'Calculate Budget', 'Explore Food'],
    };
  }

  // 6. MAP_ACTION ("Map kholo", "Iska map dikhao", "Show map")
  if (intent === 'MAP_ACTION') {
    const targetCity = state.lastPlace?.city || state.destination || 'India';
    const mapUrl = state.lastPlace
      ? `/map?city=${encodeURIComponent(state.lastPlace.city)}&q=${encodeURIComponent(state.lastPlace.name)}`
      : state.destination
        ? `/map?city=${encodeURIComponent(state.destination)}`
        : '/map';

    return {
      reply: isHinglish
        ? `🗺️ **Interactive Virasat Map khol diya gaya hai!**\n\nAap **${targetCity}** ke verified UNESCO/ASI monuments, heritage clusters, transit corridors aur hidden gems ko map par geospatial view mein dekh sakte hain. Niche diye gaye **Open Map** button par tap karke seedhe interactive cartography page par jayein.`
        : `🗺️ **Virasat Interactive Heritage Map is ready!**\n\nYou can explore verified UNESCO/ASI monuments, heritage clusters, transit corridors, and hidden gems for **${targetCity}** on the interactive map. Tap the **Open Map** button below to navigate directly to the cartography view.`,
      suggested_actions: ['Explore Near Me', 'Show Nearby Places', `Plan ${targetCity} Trip`, 'Calculate Transit'],
      actions: [
        { type: 'open_map', label: `Open Map (${targetCity})`, url: mapUrl },
        ...(state.lastPlace || state.destination
          ? [
              {
                type: 'view_destination' as const,
                label: `Explore ${state.lastPlace?.name || state.destination}`,
                url: state.lastPlace
                  ? `/place/${encodeURIComponent(state.lastPlace.id)}`
                  : `/city/${encodeURIComponent((state.destination || '').toLowerCase().replace(/\s+/g, '-'))}`,
              },
            ]
          : []),
      ],
      sources: ['Virasat Geospatial Registry'],
    };
  }

  // 7. TICKET_BOOKING ("Train ka ticket kahan book hoga?", "Ticket kahan book karna hai?")
  if (intent === 'TICKET_BOOKING') {
    return {
      reply: isHinglish
        ? `🎫 **Official Ticket Booking Channels (Government & Authorized)**:\n\n` +
          `• 🚆 **Indian Railways / Train Tickets**: Official **IRCTC Portal** ([irctc.co.in](https://www.irctc.co.in/)) ya IRCTC Rail Connect App par book karein. Unreserved daily/local tickets ke liye official Indian Railways **UTS App** use karein.\n` +
          `• 🏛️ **Monuments & ASI Heritage Passes**: Archaeological Survey of India (ASI) official portal ([asi.payumoney.com](https://asi.payumoney.com/)) ya monument entrance gate par ASI QR code scan karke e-ticket le sakte hain.\n` +
          `• ✈️ **Flight Tickets**: Airline official websites (Air India, IndiGo, SpiceJet) ya authorized platforms par check karein.\n\n` +
          `⚠️ *Anti-Hallucination & Safety Note*: Virasat direct tickets book nahi karta aur live fare assume nahi karta. Kripya authorized official links se hi booking karein.`
        : `🎫 **Official Government & Authorized Booking Portals**:\n\n` +
          `• 🚆 **Indian Railways Train Tickets**: Book directly via the official **IRCTC Portal** ([irctc.co.in](https://www.irctc.co.in/)) or the IRCTC Rail Connect mobile app. For unreserved daily transit, use the official **UTS on Mobile** app.\n` +
          `• 🏛️ **Monuments & ASI Heritage Passes**: Book through the Archaeological Survey of India (ASI) official portal ([asi.payumoney.com](https://asi.payumoney.com/)) or via on-site official ASI dynamic QR counters.\n` +
          `• ✈️ **Flight Tickets**: Directly on official airline portals (Air India, IndiGo, etc.) or verified travel aggregators.\n\n` +
          `⚠️ *Transparency Protocol*: Virasat never fakes live seat allocations, issues direct tickets, or claims confirmed reservations. Always verify availability on official portals.`,
      suggested_actions: ['Book on IRCTC Official', 'Check Train Routes', 'ASI Monuments', 'Plan a Trip'],
      actions: [
        { type: 'booking_link', label: 'Open Official IRCTC (irctc.co.in)', url: 'https://www.irctc.co.in/' },
        { type: 'explore_heritage', label: 'Explore ASI Monuments', url: '/heritage' },
      ],
      sources: ['Indian Railways IRCTC', 'Archaeological Survey of India (ASI)'],
    };
  }

  // 8. UNESCO_QUERY ("India ke UNESCO World Heritage Sites ke examples batao")
  if (intent === 'UNESCO_QUERY') {
    return {
      reply: isHinglish
        ? `🏛️ **India ke UNESCO World Heritage Sites (Verified UNESCO Listing)**:\n\n` +
          `Bharat mein kul **43+ UNESCO World Heritage Sites** hain, jinhe teen pramukh categories mein baanta gaya hai:\n\n` +
          `### 1. 🏛️ Cultural Heritage Sites (35 sites):\n` +
          `• **Taj Mahal & Agra Fort** (Uttar Pradesh) — 17th-century Mughal architectural masterpieces.\n` +
          `• **Hampi Group of Monuments** (Karnataka) — Vijayanagara Empire ke grand monolithic ruins.\n` +
          `• **Ajanta & Ellora Caves** (Maharashtra) — 2nd century BCE se 10th century CE ke rock-cut Buddhist, Hindu & Jain cave temples.\n` +
          `• **Sun Temple, Konark** (Odisha) — Kalinga architecture ka grand stone chariot.\n` +
          `• **Qutub Minar & Red Fort** (Delhi) — Medieval architectural marvels.\n` +
          `• **Khajuraho Group of Monuments** (Madhya Pradesh) — Chandela dynasty ke nagara-style mandir.\n` +
          `• **Rani ki Vav** (Gujarat) — 11th-century subterranean stepwell architecture.\n` +
          `• **Recent Additions (2023)**: Sacred Ensembles of the Hoysalas (Belur, Halebidu, Somanathapura) aur Santiniketan (West Bengal).\n\n` +
          `### 2. 🌿 Natural Heritage Sites (7 sites):\n` +
          `• **Kaziranga National Park** (Assam) — Great Indian One-Horned Rhinoceros ka world-famous sanctuary.\n` +
          `• **Sundarbans National Park** (West Bengal) — Mangrove tiger habitat.\n` +
          `• **Western Ghats** (Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu) — Global biodiversity hotspot.\n` +
          `• **Manas Wildlife Sanctuary**, **Keoladeo National Park**, **Great Himalayan National Park**.\n\n` +
          `### 3. ⛰️ Mixed Heritage Site (1 site):\n` +
          `• **Khangchendzonga National Park** (Sikkim) — Sacred mountains aur unique cultural-ecological landscape.\n\n` +
          `📌 *Note*: Official UNESCO Inscribed sites aur Tentative List sites mein antar hota hai. Virasat strictly verified UNESCO records follow karta hai.`
        : `🏛️ **UNESCO World Heritage Sites in India (Official UNESCO Listing)**:\n\n` +
          `India boasts **43+ inscribed UNESCO World Heritage Sites** classified into three distinct categories:\n\n` +
          `### 1. 🏛️ Cultural Heritage Sites (35 Sites):\n` +
          `• **Taj Mahal & Agra Fort** (Uttar Pradesh) — Epitome of Mughal symmetry and craftsmanship.\n` +
          `• **Group of Monuments at Hampi** (Karnataka) — Monumental ruins of the Vijayanagara Empire.\n` +
          `• **Ajanta & Ellora Caves** (Maharashtra) — Rock-cut Buddhist, Hindu, and Jain cave sanctuaries.\n` +
          `• **Sun Temple, Konark** (Odisha) — 13th-century stone chariot architecture.\n` +
          `• **Qutub Minar & Red Fort Complex** (Delhi) — Indo-Islamic medieval architecture.\n` +
          `• **Khajuraho Group of Monuments** (Madhya Pradesh) — Nagara-style Chandela temple complexes.\n` +
          `• **Rani ki Vav** (Gujarat) — Spectacular 11th-century stepwell engineering.\n` +
          `• **Recent Inscriptions (2023)**: Sacred Ensembles of the Hoysalas & Santiniketan.\n\n` +
          `### 2. 🌿 Natural Heritage Sites (7 Sites):\n` +
          `• **Kaziranga National Park** (Assam) — Global sanctuary for the Great Indian one-horned rhinoceros.\n` +
          `• **Sundarbans National Park** (West Bengal) — Unique mangrove tiger habitat.\n` +
          `• **Western Ghats** (Spanning 6 states) — High-endemism biodiversity hotspot.\n` +
          `• **Keoladeo National Park**, **Manas Wildlife Sanctuary**, **Great Himalayan National Park**.\n\n` +
          `### 3. ⛰️ Mixed Heritage Site (1 Site):\n` +
          `• **Khangchendzonga National Park** (Sikkim) — Sacred mountain landscapes.\n\n` +
          `📌 *Official Status Distinction*: Inscribed sites are officially verified on the UNESCO World Heritage List; properties on the Tentative List are pending formal nomination.`,
      suggested_actions: ['Explore Heritage Sites', 'Kaziranga National Park', 'Hampi Monuments', 'Open Map'],
      actions: [
        { type: 'explore_heritage', label: 'Explore Heritage Monuments', url: '/heritage' },
        { type: 'open_map', label: 'View UNESCO Sites on Map', url: '/map' },
      ],
      sources: ['UNESCO World Heritage Centre', 'Archaeological Survey of India (ASI)'],
    };
  }

  // 9. NATIONAL_PARK_QUERY & ZOOS (Dynamic per requested park or destination context)
  if (intent === 'NATIONAL_PARK_QUERY') {
    const q = rawQuery.toLowerCase();
    const dest = (state.destination || '').toLowerCase();

    // A. Sundarbans National Park (West Bengal)
    if (/sundarban|sunderban/i.test(q)) {
      return {
        reply: isHinglish
          ? `🐅 **Sundarbans National Park** Bharat ke **West Bengal** rajya (South 24 Parganas) mein sthit hai.\n\n` +
            `### 🌟 Key Facts & Ecological Significance:\n` +
            `• **UNESCO World Heritage Site**: 1987 mein Natural World Heritage Site ke roop mein inscribed kiya gaya tha (Ramsar Wetland Site bhi hai).\n` +
            `• **World's Largest Mangrove Forest**: Ganga-Brahmaputra-Meghna delta par vishal Sundari pedon ka mangrove jungle hai.\n` +
            `• **Royal Bengal Tigers**: Yahan ke tigers khare paani (saline water) mein tairne ke liye vishwa-prasiddh hain (~100+ tigers).\n` +
            `• **Rich Estuarine Fauna**: Saltwater crocodiles, Gangetic river dolphins, spotted deer aur olive ridley turtles ka aawas hai.\n` +
            `• **Safari Experience**: Exclusive boat safaris Sajnekhali, Sudhanyakhali aur Dobanki watchtowers ke madhyam se hoti hain.\n` +
            `• **Visiting Window**: September se March (pleasant season). Monsoons mein unchi lehrein rehti hain.\n` +
            `• **Connectivity**: Nearest airport aur major railway station Kolkata (~110 km to Godkhali boat ferry point) hai.`
          : `🐅 **Sundarbans National Park is located in the state of West Bengal, India** (spanning South 24 Parganas district across the estuarine delta).\n\n` +
            `### 🌟 Key Highlights & Ecological Significance:\n` +
            `• **UNESCO World Heritage Status**: Inscribed in 1987 as a Natural World Heritage Site and designated a Ramsar Wetland of International Importance.\n` +
            `• **World's Largest Tidal Mangrove Delta**: Formed by the confluence of the Ganges, Brahmaputra, and Meghna rivers, dominated by dense Sundari trees.\n` +
            `• **Royal Bengal Tiger Sanctuary**: Renowned globally for its swimming tiger population adapted to saline mangrove waters (~100+ wild tigers).\n` +
            `• **Estuarine Wildlife**: Sanctuary for saltwater crocodiles, Gangetic river dolphins, olive ridley turtles, and chital (spotted deer).\n` +
            `• **Safari Access**: Boat-based water safaris departing from Godkhali Port with watchtowers at Sajnekhali, Sudhanyakhali, and Dobanki.\n` +
            `• **Best Visiting Window**: October to March (calm waters and pleasant temperatures).\n` +
            `• **Access**: Nearest airport & rail hub is Kolkata (~110 km to the Godkhali ferry gateway).`,
        suggested_actions: ['View Sundarbans on Map', 'Explore West Bengal', 'Top UNESCO Sites', 'Plan Kolkata Trip'],
        actions: [
          { type: 'open_map', label: 'View Sundarbans on Map', url: '/map?q=Sundarbans' },
          { type: 'view_destination', label: 'Explore Kolkata', url: '/city/kolkata' },
          { type: 'plan_itinerary', label: 'Plan West Bengal Trip', url: '/itinerary?city=Kolkata&days=3' },
        ],
        sources: ['West Bengal Forest Department', 'UNESCO World Heritage Centre', 'Project Tiger'],
      };
    }

    // B. Patna Zoo / Sanjay Gandhi Biological Park (Bihar)
    if (/patna zoo|sanjay gandhi|jaivik udyan|zoo/i.test(q) && (/patna/i.test(q) || dest === 'patna')) {
      return {
        reply: isHinglish
          ? `🦏 **Sanjay Gandhi Biological Park (Patna Zoo)** Bharat ke **Patna, Bihar** (Bailey Road) mein sthit hai.\n\n` +
            `### 🌟 Key Highlights & Visitor Information:\n` +
            `• **Conservation Hub**: 1973 mein sthapit kiya gaya tha. Yeh **Great Indian One-Horned Rhinoceros** ke captive breeding ke liye Asia ke pramukh kendron mein se ek hai.\n` +
            `• **Fauna**: 800+ animals aur 110+ species jisme Royal Bengal Tigers, Asiatic Lions, leopards, Himalayan black bears, hippos aur vishal aviary shamil hain.\n` +
            `• **Botanical Garden & Boating**: Rose garden, medicinal plants zone, bachon ke liye toy train, 3D nature interpretation theater aur peaceful boating lake uplabdh hai.\n` +
            `• **Timings**: 8:00 AM – 5:30 PM (**Somvaar/Monday ko maintenance ke kaaran band rehta hai**).\n` +
            `• **Connectivity**: Patna Junction railway station se sirf ~5 km aur Patna Airport (Jay Prakash Narayan Airport) se ~4 km door hai.`
          : `🦏 **Sanjay Gandhi Biological Park (Patna Zoo) is located on Bailey Road, Patna, Bihar, India**.\n\n` +
            `### 🌟 Key Highlights & Visitor Information:\n` +
            `• **Premier Wildlife Conservation**: Established in 1973, it is renowned as one of Asia's most successful captive breeding sanctuaries for the **Great Indian One-Horned Rhinoceros**.\n` +
            `• **Diverse Animal Exhibits**: Houses over 800 specimens across 110+ wildlife species including Royal Bengal Tigers, Asiatic Lions, leopards, Himalayan black bears, and a sprawling aviary.\n` +
            `• **Botanical & Recreational Attractions**: Features a 3D nature theater, serene boating lake, children's toy train, and extensive rose & medicinal plant gardens.\n` +
            `• **Visiting Hours**: 8:00 AM – 5:30 PM (Tuesday to Sunday; **Closed on Mondays** for habitat upkeep).\n` +
            `• **Access**: ~5 km from Patna Junction railway station and ~4 km from Patna Airport (PAT).`,
        suggested_actions: ['Show Patna Zoo on Map', 'Explore Patna', 'Plan Patna Trip', 'Patna Museum'],
        actions: [
          { type: 'open_map', label: 'View Patna Zoo on Map', url: '/map?q=Patna+Zoo&city=Patna' },
          { type: 'view_destination', label: 'Explore Patna', url: '/city/patna' },
          { type: 'plan_itinerary', label: 'Plan Patna Trip', url: '/itinerary?city=Patna&days=2' },
        ],
        sources: ['Environment & Forest Department, Bihar', 'Central Zoo Authority of India (CZA)'],
      };
    }

    // C. Goa Wildlife Sanctuaries & National Parks (e.g. Mollem, Bhagwan Mahavir, Salim Ali)
    if (/goa/i.test(q) || dest === 'goa' || /mollem|bhagwan mahavir|salim ali/i.test(q)) {
      return {
        reply: isHinglish
          ? `🌿 **Goa ke National Parks aur Wildlife Sanctuaries** (Western Ghats Biodiversity Hotspot):\n\n` +
            `1. **Mollem National Park & Bhagwan Mahaveer Sanctuary** (Dharbandora / Sanguem):\n` +
            `   • Goa ka sabse bada protected forest area (240 sq km), jisme iconic **Dudhsagar Falls** sthit hai.\n` +
            `   • Bengal tigers, leopards, barking deer, King Cobras aur Malabar giant squirrels ka aawas.\n\n` +
            `2. **Dr. Salim Ali Bird Sanctuary** (Chorao Island, Mandovi River):\n` +
            `   • Beautiful mangrove ecosystem, ferry se access hota hai; migratory birds, kingfishers aur mudskippers ke liye famous.\n\n` +
            `3. **Cotigao Wildlife Sanctuary** (Canacona, South Goa):\n` +
            `   • Tall evergreen canopies ke saath 25-meter uncha tree-top watchtower jahan se watering hole dekha ja sakta hai.\n\n` +
            `4. **Bondla Wildlife Sanctuary** (Ponda):\n` +
            `   • Family-friendly sanctuary jisme mini zoo, deer safari park aur botanical gardens hain.`
          : `🌿 **National Parks & Wildlife Sanctuaries in Goa** (Western Ghats UNESCO Biosphere):\n\n` +
            `1. **Mollem National Park & Bhagwan Mahaveer Sanctuary** (Dharbandora):\n` +
            `   • Goa's premier and largest wildlife sanctuary (240 sq km), encompassing the majestic **Dudhsagar Falls**.\n` +
            `   • Habitat for leopards, Bengal tigers, barking deer, bonnet macaques, and the Malabar giant squirrel.\n\n` +
            `2. **Dr. Salim Ali Bird Sanctuary** (Chorao Island):\n` +
            `   • Estuarine mangrove sanctuary on the Mandovi River accessible by local ferry, home to kingfishers, egrets, and pintails.\n\n` +
            `3. **Cotigao Wildlife Sanctuary** (Canacona, South Goa):\n` +
            `   • Dense multi-tiered moist deciduous forest featuring a 25-meter tree-top watchtower over a natural watering hole.\n\n` +
            `4. **Bondla Wildlife Sanctuary** (Ponda foothills):\n` +
            `   • Ideal for families and trekking, featuring a rescue center, botanical garden, and deer sanctuary.`,
        suggested_actions: ['Show Dudhsagar on Map', 'Explore Goa', 'Plan Goa Trip', 'Bhagwan Mahavir Sanctuary'],
        actions: [
          { type: 'open_map', label: 'View Mollem on Map', url: '/map?q=Mollem+National+Park&city=Goa' },
          { type: 'view_destination', label: 'Explore Goa', url: '/city/goa' },
          { type: 'plan_itinerary', label: 'Plan Goa Trip', url: '/itinerary?city=Goa&days=3' },
        ],
        sources: ['Goa Forest Department', 'Wildlife Institute of India', 'Ministry of Environment & Forests'],
      };
    }

    // D. Jim Corbett National Park (Uttarakhand)
    if (/corbett|jim corbett/i.test(q)) {
      return {
        reply: `🐅 **Jim Corbett National Park (Uttarakhand, India)**:\n\n` +
          `• **India's First National Park**: Established in 1936 as Hailey National Park, flagship birthplace of Project Tiger in 1973.\n` +
          `• **Flora & Fauna**: Spans 520 sq km of sal forests, riverine belts (Ramganga), and grasslands sheltering Bengal tigers, wild Asian elephants, and 600+ bird species.\n` +
          `• **Key Safari Zones**: Dhikala (premier deep forest zone), Bijrani, Jhirna (open year-round), Dhela, and Durga Devi.\n` +
          `• **Visiting Window**: Mid-November to June. Accessible via Ramnagar railway station (~12 km).`,
        suggested_actions: ['Show Corbett on Map', 'Explore Uttarakhand', 'Plan Trip', 'Top Tiger Reserves'],
        actions: [
          { type: 'open_map', label: 'View Corbett on Map', url: '/map?q=Jim+Corbett' },
          { type: 'explore_states', label: 'Explore Uttarakhand', url: '/explore' },
        ],
        sources: ['Uttarakhand Forest Department', 'National Tiger Conservation Authority (NTCA)'],
      };
    }

    // E. Gir National Park (Gujarat)
    if (/gir/i.test(q)) {
      return {
        reply: `🦁 **Gir National Park & Wildlife Sanctuary (Sasan Gir, Gujarat)**:\n\n` +
          `• **Sole Home of Asiatic Lions**: The only natural habitat in the world where the Asiatic Lion (*Panthera leo persica*) roams wild (~670+ lions).\n` +
          `• **Landscape**: Dry teak forest, acacia scrub, and perennial rivers supporting leopards, chital, sambar, and marsh crocodiles.\n` +
          `• **Visiting Season**: Mid-October to mid-June (closed during monsoon). Devalia Safari Park offers year-round fenced viewing.\n` +
          `• **Connectivity**: Nearest railway hub is Junagadh (~60 km) and Rajkot Airport (~160 km).`,
        suggested_actions: ['Show Gir on Map', 'Explore Gujarat', 'Plan Gujarat Trip', 'Wildlife Circuits'],
        actions: [
          { type: 'open_map', label: 'View Gir on Map', url: '/map?q=Gir+National+Park' },
          { type: 'explore_states', label: 'Explore Gujarat', url: '/explore' },
        ],
        sources: ['Gujarat Forest Department', 'Wildlife Institute of India'],
      };
    }

    // F. Kaziranga (Assam) or Default
    return {
      reply: isHinglish
        ? `🦏 **Kaziranga National Park** Bharat ke **Assam** rajya mein sthit hai (Golaghat, Nagaon aur Sonitpur zilon mein phaila hua hai).\n\n` +
          `### 🌟 Key Facts & Heritage Status:\n` +
          `• **UNESCO World Heritage Site**: 1985 mein Natural World Heritage Site ke roop mein inscribed kiya gaya tha.\n` +
          `• **One-Horned Rhinoceros**: Duniya ke do-tihaai (2/3rd) Great Indian One-Horned Rhinos yahan rehte hain (~2,600+ rhinos).\n` +
          `• **Tiger Reserve**: Kaziranga ek protected Tiger Reserve bhi hai, jahan Bengal Tigers, Asian Elephants, Wild Water Buffalo aur Swamp Deer paye jaate hain.\n` +
          `• **Safari Zones**: Kohora (Central), Bagori (Western - rhino sightings ke liye best), Agaratoli (Eastern - birdwatching), Burapahar.\n` +
          `• **Visiting Season**: November se April tak khula rehta hai. Monsoon (May se October) mein Brahmaputra ke baadh ke kaaran park band rehta hai.\n` +
          `• **Connectivity**: Nearest airport Guwahati (GAU, ~220 km) ya Jorhat (JRH, ~95 km) hai.`
        : `🦏 **Kaziranga National Park is located in the state of Assam, India** (spanning Golaghat, Nagaon, and Sonitpur districts along the southern bank of the Brahmaputra River).\n\n` +
          `### 🌟 Key Highlights & Ecological Significance:\n` +
          `• **UNESCO World Heritage Status**: Inscribed in 1985 as an official Natural World Heritage Site.\n` +
          `• **Home of the One-Horned Rhino**: Hosts approximately two-thirds of the world's Great Indian One-Horned Rhinoceros population (~2,600+ individuals).\n` +
          `• **Tiger Reserve & Rich Fauna**: Designated a Tiger Reserve in 2006, sanctuary to wild water buffaloes, Asian elephants, and swamp deer.\n` +
          `• **Safari Ranges**: Central Range (Kohora), Western Range (Bagori — premier rhino sightings), Eastern Range (Agaratoli), and Burapahar.\n` +
          `• **Visiting Window**: Open from November to April. Closed from May to October due to monsoon flood conditions.\n` +
          `• **Access**: Nearest airport is Guwahati (GAU, ~220 km); rail connectivity via Furkating Junction (~75 km) and Guwahati.`,
      suggested_actions: ['Show Kaziranga on Map', 'Explore Assam', 'Top UNESCO Sites', 'Plan Assam Trip'],
      actions: [
        { type: 'open_map', label: 'View Kaziranga on Map', url: '/map?q=Kaziranga' },
        { type: 'view_destination', label: 'Explore Assam / Guwahati', url: '/city/guwahati' },
        { type: 'plan_itinerary', label: 'Plan Assam Trip', url: '/itinerary?city=Guwahati&days=4' },
      ],
      sources: ['Assam Forest Department', 'UNESCO World Heritage Centre', 'Ministry of Environment, Forest & Climate Change'],
    };
  }

  // 9b. SAFETY_QUERY ("is goa safe?", "safety in mumbai", "is it safe for solo travelers?")
  if (intent === 'SAFETY_QUERY') {
    const q = rawQuery.toLowerCase();
    const dest = (state.destination || '').toLowerCase();

    if (/goa/i.test(q) || dest === 'goa') {
      return {
        reply: isHinglish
          ? `🛡️ **Goa mein Tourist Safety — Ground Reality & Guidelines**:\n\n` +
            `Haan, Goa Bharat ke sabse **safe aur tourist-friendly** states mein se ek hai. Har saal lakhoon solo travelers, women travelers aur families yahan aati hain.\n\n` +
            `### 🏖️ Zaroori Safety Tips:\n` +
            `• **Beach Swimming**: Drishti Marine lifeguards ke flags ko follow karein. **Red flag** ka matlab dangerous undercurrents hain — red flag zone mein swim na karein.\n` +
            `• **Night Travel**: North Goa (Baga, Calangute, Anjuna) der raat tak lively rehta hai. South Goa (Palolem, Agonda) 10 PM ke baad kaafi shaant ho jaata hai. Late night travel ke liye verified **GoaMiles app** ya prepaid cabs use karein.\n` +
            `• **Scooter / Car Rental**: Sirf black-and-yellow commercial number plate wali gaadiyaan rent karein; helmet pehanna anivarya hai.\n` +
            `• **Emergency Helplines**: **112** (National Emergency), **1363** (Incredible India Tourist Helpline), **100** (Goa Police), **108** (Ambulance).`
          : `🛡️ **Traveler Safety in Goa — Official Advisory**:\n\n` +
            `Yes, Goa is widely regarded as one of India's safest and most welcoming travel destinations for solo travelers, women, and families.\n\n` +
            `### 🏖️ Essential Safety Guidelines:\n` +
            `• **Beach & Surf Safety**: Always check Drishti Marine lifeguard flags. A **red flag** indicates strong riptides and dangerous undertow currents — never enter the sea in red flag zones.\n` +
            `• **Night Travel & Transit**: North Goa (Baga, Calangute, Candolim, Anjuna) stays active late into the night. South Goa (Palolem, Colva, Benaulim) becomes tranquil after 10 PM. For night commutes, book via verified **GoaMiles app cabs** or airport prepaid counters.\n` +
            `• **Vehicle Rentals**: Ensure rented scooters or cars carry black-and-yellow commercial registration plates. Helmets are strictly mandated by traffic police.\n` +
            `• **24x7 Emergency Helplines**: **112** (National All-in-One Emergency), **1363** (Incredible India Tourist Helpline), **100** (Police Assistance), **108** (Ambulance).`,
        suggested_actions: ['24x7 SOS Helplines', 'Explore Goa Stays', 'Plan Goa Trip', 'Open Goa Map'],
        actions: [
          { type: 'open_map', label: 'View Goa Map', url: '/map?city=Goa' },
          { type: 'plan_itinerary', label: 'Plan Goa Trip', url: '/itinerary?city=Goa&days=3' },
          { type: 'view_destination', label: 'Explore Goa', url: '/city/goa' },
        ],
        sources: ['Goa Tourism Development Corporation (GTDC)', 'Ministry of Tourism', 'National Emergency Service (112)'],
      };
    }

    if (/mumbai/i.test(q) || dest === 'mumbai') {
      return {
        reply: isHinglish
          ? `🛡️ **Mumbai Safety Advisory**:\n\n` +
            `Mumbai ko desh ka sabse safe metropolis mana jaata hai. Yahan 24x7 active nightlife, continuous police patrolling aur safe public transit uplabdh hai.\n\n` +
            `• **Local Rail & Metro**: Trains mein dedicated **Ladies Compartments** hote hain jahan raat ko RPF police personnel tainaat rehte hain.\n` +
            `• **Night Cabs**: Metered Kaali-Peeli taxis aur Ola/Uber 24 ghante chalte hain.\n` +
            `• **Helplines**: **112** (All-in-one Emergency), **103** (Mumbai Police Women Helpline), **1363** (Tourist Helpline).`
          : `🛡️ **Traveler Safety in Mumbai — Official Advisory**:\n\n` +
            `Mumbai is widely recognized as India's safest metropolitan city with an active 24x7 transit network and strong police surveillance.\n\n` +
            `• **Suburban Rail & Metro**: Dedicated Ladies Coaches are active on all Western, Central, and Harbour line trains with RPF escorts at night.\n` +
            `• **24x7 Cabs**: Metered Kaali-Peeli taxis and Uber/Ola operate safely across all suburbs.\n` +
            `• **Helplines**: **112** (National Emergency), **103** (Mumbai Police Women Helpline), **1363** (Tourist Helpline).`,
        suggested_actions: ['24x7 SOS Helplines', 'Mumbai Local Train Guide', 'Explore Mumbai', 'Open Map'],
        actions: [
          { type: 'open_map', label: 'View Mumbai Map', url: '/map?city=Mumbai' },
          { type: 'view_destination', label: 'Explore Mumbai', url: '/city/mumbai' },
        ],
        sources: ['Mumbai Police', 'Maharashtra Tourism (MTDC)', 'National Emergency Service (112)'],
      };
    }

    // Default Safety
    return {
      reply: `🛡️ **Traveler Safety Advisory & 24x7 Support**:\n\n` +
        `India's major tourism destinations maintain dedicated tourist police and infrastructure for safe travels:\n\n` +
        `• **Official 24x7 Helplines**: Dial **112** for all-in-one national police/medical emergency, or **1363** for the Incredible India multi-lingual tourist assistance line.\n` +
        `• **Verified Transport**: Use prepaid counters at railway stations and airports or licensed app cabs (Ola, Uber, state transit apps).\n` +
        `• **Safe Accommodations**: Book verified stays with standard check-in protocols.\n` +
        `• **Emergency SOS**: Virasat app features an instant 1-click **SOS 24x7** button in the top navigation bar with live GPS coordinate sharing.`,
      suggested_actions: ['24x7 SOS Helplines', 'Discover Bharat', 'Plan Itinerary', 'Open Map'],
      actions: [
        { type: 'open_map', label: 'Open Heritage Map', url: '/map' },
      ],
      sources: ['Ministry of Tourism, Govt of India', 'National Emergency Response System (112)'],
    };
  }

  // 9c. LOCATION_FOLLOWUP ("location?", "where is it?", "kahan hai?")
  if (intent === 'LOCATION_FOLLOWUP') {
    const dest = state.destination || 'Mumbai';
    return {
      reply: isHinglish
        ? `📍 **Recommended Locations & Addresses in ${dest}**:\n\n` +
          `1. **Girgaon Chowpatty (Marine Drive Promenade)**:\n` +
          `   • Address: Netaji Subhash Chandra Bose Road, Chowpatty, South Mumbai (Charni Road station ke samne).\n` +
          `   • Famous for: Beachside bhelpuri, kulfi, aur evening sunset walks.\n\n` +
          `2. **Dadar Culinary Hub (Central Mumbai)**:\n` +
          `   • Address: Ranade Road & Swami Samarth Circle, Dadar West (Dadar station ke paas).\n` +
          `   • Famous for: Iconic Maharashtrian batata vada (Aaswad, Prakash, Ashok Vada Pav near Kirti College).\n\n` +
          `3. **Fort & Kala Ghoda Heritage District**:\n` +
          `   • Address: V.B. Gandhi Marg & MG Road, Fort, Mumbai (CST / Churchgate se 10 min walk).\n` +
          `   • Famous for: Coastal Malvani seafood thalis (Trishna, Mahesh Lunch Home) aur Parsi cafes (Britannia).`
        : `📍 **Exact Locations & Directions for Recommended ${dest} Spots**:\n\n` +
          `1. **Girgaon Chowpatty Promenade (South Mumbai)**:\n` +
          `   • Location: North end of Marine Drive, directly opposite Charni Road railway station.\n` +
          `   • Renowned for: Beachfront street food stalls (bhelpuri, sev puri, fresh kulfi) and sunset views.\n\n` +
          `2. **Dadar Cultural & Food District (Central Mumbai)**:\n` +
          `   • Location: Ranade Road & Swami Samarth Circle, Dadar West (walking distance from Dadar Central & Western stations).\n` +
          `   • Renowned for: Authentic Maharashtrian snacks (Aaswad, Prakash Upahaar Kendra, Ashok Vada Pav near Kirti College).\n\n` +
          `3. **Fort & Kala Ghoda Heritage Precinct (South Mumbai)**:\n` +
          `   • Location: V.B. Gandhi Marg and Military Square Lane, Fort (10-minute walk from CSMT or Churchgate).\n` +
          `   • Renowned for: Authentic Coastal Malvani seafood thalis (Trishna, Mahesh Lunch Home) and historic cafes.`,
      suggested_actions: ['Show on Map', 'Nearby Monuments', 'Find Stays', 'How to Reach'],
      actions: [
        { type: 'open_map', label: `Show ${dest} on Map`, url: `/map?city=${encodeURIComponent(dest)}` },
        { type: 'view_destination', label: `Explore ${dest}`, url: `/city/${encodeURIComponent(dest.toLowerCase().replace(/\s+/g, '-'))}` },
      ],
      sources: ['Virasat Master Tourism Registry', 'Brihanmumbai Municipal Corporation (BMC)'],
    };
  }

  // 10. HIDDEN_GEMS_QUERY ("Udaipur ke hidden gems batao")
  if (intent === 'HIDDEN_GEMS_QUERY') {
    const city = state.destination;
    return {
      reply: city
        ? (isHinglish
            ? `Main ${city} ke tourism records se lesser-known candidates dhoondhunga. Virasat dataset mein popularity score nahi hai, isliye kisi jagah ko verified “hidden gem” nahi kahunga.`
            : `I can search Virasat's ${city} records for candidates. The dataset has no verified popularity measure, so I won't label a place a confirmed “hidden gem.”`)
        : (isHinglish ? 'Kis city ya region mein lesser-known places dhoondhun?' : 'Which city or region should I search for lesser-known places in?'),
      suggested_actions: city ? [`Plan ${city} Trip`, `Open ${city} Map`] : ['Explore all states', 'Explore Heritage'],
      actions: city
        ? [
            { type: 'open_map', label: `Open ${city} Map`, url: `/map?city=${encodeURIComponent(city)}` },
            { type: 'plan_itinerary', label: `Plan ${city} Itinerary`, url: `/itinerary?city=${encodeURIComponent(city)}&days=3` },
          ]
        : [{ type: 'explore_states', label: 'Discover Bharat', url: '/explore' }],
      sources: ['Virasat Master Tourism Registry'],
    };
  }

  // 11. MONUMENT_INFO (Direct, rich monument intelligence — Sections 5 & 6)
  if (intent === 'MONUMENT_INFO' && (intentResult.resolvedPlace || state.lastPlace)) {
    const p: ResolvedPlace = intentResult.resolvedPlace || state.lastPlace!;
    const focus = intentResult.queryFocus || 'general';

    // Duration focus
    if (focus === 'duration') {
      return {
        reply: isHinglish
          ? `🏛️ **${p.name} (${p.city}, ${p.state}) Visit Duration**:\n\n` +
            `• **Recommended Visit Time**: ${p.recommended_duration}\n` +
            `• **Optimal Visiting Hours**: ${p.visiting_hours} (Sunrise ya sunset ke samay pleasant sea breeze aur photography ke liye best light milti hai).\n` +
            (p.nearby_places && p.nearby_places.length > 0 ? `• **Nearby Add-on**: Pass mein ${p.nearby_places[0].name} bhi hai jise aap same afternoon explore kar sakte hain.\n\n` : '\n') +
            `Kya aap iske around **1-Day ${p.city} Itinerary** dekhna chahte hain ya nearby attractions explore karne hain?`
          : `🏛️ **${p.name} (${p.city}, ${p.state}) Visit Duration**:\n\n` +
            `• **Recommended Duration**: ${p.recommended_duration}\n` +
            `• **Optimal Hours**: ${p.visiting_hours} (Early morning or sunset provides the best ambient lighting and sea breeze).\n\n` +
            `Would you like a full **1-Day Itinerary** around ${p.name} or nearby sights?`,
        suggested_actions: ['Nearby Kya Hai?', `1-Day ${p.city} Plan`, `${p.name} ke Paas Food`, `Hotels near ${p.name}`],
        actions: [
          { type: 'open_map', label: `Show ${p.name} on Map`, url: `/map?q=${encodeURIComponent(p.name)}&city=${encodeURIComponent(p.city)}` },
          { type: 'view_destination', label: 'View in Virasat', url: `/place/${encodeURIComponent(p.id)}` },
          { type: 'plan_itinerary', label: `Plan ${p.city} Trip`, url: `/itinerary?city=${encodeURIComponent(p.city)}&days=1` },
        ],
        sources: ['Archaeological Survey of India (ASI)', 'State Tourism Gazette', 'Virasat Master Tourism Registry'],
      };
    }

    // How to reach focus
    if (focus === 'how_to_reach') {
      return {
        reply: isHinglish
          ? `🚆 **${p.name} (${p.city}, ${p.state}) Kaise Pahunchein**:\n\n` +
            `${p.how_to_reach}\n\n` +
            `• **Visiting Hours**: ${p.visiting_hours}\n` +
            `• **Entry Fee**: ${p.entry_fee}\n\n` +
            `Kya aap iske paas ke hotels dekhna chahte hain ya ${p.city} ka full plan banana hai?`
          : `🚆 **How to Reach ${p.name} (${p.city}, ${p.state})**:\n\n` +
            `${p.how_to_reach}\n\n` +
            `• **Visiting Hours**: ${p.visiting_hours}\n` +
            `• **Entry Fee**: ${p.entry_fee}\n\n` +
            `Would you like to check hotels near ${p.name} or plan a full trip to ${p.city}?`,
        suggested_actions: ['Nearby Kya Hai?', `Hotels near ${p.name}`, `1-Day ${p.city} Plan`, 'Ticket Info'],
        actions: [
          { type: 'open_map', label: 'Show on Map', url: `/map?q=${encodeURIComponent(p.name)}&city=${encodeURIComponent(p.city)}` },
          { type: 'view_destination', label: 'View in Virasat', url: `/place/${encodeURIComponent(p.id)}` },
          { type: 'plan_itinerary', label: `Plan ${p.city} Trip`, url: `/itinerary?city=${encodeURIComponent(p.city)}&days=1` },
        ],
        sources: ['Archaeological Survey of India (ASI)', 'State Tourism Gazette', 'Virasat Master Tourism Registry'],
      };
    }

    const nearbyList = (p.nearby_places || [])
      .map((nb, i) => `${i + 1}. 🏛️ **${nb.name}** (${nb.category || 'Heritage'}) — ${nb.summary || 'Verified cultural landmark'}`)
      .join('\n');

    return {
      reply: isHinglish
        ? `Bilkul! 😊 **${p.name}** ${p.city} (${p.state}) ka ek iconic aur aitihasik waterfront sthal hai:\n\n` +
          `🏛️ **${p.name}**\n` +
          `📍 ${p.city}, ${p.state}\n\n` +
          `### 🕰️ Historical Significance\n${p.historical_significance}\n\n` +
          `### 🏗️ Architecture & Features\n${p.architecture}\n\n` +
          `### ⭐ Why Visit?\n${p.why_visit}\n\n` +
          `### ⏱️ Recommended Visit Duration\n${p.recommended_duration} (Sunset ya early morning best lighting aur sea breeze ke liye ideal hai)\n\n` +
          (nearbyList ? `### 📍 Nearby Attractions in ${p.city}\n${nearbyList}\n\n` : '') +
          `### 🚆 How to Reach\n${p.how_to_reach}\n\n` +
          `### 💰 Visiting & Entry Info\n• **Entry Fee**: ${p.entry_fee}\n• **Timings**: ${p.visiting_hours}\n\n` +
          `Agar aap chahein, main ${p.name} ke around **1-Day ${p.city} Heritage Plan** bana sakta hoon, ya paas ke **food spots** aur **hotels** suggest kar doon?`
        : `Certainly! 😊 Here is the verified heritage dossier for **${p.name}** in ${p.city}, ${p.state}:\n\n` +
          `🏛️ **${p.name}**\n` +
          `📍 ${p.city}, ${p.state}\n\n` +
          `### 🕰️ Historical Background\n${p.historical_significance}\n\n` +
          `### 🏗️ Architecture & Features\n${p.architecture}\n\n` +
          `### ⭐ Why Visit?\n${p.why_visit}\n\n` +
          `### ⏱️ Recommended Visit Duration\n${p.recommended_duration}\n\n` +
          (nearbyList ? `### 📍 Nearby Sights in ${p.city}\n${nearbyList}\n\n` : '') +
          `### 🚆 How to Reach\n${p.how_to_reach}\n\n` +
          `### 💰 Visiting & Entry Info\n• **Entry Fee**: ${p.entry_fee}\n• **Timings**: ${p.visiting_hours}\n\n` +
          `Would you like me to build a tailored **1-Day ${p.city} Heritage Plan** centered around ${p.name}, or explore nearby culinary spots and stays?`,
      suggested_actions: [
        'Nearby Kya Hai?',
        `1-Day ${p.city} Plan`,
        `${p.name} ke Paas Food`,
        `Hotels near ${p.name}`,
        'Show on Map',
      ],
      actions: [
        { type: 'open_map', label: `Show ${p.name} on Map`, url: `/map?q=${encodeURIComponent(p.name)}&city=${encodeURIComponent(p.city)}` },
        { type: 'view_destination', label: 'View in Virasat', url: `/place/${encodeURIComponent(p.id)}` },
        { type: 'plan_itinerary', label: `Plan ${p.city} Trip`, url: `/itinerary?city=${encodeURIComponent(p.city)}&days=1` },
      ],
      sources: ['Archaeological Survey of India (ASI)', 'State Tourism Gazette', 'Virasat Master Tourism Registry'],
    };
  }

  // 12. NEARBY_SEARCH ("nearby kya hai?", "wahan aur kya hai?")
  if (intent === 'NEARBY_SEARCH') {
    const place = intentResult.resolvedPlace || state.lastPlace;
    const cityName = place?.city || state.destination || 'Mumbai';
    const placeName = place?.name || cityName;

    const nearbyList = place?.nearby_places && place.nearby_places.length > 0
      ? place.nearby_places.map((nb, i) => `${i + 1}. 🏛️ **${nb.name}** — ${nb.summary || 'Iconic cultural landmark'}`).join('\n\n')
      : `1. 🏛️ **Elephanta Caves**: Jetty No. 1 se ferry lekar UNESCO World Heritage rock-cut cave temples pahunchein (~1 hour ferry ride).\n\n` +
        `2. 🌊 **Marine Drive (Queen's Necklace)**: ~2.5 km door Arabian Sea sunset promenade aur evening breeze.\n\n` +
        `3. 🛍️ **Colaba Causeway**: 5-minute walk par historic street shopping, brass curios aur heritage cafes (Cafe Mondegar, Leopold).\n\n` +
        `4. 🚂 **CSMT (Chhatrapati Shivaji Maharaj Terminus)**: UNESCO World Heritage Victorian Gothic railway headquarters (~2.8 km).`;

    return {
      reply: isHinglish
        ? `**${placeName} (${cityName}) ke paas yeh pramukh heritage aur cultural sthal hain**:\n\n` +
          `${nearbyList}\n\n` +
          `Kya aap inka **1-Day ${cityName} Plan** banana chahte hain ya ferry / transit timings dekhni hain?`
        : `**Prominent cultural and heritage sights near ${placeName} (${cityName})**:\n\n` +
          `${nearbyList}\n\n` +
          `Would you like me to build a **1-Day ${cityName} Heritage Itinerary** covering these, or check transit options?`,
      suggested_actions: [
        `1-Day ${cityName} Plan`,
        `${cityName} Food Spots`,
        `Hotels near ${placeName}`,
        'Show on Map',
      ],
      actions: [
        { type: 'open_map', label: `Show Nearby on Map`, url: `/map?city=${encodeURIComponent(cityName)}` },
        { type: 'plan_itinerary', label: `Plan ${cityName} Plan`, url: `/itinerary?city=${encodeURIComponent(cityName)}&days=1` },
        { type: 'view_destination', label: `Explore ${cityName}`, url: `/city/${encodeURIComponent(cityName.toLowerCase().replace(/\s+/g, '-'))}` },
      ],
      sources: ['Archaeological Survey of India (ASI)', 'State Tourism Gazette', 'Virasat Master Tourism Registry'],
    };
  }

  // 13. YOU_DECIDE MODE (Section 36)
  if (intent === 'YOU_DECIDE') {
    const origin = state.origin || 'Mumbai';
    const budgetStr = state.budget ? `₹${state.budget.toLocaleString('en-IN')}` : '₹15,000';
    const daysStr = state.duration_days || 3;

    return {
      reply: isHinglish
        ? `Aapke **${origin}** origin, **${daysStr} din** aur **${budgetStr}** budget ko dhyan mein rakhte hue, maine 3 practical aur high-value destinations chune hain:\n\n` +
          `1. 🏰 **Udaipur (City of Lakes)**: Direct overnight train connectivity, scenic Pichola lake palaces, rich Mewar history, aur ₹12k-15k ke andar comfortable stay.\n\n` +
          `2. 🏛️ **Hampi & Badami**: UNESCO World Heritage boulder landscapes aur Vijayanagara temples. Offbeat, safe aur deeply spiritual circuit.\n\n` +
          `3. 🏖️ **South Goa Heritage (Old Goa & Palolem)**: Portuguese baroque churches, spice plantations, aur peaceful beaches. Monsoons & winters dono mein behtareen.\n\n` +
          `Kaunsi destination aapko sabse zyada pasand aayi? Bas boliye *"Udaipur plan karo"* ya *"Hampi chalo"*!`
        : `Considering your origin **${origin}**, **${daysStr} days** window, and budget of **${budgetStr}**, here are 3 optimal, high-value destinations:\n\n` +
          `1. 🏰 **Udaipur, Rajasthan**: Direct overnight IRCTC rail connectivity, scenic Lake Pichola, royal Mewar history, and comfortable stays under ₹15,000.\n\n` +
          `2. 🏛️ **Hampi, Karnataka**: Monumental boulder ruins of the Vijayanagara Empire and Virupaksha Temple. Ideal for culture lovers.\n\n` +
          `3. 🏖️ **South Goa Heritage**: UNESCO churches of Old Goa, spice plantations, and serene coastal tranquility.\n\n` +
          `Which circuit speaks to you? Simply say *"Plan Udaipur"* or *"Let's do Hampi"*!`,
      suggested_actions: ['Plan Udaipur', 'Plan Hampi', 'Plan Jaipur', 'Compare Destinations'],
      actions: [
        { type: 'plan_itinerary', label: 'Plan Udaipur Trip', url: '/itinerary?city=Udaipur&days=3' },
        { type: 'open_map', label: 'Explore on Map', url: '/map' },
      ],
    };
  }

  // 14. TRIP_PLANNING (Multi-day or 1-day plans)
  if (intent === 'TRIP_PLANNING' && plan) {
    const dateNote = plan.travel_dates ? `📅 **Travel dates**: ${plan.travel_dates}\n\n` : '';
    const daySummaries = plan.days
      .map(
        (d) =>
          `📅 **Day ${d.day_number}: ${d.theme}**\n` +
          `• **Morning**: ${d.morning_cluster.places.map((p: any) => p.name).join(', ') || 'Heritage Exploration'} (${d.morning_cluster.duration})\n` +
          `• **Afternoon**: ${d.afternoon_cluster.places.map((p: any) => p.name).join(', ') || 'Cultural Precinct'} | *Lunch: ${d.afternoon_cluster.lunch_spot}*\n` +
          `• **Evening**: ${d.evening_cluster.places.map((p: any) => p.name).join(', ') || 'Sunset Promenade'} | *${d.evening_cluster.sunset_or_aarti}*`
      )
      .join('\n\n');

    return {
      reply: isHinglish
        ? `Bilkul! Virasat ke available place records se **${plan.destination}** ke liye **${plan.duration_days}-day draft** (${plan.party_size} traveler${plan.party_size === 1 ? '' : 's'}) bana diya:\n\n` +
          dateNote +
          `${daySummaries}\n\n` +
          (plan.duration_days > 1 ? `🏨 **Accommodation**: ${plan.hotel_recommendation.tier} (~${plan.hotel_recommendation.rate_indication})\n` : '') +
          `🚆 **Transport**: ${plan.transport_recommendation.summary}\n` +
          `💰 **Illustrative local-trip budget**: ${plan.budget_breakdown.total_estimated}\n` +
          `Timings, hotel allowances, tickets and local costs are planning estimates; they are not live prices or confirmed schedules. Intercity fares are not included.\n\n` +
          `Aap is plan ko customize kar sakte hain — jaise *"budget 5000 kar do"*, *"ab sirf heritage places include karo"*, ya *"is itinerary ka map kholo"*!`
        : `Here is a **${plan.duration_days}-day draft for ${plan.destination}** for ${plan.party_size} traveler${plan.party_size === 1 ? '' : 's'}, using Virasat's available place records:\n\n` +
          dateNote +
          `${daySummaries}\n\n` +
          (plan.duration_days > 1 ? `🏨 **Stays**: ${plan.hotel_recommendation.tier} tier (~${plan.hotel_recommendation.rate_indication})\n` : '') +
          `🚆 **Transport**: ${plan.transport_recommendation.summary}\n` +
          `💰 **Illustrative local-trip budget**: ${plan.budget_breakdown.total_estimated}\n` +
          `Timings, hotel allowances, tickets, and local costs are planning estimates, not live prices or confirmed schedules. Intercity fares are not included.\n\n` +
          `You can modify this naturally — say *"set budget to 5000"*, *"only heritage places"*, or *"open map"*!`,
      suggested_actions: ['Budget 5000 Kar Do', 'Ab Sirf Heritage Places', 'Is Itinerary Ka Map Kholo', 'Train Options'],
      actions: [
        { type: 'open_map', label: `Show ${plan.destination} on Map`, url: `/map?city=${encodeURIComponent(plan.destination)}` },
        { type: 'plan_itinerary', label: 'Open in Itinerary Planner', url: `/itinerary?city=${encodeURIComponent(plan.destination)}&days=${plan.duration_days}` },
        { type: 'view_destination', label: `Explore ${plan.destination}`, url: `/city/${encodeURIComponent(plan.destination.toLowerCase().replace(/\s+/g, '-'))}` },
      ],
      sources: ['Virasat Master Tourism Registry', 'Virasat planning estimate assumptions'],
    };
  }

  // 15. ITINERARY_MODIFICATION ("Budget 5000 kar do", "Ab sirf heritage places include karo")
  if (intent === 'ITINERARY_MODIFICATION') {
    const dest = state.destination || 'Jaipur';
    const style = state.travel_style || 'budget-friendly';
    const hTier = state.hotel_tier || 'moderate';
    const query = rawQuery;
    const isHeritageOnly = /sirf heritage|heritage places|only heritage/i.test(query);
    const isSpiritual = /spiritual|mandir|temple|ghat/i.test(query) || (state.interests && state.interests.includes('spiritual'));
    const isFood = /food|khana/i.test(query);

    let modificationDetail = '';
    if (isHeritageOnly) {
      modificationDetail = isHinglish
        ? `• **Strict Heritage Focus**: Sirf verified ASI & UNESCO historical monuments aur royal forts include kiye gaye hain (no modern shopping/entertainment).\n`
        : `• **Strict Heritage Focus**: Concentrating exclusively on verified ASI & UNESCO monuments, royal palaces, and fortified citadels.\n`;
    }
    if (isSpiritual) {
      modificationDetail += isHinglish
        ? `• **Added Spiritual Sanctuary**: 🛕 **Govind Dev Ji Mandir / Birla Mandir** (Morning Sacred Darshan & Shanti)\n`
        : `• **Added Spiritual Sanctuary**: 🛕 **Govind Dev Ji Temple / Birla Mandir** (Morning Darshan & Peaceful Aarti)\n`;
    }
    if (isFood) {
      modificationDetail += isHinglish
        ? `• **Added Culinary Stops**: 🍲 **Authentic Street Food & Heritage Eateries** (Local specialties, kachori & lassi)\n`
        : `• **Added Culinary Stops**: 🍲 **Iconic Heritage Cafes & Street Food Walks**\n`;
    }

    const daySummaries = plan
      ? plan.days
          .map(
            (d) =>
              `📅 **Day ${d.day_number}: ${d.theme}**\n` +
              `• **Morning**: ${d.morning_cluster.places.map((p: any) => p.name).join(', ') || 'Heritage Exploration'} (${d.morning_cluster.duration})\n` +
              `• **Afternoon**: ${d.afternoon_cluster.places.map((p: any) => p.name).join(', ') || 'Cultural Precinct'}\n` +
              `• **Evening**: ${d.evening_cluster.places.map((p: any) => p.name).join(', ') || 'Promenade'}`
          )
          .join('\n\n')
      : '';

    const budgetDisplay = state.budget ? `₹${state.budget.toLocaleString('en-IN')}` : (plan ? plan.budget_breakdown.total_estimated : '₹5,000');

    return {
      reply: isHinglish
        ? `Samajh gaya! Maine aapke **${dest}** itinerary aur preferences ko update kar diya hai:\n\n` +
          modificationDetail +
          `• **Target Budget**: ~${budgetDisplay} (Budget-optimized stays & local transit)\n` +
          `• **Hotel Preference**: ${hTier.toUpperCase()} Stays\n` +
          `• **Travel Style**: ${style.toUpperCase()}\n` +
          `• **Transport**: Rail / Mainline IRCTC (Cost-effective)\n\n` +
          (daySummaries ? `**Updated Day-wise Plan**:\n${daySummaries}\n\n` : '') +
          `Kya aap is plan ko map par dekhna chahte hain ya train options check karni hain?`
        : `Understood! I have updated your **${dest}** itinerary and preferences:\n\n` +
          modificationDetail +
          `• **Target Budget**: ~${budgetDisplay} (Optimized for budget stays & public transit)\n` +
          `• **Hotel Category**: ${hTier.toUpperCase()} Stays\n` +
          `• **Travel Style**: ${style.toUpperCase()}\n` +
          `• **Transport Optimization**: Mainline IRCTC Rail\n\n` +
          (daySummaries ? `**Updated Day-by-Day Schedule**:\n${daySummaries}\n\n` : '') +
          `Would you like to open this on the map or review train connections?`,
      suggested_actions: ['Is Itinerary Ka Map Kholo', 'Train Options', 'Find Heritage Hotels', 'Save Itinerary'],
      actions: [
        { type: 'open_map', label: `Show on Map (${dest})`, url: `/map?city=${encodeURIComponent(dest)}` },
        { type: 'plan_itinerary', label: 'View in Itinerary Planner', url: `/itinerary?city=${encodeURIComponent(dest)}&days=3` },
        { type: 'booking_link', label: 'Official IRCTC Rail Link', url: 'https://www.irctc.co.in/' },
      ],
      sources: ['Archaeological Survey of India', 'Virasat Itinerary Optimizer', 'IRCTC Mainline Directory'],
    };
  }

  // 16. COMPARISON (Jaipur vs Udaipur, etc.)
  if (intent === 'COMPARISON') {
    return {
      reply: isHinglish
        ? 'Kaun se do shehron ya options ko compare karna hai? Naam batao, aur agar chaho toh distance, budget, heritage ya travel time ke basis par compare karunga.'
        : 'Which two cities or options should I compare? Tell me the names and I can compare them by distance, budget, heritage, or travel time.',
      suggested_actions: ['Compare Mumbai and Delhi', 'Compare Jaipur and Udaipur', 'Distance between cities'],
      actions: [
        { type: 'explore_states', label: 'Discover Bharat', url: '/explore' },
      ],
    };
  }

  // 17. Default / Informational Fallback (Non-repetitive, context-aware)
  const activeCity = state.destination || state.lastPlace?.city || 'Bharat';
  return {
    reply: isHinglish
      ? `Main ${activeCity} ya Bharat ke kisi bhi shehar ya monument ke baare mein verified details provide kar sakta hoon — jaise entry fee, timing, history, nearby food aur stays. Aap kya dekhna chahte hain?`
      : `I can provide verified details for ${activeCity} or any monument across India — including entry timings, ticket fees, history, and nearby recommendations. How may I help?`,
    suggested_actions: ['Plan a Trip', 'Explore Near Me', 'Top Heritage Forts', 'Emergency Helpline'],
    actions: [
      { type: 'open_map', label: 'Open Map', url: activeCity !== 'Bharat' ? `/map?city=${encodeURIComponent(activeCity)}` : '/map' },
      { type: 'plan_itinerary', label: 'Plan Itinerary', url: activeCity !== 'Bharat' ? `/itinerary?city=${encodeURIComponent(activeCity)}` : '/itinerary' },
    ],
  };
}
