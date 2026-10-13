import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/source/indian_festivals_290.txt');
console.log('Checking file:', filePath);
if (!fs.existsSync(filePath)) {
  console.error('File does NOT exist!');
  process.exit(1);
}

const stat = fs.statSync(filePath);
console.log('File size:', stat.size, 'bytes');

const raw = fs.readFileSync(filePath, 'utf8');
const lines = raw.split(/\r?\n/);
console.log('Total lines:', lines.length);

let currentSection = '';
const parsed = [];
const skipped = [];
const errors = [];

lines.forEach((line, idx) => {
  const lineNo = idx + 1;
  const trimmed = line.trim();
  if (!trimmed) return;
  if (/^\d+\.\s+/.test(trimmed)) {
    currentSection = trimmed;
    return;
  }
  if (
    trimmed.startsWith('No.') ||
    trimmed.startsWith('Indian Festivals List') ||
    trimmed.startsWith("India's official tourism") ||
    trimmed.startsWith('A Ministry of Tourism') ||
    trimmed === '+1'
  ) {
    skipped.push({ lineNo, text: trimmed });
    return;
  }

  const parts = trimmed.split('\t');
  if (parts.length >= 2 && /^\d+$/.test(parts[0].trim())) {
    const entryNo = parseInt(parts[0].trim(), 10);
    if (currentSection.includes('9.')) {
      parsed.push({
        entryNo,
        name: parts[1]?.trim() || '',
        state: parts[2]?.trim() || '',
        desc: parts.slice(3).join(' ').trim(),
        section: currentSection,
        lineNo
      });
    } else {
      parsed.push({
        entryNo,
        name: parts[1]?.trim() || '',
        state: '',
        desc: parts.slice(2).join(' ').trim(),
        section: currentSection,
        lineNo
      });
    }
  } else {
    errors.push({ lineNo, text: line });
  }
});

console.log('Parsed entries count:', parsed.length);
console.log('Skipped lines count:', skipped.length);
console.log('Skipped lines:', skipped);
console.log('Error lines:', errors);

const missing = [];
for (let i = 1; i <= 290; i++) {
  if (!parsed.find(p => p.entryNo === i)) {
    missing.push(i);
  }
}
console.log('Missing entries (1-290):', missing);
