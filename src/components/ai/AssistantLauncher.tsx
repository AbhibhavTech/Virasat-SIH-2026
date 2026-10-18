import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { AdvancedAIAssistant } from './AdvancedAIAssistant';

export function AssistantLauncher({ selectedCity }: { selectedCity: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const closeButton = useRef<HTMLButtonElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) closeButton.current?.focus(); }, [open]);
  const close = () => { setOpen(false); launcher.current?.focus(); };
  if (location.pathname === '/ai' || location.pathname.startsWith('/admin')) return null;
  const place = location.pathname.match(/^\/place\/([^/]+)$/)?.[1];
  return <>
    <button ref={launcher} type="button" onClick={() => { setMounted(true); setOpen(true); }} aria-expanded={open}
      aria-controls="virasat-page-assistant" className="fixed bottom-20 md:bottom-6 right-5 z-40 rounded-full bg-emerald-800 text-white px-5 py-3 shadow-lg font-semibold">
      Ask Virasat AI
    </button>
    {mounted && <section id="virasat-page-assistant" aria-label="Virasat page assistant" hidden={!open}
      style={{ display: open ? 'flex' : 'none' }}
      onKeyDown={event => { if (event.key === 'Escape') close(); }}
      className="fixed z-50 right-2 sm:right-6 bottom-20 md:bottom-6 w-[calc(100%-1rem)] sm:w-[480px] h-[80dvh] max-h-[80dvh] overflow-hidden flex flex-col rounded-2xl bg-white border border-stone-200 shadow-2xl">
      <button ref={closeButton} type="button" onClick={close} className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50" aria-label="Close assistant" title="Close assistant"><X className="h-4 w-4" /></button>
      <AdvancedAIAssistant selectedCity={selectedCity} initialPlaceId={place} compact />
    </section>}
  </>;
}
