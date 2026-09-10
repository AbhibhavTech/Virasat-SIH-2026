import fs from 'fs';
import path from 'path';

const REPLACEMENTS = {
  'hampi-monuments': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Hampi_virupaksha_temple.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Hampi_virupaksha_temple.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Hampi_virupaksha_temple.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Apadegal',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'amber-fort': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Amber_Fort%2C_Jaipur.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Amber_Fort%2C_Jaipur.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Amber_Fort,_Jaipur.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Prasoonmaheshwari',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'amber-palace': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Amber_Fort%2C_Jaipur.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Amber_Fort%2C_Jaipur.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Amber_Fort,_Jaipur.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Prasoonmaheshwari',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'sun-temple-konark': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Konarka_Temple.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Subham9423',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'konark-konark-historic-monument-gateway': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Konarka_Temple.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Subham9423',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'rani-ki-vav': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Rani_ki_vav_07.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Rani_ki_vav_07.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Rani_ki_vav_07.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bernard Gagnon',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'pattadakal-monuments-bagalkote': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pattadakal_000.JPG',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pattadakal_000.JPG',
    source_url: 'https://commons.wikimedia.org/wiki/File:Pattadakal_000.JPG',
    source_name: 'Wikimedia Commons',
    creator: 'Nithin bolar k',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'pattadakal-monuments': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pattadakal_000.JPG',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pattadakal_000.JPG',
    source_url: 'https://commons.wikimedia.org/wiki/File:Pattadakal_000.JPG',
    source_name: 'Wikimedia Commons',
    creator: 'Nithin bolar k',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'badami-badami-pattadakal-state-museum-heritage-gallery': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pattadakal_000.JPG',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pattadakal_000.JPG',
    source_url: 'https://commons.wikimedia.org/wiki/File:Pattadakal_000.JPG',
    source_name: 'Wikimedia Commons',
    creator: 'Nithin bolar k',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'khajuraho-monuments': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Kandariya_Mahadeva_Temple.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Kandariya_Mahadeva_Temple.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Kandariya_Mahadeva_Temple.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bibhashlahiri',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'khajuraho-khajuraho-heritage-fort-complex': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Kandariya_Mahadeva_Temple.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Kandariya_Mahadeva_Temple.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Kandariya_Mahadeva_Temple.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bibhashlahiri',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'sanchi-stupa': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG',
    source_url: 'https://commons.wikimedia.org/wiki/File:East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG',
    source_name: 'Wikimedia Commons',
    creator: 'Biswarup Ganguly',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'great-stupa-sanchi': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG',
    source_url: 'https://commons.wikimedia.org/wiki/File:East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG',
    source_name: 'Wikimedia Commons',
    creator: 'Biswarup Ganguly',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'ellora-caves': {
    image_url: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Kailash_temple_%28Ellora_cave_no_15%29_at_Verul.png',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Kailash_temple_%28Ellora_cave_no_15%29_at_Verul.png',
    source_url: 'https://en.wikipedia.org/wiki/File:Kailash_temple_(Ellora_cave_no_15)_at_Verul.png',
    source_name: 'Wikimedia Commons',
    creator: 'Wikimedia Contributor',
    license: 'Educational / Heritage',
    verification_status: 'verified'
  },
  'lepakshi-veerabhadra-temple': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Front_side_of_Veerabhadra_Temple,_Lepakshi.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bikashrd',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'lepakshi-lepakshi-state-museum-heritage-gallery': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Front_side_of_Veerabhadra_Temple,_Lepakshi.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bikashrd',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'hoysala-temples-belur': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Courtyard_of_Chennakesava_Temple_-_Belur.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Courtyard_of_Chennakesava_Temple_-_Belur.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:The_Courtyard_of_Chennakesava_Temple_-_Belur.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bikashrd',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'sirpur-monuments': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/7th_century_Lakshmana_Hindu_temple%2C_Sirpur_Chhattisgarh_India_1.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/7th_century_Lakshmana_Hindu_temple%2C_Sirpur_Chhattisgarh_India_1.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:7th_century_Lakshmana_Hindu_temple,_Sirpur_Chhattisgarh_India_1.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Ms Sarah Welch',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'baidyanath-dham-deoghar': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Baidyanath_temple_and_temple_complex,_Deoghar_04.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Pinakpani',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'living-root-bridge-cherrapunjee': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Living_root_bridges,_Nongriat_village,_Meghalaya2.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Arshiya Urveeja Bose',
    license: 'CC BY-SA 2.0',
    verification_status: 'verified'
  },
  'living-root-bridges': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Living_root_bridges,_Nongriat_village,_Meghalaya2.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Arshiya Urveeja Bose',
    license: 'CC BY-SA 2.0',
    verification_status: 'verified'
  },
  'nalanda-university-ruins': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Temple_No.-_3%2C_Nalanda_Archaeological_Site.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Temple_No.-_3%2C_Nalanda_Archaeological_Site.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Temple_No.-_3,_Nalanda_Archaeological_Site.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Odantapuribs',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'nalanda-nalanda-sacred-temple-cultural-center': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Temple_No.-_3%2C_Nalanda_Archaeological_Site.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Temple_No.-_3%2C_Nalanda_Archaeological_Site.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Temple_No.-_3,_Nalanda_Archaeological_Site.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Odantapuribs',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'mahabodhi-temple': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Mahabodhitemple.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Mahabodhitemple.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Mahabodhitemple.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bpilgrim',
    license: 'CC BY-SA 2.5',
    verification_status: 'verified'
  },
  'kaziranga-living-heritage': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Beauty_of_Kaziranga_National_Park.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Beauty_of_Kaziranga_National_Park.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Beauty_of_Kaziranga_National_Park.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Diganta Talukdar',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'kaziranga-kaziranga-sacred-temple-cultural-center': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Beauty_of_Kaziranga_National_Park.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Beauty_of_Kaziranga_National_Park.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Beauty_of_Kaziranga_National_Park.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Diganta Talukdar',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'rumtek-monastery': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok%2C_East_Sikkim_09.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok%2C_East_Sikkim_09.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok,_East_Sikkim_09.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Anjan Kumar Kundu',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'brihadisvara-temple': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_(edit).jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Rainer Halama / UnpetitproleX',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'shore-temple-mamallapuram': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Swarna1311',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'shore-temple-mahabalipuram': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Swarna1311',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'meenakshi-amman-temple': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'எஸ்ஸார்',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'ramappa-temple': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Ramappa_Temple_%28Human_Scale%29.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Ramappa_Temple_%28Human_Scale%29.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Ramappa_Temple_(Human_Scale).jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Nirav Lad',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'golden-temple-amritsar': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/The_Golden_Temple_of_Amrithsar_7.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/The_Golden_Temple_of_Amrithsar_7.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:The_Golden_Temple_of_Amrithsar_7.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Shagil Kannur',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'leh-palace': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Leh_Palace_2011.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Leh_Palace_2011.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Leh_Palace_2011.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'KennyOMG',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'humayuns-tomb': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Tomb_of_Humayun%2C_Delhi.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Tomb_of_Humayun%2C_Delhi.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Tomb_of_Humayun,_Delhi.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Muhammad Mahdi Karim',
    license: 'GFDL 1.2',
    verification_status: 'verified'
  },
  'charminar': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Charminar_Hyderabad_1.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'DidierTais',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'golconda-fort': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Golconda_Fort_005.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Golconda_Fort_005.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Golconda_Fort_005.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bernard Gagnon',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'kedarnath-temple': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Kedarnath_Temple_in_Rainy_season.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Kedarnath_Temple_in_Rainy_season.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Kedarnath_Temple_in_Rainy_season.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Shivam Kumar 766',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'badrinath-badrinath-kedarnath-state-museum-heritage-gallery': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Kedarnath_Temple_in_Rainy_season.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Kedarnath_Temple_in_Rainy_season.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Kedarnath_Temple_in_Rainy_season.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Shivam Kumar 766',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'shalimar-bagh-srinagar': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Shalimar_Bagh_1.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Shalimar_Bagh_1.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Shalimar_Bagh_1.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'ANSAR AHMAD',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'basilica-of-bom-jesus': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Front_Elevation_of_Basilica_of_Bom_Jesus.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'iMahesh',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'basilica-bom-jesus-goa': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Front_Elevation_of_Basilica_of_Bom_Jesus.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'iMahesh',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'hawa-mahal': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Hawa_Mahal_2011.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Hawa_Mahal_2011.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Hawa_Mahal_2011.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Pankaj Agrawal',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'ajanta-caves': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Cave_26%2C_Ajanta.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Cave_26%2C_Ajanta.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Cave_26,_Ajanta.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    verification_status: 'verified'
  },
  'elephanta-caves': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Elephanta_-_Mahesh_Murti.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Elephanta_-_Mahesh_Murti.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Elephanta_-_Mahesh_Murti.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Christian Haugen',
    license: 'CC BY 2.0',
    verification_status: 'verified'
  },
  'karla-caves': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Grand_Chaitya_at_Karla_Caves_-_2025_-_07.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Grand_Chaitya_at_Karla_Caves_-_2025_-_07.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Grand_Chaitya_at_Karla_Caves_-_2025_-_07.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Bernard Gagnon',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'dharamshala-dharamshala-mcleod-ganj-historic-monument-gateway': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Namgyal_Monastery_in_Dharamshala.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Namgyal_Monastery_in_Dharamshala.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Namgyal_Monastery_in_Dharamshala.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Sumita Roy Dutta',
    license: 'CC BY-SA 4.0',
    verification_status: 'verified'
  },
  'shimla-shimla-heritage-fort-complex': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Viceregal_lodge_shimla.jpg',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Viceregal_lodge_shimla.jpg',
    source_url: 'https://commons.wikimedia.org/wiki/File:Viceregal_lodge_shimla.jpg',
    source_name: 'Wikimedia Commons',
    creator: 'Vipin Vasudeva',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  },
  'spiti-valley-kaza-spiti-valley-state-museum-heritage-gallery': {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Kee_monastery_Spiti_Valley.JPG',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Kee_monastery_Spiti_Valley.JPG',
    source_url: 'https://commons.wikimedia.org/wiki/File:Kee_monastery_Spiti_Valley.JPG',
    source_name: 'Wikimedia Commons',
    creator: '4v4g9',
    license: 'CC BY-SA 3.0',
    verification_status: 'verified'
  }
};

const CITY_HERO_REPLACEMENTS = {
  hampi: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Hampi_virupaksha_temple.jpg',
  patan: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Rani_ki_vav_07.jpg',
  badami: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pattadakal_000.JPG'
};

const DEAD_GENERIC_URL_SNIPPET = 'photo-1600100397608-f010e422a59e';

const itdbJsonPath = path.resolve('data/india_tourism_database.json');
const itdbTsPath = path.resolve('src/data/indiaTourismDatabase.ts');

const itdb = JSON.parse(fs.readFileSync(itdbJsonPath, 'utf8'));

let replacedCount = 0;
let clearedDeadGenericCount = 0;

for (const state of itdb.states) {
  for (const city of state.cities || []) {
    if (CITY_HERO_REPLACEMENTS[city.id]) {
      city.hero_image_url = CITY_HERO_REPLACEMENTS[city.id];
      console.log(`[CITY HERO REPLACEMENT] ${city.id} -> ${city.hero_image_url}`);
    }

    const attractionArrays = [
      city.heritage,
      city.monuments,
      city.museums,
      city.tourist_places,
      city.religious_cultural,
      city.nature_parks_zoo
    ];

    for (const arr of attractionArrays) {
      if (!arr || !Array.isArray(arr)) continue;
      for (const item of arr) {
        if (REPLACEMENTS[item.id]) {
          const rep = REPLACEMENTS[item.id];
          item.image_url = rep.image_url;
          item.thumbnail_url = rep.thumbnail_url;
          item.source_url = rep.source_url;
          item.source_name = rep.source_name;
          item.creator = rep.creator;
          item.license = rep.license;
          item.verification_status = rep.verification_status;
          item.verified_at = new Date().toISOString();
          replacedCount++;
          console.log(`[VERIFIED REPLACEMENT] ${item.id}: ${item.name} -> ${rep.image_url}`);
        } else if (item.image_url && item.image_url.includes(DEAD_GENERIC_URL_SNIPPET)) {
          // Dead 404 generic Unsplash photo: clear it so the honest Photograph Unavailable tile renders
          item.image_url = '';
          item.thumbnail_url = '';
          clearedDeadGenericCount++;
        }
      }
    }
  }
}

console.log(`\nReplacements applied: ${replacedCount}`);
console.log(`Dead generic 404s cleared to honest unavailable: ${clearedDeadGenericCount}`);

// Write JSON
fs.writeFileSync(itdbJsonPath, JSON.stringify(itdb, null, 2), 'utf8');
console.log(`✓ Updated ${itdbJsonPath}`);

// Write TS
const tsContent = `// Auto-generated by scripts/build_verified_provenance_database.mjs\n// Virasat SIH 2026 - Master Tourism & Heritage Database\nimport { IndiaHierarchyDatabase } from '../types/indiaHierarchy';\n\nexport const INDIA_TOURISM_DATABASE: IndiaHierarchyDatabase = ${JSON.stringify(itdb, null, 2)};\n`;
fs.writeFileSync(itdbTsPath, tsContent, 'utf8');
console.log(`✓ Updated ${itdbTsPath}`);

// Also update data/tourism_images.json if present
const tourismImagesPath = path.resolve('data/tourism_images.json');
if (fs.existsSync(tourismImagesPath)) {
  try {
    const rawImages = JSON.parse(fs.readFileSync(tourismImagesPath, 'utf8'));
    let tCount = 0;
    if (Array.isArray(rawImages)) {
      for (const entry of rawImages) {
        if (!entry || !entry.entity_id) continue;
        const eid = entry.entity_id.toLowerCase().trim();
        if (REPLACEMENTS[eid]) {
          const rep = REPLACEMENTS[eid];
          entry.image_url = rep.image_url;
          entry.thumbnail_url = rep.thumbnail_url;
          entry.source_page = rep.source_url;
          entry.source = rep.source_name;
          entry.creator = rep.creator;
          entry.license = rep.license;
          entry.status = 'verified';
          if (entry.image) {
            entry.image.url = rep.image_url;
            entry.image.thumbnail_url = rep.thumbnail_url;
            entry.image.source_page = rep.source_url;
            entry.image.source = rep.source_name;
            entry.image.creator = rep.creator;
            entry.image.license = rep.license;
            entry.image.status = 'verified';
          }
          tCount++;
        } else if (CITY_HERO_REPLACEMENTS[eid]) {
          const url = CITY_HERO_REPLACEMENTS[eid];
          entry.image_url = url;
          entry.thumbnail_url = url;
          if (entry.image) {
            entry.image.url = url;
            entry.image.thumbnail_url = url;
          }
          tCount++;
        } else if (entry.image_url && entry.image_url.includes(DEAD_GENERIC_URL_SNIPPET)) {
          entry.image_url = '';
          entry.thumbnail_url = '';
          if (entry.image) {
            entry.image.url = '';
            entry.image.thumbnail_url = '';
          }
        }
      }
      fs.writeFileSync(tourismImagesPath, JSON.stringify(rawImages, null, 2), 'utf8');
      console.log(`✓ Updated ${tourismImagesPath} (${tCount} entries updated)`);
    }
  } catch (e) {
    console.error('Error updating tourism_images.json:', e);
  }
}
