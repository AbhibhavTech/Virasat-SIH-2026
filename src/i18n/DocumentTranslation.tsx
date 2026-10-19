import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type TranslationResponse = { success?: boolean; translations?: string[]; error?: string };

const originalText = new WeakMap<Text, string>();
const translatedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = new WeakMap<Element, Map<string, string>>();
const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CANVAS', 'CODE', 'PRE', 'TEXTAREA', 'INPUT']);
const observedAttributes: MutationObserverInit = { childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title', 'alt'], subtree: true };

function makeBatches<T>(items: T[], textOf: (item: T) => string): T[][] {
  const batches: T[][] = [];
  let batch: T[] = [];
  let characters = 0;
  for (const item of items) {
    const length = textOf(item).length;
    if (batch.length && (batch.length >= 20 || characters + length > 7500)) {
      batches.push(batch);
      batch = [];
      characters = 0;
    }
    batch.push(item);
    characters += length;
  }
  if (batch.length) batches.push(batch);
  return batches;
}

function shouldSkip(node: Text) {
  const value = node.nodeValue || '';
  if (!value.trim() || value.length > 2000 || !/[A-Za-z]{2}/.test(value)) return true;
  let element = node.parentElement;
  while (element && element !== document.body) {
    if (skipTags.has(element.tagName) || element.isContentEditable || element.hasAttribute('data-virasat-no-translate') || element.closest('.leaflet-container, [data-map-root]')) return true;
    element = element.parentElement;
  }
  return false;
}

/** Automatically translates page text with the configured server-side model. */
export const DocumentTranslation: React.FC = () => {
  const { currentLanguage, languages } = useLanguage();
  const [status, setStatus] = useState('');
  const languageName = languages.find(language => language.code === currentLanguage)?.name || currentLanguage;

  useEffect(() => {
    if (currentLanguage === 'en' || !document.body) {
      document.documentElement.removeAttribute('data-virasat-translated');
      return;
    }

    let stopped = false;
    let busy = false;
    let queued = false;
    let failed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => schedule());

    const collect = () => {
      const result: Text[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node as Text;
        const current = text.nodeValue || '';
        const previousTranslation = translatedText.get(text);
        if (previousTranslation === current || shouldSkip(text)) continue;
        if (originalText.has(text) && previousTranslation !== undefined) originalText.set(text, current);
        else if (!originalText.has(text)) originalText.set(text, current);
        result.push(text);
      }
      return result;
    };

    const collectAttributes = () => {
      const result: Array<{ element: Element; name: string; source: string }> = [];
      document.body.querySelectorAll('[placeholder], [aria-label], [title], img[alt]').forEach(element => {
        if (element.closest('[data-virasat-no-translate], .leaflet-container, [data-map-root]')) return;
        for (const name of ['placeholder', 'aria-label', 'title', 'alt']) {
          const value = element.getAttribute(name);
          if (!value || value.length > 2000 || !/[A-Za-z]{2}/.test(value)) continue;
          let originals = originalAttributes.get(element);
          if (!originals) { originals = new Map(); originalAttributes.set(element, originals); }
          const previous = translatedAttributes.get(element)?.get(name);
          if (previous === value) continue;
          if (previous !== undefined) originals.set(name, value);
          else if (!originals.has(name)) originals.set(name, value);
          result.push({ element, name, source: originals.get(name) || value });
        }
      });
      return result;
    };

    const run = async () => {
      if (busy || stopped) { queued = true; return; }
      busy = true;
      queued = false;
      const pending = collect();
      const pendingAttributes = collectAttributes();
      if (!pending.length && !pendingAttributes.length) {
        busy = false;
        observer.observe(document.body, observedAttributes);
        return;
      }
      setStatus(currentLanguage === 'hi' ? 'पृष्ठ का हिंदी में अनुवाद हो रहा है…' : `Translating page into ${languageName}…`);
      observer.disconnect();
      try {
        for (const nodes of makeBatches(pending, node => originalText.get(node) || node.nodeValue || '')) {
          if (stopped) break;
          const response = await fetch('/api/ai/translate', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ language: currentLanguage, texts: nodes.map(node => originalText.get(node) || node.nodeValue || '') }),
          });
          const body = await response.json().catch(() => null) as TranslationResponse | null;
          if (!response.ok || !body?.success || !Array.isArray(body.translations)) {
            const detail = body?.error === 'TRANSLATION_RATE_LIMITED' ? currentLanguage === 'hi' ? 'अनुवाद सेवा पर अभी सीमा लगी है।' : 'Translation is temporarily rate-limited.'
              : body?.error === 'TRANSLATION_QUOTA_EXHAUSTED' ? 'The translation model has reached its usage limit.'
                : 'Automatic translation is unavailable; showing the original page text.';
            setStatus(currentLanguage === 'hi' && body?.error !== 'TRANSLATION_RATE_LIMITED' ? 'स्वचालित अनुवाद उपलब्ध नहीं है; मूल पाठ दिखाया जा रहा है।' : detail);
            failed = true;
            break;
          }
          nodes.forEach((node, index) => {
            const value = body.translations?.[index];
            if (typeof value === 'string' && node.isConnected) {
              if ((node.nodeValue || '') !== originalText.get(node)) {
                originalText.set(node, node.nodeValue || '');
                queued = true;
                return;
              }
              translatedText.set(node, value);
              node.nodeValue = value;
            }
          });
        }
        for (const batch of makeBatches(pendingAttributes, item => item.source)) {
          if (stopped) break;
          const response = await fetch('/api/ai/translate', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ language: currentLanguage, texts: batch.map(item => item.source) }),
          });
          const body = await response.json().catch(() => null) as TranslationResponse | null;
          if (!response.ok || !body?.success || !Array.isArray(body.translations)) {
            failed = true;
            setStatus(currentLanguage === 'hi' ? 'कुछ पृष्ठ सामग्री का अनुवाद नहीं हो पाया।' : 'Some page text could not be translated.');
            break;
          }
          batch.forEach((item, index) => {
            const value = body.translations?.[index];
            if (typeof value !== 'string' || item.element.getAttribute(item.name) !== item.source) return;
            let values = translatedAttributes.get(item.element);
            if (!values) { values = new Map(); translatedAttributes.set(item.element, values); }
            values.set(item.name, value);
            item.element.setAttribute(item.name, value);
          });
        }
        if (!stopped && !failed) {
          document.documentElement.setAttribute('data-virasat-translated', currentLanguage);
          setStatus(currentLanguage === 'hi' ? 'स्वचालित हिंदी अनुवाद · विरासत AI' : `Automatic ${languageName} translation · Virasat AI`);
        }
      } catch {
        failed = true;
        setStatus(currentLanguage === 'hi' ? 'स्वचालित अनुवाद उपलब्ध नहीं है; मूल पाठ दिखाया जा रहा है।' : 'Automatic translation is unavailable; showing the original page text.');
      } finally {
        busy = false;
        if (!failed && !stopped && (collect().length || collectAttributes().length)) queued = true;
        if (!stopped) observer.observe(document.body, observedAttributes);
        if (queued && !stopped) schedule();
      }
    };

    function schedule() {
      if (stopped) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { void run(); }, 180);
    }

    // Restore this page's source text before translating into a different language.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let current: Node | null;
    observer.disconnect();
    while ((current = walker.nextNode())) {
      const text = current as Text;
      const source = originalText.get(text);
      if (source !== undefined && translatedText.has(text)) text.nodeValue = source;
      translatedText.delete(text);
    }
    document.body.querySelectorAll('[placeholder], [aria-label], [title], img[alt]').forEach(element => {
      const originals = originalAttributes.get(element);
      const translated = translatedAttributes.get(element);
      originals?.forEach((value, name) => { if (translated?.has(name)) element.setAttribute(name, value); });
      translated?.clear();
    });
    observer.observe(document.body, observedAttributes);
    schedule();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      observer.disconnect();
      const restoreWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let item: Node | null;
      while ((item = restoreWalker.nextNode())) {
        const text = item as Text;
        const source = originalText.get(text);
        if (source !== undefined && translatedText.has(text)) text.nodeValue = source;
        translatedText.delete(text);
      }
      document.body.querySelectorAll('[placeholder], [aria-label], [title], img[alt]').forEach(element => {
        const originals = originalAttributes.get(element);
        const translated = translatedAttributes.get(element);
        originals?.forEach((value, name) => { if (translated?.has(name)) element.setAttribute(name, value); });
        translated?.clear();
      });
      document.documentElement.removeAttribute('data-virasat-translated');
    };
  }, [currentLanguage, languageName]);

  if (!status || currentLanguage === 'en') return null;
  return <div data-virasat-no-translate role="status" aria-live="polite" className="fixed bottom-3 left-3 z-[10000] max-w-[calc(100vw-1.5rem)] rounded-full border border-stone-200 bg-white/95 px-3 py-1.5 text-xs text-stone-600 shadow-lg backdrop-blur">
    {status}
  </div>;
};
