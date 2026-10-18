import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export function TripDraft({ draft, conversationId, onChange }: { draft: any; conversationId: string; onChange: (draft: any) => void }) {
  const { user, setIsAuthModalOpen } = useAuth();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [saved, setSaved] = useState('');
  async function edit(day: number, period: string, place_id: string) {
    setBusy(true); setNotice(''); setReviewed(false); setSaved('');
    try { const result = await api.editAIDraft(conversationId, { revision: draft.revision, day, period, place_id: place_id || null }); onChange(result.draft); }
    catch { setNotice('The draft changed or could not be updated. Reopen this chat to refresh it.'); }
    finally { setBusy(false); }
  }
  async function save() {
    if (!user) { setIsAuthModalOpen(true); return; }
    setBusy(true); setNotice('');
    try { const result = await api.confirmAIDraft(conversationId, draft.revision); setSaved(result.trip_id); }
    catch { setNotice('Could not save this version. Reopen the chat, review the draft and try again.'); }
    finally { setBusy(false); }
  }
  return <section className="my-4 rounded-2xl border border-orange-200 bg-orange-50/40 p-4 space-y-4" aria-label="Editable trip preview">
    <div><h3 className="text-lg font-semibold">{draft.duration_days} days in {draft.destination}</h3><p className="text-sm">{draft.travel_style} · Editable preview · Version {draft.revision}</p></div>
    <p className="text-sm text-stone-600">{draft.note}</p>
    {draft.change_note && <p role="status" className="text-sm">{draft.change_note}</p>}
    <details><summary className="cursor-pointer font-medium">Planning budget: {draft.budget_breakdown.total_estimated}</summary>
      <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">{Object.entries(draft.budget_breakdown).filter(([key])=>key!=='total_estimated').map(([key,value])=><React.Fragment key={key}><dt>{key.replace(/_/g,' ')}</dt><dd>{String(value)}</dd></React.Fragment>)}</dl>
      <p className="text-xs mt-2">Allowances, not live quotes. Intercity tickets and optional experiences require separate pricing.</p>
    </details>
    {draft.days.map((day: any)=><details key={day.day_number} className="rounded-xl bg-white border p-3" open={day.day_number===1}>
      <summary className="cursor-pointer font-semibold">Day {day.day_number} · {day.theme}</summary>
      {['morning_cluster','afternoon_cluster','evening_cluster'].map(period=><label key={period} className="block mt-3 text-sm">
        <span className="capitalize">{period.split('_')[0]}</span>
        <select disabled={busy || !!saved} aria-label={`Day ${day.day_number} ${period.split('_')[0]} stop`} value={day[period].places[0]?.id || ''} onChange={e=>edit(day.day_number,period,e.target.value)} className="block w-full mt-1 rounded-lg border p-2 bg-white">
          <option value="">Free time / choose a stop</option>
          {draft.places_included.map((place: any)=><option key={place.id} value={place.id}>{place.name}</option>)}
        </select>
        {day[period].places[0]?.source_url?.startsWith('https://') && <a href={day[period].places[0].source_url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-orange-800 underline">Stored source for this stop</a>}
        <span className="block mt-1 text-xs text-stone-500">Travel time: not verified. Confirm opening hours before visiting.</span>
      </label>)}
    </details>)}
    {!saved && <label className="flex gap-2 text-sm"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)} />I reviewed this version and want to save it to My Trips.</label>}
    <button disabled={busy || (!reviewed && !!user) || !!saved} onClick={save} className="rounded-xl bg-orange-700 text-white px-4 py-2 disabled:opacity-50">{saved ? 'Saved to My Trips' : busy ? 'Saving…' : user ? 'Confirm & save trip' : 'Sign in to save'}</button>
    {saved && <a className="ml-3 underline text-sm" href="/trips">Open My Trips</a>}
    {notice && <p role="alert" className="text-sm text-red-700">{notice}</p>}
  </section>;
}
