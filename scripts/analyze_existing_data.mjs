import fs from 'fs';
import path from 'path';

const requiredGeographicSeed = {
  "Andhra Pradesh": [
    "Amaravati", "Anantapur", "Chittoor", "Guntur", "Kakinada", "Kurnool", "Machilipatnam", "Nellore", "Rajahmundry", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram"
  ],
  "Arunachal Pradesh": [
    "Bomdila", "Changlang", "Dirang", "Itanagar", "Mechuka", "Namsai", "Pakke Kesang Hill Station", "Pasighat", "Roing", "Tawang", "Yingkiong", "Ziro"
  ],
  "Assam": [
    "Chirang", "Dibrugarh", "Guwahati", "Jorhat", "Majuli", "Sivasagar", "Tezpur", "Tinsukia", "Umrangso"
  ],
  "Bihar": [
    "Arrah", "Gaya", "Nalanda", "Patna"
  ],
  "Chhattisgarh": [
    "Bilaspur", "Dantewada", "Jagdalpur", "Raipur", "Rajnandgaon"
  ],
  "Goa": [
    "Goa"
  ],
  "Gujarat": [
    "Ahmedabad", "Balasinor", "Bhavnagar", "Bhuj", "Champaner", "Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Patan", "Porbandar", "Rajkot", "Surat", "Vadnagar", "Vadodara", "Valsad"
  ],
  "Haryana": [
    "Faridabad", "Gurugram", "Hisar", "Kurukshetra", "Panipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Dalhousie", "Dharamshala", "Kangra", "Kasauli", "Keylong", "Kullu", "Manali", "Paonta Sahib", "Shimla", "Spiti Valley", "Reckong Peo"
  ],
  "Jharkhand": [
    "Deoghar", "Jamshedpur", "Ranchi"
  ],
  "Karnataka": [
    "Badami", "Bagalkote", "Belagavi", "Bengaluru", "Bidar", "Dharwad", "Gokarna", "Hampi", "Kalaburagi", "Lakkundi", "Mangalore", "Mysuru", "Somnathpura", "Udupi", "Vijayapura"
  ],
  "Kerala": [
    "Alappuzha", "Bekal", "Kannur", "Kasargod", "Kochi", "Kollam", "Kottayam", "Kovalam", "Kozhikode", "Kumarakom", "Malappuram", "Munnar", "Palakkad", "Pathanamthitta", "Sabrimala", "Thiruvananthapuram", "Thrissur", "Varkala", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Anuppur", "Bhopal", "Chanderi", "Chitrakoot", "Datia", "Gwalior", "Indore", "Jabalpur", "Khajuraho", "Mandsaur", "Morena", "Orchha", "Pachmarhi", "Sanchi", "Ujjain"
  ],
  "Maharashtra": [
    "Amravati", "Chhatrapati Sambhaji Nagar", "Igatpuri", "Jalgaon", "Kolhapur", "Mahabaleshwar", "Mumbai", "Nagpur", "Nashik", "Pune", "Satara"
  ],
  "Manipur": [
    "Imphal"
  ],
  "Meghalaya": [
    "Cherrapunjee", "Shillong"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Lunglei", "Serchhip"
  ],
  "Nagaland": [
    "Dimapur", "Kohima", "Mokokchung"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Koraput", "Mayurbhanj", "Puri"
  ],
  "Punjab": [
    "Amritsar", "Fatehgarh Sahib", "Fazilka", "Firozepur", "Gurdaspur", "Jalandhar", "Kapurthala", "Ludhiana", "Pathankot", "Patiala", "Rupnagar", "SAS Nagar"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Bharatpur", "Bikaner", "Bundi", "Chittorgarh", "Dausa", "Dholpur", "Jaipur", "Jaisalmer", "Jodhpur", "Kota", "Mount Abu", "Udaipur"
  ],
  "Sikkim": [
    "Gangtok", "Mangan", "Pelling"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Kanchipuram", "Kanniyakumari", "Madurai", "Mamallapuram", "Ooty", "Rameswaram", "Thanjavur", "Tiruchirappalli"
  ],
  "Telangana": [
    "Bhongir", "Hyderabad", "Karimnagar", "Khammam", "Warangal"
  ],
  "Tripura": [
    "Agartala", "Unakoti"
  ],
  "Uttar Pradesh": [
    "Agra", "Ayodhya", "Bareilly", "Chitrakoot", "Jhansi", "Kanpur", "Lucknow", "Mathura", "Prayagraj", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Badrinath", "Berinag", "Bhimtal", "Chamoli", "Dehradun", "Gangotri", "Haridwar", "Kausani", "Kedarnath", "Lansdowne", "Mussoorie", "Nainital", "New Tehri", "Pithoragarh", "Rishikesh", "Uttarkashi"
  ],
  "West Bengal": [
    "Darjeeling", "Durgapur", "Howrah", "Kalimpong", "Kolkata", "Siliguri"
  ],
  "Andaman and Nicobar Islands": [
    "Mayabunder", "Rangat", "Sri Vijaya Puram"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman", "Diu", "Silvassa"
  ],
  "Delhi": [
    "Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Gulmarg", "Jammu", "Pahalgam", "Patnitop", "Srinagar"
  ],
  "Ladakh": [
    "Kargil", "Leh"
  ],
  "Lakshadweep": [
    "Kavaratti"
  ],
  "Puducherry": [
    "Puducherry"
  ]
};

const stateRegions = {
  "Chandigarh": "Northern India",
  "Delhi": "Northern India",
  "Haryana": "Northern India",
  "Himachal Pradesh": "Northern India",
  "Jammu and Kashmir": "Northern India",
  "Ladakh": "Northern India",
  "Punjab": "Northern India",
  "Rajasthan": "Northern India",
  "Uttar Pradesh": "Northern India",
  "Uttarakhand": "Northern India",

  "Arunachal Pradesh": "Northeastern India",
  "Assam": "Northeastern India",
  "Manipur": "Northeastern India",
  "Meghalaya": "Northeastern India",
  "Mizoram": "Northeastern India",
  "Nagaland": "Northeastern India",
  "Sikkim": "Northeastern India",
  "Tripura": "Northeastern India",

  "Andaman and Nicobar Islands": "Eastern India",
  "Bihar": "Eastern India",
  "Jharkhand": "Eastern India",
  "Odisha": "Eastern India",
  "West Bengal": "Eastern India",

  "Chhattisgarh": "Central India",
  "Madhya Pradesh": "Central India",

  "Dadra and Nagar Haveli and Daman and Diu": "Western India",
  "Goa": "Western India",
  "Gujarat": "Western India",
  "Maharashtra": "Western India",

  "Andhra Pradesh": "Southern India",
  "Karnataka": "Southern India",
  "Kerala": "Southern India",
  "Lakshadweep": "Southern India",
  "Puducherry": "Southern India",
  "Tamil Nadu": "Southern India",
  "Telangana": "Southern India"
};

console.log('Total States/UTs in Seed:', Object.keys(requiredGeographicSeed).length);
const totalRequiredCities = Object.values(requiredGeographicSeed).reduce((acc, c) => acc + c.length, 0);
console.log('Total Required Cities in Seed:', totalRequiredCities);

// Read current database files
const itdb = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));
const oldCities = JSON.parse(fs.readFileSync('data/cities.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/.database/virasat_store.json', 'utf8'));

// Find all existing cities across itdb
const itdbCities = [];
for (const s of itdb.states) {
  if (s.cities) {
    for (const c of s.cities) {
      itdbCities.push({ ...c, state_name: s.name, state_id: s.id });
    }
  }
}
console.log('Existing ITDB cities count:', itdbCities.length);

// Compare ITDB cities with required list
const matched = [];
const unmatchedOld = [];
const missingRequired = [];

const norm = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

for (const [stateName, reqCities] of Object.entries(requiredGeographicSeed)) {
  for (const rc of reqCities) {
    const rcNorm = norm(rc);
    const found = itdbCities.find(c => norm(c.name) === rcNorm || norm(c.id) === rcNorm);
    if (found) {
      matched.push({ reqCity: rc, state: stateName, foundCityId: found.id, foundCityName: found.name, foundState: found.state_name });
    } else {
      missingRequired.push({ reqCity: rc, state: stateName });
    }
  }
}

console.log(`Matched existing ITDB cities to Required Seed: ${matched.length}`);
console.log(`Required Seed cities missing from ITDB: ${missingRequired.length}`);

// Check which old ITDB cities were not directly matched
for (const c of itdbCities) {
  const cNorm = norm(c.name);
  const found = matched.find(m => norm(m.foundCityName) === cNorm || norm(m.foundCityId) === norm(c.id));
  if (!found) {
    unmatchedOld.push({ id: c.id, name: c.name, state: c.state_name });
  }
}
console.log(`Existing ITDB cities not in Required Seed list: ${unmatchedOld.length}`);
console.log('Sample unmatched old ITDB cities:', unmatchedOld.slice(0, 20));
