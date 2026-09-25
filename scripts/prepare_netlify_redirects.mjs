import fs from 'fs';
import path from 'path';

const distRedirectsPath = path.join(process.cwd(), 'dist', '_redirects');

if (fs.existsSync(distRedirectsPath)) {
  let content = fs.readFileSync(distRedirectsPath, 'utf-8');
  const backendUrl = process.env.BACKEND_URL;

  if (backendUrl && backendUrl.trim()) {
    const cleanUrl = backendUrl.trim().replace(/\/$/, '');
    content = content.replace('https://BACKEND_URL', cleanUrl);
    fs.writeFileSync(distRedirectsPath, content, 'utf-8');
    console.log(`[Netlify Build] Configured /api/* proxy target -> ${cleanUrl}`);
  } else {
    console.log('[Netlify Build] Note: BACKEND_URL environment variable is not defined.');
    console.log('[Netlify Build] Set BACKEND_URL in Netlify Site Configuration to enable backend proxying.');
  }
}
