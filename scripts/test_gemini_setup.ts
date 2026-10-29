import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import dotenv from 'dotenv';
import { GEMINI_DEFAULT_MODEL } from '../ai/engine/modelGateway';
import { buildGeminiEnvironment, configureGeminiFile } from './configure_gemini';

const key = 'AIza-test-only-not-a-real-secret-12345';
const before = `# existing settings\nVIRASAT_AI_MODEL=gpt-5.5\nVIRASAT_AI_API_KEY=openai-test-only\nVIRASAT_AI_BASE_URL=https://api.openai.com/v1\nVIRASAT_AI_REQUIRE_HOSTED=true\n`;
const after = buildGeminiEnvironment(before, key);
const parsed = dotenv.parse(after);
assert.equal(parsed.VIRASAT_AI_PROVIDER, 'gemini');
assert.equal(parsed.GEMINI_API_KEY, key);
assert.equal(parsed.GEMINI_MODEL, GEMINI_DEFAULT_MODEL);
assert.equal(parsed.GEMINI_MODEL, 'gemini-3.1-flash-lite');
assert.equal(parsed.OPENAI_MODEL, 'gpt-5.5');
assert.equal(parsed.OPENAI_BASE_URL, 'https://api.openai.com/v1');
assert.equal(parsed.VIRASAT_AI_API_KEY, 'openai-test-only');
assert.equal(parsed.VIRASAT_AI_MODEL, undefined);
assert.equal(parsed.VIRASAT_AI_BASE_URL, undefined);
assert.equal(parsed.VIRASAT_AI_REQUIRE_HOSTED, 'true');
assert.equal(parsed.VIRASAT_AI_MAX_TOKENS, '65536');
assert.throws(() => buildGeminiEnvironment(before, ''), /GEMINI_API_KEY_MISSING_OR_INVALID/);
assert.throws(() => buildGeminiEnvironment(before, key, key), /MODEL_ID_MISSING_OR_INVALID/);

const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'virasat-gemini-setup-'));
try {
  const envPath = path.join(folder, '.env');
  fs.writeFileSync(envPath, before);
  const summary = configureGeminiFile(envPath, key);
  assert.equal(summary.secret_printed, false);
  assert.ok(!JSON.stringify(summary).includes(key));
  assert.equal(dotenv.parse(fs.readFileSync(envPath, 'utf8')).GEMINI_API_KEY, key);
} finally {
  fs.rmSync(folder, { recursive: true, force: true });
}

console.log('PASS: Gemini setup selects the high-volume stable model, preserves OpenAI settings, requires hosted mode, and never prints credentials.');
