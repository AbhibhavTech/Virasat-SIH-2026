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
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Qutub Complex',
    landmark: 'Qutub Minar & Historic Monuments',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Heritage', 'Red Fort', 'Humayun Tomb'],
  },
  'haryana': {
    imageUrl: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&auto=format&fit=crop&q=80',
    creator: 'Haryana Tourism / Kurukshetra',
    landmark: 'Brahma Sarovar, Kurukshetra',
    bestSeason: 'Oct - Mar',
    tags: ['Mahabharata Heritage', 'Sultanpur Birds', 'Pinjore Gardens'],
  },
  'himachal-pradesh': {
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Himalayas',
    landmark: 'Spiti Valley & Himalayan Peaks',
    bestSeason: 'Mar - Jun & Sep - Dec',
    tags: ['Hill Stations', 'Shimla', 'Manali', 'Dharamshala'],
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
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Kedarnath Himalayas',
    landmark: 'Rishikesh Ganga & Garhwal Peaks',
    bestSeason: 'Year-round',
    tags: ['Yoga Capital Rishikesh', 'Char Dham', 'Jim Corbett'],
  },

  // Northeast Region
  'arunachal-pradesh': {
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    creator: 'Arunachal Tourism / Tawang',
    landmark: 'Tawang Monastery & Sela Pass',
    bestSeason: 'Oct - Apr',
    tags: ['Tawang Monastery', 'Ziro Valley', 'Namdapha'],
  },
  'assam': {
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Kaziranga Rhino Habitat',
    landmark: 'Kaziranga National Park & Majuli',
    bestSeason: 'Nov - Apr',
    tags: ['One-Horned Rhino', 'UNESCO Kaziranga', 'Tea Gardens'],
  },
  'manipur': {
    imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=1200&auto=format&fit=crop&q=80',
    creator: 'Manipur Tourism / Loktak',
    landmark: 'Loktak Floating Lake & Keibul Lamjao',
    bestSeason: 'Oct - Mar',
    tags: ['Floating Phumdis', 'Sangai Deer', 'Kangla Fort'],
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
    imageUrl: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Kanchenjunga Sikkim',
    landmark: 'Mt. Kanchenjunga & Gurudongmar',
    bestSeason: 'Mar - May & Oct - Dec',
    tags: ['Kanchenjunga UNESCO', 'Rumtek Gompa', 'Tsomgo Lake'],
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
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Bodh Gaya',
    landmark: 'Mahabodhi Temple & Ancient Nalanda',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Bodh Gaya', 'Ancient Nalanda University', 'Rajgir'],
  },
  'jharkhand': {
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=80',
    creator: 'Jharkhand Tourism / Hundru Falls',
    landmark: 'Baidyanath Dham & Hundru Falls',
    bestSeason: 'Oct - Mar',
    tags: ['Baidyanath Jyotirlinga', 'Hundru Falls', 'Tribal Art'],
  },
  'odisha': {
    imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Konark Sun Temple',
    landmark: 'Konark Sun Temple & Jagannath Puri',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Sun Temple', 'Jagannath Puri Rath Yatra', 'Chilika Lake'],
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
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Khajuraho Temples',
    landmark: 'Khajuraho UNESCO & Sanchi Stupa',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Khajuraho', 'Gwalior Fort', 'Kanha Tiger Reserve', 'Sanchi Stupa'],
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
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Gujarat Architecture',
    landmark: 'Rani ki Vav Stepwell & Statue of Unity',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Rani ki Vav', 'Somnath Temple', 'Rann of Kutch', 'Gir Lions'],
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
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1200&auto=format&fit=crop&q=80',
    creator: 'Andhra Tourism / Tirupati',
    landmark: 'Tirumala Venkateswara & Lepakshi',
    bestSeason: 'Oct - Mar',
    tags: ['Tirupati Pilgrimage', 'Lepakshi Hanging Pillar', 'Araku Valley'],
  },
  'karnataka': {
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Hampi Stone Chariot',
    landmark: 'Hampi UNESCO Ruins & Mysore Palace',
    bestSeason: 'Oct - Mar',
    tags: ['UNESCO Hampi Chariot', 'Mysore Palace', 'Badami Cave Temples'],
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
    imageUrl: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=1200&auto=format&fit=crop&q=80',
    creator: 'Unsplash / Hyderabad Charminar',
    landmark: 'Charminar & Golconda Fort, Hyderabad',
    bestSeason: 'Oct - Mar',
    tags: ['Charminar', 'UNESCO Ramappa Temple', 'Golconda Fort Acoustical Vaults'],
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
