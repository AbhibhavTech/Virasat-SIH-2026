import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const key = env.match(/GEMINI_API_KEY=([^\r\n]+)/)[1].trim();

const bundles = JSON.parse(fs.readFileSync('data/mumbai_maharashtra_images.json', 'utf8'));
const hero = bundles['mumbai-004'].hero_image;

const imgRes = await fetch(hero.thumbnail_url, { headers: { 'User-Agent': 'VirasatImagePipeline/1.0 (https://virasat.heritage; contact: admin@virasat.org)' } });
const b64 = Buffer.from(await imgRes.arrayBuffer()).toString('base64');

const prompt = `You are a heritage expert and cartographer. Does this image clearly show Gateway of India, Colaba, Mumbai?
Must NOT be confused with generic city skylines or unrelated monuments.
Answer JSON ONLY with no markdown ticks: {"matches": true, "reason": "concise explanation", "visible_subject": "what is clearly visible"}`;

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/jpeg', data: b64 } }
      ]
    }],
    generationConfig: { responseMimeType: 'application/json' }
  })
});

console.log('Status:', res.status);
const data = await res.json();
console.log('Result:', JSON.stringify(data));
