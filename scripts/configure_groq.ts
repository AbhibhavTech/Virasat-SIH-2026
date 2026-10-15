import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import dotenv from 'dotenv';
import { GROQ_DEFAULT_MODEL } from '../ai/engine/modelGateway';

function replaceSetting(lines: string[], name: string, value: string | null): string[] {
  const pattern = new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s*=`);
  const filtered = lines.filter(line => !pattern.test(line));
  if (value !== null) filtered.push(`${name}=${value}`);
  return filtered;
}

export function buildGroqEnvironment(content: string, key: string, requestedModel?: string): string {
  const existing = dotenv.parse(content);
  const model = (requestedModel || existing.GROQ_MODEL || GROQ_DEFAULT_MODEL).trim();
  if (!key || /\s/.test(key) || key.length < 20) throw new Error('GROQ_API_KEY_MISSING_OR_INVALID');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,127}$/.test(model) || /^gsk_/i.test(model) || model === key) throw new Error('MODEL_ID_MISSING_OR_INVALID');
  let lines = content.replace(/\r\n/g, '\n').split('\n').filter((line, index, all) => index < all.length - 1 || line.length > 0);
  if (existing.VIRASAT_AI_MODEL && !existing.OPENAI_MODEL && existing.VIRASAT_AI_MODEL !== GROQ_DEFAULT_MODEL) {
    lines = replaceSetting(lines, 'OPENAI_MODEL', existing.VIRASAT_AI_MODEL);
  }
  if (existing.VIRASAT_AI_BASE_URL && !existing.OPENAI_BASE_URL && /api\.openai\.com/i.test(existing.VIRASAT_AI_BASE_URL)) {
    lines = replaceSetting(lines, 'OPENAI_BASE_URL', existing.VIRASAT_AI_BASE_URL);
  }
  lines = replaceSetting(lines, 'VIRASAT_AI_MODEL', null);
  lines = replaceSetting(lines, 'VIRASAT_AI_BASE_URL', null);
  lines = replaceSetting(lines, 'VIRASAT_AI_PROVIDER', 'groq');
  lines = replaceSetting(lines, 'GROQ_API_KEY', key);
  lines = replaceSetting(lines, 'GROQ_MODEL', model);
  lines = replaceSetting(lines, 'VIRASAT_AI_REQUIRE_HOSTED', 'true');
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

export function configureGroqFile(envPath: string, key: string, requestedModel?: string) {
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const updated = buildGroqEnvironment(content, key, requestedModel);
  fs.writeFileSync(envPath, updated, { encoding: 'utf8', mode: 0o600 });
  return { configured_provider: 'groq' as const, model: dotenv.parse(updated).GROQ_MODEL, environment_file: envPath, secret_printed: false };
}

async function main() {
  const envPath = path.resolve(process.cwd(), '.env');
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const existing = dotenv.parse(content);
  const key = (process.env.GROQ_API_KEY || existing.GROQ_API_KEY || '').trim();
  if (!key) {
    console.error('BLOCKED: GROQ_API_KEY is not set. Create it in the Groq Console, then set it in the current shell or D:\\virasat\\.env. No file was changed.');
    process.exitCode = 2;
    return;
  }
  console.log(JSON.stringify(configureGroqFile(envPath, key, process.env.GROQ_MODEL), null, 2));
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) main().catch((error: unknown) => {
  const code = error instanceof Error ? error.message : '';
  if (code === 'GROQ_API_KEY_MISSING_OR_INVALID') {
    console.error('BLOCKED: the entered Groq key is empty, too short, or contains whitespace. Copy the complete key from Groq Console; no secret value was printed.');
  } else if (code === 'MODEL_ID_MISSING_OR_INVALID') {
    console.error('BLOCKED: GROQ_MODEL is invalid. Use a model ID returned by the Groq account model listing.');
  } else if (error && typeof error === 'object' && 'code' in error && ['EACCES', 'EPERM', 'EROFS'].includes(String((error as { code?: unknown }).code))) {
    console.error('BLOCKED: D:\\virasat\\.env could not be written. Close editors locking the file and check file permissions.');
  } else {
    console.error('Groq configuration failed with an unclassified local error. The key and environment values were not printed.');
  }
  process.exitCode = 1;
});
