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
        ? "Aap Virasat ke saath baat kar rahe hain — ek AI Travel & Heritage Concierge jo Archaeological Survey of India (ASI) aur State Tourism data par grounded hai. Main travel circuits plan karta hoon, hotels aur train routes compare karta hoon, aur India ke har monument ki authentic history batata hoon."
        : "You're chatting with Virasat — an intelligent AI Travel & Heritage Concierge grounded in official Archaeological Survey of India (ASI) and Ministry of Tourism records. I help you craft personalized circuits, compare multimodal transit, find heritage stays, and discover India's profound history.",
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
        ? "Virasat par aap natural bhasha mein kuch bhi pooch sakte hain:\n\n" +
          "• **Heritage & Monuments**: *'Gateway of India ke baare mein batao'*, *'Hawa Mahal ka history'*\n" +
          "• **Trip Planning**: *'Mujhe Jaipur ghumna hai 2 din mein'*, *'Budget 5000 hai, 3 friends hain, itinerary bana'*\n" +
          "• **Itinerary Customization**: *'budget 5000 kar do'*, *'ab sirf heritage places include karo'*\n" +
          "• **Website Actions**: *'Map kholo'*, *'Iska map dikhao'*\n" +
          "• **Festivals & Culture**: *'Mysore Dasara kab hota hai aur kyun famous hai?'*, *'Durga Puja ka significance'*\n" +
          "• **Transport & Trains**: *'Mumbai se Pune train se kaise jaun?'*, *'Ticket kahan book karna hai?'*\n" +
          "• **National Parks & Nature**: *'Kaziranga National Park kis state mein hai?'*, *'Udaipur ke hidden gems'*"
        : "Here is what you can ask Virasat naturally:\n\n" +
          "• **Heritage & Monuments**: *'Tell me about Gateway of India'*, *'History of Hawa Mahal'*\n" +
          "• **Trip Planning**: *'Plan a 3-day Jaipur trip under ₹15,000'*, *'Budget 5000, 3 friends, build itinerary'*\n" +
          "• **Dynamic Modification**: *'Make it cheaper'*, *'Set budget to ₹5,000'*, *'Only heritage places'*\n" +
          "• **Website Navigation**: *'Open map'*, *'Show on map'*\n" +
          "• **Festivals & Culture**: *'When is Mysore Dasara and why is it celebrated?'*, *'Durga Puja significance'*\n" +
          "• **Multimodal Transit**: *'How to reach Pune from Mumbai by train?'*, *'Where to book train tickets?'*\n" +
          "• **Nature & Reserves**: *'Which state is Kaziranga National Park in?'*, *'Hidden gems in Udaipur'*",
      suggested_actions: ['Plan a 3-Day Trip', 'Explore Near Me', 'Top UNESCO Sites', 'Mysore Dasara Info'],
      actions: [
        { type: 'plan_itinerary', label: 'Plan Itinerary', url: '/itinerary' },
        { type: 'explore_heritage', label: 'UNESCO Sites', url: '/heritage' },
        { type: 'open_map', label: 'Open Map', url: '/map' },
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
    const targetCity = state.destination || state.lastPlace?.city || 'India';
    const mapUrl = state.destination ? `/map?city=${encodeURIComponent(state.destination)}` : '/map';

    return {
      reply: isHinglish
        ? `🗺️ **Interactive Virasat Map khol diya gaya hai!**\n\nAap **${targetCity}** ke verified UNESCO/ASI monuments, heritage clusters, transit corridors aur hidden gems ko map par geospatial view mein dekh sakte hain. Niche diye gaye **Open Map** button par tap karke seedhe interactive cartography page par jayein.`
        : `🗺️ **Virasat Interactive Heritage Map is ready!**\n\nYou can explore verified UNESCO/ASI monuments, heritage clusters, transit corridors, and hidden gems for **${targetCity}** on the interactive map. Tap the **Open Map** button below to navigate directly to the cartography view.`,
      suggested_actions: ['Explore Near Me', 'Show Nearby Places', `Plan ${targetCity} Trip`, 'Calculate Transit'],
      actions: [
        { type: 'open_map', label: `Open Map (${targetCity})`, url: mapUrl },
        ...(state.destination
          ? [
              {
                type: 'view_destination' as const,
                label: `Explore ${state.destination}`,
                url: `/city/${encodeURIComponent(state.destination.toLowerCase().replace(/\s+/g, '-'))}`,
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

  // 9. NATIONAL_PARK_QUERY ("Kaziranga National Park kis state mein hai?")
  if (intent === 'NATIONAL_PARK_QUERY') {
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

  // 10. HIDDEN_GEMS_QUERY ("Udaipur ke hidden gems batao")
  if (intent === 'HIDDEN_GEMS_QUERY') {
    const city = state.destination || 'Udaipur';
    return {
      reply: isHinglish
        ? `💎 **${city} ke Verified Hidden Gems (Offbeat & Authentic Experiences)**:\n\n` +
          `1. 🏰 **Sajjangarh (Monsoon Palace)**: Aravalli ki Bansdara pahadi par sthit 19th-century royal retreat, jahan se Fateh Sagar aur City Palace ka dramatic sunset view milta hai.\n\n` +
          `2. 🏞️ **Bahubali Hills & Badi Lake**: Main city se 12 km door shaant jheel jahan se green Aravalli hills ka panoramic 360-degree viewpoint milta hai (early morning photography ke liye ideal).\n\n` +
          `3. 🏛️ **Ahar Royal Cenotaphs (Mahasatyaji)**: Mewar ke 19 maharanon ke 250 se zyada intricate white marble aur sandstone chhatriyan. Mainstream bheed se alag shanti aur architectural photography spot.\n\n` +
          `4. 🌿 **Rayta Hills & Pipliya Village**: Udaipur ka offbeat monsoon hill corridor, winding ghat roads aur lush cloud-covered viewpoints.\n\n` +
          `5. 🦩 **Menar Bird Village**: Udaipur-Chittorgarh highway par ek community-protected wetland sanctuary jahan thousands of migratory birds (Pelicans, Flamingos) aate hain.\n\n` +
          `📌 *Authenticity Note*: Yeh verified offbeat places hain jo mainstream crowded monuments se alag shanti aur natural soundscape provide karte hain.`
        : `💎 **Verified Hidden Gems & Offbeat Attractions in ${city}**:\n\n` +
          `1. 🏰 **Sajjangarh Monsoon Palace**: Perched on Bansdara peak in the Aravalli hills, offering sweeping sunset vistas over Lake Fateh Sagar and royal palace silhouettes.\n\n` +
          `2. 🏞️ **Bahubali Hills at Badi Lake**: Located ~12 km from the city center, offering a tranquil panoramic viewpoint over the turquoise waters of Lake Badi.\n\n` +
          `3. 🏛️ **Ahar Royal Cenotaphs**: Over 250 exquisitely carved domed chhatris commemorating 19 Mewar Maharanas across four centuries. Serene and uncrowded.\n\n` +
          `4. 🌿 **Rayta Hills Corridor**: A scenic winding ghat route through the rural Aravalli landscape, especially breathtaking during post-monsoon months.\n\n` +
          `5. 🦩 **Menar Wetland Bird Sanctuary**: A vibrant community-conserved wetland lake hosting migratory birds including greater flamingos and pelicans in winter.\n\n` +
          `📌 *Distinction*: These offbeat spots are distinctly categorized from officially protected ASI monuments to give you quiet, authentic cultural immersion.`,
      suggested_actions: [`Plan ${city} Trip`, `Open ${city} Map`, `Find Hotels in ${city}`, 'Top Heritage Monuments'],
      actions: [
        { type: 'open_map', label: `Open ${city} Map`, url: `/map?city=${encodeURIComponent(city)}` },
        { type: 'plan_itinerary', label: `Plan ${city} Itinerary`, url: `/itinerary?city=${encodeURIComponent(city)}&days=3` },
        { type: 'view_destination', label: `View ${city} Hub`, url: `/city/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, '-'))}` },
      ],
      sources: ['Virasat Verified Hidden Gems Archive', 'Rajasthan State Tourism'],
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
        ? `Bilkul! Aapke liye **${plan.destination}** ka **${plan.duration_days}-Day Smart Itinerary** tayyar hai:\n\n` +
          `${daySummaries}\n\n` +
          (plan.duration_days > 1 ? `🏨 **Accommodation**: ${plan.hotel_recommendation.tier} (~${plan.hotel_recommendation.rate_indication})\n` : '') +
          `🚆 **Transport**: ${plan.transport_recommendation.mode} (${plan.transport_recommendation.approx_duration})\n` +
          `💰 **Estimated Budget**: ${plan.budget_breakdown.total_estimated} (includes transit, food & tickets)\n\n` +
          `Aap is plan ko customize kar sakte hain — jaise *"budget 5000 kar do"*, *"ab sirf heritage places include karo"*, ya *"is itinerary ka map kholo"*!`
        : `Here is your cluster-optimized **${plan.duration_days}-Day Itinerary for ${plan.destination}**:\n\n` +
          `${daySummaries}\n\n` +
          (plan.duration_days > 1 ? `🏨 **Stays**: ${plan.hotel_recommendation.tier} tier (~${plan.hotel_recommendation.rate_indication})\n` : '') +
          `🚆 **Transit**: ${plan.transport_recommendation.mode} (~${plan.transport_recommendation.approx_duration})\n` +
          `💰 **Estimated Budget**: ${plan.budget_breakdown.total_estimated} total breakdown.\n\n` +
          `You can modify this naturally — say *"set budget to 5000"*, *"only heritage places"*, or *"open map"*!`,
      suggested_actions: ['Budget 5000 Kar Do', 'Ab Sirf Heritage Places', 'Is Itinerary Ka Map Kholo', 'Train Options'],
      actions: [
        { type: 'open_map', label: `Show ${plan.destination} on Map`, url: `/map?city=${encodeURIComponent(plan.destination)}` },
        { type: 'plan_itinerary', label: 'Open in Itinerary Planner', url: `/itinerary?city=${encodeURIComponent(plan.destination)}&days=${plan.duration_days}` },
        { type: 'view_destination', label: `Explore ${plan.destination}`, url: `/city/${encodeURIComponent(plan.destination.toLowerCase().replace(/\s+/g, '-'))}` },
      ],
      sources: ['Archaeological Survey of India', 'Indian Railways IRCTC', 'Virasat Tourism Database'],
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
        ? `**Jaipur vs Udaipur — Ek Nazar Mein**:\n\n` +
          `• 🏰 **Jaipur (The Pink City)**: Grand massive hill forts (Amber, Nahargarh, Jaigarh), bustling vibrant bazaars (Johari, Bapu), world-famous street food (Pyaaz Kachori), aur royal palace museums. Travel time Delhi/Mumbai se thoda kam hai.\n\n` +
          `• 🌅 **Udaipur (City of Lakes)**: Romantically tranquil, Lake Pichola boat rides, intricate white marble City Palace, rooftop sunset cafes, aur relaxed lake breeze. Couples aur leisure travelers ke liye ideal.\n\n` +
          `👉 **Virasat Recommendation**: Agar aapko grand military architecture aur vibrant shopping pasand hai toh **Jaipur** chuniye; agar scenic lakes aur peaceful evening vibes chahiye toh **Udaipur** perfect hai!`
        : `**Jaipur vs Udaipur Comparison**:\n\n` +
          `• 🏰 **Jaipur (The Pink City)**: Imposing military hill forts (Amber, Jaigarh, Nahargarh), vibrant heritage bazaars, iconic culinary spots (Ghewar, Kachori). Best for high-energy exploration.\n\n` +
          `• 🌅 **Udaipur (City of Lakes)**: Peaceful Lake Pichola, island palaces (Jag Mandir, Taj Lake Palace), scenic sunsets. Best for leisurely cultural immersion.\n\n` +
          `👉 **Recommendation**: Pick **Jaipur** for grand fort architecture & shopping; pick **Udaipur** for tranquil romantic lakeside evenings.`,
      suggested_actions: ['Plan Jaipur Trip', 'Plan Udaipur Trip', 'Jaipur Hotels', 'Udaipur Hotels'],
      actions: [
        { type: 'plan_itinerary', label: 'Plan Jaipur Trip', url: '/itinerary?city=Jaipur&days=3' },
        { type: 'plan_itinerary', label: 'Plan Udaipur Trip', url: '/itinerary?city=Udaipur&days=3' },
        { type: 'open_map', label: 'Compare on Map', url: '/map' },
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
