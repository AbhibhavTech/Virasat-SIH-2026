import fs from 'fs';
import path from 'path';

const sourceDir = 'data/ut_source';
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(sourceDir, file), 'utf8'));
  console.log(`\n========================================`);
  console.log(`FILE: ${file}`);
  console.log(`Top-level keys:`, Object.keys(content));
  const utName = content.state_or_union_territory || content.name || content.dataset_name;
  console.log(`UT Name:`, utName);
  const places = content.places || [];
  console.log(`Places count: ${places.length}`);
  if (places.length > 0) {
    console.log(`Sample place keys:`, Object.keys(places[0]));
    places.forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.id}] ${p.name} | cat: ${p.category} | area/locality: ${p.area || p.locality || p.city || p.district || ''}`);
    });
  }
}
