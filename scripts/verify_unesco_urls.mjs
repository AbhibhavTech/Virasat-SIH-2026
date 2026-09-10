import { execSync } from 'child_process';

const list = [
  ['Fatehpur Sikri City of Victory', 'https://whc.unesco.org/en/list/255/'],
  ['Qutub Minar & Complex', 'https://whc.unesco.org/en/list/231/'],
  ['Humayun\'s Tomb', 'https://whc.unesco.org/en/list/232/'],
  ['Red Fort (Lal Qila)', 'https://whc.unesco.org/en/list/233/'],
  ['Kalka-Shimla Mountain Railway', 'https://whc.unesco.org/en/list/944/'],
  ['Amber Fort & Palace (Amer)', 'https://whc.unesco.org/en/list/247/'],
  ['Jaisalmer Fort', 'https://whc.unesco.org/en/list/247/'],
  ['Rani ki Vav', 'https://whc.unesco.org/en/list/922/'],
  ['Champaner-Pavagadh Archaeological Park', 'https://whc.unesco.org/en/list/1101/'],
  ['Ajanta Caves', 'https://whc.unesco.org/en/list/242/'],
  ['Ellora Caves & Kailasa Temple', 'https://whc.unesco.org/en/list/243/'],
  ['Chhatrapati Shivaji Maharaj Terminus', 'https://whc.unesco.org/en/list/945/'],
  ['Basilica of Bom Jesus & Old Goa Churches', 'https://whc.unesco.org/en/list/234/'],
  ['Group of Monuments at Hampi', 'https://whc.unesco.org/en/list/241/'],
  ['Group of Monuments at Pattadakal', 'https://whc.unesco.org/en/list/239/'],
  ['Sacred Ensembles of the Hoysalas', 'https://whc.unesco.org/en/list/1670/'],
  ['Brihadisvara Temple', 'https://whc.unesco.org/en/list/250/'],
  ['Shore Temple Mahabalipuram', 'https://whc.unesco.org/en/list/249/'],
  ['Khajuraho Group of Monuments', 'https://whc.unesco.org/en/list/240/'],
  ['Great Stupa at Sanchi', 'https://whc.unesco.org/en/list/524/'],
  ['Sun Temple Konark', 'https://whc.unesco.org/en/list/246/'],
  ['Mahabodhi Temple Complex', 'https://whc.unesco.org/en/list/1056/'],
  ['Archaeological Site of Nalanda Mahavihara', 'https://whc.unesco.org/en/list/1502/'],
  ['Kaziranga', 'https://whc.unesco.org/en/list/337/'],
  ['Kakatiya Rudreshwara (Ramappa) Temple', 'https://whc.unesco.org/en/list/1570/'],
  ['The Capitol Complex Chandigarh', 'https://whc.unesco.org/en/list/1251/']
];

console.log('Fetching UNESCO URLs with curl...');
for (const [placeName, url] of list) {
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -H "Accept: text/html" "${url}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, timeout: 20000 });
    const match = html.match(/<title>([^<]+)<\/title>/i);
    const title = match ? match[1].replace(/\s+/g, ' ').trim() : 'NO_TITLE';
    const isCloudflare = title.includes('Just a moment') || title.includes('403') || title === 'NO_TITLE';
    console.log(isCloudflare ? '❌ [FAIL]' : '✅ [PASS]', placeName, '-->', title);
  } catch (err) {
    console.log('💥 [ERR]', placeName, '-->', err.message);
  }
}
