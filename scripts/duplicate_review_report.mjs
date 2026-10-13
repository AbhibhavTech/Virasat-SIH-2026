import fs from 'fs';
import path from 'path';

const raw = fs.readFileSync(path.resolve('data/source/indian_festivals_290.txt'), 'utf8');
const lines = raw.split(/\r?\n/);

let currentSection = '';
const entries = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  if (/^\d+\.\s+/.test(trimmed)) {
    currentSection = trimmed;
    continue;
  }
  if (
    trimmed.startsWith('No.') ||
    trimmed.startsWith('Indian Festivals List') ||
    trimmed.startsWith("India's official tourism") ||
    trimmed.startsWith('A Ministry of Tourism') ||
    trimmed === '+1'
  ) {
    continue;
  }
  const parts = trimmed.split('\t');
  if (parts.length >= 2 && /^\d+$/.test(parts[0].trim())) {
    const no = parseInt(parts[0].trim(), 10);
    const name = parts[1].trim();
    let state = '';
    let desc = '';
    if (currentSection.includes('9.')) {
      state = parts[2]?.trim() || '';
      desc = parts.slice(3).join('\t').trim();
    } else {
      desc = parts.slice(2).join('\t').trim();
    }
    entries.push({ no, name, state, desc, section: currentSection });
  }
}

// Function to find related clusters
const clusters = [];
const visited = new Set();

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

for (let i = 0; i < entries.length; i++) {
  if (visited.has(entries[i].no)) continue;
  const current = entries[i];
  const group = [current];

  for (let j = i + 1; j < entries.length; j++) {
    if (visited.has(entries[j].no)) continue;
    const target = entries[j];

    const cName = current.name.toLowerCase();
    const tName = target.name.toLowerCase();

    // Exact name match
    const exact = cName === tName;

    // Compound name match (e.g. "Ganesh Chaturthi / Ganesh Puja" vs "Ganesh Chaturthi")
    const compoundMatch = cName.split(/[\/\&,]/).map(s => s.trim()).includes(tName) ||
                          tName.split(/[\/\&,]/).map(s => s.trim()).includes(cName);

    // Stem / Substring match for known pairs
    const isPair = 
      (cName.includes('chhath') && tName.includes('chhath')) ||
      (cName.includes('govardhan') && tName.includes('govardhan')) ||
      (cName.includes('rann utsav') && tName.includes('rann utsav')) ||
      (cName.includes('sonepur') && tName.includes('sonepur')) ||
      (cName.includes('hornbill') && tName.includes('hornbill')) ||
      (cName.includes('surajkund') && tName.includes('surajkund')) ||
      (cName.includes('losar') && tName.includes('losar')) ||
      (cName.includes('guru purnima') && tName.includes('guru purnima')) ||
      (cName.includes('dussehra') && tName.includes('vijayadashami')) ||
      (cName.includes('ganesh') && (tName.includes('vinayaka') || tName.includes('ganesh'))) ||
      (cName.includes('bihu') && tName.includes('bihu'));

    if (exact || compoundMatch || isPair) {
      group.push(target);
      visited.add(target.no);
    }
  }

  if (group.length > 1) {
    visited.add(current.no);
    clusters.push(group);
  }
}

console.log(`Found ${clusters.length} duplicate/ambiguous clusters across ${entries.length} entries.`);

// Output markdown report
let md = `# Virasat Festival Source (290 Entries) – Duplicate & Ambiguity Review Report\n\n`;
md += `**Total Source Entries Parsed**: ${entries.length}\n`;
md += `**Total Ambiguity/Duplicate Clusters Identified**: ${clusters.length}\n\n`;
md += `| Cluster # | Primary Name | Entries Involved | Category & Sections | Recommended Action | Rationale |\n`;
md += `|---|---|---|---|---|---|\n`;

clusters.forEach((cl, idx) => {
  const ids = cl.map(e => `#${e.no} (${e.name})`).join('<br>');
  const secs = cl.map(e => `[${e.section}] ${e.state ? '(' + e.state + ')' : ''}`).join('<br>');
  
  // Decide recommended action
  const names = cl.map(e => e.name.toLowerCase());
  let action = 'Merge as Single Record with Aliases';
  let rationale = 'Identical festival tradition across multiple sections.';

  if (names.some(n => n.includes('music') || n.includes('winter') || n.includes('fair') || n.includes('mela')) &&
      names.some(n => !n.includes('music') && !n.includes('winter'))) {
    if (names.some(n => n.includes('hornbill music') || n.includes('hornbill winter'))) {
      action = 'Keep Distinct Sub-Events / Linked Editions';
      rationale = 'Specific festival sub-event/format (music showcase vs cultural tradition).';
    }
  } else if (names.some(n => n === 'bihu') && names.some(n => n.includes('bohag') || n.includes('magh') || n.includes('kati'))) {
    action = 'Keep Distinct Seasonal Editions (Bohag, Magh, Kati) & Parent Tradition (Bihu)';
    rationale = 'Bohag, Magh, and Kati are three distinct seasonal festivals occurring at different times of the year.';
  } else if (names.some(n => n.includes('sonepur cattle fair')) && names.some(n => n.includes('sonepur mela'))) {
    action = 'Merge as Single Master Festival with Aliases';
    rationale = 'Historic fair known interchangeably as Sonepur Mela and Sonepur Cattle Fair.';
  } else if (names.some(n => n.includes('rann utsav')) && names.some(n => n.includes('kutch rann utsav'))) {
    action = 'Merge as Single Master Festival with Aliases';
    rationale = 'Same annual 3-month desert festival in Dhordo, Kutch.';
  } else if (names.some(n => n.includes('surajkund'))) {
    action = 'Merge as Single Master Fair with Aliases';
    rationale = 'Annual international crafts fair in Faridabad/Surajkund, Haryana.';
  } else if (names.some(n => n.includes('losar'))) {
    action = 'Merge as Single Master Tibetan/Himalayan New Year with Multi-Region Links';
    rationale = 'Losar is the Tibetan/Buddhist New Year celebrated across Ladakh, Sikkim, and Arunachal Pradesh.';
  } else if (names.some(n => n.includes('chhath puja')) && names.some(n => n.includes('chhath mahaparv'))) {
    action = 'Merge as Single Master Festival with Aliases';
    rationale = 'Chhath Puja and Chhath Mahaparv refer to the same four-day Sun-worship festival in Bihar/Eastern India.';
  } else if (names.some(n => n.includes('govardhan puja')) && names.some(n => n.includes('annakut'))) {
    action = 'Merge as Single Master Festival with Aliases';
    rationale = 'Govardhan Puja and Annakut are synonymous celebrations observed on the day following Diwali.';
  }

  md += `| ${idx + 1} | **${cl[0].name}** | ${ids} | ${secs} | **${action}** | ${rationale} |\n`;
});

fs.writeFileSync(path.resolve('scripts/duplicate_review_report.md'), md);
console.log('Report saved to scripts/duplicate_review_report.md');
