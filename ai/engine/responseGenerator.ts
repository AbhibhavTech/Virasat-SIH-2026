import { UserIntent, IntentResult } from './intentEngine';
import { TripMemoryState } from './conversationMemory';
import { GeneratedTripPlan } from './itineraryPlanner';

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
          "• **Trip Planning**: *'bhai Mumbai se Jaipur 3 din ka plan bana de 15k me'*\n" +
          "• **Itinerary Customization**: *'hotel moderate rakh'*, *'make it cheaper'*, *'add spiritual place'*\n" +
          "• **Heritage & History**: *'Hawa Mahal ke baare mein batao'*\n" +
          "• **Transport & Trains**: *'Mumbai se Varanasi train ya flight?'*\n" +
          "• **Local Food & Stays**: *'Agra ka authentic street food aur heritage hotels'*\n" +
          "• **Budget & Helplines**: *'Estimated budget batao'*, *'Emergency helpline 1363'*"
        : "Here is what you can ask Virasat naturally:\n\n" +
          "• **Trip Planning**: *'Plan a 3-day heritage trip to Jaipur under ₹15,000'*\n" +
          "• **Dynamic Modification**: *'Make it cheaper'*, *'Keep hotels moderate'*, *'Add spiritual temples'*\n" +
          "• **Heritage Intelligence**: *'Tell me about the architecture of Konark Sun Temple'*\n" +
          "• **Multimodal Transit**: *'Compare trains vs flights from Delhi to Udaipur'*\n" +
          "• **Culinary & Stays**: *'Authentic Awadhi food in Lucknow & heritage palace stays'*\n" +
          "• **Budget & Safety**: *'Itemized budget breakdown'*, *'Tourist police helpline 1363'*",
      suggested_actions: ['Plan a 3-Day Trip', 'Best places in Rajasthan', 'How to reach Jaipur', 'Explore Near Me'],
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

  // 6. YOU_DECIDE MODE (Section 36)
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

  // 7. TRIP_PLANNING
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
          `🏨 **Accommodation**: ${plan.hotel_recommendation.tier} (~${plan.hotel_recommendation.rate_indication})\n` +
          `🚆 **Transport**: ${plan.transport_recommendation.mode} (${plan.transport_recommendation.approx_duration})\n` +
          `💰 **Estimated Budget**: ${plan.budget_breakdown.total_estimated} (includes stay, local transit, food & tickets)\n\n` +
          `Aap is plan ko customize kar sakte hain — jaise *"hotel moderate rakh"*, *"make it cheaper"*, ya *"add spiritual place"*!`
        : `Here is your cluster-optimized **${plan.duration_days}-Day Itinerary for ${plan.destination}**:\n\n` +
          `${daySummaries}\n\n` +
          `🏨 **Stays**: ${plan.hotel_recommendation.tier} tier (~${plan.hotel_recommendation.rate_indication})\n` +
          `🚆 **Transit**: ${plan.transport_recommendation.mode} (~${plan.transport_recommendation.approx_duration})\n` +
          `💰 **Estimated Budget**: ${plan.budget_breakdown.total_estimated} total breakdown.\n\n` +
          `You can modify this naturally — say *"make it cheaper"*, *"hotel moderate"*, or *"add spiritual places"*!`,
      suggested_actions: ['Hotel Moderate Rakh', 'Travel Cheap Karo', 'Add Spiritual Place', 'Final Budget Bata'],
      sources: ['Archaeological Survey of India', 'Indian Railways IRCTC', 'Virasat Tourism Database'],
    };
  }

  // 8. ITINERARY_MODIFICATION
  if (intent === 'ITINERARY_MODIFICATION') {
    const dest = state.destination || 'Jaipur';
    const style = state.travel_style || 'budget-friendly';
    const hTier = state.hotel_tier || 'moderate';
    const query = (intentResult.rawQuery || '').toLowerCase();
    const isSpiritual = /spiritual|mandir|temple|ghat/i.test(query) || (state.interests && state.interests.includes('spiritual'));

    let modificationDetail = '';
    if (isSpiritual) {
      modificationDetail = isHinglish
        ? `• **Added Spiritual Sanctuary**: 🛕 **Govind Dev Ji Mandir / Birla Mandir** (Morning Sacred Darshan & Shanti)\n`
        : `• **Added Spiritual Sanctuary**: 🛕 **Govind Dev Ji Temple / Birla Mandir** (Morning Darshan & Peaceful Aarti)\n`;
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

    return {
      reply: isHinglish
        ? `Samajh gaya! Maine aapke **${dest}** itinerary aur preferences ko update kar diya hai:\n\n` +
          modificationDetail +
          `• **Hotel Preference**: ${hTier.toUpperCase()} Stays (Clean, central heritage properties)\n` +
          `• **Travel Style**: ${style.toUpperCase()}\n` +
          `• **Transport**: Rail / Mainline IRCTC (Budget-optimized)\n` +
          (plan ? `• **Naya Total Budget**: ~${plan.budget_breakdown.total_estimated}\n\n` : '\n') +
          (isSpiritual && daySummaries ? `**Updated Day-wise Plan**:\n${daySummaries}\n\n` : '') +
          `Kya aap final budget breakdown dekhna chahte hain ya live booking check karni hai?`
        : `Understood! I have updated your **${dest}** itinerary and preferences:\n\n` +
          modificationDetail +
          `• **Hotel Category**: ${hTier.toUpperCase()} Stays\n` +
          `• **Travel Style**: ${style.toUpperCase()}\n` +
          `• **Transport Optimization**: Mainline IRCTC Rail\n` +
          (plan ? `• **Revised Total Budget**: ~${plan.budget_breakdown.total_estimated}\n\n` : '\n') +
          (isSpiritual && daySummaries ? `**Updated Day-by-Day Schedule**:\n${daySummaries}\n\n` : '') +
          `Would you like an itemized budget breakdown or transport connections?`,
      suggested_actions: ['Final Budget Bata', 'Show Full Itinerary', 'Find Heritage Hotels', 'Check Train Routes'],
      sources: ['Archaeological Survey of India', 'Virasat Itinerary Optimizer', 'IRCTC Mainline Directory'],
    };
  }

  // 9. COMPARISON (Jaipur vs Udaipur, etc.)
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

  // 10. Default / Informational Fallback
  return {
    reply: isHinglish
      ? `Aap Bharat ke kisi bhi shehar, rajya ya monument ke baare mein pooch sakte hain — chahe Jaipur ke forts hon, Varanasi ke ghats, ya Kerala ke backwaters. Main verified details provide karunga.`
      : `You can ask Virasat about any city, state, or monument in India — from the historic forts of Rajasthan to the spiritual ghats of Varanasi and backwaters of Kerala.`,
    suggested_actions: ['Plan a Trip', 'Explore Near Me', 'Top Heritage Forts', 'Emergency Helpline'],
  };
}
