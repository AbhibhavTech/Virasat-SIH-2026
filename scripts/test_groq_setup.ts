import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import dotenv from 'dotenv';
import { buildGroqEnvironment, configureGroqFile } from './configure_groq';

const key = 'gsk_test_only_not_a_real_secret_12345';
const before = `# existing settings\nVIRASAT_AI_MODEL=gpt-5.5\nVIRASAT_AI_API_KEY=openai-test-only\nVIRASAT_AI_BASE_URL=https://api.openai.com/v1\nVIRASAT_AI_REQUIRE_HOSTED=true\n`;
const after = buildGroqEnvironment(before, key);
const parsed = dotenv.parse(after);
assert.equal(parsed.VIRASAT_AI_PROVIDER, 'groq');
assert.equal(parsed.GROQ_API_KEY, key);
assert.equal(parsed.GROQ_MODEL, 'openai/gpt-oss-20b');
assert.equal(parsed.OPENAI_MODEL, 'gpt-5.5');
assert.equal(parsed.OPENAI_BASE_URL, 'https://api.openai.com/v1');
assert.equal(parsed.VIRASAT_AI_API_KEY, 'openai-test-only');
assert.equal(parsed.VIRASAT_AI_MODEL, undefined);
assert.equal(parsed.VIRASAT_AI_BASE_URL, undefined);
assert.throws(() => buildGroqEnvironment(before, ''), /GROQ_API_KEY_MISSING_OR_INVALID/);
assert.throws(() => buildGroqEnvironment(before, key, key), /MODEL_ID_MISSING_OR_INVALID/);
const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'virasat-groq-setup-'));
try {
  const envPath = path.join(folder, '.env');
  fs.writeFileSync(envPath, before);
  const summary = configureGroqFile(envPath, key);
  assert.equal(summary.secret_printed, false);
  assert.ok(!JSON.stringify(summary).includes(key));
  assert.equal(dotenv.parse(fs.readFileSync(envPath)).GROQ_API_KEY, key);
} finally {
  fs.rmSync(folder, { recursive: true, force: true });
}
console.log('PASS: Groq setup preserves OpenAI settings, removes cross-provider overrides, validates key/model and emits no real credentials.');
