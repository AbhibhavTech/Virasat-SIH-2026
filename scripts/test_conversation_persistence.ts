import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { ConversationPersistence, CONVERSATION_RETENTION_MS } from '../ai/engine/conversationPersistence';

const mode = process.argv[2];
if (mode) {
  const express = (await import('express')).default;
  const { workspaceRouter, registerConversation } = await import('../ai/routes/workspace');
  const { getConversationState } = await import('../ai/engine/conversationMemory');
  const owner = 'a'.repeat(32);
  if (mode === 'seed') {
    const key = registerConversation({ headers: { 'x-virasat-chat-owner': owner } } as any, 'persist-fixture', 'Restart test');
    getConversationState(key).messages = [{ role: 'user', content: 'Remember Jaipur' }];
  }
  const app = express(); app.use(express.json()); app.use(workspaceRouter);
  const server = app.listen(0);
  await new Promise<void>(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${(server.address() as any).port}/conversations/persist-fixture`;
  try {
    const headers = { 'x-virasat-chat-owner': owner };
    const response = await fetch(url, { headers });
    if (mode === 'deleted') assert.equal(response.status, 404);
    else {
      assert.equal(response.status, 200);
      assert.equal((await response.json()).messages[0].content, 'Remember Jaipur');
      assert.equal((await fetch(url, { headers: { 'x-virasat-chat-owner': 'b'.repeat(32) } })).status, 404);
    }
    if (mode === 'delete') assert.equal((await fetch(url, { method: 'DELETE', headers })).status, 200);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
} else {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'virasat-chat-test-'));
  try {
    const file = path.join(dir, 'history.json');
    for (const step of ['seed', 'read', 'delete', 'deleted']) {
      const result = spawnSync(process.execPath, ['--import', 'tsx', fileURLToPath(import.meta.url), step], {
        env: { ...process.env, VIRASAT_CHAT_STORE_PATH: file }, encoding: 'utf8', timeout: 30000,
      });
      assert.equal(result.status, 0, `${step}: ${result.stderr}`);
    }
    const store = new ConversationPersistence(file);
    const key = 'c'.repeat(64);
    store.save([{ key, entry: { owner: 'browser:test', id: 'expired', title: 'old', updated: Date.now() - CONVERSATION_RETENTION_MS - 1 }, state: { sessionId: key } }]);
    assert.deepEqual(store.load(), []);
    fs.writeFileSync(file, '{broken');
    assert.throws(() => store.load());
    assert.equal(fs.readFileSync(file, 'utf8'), '{broken');
    console.log('PASS: cross-process restore, owner isolation, deletion survives restart, TTL and corrupt-store detection.');
  } finally {
    if (path.dirname(path.resolve(dir)) !== path.resolve(os.tmpdir()) || !path.basename(dir).startsWith('virasat-chat-test-')) throw new Error('Unsafe test cleanup path');
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
