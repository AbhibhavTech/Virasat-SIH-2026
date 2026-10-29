export interface UttarPradeshStay {
  name: string;
  category: string;
}

export interface UttarPradeshFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface UttarPradeshDining {
  veg: UttarPradeshFoodSpot[];
  nonVeg: UttarPradeshFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface UttarPradeshAttraction {
  id: string;
  name: string;
  category: string;
  timings: string;
  fee: {
    domestic: string;
    foreign: string;
  };
  isHiddenGem: boolean;
  image: string;
  photoCredit: string;
  summary: string;
}

export interface UttarPradeshCity {
  id: string;
  code: string;
  name: string;
  nickname: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  flashcardBlurb: string;
  coverImage: string;
  photoCredit: string;
  topStays: UttarPradeshStay[];
  dining: UttarPradeshDining;
  attractions: UttarPradeshAttraction[];
}

export const UTTAR_PRADESH_DIRECTORY: UttarPradeshCity[] = [
  {
    id: 'varanasi',
    code: 'IN-UP-CITY-VNS',
    name: 'Varanasi (Kashi / Banaras)',
    nickname: 'The Spiritual Heartland of India',
    tagline: '84 stone ghats, sacred Kashi Vishwanath corridor & Subah-e-Banaras dawn ragas',
    accentColor: '#EA580C',
    bgGradient: 'from-orange-50 via-amber-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Varanasi_Ghats_Ganga.jpg/1280px-Varanasi_Ghats_Ganga.jpg',
    photoCredit: 'Wikimedia Commons / Varanasi Ghats',
    flashcardBlurb:
      'One of the oldest continuously inhabited cities in the world, sitting gracefully on the crescent banks of the Ganges, serving as the spiritual heartland of India famous for its ethereal Ghats, temples, and classical heritage.',
    topStays: [
      { name: 'Brijrama Palace', category: 'Darbhanga Ghat — Heritage Palace Luxury on the river' },
      { name: 'Taj Ganges', category: 'Cantonment' },
      { name: 'Hotel Surya', category: 'Heritage Hotel' },
    ],
    dining: {
      veg: [
        { restaurant: 'Kashi Chat Bhandar', location: 'Godowla', specialties: 'Iconic Tamatar Chaat and Aloo Tikki' },
        { restaurant: 'Blue Lassi', location: 'Chauk', specialties: 'Legendary fruit lassis' },
      ],
      nonVeg: [
        { restaurant: 'The Gateway Hotel', location: 'Cantonment', specialties: 'Multi-cuisine Awadhi and non-veg delicacies' },
        { restaurant: 'Local Lanes', location: 'Varanasi', specialties: 'Banarasi street snacks and local savouries' },
      ],
      pilgrimageNotice:
        'Sacred Ghats Rule: Ancient city lanes surrounding Kashi Vishwanath Temple and the 84 Ganga ghats are strictly vegetarian. Non-vegetarian cuisine is served exclusively outside the sacred religious perimeter in Cantonment.',
      peacefulNote:
        'Kashi\'s culinary soul thrives on fragrant Banarasi Paan, morning Poori-Jalebi, frothy saffron winter Malaiyo, and earthen kulhad lassi.',
    },
    attractions: [
      {
        id: 'IN-UP-VNS-ATT-001',
        name: 'Dashashwamedh Ghat & Evening Ganga Aarti',
        category: 'Spiritual: Hinduism',
        timings: 'Aarti daily at sunset (~18:45 in summer, ~18:00 in winter)',
        fee: { domestic: 'Free (Boat ride views: ~INR 200–500)', foreign: 'Free (Boat ride views: ~INR 200–500)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Ganga_Aarti_Dashashwamedh_Ghat.jpg/1280px-Ganga_Aarti_Dashashwamedh_Ghat.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The main bustling ghat hosting the grand, mesmerizing daily ritual fire worship of the Ganges.',
      },
      {
        id: 'IN-UP-VNS-ATT-002',
        name: 'Kashi Vishwanath Temple & Corridor',
        category: 'Spiritual: Hinduism',
        timings: '03:00–23:00',
        fee: { domestic: 'Free (Special Darshan passes available online)', foreign: 'Free (Special Darshan passes available online)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Kashi_Vishwanath_Temple_Varanasi.jpg/1280px-Kashi_Vishwanath_Temple_Varanasi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of the most revered Jyotirlinga shrines dedicated to Lord Shiva, linked directly to the river via a monumental corridor.',
      },
      {
        id: 'IN-UP-VNS-ATT-003',
        name: 'Sarnath Archaeological Site',
        category: 'Spiritual / Heritage: Buddhism',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Dhamekh_Stupa_Sarnath.jpg/1280px-Dhamekh_Stupa_Sarnath.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The sacred deer park where Gautama Buddha delivered his first sermon (Dhammacakkappavattana Sutta).',
      },
      {
        id: 'IN-UP-VNS-GEM-001',
        name: 'Ramnagar Fort',
        category: 'Heritage: Palaces & Forts',
        timings: '10:00–17:00',
        fee: { domestic: 'INR 50', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Chunar_Fort_Mirzapur.jpg/1280px-Chunar_Fort_Mirzapur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '18th-century sandstone fort across the river serving as the ancestral home of the Maharaja of Varanasi.',
      },
    ],
  },
  {
    id: 'ayodhya',
    code: 'IN-UP-CITY-AYD',
    name: 'Ayodhya',
    nickname: 'Sacred Realm of Ram Janmabhoomi',
    tagline: 'The ancient sacred city on the Saryu, grand Ram Mandir & holy riverfront aartis',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Ram_Mandir_Ayodhya_Night.jpg/1280px-Ram_Mandir_Ayodhya_Night.jpg',
    photoCredit: 'Wikimedia Commons / Ram Janmabhoomi Mandir',
    flashcardBlurb:
      'The ancient sacred city on the banks of the Saryu River, revered globally as the birthplace of Lord Rama and witnessing a monumental renaissance with grand temple architectures.',
    topStays: [
      { name: 'The Fern Amrit Resort', category: 'Luxury Resort' },
      { name: 'Taraji Resort', category: 'Modern Comfort Stay' },
      { name: 'Shan-e-Awadh Hotel', category: 'City Centre Hotel' },
    ],
    dining: {
      veg: [
        { restaurant: 'Mani Ram Das Ji Ki Chhavani', location: 'Ayodhya', specialties: 'Traditional temple prasad and pure veg thalis' },
        { restaurant: 'Local Sweet Shops', location: 'Ram Path', specialties: 'Traditional pedas, rabri, and freshly fried jalebis' },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: As a sacred pilgrimage city, non-vegetarian food is restricted in the core temple sectors.',
      peacefulNote:
        'Ayodhya’s temple kitchens serve pure sattvic cuisine cooked without onion or garlic, centering on freshly pounded wheat rotis, moong dal, pumpkin sabzi, and makhan prasad.',
    },
    attractions: [
      {
        id: 'IN-UP-AYD-ATT-001',
        name: 'Ram Mandir',
        category: 'Spiritual: Hinduism',
        timings: '06:30–21:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Ram_Mandir_Ayodhya_Night.jpg/1280px-Ram_Mandir_Ayodhya_Night.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The grand newly-constructed architectural marvel marking the birthplace (Ram Janmabhoomi) of Lord Rama.',
      },
      {
        id: 'IN-UP-AYD-ATT-002',
        name: 'Hanuman Garhi',
        category: 'Spiritual: Hinduism',
        timings: '05:00–22:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Hanuman_Garhi_Ayodhya.jpg/1280px-Hanuman_Garhi_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A 10th-century temple fortress perched atop a high mound housing Lord Hanuman, traditionally visited before the main Ram Darshan.',
      },
      {
        id: 'IN-UP-AYD-ATT-003',
        name: 'Saryu River Ghats & Aarti',
        category: 'Spiritual / Nature: Rivers & Lakes',
        timings: 'Open 24 hours (Aarti at sunset)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Ram_Ki_Paidi_Ayodhya.jpg/1280px-Ram_Ki_Paidi_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Holy riverbanks hosting evening daily aartis and boat cruises.',
      },
      {
        id: 'IN-UP-AYD-GEM-001',
        name: 'Kanak Bhawan',
        category: 'Spiritual: Hinduism',
        timings: '08:00–11:30 & 16:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Kanak_Bhawan_Ayodhya.jpg/1280px-Kanak_Bhawan_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '19th-century golden palace-temple gifted to Sita by Kaikeyi, featuring exquisite shrines of Ram and Sita.',
      },
    ],
  },
  {
    id: 'mathura',
    code: 'IN-UP-CITY-MTH',
    name: 'Mathura & Vrindavan',
    nickname: 'The Sacred Land of Braj',
    tagline: 'Lord Krishna’s childhood realm, thousands of sacred temples & vibrant Yamuna ghats',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-amber-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Prem_Mandir_Vrindavan_Night.jpg/1280px-Prem_Mandir_Vrindavan_Night.jpg',
    photoCredit: 'Wikimedia Commons / Prem Mandir Vrindavan',
    flashcardBlurb:
      'The legendary Braj Bhoomi region where Lord Krishna spent his childhood, packed with thousands of vibrant temples, bustling ghats, and rich cultural traditions.',
    topStays: [
      { name: 'Nidhivan Sarovar Portico', category: 'Vrindavan' },
      { name: 'Hotel Goverdhan Palace', category: 'Mathura' },
      { name: 'Brijwasi Royal', category: 'Mathura' },
    ],
    dining: {
      veg: [
        { restaurant: 'Brijwasi Mithai Wala', location: 'Mathura', specialties: 'Famous for pedas, Kachori, and rabri' },
        { restaurant: 'Shri Radha Brijwasi Restaurant', location: 'Vrindavan', specialties: 'Pure Sattvic North & South Indian thalis' },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: Strictly vegetarian region; non-veg and alcohol are entirely prohibited across the holy Braj circuit.',
      peacefulNote:
        'Braj cuisine celebrates pure milk delicacies: Mathura ke Pede, thick Malai Lassi, Makhan Mishri prasad, and crisp Bedmi Poori with spiced Dubki Wale Aloo.',
    },
    attractions: [
      {
        id: 'IN-UP-MTH-ATT-001',
        name: 'Krishna Janmabhoomi Temple, Mathura',
        category: 'Spiritual: Hinduism',
        timings: '05:00–12:00 & 16:00–21:30',
        fee: { domestic: 'Free (Strict security checks; no electronics allowed)', foreign: 'Free (Strict security checks; no electronics allowed)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Krishna_Janmasthan_Temple_Complex.jpg/1280px-Krishna_Janmasthan_Temple_Complex.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The holy prison cell sanctuary believed to be the exact birthplace of Lord Krishna.',
      },
      {
        id: 'IN-UP-MTH-ATT-002',
        name: 'Bankey Bihari Temple, Vrindavan',
        category: 'Spiritual: Hinduism',
        timings: '07:45–12:00 & 17:30–21:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Banke_Bihari_Temple_Vrindavan.jpg/1280px-Banke_Bihari_Temple_Vrindavan.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of India’s most revered Krishna shrines, famous for its unique curtain-lifting tradition (Jhulan Darshan).',
      },
      {
        id: 'IN-UP-MTH-ATT-003',
        name: 'Prem Mandir, Vrindavan',
        category: 'Spiritual / Arts: Hinduism',
        timings: '05:30–12:00 & 16:30–20:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Prem_Mandir_Vrindavan_Night.jpg/1280px-Prem_Mandir_Vrindavan_Night.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Breathtaking white Italian marble temple complex illuminated with stunning multi-colored lights at night.',
      },
      {
        id: 'IN-UP-MTH-GEM-001',
        name: 'Govardhan Hill & Parikrama',
        category: 'Spiritual / Nature: Hills & Mountains',
        timings: 'Open 24 hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Govardhan_Hill_Parikrama.jpg/1280px-Govardhan_Hill_Parikrama.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Sacred sandstone hill where devotees perform a 21-km ritual circumambulation (Parikrama).',
      },
    ],
  },
  {
    id: 'prayagraj',
    code: 'IN-UP-CITY-PRY',
    name: 'Prayagraj (Allahabad)',
    nickname: 'The Holy Confluence & City of Prime Ministers',
    tagline: 'The sacred Triveni Sangam, Akbar’s monumental fort & Kumbh Mela congregation',
    accentColor: '#2563EB',
    bgGradient: 'from-blue-50 via-indigo-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Triveni_Sangam_Prayagraj.jpg/1280px-Triveni_Sangam_Prayagraj.jpg',
    photoCredit: 'Wikimedia Commons / Triveni Sangam Prayagraj',
    flashcardBlurb:
      'A historic city anchored by the holy Triveni Sangam—the invisible confluence of the Ganges, Yamuna, and mythical Saraswati rivers—and host to the monumental Kumbh Mela.',
    topStays: [
      { name: 'Welcomhotel by ITC Hotels', category: 'Civil Lines' },
      { name: 'Hotel Kanha Shyam', category: 'Civil Lines' },
      { name: 'Legend Hotel', category: 'City Centre' },
    ],
    dining: {
      veg: [
        { restaurant: 'Kamdhenu Sweets', location: 'Civil Lines', specialties: 'North Indian thalis and chaat' },
        { restaurant: 'Loknath ki Chaat lanes', location: 'Chowk', specialties: 'Historic dahi bhalla and samosa chaat' },
      ],
      nonVeg: [
        { restaurant: 'El Chico', location: 'Civil Lines', specialties: 'Classic multi-cuisine non-veg dishes and continental items' },
      ],
      peacefulNote:
        'Prayagraj is celebrated for its spicy Dahi Jalebi breakfasts, Gujiya sweets, and winter red guavas (Allahabadi Surkha).',
    },
    attractions: [
      {
        id: 'IN-UP-PRY-ATT-001',
        name: 'Triveni Sangam',
        category: 'Spiritual / Nature: Rivers & Lakes',
        timings: 'Dawn to Dusk',
        fee: { domestic: 'Boat hire ~INR 300–800', foreign: 'Boat hire ~INR 300–800' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Triveni_Sangam_Prayagraj.jpg/1280px-Triveni_Sangam_Prayagraj.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The sacred river confluence where millions gather for holy dips, accessible via organized boat rides.',
      },
      {
        id: 'IN-UP-PRY-ATT-002',
        name: 'Prayagraj Fort',
        category: 'Heritage: Palaces & Forts',
        timings: '07:00–18:00',
        fee: { domestic: 'Free (Restricted zones apply)', foreign: 'Free (Restricted zones apply)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Allahabad_Fort_Yamuna.jpg/1280px-Allahabad_Fort_Yamuna.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '16th-century massive fort built by Emperor Akbar on the banks of the Yamuna, housing the Undying Banyan Tree (Akshaya Vat).',
      },
      {
        id: 'IN-UP-PRY-ATT-003',
        name: 'Anand Bhavan',
        category: 'Heritage: Historical Buildings',
        timings: '09:30–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 15', foreign: 'INR 250' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Anand_Bhavan_Allahabad.jpg/1280px-Anand_Bhavan_Allahabad.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The ancestral home of the Nehru-Gandhi family, now an inspiring museum chronicling India\'s freedom struggle.',
      },
      {
        id: 'IN-UP-PRY-GEM-001',
        name: 'Khusro Bagh',
        category: 'Heritage: Monuments',
        timings: '06:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Khusro_Bagh_Allahabad.jpg/1280px-Khusro_Bagh_Allahabad.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Walled Mughal garden complex containing stunning multi-tiered sandstone mausoleums of Prince Khusro and his family.',
      },
    ],
  },
  {
    id: 'agra',
    code: 'IN-UP-CITY-AGR',
    name: 'Agra',
    nickname: 'Imperial City of the Taj & Mughal Splendour',
    tagline: 'Pietra dura marble mausoleums, Yamuna riverfront bastions & Agra petha legacy',
    accentColor: '#C2410C',
    bgGradient: 'from-stone-50 via-orange-50/30 to-amber-50/20',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1280px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
    photoCredit: 'Wikimedia Commons / Taj Mahal',
    flashcardBlurb:
      'The imperial seat of the Mughal Empire at its zenith, framed by the Yamuna River, white-marble mausoleums, red sandstone ramparts, and petha confectionery traditions.',
    topStays: [
      { name: 'The Oberoi Amarvilas', category: 'Taj East Gate Road — Luxury Suites with direct Taj views' },
      { name: 'ITC Mughal', category: 'Fatehabad Road — Mughal-inspired Luxury Estate' },
      { name: 'Courtyard by Marriott Agra', category: 'Fatehabad Road — Premium Hospitality' },
    ],
    dining: {
      veg: [
        { restaurant: 'Panchhi Petha Store', location: 'Sadar Bazaar / Hari Parbat', specialties: 'Authentic translucent Angoori, Kesar, Paan, and Sandalwood Petha confectionery' },
        { restaurant: 'Dasaprakash', location: 'Sadar Bazaar', specialties: 'Crispy Ghee Roast dosas, South Indian tiffins & wholesome vegetarian thalis' },
      ],
      nonVeg: [
        { restaurant: 'Peshawri at ITC Mughal', location: 'Fatehabad Road', specialties: 'Legendary slow-cooked Dal Bukhara, Murgh Malai Kebab & tender Sikandari Raan roasted in clay ovens' },
        { restaurant: 'Pinch of Spice', location: 'Wazirpura Road / Fatehabad Road', specialties: 'Rich Handi Gosht, Mughlai chicken curries, aromatic gravies & freshly baked garlic naan' },
      ],
      peacefulNote: 'Agra\'s confectionery heritage is crowned by the 350-year-old Petha recipe prepared from ash gourd, paired with crisp Bedmi Poori and spicy Aloo Sabzi for breakfast.',
    },
    attractions: [
      {
        id: 'IN-UP-AGR-ATT-001',
        name: 'The Taj Mahal',
        category: 'Heritage · UNESCO World Heritage, Monuments, Mughal Masterpiece',
        timings: '30 minutes before sunrise to 30 minutes before sunset (Closed every Friday)',
        fee: { domestic: 'INR 50 + INR 200 for Main Mausoleum interior', foreign: 'INR 1,100 + INR 200 for Main Mausoleum interior' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1280px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '17th-century ivory-white marble mausoleum on the south bank of the Yamuna commissioned by Emperor Shah Jahan for Mumtaz Mahal; celebrated globally as the jewel of Indo-Islamic architecture.',
      },
      {
        id: 'IN-UP-AGR-ATT-002',
        name: 'Agra Fort',
        category: 'Heritage · UNESCO World Heritage, Palaces & Forts (Sheesh Mahal, Diwan-i-Khas, Jahangiri Mahal)',
        timings: '06:00–18:00 (Open all 7 days)',
        fee: { domestic: 'INR 50', foreign: 'INR 650' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Agra_Fort_Amar_Singh_Gate.jpg/1280px-Agra_Fort_Amar_Singh_Gate.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Monumental 94-acre red sandstone fortress palace overlooking the Yamuna River, containing Jahangiri Mahal, Diwan-i-Khas, Sheesh Mahal, and the Musamman Burj where Shah Jahan was imprisoned.',
      },
      {
        id: 'IN-UP-AGR-ATT-003',
        name: 'Fatehpur Sikri & Buland Darwaza',
        category: 'Heritage / Spiritual · UNESCO World Heritage, Historical Sites, Salim Chishti Dargah',
        timings: 'Sunrise to Sunset (06:00–18:00)',
        fee: { domestic: 'INR 50', foreign: 'INR 610' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Buland_Darwaza%2C_Fatehpur_Sikri.jpg/1280px-Buland_Darwaza%2C_Fatehpur_Sikri.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The short-lived 16th-century imperial capital of Emperor Akbar built in red sandstone, entered via the monumental 54-meter Buland Darwaza and housing the white marble Dargah of Sheikh Salim Chishti.',
      },
      {
        id: 'IN-UP-AGR-GEM-001',
        name: "Tomb of I'timad-ud-Daulah (Baby Taj)",
        category: 'Heritage · Monuments, First Mughal White Marble Structure with Pietra Dura Inlay',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 30', foreign: 'INR 310' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Itmad-ud-Daula%2C_Agra.jpg/1280px-Itmad-ud-Daula%2C_Agra.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Often described as the draft or jewel box of the Taj Mahal, this was the first Mughal structure built entirely of white Rajasthani marble featuring delicate floral Pietra Dura inlay.',
      },
      {
        id: 'IN-UP-AGR-GEM-002',
        name: 'Mehtab Bagh Sunset Taj Reflection Point',
        category: 'Nature / Heritage · Forests & Gardens, Charbagh Riverfront Axis',
        timings: '06:00–18:30',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Taj_Mahal_from_Mehtab_Bagh.jpg/1280px-Taj_Mahal_from_Mehtab_Bagh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A 25-acre crescent-shaped Charbagh garden complex on the opposite northern bank of the Yamuna River, aligned perfectly with the Taj Mahal to capture serene sunset reflections away from crowds.',
      },
      {
        id: 'IN-UP-AGR-GEM-003',
        name: 'Bateshwar Temple Complex & Chambal Ravines',
        category: 'Heritage / Nature · 101 Shiva Temples curved along the Yamuna Crescent, Chambal Boat Safari',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Chambal River Safari boat: INR 1,500–2,500)', foreign: 'Free (Chambal River Safari boat: INR 1,500–2,500)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Bateshwar_Temples_Yamuna.jpg/1280px-Bateshwar_Temples_Yamuna.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A spectacular curved crescent of 101 historic white Shiva temples along the Yamuna bank, gateway to the rugged National Chambal Sanctuary sheltering gharials, river dolphins, and migratory birds.',
      },
    ],
  },
  {
    id: 'lucknow',
    code: 'IN-UP-CITY-LKO',
    name: 'Lucknow',
    nickname: 'The City of Nawabs & Tehzeeb',
    tagline: 'Pillarless vaulted halls, Chikankari needlework & centuries-old Dum Pukht gastronomy',
    accentColor: '#7C2D12',
    bgGradient: 'from-amber-50 via-orange-50/30 to-stone-50/20',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Rumi_Darwaza_Lucknow.jpg/1280px-Rumi_Darwaza_Lucknow.jpg',
    photoCredit: 'Wikimedia Commons / Rumi Darwaza',
    flashcardBlurb:
      'The city of Nawabs, celebrated for Tehzeeb (refined etiquette), Chikankari needlecraft, columnless arched imambaras, and the world\'s most nuanced Dum Pukht gastronomy.',
    topStays: [
      { name: 'The Taj Mahal Lucknow', category: 'Gomti Nagar — Luxury Colonial & Awadhi Heritage' },
      { name: 'Lebua Lucknow', category: 'Mall Avenue — 1936 Art Deco Bungalow Estate' },
      { name: 'Hyatt Regency Lucknow', category: 'Vibhuti Khand — Contemporary Luxury' },
    ],
    dining: {
      veg: [
        { restaurant: 'Netram Ajay Kumar', location: 'Aminabad', specialties: 'Fluffy puris fried in Pure Desi Ghee with spicy Hing Aloo and hot Gulab Jamuns' },
        { restaurant: 'Bajpayee Kachodi Bhandar', location: 'Hazratganj', specialties: 'Flaky Khasta Kachori topped with spicy dry Chhole, tangy chutneys and fried green chillies' },
      ],
      nonVeg: [
        { restaurant: 'Tunday Kababi', location: 'Aminabad', specialties: 'The original 160-spice melt-in-the-mouth Galouti and buffalo kebabs crafted since 1905' },
        { restaurant: 'Dastarkhwan', location: 'Tulsi Theatre, Hazratganj', specialties: 'Silken Awadhi Chicken Masala, Boti Kebab, Mutton Biryani & warm Mughlai parathas' },
        { restaurant: 'Idris Biryani', location: 'Raja Bazaar, Chowk', specialties: 'Traditional wood-fired Awadhi Mutton Dum Biryani simmered in earthen handis' },
      ],
      peacefulNote: 'Awadhi Dum Pukht cooking uses slow earthen-pot sealed charcoal steaming, infusing saffron, rosewater, screwpine (kewra), and hand-pounded aromatic spices.',
    },
    attractions: [
      {
        id: 'IN-UP-LKO-ATT-001',
        name: 'Bara Imambara & Bhool Bhulaiya',
        category: "Heritage · Historical Buildings, World's Largest Vaulted Hall without Pillars, Labyrinth",
        timings: '06:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 50 (Composite ticket includes Chhota Imambara)', foreign: 'INR 300–500' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Bara_Imambara_Lucknow.jpg/1280px-Bara_Imambara_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Built in 1784 by Nawab Asaf-ud-Daula as famine-relief architecture, featuring a colossal 50-meter unsupported central arched hall and the intricate 3D labyrinth of Bhool Bhulaiya on upper levels.',
      },
      {
        id: 'IN-UP-LKO-ATT-002',
        name: 'Chhota Imambara (Hussainabad Imambara)',
        category: 'Heritage · Historical Buildings, "Palace of Lights", Belgian Glass Chandeliers',
        timings: '06:00–17:00',
        fee: { domestic: 'Covered in Bara Imambara ticket', foreign: 'Covered in Bara Imambara ticket' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Chhota_Imambara_Lucknow.jpg/1280px-Chhota_Imambara_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Exquisite 19th-century mausoleum built by Muhammad Ali Shah, adorned with gilded domes, intricate Urdu calligraphy, and a priceless collection of Belgian crystal chandeliers.',
      },
      {
        id: 'IN-UP-LKO-ATT-003',
        name: 'The British Residency Grounds',
        category: 'Heritage · Historical Sites, 1857 Siege of Lucknow Relics, Cannon-Scared Brickwork',
        timings: '07:00–18:00 (Closed Mondays)',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/British_Residency_Lucknow.jpg/1280px-British_Residency_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Historic 33-acre parkland preserving the ruined brick complex that served as the refuge during the dramatic 1857 Siege of Lucknow, retaining intact cannonball scars, graves, and museum galleries.',
      },
      {
        id: 'IN-UP-LKO-ATT-004',
        name: 'Rumi Darwaza',
        category: 'Heritage · Monuments, 60-ft Turkish Gateway, Awadhi Architectural Icon',
        timings: 'Open 24 Hours (External viewing)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Rumi_Darwaza_Lucknow.jpg/1280px-Rumi_Darwaza_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '60-foot-tall ornamental gateway constructed in 1784 modelled after the Sublime Porte in Istanbul; the quintessential architectural symbol of Awadhi grandeur.',
      },
      {
        id: 'IN-UP-LKO-GEM-001',
        name: 'Chowk Artisan By-lanes (Chikankari & Ittar Distillers)',
        category: 'Arts / Gastronomy · Crafts-Tourism, Traditional Attar (Mitti, Ruh Gulab) & Shadow-Work Embroidery',
        timings: '11:00–20:00 (Closed Thursdays)',
        fee: { domestic: 'Free (Workshops accessible via local guides)', foreign: 'Free (Workshops accessible via local guides)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Chikankari Embroidery',
        summary:
          'Historic bazaar lanes where generations of master artisans hand-distill pure Mitti attar (the scent of baked earth after first rain) in copper degs, alongside delicate white-on-white Chikankari embroidery ateliers.',
      },
      {
        id: 'IN-UP-LKO-GEM-002',
        name: 'La Martiniere College (Constantia)',
        category: 'Heritage · Historical Buildings, 18th-century French-Palladian Palace Fortress',
        timings: '09:00–17:00 (Requires gate entry permission; restricted during school sessions)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Constantia_La_Martiniere_Lucknow.jpg/1280px-Constantia_La_Martiniere_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The extravagant 18th-century estate of French Major General Claude Martin, combining European Palladian arches, Gothic gargoyles, Corinthian pilasters, and subterranean crypt halls.',
      },
    ],
  },
];
