import fs from 'fs';

const itdb = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));

const imageCounts = new Map();
for (const s of itdb.states) {
  if (s.hero_image_url) {
    imageCounts.set(s.hero_image_url, (imageCounts.get(s.hero_image_url) || 0) + 1);
  }
  if (s.cities) {
    for (const c of s.cities) {
      if (c.hero_image_url) {
        imageCounts.set(c.hero_image_url, (imageCounts.get(c.hero_image_url) || 0) + 1);
      }
    }
  }
}

console.log('Unique images count in itdb:', imageCounts.size);
for (const [url, count] of imageCounts.entries()) {
  if (count > 2) {
    console.log(`Reused ${count} times: ${url}`);
  }
}
