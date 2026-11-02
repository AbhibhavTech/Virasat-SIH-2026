/**
 * Virasat High-Speed Comprehensive English-to-Hindi Translation Engine
 * Covers all UI phrases, navigation, tabs, destination data, wildlife,
 * heritage monuments, timings, ticket fees, states, cities, and filters.
 */

// 1. Exact Multi-Word Phrases (Checked first with highest priority)
export const EXACT_PHRASES_MAP: Record<string, string> = {
  // Navigation & Core Brand
  "Explore": "अन्वेषण",
  "Festivals": "त्यौहार एवं उत्सव",
  "Discover Bharat": "भारत दर्शन",
  "Heritage": "धरोहर एवं स्मारक",
  "Plan Trip": "यात्रा योजना",
  "AI Guide": "विरासत एआई गाइड",
  "More": "अन्य सुविधाएं",
  "Interactive Map": "इंटरैक्टिव मानचित्र",
  "My Trips": "मेरी यात्राएं",
  "Saved": "सहेजे गए",
  "Profile": "प्रोफ़ाइल",
  "Search": "खोजें",
  "Search...": "खोजें...",
  "Sign In": "साइन इन",
  "Sign Out": "लॉग आउट",
  "All India": "संपूर्ण भारत",
  "Region": "क्षेत्र",
  "24x7 Tourist Helpline": "24x7 पर्यटक हेल्पलाइन",
  "24x7 Tourist Emergency SOS Helpline": "24x7 आपातकालीन पर्यटक हेल्पलाइन",
  "Extended Tourism Tools": "विस्तृत पर्यटन साधन",
  "Admin & Verification": "प्रशासन एवं सत्यापन",
  "Audit, review places & official sources": "स्थानों एवं आधिकारिक स्रोतों की समीक्षा करें",
  "Select Exact Location": "सटीक स्थान चुनें",
  "Exact city & state pata karein": "सटीक शहर व राज्य चुनें",
  "Detect My Exact Location": "मेरा सटीक स्थान खोजें",
  "Detecting your GPS position...": "जीपीएस द्वारा आपका स्थान खोजा जा रहा है...",

  // Master Directory & Hero Banners
  "Consolidated Maharashtra Master Directory": "एकीकृत महाराष्ट्र मास्टर डायरेक्टरी",
  "Consolidated Rajasthan Master Directory": "एकीकृत राजस्थान मास्टर डायरेक्टरी",
  "Consolidated Uttar Pradesh Master Directory": "एकीकृत उत्तर प्रदेश मास्टर डायरेक्टरी",
  "Consolidated Gujarat Master Directory": "एकीकृत गुजरात मास्टर डायरेक्टरी",
  "Consolidated Madhya Pradesh Master Directory": "एकीकृत मध्य प्रदेश मास्टर डायरेक्टरी",
  "Consolidated Karnataka Master Directory": "एकीकृत कर्नाटक मास्टर डायरेक्टरी",
  "Consolidated Kerala Master Directory": "एकीकृत केरल मास्टर डायरेक्टरी",
  "Consolidated Tamil Nadu Master Directory": "एकीकृत तमिलनाडु मास्टर डायरेक्टरी",
  "Consolidated West Bengal Master Directory": "एकीकृत पश्चिम बंगाल मास्टर डायरेक्टरी",
  "Consolidated Uttarakhand Master Directory": "एकीकृत उत्तराखंड मास्टर डायरेक्टरी",
  "Consolidated Himachal Pradesh Master Directory": "एकीकृत हिमाचल प्रदेश मास्टर डायरेक्टरी",
  "Consolidated Assam Master Directory": "एकीकृत असम मास्टर डायरेक्टरी",
  "Consolidated Odisha Master Directory": "एकीकृत ओडिशा मास्टर डायरेक्टरी",
  "Consolidated Punjab Master Directory": "एकीकृत पंजाब मास्टर डायरेक्टरी",
  "Consolidated Bihar Master Directory": "एकीकृत बिहार मास्टर डायरेक्टरी",
  "Consolidated Goa Master Directory": "एकीकृत गोवा मास्टर डायरेक्टरी",
  "Consolidated Delhi Master Directory": "एकीकृत दिल्ली मास्टर डायरेक्टरी",
  "Consolidated Jammu & Kashmir Master Directory": "एकीकृत जम्मू-कश्मीर मास्टर डायरेक्टरी",
  "Consolidated Ladakh Master Directory": "एकीकृत लद्दाख मास्टर डायरेक्टरी",

  // Directory Tabs & Headers
  "Attractions & Sights": "आकर्षण एवं दर्शनीय स्थल",
  "Top Stays": "प्रमुख आवास व होटल",
  "Where to Eat": "खानपान व भोजन",
  "Wildlife & Reserves": "वन्यजीव एवं अभयारण्य",
  "🐾 Wildlife & Reserves": "🐾 वन्यजीव एवं अभयारण्य",
  "National Parks & Reserves": "राष्ट्रीय उद्यान एवं अभयारण्य",
  "Curated Attractions & Forts": "प्रमाणित आकर्षण एवं किले",
  "Master Regional Hubs": "प्रमुख क्षेत्रीय केंद्र",
  "UNESCO Heritage Sites": "यूनेस्को विश्व धरोहर स्थल",
  "UNESCO World Heritage Sites": "यूनेस्को विश्व धरोहर स्थल",
  "UNESCO World Heritage Site": "यूनेस्को विश्व धरोहर स्थल",
  "UNESCO Natural World Heritage": "यूनेस्को प्राकृतिक विश्व धरोहर",
  "UNESCO Inscribed Site": "यूनेस्को अभिलेखित स्थल",
  "Part of UNESCO Site": "यूनेस्को स्थल का भाग",
  "All Heritage Records": "सभी धरोहर रिकॉर्ड",
  "State Directory · Verified Field Dossier": "राज्य डायरेक्टरी · सत्यापित फील्ड संचिका",
  "View State Wildlife & Parks": "राज्य के वन्यजीव अभयारण्य व पार्क देखें",

  // Sub-filters & Buttons
  "Filter Sights:": "आकर्षण फ़िल्टर:",
  "All": "सभी",
  "Core Heritage": "मुख्य धरोहर",
  "Hidden Gems": "अन्वेषित धरोहर",
  "Tiger Reserves": "बाघ अभयारण्य",
  "National Parks": "राष्ट्रीय उद्यान",
  "Sanctuaries & Bird Reserves": "वन्यजीव व पक्षी अभयारण्य",
  "Protected Sanctuaries of Bharat": "भारत के संरक्षित अभयारण्य",
  "India's Premier Wildlife & Tiger Reserves": "भारत के प्रमुख वन्यजीव व बाघ अभयारण्य",
  "Filter All Wildlife States": "सभी वन्यजीव राज्य देखें",
  "Explore State Directory": "राज्य डायरेक्टरी देखें",
  "Plan Safari": "सफारी योजना बनाएं",
  "Share Details": "विवरण साझा करें",
  "Copied Details!": "विवरण कॉपी किया गया!",
  "Start Route": "मार्ग शुरू करें",
  "Route Here": "यहाँ का मार्ग",
  "Google Maps": "गूगल मैप्स",
  "Maps Intel": "मानचित्र जानकारी",
  "View Details": "विवरण देखें",
  "View Wildlife Dossier": "वन्यजीव संचिका देखें",
  "Add to Heritage Route Analyzer": "धरोहर मार्ग विश्लेषक में जोड़ें",
  "Add to Safari Route": "सफारी मार्ग में जोड़ें",

  // Exploration Levels & Territory Filters
  "Explore Bharat": "भारत दर्शन",
  "Explore by region": "क्षेत्र अनुसार खोजें",
  "A quick way to find your next part of India": "भारत की अगली यात्रा खोजने का सरल व त्वरित माध्यम",
  "Search a state or Union Territory...": "कोई राज्य या केंद्र शासित प्रदेश खोजें...",
  "States": "राज्य",
  "Union Territories": "केंद्र शासित प्रदेश",
  "UTs": "केंद्र शासित प्रदेश",
  "Wishlist": "पसंदीदा सूची",
  "My Curated Wishlist": "मेरी पसंदीदा यात्रा सूची",
  "Bookmarked States & Union Territories for your upcoming travels": "आपकी आगामी यात्राओं के लिए सहेजे गए राज्य एवं केंद्र शासित प्रदेश",
  "Your Wishlist is Empty": "आपकी पसंदीदा सूची रिक्त है",
  "Browse 28 States of Bharat": "भारत के 28 राज्यों का अन्वेषण करें",
  "Island, coast & capital": "द्वीप, समुद्र तट एवं राजधानी",

  // Sort Options
  "Sort:": "क्रमबद्ध करें:",
  "Default Order": "डिफ़ॉल्ट क्रम",
  "Name (A – Z)": "नाम (A – Z)",
  "Most Destinations": "सर्वाधिक गंतव्य",
  "By Region": "क्षेत्र अनुसार",

  // Theme Filters
  "Theme:": "श्रेणी:",
  "All Themes": "सभी श्रेणियां",
  "🐾 Wildlife & Tiger Reserves": "🐾 वन्यजीव व बाघ अभयारण्य",
  "🏛️ UNESCO Heritage": "🏛️ यूनेस्को धरोहर",
  "🏰 Forts & Palaces": "🏰 किले एवं महल",
  "🪷 Sacred & Temples": "🪷 तीर्थ एवं पावन मंदिर",
  "🏔️ Himalayas & Hills": "🏔️ हिमालय एवं पर्वतीय स्थल",
  "🌊 Coastal & Beaches": "🌊 समुद्र तट व बैकवाटर्स",

  // Heritage Site Categories
  "All Heritage": "समस्त धरोहर",
  "Forts & Palaces": "किले एवं राजमहल",
  "Temples & Sacred": "मंदिर एवं पावन तीर्थ",
  "Rock-Cut Caves": "शिलाकृत गुफाएं",
  "Colonial & Monuments": "ऐतिहासिक स्मारक",
  "Ghats & Natural": "पवित्र घाट एवं प्राकृतिक स्थल",
  "🐾 Wildlife & Sanctuaries": "🐾 वन्यजीव एवं अभयारण्य",

  // Details & Info Labels
  "Visiting Hours": "दर्शन / भ्रमण समय",
  "Hours": "समय",
  "Timings": "समय",
  "Safari Timings": "सफारी समय",
  "Best Season": "सर्वोत्तम मौसम",
  "Best time to visit": "भ्रमण का सर्वोत्तम समय",
  "District": "ज़िला",
  "Nearest Hub": "निकटतम केंद्र",
  "Nearest City": "निकटतम शहर",
  "Protected Area": "संरक्षित क्षेत्र",
  "Key Wildlife": "प्रमुख वन्यजीव",
  "Entry Fee": "प्रवेश शुल्क",
  "Entry": "प्रवेश",
  "Domestic": "भारतीय नागरिक",
  "Foreign": "विदेशी पर्यटक",
  "Free Entry": "निःशुल्क प्रवेश",
  "Free Access": "निःशुल्क प्रवेश",
  "Free": "निःशुल्क",
  "Open Daily": "प्रतिदिन खुला",
  "Closed on Mondays": "सोमवार को बंद",
  "Closed on Fridays": "शुक्रवार को बंद",
  "Specialties": "विशेष व्यंजन / खासियत",
  "Authentic": "प्रामाणिक",
  "Pure Vegetarian": "शुद्ध शाकाहारी",
  "Non-Vegetarian": "मांसाहारी",

  // Interactive Map Controls & Popups
  "Heritage Monument": "ऐतिहासिक स्मारक",
  "Sacred Pilgrimage Site": "पावन तीर्थ स्थल",
  "Hidden Gem": "अन्वेषित धरोहर",
  "Stations": "रेलवे स्टेशन",
  "Hotels": "होटल व आवास",
  "Dining": "भोजन व रेस्टोरेंट",
  "Sacred Circuits": "तीर्थ परिक्रमा पथ",
  "Clear Route": "मार्ग साफ़ करें",
  "Reverse Route": "मार्ग उलटें",
  "Distance": "दूरी",
  "Duration": "अनुमानित समय",
  "Transport Mode": "यातायात का साधन",
  "Driving": "सड़क मार्ग (ड्राइव)",
  "Transit": "सार्वजनिक परिवहन (ट्रेन/बस)",
  "Walking": "पैदल मार्ग",
  "Flight": "हवाई मार्ग",

  // Plan Trip / Itinerary Page
  "AI Multimodal Itinerary & Trip Planner": "एआई मल्टीमॉडल यात्रा योजनाकार",
  "Select Starting Point": "यात्रा आरंभ स्थल चुनें",
  "Select Destination": "गंतव्य चुनें",
  "Trip Duration": "यात्रा अवधि",
  "Days": "दिन",
  "Pace": "यात्रा की गति",
  "Relaxed": "आरामदायक",
  "Moderate": "मध्यम",
  "Fast": "तीव्र (विस्तृत)",
  "Budget": "बजट",
  "Luxury": "विलासिता (लक्ज़री)",
  "Travel Preferences": "यात्रा प्राथमिकताएं",
  "Generate Smart Itinerary": "स्मार्ट यात्रा योजना तैयार करें",
  "Day-wise Plan": "दिन-प्रतिदिन यात्रा विवरण",
  "Morning": "प्रातःकाल",
  "Afternoon": "दोपहर",
  "Evening": "सायंकाल",
  "Night": "रात्रि",
  "Cost Estimate": "अनुमानित व्यय",
  "Download PDF": "पीडीएफ डाउनलोड करें",
  "Print Itinerary": "यात्रा विवरण प्रिंट करें",

  // AI Assistant Page
  "Ask Virasat AI": "विरासत एआई से पूछें",
  "Heritage, Culture & Travel Assistant": "धरोहर, संस्कृति एवं यात्रा सहायक",
  "Type your question in Hindi or English...": "अपना प्रश्न हिन्दी या अंग्रेजी में लिखें...",
  "Suggested questions:": "सुझाए गए प्रश्न:",
  "What are the best UNESCO sites in Maharashtra?": "महाराष्ट्र के प्रमुख यूनेस्को विश्व धरोहर स्थल कौन-से हैं?",
  "How to reach Kaziranga National Park?": "काजीरंगा राष्ट्रीय उद्यान कैसे पहुंचे?",
  "Tell me about the history of Ajanta Caves": "अजंता गुफाओं के इतिहास के बारे में बताएं",
};

// 2. States & UTs English to Hindi Names
export const STATES_HINDI_MAP: Record<string, string> = {
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Arunachal Pradesh": "अरुणाचल प्रदेश",
  "Assam": "असम",
  "Bihar": "बिहार",
  "Chhattisgarh": "छत्तीसगढ़",
  "Goa": "गोवा",
  "Gujarat": "गुजरात",
  "Haryana": "हरियाणा",
  "Himachal Pradesh": "हिमाचल प्रदेश",
  "Jharkhand": "झारखंड",
  "Karnataka": "कर्नाटक",
  "Kerala": "केरल",
  "Madhya Pradesh": "मध्य प्रदेश",
  "Maharashtra": "महाराष्ट्र",
  "Manipur": "मणिपुर",
  "Meghalaya": "मेघालय",
  "Mizoram": "मिज़ोरम",
  "Nagaland": "नागालैंड",
  "Odisha": "ओडिशा",
  "Punjab": "पंजाब",
  "Rajasthan": "राजस्थान",
  "Sikkim": "सिक्किम",
  "Tamil Nadu": "तमिलनाडु",
  "Telangana": "तेलंगाना",
  "Tripura": "त्रिपुरा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "Uttarakhand": "उत्तराखंड",
  "West Bengal": "पश्चिम बंगाल",
  "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीप समूह",
  "Andaman & Nicobar Islands": "अंडमान और निकोबार द्वीप समूह",
  "Chandigarh": "चंडीगढ़",
  "Dadra and Nagar Haveli and Daman and Diu": "दादरा और नगर हवेली एवं दमन और दीव",
  "Delhi": "दिल्ली",
  "Jammu and Kashmir": "जम्मू और कश्मीर",
  "Jammu & Kashmir": "जम्मू और कश्मीर",
  "Ladakh": "लद्दाख",
  "Lakshadweep": "लक्षद्वीप",
  "Puducherry": "पुदुचेरी",
};

// 3. Indian Cities English to Hindi Names
export const CITIES_HINDI_MAP: Record<string, string> = {
  "Mumbai": "मुंबई",
  "Pune": "पुणे",
  "Chhatrapati Sambhajinagar": "छत्रपति संभाजीनगर",
  "Aurangabad": "छत्रपति संभाजीनगर",
  "Nagpur": "नागपुर",
  "Nashik": "नासिक",
  "Kolhapur": "कोल्हापुर",
  "Mahabaleshwar": "महाबलेश्वर",
  "Solapur": "सोलापुर",
  "Amravati": "अमरावती",
  "Jaipur": "जयपुर",
  "Udaipur": "उदयपुर",
  "Jodhpur": "जोधपुर",
  "Jaisalmer": "जैसलमेर",
  "Ajmer": "अजमेर",
  "Bikaner": "बीकानेर",
  "Pushkar": "पुष्कर",
  "Sawai Madhopur": "सवाई माधोपुर",
  "Varanasi": "वाराणसी",
  "Agra": "आगरा",
  "Lucknow": "लखनऊ",
  "Ayodhya": "अयोध्या",
  "Prayagraj": "प्रयागराज",
  "Mathura": "मथुरा",
  "Vrindavan": "वृंदावन",
  "Sarnath": "सारनाथ",
  "Jhansi": "झांसी",
  "Bhopal": "भोपाल",
  "Indore": "इंदौर",
  "Gwalior": "ग्वालियर",
  "Khajuraho": "खजुराहो",
  "Ujjain": "उज्जैन",
  "Jabalpur": "जबलपुर",
  "Sanchi": "सांची",
  "Mandu": "मांडू",
  "Ahmedabad": "अहमदाबाद",
  "Surat": "सूरत",
  "Vadodara": "वडोदरा",
  "Dwarka": "द्वारका",
  "Somnath": "सोमनाथ",
  "Junagadh": "जूनागढ़",
  "Bhuj": "भुज",
  "Kolkata": "कोलकाता",
  "Darjeeling": "दार्जिलिंग",
  "Kalimpong": "कालिम्पोंग",
  "Murshidabad": "मुर्शिदाबाद",
  "Bishnupur": "बिष्णुपुर",
  "Shantiniketan": "शांतिनिकेतन",
  "Chennai": "चेन्नई",
  "Madurai": "मदुरै",
  "Thanjavur": "तंजावुर",
  "Kanchipuram": "कांचीपुरम",
  "Rameswaram": "रामेश्वरम",
  "Kanyakumari": "कन्याकुमारी",
  "Mamallapuram": "मामल्लापुरम",
  "Mahabalipuram": "महाबलीपुरम",
  "Coimbatore": "कोयंबटूर",
  "Bengaluru": "बेंगलुरु",
  "Mysuru": "मैसूर",
  "Mysore": "मैसूर",
  "Hampi": "हम्पी",
  "Badami": "बादामी",
  "Belur": "बेलूर",
  "Halebidu": "हलेबिडू",
  "Gokarna": "गोकर्ण",
  "Kochi": "कोच्चि",
  "Thiruvananthapuram": "तिरुवनंतपुरम",
  "Alappuzha": "अलप्पुझा",
  "Alleppey": "अलप्पुझा",
  "Munnar": "मुन्नार",
  "Wayanad": "वायनाड",
  "Kozhikode": "कोझिकोड",
  "Srinagar": "श्रीनगर",
  "Gulmarg": "गुलमर्ग",
  "Pahalgam": "पहलगाम",
  "Leh": "लेह",
  "Kargil": "कारगिल",
  "Nubra Valley": "नुब्रा घाटी",
  "Shimla": "शिमला",
  "Manali": "मनाली",
  "Dharamshala": "धर्मशाला",
  "Spiti Valley": "स्पीति घाटी",
  "Kullu": "कुल्लू",
  "Dehradun": "देहरादून",
  "Haridwar": "हरिद्वार",
  "Rishikesh": "ऋषिकेश",
  "Nainital": "नैनीताल",
  "Mussoorie": "मसूरी",
  "Guwahati": "गुवाहाटी",
  "Kaziranga": "काजीरंगा",
  "Tezpur": "तेजपुर",
  "Majuli": "माजुली",
  "Bhubaneswar": "भुवनेश्वर",
  "Puri": "पुरी",
  "Konark": "कोणार्क",
  "Cuttack": "कटक",
  "Amritsar": "अमृतसर",
  "Chandigarh": "चंडीगढ़",
  "Patna": "पटना",
  "Bodh Gaya": "बोधगया",
  "Nalanda": "नालंदा",
  "Rajgir": "राजगीर",
  "Panaji": "पणजी",
  "Old Goa": "ओल्ड गोवा",
  "Port Blair": "पोर्ट ब्लेयर",
  "Havelock Island": "हैवलॉक द्वीप",
};

// 4. Wildlife Animals & Species English to Hindi
export const WILDLIFE_HINDI_MAP: Record<string, string> = {
  "Royal Bengal Tiger": "रॉयल बंगाल टाइगर",
  "Bengal Tiger": "बंगाल टाइगर",
  "Tiger": "बाघ",
  "Tigers": "बाघ",
  "Asiatic Lion": "एशियाई बब्बर शेर",
  "Lion": "शेर",
  "Lions": "शेर",
  "Greater One-Horned Rhinoceros": "एक सींग वाला भारतीय गैंडा",
  "Greater One-Horned Rhino": "एक सींग वाला गैंडा",
  "Indian Rhinoceros": "भारतीय गैंडा",
  "Rhino": "गैंडा",
  "Asian Elephant": "एशियाई हाथी",
  "Asiatic Elephant": "एशियाई हाथी",
  "Indian Elephant": "भारतीय हाथी",
  "Elephant": "हाथी",
  "Elephants": "हाथी",
  "Indian Leopard": "भारतीय तेंदुआ",
  "Leopard": "तेंदुआ",
  "Snow Leopard": "हिम तेंदुआ",
  "Clouded Leopard": "मेघमय तेंदुआ",
  "Sloth Bear": "रीछ (स्लॉथ भालू)",
  "Himalayan Brown Bear": "हिमालयी भूरा भालू",
  "Asian Black Bear": "एशियाई काला भालू",
  "Barasingha": "बारहसिंगा (दलदली हिरण)",
  "Barasingha (Swamp Deer)": "बारहसिंगा",
  "Blackbuck": "काला हिरण (कृष्णमृग)",
  "Chital": "चीतल (चित्तीदार हिरण)",
  "Chital (Spotted Deer)": "चीतल",
  "Sambar Deer": "सांभर हिरण",
  "Sambar": "सांभर",
  "Barking Deer": "कांकड़ (भौंकने वाला हिरण)",
  "Mouse Deer": "मूषक मृग",
  "Nilgai": "नीलगाय",
  "Chinkara": "चिंकारा (भारतीय चिकारा)",
  "Indian Gaur": "गौर (जंगली भैंसा)",
  "Wild Water Buffalo": "जंगली जल भैंसा",
  "Wild Boar": "जंगली सूअर",
  "Gharial": "घड़ियाल",
  "Mugger Crocodile": "मगरमच्छ",
  "Estuarine Crocodile": "खारे पानी का मगरमच्छ",
  "Marsh Crocodile": "दलदली मगरमच्छ",
  "Gangetic Dolphin": "गंगा डॉल्फ़िन",
  "Nilgiri Tahr": "नीलगिरि तहर",
  "Lion-tailed Macaque": "सिंह-पुच्छ मकाक बंदर",
  "Red Panda": "लाल पांडा",
  "Golden Langur": "सुनहरा लंगूर",
  "Indian Giant Squirrel": "विशाल भारतीय गिलहरी (शेकरू)",
  "Great Indian Hornbill": "ग्रेट इंडियन हॉर्नबिल",
  "Great Indian Bustard": "ग्रेट इंडियन बस्टर्ड (गोडावण)",
  "Flamingo": "राजहंस (फ्लेमिंगो)",
  "Flamingos": "राजहंस (फ्लेमिंगो)",
  "Olive Ridley Turtle": "ओलिव रिडले कछुआ",
};

// 5. Common Vocabulary & Token Replacements for compound sentences
export const VOCAB_REPLACEMENTS: Array<[RegExp, string]> = [
  // Common action phrases
  [/\bAsk AI Guide about\b/gi, "एआई गाइड से पूछें"],
  [/\bPlan a comprehensive\b/gi, "एक व्यापक योजना बनाएं"],
  [/\bDiscover India's Living Heritage\b/gi, "भारत की जीवंत धरोहर का अन्वेषण करें"],
  [/\bExplore Verified Monuments\b/gi, "सत्यापित स्मारकों का अन्वेषण करें"],
  [/\bUNESCO World Heritage Sites?\b/gi, "यूनेस्को विश्व धरोहर स्थल"],
  [/\bWorld Heritage Site\b/gi, "विश्व धरोहर स्थल"],
  [/\bHeritage Sites?\b/gi, "धरोहर स्थल"],
  [/\bNational Parks?\b/gi, "राष्ट्रीय उद्यान"],
  [/\bTiger Reserves?\b/gi, "बाघ अभयारण्य"],
  [/\bWildlife Sanctuar(?:y|ies)\b/gi, "वन्यजीव अभयारण्य"],
  [/\bBird Sanctuar(?:y|ies)\b/gi, "पक्षी अभयारण्य"],
  [/\bMarine National Park\b/gi, "समुद्री राष्ट्रीय उद्यान"],
  [/\bBiosphere Reserves?\b/gi, "जैवमंडल आरक्षित क्षेत्र"],
  [/\bProtected Area\b/gi, "संरक्षित क्षेत्र"],
  [/\bProtected Habitats?\b/gi, "संरक्षित प्राकृतिक आवास"],

  // Times, Dates & Numbers
  [/\bVisiting Hours?\b/gi, "भ्रमण समय"],
  [/\bSafari Timings?\b/gi, "सफारी समय"],
  [/\bBest Season\b/gi, "सर्वोत्तम मौसम"],
  [/\bOpen Daily\b/gi, "प्रतिदिन खुला"],
  [/\bDaily Dining\b/gi, "दैनिक भोजन व्यवस्था"],
  [/\bClosed on Mondays?\b/gi, "सोमवार को बंद"],
  [/\bClosed on Fridays?\b/gi, "शुक्रवार को बंद"],
  [/\bFree Entry\b/gi, "निःशुल्क प्रवेश"],
  [/\bFree Access\b/gi, "निःशुल्क प्रवेश"],
  [/\bEntry Fee\b/gi, "प्रवेश शुल्क"],
  [/\bEntry\b/gi, "प्रवेश"],
  [/\bDomestic\b/gi, "भारतीय"],
  [/\bForeign\b/gi, "विदेशी"],

  // Months
  [/\bJan(?:uary)?\b/gi, "जनवरी"],
  [/\bFeb(?:ruary)?\b/gi, "फ़रवरी"],
  [/\bMar(?:ch)?\b/gi, "मार्च"],
  [/\bApr(?:il)?\b/gi, "अप्रैल"],
  [/\bMay\b/gi, "मई"],
  [/\bJun(?:e)?\b/gi, "जून"],
  [/\bJul(?:y)?\b/gi, "जुलाई"],
  [/\bAug(?:ust)?\b/gi, "अगस्त"],
  [/\bSep(?:tember)?\b/gi, "सितंबर"],
  [/\bOct(?:ober)?\b/gi, "अक्टूबर"],
  [/\bNov(?:ember)?\b/gi, "नवंबर"],
  [/\bDec(?:ember)?\b/gi, "दिसंबर"],

  // Units
  [/\bsq km\b/gi, "वर्ग किमी"],
  [/\bsq\. km\b/gi, "वर्ग किमी"],
  [/\bkm\b/gi, "किमी"],
  [/\bmeters?\b/gi, "मीटर"],

  // Common UI words
  [/\bAttractions?\b/gi, "आकर्षण"],
  [/\bSights?\b/gi, "दर्शनीय स्थल"],
  [/\bMonuments?\b/gi, "स्मारक"],
  [/\bForts?\b/gi, "किले"],
  [/\bPalaces?\b/gi, "राजमहल"],
  [/\bTemples?\b/gi, "मंदिर"],
  [/\bCaves?\b/gi, "गुफाएं"],
  [/\bMosques?\b/gi, "मस्जिदें"],
  [/\bGhats?\b/gi, "घाट"],
  [/\bBeaches?\b/gi, "समुद्र तट"],
  [/\bIslands?\b/gi, "द्वीप"],
  [/\bValleys?\b/gi, "घाटियां"],
  [/\bHills?\b/gi, "पहाड़ियां"],
  [/\bPasses?\b/gi, "दर्रे"],
  [/\bWaterfalls?\b/gi, "जलप्रपात"],
  [/\bRivers?\b/gi, "नदियां"],
  [/\bLakes?\b/gi, "झीलें"],
  [/\bRestaurants?\b/gi, "रेस्टोरेंट"],
  [/\bHotels?\b/gi, "होटल"],
  [/\bStays?\b/gi, "आवास"],
  [/\bCuisine\b/gi, "खानपान"],
  [/\bFlavors?\b/gi, "स्वाद व व्यंजन"],
  [/\bDistrict\b/gi, "ज़िला"],
  [/\bState\b/gi, "राज्य"],
  [/\bStates\b/gi, "राज्य"],
  [/\bCapital\b/gi, "राजधानी"],
  [/\bDirections\b/gi, "दिशा-निर्देश"],
  [/\bRoute\b/gi, "मार्ग"],
  [/\bRoutes\b/gi, "मार्ग"],
  [/\bSafaris?\b/gi, "सफारी"],
  [/\bDetails\b/gi, "विवरण"],
  [/\bOverview\b/gi, "सिंहावलोकन"],
  [/\bSummary\b/gi, "संक्षिप्त विवरण"],
  [/\bHistory\b/gi, "इतिहास"],
  [/\bArchitecture\b/gi, "वास्तुकला"],
  [/\bSignificance\b/gi, "महत्व"],
  [/\bTimings?\b/gi, "समय"],
  [/\bRatings?\b/gi, "रेटिंग"],
  [/\bReviews?\b/gi, "समीक्षाएं"],
  [/\bPhotos?\b/gi, "तस्वीरें"],
  [/\bImages?\b/gi, "छवियां"],
  [/\bMap\b/gi, "मानचित्र"],
  [/\bPopular\b/gi, "लोकप्रिय"],
  [/\bFamous\b/gi, "प्रसिद्ध"],
  [/\bAuthentic\b/gi, "प्रामाणिक"],
  [/\bVerified\b/gi, "सत्यापित"],
  [/\bOfficial\b/gi, "आधिकारिक"],
  [/\bNearest\b/gi, "निकटतम"],
  [/\bLocation\b/gi, "स्थान"],
  [/\bDistance\b/gi, "दूरी"],
  [/\bDuration\b/gi, "अवधि"],
  [/\bMinutes\b/gi, "मिनट"],
  [/\bHours\b/gi, "घंटे"],
  [/\bDays\b/gi, "दिन"],
];

/**
 * High-performance synchronous translator from English to Hindi.
 * Checks exact phrases, state/city/wildlife names, and performs phrase tokenization.
 */
export function translateTextToHindi(input: string): string {
  if (!input) return input;
  const trimmed = input.trim();
  if (!trimmed) return input;

  // 1. Direct exact match in phrase map
  if (EXACT_PHRASES_MAP[trimmed]) {
    return input.replace(trimmed, EXACT_PHRASES_MAP[trimmed]);
  }

  // 2. Direct exact match in states map
  if (STATES_HINDI_MAP[trimmed]) {
    return input.replace(trimmed, STATES_HINDI_MAP[trimmed]);
  }

  // 3. Direct exact match in cities map
  if (CITIES_HINDI_MAP[trimmed]) {
    return input.replace(trimmed, CITIES_HINDI_MAP[trimmed]);
  }

  // 4. Direct exact match in wildlife map
  if (WILDLIFE_HINDI_MAP[trimmed]) {
    return input.replace(trimmed, WILDLIFE_HINDI_MAP[trimmed]);
  }

  // 5. Compound sentence / tokenized replacement
  let output = input;

  // Replace exact phrases that occur inside text
  for (const [enPhrase, hiPhrase] of Object.entries(EXACT_PHRASES_MAP)) {
    if (enPhrase.length > 3 && output.includes(enPhrase)) {
      output = output.split(enPhrase).join(hiPhrase);
    }
  }

  // Replace State names
  for (const [enState, hiState] of Object.entries(STATES_HINDI_MAP)) {
    if (output.includes(enState)) {
      output = output.split(enState).join(hiState);
    }
  }

  // Replace City names
  for (const [enCity, hiCity] of Object.entries(CITIES_HINDI_MAP)) {
    if (output.includes(enCity)) {
      output = output.split(enCity).join(hiCity);
    }
  }

  // Replace Wildlife species
  for (const [enFauna, hiFauna] of Object.entries(WILDLIFE_HINDI_MAP)) {
    if (output.includes(enFauna)) {
      output = output.split(enFauna).join(hiFauna);
    }
  }

  // Apply vocabulary regex replacements
  for (const [regex, replacement] of VOCAB_REPLACEMENTS) {
    output = output.replace(regex, replacement);
  }

  return output;
}
