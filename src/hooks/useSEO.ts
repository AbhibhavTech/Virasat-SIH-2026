import { useEffect } from 'react';
import { updatePageSEO, PageSEOConfig } from '../utils/seo';

/**
 * Hook to dynamically bind page title, OpenGraph tags, canonical links,
 * and JSON-LD structured data on component mount.
 */
export function useSEO(config: PageSEOConfig, deps: any[] = []) {
  useEffect(() => {
    updatePageSEO(config);
  }, [config.title, config.description, config.canonicalUrl, config.ogImage, ...deps]);
}
