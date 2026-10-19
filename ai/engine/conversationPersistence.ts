import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const CONVERSATION_RETENTION_MS = 6 * 60 * 60 * 1000;
const MAX_BYTES = 32 * 1024 * 1024;
export interface ConversationSnapshot {
  key: string;
  entry: { owner: string; id: string; title: string; updated: number; draft?: any; saved?: string };
  state: any;
}

/** Single-process store. Use a persistent disk for restart/deploy durability. */
export class ConversationPersistence {
  constructor(private file = process.env.VIRASAT_CHAT_STORE_PATH || path.join(process.cwd(), 'data', '.database', 'ai-conversations.json')) {}

  load(now = Date.now()): ConversationSnapshot[] {
    if (!fs.existsSync(this.file)) return [];
    if (fs.statSync(this.file).size > MAX_BYTES) throw new Error('CHAT_STORE_TOO_LARGE');
    const data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    if (data?.version !== 1 || !Array.isArray(data.conversations)) throw new Error('CHAT_STORE_INVALID');
    return data.conversations.filter((item: ConversationSnapshot) =>
      /^[a-f0-9]{64}$/.test(item?.key || '') &&
      /^(user|browser):.+/.test(item?.entry?.owner || '') &&
      typeof item.entry.id === 'string' && typeof item.entry.title === 'string' &&
      Number.isFinite(item.entry.updated) && item.entry.updated <= now && now - item.entry.updated < CONVERSATION_RETENTION_MS &&
      item.state?.sessionId === item.key
    ).slice(-5000);
  }

  save(conversations: ConversationSnapshot[]) {
    const content = JSON.stringify({ version: 1, conversations });
    if (Buffer.byteLength(content) > MAX_BYTES) throw new Error('CHAT_STORE_TOO_LARGE');
    fs.mkdirSync(path.dirname(this.file), { recursive: true, mode: 0o700 });
    const temporary = `${this.file}.${randomUUID()}.tmp`;
    try {
      const fd = fs.openSync(temporary, 'wx', 0o600);
      try { fs.writeFileSync(fd, content, 'utf8'); fs.fsyncSync(fd); }
      finally { fs.closeSync(fd); }
      fs.renameSync(temporary, this.file);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
  }
}
