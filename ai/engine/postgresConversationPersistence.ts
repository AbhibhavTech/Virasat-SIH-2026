import { Pool } from 'pg';
import { readEnvironmentValues } from '../../server/src/config/environment';
import type { ConversationSnapshot } from './conversationPersistence';

let pool: Pool | undefined;
function database() {
  const { DATABASE_URL } = readEnvironmentValues(['DATABASE_URL']);
  if (!DATABASE_URL) return null;
  pool ||= new Pool({ connectionString: DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, max: 3 });
  return pool;
}
export function hasPostgresConversationStore() { return Boolean(database()); }

export async function loadPostgresConversations(now=Date.now()): Promise<ConversationSnapshot[]> {
  const db=database(); if (!db) return [];
  const rows=await db.query(`SELECT id,owner_key,title,state_json,draft_json,saved_trip_id,updated_at FROM ai_sessions
    WHERE owner_key IS NOT NULL AND (expires_at IS NULL OR expires_at>NOW()) ORDER BY updated_at ASC LIMIT 5000`);
  return rows.rows.map(row=>({key:row.id,entry:{owner:row.owner_key,id:row.state_json?.conversationId||row.id,title:row.title,
    updated:new Date(row.updated_at).getTime(),draft:row.draft_json||undefined,saved:row.saved_trip_id||undefined},state:row.state_json?.memory||{sessionId:row.id,messages:[]}}))
    .filter(item=>item.entry.updated<=now);
}

export async function syncPostgresConversations(snapshots: ConversationSnapshot[], retentionMs:number) {
  const db=database(); if (!db) return false;
  const client=await db.connect();
  try {
    await client.query('BEGIN');
    for (const item of snapshots) await client.query(`INSERT INTO ai_sessions
      (id,user_id,title,context_json,owner_key,state_json,draft_json,saved_trip_id,expires_at,created_at,updated_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),$10)
      ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,owner_key=EXCLUDED.owner_key,state_json=EXCLUDED.state_json,
      draft_json=EXCLUDED.draft_json,saved_trip_id=EXCLUDED.saved_trip_id,expires_at=EXCLUDED.expires_at,
      updated_at=EXCLUDED.updated_at,version=ai_sessions.version+1`, [item.key,item.entry.owner.startsWith('user:')?item.entry.owner.slice(5):null,
      item.entry.title,JSON.stringify({storage:'workspace'}),item.entry.owner,JSON.stringify({conversationId:item.entry.id,memory:item.state}),
      item.entry.draft?JSON.stringify(item.entry.draft):null,item.entry.saved||null,new Date(item.entry.updated+retentionMs),new Date(item.entry.updated)]);
    await client.query('DELETE FROM ai_sessions WHERE expires_at IS NOT NULL AND expires_at<=NOW()');
    await client.query('COMMIT'); return true;
  } catch(error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function deletePostgresConversation(key:string) { const db=database(); if(db) await db.query('DELETE FROM ai_sessions WHERE id=$1',[key]); }
