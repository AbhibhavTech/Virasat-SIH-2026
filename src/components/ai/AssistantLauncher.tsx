import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
      onKeyDown={event => { if (event.key === 'Escape') close(); }}
      className="fixed z-50 right-2 sm:right-6 bottom-20 md:bottom-6 w-[calc(100%-1rem)] sm:w-[480px] max-h-[80dvh] overflow-auto rounded-2xl bg-white border border-stone-200 shadow-2xl">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 border-b flex justify-between items-center">
        <strong>Virasat AI</strong><button ref={closeButton} onClick={close} className="px-3 py-2 rounded-lg border" aria-label="Close assistant">Close</button>
      </header>
      <AdvancedAIAssistant selectedCity={selectedCity} initialPlaceId={place} />
    </section>}
  </>;
}
