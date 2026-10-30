import { StateDirectoryConfig } from '../types/masterStateDirectory';
import { ANDAMAN_DIRECTORY } from './andamanNicobarDirectory';
import { ANDHRA_PRADESH_DIRECTORY } from './andhraPradeshDirectory';
import { ARUNACHAL_PRADESH_DIRECTORY } from './arunachalPradeshDirectory';
import { ASSAM_DIRECTORY } from './assamDirectory';
import { BIHAR_DIRECTORY } from './biharDirectory';
import { CHANDIGARH_DIRECTORY } from './chandigarhDirectory';
import { CHHATTISGARH_DIRECTORY } from './chhattisgarhDirectory';
import { DAMAN_DIU_DIRECTORY } from './damanDiuDirectory';
import { DELHI_DIRECTORY } from './delhiDirectory';
import { GOA_DIRECTORY } from './goaDirectory';
import { GUJARAT_DIRECTORY } from './gujaratDirectory';
import { HARYANA_DIRECTORY } from './haryanaDirectory';
import { HIMACHAL_PRADESH_DIRECTORY } from './himachalPradeshDirectory';
import { JAMMU_KASHMIR_DIRECTORY } from './jammuKashmirDirectory';
import { JHARKHAND_DIRECTORY } from './jharkhandDirectory';
import { KARNATAKA_DIRECTORY } from './karnatakaDirectory';
import { KERALA_DIRECTORY } from './keralaDirectory';
import { LADAKH_DIRECTORY } from './ladakhDirectory';
import { LAKSHADWEEP_DIRECTORY } from './lakshadweepDirectory';
import { MADHYA_PRADESH_DIRECTORY } from './madhyaPradeshDirectory';
import { MAHARASHTRA_DIRECTORY } from './maharashtraDirectory';
import { MANIPUR_DIRECTORY } from './manipurDirectory';
import { MEGHALAYA_DIRECTORY } from './meghalayaDirectory';
import { MIZORAM_DIRECTORY } from './mizoramDirectory';
import { NAGALAND_DIRECTORY } from './nagalandDirectory';
import { ODISHA_DIRECTORY } from './odishaDirectory';
import { PUDUCHERRY_DIRECTORY } from './puducherryDirectory';
import { PUNJAB_DIRECTORY } from './punjabDirectory';
import { RAJASTHAN_DIRECTORY } from './rajasthanDirectory';
import { SIKKIM_DIRECTORY } from './sikkimDirectory';
import { TAMIL_NADU_DIRECTORY } from './tamilNaduDirectory';
import { TELANGANA_DIRECTORY } from './telanganaDirectory';
import { TRIPURA_DIRECTORY } from './tripuraDirectory';
import { UTTARAKHAND_DIRECTORY } from './uttarakhandDirectory';
import { UTTAR_PRADESH_DIRECTORY } from './uttarPradeshDirectory';
import { WEST_BENGAL_DIRECTORY } from './westBengalDirectory';

export const STATE_DIRECTORIES_MAP: Record<string, StateDirectoryConfig> = {
  // 1. Maharashtra
  maharashtra: {
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    stateCode: 'IN-MH-MASTER',
    title: 'Maharashtra Master Directory (IN-MH-MASTER)',
    regionalSubtitle: 'WESTERN GHATS, KONKAN COAST & DECCAN PLATEAU',
    cuisineLabel: 'Malvani, Parsi & Kolhapuri Flavors',
    unescoCount: '5 UNESCO Heritage Sites',
    cities: MAHARASHTRA_DIRECTORY as any,
  },

  // 2. Rajasthan
  rajasthan: {
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    stateCode: 'IN-RJ-MASTER',
    title: 'Rajasthan Master Directory (IN-RJ-MASTER)',
    regionalSubtitle: 'THAR DESERT, MEWAR & SHEKHAWATI',
    cuisineLabel: 'Dal Baati Churma, Ker Sangri & Laal Maas',
    unescoCount: '6 UNESCO Hill Forts & Citadels',
    cities: RAJASTHAN_DIRECTORY as any,
  },

  // 3. Uttar Pradesh
  'uttar-pradesh': {
    stateId: 'uttar-pradesh',
    stateName: 'Uttar Pradesh',
    stateCode: 'IN-UP-MASTER',
    title: 'Uttar Pradesh Master Directory (IN-UP-MASTER)',
    regionalSubtitle: 'GANGETIC PLAINS, AWADH & BRAJ BHOOMI',
    cuisineLabel: 'Awadhi Biryani, Chaat & Banarasi Paan',
    unescoCount: '3 UNESCO World Heritage Sites',
    cities: UTTAR_PRADESH_DIRECTORY as any,
  },

  // 4. Gujarat
  gujarat: {
    stateId: 'gujarat',
    stateName: 'Gujarat',
    stateCode: 'IN-GJ-MASTER',
    title: 'Gujarat Master Directory (IN-GJ-MASTER)',
    regionalSubtitle: 'WHITE RANN, SAURASHTRA & KATHIAWAR',
    cuisineLabel: 'Kathiyawadi Thali, Dhokla & Fafda Jalebi',
    unescoCount: '4 UNESCO World Heritage Sites',
    cities: GUJARAT_DIRECTORY as any,
  },

  // 5. Karnataka
  karnataka: {
    stateId: 'karnataka',
    stateName: 'Karnataka',
    stateCode: 'IN-KA-MASTER',
    title: 'Karnataka Master Directory (IN-KA-MASTER)',
    regionalSubtitle: 'DECCAN PLATEAU, MALNAD & COASTAL CANARA',
    cuisineLabel: 'Bisi Bele Bath, Mysore Pak & Mangalore Ghee Roast',
    unescoCount: '4 UNESCO World Heritage Sites',
    cities: KARNATAKA_DIRECTORY as any,
  },

  // 6. Tamil Nadu
  'tamil-nadu': {
    stateId: 'tamil-nadu',
    stateName: 'Tamil Nadu',
    stateCode: 'IN-TN-MASTER',
    title: 'Tamil Nadu Master Directory (IN-TN-MASTER)',
    regionalSubtitle: 'COROMANDEL COAST, NILGIRIS & KAVERI DELTA',
    cuisineLabel: 'Chettinad Cuisine, Masala Dosa & Filter Coffee',
    unescoCount: 'Great Living Chola Temples & Mahabalipuram (UNESCO)',
    cities: TAMIL_NADU_DIRECTORY as any,
  },

  // 7. Kerala
  kerala: {
    stateId: 'kerala',
    stateName: 'Kerala',
    stateCode: 'IN-KL-MASTER',
    title: 'Kerala Master Directory (IN-KL-MASTER)',
    regionalSubtitle: 'MALABAR COASTLINE & VEMBANAD BACKWATERS',
    cuisineLabel: 'Kerala Sadhya, Appam Stew & Karimeen Pollichathu',
    unescoCount: 'Western Ghats & Spice Coast Heritage',
    cities: KERALA_DIRECTORY as any,
  },

  // 8. Delhi
  delhi: {
    stateId: 'delhi',
    stateName: 'Delhi NCR',
    stateCode: 'IN-DL-MASTER',
    title: 'Delhi NCR Master Directory (IN-DL-MASTER)',
    regionalSubtitle: 'ARAVALLI RIDGE, YAMUNA BASIN & 7 HISTORIC CITIES',
    cuisineLabel: 'Old Delhi Nihari, Mughlai Korma & Chandni Chowk Chaat',
    unescoCount: '3 UNESCO World Heritage Sites',
    cities: DELHI_DIRECTORY as any,
  },

  // 9. West Bengal
  'west-bengal': {
    stateId: 'west-bengal',
    stateName: 'West Bengal',
    stateCode: 'IN-WB-MASTER',
    title: 'West Bengal Master Directory (IN-WB-MASTER)',
    regionalSubtitle: 'HOOGHLY DELTA, SUNDARBANS & DARJEELING HIMALAYAS',
    cuisineLabel: 'Kosha Mangsho, Shorshe Ilish & Mishti Doi',
    unescoCount: '3 UNESCO World Heritage Sites',
    cities: WEST_BENGAL_DIRECTORY as any,
  },

  // 10. Madhya Pradesh
  'madhya-pradesh': {
    stateId: 'madhya-pradesh',
    stateName: 'Madhya Pradesh',
    stateCode: 'IN-MP-MASTER',
    title: 'Madhya Pradesh Master Directory (IN-MP-MASTER)',
    regionalSubtitle: 'MALWA PLATEAU, NARMADA BASIN & VINDHYA RANGES',
    cuisineLabel: 'Dal Bafla, Poha Jalebi & Bhutte Ka Kees',
    unescoCount: '3 UNESCO World Heritage Sites',
    cities: MADHYA_PRADESH_DIRECTORY as any,
  },

  // 11. Goa
  goa: {
    stateId: 'goa',
    stateName: 'Goa',
    stateCode: 'IN-GA-MASTER',
    title: 'Goa Master Directory (IN-GA-MASTER)',
    regionalSubtitle: 'KONKAN SHORES, MANDOWI ESTUARY & ILHAS DE GOA',
    cuisineLabel: 'Goan Fish Curry, Pork Vindaloo & Bebinca',
    unescoCount: 'Churches & Convents of Old Goa (UNESCO)',
    cities: GOA_DIRECTORY as any,
  },

  // 12. Himachal Pradesh
  'himachal-pradesh': {
    stateId: 'himachal-pradesh',
    stateName: 'Himachal Pradesh',
    stateCode: 'IN-HP-MASTER',
    title: 'Himachal Pradesh Master Directory (IN-HP-MASTER)',
    regionalSubtitle: 'PIR PANJAL, DHAULADHAR & KANGRA VALLEY',
    cuisineLabel: 'Himachali Dham, Madra, Siddu & Babru',
    unescoCount: '2 UNESCO World Heritage Sites',
    cities: HIMACHAL_PRADESH_DIRECTORY as any,
  },

  // 13. Uttarakhand
  uttarakhand: {
    stateId: 'uttarakhand',
    stateName: 'Uttarakhand',
    stateCode: 'IN-UK-MASTER',
    title: 'Uttarakhand Master Directory (IN-UK-MASTER)',
    regionalSubtitle: 'GARHWAL & KUMAON HIMALAYAS, CHAR DHAM VALLEYS',
    cuisineLabel: 'Kafuli, Chainsoo, Aloo ke Gutke & Bal Mithai',
    unescoCount: 'Nanda Devi & Valley of Flowers (UNESCO)',
    cities: UTTARAKHAND_DIRECTORY as any,
  },

  // 14. Jammu & Kashmir
  'jammu-and-kashmir': {
    stateId: 'jammu-and-kashmir',
    stateName: 'Jammu & Kashmir',
    stateCode: 'IN-JK-MASTER',
    title: 'Jammu & Kashmir Master Directory (IN-JK-MASTER)',
    regionalSubtitle: 'KASHMIR VALLEY, JHELUM BASIN & SHIVALIK RIDGE',
    cuisineLabel: 'Royal Wazwan (Rogan Josh, Gushtaba) & Kahwa',
    unescoCount: 'Mughal Gardens of Kashmir & Hari Parbat Citadel',
    cities: JAMMU_KASHMIR_DIRECTORY as any,
  },

  // 15. Ladakh
  ladakh: {
    stateId: 'ladakh',
    stateName: 'Ladakh',
    stateCode: 'IN-LA-MASTER',
    title: 'Ladakh Master Directory (IN-LA-MASTER)',
    regionalSubtitle: 'TRANS-HIMALAYAN COLD DESERT & INDUS GORGES',
    cuisineLabel: 'Thukpa, Skyu, Butter Tea & Apricot Jam',
    unescoCount: 'Hemis & Thiksey Gompas Heritage Circuit',
    cities: LADAKH_DIRECTORY as any,
  },

  // 16. Punjab
  punjab: {
    stateId: 'punjab',
    stateName: 'Punjab',
    stateCode: 'IN-PB-MASTER',
    title: 'Punjab Master Directory (IN-PB-MASTER)',
    regionalSubtitle: 'LAND OF FIVE RIVERS, MAJHA & MALWA PLAINS',
    cuisineLabel: 'Makki di Roti, Sarson da Saag & Amritsari Kulcha',
    unescoCount: 'Sri Harmandir Sahib & Virasat-e-Khalsa Sanctum',
    cities: PUNJAB_DIRECTORY as any,
  },

  // 17. Haryana
  haryana: {
    stateId: 'haryana',
    stateName: 'Haryana',
    stateCode: 'IN-HR-MASTER',
    title: 'Haryana Master Directory (IN-HR-MASTER)',
    regionalSubtitle: 'KURUKSHETRA PLAINS & INDUS VALLEY HEARTLAND',
    cuisineLabel: 'Bajra Khichdi, Kadhi Pakora & Kachri Chutney',
    unescoCount: 'Rakhigarhi Harappan Civilizational Complex',
    cities: HARYANA_DIRECTORY as any,
  },

  // 18. Bihar
  bihar: {
    stateId: 'bihar',
    stateName: 'Bihar',
    stateCode: 'IN-BR-MASTER',
    title: 'Bihar Master Directory (IN-BR-MASTER)',
    regionalSubtitle: 'GANGETIC BASIN, MAGADH & MITHILA EMPIRE',
    cuisineLabel: 'Litti Chokha, Sattu Paratha & Silao Khaja',
    unescoCount: '2 UNESCO World Heritage Sites (Nalanda & Mahabodhi)',
    cities: BIHAR_DIRECTORY as any,
  },

  // 19. Odisha
  odisha: {
    stateId: 'odisha',
    stateName: 'Odisha',
    stateCode: 'IN-OD-MASTER',
    title: 'Odisha Master Directory (IN-OD-MASTER)',
    regionalSubtitle: 'KALINGA COAST, MAHANADI DELTA & SIMILIPAL',
    cuisineLabel: 'Puri Mahaprasad, Dalma & Chhena Poda',
    unescoCount: 'Konark Sun Temple (UNESCO) & Kalinga Shrines',
    cities: ODISHA_DIRECTORY as any,
  },

  // 20. Andhra Pradesh
  'andhra-pradesh': {
    stateId: 'andhra-pradesh',
    stateName: 'Andhra Pradesh',
    stateCode: 'IN-AP-MASTER',
    title: 'Andhra Pradesh Master Directory (IN-AP-MASTER)',
    regionalSubtitle: 'EASTERN GHATS, COROMANDEL & RAYALASEEMA',
    cuisineLabel: 'Guntur Gongura, Rayalaseema Ragi Mudde & Coastal Curries',
    unescoCount: 'Lepakshi Hanging Pillar & Buddhist Amaravati Arc',
    cities: ANDHRA_PRADESH_DIRECTORY as any,
  },

  // 21. Telangana
  telangana: {
    stateId: 'telangana',
    stateName: 'Telangana',
    stateCode: 'IN-TG-MASTER',
    title: 'Telangana Master Directory (IN-TG-MASTER)',
    regionalSubtitle: 'DECCAN GOLCONDA REGION & GODAVARI BASIN',
    cuisineLabel: 'Hyderabadi Dum Biryani, Haleem & Mirchi Ka Salan',
    unescoCount: 'Ramappa Temple (UNESCO) & Golconda Fort',
    cities: TELANGANA_DIRECTORY as any,
  },

  // 22. Assam
  assam: {
    stateId: 'assam',
    stateName: 'Assam',
    stateCode: 'IN-AS-MASTER',
    title: 'Assam Master Directory (IN-AS-MASTER)',
    regionalSubtitle: 'BRAHMAPUTRA VALLEY & TEA COUNTRY',
    cuisineLabel: 'Khaar, Masor Tenga & Joha Rice Delicacies',
    unescoCount: '2 UNESCO World Heritage Sites (Kaziranga & Manas)',
    cities: ASSAM_DIRECTORY as any,
  },

  // 23. Sikkim
  sikkim: {
    stateId: 'sikkim',
    stateName: 'Sikkim',
    stateCode: 'IN-SK-MASTER',
    title: 'Sikkim Master Directory (IN-SK-MASTER)',
    regionalSubtitle: 'KANGCHENJUNGA HIMALAYAS & TEESTA RIVER BASIN',
    cuisineLabel: 'Momos, Thukpa, Gundruk & Fermented Chhurpi',
    unescoCount: 'Khangchendzonga National Park (UNESCO Mixed Site)',
    cities: SIKKIM_DIRECTORY as any,
  },

  // 24. Meghalaya
  meghalaya: {
    stateId: 'meghalaya',
    stateName: 'Meghalaya',
    stateCode: 'IN-ML-MASTER',
    title: 'Meghalaya Master Directory (IN-ML-MASTER)',
    regionalSubtitle: 'KHASI & GARO CLOUD HIGHLANDS',
    cuisineLabel: 'Jadoh, Dohkhlieh & Bamboo Shoot Curries',
    unescoCount: 'Living Root Bridges Tentative UNESCO Sanctuary',
    cities: MEGHALAYA_DIRECTORY as any,
  },

  // 25. Arunachal Pradesh
  'arunachal-pradesh': {
    stateId: 'arunachal-pradesh',
    stateName: 'Arunachal Pradesh',
    stateCode: 'IN-AR-MASTER',
    title: 'Arunachal Pradesh Master Directory (IN-AR-MASTER)',
    regionalSubtitle: 'EASTERN HIMALAYAS & SIANG RIVER BASIN',
    cuisineLabel: 'Thukpa, Zan, Smoked Bamboo Shoot & Apong',
    unescoCount: 'Namdapha & Thembang Heritage Landscapes',
    cities: ARUNACHAL_PRADESH_DIRECTORY as any,
  },

  // 26. Nagaland
  nagaland: {
    stateId: 'nagaland',
    stateName: 'Nagaland',
    stateCode: 'IN-NL-MASTER',
    title: 'Nagaland Master Directory (IN-NL-MASTER)',
    regionalSubtitle: 'NAGA HILLS, DZUKOU VALLEY & SARAMATI PEAKS',
    cuisineLabel: 'Smoked Pork with Axone, Anishi & Raja Mircha',
    unescoCount: 'Dzukou Valley & Khonoma Eco-Heritage Haven',
    cities: NAGALAND_DIRECTORY as any,
  },

  // 27. Manipur
  manipur: {
    stateId: 'manipur',
    stateName: 'Manipur',
    stateCode: 'IN-MN-MASTER',
    title: 'Manipur Master Directory (IN-MN-MASTER)',
    regionalSubtitle: 'LOKTAK FLOATING LAKE & IMYONG VALLEYS',
    cuisineLabel: 'Kangshoi, Singju, Eromba & Chak-hao Black Rice',
    unescoCount: 'Keibul Lamjao Floating Sanctuary & Kangla Fort',
    cities: MANIPUR_DIRECTORY as any,
  },

  // 28. Mizoram
  mizoram: {
    stateId: 'mizoram',
    stateName: 'Mizoram',
    stateCode: 'IN-MZ-MASTER',
    title: 'Mizoram Master Directory (IN-MZ-MASTER)',
    regionalSubtitle: 'LUSHAI RANGES & BLUE MOUNTAIN VALLEYS',
    cuisineLabel: 'Bai, Vawksa Rep & Bamboo Shoot Delicacies',
    unescoCount: 'Phawngpui Blue Mountain Heritage Enclave',
    cities: MIZORAM_DIRECTORY as any,
  },

  // 29. Tripura
  tripura: {
    stateId: 'tripura',
    stateName: 'Tripura',
    stateCode: 'IN-TR-MASTER',
    title: 'Tripura Master Directory (IN-TR-MASTER)',
    regionalSubtitle: 'BOROMURA HILLS & ROYAL UJJAYANTA VALLEYS',
    cuisineLabel: 'Mui Borok, Berma, Bangui Rice & Godok',
    unescoCount: 'Unakoti Rock-Cut Reliefs (Tentative UNESCO)',
    cities: TRIPURA_DIRECTORY as any,
  },

  // 30. Jharkhand
  jharkhand: {
    stateId: 'jharkhand',
    stateName: 'Jharkhand',
    stateCode: 'IN-JH-MASTER',
    title: 'Jharkhand Master Directory (IN-JH-MASTER)',
    regionalSubtitle: 'CHOTA NAGPUR PLATEAU & PARASNATH PEAKS',
    cuisineLabel: 'Dhuska, Rugra Mushroom Curry & Arsa Roti',
    unescoCount: 'Parasnath Holy Tirth & Maluti Terracotta Shrines',
    cities: JHARKHAND_DIRECTORY as any,
  },

  // 31. Chhattisgarh
  chhattisgarh: {
    stateId: 'chhattisgarh',
    stateName: 'Chhattisgarh',
    stateCode: 'IN-CT-MASTER',
    title: 'Chhattisgarh Master Directory (IN-CT-MASTER)',
    regionalSubtitle: 'BASTAR PLATEAU, DANDAKARANYA & MAHANADI BASIN',
    cuisineLabel: 'Chila, Faraa, Angakar Roti & Bastar Savories',
    unescoCount: 'Kanger Valley & Sirpur Sacred Ensembles',
    cities: CHHATTISGARH_DIRECTORY as any,
  },

  // 32. Chandigarh
  chandigarh: {
    stateId: 'chandigarh',
    stateName: 'Chandigarh',
    stateCode: 'IN-CH-MASTER',
    title: 'Chandigarh Master Directory (IN-CH-MASTER)',
    regionalSubtitle: 'SHIVALIK FOOTHILLS & LE CORBUSIER PLANNED CAPITAL',
    cuisineLabel: 'Amritsari Kulcha, Dal Makhani & Sweet Lassi',
    unescoCount: '1 UNESCO Architectural Work (Capitol Complex)',
    cities: CHANDIGARH_DIRECTORY as any,
  },

  // 33. Puducherry
  puducherry: {
    stateId: 'puducherry',
    stateName: 'Puducherry',
    stateCode: 'IN-PY-MASTER',
    title: 'Puducherry Master Directory (IN-PY-MASTER)',
    regionalSubtitle: 'COROMANDEL FRENCH QUARTERS & AUROVILLE COASTLINE',
    cuisineLabel: 'Franco-Tamil Creole, Sourdough Bakes & Chettinad Seafood',
    unescoCount: 'Auroville Matrimandir & Heritage French Quarter',
    cities: PUDUCHERRY_DIRECTORY as any,
  },

  // 34. Dadra and Nagar Haveli and Daman and Diu
  'dadra-and-nagar-haveli-and-daman-and-diu': {
    stateId: 'dadra-and-nagar-haveli-and-daman-and-diu',
    stateName: 'Daman & Diu and Dadra & Nagar Haveli',
    stateCode: 'IN-DN-MASTER',
    title: 'Daman & Diu and Dadra & Nagar Haveli Directory (IN-DN-MASTER)',
    regionalSubtitle: 'ARABIAN SEA SHORELINE & PORTUGUESE CITADELS',
    cuisineLabel: 'Portuguese Seafood, Parsi Dhansak & Coastal Curries',
    unescoCount: 'St. Jerome Fort & Moti Daman Bastions',
    cities: DAMAN_DIU_DIRECTORY as any,
  },

  // 35. Andaman & Nicobar Islands
  'andaman-and-nicobar-islands': {
    stateId: 'andaman-and-nicobar-islands',
    stateName: 'Andaman & Nicobar Islands',
    stateCode: 'IN-AN-MASTER',
    title: 'Andaman & Nicobar Islands Master Directory (IN-AN-MASTER)',
    regionalSubtitle: 'BAY OF BENGAL & ANDAMAN SEA ARCHIPELAGO',
    cuisineLabel: 'Fresh Seafood, Coconut Curries & Coastal Tiffins',
    unescoCount: 'Cellular Jail & Great Nicobar Biosphere Reserve',
    cities: ANDAMAN_DIRECTORY as any,
  },

  // 36. Lakshadweep
  lakshadweep: {
    stateId: 'lakshadweep',
    stateName: 'Lakshadweep',
    stateCode: 'IN-LD-MASTER',
    title: 'Lakshadweep Master Directory (IN-LD-MASTER)',
    regionalSubtitle: 'CORAL ATOLLS & ARABIAN SEA LAGOONS',
    cuisineLabel: 'Mus Kavaab, Coconut Tuna Curry & Batla Pitha',
    unescoCount: 'Marine Coral Biosphere & Historic Minikoy Lighthouse',
    cities: LAKSHADWEEP_DIRECTORY as any,
  },
};

// Aliases for matching across various query formats
const ALIASES_MAP: Record<string, string> = {
  // JK
  'jammu-kashmir': 'jammu-and-kashmir',
  'jammu': 'jammu-and-kashmir',
  'kashmir': 'jammu-and-kashmir',
  'in-jk': 'jammu-and-kashmir',
  // Daman Diu
  'daman-diu': 'dadra-and-nagar-haveli-and-daman-and-diu',
  'daman': 'dadra-and-nagar-haveli-and-daman-and-diu',
  'diu': 'dadra-and-nagar-haveli-and-daman-and-diu',
  'dadra': 'dadra-and-nagar-haveli-and-daman-and-diu',
  'in-dn': 'dadra-and-nagar-haveli-and-daman-and-diu',
  'dnh-dd': 'dadra-and-nagar-haveli-and-daman-and-diu',
  // Andaman
  'andaman': 'andaman-and-nicobar-islands',
  'nicobar': 'andaman-and-nicobar-islands',
  'andaman-nicobar': 'andaman-and-nicobar-islands',
  'in-an': 'andaman-and-nicobar-islands',
  // Puducherry
  'pondicherry': 'puducherry',
  'in-py': 'puducherry',
  // Odisha
  'orissa': 'odisha',
  'in-od': 'odisha',
  'in-or': 'odisha',
  // Delhi
  'delhi-ncr': 'delhi',
  'new-delhi': 'delhi',
  'in-dl': 'delhi',
  // UP
  'up': 'uttar-pradesh',
  'in-up': 'uttar-pradesh',
  // MP
  'mp': 'madhya-pradesh',
  'in-mp': 'madhya-pradesh',
  // Maharashtra
  'mh': 'maharashtra',
  'in-mh': 'maharashtra',
  // AP
  'ap': 'andhra-pradesh',
  'in-ap': 'andhra-pradesh',
  // TN
  'tn': 'tamil-nadu',
  'in-tn': 'tamil-nadu',
  // KA
  'ka': 'karnataka',
  'in-ka': 'karnataka',
  // RJ
  'rj': 'rajasthan',
  'in-rj': 'rajasthan',
  // GJ
  'gj': 'gujarat',
  'in-gj': 'gujarat',
  // WB
  'wb': 'west-bengal',
  'in-wb': 'west-bengal',
  // HP
  'hp': 'himachal-pradesh',
  'in-hp': 'himachal-pradesh',
  // UK
  'uk': 'uttarakhand',
  'uttaranchal': 'uttarakhand',
  'in-uk': 'uttarakhand',
  // PB
  'pb': 'punjab',
  'in-pb': 'punjab',
  // HR
  'hr': 'haryana',
  'in-hr': 'haryana',
  // KL
  'kl': 'kerala',
  'in-kl': 'kerala',
  // GA
  'ga': 'goa',
  'in-ga': 'goa',
  // AS
  'as': 'assam',
  'in-as': 'assam',
  // BR
  'br': 'bihar',
  'in-br': 'bihar',
  // CT
  'ct': 'chhattisgarh',
  'cg': 'chhattisgarh',
  'in-ct': 'chhattisgarh',
  // JH
  'jh': 'jharkhand',
  'in-jh': 'jharkhand',
  // SK
  'sk': 'sikkim',
  'in-sk': 'sikkim',
  // TR
  'tr': 'tripura',
  'in-tr': 'tripura',
  // MN
  'mn': 'manipur',
  'in-mn': 'manipur',
  // MZ
  'mz': 'mizoram',
  'in-mz': 'mizoram',
  // NL
  'nl': 'nagaland',
  'in-nl': 'nagaland',
  // ML
  'ml': 'meghalaya',
  'in-ml': 'meghalaya',
  // AR
  'ar': 'arunachal-pradesh',
  'in-ar': 'arunachal-pradesh',
  // CH
  'ch': 'chandigarh',
  'in-ch': 'chandigarh',
  // LD
  'ld': 'lakshadweep',
  'in-ld': 'lakshadweep',
  // TG
  'tg': 'telangana',
  'ts': 'telangana',
  'in-tg': 'telangana',
};

export function getStateDirectoryConfig(stateKey?: string | null): StateDirectoryConfig | null {
  if (!stateKey) return null;
  const normalized = stateKey.trim().toLowerCase().replace(/\s+/g, '-');
  
  if (STATE_DIRECTORIES_MAP[normalized]) {
    return STATE_DIRECTORIES_MAP[normalized];
  }

  const aliasTarget = ALIASES_MAP[normalized];
  if (aliasTarget && STATE_DIRECTORIES_MAP[aliasTarget]) {
    return STATE_DIRECTORIES_MAP[aliasTarget];
  }

  // Substring match
  for (const [key, config] of Object.entries(STATE_DIRECTORIES_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return config;
    }
  }

  return null;
}
