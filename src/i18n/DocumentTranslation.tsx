import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateTextToHindi } from './hindiDictionary';

type TranslationResponse = { success?: boolean; translations?: string[]; error?: string };

const originalText = new WeakMap<Text, string>();
const translatedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = new WeakMap<Element, Map<string, string>>();
const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CANVAS', 'CODE', 'PRE', 'TEXTAREA', 'INPUT']);
const observedAttributes: MutationObserverInit = {
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['placeholder', 'aria-label', 'title', 'alt'],
  subtree: true,
};

function makeBatches<T>(items: T[], textOf: (item: T) => string): T[][] {
  const batches: T[][] = [];
  let batch: T[] = [];
  let characters = 0;
  for (const item of items) {
    const length = textOf(item).length;
    if (batch.length && (batch.length >= 25 || characters + length > 7500)) {
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
  if (!value.trim() || value.length > 3000 || !/[A-Za-z]/.test(value)) return true;
  let element = node.parentElement;
  while (element && element !== document.body) {
    if (
      skipTags.has(element.tagName) ||
      element.isContentEditable ||
      element.hasAttribute('data-virasat-no-translate') ||
      element.closest('.leaflet-container, [data-map-root]')
    ) {
      return true;
    }
    element = element.parentElement;
  }
  return false;
}

/**
 * High-performance bilingual translation engine.
 * Converts every text node and attribute across the website into Hindi synchronously
 * using the rich offline dictionary, and enhances dynamic content via the API.
 */
export const DocumentTranslation: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (currentLanguage !== 'hi' || !document.body) {
      document.documentElement.removeAttribute('data-virasat-translated');
      return;
    }

    let stopped = false;
    let busy = false;
    let queued = false;
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
      document.body.querySelectorAll('[placeholder], [aria-label], [title], img[alt]').forEach((element) => {
        if (element.closest('[data-virasat-no-translate], .leaflet-container, [data-map-root]')) return;
        for (const name of ['placeholder', 'aria-label', 'title', 'alt']) {
          const value = element.getAttribute(name);
          if (!value || value.length > 3000 || !/[A-Za-z]/.test(value)) continue;
          let originals = originalAttributes.get(element);
          if (!originals) {
            originals = new Map();
            originalAttributes.set(element, originals);
          }
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
      if (busy || stopped) {
        queued = true;
        return;
      }
      busy = true;
      queued = false;

      const pending = collect();
      const pendingAttributes = collectAttributes();

      if (!pending.length && !pendingAttributes.length) {
        busy = false;
        observer.observe(document.body, observedAttributes);
        return;
      }

      observer.disconnect();

      try {
        // Step 1: Instant local dictionary translation pass (0ms latency)
        pending.forEach((node) => {
          if (!node.isConnected) return;
          const raw = originalText.get(node) || node.nodeValue || '';
          const translated = translateTextToHindi(raw);
          if (translated !== raw) {
            translatedText.set(node, translated);
            node.nodeValue = translated;
          }
        });

        pendingAttributes.forEach((item) => {
          const raw = item.source;
          const translated = translateTextToHindi(raw);
          if (translated !== raw) {
            let values = translatedAttributes.get(item.element);
            if (!values) {
              values = new Map();
              translatedAttributes.set(item.element, values);
            }
            values.set(item.name, translated);
            item.element.setAttribute(item.name, translated);
          }
        });

        document.documentElement.setAttribute('data-virasat-translated', 'hi');
        setStatus('🇮🇳 हिन्दी संस्करण सक्रिय');

        // Step 2: Background API pass for remaining complex paragraphs
        const remainingNodes = pending.filter((node) => {
          const current = node.nodeValue || '';
          return /[A-Za-z]{3,}/.test(current);
        });

        if (remainingNodes.length > 0) {
          for (const batch of makeBatches(remainingNodes, (n) => originalText.get(n) || n.nodeValue || '')) {
            if (stopped) break;
            try {
              const res = await fetch('/api/ai/translate', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                  language: 'hi',
                  texts: batch.map((n) => originalText.get(n) || n.nodeValue || ''),
                }),
              });
              if (res.ok) {
                const data = (await res.json()) as TranslationResponse;
                if (data.success && Array.isArray(data.translations)) {
                  batch.forEach((node, idx) => {
                    const val = data.translations?.[idx];
                    if (typeof val === 'string' && val.trim() && node.isConnected) {
                      translatedText.set(node, val);
                      node.nodeValue = val;
                    }
                  });
                }
              }
            } catch {
              // Local dictionary already covered the core content
            }
          }
        }
      } catch (err) {
        console.error('Translation error:', err);
      } finally {
        busy = false;
        if (!stopped && (collect().length || collectAttributes().length)) queued = true;
        if (!stopped) observer.observe(document.body, observedAttributes);
        if (queued && !stopped) schedule();
      }
    };

    function schedule() {
      if (stopped) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void run();
      }, 100);
    }

    // Initial pass on mount or language switch
    schedule();

    // Auto-dismiss status toast after 2.5s
    const statusTimer = setTimeout(() => {
      setStatus('');
    }, 2500);

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      clearTimeout(statusTimer);
      observer.disconnect();

      // Cleanly restore English original text on unmount or language reset
      const restoreWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let item: Node | null;
      while ((item = restoreWalker.nextNode())) {
        const text = item as Text;
        const source = originalText.get(text);
        if (source !== undefined && translatedText.has(text)) text.nodeValue = source;
        translatedText.delete(text);
      }

      document.body.querySelectorAll('[placeholder], [aria-label], [title], img[alt]').forEach((element) => {
        const originals = originalAttributes.get(element);
        const translated = translatedAttributes.get(element);
        originals?.forEach((value, name) => {
          if (translated?.has(name)) element.setAttribute(name, value);
        });
        translated?.clear();
      });

      document.documentElement.removeAttribute('data-virasat-translated');
    };
  }, [currentLanguage]);

  if (!status || currentLanguage !== 'hi') return null;

  return (
    <div
      data-virasat-no-translate
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[10000] rounded-full border border-orange-300 bg-orange-950/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md animate-fadeIn"
    >
      {status}
    </div>
  );
};
