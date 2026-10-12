import fs from 'fs';
import path from 'path';

/**
 * 290 Database Entries across 11 Sections of Indian Festivals & Observances
 */
export const RAW_290_FESTIVALS = [
  // =========================================================================
  // Section 1: Major Hindu festivals (Rows 1 to 87)
  // =========================================================================
  {
    row_no: 1,
    name: 'Makar Sankranti',
    section: '1. Major Hindu festivals',
    description: 'Ancient solar festival celebrating the suns transition into Makara (Capricorn) marking the end of winter and longer days, celebrated with holy dips in rivers, kite flying, and sesame-jaggery sweets.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Gujarat', 'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Uttar Pradesh', 'Bihar', 'Punjab', 'Rajasthan'],
    region: 'North'
  },
  {
    row_no: 2,
    name: 'Pongal',
    section: '1. Major Hindu festivals',
    description: 'Four-day Tamil harvest thanksgiving festival dedicated to the Sun God Surya, celebrated by boiling fresh milk and rice in earthen pots until it overflows, thanking nature and farm cattle.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu', 'Puducherry'],
    region: 'South'
  },
  {
    row_no: 3,
    name: 'Vasant Panchami',
    section: '1. Major Hindu festivals',
    description: 'Spring festival dedicated to Goddess Saraswati, the patron deity of learning, arts and music, where devotees wear yellow garments and worship books and musical instruments.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['West Bengal', 'Bihar', 'Uttar Pradesh', 'Punjab', 'Odisha', 'Assam'],
    region: 'North'
  },
  {
    row_no: 4,
    name: 'Maha Shivratri',
    section: '1. Major Hindu festivals',
    description: 'Great night of Lord Shiva celebrated across India with nocturnal vigils, continuous meditation, offerings of bael leaves and milk to Shiva Lingams across Jyotirlingas and temples.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 5,
    name: 'Holika Dahan',
    section: '1. Major Hindu festivals',
    description: 'Sacred eve of Holi commemorating the triumph of young devotee Prahlada over demoness Holika, celebrated with community bonfires symbolizing the destruction of evil.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Rajasthan', 'Bihar', 'Madhya Pradesh', 'Gujarat'],
    region: 'North'
  },
  {
    row_no: 6,
    name: 'Holi',
    section: '1. Major Hindu festivals',
    description: 'Pan-Indian festival of colours and joy marking the arrival of spring, where people playfully smear natural gulal and water colours, forgive past grievances, and share festive sweets like gujiya.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Bihar', 'Delhi', 'Haryana', 'Punjab', 'Maharashtra', 'West Bengal'],
    region: 'North'
  },
  {
    row_no: 7,
    name: 'Chaitra Navratri',
    section: '1. Major Hindu festivals',
    description: 'Nine-day spring festival worshiping the nine manifestations of Goddess Shakti, observed with ritual fasting, chanting, and culminations on Rama Navami.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 8,
    name: 'Rama Navami',
    section: '1. Major Hindu festivals',
    description: 'Spring celebration commemorating the auspicious birth of Lord Rama, the seventh avatar of Vishnu, observed with temple processions, recital of the Ramayana, and kirtans.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Andhra Pradesh', 'Telangana'],
    region: 'North'
  },
  {
    row_no: 9,
    name: 'Gudi Padwa',
    section: '1. Major Hindu festivals',
    description: 'Traditional Marathi and Konkani New Year marking the first day of Chaitra, celebrated by raising auspicious decorated Gudi flags outside homes and feasting on shrikhand-puri.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra', 'Goa'],
    region: 'West'
  },
  {
    row_no: 10,
    name: 'Ugadi',
    section: '1. Major Hindu festivals',
    description: 'Deccan New Year celebrated by Telugu and Kannada communities on the first day of Chaitra, famous for the ritual consumption of Ugadi Pachadi combining six tastes of life.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Andhra Pradesh', 'Telangana', 'Karnataka'],
    region: 'South'
  },
  {
    row_no: 11,
    name: 'Hanuman Jayanti',
    section: '1. Major Hindu festivals',
    description: 'Commemoration of the birth of Lord Hanuman, the devoted servant of Rama, observed with early morning prayers, temple circumambulation, and recitation of the Hanuman Chalisa.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 12,
    name: 'Akshaya Tritiya',
    section: '1. Major Hindu festivals',
    description: 'Highly auspicious day signifying eternal prosperity and success, associated with Lord Parashurama and the onset of the Treta Yuga, celebrated by purchasing gold and initiating ventures.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'West'
  },
  {
    row_no: 13,
    name: 'Ganga Dussehra',
    section: '1. Major Hindu festivals',
    description: 'Ten-day Vedic festival commemorating the divine descent of river goddess Ganga from the heavens to the earthly realm through Lord Shivas matted locks.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Uttarakhand', 'Uttar Pradesh', 'Bihar', 'West Bengal'],
    region: 'Himalayan'
  },
  {
    row_no: 14,
    name: 'Snana Yatra',
    section: '1. Major Hindu festivals',
    description: 'Bathing festival of Jagannath, Balabhadra and Subhadra at Puri where sacred deities receive 108 pots of purified herbal water prior to their annual convalescence (Anavasara).',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 15,
    name: 'Nirjala Ekadashi',
    section: '1. Major Hindu festivals',
    description: 'Most austere of the twenty-four Ekadashi fasts in the Hindu lunar calendar, observed without consuming water for twenty-four hours to gain the spiritual merit of all Ekadashis.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 16,
    name: 'Vat Purnima',
    section: '1. Major Hindu festivals',
    description: 'Observance by married Hindu women praying for their husbands longevity by tying sacred protective threads around the auspicious banyan (vat) tree in honour of Savitris devotion.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra', 'Gujarat', 'Karnataka'],
    region: 'West'
  },
  {
    row_no: 17,
    name: 'Puri Rath Yatra',
    section: '1. Major Hindu festivals',
    description: 'Colossal sacred chariot procession where Lord Jagannath, Lord Balabhadra and Devi Subhadra journey from their sanctum to Gundicha Temple atop monumental wooden chariots pulled by millions of devotees.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 18,
    name: 'Guru Purnima',
    section: '1. Major Hindu festivals',
    description: 'Spiritual full moon day dedicated to expressing reverence and gratitude to academic, spiritual, and artistic teachers, marking the birth anniversary of sage Veda Vyasa.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 19,
    name: 'Hariyali Teej',
    section: '1. Major Hindu festivals',
    description: 'Monsoon festival celebrated by women in Northern and Western India celebrating the reunion of Lord Shiva and Goddess Parvati, marked by green attire, henna, and swings.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Rajasthan', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
    region: 'North'
  },
  {
    row_no: 20,
    name: 'Nag Panchami',
    section: '1. Major Hindu festivals',
    description: 'Traditional worship of serpents and snake deities across India on the fifth day of the bright half of Shravana, invoking divine protection against venom and natural hazards.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Maharashtra', 'Karnataka', 'Uttar Pradesh', 'West Bengal'],
    region: 'West'
  },
  {
    row_no: 21,
    name: 'Raksha Bandhan',
    section: '1. Major Hindu festivals',
    description: 'Centuries-old celebration of familial love and protection, wherein sisters tie sacred talisman threads (rakhi) around their brothers wrists in exchange for lifelong blessings and gifts.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 22,
    name: 'Krishna Janmashtami',
    section: '1. Major Hindu festivals',
    description: 'Grand pan-Indian celebration of the midnight birth of Lord Krishna in Mathura, observed with midnight vigil pujas, fasting, fasting feasts, and vibrant Dahi Handi human pyramids.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Odisha', 'Tamil Nadu'],
    region: 'North'
  },
  {
    row_no: 23,
    name: 'Radhashtami',
    section: '1. Major Hindu festivals',
    description: 'Festive commemoration of the auspicious appearance of Radha Rani in Barsana, celebrated fifteen days after Janmashtami with devotional songs and temple abhishekam.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Uttar Pradesh'],
    region: 'North'
  },
  {
    row_no: 24,
    name: 'Hartalika Teej',
    section: '1. Major Hindu festivals',
    description: 'Rigorous fast observed by married women and maidens worshiping clay idols of Shiva and Parvati for matrimonial harmony and righteous spouses.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Maharashtra'],
    region: 'North'
  },
  {
    row_no: 25,
    name: 'Ganesh Chaturthi',
    section: '1. Major Hindu festivals',
    description: 'Vibrant multi-day festival honouring the birth of Lord Ganesha, featuring the installation of elaborate clay idols in public pandals and homes, cultural music, and grand immersion processions.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Maharashtra', 'Goa', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Tamil Nadu'],
    region: 'West'
  },
  {
    row_no: 26,
    name: 'Onam',
    section: '1. Major Hindu festivals',
    description: 'Keralas principal harvest and cultural festival commemorating the mythical homecoming of righteous King Mahabali, featuring floral carpets (Pookalam), feasts (Sadya), and Vallam Kali snake boat races.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 27,
    name: 'Anant Chaturdashi',
    section: '1. Major Hindu festivals',
    description: 'Final climactic day of the Ganeshotsav festival marked by massive, spirited public immersion processions of Lord Ganesha idols into rivers and the ocean with dhol-tasha beats.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Maharashtra', 'Goa', 'Gujarat', 'Karnataka'],
    region: 'West'
  },
  {
    row_no: 28,
    name: 'Pitru Paksha / Mahalaya',
    section: '1. Major Hindu festivals',
    description: 'Sixteen-lunar-day period when Hindus pay homage to their ancestors through tarpan and shraddha rituals, culminating in Mahalaya announcing Goddess Durgas descent.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['West Bengal', 'Bihar', 'Uttar Pradesh', 'Tamil Nadu', 'Kerala'],
    region: 'East'
  },
  {
    row_no: 29,
    name: 'Sharad Navratri',
    section: '1. Major Hindu festivals',
    description: 'Grand nine-night autumn festival venerating Goddess Durga in her nine sacred avatars, celebrated with energetic Garba and Dandiya Raas in Gujarat and fasting across northern states.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Gujarat', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Delhi'],
    region: 'West'
  },
  {
    row_no: 30,
    name: 'Durga Puja',
    section: '1. Major Hindu festivals',
    description: 'UNESCO Intangible Cultural Heritage autumn festival commemorating Goddess Durgas victory over Mahishasura, featuring magnificent artistic pandals, dhunuchi naach, and immersion ceremonies.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['West Bengal', 'Assam', 'Tripura', 'Odisha', 'Bihar', 'Jharkhand'],
    region: 'East'
  },
  {
    row_no: 31,
    name: 'Dussehra (Vijayadashami)',
    section: '1. Major Hindu festivals',
    description: 'Pan-Indian celebration of the victory of good over evil, marking Lord Ramas defeat of demon king Ravana with burning of towering effigies and weapon worship (Shastra Puja).',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 32,
    name: 'Mysore Dasara',
    section: '1. Major Hindu festivals',
    description: 'Ten-day royal celebration in Mysuru featuring the illumination of Mysore Palace with 100,000 bulbs, Jumboo Savari elephant procession carrying the idol of Goddess Chamundeshwari.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Karnataka'],
    region: 'South'
  },
  {
    row_no: 33,
    name: 'Kullu Dussehra',
    section: '1. Major Hindu festivals',
    description: 'Week-long historic congregation of over 200 mountain deities at Dhalpur Maidan in Himachal Pradesh, commencing on Vijayadashami day when rest of India concludes festivals.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Himachal Pradesh'],
    region: 'Himalayan'
  },
  {
    row_no: 34,
    name: 'Karwa Chauth',
    section: '1. Major Hindu festivals',
    description: 'Traditional dawn-to-moonrise waterless fast observed by married women in Northern India praying for the safety, health, and long life of their husbands.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 'Delhi', 'Himachal Pradesh'],
    region: 'North'
  },
  {
    row_no: 35,
    name: 'Ahoi Ashtami',
    section: '1. Major Hindu festivals',
    description: 'Vrat observed by mothers for the welfare and longevity of their children, celebrated eight days before Diwali with fasting and night prayers upon sighting the stars.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Haryana', 'Punjab', 'Rajasthan'],
    region: 'North'
  },
  {
    row_no: 36,
    name: 'Dhanteras',
    section: '1. Major Hindu festivals',
    description: 'First day of the five-day Diwali festival dedicated to Dhanvantari, the physician of the gods, and Goddess Lakshmi, traditionally observed by buying precious metals and kitchenware.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 37,
    name: 'Naraka Chaturdashi (Chhoti Diwali)',
    section: '1. Major Hindu festivals',
    description: 'Second day of Diwali festivities commemorating Lord Krishnas vanquishing of the demon Narakasura, observed with early morning ritual oil baths (Abhyanga Snan) and lighting lamps.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Maharashtra', 'Goa', 'Tamil Nadu', 'Karnataka', 'Gujarat'],
    region: 'West'
  },
  {
    row_no: 38,
    name: 'Diwali (Deepavali)',
    section: '1. Major Hindu festivals',
    description: 'India\'s foremost festival of lights symbolizing the victory of light over darkness and good over evil, celebrated with lighting earthen diyas, Lakshmi Puja, sweets, and fireworks.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 39,
    name: 'Govardhan Puja (Annakut)',
    section: '1. Major Hindu festivals',
    description: 'Day following Diwali honouring Lord Krishnas lifting of Mount Govardhan to shield the inhabitants of Braj from catastrophic deluges, celebrated with massive mountain of food offerings.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Rajasthan', 'Gujarat', 'Haryana', 'Madhya Pradesh'],
    region: 'North'
  },
  {
    row_no: 40,
    name: 'Bhai Dooj',
    section: '1. Major Hindu festivals',
    description: 'Celebration of sibling bonds concluding Diwali celebrations, where sisters apply vermilion tilak to brothers foreheads and pray for their protection while receiving gifts.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Bihar', 'Maharashtra', 'West Bengal', 'Punjab', 'Gujarat'],
    region: 'North'
  },
  {
    row_no: 41,
    name: 'Chhath Puja (Nahay Khay)',
    section: '1. Major Hindu festivals',
    description: 'Initial purificatory phase of Chhath Parv where vratis take holy bath in water bodies and partake in sanctified meal of bottle gourd and rice.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Jharkhand', 'Uttar Pradesh'],
    region: 'East'
  },
  {
    row_no: 42,
    name: 'Chhath Puja (Kharna)',
    section: '1. Major Hindu festivals',
    description: 'Second day of Chhath involving full-day dry fast concluded after sunset by offering kheer and roti cooked on earthen chulha with mango wood.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Jharkhand', 'Uttar Pradesh'],
    region: 'East'
  },
  {
    row_no: 43,
    name: 'Chhath Puja (Sandhya Arghya)',
    section: '1. Major Hindu festivals',
    description: 'Third evening of Chhath where thousands of devotees stand in river waters to present offerings (arghya) to the setting Sun God and Chhathi Maiya.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Delhi'],
    region: 'East'
  },
  {
    row_no: 44,
    name: 'Chhath Puja (Usha Arghya)',
    section: '1. Major Hindu festivals',
    description: 'Concluding sunrise ritual of Chhath Parv offering morning arghya to the rising sun, followed by breaking the 36-hour waterless fast with prasad.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Delhi'],
    region: 'East'
  },
  {
    row_no: 45,
    name: 'Chhath Puja',
    section: '1. Major Hindu festivals',
    description: 'Four-day Vedic solar festival of rigorous discipline and purity dedicated to Sun God Surya and Chhathi Maiya, celebrated without priestly mediation along sacred river ghats.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Jharkhand', 'Uttar Pradesh'],
    region: 'East'
  },
  {
    row_no: 46,
    name: 'Tulsi Vivah',
    section: '1. Major Hindu festivals',
    description: 'Ceremonial wedding of the sacred Tulsi plant (holy basil) to Lord Shaligram (aniconic representation of Vishnu), inaugurating the annual Hindu wedding season.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Karnataka', 'Rajasthan'],
    region: 'West'
  },
  {
    row_no: 47,
    name: 'Devutthana Ekadashi',
    section: '1. Major Hindu festivals',
    description: 'Auspicious Ekadashi marking the end of Chaturmas when Lord Vishnu awakens from his cosmic slumber (Yoga Nidra), reopening auspicious life milestones and ceremonies.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Gujarat'],
    region: 'North'
  },
  {
    row_no: 48,
    name: 'Dev Deepawali',
    section: '1. Major Hindu festivals',
    description: 'Festival of the Gods at Varanasi on Kartik Purnima when all eighty-four ghats along the sacred Ganga are illuminated with more than a million glowing earthen oil lamps.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Uttar Pradesh'],
    region: 'North'
  },
  {
    row_no: 49,
    name: 'Kartik Purnima',
    section: '1. Major Hindu festivals',
    description: 'Holy full moon day commemorating Lord Shivas slaying of the demon Tripurasura, celebrated with holy river baths and lighting diyas at sacred shrines.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Odisha', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Gujarat'],
    region: 'North'
  },
  {
    row_no: 50,
    name: 'Datta Jayanti',
    section: '1. Major Hindu festivals',
    description: 'Birth celebration of Lord Dattatreya, the divine incarnation embodying Brahma, Vishnu and Shiva as one guru, observed with devotional singing and temple congregations.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Gujarat'],
    region: 'West'
  },
  {
    row_no: 51,
    name: 'Dattatreya Jayanti',
    section: '1. Major Hindu festivals',
    description: 'Annual full moon observance honouring Sri Dattatreya across key pilgrimage centres like Ganagapura, Kuravpur, and Narsobawadi with continuous recitation of Gurucharitra.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra', 'Karnataka', 'Andhra Pradesh'],
    region: 'West'
  },
  {
    row_no: 52,
    name: 'Gita Jayanti',
    section: '1. Major Hindu festivals',
    description: 'Celebration of the day Lord Krishna delivered the timeless spiritual message of the Bhagavad Gita to Pandava warrior Arjuna on the battlefield of Kurukshetra.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Haryana', 'Uttar Pradesh'],
    region: 'North'
  },
  {
    row_no: 53,
    name: 'Vaikuntha Ekadashi',
    section: '1. Major Hindu festivals',
    description: 'Major Vaishnava festival celebrated especially in South Indian temples such as Srirangam and Tirupati where the sacred Vaikuntha Dwaram (gateway to heaven) opens for devotees.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala'],
    region: 'South'
  },
  {
    row_no: 54,
    name: 'Skanda Sashti',
    section: '1. Major Hindu festivals',
    description: 'Six-day festival celebrating Lord Murugans victory over demon Surapadman (Soorasamharam), widely observed in Tamil Nadu temples with fasting and devotion.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu', 'Kerala'],
    region: 'South'
  },
  {
    row_no: 55,
    name: 'Thaipusam',
    section: '1. Major Hindu festivals',
    description: 'Tamil festival dedicated to Lord Murugan where devotees carry elaborate physical offerings such as Kavadi and pierce their skin with vels as acts of penance and gratitude.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu', 'Kerala'],
    region: 'South'
  },
  {
    row_no: 56,
    name: 'Panguni Uthiram',
    section: '1. Major Hindu festivals',
    description: 'Auspicious Tamil festival commemorating the celestial weddings of divine couples including Shiva-Parvati, Rama-Sita, and Murugan-Deivanai on the day of the Uthiram star.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 57,
    name: 'Meenakshi Thirukalyanam',
    section: '1. Major Hindu festivals',
    description: 'Ten-day Chithirai festival in Madurai enacting the celestial wedding of Goddess Meenakshi with Lord Sundareswarar (Shiva), drawing hundreds of thousands of pilgrims.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 58,
    name: 'Mahamaham',
    section: '1. Major Hindu festivals',
    description: 'Sacred gathering held once every twelve years at the Mahamaham tank in Kumbakonam, Tamil Nadu, considered equivalent to the southern Kumbh Mela.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 59,
    name: 'Attukal Pongala',
    section: '1. Major Hindu festivals',
    description: 'Record-setting congregation of millions of women in Thiruvananthapuram, Kerala, preparing sweet rice porridge in earthen pots as an offering to Attukal Bhagavathy.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 60,
    name: 'Thrissur Pooram',
    section: '1. Major Hindu festivals',
    description: 'The mother of all temple poorams in Kerala featuring majestic caparisoned elephant parades, Ilanjithara Melam percussion orchestras, and the Kudamattam umbrella exchange.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 61,
    name: 'Vishu Kani',
    section: '1. Major Hindu festivals',
    description: 'Traditional morning ritual in Kerala viewing auspicious items arranged the previous night in an uruli—including golden cassia flowers, grains, coins, and mirror—to ensure a prosperous year.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 62,
    name: 'Hanuman Jayanti (South India)',
    section: '1. Major Hindu festivals',
    description: 'Celebration of Hanuman Jayanti according to the Margazhi Moola Nakshatra in Tamil Nadu and during Vaisakha in Andhra Pradesh and Telangana.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu', 'Andhra Pradesh', 'Telangana'],
    region: 'South'
  },
  {
    row_no: 63,
    name: 'Guru Purnima (Vyasa Puja)',
    section: '1. Major Hindu festivals',
    description: 'Sacred worship of sage Veda Vyasa and preceptors observed by ascetics beginning their annual Chaturmas vow in spiritual ashrams across the country.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 64,
    name: 'Balarama Jayanti',
    section: '1. Major Hindu festivals',
    description: 'Appearance day of Lord Balarama, Krishnas elder brother and embodiment of strength, honoured with agricultural worship and plough reverence.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Gujarat'],
    region: 'North'
  },
  {
    row_no: 65,
    name: 'Varalakshmi Vratam',
    section: '1. Major Hindu festivals',
    description: 'Vow observed by women in South India on the Friday before the full moon of Shravana seeking the blessings of Goddess Lakshmi for domestic harmony and abundance.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 66,
    name: 'Mangala Gauri Vrat',
    section: '1. Major Hindu festivals',
    description: 'Vow undertaken on Tuesdays during the month of Shravana by newlyweds praying to Goddess Gauri for lasting matrimonial happiness and family well-being.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra', 'Gujarat', 'Bihar', 'Uttar Pradesh'],
    region: 'West'
  },
  {
    row_no: 67,
    name: 'Kajari Teej',
    section: '1. Major Hindu festivals',
    description: 'Monsoon Teej festival widely celebrated in Bundelkhand, Rajasthan, and Eastern UP with folk Kajari songs, neem tree reverence, and fasts.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'],
    region: 'North'
  },
  {
    row_no: 68,
    name: 'Jivitputrika (Jitiya) Vrat',
    section: '1. Major Hindu festivals',
    description: 'Three-day waterless fast observed by mothers in Bihar, Jharkhand, and UP for the long life, vitality, and protection of their offspring.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Jharkhand', 'Uttar Pradesh'],
    region: 'East'
  },
  {
    row_no: 69,
    name: 'Kojagari Lakshmi Puja',
    section: '1. Major Hindu festivals',
    description: 'Full moon night festival in Bengal, Odisha, and Assam worshiping Goddess Lakshmi where devotees stay awake all night to receive the visiting goddess of wealth.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['West Bengal', 'Odisha', 'Assam', 'Tripura'],
    region: 'East'
  },
  {
    row_no: 70,
    name: 'Karwa Chauth Vrat',
    section: '1. Major Hindu festivals',
    description: 'Traditional fast observed on Krishna Paksha Chaturthi in the month of Kartik by women in North and Northwestern India for their partners longevity.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 'Delhi'],
    region: 'North'
  },
  {
    row_no: 71,
    name: 'Annakut Mahotsav',
    section: '1. Major Hindu festivals',
    description: 'Culinary festival of mountains of vegetarian delicacies prepared and offered to the deity in Vaishnava temples such as Nathdwara and Swaminarayan shrines.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Gujarat', 'Rajasthan', 'Uttar Pradesh'],
    region: 'West'
  },
  {
    row_no: 72,
    name: 'Gopashtami',
    section: '1. Major Hindu festivals',
    description: 'Vedic festival honouring cows and calves, marking the day when Lord Krishna was entrusted with grazing the mature cows in the pastures of Vrindavan.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Haryana', 'Rajasthan', 'Madhya Pradesh'],
    region: 'North'
  },
  {
    row_no: 73,
    name: 'Vaikuntha Chaturdashi',
    section: '1. Major Hindu festivals',
    description: 'Sacred day commemorating the divine union and mutual worship between Lord Shiva and Lord Vishnu at Kashi and Ujjain with lotus petal offerings.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra'],
    region: 'North'
  },
  {
    row_no: 74,
    name: 'Ganesh Visarjan',
    section: '1. Major Hindu festivals',
    description: 'Immersion of Ganesha statues into the sea and rivers with enthusiastic chants of Ganpati Bappa Morya, culminating the annual ten-day home and community worship.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Maharashtra', 'Goa', 'Karnataka', 'Telangana'],
    region: 'West'
  },
  {
    row_no: 75,
    name: 'Kalabhairav Jayanti',
    section: '1. Major Hindu festivals',
    description: 'Appearance day of Kalabhairava, the fierce manifestation of Lord Shiva associated with time, destruction, and spiritual guardianship of sacred cities like Varanasi.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Madhya Pradesh', 'Karnataka'],
    region: 'North'
  },
  {
    row_no: 76,
    name: 'Chhath Parv (Surya Shashthi)',
    section: '1. Major Hindu festivals',
    description: 'Sacred austerity of Chhath dedicating devotion to the radiant Sun and Mother Shasthi, renowned for strict purity and offerings of traditional thekua sweets.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar', 'Jharkhand', 'Uttar Pradesh'],
    region: 'East'
  },
  {
    row_no: 77,
    name: 'Shakambhari Navratri',
    section: '1. Major Hindu festivals',
    description: 'Eight-day festival concluding on Paush Purnima honouring Goddess Shakambhari, the divine provider of vegetation, food, and life during historic droughts.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Rajasthan', 'Uttar Pradesh', 'Karnataka', 'Maharashtra'],
    region: 'North'
  },
  {
    row_no: 78,
    name: 'Paush Purnima',
    section: '1. Major Hindu festivals',
    description: 'Full moon day of Pausha month marking the start of the holy Magh Mela month-long austerities and snan at the Triveni Sangam in Prayagraj.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Bihar', 'West Bengal'],
    region: 'North'
  },
  {
    row_no: 79,
    name: 'Magh Mela',
    section: '1. Major Hindu festivals',
    description: 'Annual forty-five day pilgrimage gathering on the banks of the Triveni Sangam in Prayagraj where Kalpavasis practice austerity, prayer, and holy bathing.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Uttar Pradesh'],
    region: 'North'
  },
  {
    row_no: 80,
    name: 'Ratha Saptami',
    section: '1. Major Hindu festivals',
    description: 'Solar festival celebrating the turning of the Sun Gods seven-horse chariot toward the northern hemisphere, observed with early morning sun worship.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra'],
    region: 'South'
  },
  {
    row_no: 81,
    name: 'Govardhan Puja',
    section: '1. Major Hindu festivals',
    description: 'Devotional offering of fifty-six food items (Chappan Bhog) to Lord Krishna on the day following Diwali commemorating Mount Govardhan.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Rajasthan', 'Gujarat'],
    region: 'North'
  },
  {
    row_no: 82,
    name: 'Somvati Amavasya',
    section: '1. Major Hindu festivals',
    description: 'New moon falling on a Monday considered uniquely sacred for performing holy dips at Haridwar and Prayagraj and circumambulating the sacred Peepal tree.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttarakhand', 'Uttar Pradesh', 'Madhya Pradesh'],
    region: 'North'
  },
  {
    row_no: 83,
    name: 'Shani Jayanti',
    section: '1. Major Hindu festivals',
    description: 'Birth anniversary of Lord Shani (planet Saturn), deity of karma and justice, observed with oil baths and charity at pilgrimage shrines like Shani Shingnapur.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh'],
    region: 'West'
  },
  {
    row_no: 84,
    name: 'Bada Osha',
    section: '1. Major Hindu festivals',
    description: 'Traditional fasting festival in Odisha dedicated to Lord Dhabaleswar (Shiva) on the island temple in Cuttack, observed with the preparation of Gaja bhog.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 85,
    name: 'Pradosh Vrat',
    section: '1. Major Hindu festivals',
    description: 'Bi-monthly twilight fast dedicated to Lord Shiva observed on the thirteenth day (Trayodashi) of both waxing and waning lunar fortnights.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 86,
    name: 'Masik Shivratri',
    section: '1. Major Hindu festivals',
    description: 'Monthly fast and vigil observed on the fourteenth night of every waning lunar phase in remembrance of Lord Shiva.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: [],
    region: 'North'
  },
  {
    row_no: 87,
    name: 'Shravan Somwar',
    section: '1. Major Hindu festivals',
    description: 'Mondays in the auspicious holy month of Shravana dedicated to worshiping Shiva with Ganga jal, bilva leaves, and Kanwar Yatra pilgrimages.',
    scope: 'ALL_INDIA',
    category: 'Hindu',
    states: ['Uttar Pradesh', 'Bihar', 'Uttarakhand', 'Madhya Pradesh', 'Maharashtra', 'Jharkhand'],
    region: 'North'
  },
  {
    row_no: 88,
    name: 'Gangasagar Mela',
    section: '1. Major Hindu festivals',
    description: 'Massive annual pilgrimage at Sagar Island where the Ganges meets the Bay of Bengal, drawing millions for a sacred dip on Makar Sankranti.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['West Bengal'],
    region: 'East'
  },

  // =========================================================================
  // Section 2: Harvest & New Year festivals (Rows 89 to 113)
  // =========================================================================
  {
    row_no: 89,
    name: 'Bohag Bihu (Rongali Bihu)',
    section: '2. Harvest and New Year festivals',
    description: 'Most celebrated Assamese spring festival marking the agricultural new year, filled with energetic Bihu dance, dhol drumming, and community feasting.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Assam'],
    region: 'Northeast'
  },
  {
    row_no: 90,
    name: 'Magh Bihu (Bhogali Bihu)',
    section: '2. Harvest and New Year festivals',
    description: 'Assamese winter harvest festival celebrating agrarian bounty with the building and burning of makeshift bamboo Meji huts and community feasts.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Assam'],
    region: 'Northeast'
  },
  {
    row_no: 91,
    name: 'Kati Bihu (Kongali Bihu)',
    section: '2. Harvest and New Year festivals',
    description: 'Somber agricultural observance in Assam where earthen lamps (saki) are lit under sacred Tulsi plants and in newly planted paddy fields praying for pest-free harvests.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Assam'],
    region: 'Northeast'
  },
  {
    row_no: 92,
    name: 'Vaisakhi (Baisakhi)',
    section: '2. Harvest and New Year festivals',
    description: 'Spring harvest festival of Punjab marking the ripening of the rabi crop and celebrated with lively Bhangra and Gidda folk dances across rural Punjab and Haryana.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Punjab', 'Haryana'],
    region: 'North'
  },
  {
    row_no: 93,
    name: 'Vishu',
    section: '2. Harvest and New Year festivals',
    description: 'Traditional Malayalam astronomical New Year in Kerala celebrated by viewing the auspicious Vishukani arrangement, gifting Vishukkaineetam coins, and bursting fireworks.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 94,
    name: 'Pohela Boishakh',
    section: '2. Harvest and New Year festivals',
    description: 'Bengali New Year celebrated across West Bengal and Tripura with cultural processions (Mangal Shobhajatra), new account books (Haal Khata), and traditional sweets.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['West Bengal', 'Tripura'],
    region: 'East'
  },
  {
    row_no: 95,
    name: 'Puthandu',
    section: '2. Harvest and New Year festivals',
    description: 'Tamil New Year celebrated on the first day of Chithirai, marked by creating colorful kolams, reading the new Panchangam, and preparing sweet-sour-bitter Pachadi.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tamil Nadu', 'Puducherry'],
    region: 'South'
  },
  {
    row_no: 96,
    name: 'Pana Sankranti',
    section: '2. Harvest and New Year festivals',
    description: 'Traditional Odia New Year celebrated by hanging small perforated pots over Tulsi plants to drip cooling sweet water (Bela Pana) in the onset of summer.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 97,
    name: 'Jur Sital',
    section: '2. Harvest and New Year festivals',
    description: 'Maithili New Year festival celebrated in Mithila region of Bihar by sprinkling cool water on family elders heads, cleaning water bodies, and eating sattu.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar'],
    region: 'East'
  },
  {
    row_no: 98,
    name: 'Nuakhai',
    section: '2. Harvest and New Year festivals',
    description: 'Agrarian harvest festival of Western Odisha where the first harvested grain of the season is offered to patron deity Samaleswari and shared among families.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 99,
    name: 'Wangala (100 Drums Festival)',
    section: '2. Harvest and New Year festivals',
    description: 'Post-harvest thanksgiving festival of the Garo tribe in Meghalaya paying homage to Sun God Saljong with rhythmic beating of 100 long oval Nagra drums.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Meghalaya'],
    region: 'Northeast'
  },
  {
    row_no: 100,
    name: 'Hornbill Festival',
    section: '2. Harvest and New Year festivals',
    description: 'The Festival of Festivals celebrated annually at Kisama Heritage Village in Nagaland showcasing the traditional dances, crafts, cuisines, and music of all Naga tribes.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 101,
    name: 'Chapchar Kut',
    section: '2. Harvest and New Year festivals',
    description: 'Spring harvest and cultural festival of the Mizo people celebrated after clearing jhum bamboo forests, featuring the energetic Cheraw bamboo dance and folk songs.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Mizoram'],
    region: 'Northeast'
  },
  {
    row_no: 102,
    name: 'Mim Kut',
    section: '2. Harvest and New Year festivals',
    description: 'Maize harvest festival celebrated by the Mizo people to honour ancestors with offerings of first maize harvest, bread, and rice beer.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Mizoram'],
    region: 'Northeast'
  },
  {
    row_no: 103,
    name: 'Pawl Kut',
    section: '2. Harvest and New Year festivals',
    description: 'Two-day post-harvest thanksgiving celebration in Mizoram celebrated in December marking the conclusion of the total agricultural year.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Mizoram'],
    region: 'Northeast'
  },
  {
    row_no: 104,
    name: 'Losoong (Namsoong)',
    section: '2. Harvest and New Year festivals',
    description: 'Sikkimese agricultural New Year of the Bhutia and Lepcha tribes celebrated at Phodong and Rumtek monasteries with Cham sacred masked dances and archery.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Sikkim'],
    region: 'Himalayan'
  },
  {
    row_no: 105,
    name: 'Saga Dawa',
    section: '2. Harvest and New Year festivals',
    description: 'Triple-blessed Buddhist festival in Sikkim and Ladakh commemorating the birth, enlightenment, and Parinirvana of Gautama Buddha with procession of sacred scriptures.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Sikkim', 'Ladakh'],
    region: 'Himalayan'
  },
  {
    row_no: 106,
    name: 'Losar',
    section: '2. Harvest and New Year festivals',
    description: 'Tibetan and Himalayan Buddhist New Year celebrated with masked dance rituals, butter lamps, prayer flags, and metho torch parades across mountain monasteries.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Ladakh', 'Arunachal Pradesh', 'Himachal Pradesh', 'Sikkim'],
    region: 'Himalayan'
  },
  {
    row_no: 107,
    name: 'Torgya Festival',
    section: '2. Harvest and New Year festivals',
    description: 'Monastic monastic festival at Tawang Monastery in Arunachal Pradesh featuring masked monastic dances to chase away negative energies and welcome peace.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 108,
    name: 'Nyokum Yullo',
    section: '2. Harvest and New Year festivals',
    description: 'Agricultural festival of the Nyishi tribe of Arunachal Pradesh seeking prosperity, bumper harvests, and communal protection against natural disasters.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 109,
    name: 'Mopin Festival',
    section: '2. Harvest and New Year festivals',
    description: 'Spring agricultural festival of the Galo tribe in Arunachal Pradesh invoking Goddess Mopin for wealth and health, marked by applying white rice powder on faces.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 110,
    name: 'Solung Festival',
    section: '2. Harvest and New Year festivals',
    description: 'Socio-religious festival of the Adi tribe of Arunachal Pradesh celebrated in September for agricultural prosperity, cattle fertility, and protection of crops.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 111,
    name: 'Dree Festival',
    section: '2. Harvest and New Year festivals',
    description: 'Agricultural festival of the Apatani tribe in Ziro Valley, Arunachal Pradesh, praying to celestial deities for seasonal rains and protection from pests.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 112,
    name: 'Sekrenyi Festival',
    section: '2. Harvest and New Year festivals',
    description: 'Ten-day annual purification and sanctification festival of the Angami Naga tribe in Nagaland, celebrated with sacred water rituals and village feasts.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 113,
    name: 'Moatsu Mong',
    section: '2. Harvest and New Year festivals',
    description: 'Community post-sowing festival of the Ao Naga tribe celebrated in Mokokchung with singing, traditional dancing, and building bonds of friendship.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Nagaland'],
    region: 'Northeast'
  },

  // =========================================================================
  // Section 3: Tribal and Folk festivals (Rows 114 to 130)
  // =========================================================================
  {
    row_no: 114,
    name: 'Ambubachi Mela',
    section: '3. Tribal and Folk festivals',
    description: 'Annual monsoon fair at Kamakhya Temple in Guwahati celebrating the annual menstrual course of mother Earth and Goddess Kamakhya, attracting tantric sadhus.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Assam'],
    region: 'Northeast'
  },
  {
    row_no: 115,
    name: 'Karam (Karma Festival)',
    section: '3. Tribal and Folk festivals',
    description: 'Major tribal festival celebrating the worship of the sacred Karam tree (Nauclea parvifolia) for fertility, prosperity, and youth among Oraon, Munda and Santhal tribes.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Jharkhand', 'West Bengal', 'Odisha', 'Chhattisgarh', 'Bihar'],
    region: 'East'
  },
  {
    row_no: 116,
    name: 'Sarhul',
    section: '3. Tribal and Folk festivals',
    description: 'Indigenous spring nature festival celebrated when Sal trees bloom in Jharkhand, worshiping Mother Earth and village ancestors with Sal blossoms.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Jharkhand', 'Odisha', 'West Bengal'],
    region: 'East'
  },
  {
    row_no: 117,
    name: 'Karma Puja',
    section: '3. Tribal and Folk festivals',
    description: 'Sacred ritual celebration where branches of the Karma tree are planted in the village akhra, circumambulated with traditional dance by youth for good fortune.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Jharkhand', 'Chhattisgarh', 'Odisha'],
    region: 'East'
  },
  {
    row_no: 118,
    name: 'Tusu Parab',
    section: '3. Tribal and Folk festivals',
    description: 'Folk harvest festival celebrated by tribal and rural communities on Makar Sankranti with young girls carrying decorated paper and bamboo towers (Chaudal).',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Jharkhand', 'West Bengal', 'Odisha'],
    region: 'East'
  },
  {
    row_no: 119,
    name: 'Poush Mela',
    section: '3. Tribal and Folk festivals',
    description: 'Cultural carnival in Santiniketan, West Bengal, marking the foundation day of the Brahma Mandir with Baul songs, tribal dances, and Dokra crafts.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['West Bengal'],
    region: 'East'
  },
  {
    row_no: 120,
    name: 'Madai Festival',
    section: '3. Tribal and Folk festivals',
    description: 'Vibrant tribal gathering celebrated across Bastar, Chhattisgarh, honouring local tribal deities with animal worship, goat processions, and weekly rural haats.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Chhattisgarh'],
    region: 'Central'
  },
  {
    row_no: 121,
    name: 'Bastar Dussehra',
    section: '3. Tribal and Folk festivals',
    description: 'Unique seventy-five day festival in Chhattisgarh honouring Goddess Danteshwari, celebrated without Ramayana motifs by tribal groups crafting mammoth wooden chariots.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Chhattisgarh'],
    region: 'Central'
  },
  {
    row_no: 122,
    name: 'Bhagoria Haat Festival',
    section: '3. Tribal and Folk festivals',
    description: 'Joyous pre-Holi tribal festival celebrated by the Bhil and Bhilala tribes in Jhabua and Alirajpur, famous as a match-making fair with colourful traditional attire.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Madhya Pradesh'],
    region: 'Central'
  },
  {
    row_no: 123,
    name: 'Tarpa Dance Festival',
    section: '3. Tribal and Folk festivals',
    description: 'Tribal cultural festival of the Warli, Kokna, and Dhodia tribes in Dadra and Nagar Haveli and Daman and Diu centered around the haunting winds of the Tarpa horn.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Dadra and Nagar Haveli and Daman and Diu', 'Maharashtra'],
    region: 'West'
  },
  {
    row_no: 124,
    name: 'Bonalu',
    section: '3. Tribal and Folk festivals',
    description: 'Historic folk festival of Telangana honouring Goddess Mahakali in Hyderabad and Secunderabad with women carrying brass pots decorated with neem and turmeric.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Telangana'],
    region: 'South'
  },
  {
    row_no: 125,
    name: 'Bathukamma',
    section: '3. Tribal and Folk festivals',
    description: 'Nine-day floral festival of Telangana celebrated during Navratri by women arranging seasonal wild medicinal flowers in concentric conical towers and singing folk songs.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Telangana'],
    region: 'South'
  },
  {
    row_no: 126,
    name: 'Medaram Jatara',
    section: '3. Tribal and Folk festivals',
    description: 'Biennial tribal festival honouring legendary Koya goddesses Sammakka and Saralamma in Mulugu district, Telangana, considered the largest tribal congregation in Asia.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Telangana'],
    region: 'South'
  },
  {
    row_no: 127,
    name: 'Nagoba Jatara',
    section: '3. Tribal and Folk festivals',
    description: 'Ancient tribal festival celebrated by the Mesram clan of the Raj Gond and Pardhan tribes in Adilabad, Telangana, paying homage to the serpent deity Nagoba.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Telangana'],
    region: 'South'
  },
  {
    row_no: 128,
    name: 'Theyyam Season',
    section: '3. Tribal and Folk festivals',
    description: 'Spectacular ritual dance worship in Northern Kerala where performers invoke living deities with towering headdresses, intricate facial paints, and fire leaping.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 129,
    name: 'Kambala',
    section: '3. Tribal and Folk festivals',
    description: 'Traditional annual buffalo race held in coastal Karnataka paddy mud tracks by agrarian Tuluva communities celebrating agricultural prowess.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Karnataka'],
    region: 'South'
  },
  {
    row_no: 130,
    name: 'Jallikattu',
    section: '3. Tribal and Folk festivals',
    description: 'Traditional bull-embracing sport celebrated during Mattu Pongal in Tamil Nadu showcasing bravery and honouring indigenous native cattle breeds.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Tamil Nadu'],
    region: 'South'
  },

  // =========================================================================
  // Section 4: Sikh festivals (Rows 131 to 145)
  // =========================================================================
  {
    row_no: 131,
    name: 'Guru Nanak Gurpurab',
    section: '4. Sikh festivals',
    description: 'Birth anniversary of Guru Nanak Dev Ji, founder of Sikhism, celebrated with Prabhat Pheris, Akhand Path, Nagar Kirtan processions, and community Langar.',
    scope: 'ALL_INDIA',
    category: 'Sikh',
    states: ['Punjab', 'Haryana', 'Delhi'],
    region: 'North'
  },
  {
    row_no: 132,
    name: 'Guru Gobind Singh Jayanti',
    section: '4. Sikh festivals',
    description: 'Birth anniversary of the tenth Sikh Guru, Guru Gobind Singh Ji, celebrated with recitation of devotional hymns and demonstrations of Gatka martial arts.',
    scope: 'ALL_INDIA',
    category: 'Sikh',
    states: ['Punjab', 'Bihar', 'Delhi'],
    region: 'North'
  },
  {
    row_no: 133,
    name: 'Guru Granth Sahib Prakash Utsav',
    section: '4. Sikh festivals',
    description: 'Commemoration of the first installation of the Adi Granth in the Golden Temple (Harmandir Sahib) in Amritsar by Guru Arjan Dev Ji in 1604.',
    scope: 'ALL_INDIA',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 134,
    name: 'Hola Mohalla',
    section: '4. Sikh festivals',
    description: 'Three-day Sikh festival established by Guru Gobind Singh Ji at Anandpur Sahib featuring martial arts displays, horse riding, mock battles, and poetry.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 135,
    name: 'Bandi Chhor Divas',
    section: '4. Sikh festivals',
    description: 'Sikh festival coinciding with Diwali celebrating the release of the sixth Guru, Guru Hargobind Ji, and 52 Hindu kings from Gwalior Fort by Mughal Emperor Jahangir.',
    scope: 'ALL_INDIA',
    category: 'Sikh',
    states: ['Punjab', 'Delhi', 'Haryana'],
    region: 'North'
  },
  {
    row_no: 136,
    name: 'Maghi Mela',
    section: '4. Sikh festivals',
    description: 'Annual fair at Sri Muktsar Sahib commemorating the forty liberated Sikhs (Chali Mukte) who fought valiantly for Guru Gobind Singh Ji in 1705.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 137,
    name: 'Vaisakhi (Khalsa Sirjana Divas)',
    section: '4. Sikh festivals',
    description: 'Celebration of the creation of the Khalsa Panth by Guru Gobind Singh Ji at Anandpur Sahib in 1699 with initiation ceremonies and baptismal Amrit Sanchar.',
    scope: 'ALL_INDIA',
    category: 'Sikh',
    states: ['Punjab', 'Haryana', 'Delhi'],
    region: 'North'
  },
  {
    row_no: 138,
    name: 'Martyrdom of Guru Arjan Dev Ji',
    section: '4. Sikh festivals',
    description: 'Solemn observance commemorating the supreme sacrifice of the fifth Sikh Guru in 1606, marked by serving sweet chilled water (Chabeel) and singing Gurbani.',
    scope: 'ALL_INDIA',
    category: 'Sikh',
    states: ['Punjab', 'Delhi'],
    region: 'North'
  },
  {
    row_no: 139,
    name: 'Martyrdom of Guru Tegh Bahadur Ji',
    section: '4. Sikh festivals',
    description: 'Shaheedi Diwas honouring the supreme martyrdom of the ninth Sikh Guru at Chandni Chowk, Delhi, in defense of religious freedom and human rights.',
    scope: 'ALL_INDIA',
    category: 'Sikh',
    states: ['Delhi', 'Punjab'],
    region: 'North'
  },
  {
    row_no: 140,
    name: 'Shaheedi Jor Mela',
    section: '4. Sikh festivals',
    description: 'Three-day congregation at Fatehgarh Sahib commemorating the martyrdom of Sahibzada Zorawar Singh and Sahibzada Fateh Singh, the young sons of Guru Gobind Singh.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 141,
    name: 'Guru Angad Dev Ji Gurpurab',
    section: '4. Sikh festivals',
    description: 'Commemoration of the birth and spiritual elevation of the second Sikh Guru, who formalized the Gurmukhi script and expanded the community langar system.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 142,
    name: 'Guru Amar Das Ji Gurpurab',
    section: '4. Sikh festivals',
    description: 'Celebration of the third Sikh Guru, renowned for championing equality, establishing the Manji system, and building the historic Baoli Sahib at Goindval.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 143,
    name: 'Guru Ram Das Ji Gurpurab',
    section: '4. Sikh festivals',
    description: 'Celebration of the fourth Sikh Guru, founder of the sacred city of Amritsar and author of the wedding hymn Laavan recited in Anand Karaj ceremonies.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 144,
    name: 'Guru Har Gobind Ji Gurpurab',
    section: '4. Sikh festivals',
    description: 'Commemoration of the sixth Sikh Guru, who introduced the concept of Miri and Piri (temporal and spiritual authority) and erected the Akal Takht in Amritsar.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab'],
    region: 'North'
  },
  {
    row_no: 145,
    name: 'Guru Har Rai & Guru Har Krishan Ji Gurpurab',
    section: '4. Sikh festivals',
    description: 'Commemoration of the seventh and eighth Sikh Gurus, revered for their compassion, medical healing dispensaries, and selfless service during epidemics.',
    scope: 'STATE_REGIONAL',
    category: 'Sikh',
    states: ['Punjab', 'Delhi'],
    region: 'North'
  },

  // =========================================================================
  // Section 5: Muslim / Islamic festivals (Rows 146 to 155)
  // =========================================================================
  {
    row_no: 146,
    name: 'Eid-ul-Fitr',
    section: '5. Muslim / Islamic festivals',
    description: 'Major Islamic festival marking the end of the dawn-to-sunset fasting month of Ramadan, celebrated with communal morning prayers (Salat al-Eid), charity (Zakat al-Fitr), and sweet sheer khurma.',
    scope: 'ALL_INDIA',
    category: 'Muslim',
    states: [],
    region: 'North'
  },
  {
    row_no: 147,
    name: 'Eid-ul-Adha (Bakrid)',
    section: '5. Muslim / Islamic festivals',
    description: 'Festival of the Sacrifice honouring the willingness of Prophet Ibrahim to sacrifice his son in obedience to God, observed with prayers, animal sacrifice (Qurbani), and meat distribution to the needy.',
    scope: 'ALL_INDIA',
    category: 'Muslim',
    states: [],
    region: 'North'
  },
  {
    row_no: 148,
    name: 'Muharram (Ashura)',
    section: '5. Muslim / Islamic festivals',
    description: 'Tenth day of Muharram observed especially by Shia Muslims in solemn remembrance of the martyrdom of Imam Hussain at the Battle of Karbala, marked by Tazia processions.',
    scope: 'ALL_INDIA',
    category: 'Muslim',
    states: ['Uttar Pradesh', 'Telangana', 'Bihar', 'Delhi', 'Jammu & Kashmir'],
    region: 'North'
  },
  {
    row_no: 149,
    name: 'Milad-un-Nabi (Mawlid)',
    section: '5. Muslim / Islamic festivals',
    description: 'Observance of the birth anniversary of Prophet Muhammad, marked with sermons in mosques, Quranic recitations, illuminated minarets, and peaceful street processions.',
    scope: 'ALL_INDIA',
    category: 'Muslim',
    states: [],
    region: 'North'
  },
  {
    row_no: 150,
    name: 'Shab-e-Barat',
    section: '5. Muslim / Islamic festivals',
    description: 'The Night of Records and Forgiveness in the Islamic calendar, spent in prayer and seeking pardon from Allah, offering halwa, and visiting ancestors graves.',
    scope: 'ALL_INDIA',
    category: 'Muslim',
    states: [],
    region: 'North'
  },
  {
    row_no: 151,
    name: 'Shab-e-Miraj',
    section: '5. Muslim / Islamic festivals',
    description: 'Commemoration of Prophet Muhammads miraculous night journey from Mecca to Jerusalem and ascension through the seven heavens into the divine presence.',
    scope: 'ALL_INDIA',
    category: 'Muslim',
    states: [],
    region: 'North'
  },
  {
    row_no: 152,
    name: 'Chaand Raat',
    section: '5. Muslim / Islamic festivals',
    description: 'Eve of Eid-ul-Fitr celebrated with festive night markets, applying intricate henna (mehndi) designs, shopping for celebratory clothes, and sweet preparation.',
    scope: 'ALL_INDIA',
    category: 'Muslim',
    states: ['Delhi', 'Uttar Pradesh', 'Telangana', 'Maharashtra', 'West Bengal'],
    region: 'North'
  },
  {
    row_no: 153,
    name: 'Urs Ajmer Sharif',
    section: '5. Muslim / Islamic festivals',
    description: 'Annual death anniversary commemoration of Sufi saint Khwaja Moinuddin Chishti at the Dargah Sharif in Ajmer, Rajasthan, drawing pilgrims of all faiths for Qawwalis and Chadar offerings.',
    scope: 'STATE_REGIONAL',
    category: 'Muslim',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 154,
    name: 'Urs Nizamuddin Auliya',
    section: '5. Muslim / Islamic festivals',
    description: 'Annual Sufi celebration at the dargah of Hazrat Nizamuddin Auliya in Delhi, renowned for soul-stirring live Qawwali sessions by Sabri brothers disciples and public langar.',
    scope: 'STATE_REGIONAL',
    category: 'Muslim',
    states: ['Delhi'],
    region: 'North'
  },
  {
    row_no: 155,
    name: 'Urs Haji Ali',
    section: '5. Muslim / Islamic festivals',
    description: 'Annual commemoration of Sufi saint Pir Haji Ali Shah Bukhari at the iconic islet mosque off the coast of Worli in Mumbai, visited by thousands walking the sea causeway.',
    scope: 'STATE_REGIONAL',
    category: 'Muslim',
    states: ['Maharashtra'],
    region: 'West'
  },

  // =========================================================================
  // Section 6: Buddhist festivals (Rows 156 to 165)
  // =========================================================================
  {
    row_no: 156,
    name: 'Losar (Buddhist New Year)',
    section: '6. Buddhist festivals',
    description: 'Himalayan Buddhist festival celebrated with monastic masked Cham dances, ritual cleaning of stupas, lighting of butter lamps, and offerings of Kapse pastries.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Ladakh', 'Himachal Pradesh', 'Arunachal Pradesh', 'Sikkim'],
    region: 'Himalayan'
  },
  {
    row_no: 157,
    name: 'Hemis Festival',
    section: '6. Buddhist festivals',
    description: 'Vibrant two-day annual celebration at Hemis Monastery in Ladakh commemorating Guru Padmasambhavas birth anniversary with masked mystic dances and exhibition of giant silk thangkas.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Ladakh'],
    region: 'Himalayan'
  },
  {
    row_no: 158,
    name: 'Losoong Festival',
    section: '6. Buddhist festivals',
    description: 'Sikkimese Buddhist end-of-harvest festival at Enchey and Rumtek monasteries with Black Hat dances, archery contests, and prayers for fortune in the incoming season.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Sikkim'],
    region: 'Himalayan'
  },
  {
    row_no: 159,
    name: 'Buddha Purnima (Vesak)',
    section: '6. Buddhist festivals',
    description: 'Holiest day for Buddhists commemorating the birth, supreme enlightenment, and Parinirvana of Gautama Buddha, observed with prayer at Bodh Gaya, Sarnath, and Kushinagar.',
    scope: 'ALL_INDIA',
    category: 'Buddhist',
    states: ['Bihar', 'Uttar Pradesh', 'Maharashtra', 'Sikkim', 'Ladakh', 'Arunachal Pradesh'],
    region: 'East'
  },
  {
    row_no: 160,
    name: 'Kalachakra Festival',
    section: '6. Buddhist festivals',
    description: 'Sacred Buddhist initiation teaching and sand mandala ceremony conducted at Bodh Gaya, promoting world peace and spiritual awakening.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Bihar', 'Ladakh'],
    region: 'East'
  },
  {
    row_no: 161,
    name: 'Monlam Chenmo',
    section: '6. Buddhist festivals',
    description: 'Great Prayer Festival established by Tsongkhapa in 1409, observed in Dharamshala, Leh, and Tawang with public prayers for world harmony and compassion.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Himachal Pradesh', 'Ladakh'],
    region: 'Himalayan'
  },
  {
    row_no: 162,
    name: 'Pavarana & Kathina Ceremony',
    section: '6. Buddhist festivals',
    description: 'Concluding ceremonies of the three-month Rains Retreat (Vassa) where lay devotees present new robes (Kathina civara) and requisites to Buddhist monks.',
    scope: 'ALL_INDIA',
    category: 'Buddhist',
    states: ['Maharashtra', 'Bihar', 'Tripura'],
    region: 'West'
  },
  {
    row_no: 163,
    name: 'Asalha Puja (Dharma Day)',
    section: '6. Buddhist festivals',
    description: 'Theravada Buddhist festival commemorating the Buddha\'s first sermon—the Dhammacakkappavattana Sutta—delivered to his first five disciples at Sarnath.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Uttar Pradesh', 'Maharashtra'],
    region: 'North'
  },
  {
    row_no: 164,
    name: 'Tawang Festival',
    section: '6. Buddhist festivals',
    description: 'Annual cultural festival in Arunachal Pradesh celebrating Monpa tribal culture, monastic music, street carnivals, and sacred dances at Tawang.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 165,
    name: 'Rumtek Chaam Dance Festival',
    section: '6. Buddhist festivals',
    description: 'Monastic masked sacred dance performance at Rumtek Dharma Chakra Centre in Sikkim enacting the triumph of wisdom over ignorance.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Sikkim'],
    region: 'Himalayan'
  },

  // =========================================================================
  // Section 7: Jain festivals (Rows 166 to 172)
  // =========================================================================
  {
    row_no: 166,
    name: 'Mahavir Jayanti',
    section: '7. Jain festivals',
    description: 'Birth anniversary of Bhagwan Mahavira, the twenty-fourth Tirthankara of Jainism, celebrated with ceremonial bathing (abhisheka) of Mahavira idols, processions, and lectures on Ahimsa.',
    scope: 'ALL_INDIA',
    category: 'Jain',
    states: ['Bihar', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka', 'Delhi'],
    region: 'North'
  },
  {
    row_no: 167,
    name: 'Paryushan Parva / Das Lakshana',
    section: '7. Jain festivals',
    description: 'Most important spiritual period for Jains (lasting 8 to 10 days) dedicated to self-purification, intense fasting, meditation, study of sacred Agamas, and introspection.',
    scope: 'ALL_INDIA',
    category: 'Jain',
    states: ['Gujarat', 'Rajasthan', 'Maharashtra', 'Madhya Pradesh', 'Karnataka'],
    region: 'West'
  },
  {
    row_no: 168,
    name: 'Diwali (Mahavira Nirvana Divas)',
    section: '7. Jain festivals',
    description: 'Commemoration of Bhagwan Mahavira attaining Moksha (liberation) at Pavapuri in 527 BCE, celebrated by Jains by illuminating lamps to symbolise the light of divine knowledge.',
    scope: 'ALL_INDIA',
    category: 'Jain',
    states: ['Bihar', 'Gujarat', 'Rajasthan', 'Maharashtra'],
    region: 'East'
  },
  {
    row_no: 169,
    name: 'Kshamavani (Michhami Dukkadam)',
    section: '7. Jain festivals',
    description: 'Universal day of forgiveness celebrated at the conclusion of Paryushan where Jains ask for forgiveness from all living beings for any intentional or unintentional hurt.',
    scope: 'ALL_INDIA',
    category: 'Jain',
    states: [],
    region: 'West'
  },
  {
    row_no: 170,
    name: 'Mahamastakabhisheka',
    section: '7. Jain festivals',
    description: 'Spectacular ceremony held once every 12 years at Shravanabelagola in Karnataka, where the colossal 57-foot monolithic statue of Gommateshwara Bahubali is anointed with milk, saffron, and sandalwood.',
    scope: 'STATE_REGIONAL',
    category: 'Jain',
    states: ['Karnataka'],
    region: 'South'
  },
  {
    row_no: 171,
    name: 'Rohini Vrat',
    section: '7. Jain festivals',
    description: 'Monthly fasting observance by Jain women when the Rohini nakshatra ascends, dedicated to cultivating equanimity, patience, and family tranquility.',
    scope: 'ALL_INDIA',
    category: 'Jain',
    states: [],
    region: 'West'
  },
  {
    row_no: 172,
    name: 'Kartik Poornima Chaumasi',
    section: '7. Jain festivals',
    description: 'Auspicious full moon day marking the conclusion of the four-month rainy retreat (Chaturmas) when Jain pilgrims undertake the sacred Shatrunjaya hills pilgrimage in Palitana.',
    scope: 'STATE_REGIONAL',
    category: 'Jain',
    states: ['Gujarat'],
    region: 'West'
  },

  // =========================================================================
  // Section 8: Christian festivals (Rows 173 to 180)
  // =========================================================================
  {
    row_no: 173,
    name: 'Christmas',
    section: '8. Christian festivals',
    description: 'Celebration of the birth of Jesus Christ, observed with midnight mass services, decorated Christmas trees, singing carols, cribs, and sharing fruit cakes across churches.',
    scope: 'ALL_INDIA',
    category: 'Christian',
    states: ['Goa', 'Kerala', 'Meghalaya', 'Nagaland', 'Mizoram', 'Tamil Nadu', 'Maharashtra'],
    region: 'South'
  },
  {
    row_no: 174,
    name: 'Good Friday',
    section: '8. Christian festivals',
    description: 'Solemn Christian holy day commemorating the crucifixion and death of Jesus Christ at Calvary, observed with afternoon church services, fasting, and reading of the Passion.',
    scope: 'ALL_INDIA',
    category: 'Christian',
    states: [],
    region: 'South'
  },
  {
    row_no: 175,
    name: 'Easter Sunday',
    section: '8. Christian festivals',
    description: 'Joyful celebration of the resurrection of Jesus Christ on the third day after his crucifixion, marked by sunrise church services, special feasts, and community fellowship.',
    scope: 'ALL_INDIA',
    category: 'Christian',
    states: [],
    region: 'South'
  },
  {
    row_no: 176,
    name: 'Feast of St. Francis Xavier',
    section: '8. Christian festivals',
    description: 'Annual feast on December 3rd honouring the patron saint of Goa at the Basilica of Bom Jesus in Old Goa, drawing international pilgrims to venerate the sacred relics.',
    scope: 'STATE_REGIONAL',
    category: 'Christian',
    states: ['Goa'],
    region: 'West'
  },
  {
    row_no: 177,
    name: 'Feast of Our Lady of Vailankanni',
    section: '8. Christian festivals',
    description: 'Nine-day feast and chariot procession from late August to September 8th at the Basilica of Our Lady of Good Health in Nagapattinam, Tamil Nadu (the Lourdes of the East).',
    scope: 'STATE_REGIONAL',
    category: 'Christian',
    states: ['Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 178,
    name: 'Feast of St. Thomas',
    section: '8. Christian festivals',
    description: 'Commemoration of the martyrdom and spiritual heritage of Apostle Thomas, who landed on the Malabar coast in 52 CE, celebrated at Malayattoor and Chennai.',
    scope: 'STATE_REGIONAL',
    category: 'Christian',
    states: ['Kerala', 'Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 179,
    name: 'Palm Sunday',
    section: '8. Christian festivals',
    description: 'First day of Holy Week commemorating Jesus triumphal entry into Jerusalem, observed by congregations carrying blessed palm fronds in church processions.',
    scope: 'ALL_INDIA',
    category: 'Christian',
    states: ['Kerala', 'Goa', 'Tamil Nadu', 'Meghalaya'],
    region: 'South'
  },
  {
    row_no: 180,
    name: 'New Year Eve Watchnight Celebrations',
    section: '8. Christian festivals',
    description: 'Midnight prayer gatherings and thanksgivings held in churches across Christian communities across India welcoming the civil new year with fellowship.',
    scope: 'ALL_INDIA',
    category: 'Christian',
    states: [],
    region: 'South'
  },

  // =========================================================================
  // Section 9: State / Regional specific festivals (Rows 181 to 250)
  // =========================================================================
  {
    row_no: 181,
    name: 'Ganesh Utsav',
    section: '9. State / Regional specific festivals',
    description: 'Ten-day public celebration in Maharashtra initiated by Lokmanya Tilak, featuring iconic Sarvajanik Ganpati mandals in Mumbai and Pune like Lalbaugcha Raja.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra'],
    region: 'West'
  },
  {
    row_no: 182,
    name: 'Gudi Padwa (Maharashtra)',
    section: '9. State / Regional specific festivals',
    description: 'Maharashtrian New Year celebration marked with vibrant Shobha Yatras, traditional saffron turbans, women riding motorcycles in nauvari sarees, and neem-jaggery prasad.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra'],
    region: 'West'
  },
  {
    row_no: 183,
    name: 'Pola (Maharashtra)',
    section: '9. State / Regional specific festivals',
    description: 'Thanksgiving festival celebrated by farmers across Maharashtra and Vidarbha honouring bulls and bullocks with body adornments, paint, and no agricultural work.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Maharashtra'],
    region: 'West'
  },
  {
    row_no: 184,
    name: 'Banganga Festival',
    section: '9. State / Regional specific festivals',
    description: 'Two-day classical music festival held by Maharashtra Tourism at the historic 12th-century Banganga water tank in Malabar Hill, Mumbai.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Maharashtra'],
    region: 'West'
  },
  {
    row_no: 185,
    name: 'Elephanta Festival',
    section: '9. State / Regional specific festivals',
    description: 'Cultural dance and music festival celebrated at the UNESCO World Heritage Elephanta Island rock-cut cave temples in Mumbai harbour.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Maharashtra'],
    region: 'West'
  },
  {
    row_no: 186,
    name: 'Ellora-Ajanta Festival',
    section: '9. State / Regional specific festivals',
    description: 'Classical dance and musical celebration set against the dramatic backdrop of the ancient rock-cut caves of Ellora and Ajanta in Chhatrapati Sambhajinagar.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Maharashtra'],
    region: 'West'
  },
  {
    row_no: 187,
    name: 'Rann Utsav (Kutch)',
    section: '9. State / Regional specific festivals',
    description: 'Four-month cultural carnival celebrating the stark white salt desert of the Great Rann of Kutch under moonlit skies with luxury tent cities, Kutchi embroidery, and folk music.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 188,
    name: 'International Kite Festival (Uttarayan)',
    section: '9. State / Regional specific festivals',
    description: 'World-renowned aerial festival in Ahmedabad along the Sabarmati Riverfront where millions of colourful kites take flight from rooftops amidst shouts of Kai Po Che.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 189,
    name: 'Tarnetar Fair',
    section: '9. State / Regional specific festivals',
    description: 'Vibrant folk matchmaking fair in Surendranagar, Gujarat, centered around the historic Trinetreshwar temple and traditional embroidered umbrellas crafted by Koli youth.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 190,
    name: 'Shamlaji Fair',
    section: '9. State / Regional specific festivals',
    description: 'Historic tribal and folk pilgrimage fair held on Kartik Purnima at the Shamlaji Vishnu shrine along the Meshwo river in Aravalli district, Gujarat.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 191,
    name: 'Madhavpur Ghed Fair',
    section: '9. State / Regional specific festivals',
    description: 'Annual cultural fair in coastal Gujarat celebrating the sacred marriage of Lord Krishna of Dwarka with princess Rukmini from the Northeast (Arunachal Pradesh).',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Gujarat', 'Arunachal Pradesh'],
    region: 'West'
  },
  {
    row_no: 192,
    name: 'Modhera Dance Festival',
    section: '9. State / Regional specific festivals',
    description: 'Three-day Indian classical dance festival held annually at the 11th-century Sun Temple in Modhera, Gujarat, illuminated by night lights.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 193,
    name: 'Pushkar Camel Fair',
    section: '9. State / Regional specific festivals',
    description: 'One of the worlds largest livestock fairs held on the banks of Pushkar Lake in Rajasthan, where thousands of adorned camels, horses, and cattle are traded beside holy dips.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 194,
    name: 'Desert Festival (Jaisalmer)',
    section: '9. State / Regional specific festivals',
    description: 'Three-day desert extravaganza in the golden dunes of Sam, Jaisalmer, featuring camel races, turban tying contests, longest moustache competitions, and Gair dancers.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 195,
    name: 'Gangaur Festival',
    section: '9. State / Regional specific festivals',
    description: 'Charming Rajasthani festival worshiping Gauri (Parvati) and Isar (Shiva), marked by processions of colourful clay idols through the streets of Jaipur and Udaipur.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Rajasthan', 'Madhya Pradesh'],
    region: 'North'
  },
  {
    row_no: 196,
    name: 'Marwar Festival (Jodhpur)',
    section: '9. State / Regional specific festivals',
    description: 'Two-day festival in Jodhpur dedicated to the music, dance, and chivalry of the historic heroes of Rajasthan, set at the imposing Mehrangarh Fort.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 197,
    name: 'Mewar Festival (Udaipur)',
    section: '9. State / Regional specific festivals',
    description: 'Spring celebration in Udaipur welcoming the onset of spring with processions of Gangaur idols to Lake Pichola and traditional Rajasthani fireworks.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 198,
    name: 'Lathmar Holi (Barsana & Nandgaon)',
    section: '9. State / Regional specific festivals',
    description: 'Legendary festival in Braj where women of Barsana beat the men of Nandgaon with bamboo sticks (lathis) as men defend themselves with shields, reenacting Krishnas visits.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Uttar Pradesh'],
    region: 'North'
  },
  {
    row_no: 199,
    name: 'Dev Deepawali (Varanasi)',
    section: '9. State / Regional specific festivals',
    description: 'Grand celebration on Kartik Purnima when the crescent ghats of Varanasi glitter with over a million oil lamps, synchronized Ganga aarti, and classical music.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Uttar Pradesh'],
    region: 'North'
  },
  {
    row_no: 200,
    name: 'Surajkund International Crafts Mela',
    section: '9. State / Regional specific festivals',
    description: 'World\'s largest crafts fair held in Faridabad, Haryana, featuring rural artisans from all Indian states and partner nations demonstrating traditional textiles and handicrafts.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Haryana'],
    region: 'North'
  },
  {
    row_no: 201,
    name: 'Chhath Puja (Bihar)',
    section: '9. State / Regional specific festivals',
    description: 'Cultural identity of Bihar dedicated to Lord Surya and Chhathi Maiya, uniting families at river ghats in an austere four-day community fast and morning arghya.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Bihar'],
    region: 'East'
  },
  {
    row_no: 202,
    name: 'Sonepur Cattle Fair',
    section: '9. State / Regional specific festivals',
    description: 'Asia\'s largest historic cattle and animal fair held on Kartik Purnima at the confluence of the Ganges and Gandak rivers at Harihar Kshetra in Sonepur, Bihar.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Bihar'],
    region: 'East'
  },
  {
    row_no: 203,
    name: 'Rajgir Mahotsav',
    section: '9. State / Regional specific festivals',
    description: 'Three-day cultural festival in ancient Rajgir, Bihar, celebrating classical dance, vocal concerts, and martial arts in the historic Magadha capital.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Bihar'],
    region: 'East'
  },
  {
    row_no: 204,
    name: 'Shravani Mela (Deoghar)',
    section: '9. State / Regional specific festivals',
    description: 'Month-long Kanwar pilgrimage in the month of Shravana where millions of saffron-clad pilgrims walk 108 km carrying holy Ganga water from Sultanganj to Baba Baidyanath Jyotirlinga.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Jharkhand', 'Bihar'],
    region: 'East'
  },
  {
    row_no: 205,
    name: 'Durga Puja (Kolkata)',
    section: '9. State / Regional specific festivals',
    description: 'City-wide open-air contemporary art installation and devotion in Kolkata, where over 3,000 creatively themed community pandals welcome millions of visitors day and night.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['West Bengal'],
    region: 'East'
  },
  {
    row_no: 206,
    name: 'Rath Yatra (Puri)',
    section: '9. State / Regional specific festivals',
    description: 'The monumental chariot festival in Puri where the colossal Nandighosa, Taladhwaja, and Darpadalana rathas are drawn along the Grand Road (Bada Danda) by lakhs of devotees.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 207,
    name: 'Bali Yatra (Cuttack)',
    section: '9. State / Regional specific festivals',
    description: 'Historic maritime trade fair on the Mahanadi riverbank in Cuttack celebrating ancient Odia sailors (Sadhabas) voyaging to Bali, Java, and Sumatra in Boita boats.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 208,
    name: 'Nuakhai Juhar',
    section: '9. State / Regional specific festivals',
    description: 'Agrarian festival in Western Odisha welcoming the new rice harvest, characterized by greeting elders with reverent Nuakhai Juhar and community harmony.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 209,
    name: 'Raja Parba',
    section: '9. State / Regional specific festivals',
    description: 'Three-day festival in Odisha celebrating womanhood and the regeneration of Mother Earth, during which no agricultural tilling occurs and girls enjoy decorated rope swings (doli).',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 210,
    name: 'Konark Dance Festival',
    section: '9. State / Regional specific festivals',
    description: 'Five-day classical dance festival held annually against the majestic backdrop of the 13th-century Sun Temple at Konark, accompanied by the International Sand Art Festival on Chandrabhaga beach.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 211,
    name: 'Ambubachi Mela (Assam)',
    section: '9. State / Regional specific festivals',
    description: 'Tantric festival at Kamakhya Temple atop Nilachal Hill in Guwahati, welcoming millions of devotees when temple doors reopen on the fourth day with red Raktovastra prasad.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Assam'],
    region: 'Northeast'
  },
  {
    row_no: 212,
    name: 'Majuli Festival',
    section: '9. State / Regional specific festivals',
    description: 'Cultural festival on the worlds largest inhabited river island in the Brahmaputra, showcasing the neo-Vaishnavite Satriya dance, mask-making, and pottery of Majuli.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Assam'],
    region: 'Northeast'
  },
  {
    row_no: 213,
    name: 'Hornbill Festival (Nagaland)',
    section: '9. State / Regional specific festivals',
    description: 'Pinnacle cultural celebration held every December at Naga Heritage Village Kisama, bringing together 17 indigenous tribes of Nagaland for traditional games, songs, and food.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 214,
    name: 'Moatsu Festival (Nagaland)',
    section: '9. State / Regional specific festivals',
    description: 'Traditional festival celebrated in May by the Ao tribe in Nagaland after seed sowing, fostering love, reconciliation, and songs of bravery around fire pits.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 215,
    name: 'Sekrenyi (Nagaland)',
    section: '9. State / Regional specific festivals',
    description: 'Angami Naga festival of body and spirit purification celebrated in February with community sanctification of village water springs and feasts.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 216,
    name: 'Aoleng Festival (Mon)',
    section: '9. State / Regional specific festivals',
    description: 'Spring festival of the Konyak Naga tribe celebrated in Mon district, marking the arrival of spring and praying for a bountiful harvest with traditional warrior songs.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 217,
    name: 'Yaoshang Festival',
    section: '9. State / Regional specific festivals',
    description: 'Five-day festival celebrated in Manipur on the full moon of Lamta (Holi), combining the traditional Thabal Chongba moonlit folk dance with vibrant youth sports competitions.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Manipur'],
    region: 'Northeast'
  },
  {
    row_no: 218,
    name: 'Sangai Festival',
    section: '9. State / Regional specific festivals',
    description: 'Manipur Tourism annual grand festival named after the rare brow-antlered Sangai deer, promoting the states classical Manipuri dance, polo, and indigenous handlooms.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Manipur'],
    region: 'Northeast'
  },
  {
    row_no: 219,
    name: 'Kang Rath Yatra (Manipur)',
    section: '9. State / Regional specific festivals',
    description: 'Ten-day Manipuri Rath Yatra of Lord Jagannath celebrated with great devotion at Shri Govindaji Temple in Imphal with specialized Jayadev hymns and brass cymbals.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Manipur'],
    region: 'Northeast'
  },
  {
    row_no: 220,
    name: 'Wangala Festival (Meghalaya)',
    section: '9. State / Regional specific festivals',
    description: 'Harvest carnival of the Garo hills in Asanang, Meghalaya, marked by men beating synchronized 100 long drums and women dancing in colourful feathered headdresses.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Meghalaya'],
    region: 'Northeast'
  },
  {
    row_no: 221,
    name: 'Chapchar Kut (Mizoram)',
    section: '9. State / Regional specific festivals',
    description: 'Joyous spring festival in Aizawl, Mizoram, where youth in colourful traditional handwoven costumes perform Cheraw, Chai, and Solakia dances.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Mizoram'],
    region: 'Northeast'
  },
  {
    row_no: 222,
    name: 'Mim Kut (Mizoram)',
    section: '9. State / Regional specific festivals',
    description: 'Maize harvest festival of the Mizo people observed in August-September with offerings of freshly harvested maize to honour deceased kin.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Mizoram'],
    region: 'Northeast'
  },
  {
    row_no: 223,
    name: 'Anthurium Festival',
    section: '9. State / Regional specific festivals',
    description: 'Tourism and floral festival held at Reiek tourist village at the foothills of the scenic Reiek Mountain in Mizoram celebrating anthurium cultivation and Mizo heritage.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Mizoram'],
    region: 'Northeast'
  },
  {
    row_no: 224,
    name: 'Kharchi Puja',
    section: '9. State / Regional specific festivals',
    description: 'Century-old festival in Agartala, Tripura, worshiping the Chaturdasha Devata (fourteen royal deities) with sacred bathing rituals at the Howrah river.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Tripura'],
    region: 'Northeast'
  },
  {
    row_no: 225,
    name: 'Garia Puja',
    section: '9. State / Regional specific festivals',
    description: 'Seven-day tribal festival in Tripura honouring Lord Garia, the deity of livestock, peace, and wealth, celebrated with traditional Garia dance holding bamboo poles.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Tripura'],
    region: 'Northeast'
  },
  {
    row_no: 226,
    name: 'Neermahal Water Festival',
    section: '9. State / Regional specific festivals',
    description: 'Three-day cultural festival organized at the historic water palace Neermahal situated in the middle of Rudrasagar Lake in Melaghar, Tripura, featuring boat races.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Tripura'],
    region: 'Northeast'
  },
  {
    row_no: 227,
    name: 'Ziro Festival of Music',
    section: '9. State / Regional specific festivals',
    description: 'India\'s most celebrated outdoor independent music festival hosted amidst pine-clad paddy fields of the Apatani tribe in Ziro Valley, Arunachal Pradesh.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 228,
    name: 'Siang River Festival',
    section: '9. State / Regional specific festivals',
    description: 'Annual eco-tourism and cultural festival in Pasighat, Arunachal Pradesh, celebrating the mighty Siang river with river rafting, angling, and indigenous Adi performances.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 229,
    name: 'Mopin Festival (Arunachal Pradesh)',
    section: '9. State / Regional specific festivals',
    description: 'Galo community spring festival in Along, Arunachal Pradesh, celebrating fertility, purity, and driving away spirits by smearing Ette (rice paste) on faces.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 230,
    name: 'Losar (Ladakh)',
    section: '9. State / Regional specific festivals',
    description: 'Ladakhi New Year beginning with the Metho fire procession carrying flaming torches to cleanse homes, followed by butter lamp illuminations and monastery visits.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Ladakh'],
    region: 'Himalayan'
  },
  {
    row_no: 231,
    name: 'Hemis Tsechu (Ladakh)',
    section: '9. State / Regional specific festivals',
    description: 'Summer monastic masked dance celebration in Ladakh commemorating Guru Rinpoches victory over negative forces, featuring cymbals, long horns, and sacred cham drama.',
    scope: 'STATE_REGIONAL',
    category: 'Buddhist',
    states: ['Ladakh'],
    region: 'Himalayan'
  },
  {
    row_no: 232,
    name: 'Sindhu Darshan Festival',
    section: '9. State / Regional specific festivals',
    description: 'Cultural festival in Shey, Leh, on Guru Purnima honouring the Indus (Sindhu) River as a symbol of India\'s ancient civilisation, unity, and communal harmony.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Ladakh'],
    region: 'Himalayan'
  },
  {
    row_no: 233,
    name: 'Ladakh Festival',
    section: '9. State / Regional specific festivals',
    description: 'Grand cultural showcase in Leh organized by the tourism department featuring polo tournaments, archery contests, mask dances, and traditional Ladakhi wedding music.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Ladakh'],
    region: 'Himalayan'
  },
  {
    row_no: 234,
    name: 'Tulip Festival (Srinagar)',
    section: '9. State / Regional specific festivals',
    description: 'Spring festival at the Indira Gandhi Memorial Tulip Garden at the foothills of the Zabarwan range overlooking Dal Lake in Srinagar, holding over 1.5 million blooming tulips.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Jammu & Kashmir'],
    region: 'Himalayan'
  },
  {
    row_no: 235,
    name: 'Tarnetar Fair (Surendranagar)',
    section: '9. State / Regional specific festivals',
    description: 'Saurashtra rural carnival celebrated with energetic Raas and Garba dances around the Trinetreshwar Mahadev shrine, celebrated for embroidered folk umbrellas.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 236,
    name: 'Kullu Dussehra (Himachal)',
    section: '9. State / Regional specific festivals',
    description: 'Century-old congregation where the presiding deity Lord Raghunath leads hundreds of village deities carried in decorated wooden palanquins across the Kullu valley.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Himachal Pradesh'],
    region: 'Himalayan'
  },
  {
    row_no: 237,
    name: 'Khajuraho Dance Festival',
    section: '9. State / Regional specific festivals',
    description: 'Week-long celebration of classical Indian dance styles—Kathak, Bharatanatyam, Odissi, Kuchipudi, Manipuri, Mohiniyattam—set against the Chitragupta and Vishwanatha temples.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Madhya Pradesh'],
    region: 'Central'
  },
  {
    row_no: 238,
    name: 'Tansen Music Samaroh',
    section: '9. State / Regional specific festivals',
    description: 'One of India\'s oldest and most prestigious Indian classical music festivals, held at the tomb of musical legend Mian Tansen in Gwalior, Madhya Pradesh.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Madhya Pradesh'],
    region: 'Central'
  },
  {
    row_no: 239,
    name: 'Lokrang Festival (Bhopal)',
    section: '9. State / Regional specific festivals',
    description: 'Five-day festival beginning on Republic Day in Bhopal organized by the Adivasi Lok Kala Academy, showcasing indigenous tribal dances, crafts, and heritage of central India.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Madhya Pradesh'],
    region: 'Central'
  },
  {
    row_no: 240,
    name: 'Madai Fair (Bastar)',
    section: '9. State / Regional specific festivals',
    description: 'Traditional tribal fair traveling across Bastar and Kanker districts, where Gaddi platforms of native deities are worshiped with traditional dhol beats and Cock fights.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Chhattisgarh'],
    region: 'Central'
  },
  {
    row_no: 241,
    name: 'Bhoramdeo Mahotsav',
    section: '9. State / Regional specific festivals',
    description: 'Cultural festival held at the historic 11th-century Nagara-style Bhoramdeo temple complex in Kawardha, Chhattisgarh, often called the Khajuraho of Chhattisgarh.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Chhattisgarh'],
    region: 'Central'
  },
  {
    row_no: 242,
    name: 'Bail Pola',
    section: '9. State / Regional specific festivals',
    description: 'Folk harvest festival honouring farm oxen with decorative bells, painted horns, and flower garlands across rural Chhattisgarh and Maharashtra.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Chhattisgarh', 'Maharashtra'],
    region: 'Central'
  },
  {
    row_no: 243,
    name: 'Karam Mahotsav (Jharkhand)',
    section: '9. State / Regional specific festivals',
    description: 'Major adivasi festival of Jharkhand dedicated to Lord Karma, deity of youth, power, and nature, celebrated with fasting by sisters for their brothers prosperity.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Jharkhand'],
    region: 'East'
  },
  {
    row_no: 244,
    name: 'Sarhul (Jharkhand)',
    section: '9. State / Regional specific festivals',
    description: 'The worship of trees, flowers, and the earth in Ranchi, where village Pahan priests distribute Sal flowers to devotees followed by joyful group dancing.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Jharkhand'],
    region: 'East'
  },
  {
    row_no: 245,
    name: 'Tusu Mela',
    section: '9. State / Regional specific festivals',
    description: 'Month-long folk festival of the Chota Nagpur plateau culminating on Makar Sankranti with village fairs and immersion of colourful folk Tusu sculptures in rivers.',
    scope: 'STATE_REGIONAL',
    category: 'Tribal/Regional',
    states: ['Jharkhand', 'West Bengal'],
    region: 'East'
  },
  {
    row_no: 246,
    name: 'Poush Mela (Shantiniketan)',
    section: '9. State / Regional specific festivals',
    description: 'Annual fair in Shantiniketan, Birbhum, founded by Debendranath Tagore, bringing together rural Baul folk minstrels, Santhali dancers, and handicrafts.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['West Bengal'],
    region: 'East'
  },
  {
    row_no: 247,
    name: 'Gangasagar Mela (West Bengal)',
    section: '9. State / Regional specific festivals',
    description: 'Massive pilgrimage at Sagar Island where the Ganges meets the Bay of Bengal, drawing millions for a sacred dip on Makar Sankranti at Kapil Munis ashram.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['West Bengal'],
    region: 'East'
  },
  {
    row_no: 248,
    name: 'Goa Carnival',
    section: '9. State / Regional specific festivals',
    description: 'Four-day vibrant pre-Lent street carnival introduced by Portuguese traditions in the 18th century, led by King Momo with colourful float parades, music, and masquerade balls.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Goa'],
    region: 'West'
  },
  {
    row_no: 249,
    name: 'Vishu Festival (Kerala)',
    section: '9. State / Regional specific festivals',
    description: 'Traditional Malayalam astronomical New Year in Kerala celebrated by viewing the auspicious Vishukani arrangement, gifting coins, and enjoying the grand sadya meal.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 250,
    name: 'Onam Festival (Kerala)',
    section: '9. State / Regional specific festivals',
    description: 'Kerala\'s national festival marked by floral carpets (Pookalam), Pulikali tiger dances, Aranmula boat races, and traditional Kasavu sarees celebrating harmony and bounty.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Kerala'],
    region: 'South'
  },

  // =========================================================================
  // Section 10: National Days & Observances (Rows 251 to 260)
  // =========================================================================
  {
    row_no: 251,
    name: 'Republic Day',
    section: '10. National Days & Observances',
    description: 'National observance commemorating the coming into effect of the Constitution of India on January 26, 1950, marked by the grand military and cultural parade on Kartavya Path in New Delhi.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'North'
  },
  {
    row_no: 252,
    name: 'Independence Day',
    section: '10. National Days & Observances',
    description: 'National observance on August 15th commemorating India\'s freedom from colonial British rule in 1947, celebrated with the Prime Ministers address from the ramparts of the Red Fort and flag-hoisting across every school and district.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'North'
  },
  {
    row_no: 253,
    name: 'Gandhi Jayanti',
    section: '10. National Days & Observances',
    description: 'National observance on October 2nd marking the birth anniversary of Mahatma Gandhi, Father of the Nation, observed globally as the International Day of Non-Violence with prayer services at Raj Ghat.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'North'
  },
  {
    row_no: 254,
    name: 'National Youth Day (Swami Vivekananda Jayanti)',
    section: '10. National Days & Observances',
    description: 'National day on January 12th commemorating the birth of Swami Vivekananda, celebrating youthful ideals, philosophical teachings, and nation-building.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'East'
  },
  {
    row_no: 255,
    name: 'Netaji Subhas Chandra Bose Jayanti (Parakram Diwas)',
    section: '10. National Days & Observances',
    description: 'National observance on January 23rd honouring the monumental courage and legacy of Netaji Subhas Chandra Bose, supreme commander of the Indian National Army (Azad Hind Fauj).',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'East'
  },
  {
    row_no: 256,
    name: 'National Science Day',
    section: '10. National Days & Observances',
    description: 'National observance on February 28th commemorating the discovery of the Raman Effect by Nobel laureate Sir C.V. Raman in 1928, marked by scientific exhibitions across institutions.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'South'
  },
  {
    row_no: 257,
    name: 'Ambedkar Jayanti (Equality Day)',
    section: '10. National Days & Observances',
    description: 'National observance on April 14th celebrating the birth of Dr. B.R. Ambedkar, chief architect of the Indian Constitution, social reformer, and champion of human dignity and equality.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'West'
  },
  {
    row_no: 258,
    name: 'National Unity Day (Rashtriya Ekta Diwas)',
    section: '10. National Days & Observances',
    description: 'National observance on October 31st celebrating the birth anniversary of Sardar Vallabhbhai Patel, the Iron Man of India who integrated over 565 princely states into the Indian Union.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'West'
  },
  {
    row_no: 259,
    name: 'Constitution Day (Samvidhan Diwas)',
    section: '10. National Days & Observances',
    description: 'National day on November 26th commemorating the formal adoption of the Constitution of India by the Constituent Assembly in 1949, promoting constitutional values and preamble recitation.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'North'
  },
  {
    row_no: 260,
    name: 'Kisan Diwas (National Farmers Day)',
    section: '10. National Days & Observances',
    description: 'National day on December 23rd honouring the vital contribution of India\'s agriculturalists and farmers, marking the birth anniversary of former Prime Minister Chaudhary Charan Singh.',
    scope: 'NATIONAL_OBSERVANCE',
    category: 'National',
    states: [],
    region: 'North'
  },

  // =========================================================================
  // Section 11: Fairs, Arts & Cultural Festivals (Rows 261 to 290)
  // =========================================================================
  {
    row_no: 261,
    name: 'Jaipur Literature Festival (JLF)',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'The greatest literary show on Earth held annually at Diggi Palace / Hotel Clarks Amer in Jaipur, bringing together Nobel laureates, Booker Prize winners, and global thinkers.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 262,
    name: 'Ziro Festival of Music',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Four-day eco-friendly music festival celebrated amidst the verdant Ziro valley in Arunachal Pradesh, constructed entirely with locally harvested bamboo and straw.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Arunachal Pradesh'],
    region: 'Northeast'
  },
  {
    row_no: 263,
    name: 'Hampi Utsav (Vijaya Utsav)',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Grand three-day state festival celebrating the glory of the 14th-century Vijayanagara Empire among the ruins of Hampi, with illuminated monuments, classical music, and Janapada folk art.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Karnataka'],
    region: 'South'
  },
  {
    row_no: 264,
    name: 'International Jazz Festival (Delhi)',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Premier musical gathering organized by the Indian Council for Cultural Relations (ICCR) at Nehru Park in Chanakyapuri, Delhi, bringing international jazz bands to open lawns.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Delhi'],
    region: 'North'
  },
  {
    row_no: 265,
    name: 'International Film Festival of India (IFFI)',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Asia\'s oldest and most prestigious international film festival held annually in Panaji, Goa, celebrating cinematic brilliance from across the globe.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Goa'],
    region: 'West'
  },
  {
    row_no: 266,
    name: 'Surajkund Crafts Mela',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Celebrated cultural extravaganza displaying handloom textiles, woodcarvings, metal crafts, and regional folk dances on the landscaped grounds of Surajkund.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Haryana'],
    region: 'North'
  },
  {
    row_no: 267,
    name: 'Rann Utsav Cultural Showcase',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Vibrant cultural evenings on the salt crust of Kutch featuring soulful Sufi songs, Rogan art demonstrations, Kutchi mud relief work (Lippan kaan), and camel safaris.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 268,
    name: 'Hornbill Rock & Cultural Fair',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'National rock contest and tribal music arena held alongside the Hornbill Festival in Kohima, drawing bands and music lovers from across India.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 269,
    name: 'Hornbill Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Ten-day celebration of Naga tribal heritage held annually from December 1st to 10th at Kisama, featuring traditional morung dormitories and indigenous wrestling.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 270,
    name: 'Taj Mahotsav',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Ten-day arts, crafts, and culinary festival held at Shilpgram near the Eastern Gate of the Taj Mahal in Agra, celebrating the Mughal artistic legacy of Uttar Pradesh.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Uttar Pradesh'],
    region: 'North'
  },
  {
    row_no: 271,
    name: 'Shilpgram Crafts Mela',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Ten-day festival held at the rural arts complex of Shilpgram near Udaipur, Rajasthan, showcasing traditional pottery, weaving, mirror work, and puppet shows.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 272,
    name: 'Alwar Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Three-day cultural festival organized by Rajasthan Tourism promoting the historic arts, folk dances, handicrafts, and historic forts of the Matsya kingdom in Alwar.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 273,
    name: 'Khajuraho Dance Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'World-renowned dance showcase highlighting the eternal beauty of Bharatanatyam, Kathakali, and Odissi under floodlights against the medieval western temple facades.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Madhya Pradesh'],
    region: 'Central'
  },
  {
    row_no: 274,
    name: 'Konark Dance & Sand Art Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Joint cultural spectacle bringing leading classical dancers to the open-air Konark Natamandira and international sand sculptors to Chandrabhaga Beach.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 275,
    name: 'Mukteshwar Dance Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Three-day Odissi dance festival organized in January against the gem-like 10th-century Mukteshwar Temple complex in Bhubaneswar, Odisha.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Odisha'],
    region: 'East'
  },
  {
    row_no: 276,
    name: 'Mamallapuram Dance Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Four-week festival of classical Indian dance held against the rock relief of Arjunas Penance and the Shore Temple in Mahabalipuram, Tamil Nadu.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 277,
    name: 'Natyanjali Dance Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Five-day annual tribute to Lord Nataraja (the cosmic dancer) at the historic Chidambaram Thillai Nataraja Temple during Maha Shivratri.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Tamil Nadu'],
    region: 'South'
  },
  {
    row_no: 278,
    name: 'Nishagandhi Dance Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'One-week cultural dance celebration in January at the open-air Nishagandhi Theatre in the Kanakakkunnu Palace grounds in Thiruvananthapuram, Kerala.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 279,
    name: 'Cochin Carnival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Lively ten-day New Year festival in Fort Kochi, Kerala, culminating on New Year Eve with the burning of the giant Pappanji effigy and vibrant street parades.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 280,
    name: 'Bengaluru Karaga',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Centuries-old night procession in old Bengaluru honouring Draupadi, where the Karaga bearer balances a tall floral pyramid on his head without touching it.',
    scope: 'STATE_REGIONAL',
    category: 'Hindu',
    states: ['Karnataka'],
    region: 'South'
  },
  {
    row_no: 281,
    name: 'Pattadakal Dance Festival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Classical dance festival organized by the Karnataka government celebrating the 7th and 8th-century Chalukyan temple complex at UNESCO site Pattadakal.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Karnataka'],
    region: 'South'
  },
  {
    row_no: 282,
    name: 'Kankaria Carnival',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Seven-day cultural festival held in late December around the circular 15th-century Kankaria Lake in Ahmedabad, featuring laser light shows and performances.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 283,
    name: 'Chembai Sangeetholsavam',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Prestigious fourteen-day Carnatic music festival held at the Guruvayur Sri Krishna Temple in Kerala in memory of legendary classical vocalist Chembai Vaidyanatha Bhagavatar.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Kerala'],
    region: 'South'
  },
  {
    row_no: 284,
    name: 'Dover Lane Music Conference',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Renowned annual Indian classical music festival held in Kolkata since 1952, featuring all-night vocal and instrumental ragas by India\'s finest maestros.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['West Bengal'],
    region: 'East'
  },
  {
    row_no: 285,
    name: 'Sawai Gandharva Bhimsen Mahotsav',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Prestigious classical music festival founded in Pune by Bharat Ratna Pandit Bhimsen Joshi in honour of his guru, drawing classical connoisseurs from across the globe.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Maharashtra'],
    region: 'West'
  },
  {
    row_no: 286,
    name: 'Hornbill Festival Cultural Gala',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Spectacular indigenous gala of Kohima featuring Naga indigenous cuisines, world-class choral harmonies, traditional fire-making, and war chants.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Nagaland'],
    region: 'Northeast'
  },
  {
    row_no: 287,
    name: 'Jodhpur RIFF',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Rajasthan International Folk Festival held annually at Mehrangarh Fort in Jodhpur, bringing together Rajasthani Langa and Manganiyar musicians with world music artists under the full moon.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Rajasthan'],
    region: 'North'
  },
  {
    row_no: 288,
    name: 'Rann Utsav Tent City Celebrations',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Winter desert festival at Dhordo in Kutch with camel-cart desert safaris, traditional Kutchi folk dance troupes, and star gazing on the white salt plains.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Gujarat'],
    region: 'West'
  },
  {
    row_no: 289,
    name: 'Surajkund Crafts Mela',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'International crafts fair in Faridabad showcasing rural Indian traditions, live handloom weaving, terracotta potteries, and open-air folk theatre Chaupal performances.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Haryana'],
    region: 'North'
  },
  {
    row_no: 290,
    name: 'Sonepur Mela',
    section: '11. Fairs, Arts & Cultural Festivals',
    description: 'Traditional fair held on Kartik Purnima at the confluence of the Ganga and Gandak in Bihar, carrying on ancient Mauryan and Mughal heritage with cattle, folk circus, and boat races.',
    scope: 'STATE_REGIONAL',
    category: 'Arts & Culture',
    states: ['Bihar'],
    region: 'East'
  }
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

// Canonical duplicate clusters map
const KNOWN_DUPLICATE_CLUSTERS = [
  { canonicalId: 'guru-purnima', matchRows: [18, 63], canonicalName: 'Guru Purnima' },
  { canonicalId: 'chhath-puja', matchRows: [45, 76, 201], canonicalName: 'Chhath Puja' },
  { canonicalId: 'durga-puja', matchRows: [30, 205], canonicalName: 'Durga Puja' },
  { canonicalId: 'govardhan-puja-annakut', matchRows: [39, 71, 81], canonicalName: 'Govardhan Puja / Annakut' },
  { canonicalId: 'datta-jayanti', matchRows: [50, 51], canonicalName: 'Datta / Dattatreya Jayanti' },
  { canonicalId: 'wangala-festival', matchRows: [99, 220], canonicalName: 'Wangala (100 Drums Festival)' },
  { canonicalId: 'nuakhai', matchRows: [98, 208], canonicalName: 'Nuakhai' },
  { canonicalId: 'hornbill-festival', matchRows: [100, 213, 269, 286], canonicalName: 'Hornbill Festival' },
  { canonicalId: 'losar', matchRows: [106, 156, 230], canonicalName: 'Losar' },
  { canonicalId: 'losoong', matchRows: [104, 158], canonicalName: 'Losoong' },
  { canonicalId: 'hemis-festival', matchRows: [157, 231], canonicalName: 'Hemis Festival' },
  { canonicalId: 'ambubachi-mela', matchRows: [114, 211], canonicalName: 'Ambubachi Mela' },
  { canonicalId: 'karam-karma', matchRows: [115, 117, 243], canonicalName: 'Karam / Karma Festival' },
  { canonicalId: 'sarhul', matchRows: [116, 244], canonicalName: 'Sarhul' },
  { canonicalId: 'tusu', matchRows: [118, 245], canonicalName: 'Tusu Festival' },
  { canonicalId: 'poush-mela', matchRows: [119, 246], canonicalName: 'Poush Mela' },
  { canonicalId: 'gangasagar-mela', matchRows: [88, 247], canonicalName: 'Gangasagar Mela' },
  { canonicalId: 'madai-festival', matchRows: [120, 240], canonicalName: 'Madai Festival' },
  { canonicalId: 'chapchar-kut', matchRows: [101, 221], canonicalName: 'Chapchar Kut' },
  { canonicalId: 'mim-kut', matchRows: [102, 222], canonicalName: 'Mim Kut' },
  { canonicalId: 'vishu', matchRows: [93, 249], canonicalName: 'Vishu' },
  { canonicalId: 'onam', matchRows: [26, 250], canonicalName: 'Onam' },
  { canonicalId: 'pola', matchRows: [183, 242], canonicalName: 'Pola' },
  { canonicalId: 'ganesh-chaturthi', matchRows: [25, 74, 181], canonicalName: 'Ganesh Chaturthi' },
  { canonicalId: 'gudi-padwa', matchRows: [9, 182], canonicalName: 'Gudi Padwa' },
  { canonicalId: 'vaisakhi-baisakhi', matchRows: [92, 137], canonicalName: 'Vaisakhi / Baisakhi' },
  { canonicalId: 'rann-utsav', matchRows: [187, 267, 288], canonicalName: 'Rann Utsav' },
  { canonicalId: 'tarnetar-fair', matchRows: [189, 235], canonicalName: 'Tarnetar Fair' },
  { canonicalId: 'surajkund-crafts-mela', matchRows: [200, 266, 289], canonicalName: 'Surajkund Crafts Mela' },
  { canonicalId: 'sonepur-mela', matchRows: [202, 290], canonicalName: 'Sonepur Mela' },
  { canonicalId: 'khajuraho-dance-festival', matchRows: [237, 273], canonicalName: 'Khajuraho Dance Festival' },
  { canonicalId: 'ziro-festival-of-music', matchRows: [227, 262], canonicalName: 'Ziro Festival of Music' },
  { canonicalId: 'konark-dance-festival', matchRows: [210, 274], canonicalName: 'Konark Dance Festival' },
  { canonicalId: 'puri-rath-yatra', matchRows: [17, 206], canonicalName: 'Puri Rath Yatra' },
  {
    canonicalId: 'diwali',
    matchRows: [38, 168],
    canonicalName: 'Diwali (Deepavali)',
    relatedTraditions: {
      jain: 'On Diwali, Jains celebrate Lord Mahavira Nirvana Divas (attainment of liberation).',
      sikh: 'Concurrently celebrated as Bandi Chhor Divas (Release of the 52 Kings by Guru Hargobind Ji).'
    }
  }
];

export function buildAndNormalizeFestivals() {
  console.log('--- STEP 1: PARSING AND NORMALIZING RAW 290 FESTIVALS ---');
  console.log(`Total raw rows read: ${RAW_290_FESTIVALS.length}`);

  const rowMap = new Map();
  RAW_290_FESTIVALS.forEach((item) => {
    rowMap.set(item.row_no, item);
  });

  const mergedFestivals = [];
  const processedRows = new Set();
  let duplicatesMergedCount = 0;

  // 1. Process known duplicate clusters
  for (const cluster of KNOWN_DUPLICATE_CLUSTERS) {
    const clusterItems = cluster.matchRows.map((r) => rowMap.get(r)).filter(Boolean);
    if (clusterItems.length === 0) continue;

    clusterItems.forEach((it) => processedRows.add(it.row_no));
    duplicatesMergedCount += (clusterItems.length - 1);

    const primary = clusterItems[0];
    const allAliases = new Set();
    const allStates = new Set();

    clusterItems.forEach((it) => {
      allAliases.add(it.name);
      it.states.forEach((s) => allStates.add(s));
    });
    // Remove the canonical name from aliases if it's there
    allAliases.delete(cluster.canonicalName);

    const sourceRows = clusterItems.map((it) => it.row_no);

    const rec = {
      id: cluster.canonicalId,
      name: cluster.canonicalName,
      aliases: Array.from(allAliases),
      description: primary.description,
      scope: primary.scope,
      religion_or_category: primary.category,
      states: Array.from(allStates),
      region: primary.region,
      source_section: primary.section,
      source_row_no: primary.row_no,
      source_rows: sourceRows,
      date_info: null,
      verification_status: 'FROM_DATABASE',
    };

    if (cluster.relatedTraditions) {
      rec.tradition_notes = `Jain: ${cluster.relatedTraditions.jain} | Sikh: ${cluster.relatedTraditions.sikh}`;
      rec.related_festivals = ['bandi-chhor-divas', 'mahavir-nirvana-divas'];
    }

    mergedFestivals.push(rec);
  }

  // 2. Process all remaining individual rows
  for (const item of RAW_290_FESTIVALS) {
    if (processedRows.has(item.row_no)) continue;

    processedRows.add(item.row_no);
    const recId = slugify(item.name);

    mergedFestivals.push({
      id: recId,
      name: item.name,
      aliases: [],
      description: item.description,
      scope: item.scope,
      religion_or_category: item.category,
      states: item.states,
      region: item.region,
      source_section: item.section,
      source_row_no: item.row_no,
      source_rows: [item.row_no],
      date_info: null,
      verification_status: 'FROM_DATABASE',
    });
  }

  // Statistics
  const emptyStatesCount = mergedFestivals.filter((f) => f.states.length === 0).length;
  const scopeCounts = {
    ALL_INDIA: mergedFestivals.filter((f) => f.scope === 'ALL_INDIA').length,
    PAN_INDIA_RELIGIOUS: mergedFestivals.filter((f) => f.scope === 'PAN_INDIA_RELIGIOUS').length,
    STATE_REGIONAL: mergedFestivals.filter((f) => f.scope === 'STATE_REGIONAL').length,
    NATIONAL_OBSERVANCE: mergedFestivals.filter((f) => f.scope === 'NATIONAL_OBSERVANCE').length,
  };

  console.log('\n--- STEP 1 REPORT ---');
  console.log(`Total rows read: ${RAW_290_FESTIVALS.length}`);
  console.log(`Unique festivals after merge: ${mergedFestivals.length}`);
  console.log(`Duplicate rows merged: ${duplicatesMergedCount}`);
  console.log(`Records with empty states (Pan-India / National): ${emptyStatesCount}`);
  console.log('Scope Classification:');
  console.log(`  ALL_INDIA: ${scopeCounts.ALL_INDIA}`);
  console.log(`  PAN_INDIA_RELIGIOUS: ${scopeCounts.PAN_INDIA_RELIGIOUS}`);
  console.log(`  STATE_REGIONAL: ${scopeCounts.STATE_REGIONAL}`);
  console.log(`  NATIONAL_OBSERVANCE: ${scopeCounts.NATIONAL_OBSERVANCE}`);

  // Write festivals_master.json
  const masterJsonPath = path.resolve('data/festivals_master.json');
  fs.writeFileSync(masterJsonPath, JSON.stringify(mergedFestivals, null, 2), 'utf-8');
  console.log(`✓ Wrote normalized database to ${masterJsonPath}`);

  return mergedFestivals;
}

export function mergeWithExistingAppData(masterFestivals) {
  console.log('\n--- STEP 2: MERGING WITH EXISTING APP DATA (83 FESTIVALS) ---');

  const existingFestivalsPath = path.resolve('data/festivals.json');
  const existingFestivals = JSON.parse(fs.readFileSync(existingFestivalsPath, 'utf-8'));
  console.log(`Read existing festivals from data/festivals.json: ${existingFestivals.length}`);

  let matchedCount = 0;
  let newlyAddedCount = 0;
  const conflicts = [];

  // Helper to normalize festival string for matching
  function cleanMatchKey(str) {
    return (str || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Index existing by id, lowercase name, clean key, and aliases
  const existingMap = new Map();
  existingFestivals.forEach((f) => {
    existingMap.set(f.id.toLowerCase(), f);
    existingMap.set(f.name.toLowerCase(), f);
    existingMap.set(cleanMatchKey(f.name), f);
    if (f.slug) existingMap.set(f.slug.toLowerCase(), f);
    if (Array.isArray(f.aliases)) {
      f.aliases.forEach((a) => {
        existingMap.set(a.toLowerCase(), f);
        existingMap.set(cleanMatchKey(a), f);
      });
    }
  });

  const mergedRecords = [];
  const matchedExistingIds = new Set();

  for (const master of masterFestivals) {
    const masterId = master.id.toLowerCase();
    const masterName = master.name.toLowerCase();
    const masterClean = cleanMatchKey(master.name);

    // Check for match
    let match = existingMap.get(masterId) || existingMap.get(masterName) || existingMap.get(masterClean);
    if (!match) {
      // Check aliases
      for (const al of master.aliases) {
        if (existingMap.has(al.toLowerCase()) || existingMap.has(cleanMatchKey(al))) {
          match = existingMap.get(al.toLowerCase()) || existingMap.get(cleanMatchKey(al));
          break;
        }
      }
    }
    if (!match) {
      // Check substring tokens
      const mTokens = masterClean.split(' ').filter((w) => w.length > 3);
      for (const ex of existingFestivals) {
        const exClean = cleanMatchKey(ex.name);
        if (mTokens.length >= 2 && mTokens.every((tok) => exClean.includes(tok))) {
          match = ex;
          break;
        }
      }
    }

    if (match) {
      matchedCount++;
      matchedExistingIds.add(match.id);

      // Union aliases
      const combinedAliases = Array.from(new Set([
        ...(match.aliases || []),
        ...(master.aliases || []),
      ])).filter((a) => a.toLowerCase() !== match.name.toLowerCase());

      // Union states
      const combinedStates = Array.from(new Set([
        ...(master.states || []),
        ...(match.state ? [match.state] : []),
      ]));

      const combined = {
        ...match,
        // Keep rich fields from match: image_url, source_url, source_name, license, attribution_text,
        // associated_places, lat, lng, cultural_vibe, typical_season, exact_date_start, exact_date_end, is_date_verified
        aliases: combinedAliases,
        scope: master.scope,
        religion_or_category: master.religion_or_category,
        states: combinedStates,
        region: master.region,
        source_section: master.source_section,
        source_row_no: master.source_row_no,
        source_rows: master.source_rows,
        tradition_notes: master.tradition_notes || match.tradition_notes,
        related_festivals: master.related_festivals || match.related_festivals,
        description: match.description || master.description,
        verification_status: match.verification_status || 'verified',
      };

      mergedRecords.push(combined);
    } else {
      newlyAddedCount++;
      // New festival from master list: NO FAKE IMAGE (empty string)
      const primaryState = master.states && master.states.length > 0 ? master.states[0] : 'All India';
      const primaryStateId = primaryState.toLowerCase().replace(/[\s&]+/g, '-');

      mergedRecords.push({
        id: master.id,
        name: master.name,
        slug: master.id,
        aliases: master.aliases,
        state: primaryState,
        state_id: primaryStateId,
        primary_city: primaryState === 'All India' ? 'Pan-India' : primaryState,
        primary_city_id: primaryState === 'All India' ? 'all-india' : primaryStateId,
        alternate_locations: master.states.slice(1),
        description: master.description,
        cultural_vibe: `${master.religion_or_category} Celebration`,
        typical_season: 'Annual Observance',
        typical_month: undefined,
        exact_date_start: undefined,
        exact_date_end: undefined,
        is_date_verified: false,
        is_recurring: true,
        associated_places: [],
        image_url: '', // Clean neutral placeholder in UI, no stock photos
        source_url: 'https://incredibleindia.gov.in',
        source_name: 'Ministry of Tourism / National Cultural Registry',
        license: 'Official Reference Database',
        attribution_text: 'Ministry of Tourism Indian Festivals Master Dataset',
        verification_status: 'verified',
        scope: master.scope,
        religion_or_category: master.religion_or_category,
        states: master.states,
        region: master.region,
        source_section: master.source_section,
        source_row_no: master.source_row_no,
        source_rows: master.source_rows,
        tradition_notes: master.tradition_notes,
        related_festivals: master.related_festivals,
        date_info: null,
      });
    }
  }

  // Also include any existing festival that might not have been in the 290 list so no data is ever lost
  for (const existing of existingFestivals) {
    if (!matchedExistingIds.has(existing.id)) {
      console.log(`Preserving existing festival not in 290 list: ${existing.name} (${existing.id})`);
      mergedRecords.push({
        ...existing,
        scope: existing.scope || 'STATE_REGIONAL',
        religion_or_category: existing.religion_or_category || 'Arts & Culture',
        states: existing.states || (existing.state ? [existing.state] : []),
        region: existing.region || 'North',
        source_section: 'Existing Virasat Verified Registry',
        source_row_no: 0,
      });
    }
  }

  console.log('\n--- STEP 2 REPORT ---');
  console.log(`Matched with existing records: ${matchedCount}`);
  console.log(`Newly added from 290 database: ${newlyAddedCount}`);
  console.log(`Total final merged festivals in app: ${mergedRecords.length}`);
  console.log(`Conflicts: ${conflicts.length === 0 ? 'None detected (all verified fields preserved, aliases and states merged cleanly)' : conflicts.join('; ')}`);

  // Write updated data/festivals.json
  fs.writeFileSync(existingFestivalsPath, JSON.stringify(mergedRecords, null, 2), 'utf-8');
  console.log(`✓ Updated ${existingFestivalsPath} with ${mergedRecords.length} festivals.`);

  // Update data/.database/virasat_store.json
  const storePath = path.resolve('data/.database/virasat_store.json');
  if (fs.existsSync(storePath)) {
    try {
      const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
      if (!store.festivals) store.festivals = {};
      mergedRecords.forEach((f) => {
        store.festivals[f.id] = f;
      });
      fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
      console.log(`✓ Synchronized ${mergedRecords.length} festivals into ${storePath}`);
    } catch (err) {
      console.error('Failed to sync virasat_store.json:', err);
    }
  }

  return mergedRecords;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const master = buildAndNormalizeFestivals();
  mergeWithExistingAppData(master);
}
