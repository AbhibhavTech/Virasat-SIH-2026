import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getModelConfiguration } from '../ai/engine/modelGateway';
import { readEnvironmentValues } from '../server/src/config/environment';

const valid = { VIRASAT_AI_MODEL: 'test-model', VIRASAT_AI_API_KEY: 'test-credential', VIRASAT_AI_REQUIRE_HOSTED: 'true' };
assert.equal(getModelConfiguration({}).configured, false);
assert.equal(getModelConfiguration(valid).configured, true);
assert.equal(getModelConfiguration(valid).provider, 'openai');
const groq = getModelConfiguration({ VIRASAT_AI_PROVIDER: 'groq', GROQ_API_KEY: 'groq-test-credential', VIRASAT_AI_REQUIRE_HOSTED: 'true' });
assert.equal(groq.configured, true);
assert.equal(groq.provider, 'groq');
assert.equal(groq.model, 'openai/gpt-oss-20b');
assert.equal(groq.baseUrl, 'https://api.groq.com/openai/v1');
assert.equal(getModelConfiguration({ ...valid, OPENAI_BASE_URL: 'https://openai.example/v1' }).baseUrl, 'https://openai.example/v1');
assert.equal(getModelConfiguration({ VIRASAT_AI_PROVIDER: 'groq', GROQ_API_KEY: 'groq-test-credential', GROQ_BASE_URL: 'https://groq.example/v1' }).baseUrl, 'https://groq.example/v1');
assert.ok(getModelConfiguration({ VIRASAT_AI_PROVIDER: 'groq', VIRASAT_AI_API_KEY: 'wrong-provider-key' }).issues.includes('GROQ_API_KEY_MISSING'));
assert.ok(getModelConfiguration({ ...valid, VIRASAT_AI_PROVIDER: 'unsupported' }).issues.includes('PROVIDER_INVALID'));
assert.equal(getModelConfiguration({ VIRASAT_AI_PROVIDER: 'groq', GROQ_API_KEY: 'groq-test-credential', VIRASAT_AI_MODEL: 'bad model' }).safeModel, null);
assert.equal(getModelConfiguration({ ...valid, VIRASAT_AI_BASE_URL: 'http://remote.invalid/v1' }).configured, false);
assert.equal(getModelConfiguration({ ...valid, VIRASAT_AI_MODEL: 'sk-proj-test-secret' }).safeModel, null);
assert.equal(getModelConfiguration({ ...valid, VIRASAT_AI_MODEL: valid.VIRASAT_AI_API_KEY }).safeModel, null);
const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'virasat-config-'));
const first = path.join(folder, 'server.env');
const second = path.join(folder, 'root.env');
const sources = [{ path: first, exists: true }, { path: second, exists: true }];
const name = 'VIRASAT_CONFIGURATION_TEST_VALUE';
try {
  fs.writeFileSync(first, `${name}=server-value\n`);
  fs.writeFileSync(second, `${name}=root-value\n`);
  assert.equal(readEnvironmentValues([name], sources)[name], 'server-value');
  fs.writeFileSync(first, `${name}=updated-value\n`);
  assert.equal(readEnvironmentValues([name], sources)[name], 'updated-value', 'Changes must be read without restarting');
  fs.unlinkSync(first);
  assert.equal(readEnvironmentValues([name], sources)[name], 'root-value');
  process.env[name] = 'runtime-override';
  assert.equal(readEnvironmentValues([name], sources)[name], 'runtime-override');
  console.log('PASS: OpenAI/Groq selection, provider-specific missing keys, invalid providers/models, secret model redaction, file precedence, refreshed files and runtime overrides.');
} finally {
  delete process.env[name];
  for (const file of [first, second]) if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.rmdirSync(folder);
}
