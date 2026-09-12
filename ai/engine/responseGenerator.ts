import { UserIntent, IntentResult } from './intentEngine';
import { TripMemoryState } from './conversationMemory';
import { GeneratedTripPlan } from './itineraryPlanner';
import { ResolvedPlace } from './placeResolver';

export interface FormattedResponse {
  reply: string;
  suggested_actions: string[];
  sources?: string[];
  grounding_score?: number;
}

/**
 * Crafts personalized, culturally grounded responses matching user language
 * (English vs Roman Hindi/Hinglish) with dynamic quick action chips.
 */
export function buildResponseForIntent(
  intentResult: IntentResult,
  state: TripMemoryState,
  plan?: GeneratedTripPlan,
  dataPayload?: any
): FormattedResponse {
  const isHinglish = intentResult.isHinglish;
  const intent = intentResult.intent;

  // 1. GREETING
  if (intent === 'GREETING') {
    return {
      reply: isHinglish
        ? 'Namaste! 👋 Main Virasat hoon — aapka AI Travel & Heritage Concierge. Aaj koi trip plan karni hai, kisi specific destination ko explore karna hai, ya Bharat ke royal heritage ke baare mein jaanna hai?'
        : "Namaste! 👋 I am Virasat — your AI Travel & Heritage Concierge. Would you like to plan a tailored circuit, explore a destination, or discover India's magnificent monuments today?",
      suggested_actions: ['Plan a Trip', 'Explore Near Me', 'Explore Heritage', 'Tell me about Jaipur'],
    };
  }

  // 2. CASUAL_CONVERSATION ("kaise ho", "how are you")
  if (intent === 'CASUAL_CONVERSATION') {
    return {
      reply: isHinglish
        ? 'Main bilkul badhiya hoon! 😄 Bharat ke 28 States aur 8 Union Territories ke travel insights ke saath ready hoon. Aap batao, aaj kahan ghumne ka plan hai?'
        : "I'm doing wonderful, thank you! 😄 Ready to help you discover heritage and travel circuits across all 36 regions of India. What's on your travel mind today?",
      suggested_actions: ['Plan a 3-Day Trip', 'Best places in Rajasthan', 'Explore Near Me', 'Budget Travel Tips'],
    };
  }

  // 3. ABOUT_VIRASAT ("what is this", "who are you")
  if (intent === 'ABOUT_VIRASAT') {
    return {
      reply: isHinglish
        ? "Aap Virasat ke saath baat kar rahe hain — ek AI Travel & Heritage Concierge jo Archaeological Survey of India (ASI) aur State Tourism data par grounded hai. Main travel circuits plan karta hoon, hotels aur train routes compare karta hoon, aur India ke har monument ki authentic history batata hoon."
        : "You're chatting with Virasat — an intelligent AI Travel & Heritage Concierge grounded in official Archaeological Survey of India (ASI) and Ministry of Tourism records. I help you craft personalized circuits, compare multimodal transit, find heritage stays, and discover India's profound history.",
      suggested_actions: ['Plan a Trip', 'Explore 28 States & 8 UTs', 'Top Monuments', 'How does Virasat work?'],
    };
  }

  // 4. HELP ("what can you do")
  if (intent === 'HELP') {
    return {
      reply: isHinglish
        ? "Virasat par aap natural bhasha mein kuch bhi pooch sakte hain:\n\n" +
          "• **Heritage & Monuments**: *'Gateway of India ke baare mein batao'*, *'Hawa Mahal ka history'*\n" +
          "• **Trip Planning**: *'bhai Mumbai se Jaipur 3 din ka plan bana de 15k me'*, *'1 din ka plan bana'*\n" +
          "• **Itinerary Customization**: *'hotel moderate rakh'*, *'make it cheaper'*, *'budget 2000 rakho'*, *'food bhi add karo'*\n" +
          "• **Nearby Discovery**: *'wahan aur kya hai?'*, *'Gateway ke nearby kya hai?'*\n" +
          "• **Transport & Trains**: *'Mumbai se Varanasi train ya flight?'*\n" +
          "• **Local Food & Stays**: *'Colaba street food'*, *'Hotels near Gateway of India'*"
        : "Here is what you can ask Virasat naturally:\n\n" +
          "• **Heritage & Monuments**: *'Tell me about Gateway of India'*, *'History of Hawa Mahal'*\n" +
          "• **Trip Planning**: *'Plan a 3-day Jaipur trip under ₹15,000'*, *'Build a 1-day Mumbai plan'*\n" +
          "• **Dynamic Modification**: *'Make it cheaper'*, *'Set budget to ₹2,000'*, *'Add food experiences'*\n" +
          "• **Nearby Sights**: *'What else is nearby?'*, *'Explore near me'*\n" +
          "• **Multimodal Transit**: *'Compare trains vs flights from Delhi to Udaipur'*\n" +
          "• **Culinary & Stays**: *'Authentic food in Colaba & heritage palace stays'*",
      suggested_actions: ['Plan a 3-Day Trip', 'Tell me about Gateway of India', 'Best places in Rajasthan', 'Explore Near Me'],
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

  // 6. MONUMENT_INFO (Direct, rich monument intelligence — Sections 5 & 6)
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
        'How to Reach',
      ],
      sources: ['Archaeological Survey of India (ASI)', 'State Tourism Gazette', 'Virasat Master Tourism Registry'],
    };
  }

  // 7. NEARBY_SEARCH ("nearby kya hai?", "wahan aur kya hai?")
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
        'How to Reach',
      ],
      sources: ['Archaeological Survey of India (ASI)', 'State Tourism Gazette', 'Virasat Master Tourism Registry'],
    };
  }

  // 8. YOU_DECIDE MODE (Section 36)
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
    };
  }

  // 9. TRIP_PLANNING (Multi-day or 1-day plans)
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
          `Aap is plan ko customize kar sakte hain — jaise *"budget 2000 rakho"*, *"food bhi add karo"*, ya *"hotel moderate rakh"*!`
        : `Here is your cluster-optimized **${plan.duration_days}-Day Itinerary for ${plan.destination}**:\n\n` +
          `${daySummaries}\n\n` +
          (plan.duration_days > 1 ? `🏨 **Stays**: ${plan.hotel_recommendation.tier} tier (~${plan.hotel_recommendation.rate_indication})\n` : '') +
          `🚆 **Transit**: ${plan.transport_recommendation.mode} (~${plan.transport_recommendation.approx_duration})\n` +
          `💰 **Estimated Budget**: ${plan.budget_breakdown.total_estimated} total breakdown.\n\n` +
          `You can modify this naturally — say *"budget 2000"*, *"add food"*, or *"hotel moderate"*!`,
      suggested_actions: ['Budget 2000 Rakho', 'Food Bhi Add Karo', 'Nearby Hotels', 'Final Budget Bata'],
      sources: ['Archaeological Survey of India', 'Indian Railways IRCTC', 'Virasat Tourism Database'],
    };
  }

  // 10. ITINERARY_MODIFICATION
  if (intent === 'ITINERARY_MODIFICATION') {
    const dest = state.destination || 'Jaipur';
    const style = state.travel_style || 'budget-friendly';
    const hTier = state.hotel_tier || 'moderate';
    const query = (intentResult.rawQuery || '').toLowerCase();
    const isSpiritual = /spiritual|mandir|temple|ghat/i.test(query) || (state.interests && state.interests.includes('spiritual'));
    const isFood = /food|khana/i.test(query);
    const isBudgetChange = /budget\s*(\d+)/i.test(query) || state.budget;

    let modificationDetail = '';
    if (isSpiritual) {
      modificationDetail = isHinglish
        ? `• **Added Spiritual Sanctuary**: 🛕 **Govind Dev Ji Mandir / Birla Mandir / Mumba Devi** (Morning Sacred Darshan & Shanti)\n`
        : `• **Added Spiritual Sanctuary**: 🛕 **Govind Dev Ji Temple / Birla Mandir** (Morning Darshan & Peaceful Aarti)\n`;
    }
    if (isFood) {
      modificationDetail += isHinglish
        ? `• **Added Culinary Stops**: 🍲 **Authentic Street Food & Heritage Eateries** (Local specialties, chai & snacks included)\n`
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

    const budgetDisplay = plan ? plan.budget_breakdown.total_estimated : (state.budget ? `₹${state.budget.toLocaleString('en-IN')}` : '₹14,400');

    return {
      reply: isHinglish
        ? `Samajh gaya! Maine aapke **${dest}** itinerary aur preferences ko update kar diya hai:\n\n` +
          modificationDetail +
          `• **Hotel Preference**: ${hTier.toUpperCase()} Stays (Clean, central heritage properties)\n` +
          `• **Travel Style**: ${style.toUpperCase()}\n` +
          `• **Transport**: Rail / Mainline IRCTC (Budget-optimized)\n` +
          `• **Naya Total Budget**: ~${budgetDisplay}\n\n` +
          (daySummaries ? `**Updated Day-wise Plan**:\n${daySummaries}\n\n` : '') +
          `Kya aap final budget breakdown dekhna chahte hain ya live booking check karni hai?`
        : `Understood! I have updated your **${dest}** itinerary and preferences:\n\n` +
          modificationDetail +
          `• **Hotel Category**: ${hTier.toUpperCase()} Stays\n` +
          `• **Travel Style**: ${style.toUpperCase()}\n` +
          `• **Transport Optimization**: Mainline IRCTC Rail\n` +
          `• **Revised Total Budget**: ~${budgetDisplay}\n\n` +
          (daySummaries ? `**Updated Day-by-Day Schedule**:\n${daySummaries}\n\n` : '') +
          `Would you like an itemized budget breakdown or transport connections?`,
      suggested_actions: ['Final Budget Bata', 'Show Full Itinerary', 'Find Heritage Hotels', 'Check Train Routes'],
      sources: ['Archaeological Survey of India', 'Virasat Itinerary Optimizer', 'IRCTC Mainline Directory'],
    };
  }

  // 11. COMPARISON (Jaipur vs Udaipur, etc.)
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
    };
  }

  // 12. Default / Informational Fallback (Non-repetitive, context-aware)
  const activeCity = state.destination || state.lastPlace?.city || 'Bharat';
  return {
    reply: isHinglish
      ? `Main ${activeCity} ya Bharat ke kisi bhi shehar ya monument ke baare mein verified details provide kar sakta hoon — jaise entry fee, timing, history, nearby food aur stays. Aap kya dekhna chahte hain?`
      : `I can provide verified details for ${activeCity} or any monument across India — including entry timings, ticket fees, history, and nearby recommendations. How may I help?`,
    suggested_actions: ['Plan a Trip', 'Explore Near Me', 'Top Heritage Forts', 'Emergency Helpline'],
  };
}
