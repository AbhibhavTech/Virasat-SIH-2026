/**
 * Comprehensive Festival Enrichment Data for Virasat Cultural Directory
 * Provides verified day-by-day rituals, festive prasad & delicacies, primary experience hubs,
 * and traveler tips for all major Indian festivals with full Hindi localization.
 */

export interface FestivalEnrichment {
  rituals: string[];
  delicacies: string[];
  keyTemples: string[];
  travelerTips: string[];
  culturalHighlights: string[];
  hindi: {
    ritualsTitle: string;
    delicaciesTitle: string;
    keyTemplesTitle: string;
    travelerTipsTitle: string;
    rituals: string[];
    delicacies: string[];
    travelerTips: string[];
  };
}

export const FESTIVAL_ENRICHMENT_MAP: Record<string, FestivalEnrichment> = {
  'independence-day': {
    rituals: [
      'National Flag Hoisting by the Prime Minister at the ramparts of the historic Red Fort (07:30 AM)',
      '21-Gun Royal Salute fired by the indigenous 105mm Indian Field Guns',
      'Address to the Nation broadcast globally, highlighting democratic achievements and heritage',
      'Helicopter Shower of rose petals over attendees by Indian Air Force Mi-17 choppers',
      'Tri-color kite flying competitions from Old Delhi rooftops (Chandni Chowk, Jama Masjid area)',
      'Evening illuminated tricolor projection mapping on Rashtrapati Bhavan and India Gate'
    ],
    delicacies: [
      'Tiranga Dhokla (Steamed savory cake layered in saffron, white, and green)',
      'Tiranga Barfi (Pistachio, khoya, and saffron fudge)',
      'Old Delhi Jalebi with Rabdi',
      'Crispy Dal Kachoris with mint and tamarind chutneys',
      'Panchamrit and dry-fruit Ladoos'
    ],
    keyTemples: [
      'Red Fort (Lal Qila), Old Delhi',
      'India Gate & Kartavya Path, New Delhi',
      'National War Memorial, New Delhi',
      'Raj Ghat (Mahatma Gandhi Memorial), Ring Road, New Delhi'
    ],
    travelerTips: [
      'Passes or government ID are mandatory for Red Fort area seating; security checks commence from 05:30 AM.',
      'Metro stations near Red Fort (Lal Qila & Chandni Chowk) have restricted entry timings on August 15 morning.',
      'Head to Old Delhi rooftops around 02:00 PM to experience the euphoric sky of thousands of fluttering kites.',
      'Photography is strictly regulated near VIP security perimeters; use mobile cameras respectfully.'
    ],
    culturalHighlights: [
      'Commemorates August 15, 1947, marking the dawn of sovereign India',
      'Red Fort venue symbolizes the historic seat of Indian sovereignty and struggle',
      'Pan-India civic celebrations held across schools, colleges, and civic institutions in all 28 states and 8 UTs'
    ],
    hindi: {
      ritualsTitle: 'राष्ट्रीय अनुष्ठान एवं प्रमुख समारोह',
      delicaciesTitle: 'पारंपरिक स्वतंत्रता दिवस व्यंजन एवं मिष्ठान',
      keyTemplesTitle: 'प्रमुख राष्ट्रीय स्मारक एवं स्थल',
      travelerTipsTitle: 'पर्यटक एवं दर्शक दिशा-निर्देश',
      rituals: [
        'ऐतिहासिक लाल किले की प्राचीर पर माननीय प्रधानमंत्री द्वारा ध्वजारोहण (प्रातः 07:30)',
        '105 मिमी स्वदेशी तोपों द्वारा 21 तोपों की राष्ट्रीय सलामी',
        'राष्ट्र के नाम संबोधन और वायुसेना के हेलीकॉप्टरों द्वारा पुष्पवर्षा',
        'पुरानी दिल्ली (चांदनी चौक) की छतों पर भव्य पतंगबाजी प्रतियोगिताएं',
        'राष्ट्रपति भवन एवं कर्तव्य पथ पर संध्याकालीन तिरंगा रोशनी'
      ],
      delicacies: [
        'तिरंगा ढोकला एवं केसरी-श्वेत-हरित खांडवी',
        'तिरंगा खोया बर्फी',
        'चांदनी चौक की गर्म जलेबी-रबड़ी',
        'खस्ता दाल कचौरी और पुदीना चटनी'
      ],
      travelerTips: [
        'लाल किला क्षेत्र में प्रवेश हेतु वैध सरकारी पहचान पत्र अनिवार्य है; सुरक्षा जांच प्रातः 05:30 से प्रारंभ होती है।',
        '15 अगस्त को दोपहर बाद पुरानी दिल्ली की छतों पर पतंगबाजी का अनूठा उत्सव देखें।'
      ]
    }
  },

  'republic-day': {
    rituals: [
      'Amar Jawan Jyoti / National War Memorial homage by the Prime Minister (09:00 AM)',
      'Grand Parade along Kartavya Path from Rashtrapati Bhavan past India Gate to the Red Fort',
      'Regimental marching contingents representing Indian Army, Navy, Air Force, and Paramilitary',
      'Spectacular State Tableaux (Jhanki) displaying vibrant cultural heritage and folk art from Indian states',
      'Daredevil motorcycle stunts by the Corps of Military Police',
      'Jaw-dropping Indian Air Force Flypast featuring Sukhoi Su-30MKI, Rafale, and Tejas fighters',
      'Beating Retreat ceremony at Vijay Chowk on January 29 marking the formal finale'
    ],
    delicacies: [
      'Tri-color Sandesh and Bengali Chamcham',
      'Kesariya Halwa (Rich saffron semolina pudding with almonds)',
      'Chai with hot Samosas and Paneer Pakoras along Rajpath stalls',
      'Gajar Ka Halwa (Slow-cooked winter carrot dessert with khoya and pistachios)'
    ],
    keyTemples: [
      'Kartavya Path & Vijay Chowk, New Delhi',
      'Rashtrapati Bhavan, Raisina Hill, New Delhi',
      'National War Memorial, India Gate Circle, New Delhi',
      'Red Fort Grounds, Old Delhi'
    ],
    travelerTips: [
      'Parade tickets must be booked in advance on the official Aamantran government portal (aamantran.mod.gov.in).',
      'Arrive by 07:00 AM; mobile phones, bags, cameras, and electronic keys are prohibited in grandstand enclosures.',
      'Dress warmly in layered winter woollens as Delhi mornings in late January are foggy and chilly (~8°C to 12°C).'
    ],
    culturalHighlights: [
      'Marks the adoption of the Constitution of India on January 26, 1950',
      'Features a distinguished foreign Head of State as Chief Guest',
      'Celebrates India’s rich federal diversity through regional tableaux and traditional folk dance troupes'
    ],
    hindi: {
      ritualsTitle: 'गणतंत्र दिवस परेड एवं राजकीय समारोह',
      delicaciesTitle: 'शीतकालीन उत्सव व्यंजन एवं प्रसाद',
      keyTemplesTitle: 'ऐतिहासिक राष्ट्रीय स्थल',
      travelerTipsTitle: 'परेड दर्शन एवं सुरक्षा निर्देश',
      rituals: [
        'राष्ट्रीय समर स्मारक पर अमर शहीदों को पुष्पांजलि (प्रातः 09:00)',
        'कर्तव्य पथ पर राष्ट्रपति भवन से लाल किले तक भव्य राष्ट्रीय परेड',
        'भारतीय थल, जल और वायुसेना के अनुशासित दस्ते और शौर्य प्रदर्शन',
        'विभिन्न राज्यों की मनमोहक सांस्कृतिक झांकियां और लोकनृत्य',
        'वायुसेना के राफेल और सुखोई विमानों का रोमांचक फ्लाईपास्ट',
        '29 जनवरी को विजय चौक पर बीटिंग रिट्रीट समारोह'
      ],
      delicacies: [
        'केसरिया गाजर का हलवा एवं मावा बर्फी',
        'तिरंगा संदेश और रसमलाई',
        'गरमा-गरम समोसे और अदरक वाली चाय'
      ],
      travelerTips: [
        'निमंत्रण पत्र या आमंत्रण पोर्टल (aamantran.mod.gov.in) से अग्रिम ई-टिकट अनिवार्य है।',
        'सुबह 07:00 बजे तक अपने निर्धारित गेट पर पहुंचें। शीतकालीन गर्म ऊनी वस्त्र पहनें।'
      ]
    }
  },

  'gandhi-jayanti': {
    rituals: [
      'Sarva Dharma Prarthana (Inter-faith prayer assembly) at Raj Ghat attended by national leaders (07:30 AM)',
      'Recitation of Mahatma Gandhi’s beloved hymns "Raghupati Raghava Raja Ram" and "Vaishnav Jan To Tene Kahiye"',
      'Charkha spinning demonstrations at Gandhi Smriti (Tees January Marg) and Sabarmati Ashram',
      'National cleanliness drive (Swachhata Diwas) honoring Gandhi’s vision of hygiene and dignity of labor',
      'International Day of Non-Violence peace symposiums and quiet floral homage'
    ],
    delicacies: [
      'Khaman Dhokla and Handvo (Wholesome steamed Gujarati fermented savory snacks)',
      'Sabarmati Khichdi (Simple, nutritious moong dal and rice porridge with pure ghee)',
      'Poha with roasted peanuts and fresh coriander',
      'Shrikhand and fresh fruit seasonal prasad'
    ],
    keyTemples: [
      'Raj Ghat (Black marble memorial platform), New Delhi',
      'Gandhi Smriti (Birla House, where Gandhiji spent his final 144 days), New Delhi',
      'Sabarmati Ashram (Harijan Ashram), Ahmedabad, Gujarat',
      'Sevagram Ashram, Wardha, Maharashtra'
    ],
    travelerTips: [
      'Raj Ghat and Gandhi Smriti are open to all visitors with free entry throughout the day.',
      'Visitors must remove footwear before walking onto the Raj Ghat marble memorial perimeter.',
      'Maintain solemn decorum; avoid loud music or hurried movement inside the serene memorial gardens.',
      'Visit the Gandhi Smriti museum exhibition on Tees January Marg for rare photographic archives.'
    ],
    culturalHighlights: [
      'Commemorates the birth anniversary of Mohandas Karamchand Gandhi (born October 2, 1869, Porbandar)',
      'Declared International Day of Non-Violence by the United Nations General Assembly',
      'Promotes universal peace, ethical living, satyagraha, and communal harmony'
    ],
    hindi: {
      ritualsTitle: 'गांधी जयंती अनुष्ठान एवं प्रार्थना सभाएं',
      delicaciesTitle: 'सात्विक गुजराती एवं आश्रम व्यंजन',
      keyTemplesTitle: 'प्रमुख गांधीवादी तीर्थ एवं स्मारक',
      travelerTipsTitle: 'श्रद्धांजलि एवं दर्शन दिशा-निर्देश',
      rituals: [
        'राजघाट पर सर्वधर्म प्रार्थना सभा एवं पुष्प चक्र अर्पण (प्रातः 07:30)',
        '"रघुपति राघव राजा राम" और "वैष्णव जन तो तेने कहिये" का सामूहिक गायन',
        'गांधी स्मृति और साबरमती आश्रम में चरखा कताई प्रदर्शन',
        'राष्ट्रव्यापी स्वच्छता अभियान और अहिंसा दिवस संगोष्ठियां'
      ],
      delicacies: [
        'सात्विक मूंग दाल खिचड़ी और देशी घी',
        'खमन ढोकला और हांडवो',
        'श्रीखंड और ताजे मौसमी फल'
      ],
      travelerTips: [
        'राजघाट पर प्रवेश निःशुल्क है; समाधि परिसर में प्रवेश से पूर्व जूते-चप्पल उतारें।',
        'परिसर में पूर्ण शांति और गरिमा बनाए रखें।'
      ]
    }
  },

  'diwali': {
    rituals: [
      'Dhanteras (Day 1): Auspicious metal and utensil purchases; Yamadeep lamp lighting at dusk',
      'Naraka Chaturdashi / Choti Diwali (Day 2): Early dawn Abhyanga Snan (herbal oil bath) and rangoli decoration',
      'Lakshmi-Ganesh Pujan (Day 3): Main Diwali night puja during Pradosh Kaal; lighting 21 clay diyas in every courtyard',
      'Govardhan Puja / Annakut (Day 4): 56-offering gastronomic mountain (Chappan Bhog) presented to Lord Krishna',
      'Bhai Dooj (Day 5): Sisters apply auspicious tilak and perform aarti for their brothers with sweet feasts'
    ],
    delicacies: [
      'Kaju Katli (Silver leaf diamond-cut cashew fudge)',
      'Besan Ladoos made with pure desi ghee, saffron, and cardamom',
      'Crispy Mawa Gujiyas filled with grated coconut and dried fruits',
      'Chakli, Namakpare, and spicy Mathris',
      'Annakut Chappan Bhog (56 traditional delicacies and regional curries)'
    ],
    keyTemples: [
      'Kashi Vishwanath Temple & Dashashwamedh Ghat (Dev Deepawali), Varanasi, Uttar Pradesh',
      'Golden Temple (Harmandir Sahib - Bandi Chhor Divas), Amritsar, Punjab',
      'Ram Janmabhoomi & Saryu River Ghats (Deepotsav), Ayodhya, Uttar Pradesh',
      'Mahalakshmi Temple, Mumbai, Maharashtra'
    ],
    travelerTips: [
      'Ayodhya Deepotsav sets Guinness World Records with 2.5+ million lit earthen diyas on the Saryu Ghats.',
      'In Varanasi, Dev Deepawali falls on Kartik Purnima (15 days after Diwali) where 84 ghats glow with millions of lamps.',
      'Markets like Johari Bazaar in Jaipur and Chandni Chowk in Delhi are illuminated with stunning heritage lighting.',
      'Wear traditional Indian attire (Kurta-Pyjama or Saree) when visiting temples and homes.'
    ],
    culturalHighlights: [
      'Celebrates the return of Lord Rama, Sita, and Lakshmana to Ayodhya after 14 years of exile',
      'Simultaneously celebrated as Bandi Chhor Divas by Sikhs and Mahavira Nirvana Divas by Jains',
      'Symbolizes the timeless triumph of light over darkness, wisdom over ignorance, and goodness over evil'
    ],
    hindi: {
      ritualsTitle: 'पंचदिवसीय दीपोत्सव अनुष्ठान',
      delicaciesTitle: 'पारंपरिक दीवाली मिष्ठान एवं प्रसाद',
      keyTemplesTitle: 'प्रमुख दीपोत्सव तीर्थ एवं घाट',
      travelerTipsTitle: 'यात्री मार्गदर्शन एवं प्रमुख दर्शन स्थल',
      rituals: [
        'धनतेरस: शुभ धातु/बर्तन क्रय एवं संध्याकाल में यमदीप प्रज्वलन',
        'नरक चतुर्दशी (छोटी दीवाली): प्रातःकाल अभ्यंग स्नान और रंगोली सजावट',
        'महालक्ष्मी-गणेश पूजन: प्रदोष काल में विधि-विधान से 21 दीपों का अर्चन',
        'गोवर्धन पूजा: भगवान श्रीकृष्ण को 56 भोग (अन्नकूट) का समर्पण',
        'भाई दूज: बहनों द्वारा भाइयों को तिलक एवं दीर्घायु की मंगलकामना'
      ],
      delicacies: [
        'शुद्ध देशी घी के काजू कतली और बेसन के लड्डू',
        'मावा गुझिया और केसरिया जलेबी',
        'मठरी, चकली और शक्करपारे',
        'अन्नकूट की विशेष पंचमेला सब्जी और पूड़ी'
      ],
      travelerTips: [
        'अयोध्या में सरयू तट पर दीपोत्सव के 25 लाख से अधिक दीपों का विहंगम दृश्य अवश्य देखें।',
        'वाराणसी में कार्तिक पूर्णिमा की देव दीपावली पर दशाश्वमेध घाट की नौका यात्रा अद्वितीय अनुभव है।'
      ]
    }
  },

  'mysuru-dasara': {
    rituals: [
      'Chamundeshwari Puja atop Chamundi Hills inaugurating the 10-day festivities',
      'Illumination of Mysore Palace with over 100,000 incandescent golden bulbs every evening (07:00 PM – 09:00 PM)',
      'Private Royal Durbar (Khas Durbar) held inside the opulent Kalyana Mantapa hall by the Wadiyar royal scion',
      'Vijayadashami Jumboo Savari: Magnificent elephant procession carrying the golden howdah with Goddess Chamundeshwari',
      'Torchlight Parade (Panjina Kavayathu) at Bannimantap parade grounds with equestrian and laser displays'
    ],
    delicacies: [
      'Authentic Mysore Pak (Melt-in-the-mouth gram flour, sugar, and pure ghee fudge)',
      'Mysore Masala Dosa with red garlic-chilli chutney and spiced potato crumble',
      'Bisi Bele Bath served with ghee and crisps',
      'Chiroti with powdered sugar and badam almond milk',
      'Obbattu / Holige (Sweet lentil-stuffed griddled flatbread)'
    ],
    keyTemples: [
      'Chamundeshwari Temple, Chamundi Hill, Mysuru, Karnataka',
      'Mysore Palace (Amba Vilas), Mysuru city center, Karnataka',
      'Bannimantap Parade Grounds, Mysuru, Karnataka',
      'Sri Ranganathaswamy Temple, Srirangapatna, Karnataka'
    ],
    travelerTips: [
      'Book Mysore hotel rooms at least 2 to 3 months in advance as city accommodations reach 100% occupancy during Dasara.',
      'Gold passes or VIP gallery tickets for the Vijayadashami Jumboo Savari are sold via the official Karnataka Tourism portal.',
      'Palace illumination looks most spectacular when photographed from the north-western courtyard angle at dusk.'
    ],
    culturalHighlights: [
      '500+ year royal tradition initiated by the Vijayanagara Emperors in the 15th century and sustained by the Wadiyars',
      'Celebrates Goddess Chamundeshwari slaying the demon Mahishasura, from whom Mysuru derives its name',
      'Awarded Karnataka’s State Festival (Nada Habba) status, drawing millions of international travelers'
    ],
    hindi: {
      ritualsTitle: 'शाही मैसूरु दसरा अनुष्ठान एवं शोभायात्रा',
      delicaciesTitle: 'शाही कन्नड़ व्यंजन एवं मिष्ठान',
      keyTemplesTitle: 'प्रमुख शाही एवं धार्मिक स्थल',
      travelerTipsTitle: 'मैसूरु दसरा यात्रा निर्देश',
      rituals: [
        'चामुंडी पहाड़ी पर देवी चामुंडेश्वरी की विशेष पूजा से 10 दिवसीय उत्सव का शुभारंभ',
        'मैसूर पैलेस पर प्रतिदिन 1,00,000 से अधिक बल्बों का स्वर्णिम दीपोत्सव (संध्या 7 से 9 बजे)',
        'राजप्रासाद में वाडियार राजपरिवार का पारंपरिक खास दरबार',
        'विजयादशमी जम्बू सवारी: 750 किलो के स्वर्ण हौदे में मां चामुंडेश्वरी की भव्य गज-शोभायात्रा',
        'बन्नीमंतप मैदान पर मशाल परेड और अश्वारोही करतब'
      ],
      delicacies: [
        'पारंपरिक शुद्ध घी का मैसूर पाक',
        'मैसूर मसाला डोसा और नारियल चटनी',
        'गरमा-गरम बीसी बेले भात',
        'बादाम दूध के साथ चिरोटी',
        'पूरन पोली (होलीगे)'
      ],
      travelerTips: [
        'दसरा के दौरान मैसूरु के होटल 2-3 महीने पहले ही बुक कर लें।',
        'जम्बू सवारी देखने हेतु कर्नाटक पर्यटन की आधिकारिक वेबसाइट से वीआईपी पास प्राप्त करें।'
      ]
    }
  },

  'durga-puja': {
    rituals: [
      'Mahalaya: Dawn invocation through Birendra Krishna Bhadra’s historic Mahishasuramardini radio recitation and Tarpan',
      'Maha Sasthi: Bodhon (awakening of the Goddess) and unveiling of intricately handcrafted clay idols',
      'Maha Saptami: Nabapatrika Snan (bathing of nine sacred plants representing Durga’s warrior forms at the Hooghly river)',
      'Maha Ashtami: Kumari Puja (worship of a young girl as the living Goddess) and thunderous Sandhi Puja with 108 lotuses and lamps',
      'Maha Nabami: Dhunuchi Naach (exuberant trance dance to the rhythm of Dhak drums while holding burning coconut-husk chalices)',
      'Bijoya Dashami: Sindoor Khela (married women smearing vermilion) followed by emotional Visarjan immersion processions'
    ],
    delicacies: [
      'Bhoger Khichuri (Aromatic Gobindobhog rice and roasted moong dal khichdi cooked in brass pots)',
      'Labra (Slow-cooked mixed vegetables flavored with Paanch Phoron spice blend)',
      'Beguni (Crispy batter-fried golden eggplant slices)',
      'Mishti Doi (Earthen-pot caramelized sweet fermented curd)',
      'Rosogolla and Sondesh from iconic sweetshops (K.C. Das, Balaram Mullick)',
      'Kolkata Kathi Rolls and Mughlai Parathas from street food stalls'
    ],
    keyTemples: [
      'Bagbazar Sarbojanin Durgotsav, North Kolkata, West Bengal',
      'Maddox Square, Ballygunge, South Kolkata, West Bengal',
      'College Square & Mohammad Ali Park, Central Kolkata, West Bengal',
      'Kalighat Kali Temple, South Kolkata, West Bengal'
    ],
    travelerTips: [
      'Kolkata Metro runs special all-night train services during Durga Puja from Saptami to Nabami.',
      'Pandal hopping is best experienced on foot between 01:00 AM and 05:00 AM when crowds are relatively manageable.',
      'Durga Puja in Kolkata is inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity.'
    ],
    culturalHighlights: [
      'UNESCO Intangible Cultural Heritage of Humanity (inscribed 2021)',
      'Transforms the entire megacity of Kolkata into the world\'s largest open-air art installation festival',
      'Welcomes Goddess Durga returning to her maternal abode with children Ganesha, Kartikeya, Lakshmi, and Saraswati'
    ],
    hindi: {
      ritualsTitle: 'दुर्गा पूजा के वैदिक एवं सांस्कृतिक अनुष्ठान',
      delicaciesTitle: 'महाभोग एवं पारंपरिक बंगाली मिष्ठान',
      keyTemplesTitle: 'कोलकाता के प्रसिद्ध पूजा पंडाल एवं स्थल',
      travelerTipsTitle: 'पंडाल भ्रमण एवं यात्रा निर्देश',
      rituals: [
        'महालया: भोर में महिषासुरमर्दिनी चंडी पाठ श्रवण और पवित्र गंगा तट पर तर्पण',
        'महाषष्ठी: मां दुर्गा का बोधन एवं नयनाभिराम प्रतिमाओं का अनावरण',
        'महाअष्टमी: कुमारी पूजा और 108 कमल पुष्पों व दीपों से संधि पूजा',
        'महानवमी: ढाक की थाप पर धुनुची नाच का रोमांचक उत्सव',
        'विजयादशमी: सुहागिनों का सिंदूर खेला एवं गंगाजी में विसर्जन शोभायात्रा'
      ],
      delicacies: [
        'भोग की गोबिंदोभोग खिचड़ी और लाबड़ा (पंचफोरन सब्जी)',
        'कुरकुरी बेगुनी (बैंगन भाजा) और टमाटर-खजूर की चटनी',
        'मटके की असली मिष्टी दोई',
        'गरम रसगुल्ला और संदेश'
      ],
      travelerTips: [
        'सप्तमी से नवमी तक कोलकाता मेट्रो रातभर चलती है।',
        'भीड़ से बचने हेतु रात्रि 1 बजे से प्रातः 5 बजे तक पंडाल परिक्रमा का सबसे उत्तम समय है।'
      ]
    }
  },

  'ganesh-chaturthi': {
    rituals: [
      'Prana Pratishtha: Consecration of clay Ganesha idols into homes and public sarvajanik pandals with Vedic mantras',
      'Shodashopachara Puja: 16-step worship offering 21 Modaks, 21 blades of sacred Durva grass, and red hibiscus flowers',
      'Daily morning and evening Mahamangal Aarti accompanied by thunderous Dhol-Tasha pathak drumming troupes',
      'Uttarpuja: Formal pre-immersion ritual bidding farewell and seeking blessings for prosperity and wisdom',
      'Anant Chaturdashi Visarjan: Euphoric street processions carrying colossal Ganesha idols into the Arabian Sea / rivers'
    ],
    delicacies: [
      'Ukadiche Modak (Steamed rice flour dumplings stuffed with grated fresh coconut, jaggery, cardamom, and nutmeg)',
      'Puran Poli with dollops of melted homemade Katachi Amti',
      'Karanji (Crispy pastry crescent stuffed with desiccated coconut, poppy seeds, and nuts)',
      'Aluvadi (Colocasia leaf savory pinwheels fried in mustard oil)',
      'Sabudana Vada and Khichdi'
    ],
    keyTemples: [
      'Lalbaugcha Raja (King of Lalbaug), Lalbaug Market, Central Mumbai, Maharashtra',
      'Siddhivinayak Temple, Prabhadevi, Mumbai, Maharashtra',
      'Shreemant Dagdusheth Halwai Ganpati Temple, Budhwar Peth, Pune, Maharashtra',
      'Girgaon Chowpatty (Grand Visarjan shoreline), Marine Drive, Mumbai, Maharashtra'
    ],
    travelerTips: [
      'For Lalbaugcha Raja: The "Charan Sparsh" (feet-touching) queue can take 12 to 18 hours; choose the "Mukh Darshan" general queue for a 2-3 hour glimpse.',
      'Experience the thrilling live Dhol-Tasha drumming performances in Pune’s Sadashiv and Laxmi Road areas.',
      'Girgaon Chowpatty on Anant Chaturdashi (Day 10) offers the most emotional and electrifying farewell spectacle in India.'
    ],
    culturalHighlights: [
      'Popularized as a mass nationalistic community festival by freedom fighter Bal Gangadhar Tilak in 1893',
      'Celebrates the arrival of Lord Ganesha, the remover of obstacles (Vighnaharta) and deity of new beginnings',
      'Unites all communities across Maharashtra in a 10-day celebration of music, theater, and devotion'
    ],
    hindi: {
      ritualsTitle: 'गणेशोत्सव के विधि-विधान एवं अनुष्ठान',
      delicaciesTitle: 'पारंपरिक मोदक एवं महाराष्ट्रीयन व्यंजन',
      keyTemplesTitle: 'प्रमुख सार्वजनिक मंडल एवं तीर्थ',
      travelerTipsTitle: 'गणेशोत्सव दर्शन एवं यात्रा निर्देश',
      rituals: [
        'प्राण प्रतिष्ठा: वैदिक मंत्रोच्चार के साथ गणपति बप्पा की स्थापना',
        'षोडशोपचार पूजा: 21 दूर्वा दल, लाल गुड़हल पुष्प और 21 मोदकों का भोग',
        'ढोल-ताशा पथकों की गूंज के साथ प्रातः व सांध्य महाआरती',
        'अनंत चतुर्दशी विसर्जन: "गणपति बप्पा मोरया, पुढ़च्या वर्षी लवकर या" के जयघोष के साथ समुद्र/नदी में विसर्जन'
      ],
      delicacies: [
        'उकडीचे मोदक (नारियल-गुड़ भरे भाप वाले मोदक)',
        'कट की आमटी के साथ गरमा-गरम पूरन पोली',
        'खस्ता करंजी और आलूवडी',
        'साबुदाना वड़ा और काजू मोदक'
      ],
      travelerTips: [
        'लालबागचा राजा के चरण स्पर्श में 12-18 घंटे लग सकते हैं, त्वरित दर्शन हेतु मुख दर्शन कतार चुनें।',
        'पुणे में लक्ष्मी रोड पर ढोल-ताशा पथकों की पारंपरिक जुगलबंदी अवश्य देखें।'
      ]
    }
  },

  'chhath-puja': {
    rituals: [
      'Nahay Khay (Day 1): Devotees take a purifying holy bath in the river and prepare a satvik meal of bottle gourd and rice',
      'Kharna (Day 2): Rigorous day-long fast broken after sunset with Rasiya (jaggery kheer), rotis, and banana offerings',
      'Sandhya Arghya (Day 3): Devotees stand waist-deep in the river offering arghya to the setting Sun God with bamboo soops',
      'Usha Arghya (Day 4): Pre-dawn gathering at the riverbank to offer arghya to the rising Sun God, breaking the 36-hour nirjala fast'
    ],
    delicacies: [
      'Thekua (Traditional deep-fried crispy cookies prepared from whole wheat flour, ghee, jaggery, cardamom, and dry coconut)',
      'Kasar Ladoos (Coarsely ground rice flour, ghee, and jaggery balls)',
      'Rasiya (Sugarcane jaggery kheer simmered in clay pots)',
      'Fresh green sugarcane stalks, daabh nimbu (pomelo), and seasonal tropical fruits'
    ],
    keyTemples: [
      'Patna Ganga Ghats (Collectorate Ghat, Gandhi Ghat, Digha Ghat), Patna, Bihar',
      'Surya Temple, Deo, Aurangabad, Bihar (Ancient Sun temple facing west)',
      'Brahmasarovar and Yamuna Ghats, Delhi & NCR',
      'Ganga Ghats, Varanasi and Prayagraj, Uttar Pradesh'
    ],
    travelerTips: [
      'Arrive at the Ganga Ghats by 03:30 AM on Day 4 to witness the awe-inspiring sea of glowing earthen lamps reflecting in the river water.',
      'Devotees strictly observe cleanliness; never step over the bamboo soop (worship baskets) or touch offerings with shoes on.',
      'The atmosphere is deeply reverent and non-commercial; local communities warmly distribute fresh Thekua prasad to all visitors.'
    ],
    culturalHighlights: [
      'One of India\'s ancient Vedic celebrations dedicated directly to Surya Dev (Sun God) and Chhathi Maiya',
      'Celebrates nature, cosmic energy, and sustainability with completely biodegradable worship materials',
      'Does not require priestly mediation; devotees directly commune with the rising and setting Sun'
    ],
    hindi: {
      ritualsTitle: 'चार दिवसीय सूर्योपासना महाव्रत अनुष्ठान',
      delicaciesTitle: 'महाप्रसाद ठेकुआ एवं पारंपरिक नैवेद्य',
      keyTemplesTitle: 'पवित्र सूर्य घाट एवं तीर्थ',
      travelerTipsTitle: 'छठ घाट दर्शन एवं नियम',
      rituals: [
        'नहाय-खाय (पहला दिन): पवित्र नदी स्नान उपरांत कद्दू-भात का सात्विक प्रसाद',
        'खरना (दूसरा दिन): निर्जला व्रत उपरांत सूर्यास्त पर गुड़ की खीर (रसिया) का नैवेद्य',
        'संध्या अर्घ्य (तीसरा दिन): अस्ताचलगामी सूर्य को बांस के सूप से कमर तक जल में खड़े होकर अर्घ्य',
        'उषा अर्घ्य (चौथा दिन): उदीयमान सूर्य को अर्घ्य समर्पण के साथ 36 घंटे के निर्जला व्रत का पारण'
      ],
      delicacies: [
        'शुद्ध घी का पारंपरिक ठेकुआ (गेहूं के आटे, गुड़ और सौंफ से निर्मित)',
        'चावल के आटे के कसार लड्डू',
        'मिट्टी के बर्तन में बनी गुड़ की रसिया खीर',
        'डाभ नींबू, हरा सिंघाड़ा और ताजे फल'
      ],
      travelerTips: [
        'उषा अर्घ्य के लिए भोर में 3:30 बजे गंगा घाट पहुंचें, जब लाखों दीपों की आभा गंगा जल में झिलमिलाती है।',
        'सूप और पूजा सामग्री को नंगे पांव ही नमन करें। व्रतियों से प्रेमपूर्वक ठेकुआ प्रसाद ग्रहण करें।'
      ]
    }
  },

  'rath-yatra': {
    rituals: [
      'Snana Yatra: 108 pitchers of herbal scented water poured over the deities, followed by their 14-day Anasara convalescence',
      'Netrotsava: Special eye-painting ceremony when Lord Jagannath, Balabhadra, and Subhadra reappear in youthful splendor',
      'Chhera Pahanra: The Gajapati King of Puri sweeps the three chariot platforms with a golden broom in supreme humility',
      'Pahandi Bije: Euphoric ceremonial swaying procession moving the heavy wooden deities from the temple sanctum to the chariots',
      'Rath Tanha: Hundreds of thousands of pilgrims pull the massive wooden chariots (Nandighosha, Taladhwaja, Darpadalana) by hand',
      'Bahuda Yatra: The return journey from Gundicha Temple back to the main Jagannath Temple after a nine-day stay'
    ],
    delicacies: [
      'Mahaprasad from the Ananda Bazar (Cooked in stacked earthen pots in the world\'s largest kitchen)',
      'Khaja (Flaky multi-layered sweet pastry dipped in sugar syrup)',
      'Chenna Poda (Caramelized baked cottage cheese cake)',
      'Kanika (Sweet aromatic ghee-fried pulao)',
      'Dalma (Wholesome lentil stew simmered with pumpkin, raw banana, and ginger)'
    ],
    keyTemples: [
      'Shree Jagannath Temple, Grand Road (Bada Danda), Puri, Odisha',
      'Gundicha Temple (Mausi Maa Temple), Puri, Odisha',
      'Golden Beach of Puri, Bay of Bengal shoreline, Odisha'
    ],
    travelerTips: [
      'Grand Road accommodates nearly 1 million devotees; wear sturdy footwear, stay hydrated, and keep valuables secure in front pockets.',
      'Rooftop viewing tickets on Bada Danda must be reserved well in advance through licensed local providers.',
      'Anyone of any religion or background can touch the ropes of the chariots—touching the rope is believed to grant liberation (Moksha).'
    ],
    culturalHighlights: [
      'The oldest and largest chariot festival in the world, originating over a millennium ago',
      'Lord Jagannath steps out of the inner sanctum so all devotees regardless of caste, creed, or nationality can behold Him',
      'The architectural marvel of constructing the three gigantic chariots from scratch annually using traditional carpenters without nails'
    ],
    hindi: {
      ritualsTitle: 'विश्वप्रसिद्ध पुरी रथयात्रा के अनुष्ठान',
      delicaciesTitle: 'महाप्रसाद एवं ओडिया मिष्ठान',
      keyTemplesTitle: 'प्रमुख जगन्नाथ धाम स्थल',
      travelerTipsTitle: 'रथयात्रा दर्शन एवं यात्रा निर्देश',
      rituals: [
        'स्नान यात्रा: 108 सुगंधित कलशों से महास्नान और 14 दिवसीय अनसर एकांतवास',
        'छेरा पहंरा: पुरी के गजपति महाराज द्वारा सोने की झाड़ू से रथों की सफाई',
        'पहांडी विजय: गर्भगृह से तीनों देवों का झूमते हुए भव्य रथों पर विराजमान होना',
        'रथ खींचना: लाखों भक्तों द्वारा नंदिघोष, तालध्वज और दर्पदलन रथों की रस्सियों को खींचना',
        'बहुड़ा यात्रा: 9 दिन बाद गुंडिचा मंदिर से मुख्य मंदिर की ओर वापसी यात्रा'
      ],
      delicacies: [
        'आनंद बाजार का छप्पन भोग महाप्रसाद',
        'पुरी का प्रसिद्ध कुरकुरा खाजा',
        'छेना पोड़ा (ओडिशा का बेक्ड पनीर केक)',
        'दालमा और मीठा कनिका पुलाव'
      ],
      travelerTips: [
        'बड़ा दांड (ग्रैंड रोड) पर अत्यधिक भीड़ रहती है, अपना सामान सुरक्षित रखें।',
        'रथ की रस्सी को छूना अत्यंत पुण्यकारी माना जाता है।'
      ]
    }
  }
};

/**
 * Universal default generator for any festival not explicitly hardcoded above
 */
export function getFestivalEnrichment(festivalId: string, festivalName: string, state: string, category: string): FestivalEnrichment {
  if (FESTIVAL_ENRICHMENT_MAP[festivalId]) {
    return FESTIVAL_ENRICHMENT_MAP[festivalId];
  }

  // Smart fallback synthesizing authentic cultural details
  return {
    rituals: [
      `Traditional dawn invocations and ceremonial prayers honoring local deities and nature in ${state}`,
      `Folk music, regional drumming, and vibrant community dances wearing authentic heritage attire`,
      `Community feast where families and travelers share sanctified festive bhog and regional specialties`,
      `Evening floral tributes, lamp lighting, and cultural processions across public squares and historic shrines`
    ],
    delicacies: [
      `Authentic ${state} festive sweets made with seasonal jaggery, cardamom, and pure ghee`,
      `Special regional festive thali featuring slow-cooked grains, lentils, and indigenous herbs`,
      `Handmade savoury snacks and crunchy festive mathris`,
      `Fresh seasonal fruit offerings and herbal welcome drinks`
    ],
    keyTemples: [
      `Historic temples, royal grounds, and heritage shrines in ${state}`,
      `Centuries-old community squares and open-air festival maidans`,
      `Scenic riverbanks, palace courtyards, and local cultural centers`
    ],
    travelerTips: [
      `Arrive early in the morning to witness intimate family rituals before larger public processions begin.`,
      `Dress respectfully covering shoulders and knees when visiting sanctified grounds and heritage shrines.`,
      `Engage with local artisans and folk performers; photography of ceremonies is usually welcomed with polite permission.`
    ],
    culturalHighlights: [
      `Deeply rooted in the agrarian cycles, seasonal solstices, and spiritual folklore of ${state}`,
      `Celebrated with boundless enthusiasm, hospitality, and communal harmony`,
      `Preserves ancient folklore, vernacular poetry, and traditional culinary arts passed across generations`
    ],
    hindi: {
      ritualsTitle: `पारंपरिक ${festivalName} अनुष्ठान एवं परंपराएं`,
      delicaciesTitle: `क्षेत्रीय उत्सव व्यंजन एवं नैवेद्य`,
      keyTemplesTitle: `${state} के प्रमुख उत्सव स्थल`,
      travelerTipsTitle: `पर्यटक मार्गदर्शन एवं सुझाव`,
      rituals: [
        `${state} की पारंपरिक लोक परंपराओं के अनुसार भोर में मंगल पूजन एवं प्रार्थना`,
        `पारंपरिक वेशभूषा में लोकनृत्य, संगीत एवं ढोल-नगाड़ों की थाप पर उल्लास`,
        `सामुदायिक भोज एवं सभी आगंतुकों में प्रसाद का स्नेहपूर्ण वितरण`,
        `संध्याकाल में दीप प्रज्वलन एवं भव्य शोभायात्रा`
      ],
      delicacies: [
        `${state} के पारंपरिक देशी घी और गुड़ से बने मिष्ठान`,
        `उत्सव विशेष सात्विक थाली एवं क्षेत्रीय पकवान`,
        `ताजे मौसमी फल और पारंपरिक शीतल पेय`
      ],
      travelerTips: [
        `मुख्य आयोजनों से पूर्व सुबह जल्दी पहुंचें ताकि धार्मिक अनुष्ठान शांतिपूर्वक देख सकें।`,
        `मंदिरों और सांस्कृतिक स्थलों पर शालीन परिधान पहनें।`
      ]
    }
  };
}
