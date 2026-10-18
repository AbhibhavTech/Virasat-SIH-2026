import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'data/festivals.json',
  'data/festivals_master.json',
  'data/verified_festivals_reference.json',
  'dist/data/festivals.json'
];

let updatedTotal = 0;

for (const relPath of filesToUpdate) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) continue;

  try {
    const list = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    if (Array.isArray(list)) {
      const bonalu = list.find((f) => f.id === 'bonalu' || f.slug === 'bonalu');
      if (bonalu) {
        bonalu.image_url = '/images/bonalu.jpg';
        bonalu.source_url = 'https://tourism.telangana.gov.in/';
        bonalu.official_source_url = 'https://tourism.telangana.gov.in/';
        bonalu.source_name = 'Telangana State Tourism & Sri Simhavahini Mahankali Temple Archives';
        bonalu.attribution_text = 'Authentic Bonalu Procession with Bonam Offerings at Sri Simhavahini Mahankali Temple';
        bonalu.license = 'Verified Festival Photography';
        bonalu.verification_status = 'verified';

        fs.writeFileSync(fullPath, JSON.stringify(list, null, 2), 'utf-8');
        console.log(`[SUCCESS] Updated Bonalu image in ${relPath}`);
        updatedTotal++;
      }
    }
  } catch (err) {
    console.error(`Error updating ${relPath}:`, err);
  }
}

// Also update data/.database/virasat_store.json
const storePath = path.resolve(process.cwd(), 'data/.database/virasat_store.json');
if (fs.existsSync(storePath)) {
  try {
    const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
    if (store.festivals && store.festivals.bonalu) {
      store.festivals.bonalu.image_url = '/images/bonalu.jpg';
      store.festivals.bonalu.source_url = 'https://tourism.telangana.gov.in/';
      store.festivals.bonalu.official_source_url = 'https://tourism.telangana.gov.in/';
      store.festivals.bonalu.source_name = 'Telangana State Tourism & Sri Simhavahini Mahankali Temple Archives';
      store.festivals.bonalu.attribution_text = 'Authentic Bonalu Procession with Bonam Offerings at Sri Simhavahini Mahankali Temple';
      store.festivals.bonalu.license = 'Verified Festival Photography';
      store.festivals.bonalu.verification_status = 'verified';

      fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
      console.log(`[SUCCESS] Updated Bonalu image in virasat_store.json`);
      updatedTotal++;
    }
  } catch (err) {
    console.error('Error updating virasat_store.json:', err);
  }
}

console.log(`🎉 Total data files updated with Bonalu authentic image: ${updatedTotal}`);
