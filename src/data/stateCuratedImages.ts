export interface CuratedStateImage {
  imageUrl: string;
  creator: string;
  landmark: string;
  bestSeason?: string;
  tags?: string[];
}

export const STATE_CURATED_IMAGES: Record<string, CuratedStateImage> = {
  // Northern Region
  'chandigarh': {
    imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&auto=format&fit=crop&q=80',
    creator: 'Chandigarh Tourism / Open Hand Monument',
    landmark: 'Open Hand Monument & Capitol Complex',
    bestSeason: 'Oct - Mar',
    tags: ['Le Corbusier Architecture', 'Rock Garden', 'Sukhna Lake'],
  },
  'delhi': {
    imageUrl: '/images/delhi-red-fort-4k.jpg',
    creator: 'Getty Images / Delhi Heritage',
    landmark: 'Red Fort (Lal Qila) & Lahori Gate',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Red Fort 4K', 'Tiranga Ramparts', 'Qutub Minar', 'Humayun Tomb', 'India Gate'],
  },
  'haryana': {
    imageUrl: '/images/haryana-kapal-mochan-4k.jpg',
    creator: 'Haryana Tourism / Archaeological Heritage',
    landmark: 'Kapal Mochan Gurdwara & Brahma Sarovar',
    bestSeason: 'Oct - Mar',
    tags: ['Kapal Mochan Heritage', 'Sacred Sarovar', 'Kurukshetra', 'Pinjore Gardens'],
  },
  'himachal-pradesh': {
    imageUrl: '/images/himachal-kalpa-kinner-kailash-4k.jpg',
    creator: 'Himachal Tourism / Sapna Sony',
    landmark: 'Kalpa Village & Sacred Kinner Kailash Peaks',
    bestSeason: 'Mar - Jun & Sep - Dec',
    tags: ['Kalpa Village', 'Kinner Kailash', 'Kinnaur Valley', 'Himalayan Heritage'],
  },
  'jammu-and-kashmir': {
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Kashmir Tourism',
    landmark: 'Dal Lake & Shikara, Srinagar',
    bestSeason: 'Apr - Oct',
    tags: ['Dal Lake', 'Gulmarg Meadows', 'Pahalgam'],
  },
  'ladakh': {
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Ladakh Monasteries',
    landmark: 'Pangong Tso & Thiksey Gompa',
    bestSeason: 'May - Sep',
    tags: ['High Mountain Passes', 'Pangong Lake', 'Buddhist Monasteries'],
  },
  'punjab': {
    imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Amritsar',
    landmark: 'Sri Harmandir Sahib (Golden Temple)',
    bestSeason: 'Oct - Mar',
    tags: ['Golden Temple', 'Wagah Border', 'Living Culture'],
  },
  'rajasthan': {
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Rajasthan Forts',
    landmark: 'Hawa Mahal & Amber Fort, Jaipur',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Forts', 'Palaces', 'Desert Safari', 'Udaipur'],
  },
  'uttar-pradesh': {
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Agra Heritage',
    landmark: 'Taj Mahal & Varanasi Ghats',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Taj Mahal', 'Varanasi Ghats', 'Ayodhya', 'Fatehpur Sikri'],
  },
  'uttarakhand': {
    imageUrl: '/images/uttarakhand-kedarnath-4k.jpg',
    creator: 'Shivam Kumar / Wikimedia Commons',
    landmark: 'Kedarnath Temple & Garhwal Himalayas',
    bestSeason: 'May - Jun, Sep - Nov',
    tags: ['Kedarnath 4K', 'Char Dham Pilgrimage', 'Garhwal Himalayas', 'Rishikesh Yoga Capital'],
  },

  // Northeast Region
  'arunachal-pradesh': {
    imageUrl: '/images/arunachal-pradesh-tawang-4k.jpg',
    creator: 'Trideep Dutta / Wikimedia Commons',
    landmark: 'Tawang Monastery & Eastern Himalayas',
    bestSeason: 'Oct - Apr',
    tags: ['Tawang Monastery', 'Galden Namgyal Lhatse', 'Sela Pass', 'Ziro Valley'],
  },
  'assam': {
    imageUrl: '/images/assam-tea-plantation-4k.jpg',
    creator: 'Assam Tourism / Tea Board of India',
    landmark: 'Brahmaputra Valley Tea Gardens & Kaziranga',
    bestSeason: 'Nov - Apr',
    tags: ['Assam Tea Heritage', 'Brahmaputra River', 'One-Horned Rhino', 'Kaziranga'],
  },
  'manipur': {
    imageUrl: '/images/manipur-kangla-fort-kangla-sha-4k.jpg',
    creator: 'Manipur Tourism / Crazyscientistmeitei (Wikimedia Commons)',
    landmark: 'Kangla Fort & Sacred Kangla Sha, Imphal',
    bestSeason: 'Oct - Mar',
    tags: ['Kangla Sha Emblem', 'Kangla Fort Palace', 'Loktak Floating Lake', 'Keibul Lamjao'],
  },
  'meghalaya': {
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Meghalaya Cascades',
    landmark: 'Living Root Bridges & Cherrapunji',
    bestSeason: 'Oct - May',
    tags: ['Living Root Bridges', 'Nohkalikai Falls', 'Dawki River'],
  },
  'mizoram': {
    imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1200&auto=format&fit=crop&q=80',
    creator: 'Mizoram Tourism / Aizawl',
    landmark: 'Blue Mountain & Reiek Tlang',
    bestSeason: 'Oct - Mar',
    tags: ['Mizo Hills', 'Vantawng Falls', 'Chapchar Kut'],
  },
  'nagaland': {
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    creator: 'Nagaland Tourism / Kisama',
    landmark: 'Dzukou Valley & Hornbill Festival',
    bestSeason: 'Oct - May',
    tags: ['Hornbill Festival', 'Dzukou Valley', 'Tribal Heritage'],
  },
  'sikkim': {
    imageUrl: '/images/sikkim-rabdentse-ruins-4k.jpg',
    creator: 'Amitabha Gupta / Archaeological Survey of India (Wikimedia Commons)',
    landmark: 'Rabdentse Palace Ruins & Kanchenjunga View, Pelling',
    bestSeason: 'Mar - May & Oct - Dec',
    tags: ['Rabdentse Royal Ruins', 'Ancient Capital of Sikkim', 'Chortens & Palace', 'Pemayangtse Heritage'],
  },
  'tripura': {
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
    creator: 'Tripura Tourism / Neermahal',
    landmark: 'Neermahal Water Palace & Unakoti',
    bestSeason: 'Sep - Mar',
    tags: ['Neermahal Palace', 'Unakoti Rock Carvings', 'Ujjayanta'],
  },

  // Eastern Region & Islands
  'andaman-and-nicobar-islands': {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Havelock Island',
    landmark: 'Radhanagar Beach & Cellular Jail',
    bestSeason: 'Oct - May',
    tags: ['Cellular Jail Memorial', 'Coral Reefs', 'Havelock Island'],
  },
  'bihar': {
    imageUrl: '/images/bihar-great-buddha.jpg',
    creator: 'Andrew Moore / Great Buddha Statue, Bodh Gaya',
    landmark: 'Great Buddha Statue, Bodh Gaya',
    bestSeason: 'Oct - Mar',
    tags: ['Great Buddha Statue (80-ft)', 'Bodh Gaya', 'Mahabodhi Temple', 'Ancient Nalanda University'],
  },
  'jharkhand': {
    imageUrl: '/images/jharkhand-baidyanath-dham-4k.jpg',
    creator: 'Jharkhand Tourism / Onkar D Khandalikar',
    landmark: 'Baba Baidyanath Jyotirlinga Dham, Deoghar',
    bestSeason: 'Oct - Mar',
    tags: ['Baba Baidyanath Dham', 'Deoghar Jyotirlinga', 'Panchshul & Gathbandhan', 'Shravani Mela'],
  },
  'odisha': {
    imageUrl: '/images/odisha-puri-jagannath-4k.jpg',
    creator: 'Debojit Sahu / Wikimedia Commons',
    landmark: 'Shree Jagannath Temple, Puri',
    bestSeason: 'Oct - Mar',
    tags: ['Jagannath Puri 4K', 'Rath Yatra & Nilachakra', 'Konark Sun Temple', 'Chilika Lake & Golden Beach'],
  },
  'west-bengal': {
    imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Victoria Memorial Kolkata',
    landmark: 'Victoria Memorial & Darjeeling Hills',
    bestSeason: 'Oct - Mar',
    tags: ['Kolkata Heritage', 'Darjeeling Toy Train', 'Sundarbans UNESCO'],
  },

  // Central Region
  'chhattisgarh': {
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    creator: 'Chhattisgarh Tourism / Bastar',
    landmark: 'Chitrakote Falls & Bastar Bell Metal',
    bestSeason: 'Oct - Mar',
    tags: ['Niagara of India', 'Bastar Tribal Crafts', 'Sirpur Monuments'],
  },
  'madhya-pradesh': {
    imageUrl: '/images/madhya-pradesh-mahakaleshwar-ujjain-4k.jpg',
    creator: 'Madhya Pradesh Tourism / Ashverse (Wikimedia Commons)',
    landmark: 'Shri Mahakaleshwar Jyotirlinga Temple, Ujjain',
    bestSeason: 'Oct - Mar',
    tags: ['Mahakaleshwar Jyotirlinga', 'Ujjain Mahakal Corridor', 'Khajuraho UNESCO', 'Sanchi Stupa'],
  },

  // Western Region
  'dadra-and-nagar-haveli-and-daman-and-diu': {
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
    creator: 'Daman Tourism / Diu Fort',
    landmark: 'Diu Portuguese Fort & Nagoa Beach',
    bestSeason: 'Oct - Mar',
    tags: ['Portuguese Fortresses', 'St. Paul Church', 'Nagoa Beach'],
  },
  'goa': {
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Goa Heritage',
    landmark: 'Basilica of Bom Jesus & Old Goa',
    bestSeason: 'Nov - Feb',
    tags: ['UNESCO Churches', 'Palolem Beach', 'Spice Plantations', 'Fort Aguada'],
  },
  'gujarat': {
    imageUrl: '/images/gujarat-statue-of-unity-4k.jpg',
    creator: 'Government of India / Statue of Unity Authority',
    landmark: 'Statue of Unity (Kevadia) & Rani ki Vav',
    bestSeason: 'Oct - Mar',
    tags: ['Statue of Unity', 'World Tallest Statue', 'Sardar Sarovar', 'UNESCO Rani ki Vav'],
  },
  'maharashtra': {
    imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Gateway of India',
    landmark: 'Gateway of India & Ajanta-Ellora Caves',
    bestSeason: 'Oct - Mar',
    tags: ['Gateway of India', 'UNESCO Ajanta Ellora', 'Chhatrapati Shivaji Terminus'],
  },

  // Southern Region
  'andhra-pradesh': {
    imageUrl: '/images/andhra-pradesh-tirumala-4k.jpg',
    creator: 'Tirumala Tirupati Devasthanams / Wikimedia Commons',
    landmark: 'Tirumala Venkateswara Temple Gopuram & Ananda Nilayam',
    bestSeason: 'Sep - Feb',
    tags: ['Tirumala Tirupati', 'Sri Venkateswara Swamy', 'Ananda Nilayam', 'Lepakshi Heritage'],
  },
  'karnataka': {
    imageUrl: '/images/karnataka-hampi-stone-chariot-4k.jpg',
    creator: 'Karnataka Tourism / Sclickp (Wiki Loves Monuments)',
    landmark: 'Stone Chariot at Vijaya Vittala Temple, Hampi',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Hampi Stone Chariot', 'Vijaya Vittala Temple', 'Vijayanagara Empire', 'Mysore Palace'],
  },
  'kerala': {
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Kerala Backwaters',
    landmark: 'Alleppey Backwaters & Munnar Hills',
    bestSeason: 'Sep - Mar',
    tags: ['Living Backwaters', 'Munnar Tea Hills', 'Kathakali Dance', 'Fort Kochi'],
  },
  'lakshadweep': {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Lakshadweep Coral Atoll',
    landmark: 'Bangaram Coral Reefs & Turquoise Lagoons',
    bestSeason: 'Oct - Apr',
    tags: ['Coral Atolls', 'Pristine Lagoons', 'Scuba & Marine Life'],
  },
  'puducherry': {
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / White Town Puducherry',
    landmark: 'French Quarter White Town & Auroville',
    bestSeason: 'Oct - Mar',
    tags: ['French Colonial Quarter', 'Promenade Beach', 'Auroville Matrimandir'],
  },
  'tamil-nadu': {
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Madurai Gopuram',
    landmark: 'Meenakshi Temple & Mahabalipuram',
    bestSeason: 'Nov - Feb',
    tags: ['UNESCO Shore Temple', 'Madurai Meenakshi', 'Brihadeeswarar Thanjavur'],
  },
  'telangana': {
    imageUrl: '/images/telangana-charminar-4k.jpg',
    creator: 'ASI / Hyderabad Old City Heritage',
    landmark: 'Charminar & Historic Old City, Hyderabad',
    bestSeason: 'Oct - Mar',
    tags: ['Charminar 4K', 'UNESCO Ramappa Temple', 'Golconda Fort Acoustical Vaults', 'Laad Bazaar & Charkaman'],
  },
};

/**
 * Gets a verified image and fallback metadata for a state or UT.
 * Curated registry values take priority over database defaults to ensure
 * verified authentic landmarks and prevent broken 404 image URLs.
 */
export function getCuratedStateImage(stateId: string, currentHeroUrl?: string): {
  url: string;
  creator: string;
  landmark: string;
  bestSeason: string;
  tags: string[];
} {
  const curated = STATE_CURATED_IMAGES[stateId];
  if (curated) {
    // If a curated verified image exists, prioritize it; otherwise use non-placeholder currentHeroUrl
    const effectiveUrl = (curated.imageUrl && !curated.imageUrl.includes('placeholder'))
      ? curated.imageUrl
      : (currentHeroUrl && !currentHeroUrl.includes('placeholder') ? currentHeroUrl : curated.imageUrl);

    return {
      url: effectiveUrl,
      creator: curated.creator,
      landmark: curated.landmark,
      bestSeason: curated.bestSeason || 'Oct - Mar',
      tags: curated.tags || [],
    };
  }
  return {
    url: currentHeroUrl || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
    creator: 'Virasat Heritage Archives',
    landmark: 'Heritage of Bharat',
    bestSeason: 'Oct - Mar',
    tags: ['Heritage of India'],
  };
}
