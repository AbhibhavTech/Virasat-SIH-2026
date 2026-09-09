/**
 * Virasat SEO & Schema.org Structured Data Generator
 * Provides dynamic OpenGraph, Twitter Cards, canonical URLs, and JSON-LD markup.
 */

export interface PageSEOConfig {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'place';
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const SITE_NAME = 'Virasat';
const BASE_URL = 'https://virasat.in';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80';
const DEFAULT_DESCRIPTION = "Explore India's verified monuments, cultural heritage, and living traditions with AI travel planning and 3D architectural exploration.";

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Virasat — Living Heritage of India',
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateTouristAttractionSchema(place: {
  id?: string;
  name: string;
  summary?: string;
  description?: string;
  category?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  coordinates?: { lat: number; lng: number };
  thumbnail_url?: string;
  rating?: number;
}) {
  const latitude = place.lat ?? place.coordinates?.lat;
  const longitude = place.lng ?? place.coordinates?.lng;
  const desc = place.description || place.summary || DEFAULT_DESCRIPTION;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: desc,
    touristType: ['Cultural Tourist', 'Heritage Explorer', 'Architectural Enthusiast'],
    isAccessibleForFree: false,
  };

  if (place.thumbnail_url) {
    schema.image = place.thumbnail_url;
  }

  if (latitude !== undefined && longitude !== undefined) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    };
  }

  if (place.city || place.state) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: place.city,
      addressRegion: place.state,
      addressCountry: 'IN',
    };
  }

  if (place.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: place.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 120,
    };
  }

  return schema;
}

export function generateCitySchema(city: {
  name: string;
  state?: string;
  description?: string;
  placesCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: city.name,
    description: city.description || `Explore cultural landmarks and monuments in ${city.name}.`,
    containedInPlace: city.state ? {
      '@type': 'AdministrativeArea',
      name: city.state,
    } : undefined,
    touristType: ['Heritage', 'Culture', 'Culinary', 'Architecture'],
  };
}

export function generateTripSchema(trip: {
  title: string;
  description?: string;
  days?: number;
  stops?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.description || `Heritage itinerary across India spanning ${trip.days || 1} days.`,
    itinerary: trip.stops?.map((stop, index) => ({
      '@type': 'TouristAttraction',
      name: stop,
      position: index + 1,
    })),
  };
}

/**
 * Updates DOM head elements dynamically
 */
export function updatePageSEO(config: PageSEOConfig): void {
  if (typeof document === 'undefined') return;

  // Title tag
  const formattedTitle = config.title.includes(SITE_NAME)
    ? config.title
    : `${config.title} | ${SITE_NAME} — India's Living Heritage`;
  document.title = formattedTitle;

  const description = config.description || DEFAULT_DESCRIPTION;
  const image = config.ogImage || DEFAULT_IMAGE;
  const canonical = config.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : BASE_URL);

  // Helper to set or create meta tag
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to set or create link tag
  const setLink = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // Standard Meta Tags
  setMeta('name', 'description', description);
  setMeta('name', 'robots', config.noIndex ? 'noindex, nofollow' : 'index, follow');
  setLink('canonical', canonical);

  // OpenGraph Tags
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:title', formattedTitle);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', config.ogType || 'website');
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:image', image);

  // Twitter Card Tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', formattedTitle);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);

  // JSON-LD Structured Data
  if (config.jsonLd) {
    let script = document.getElementById('virasat-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'virasat-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(config.jsonLd);
  }
}
