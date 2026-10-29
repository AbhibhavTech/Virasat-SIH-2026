import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import dotenv from 'dotenv';
import { GEMINI_DEFAULT_MODEL } from '../ai/engine/modelGateway';

function replaceSetting(lines: string[], name: string, value: string | null): string[] {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^\\s*${escaped}\\s*=`);
  const filtered = lines.filter(line => !pattern.test(line));
  if (value !== null) filtered.push(`${name}=${value}`);
  return filtered;
}

export function buildGeminiEnvironment(content: string, key: string, requestedModel?: string): string {
  const existing = dotenv.parse(content);
  const model = (requestedModel || existing.GEMINI_MODEL || GEMINI_DEFAULT_MODEL).trim();
  if (!key || /\s/.test(key) || key.length < 20) throw new Error('GEMINI_API_KEY_MISSING_OR_INVALID');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,127}$/.test(model) || /^(sk-|gsk_|AIza)/i.test(model) || model === key) throw new Error('MODEL_ID_MISSING_OR_INVALID');
  let lines = content.replace(/\r\n/g, '\n').split('\n').filter((line, index, all) => index < all.length - 1 || line.length > 0);
  if (existing.VIRASAT_AI_MODEL && !existing.OPENAI_MODEL && existing.VIRASAT_AI_MODEL !== GEMINI_DEFAULT_MODEL) {
    lines = replaceSetting(lines, 'OPENAI_MODEL', existing.VIRASAT_AI_MODEL);
  }
  if (existing.VIRASAT_AI_BASE_URL && !existing.OPENAI_BASE_URL && /api\.openai\.com/i.test(existing.VIRASAT_AI_BASE_URL)) {
    lines = replaceSetting(lines, 'OPENAI_BASE_URL', existing.VIRASAT_AI_BASE_URL);
  }
  lines = replaceSetting(lines, 'VIRASAT_AI_MODEL', null);
  lines = replaceSetting(lines, 'VIRASAT_AI_BASE_URL', null);
  lines = replaceSetting(lines, 'VIRASAT_AI_PROVIDER', 'gemini');
  lines = replaceSetting(lines, 'GEMINI_API_KEY', key);
  lines = replaceSetting(lines, 'GEMINI_MODEL', model);
  // Set Gemini 3.8 Flash's documented output ceiling. The model still decides
  // how much to generate; usage, latency and account quota continue to apply.
  if (!existing.VIRASAT_AI_MAX_TOKENS || Number(existing.VIRASAT_AI_MAX_TOKENS) < 65536) {
    lines = replaceSetting(lines, 'VIRASAT_AI_MAX_TOKENS', '65536');
  }
  lines = replaceSetting(lines, 'VIRASAT_AI_REQUIRE_HOSTED', 'true');
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export function configureGeminiFile(envPath: string, key: string, requestedModel?: string) {
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const updated = buildGeminiEnvironment(content, key, requestedModel);
  fs.writeFileSync(envPath, updated, { encoding: 'utf8', mode: 0o600 });
  return { configured_provider: 'gemini' as const, model: dotenv.parse(updated).GEMINI_MODEL, environment_file: envPath, secret_printed: false };
}

async function main() {
  const envPath = path.resolve(process.cwd(), '.env');
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const existing = dotenv.parse(content);
  const key = (process.env.GEMINI_API_KEY || existing.GEMINI_API_KEY || '').trim();
  if (!key) {
    console.error('BLOCKED: GEMINI_API_KEY is not set. Use the secure setup prompt or set it locally. No file was changed.');
    process.exitCode = 2;
    return;
  }
  console.log(JSON.stringify(configureGeminiFile(envPath, key, process.env.GEMINI_MODEL), null, 2));
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) main().catch((error: unknown) => {
  const code = error instanceof Error ? error.message : '';
  if (code === 'GEMINI_API_KEY_MISSING_OR_INVALID') {
    console.error('BLOCKED: Gemini key is missing, too short, or contains whitespace. No secret value was printed.');
  } else if (code === 'MODEL_ID_MISSING_OR_INVALID') {
    console.error('BLOCKED: GEMINI_MODEL is invalid. Use a model ID supported by your Google AI Studio project.');
  } else if (error && typeof error === 'object' && 'code' in error && ['EACCES', 'EPERM', 'EROFS'].includes(String((error as { code?: unknown }).code))) {
    console.error('BLOCKED: the root .env could not be written. Check file permissions.');
  } else {
    console.error('Gemini configuration failed with an unclassified local error. Secret values were not printed.');
  }
  process.exitCode = 1;
});
