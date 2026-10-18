import { Router, Request } from 'express';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { requireAuth } from '../../server/src/middleware/auth';
import { db } from '../../server/src/db/client';
import { getConversationState, deleteConversationState, TripMemoryState } from '../engine/conversationMemory';
import { generateSmartItinerary } from '../engine/itineraryPlanner';

const sessions = new Map<string, { owner: string; id: string; title: string; updated: number; draft?: any; saving?: boolean; saved?: string }>();
const TTL = 6 * 60 * 60 * 1000;
export function ownerKey(req: Request) {
  const browser = String(req.headers['x-virasat-chat-owner'] || '');
  return req.user?.id ? `user:${req.user.id}` : /^[a-zA-Z0-9-]{32,80}$/.test(browser) ? `browser:${browser}` : 'legacy-anonymous';
}
export function sessionKey(req: Request, id: string) { return createHash('sha256').update(JSON.stringify([ownerKey(req), id])).digest('hex'); }
function prune() {
  for (const [key, entry] of sessions) if (Date.now() - entry.updated > TTL) { sessions.delete(key); deleteConversationState(key); }
  while (sessions.size > 5000) { const key = sessions.keys().next().value!; sessions.delete(key); deleteConversationState(key); }
}
export function registerConversation(req: Request, id: string, title: string) {
  prune(); const key = sessionKey(req, id);
  const entry = sessions.get(key) || { owner: ownerKey(req), id, title: title.slice(0, 80), updated: Date.now() };
  entry.updated = Date.now(); sessions.set(key, entry); return key;
}
export function buildDraft(key: string, state: TripMemoryState, message: string) {
  const entry = sessions.get(key);
  if (!entry || !state.destination || entry.saving) return entry?.draft;
  const plan = generateSmartItinerary(state);
  if (!plan.places_included.length) return undefined;
  const changeDay = message.match(/(?:change|replace|edit|badal).*?day\s*(\d+)|day\s*(\d+).*?(?:change|replace|edit|badal)/i);
  if (changeDay && entry.draft?.destination === plan.destination) {
    const number = Number(changeDay[1] || changeDay[2]);
    const prior = entry.draft.days.find((day: any) => day.day_number === number);
    if (prior) { // Explicitly editable preview; use another recorded day's stops, never invented places.
      const other = entry.draft.days.find((day: any) => day.day_number !== number);
      if (other) {
        const priorNumber = prior.day_number;
        const otherNumber = other.day_number;
        entry.draft.days = entry.draft.days.map((day: any) => day.day_number === priorNumber ? { ...other, day_number: priorNumber } : day.day_number === otherNumber ? { ...prior, day_number: otherNumber } : day);
        entry.draft.revision++;
        entry.draft.change_note = `Days ${priorNumber} and ${otherNumber} swapped for review. Use the day controls to choose individual stops.`;
      }
      entry.saved = undefined;
      return entry.draft;
    }
  }
  entry.draft = { ...plan, revision: (entry.draft?.revision || 0) + 1, status: 'preview', note: 'Planning allowances, not quotes. Opening hours and between-stop travel times need verification.' };
  entry.saved = undefined;
  return entry.draft;
}
export const workspaceRouter = Router();
workspaceRouter.use((_req, res, next) => { prune(); res.setHeader('Cache-Control', 'no-store'); next(); });
workspaceRouter.get('/conversations', (req, res) => {
  if (ownerKey(req) === 'legacy-anonymous') { res.json({ conversations: [] }); return; }
  res.json({ conversations: [...sessions.values()].filter(e => e.owner === ownerKey(req)).sort((a,b)=>b.updated-a.updated).slice(0,30).map(e => ({ id: e.id, title: e.title, updated: e.updated })), retention_hours: 6 });
});
workspaceRouter.get('/conversations/:id', (req, res) => {
  const key = sessionKey(req, String(req.params.id)); const entry = sessions.get(key);
  if (!entry) { res.status(404).json({ error: 'CONVERSATION_NOT_FOUND' }); return; }
  res.json({ messages: getConversationState(key).messages || [], draft: entry.draft, saved_trip_id: entry.saved });
});
workspaceRouter.post('/conversations/:id/claim', requireAuth, (req, res) => {
  const guestRequest = { headers: req.headers } as Request;
  if (ownerKey(guestRequest) === 'legacy-anonymous') { res.status(403).json({ error: 'BROWSER_SESSION_REQUIRED' }); return; }
  const id = String(req.params.id), guestKey = sessionKey(guestRequest, id), targetKey = sessionKey(req, id);
  const guest = sessions.get(guestKey);
  if (!guest || guest.saving || sessions.has(targetKey)) { res.status(409).json({ error: 'CHAT_CANNOT_BE_CLAIMED' }); return; }
  Object.assign(getConversationState(targetKey), getConversationState(guestKey), { sessionId: targetKey });
  sessions.set(targetKey, { ...guest, owner: ownerKey(req) });
  sessions.delete(guestKey); deleteConversationState(guestKey);
  res.json({ success: true });
});
workspaceRouter.delete('/conversations/:id', (req, res) => {
  const key = sessionKey(req, String(req.params.id));
  if (sessions.get(key)?.saving) { res.status(409).json({ error: 'SAVE_IN_PROGRESS' }); return; }
  sessions.delete(key); deleteConversationState(key); res.json({ success: true });
});
workspaceRouter.delete('/conversations', (req, res) => {
  if ([...sessions.values()].some(entry => entry.owner === ownerKey(req) && entry.saving)) { res.status(409).json({ error: 'SAVE_IN_PROGRESS' }); return; }
  for (const [key, entry] of sessions) if (entry.owner === ownerKey(req)) { sessions.delete(key); deleteConversationState(key); }
  res.json({ success: true });
});
workspaceRouter.post('/conversations/:id/clear-location', (req, res) => {
  const key = sessionKey(req, String(req.params.id));
  if (sessions.has(key)) {
    const state = getConversationState(key); delete state.currentCity; delete state.origin;
    // Location may appear in previous dialogue; clearing it also clears model history.
    state.messages = [];
    const draft = sessions.get(key)?.draft; if (draft) delete draft.origin;
  }
  res.json({ success: true });
});
const editSchema = z.object({ revision: z.number().int(), day: z.number().int().min(1).max(7), period: z.enum(['morning_cluster','afternoon_cluster','evening_cluster']), place_id: z.string().max(150).nullable() }).strict();
workspaceRouter.patch('/conversations/:id/draft', (req, res) => {
  const entry = sessions.get(sessionKey(req, String(req.params.id)));
  const parsed = editSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'INVALID_DRAFT_EDIT' }); return; }
  if (!entry?.draft || entry.saving || parsed.data.revision !== entry.draft.revision) { res.status(409).json({ error: 'DRAFT_CHANGED_REFRESH' }); return; }
  const { day, period, place_id } = parsed.data;
  const target = entry.draft.days.find((d: any) => d.day_number === day);
  const place = entry.draft.places_included.find((p: any) => p.id === place_id);
  if (!target || (place_id && !place)) { res.status(400).json({ error: 'UNKNOWN_DAY_OR_PLACE' }); return; }
  target[period].places = place ? [place] : []; entry.draft.revision++; entry.saved = undefined;
  res.json({ draft: entry.draft });
});
workspaceRouter.post('/conversations/:id/draft/confirm', requireAuth, async (req, res) => {
  const entry = sessions.get(sessionKey(req, String(req.params.id)));
  if (!entry?.draft || req.body?.confirmed !== true || req.body?.revision !== entry.draft.revision) { res.status(409).json({ error: 'REVIEW_CURRENT_DRAFT_FIRST' }); return; }
  if (entry.saved) { res.json({ trip_id: entry.saved }); return; }
  if (entry.saving) { res.status(409).json({ error: 'SAVE_IN_PROGRESS' }); return; }
  entry.saving = true;
  const id = `trip-${randomUUID()}`;
  try {
    await db.init(); const draft = entry.draft;
    await db.itineraries.create({ id, user_id: req.user!.id, title: `${draft.duration_days}-day ${draft.destination} trip`, destination: draft.destination, days_count: draft.duration_days,
      budget_level: draft.travel_style.toLowerCase(), summary: draft.note, is_public: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      draft.days.map((day: any) => ({ day_number: day.day_number, area_title: draft.destination, theme: day.theme, notes: draft.note,
        stops: ['morning_cluster','afternoon_cluster','evening_cluster'].flatMap(period => day[period].places).map((place: any,index: number) => ({ place_name: place.name, stop_order: index+1, duration_minutes: 90, notes: '90-minute planning allowance; verify venue hours and journey time.' })) })));
    entry.saved = id; res.json({ trip_id: id });
  } catch { await db.itineraries.delete(id, req.user!.id).catch(() => {}); res.status(503).json({ error: 'TRIP_SAVE_FAILED' }); }
  finally { entry.saving = false; }
});
