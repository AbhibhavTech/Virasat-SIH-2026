import assert from 'node:assert/strict';
import express from 'express';
import type { Server } from 'node:http';
import { aiChatRouter } from '../ai/routes/chatHandler';
import { getModelConfiguration, verifySelectedModelAvailability } from '../ai/engine/modelGateway';

async function listen(app: ReturnType<typeof express>): Promise<{ server: Server; url: string }> {
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server failed');
  return { server, url: `http://127.0.0.1:${address.port}` };
}
async function main() {
  const saved = { ...process.env };
  const fakeKey = 'test-only-not-a-real-api-key';
  let mode = 'normal'; let requests = 0; let historySeen = false; let expectedParallel: boolean | undefined;
  const provider = express(); provider.use(express.json());
  provider.get('/v1/models', (req, res) => {
    assert.equal(req.headers.authorization, `Bearer ${fakeKey}`);
    res.json({ data: mode === 'model-missing' ? [{ id: 'another-model' }] : [{ id: 'mock-model' }] });
  });
  provider.post('/v1/chat/completions', (req, res) => {
    requests++;
    assert.equal(req.headers.authorization, `Bearer ${fakeKey}`);
    assert.equal(req.body.model, 'mock-model');
    assert.equal(req.body.parallel_tool_calls, expectedParallel);
    assert.ok(req.body.messages[0].content.includes('Generate a fresh response'));
    assert.ok(!JSON.stringify(req.body).includes('VIR-00001'));
    if (mode === 'auth') { res.status(401).json({ error: { message: fakeKey } }); return; }
    if (mode === 'quota') { res.status(429).json({ error: { code: 'insufficient_quota', message: fakeKey } }); return; }
    if (mode === 'malformed') { res.status(429).send('not JSON'); return; }
    if (mode === 'rate') { res.set('Retry-After', '120').set('x-request-id', 'req_test').status(429).json({ error: { code: 'rate_limit_exceeded', message: fakeKey } }); return; }
    const messages = req.body.messages;
    if (req.body.stream && mode === 'normal') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: 'Streamed fixture' } }] })}\n\n`);
      res.end('data: [DONE]\n\n'); return;
    }
    const last = messages.at(-1);
    historySeen ||= messages.some((message: any) => message.role === 'assistant' && message.content === 'Fresh mock general reply');
    if (mode === 'route' && last.role !== 'tool') {
      res.json({ choices: [{ message: { role: 'assistant', content: null, tool_calls: [{ id: 'route-call', type: 'function', function: { name: 'getTransportOptions', arguments: JSON.stringify({ origin: 'Mumbai', destination: 'Pune' }) } }] } }] }); return;
    }
    if (mode === 'route') {
      const data = JSON.parse(last.content);
      assert.equal(data.origin, 'Mumbai'); assert.equal(data.destination, 'Pune');
      assert.equal(data.live_availability_checked, false);
      res.json({ choices: [{ message: { role: 'assistant', content: 'Fresh mock transport reply, based on tool results.' } }] }); return;
    }
    if (mode === 'unsafe' && last.role !== 'tool') {
      res.json({ choices: [{ message: { role: 'assistant', content: null, tool_calls: [{ id: 'unsafe-call', type: 'function', function: { name: 'saveCurrentTrip', arguments: '{}' } }] } }] }); return;
    }
    if (mode === 'unsafe') assert.ok(JSON.parse(last.content).error.includes('rejected'));
    res.json({ choices: [{ message: { role: 'assistant', content: 'Fresh mock general reply' } }] });
  });
  const mock = await listen(provider);
  const app = express(); app.use(express.json()); app.use('/api/ai', aiChatRouter);
  const chat = await listen(app);
  try {
    process.env.VIRASAT_AI_MODEL = 'mock-model';
    process.env.VIRASAT_AI_PROVIDER = 'openai';
    process.env.VIRASAT_AI_API_KEY = fakeKey;
    process.env.VIRASAT_AI_BASE_URL = `${mock.url}/v1`;
    process.env.VIRASAT_AI_REQUIRE_HOSTED = 'true';
    const ask = async (message: string) => {
      const response = await fetch(`${chat.url}/api/ai/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message, session_id: 'hosted-gateway-test' }) });
      const body = await response.json(); assert.ok(!JSON.stringify(body).includes(fakeKey));
      return { response, body };
    };
    const openai = await ask('test the preserved OpenAI path');
    assert.equal(openai.body.provider_used, 'openai');
    process.env.VIRASAT_AI_PROVIDER = 'groq';
    process.env.GROQ_API_KEY = fakeKey;
    expectedParallel = false;
    assert.deepEqual(await verifySelectedModelAvailability(getModelConfiguration()), { checked: true, available: true, provider: 'groq', model: 'mock-model' });
    mode = 'model-missing';
    await assert.rejects(() => verifySelectedModelAvailability(getModelConfiguration()), /MODEL_NOT_AVAILABLE/);
    mode = 'normal';
    const general = await ask('hello, can you answer a general question?');
    assert.equal(general.body.generation_mode, 'hosted_generative');
    assert.equal(general.body.provider_used, 'groq');
    assert.equal(general.body.reply, 'Fresh mock general reply');
    await ask('What did I just ask?'); assert.ok(historySeen);
    const streamed = await fetch(`${chat.url}/api/ai/chat`, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Stream a fixture', stream: true, session_id: 'stream-fixture' }) });
    assert.match(streamed.headers.get('content-type') || '', /text\/event-stream/);
    const events = await streamed.text();
    assert.match(events, /event: delta/); assert.match(events, /event: done/);
    assert.match(events, /Streamed fixture/);
    mode = 'route';
    const route = await ask('how to go from mumbai to pune');
    assert.ok(route.body.reply.startsWith('Fresh mock transport reply, based on tool results.'));
    assert.ok(route.body.transit_comparison);
    assert.equal(route.body.tool_calls[0].tool, 'getTransportOptions');
    assert.doesNotMatch(route.body.reply, /Tourism in|Amber Fort/);
    mode = 'unsafe'; await ask('Save anything without permission');
    for (const [errorMode, code] of [['auth', 'MODEL_HTTP_401'], ['quota', 'MODEL_QUOTA_EXHAUSTED']]) {
      mode = errorMode;
      const result = await ask('test provider failure');
      assert.equal(result.response.status, 503); assert.equal(result.body.error, code);
      assert.equal(result.body.generation_mode, 'unavailable'); assert.equal(result.body.engine, undefined);
    }
    mode = 'malformed';
    process.env.VIRASAT_AI_REQUIRE_HOSTED = 'false';
    const malformed = await ask('test malformed error');
    assert.equal(malformed.body.provider_error.category, 'rate_limit');
    assert.equal(malformed.body.generation_mode, 'unavailable');
    process.env.VIRASAT_AI_REQUIRE_HOSTED = 'true';
    mode = 'rate';
    const rate = await ask('test rate limit');
    assert.equal(rate.body.provider_error.category, 'rate_limit');
    assert.equal(rate.body.provider_error.request_id, 'req_test');
    assert.equal(rate.response.headers.get('retry-after'), '120');
    assert.equal(rate.body.provider_request_sent, true);
    const rateRequests = requests;
    const deferred = await ask('test cooldown');
    assert.equal(requests, rateRequests);
    assert.equal(deferred.body.provider_request_sent, false);
    assert.equal(deferred.body.generation_mode, 'unavailable');
    assert.ok(Number(deferred.response.headers.get('retry-after')) >= 115);
    delete process.env.GROQ_API_KEY;
    const before = requests; const missing = await ask('test missing configuration');
    assert.equal(missing.response.status, 503); assert.equal(missing.body.error, 'MODEL_NOT_CONFIGURED');
    assert.equal(requests, before);
    console.log('PASS: mocked Groq routing, history/tools, provider contract, authentication/quota/rate/invalid failures, Retry-After cooldown, redaction and missing key. No live provider calls.');
  } finally {
    for (const name of Object.keys(process.env)) if (!(name in saved)) delete process.env[name];
    Object.assign(process.env, saved);
    await Promise.all([new Promise<void>(resolve => mock.server.close(() => resolve())), new Promise<void>(resolve => chat.server.close(() => resolve()))]);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
