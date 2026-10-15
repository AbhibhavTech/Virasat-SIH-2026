import fs from 'fs';
import path from 'path';
import { INDIAN_DESTINATION_ALIASES } from './entityExtractor';

interface CityRecord {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  description?: string;
}

interface CityMention {
  name: string;
  start: number;
  end: number;
}

export interface CityComparisonAnswer {
  reply: string;
  suggestedActions: string[];
  actions: Array<{ type: 'open_map' | 'plan_itinerary'; label: string; url: string }>;
  sources: string[];
}

let cityRegistry: CityRecord[] | null = null;

function loadCityRegistry(): CityRecord[] {
  if (!cityRegistry) {
    const filePath = path.join(process.cwd(), 'data', 'cities.json');
    try {
      cityRegistry = JSON.parse(fs.readFileSync(filePath, 'utf8')) as CityRecord[];
    } catch {
      cityRegistry = [];
    }
  }
  return cityRegistry;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getCityMentions(text: string): CityMention[] {
  const candidates: CityMention[] = [];
  const aliases = Object.entries(INDIAN_DESTINATION_ALIASES)
    .sort(([left], [right]) => right.length - left.length);

  for (const [alias, canonicalName] of aliases) {
    const pattern = new RegExp(`(^|[^a-z])(${escapeRegExp(alias)})(?=$|[^a-z])`, 'gi');
    for (const match of text.matchAll(pattern)) {
      const start = (match.index || 0) + match[1].length;
      candidates.push({ name: canonicalName, start, end: start + match[2].length });
    }
  }

  candidates.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const mentions: CityMention[] = [];
  const seenNames = new Set<string>();
  for (const candidate of candidates) {
    const overlaps = mentions.some((item) => candidate.start < item.end && candidate.end > item.start);
    const key = candidate.name.toLowerCase();
    if (!overlaps && !seenNames.has(key)) {
      mentions.push(candidate);
      seenNames.add(key);
    }
  }
  return mentions.sort((a, b) => a.start - b.start);
}

function findCityRecord(name: string): CityRecord | undefined {
  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return loadCityRegistry().find((city) => {
    const cityName = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const cityId = city.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return cityName === key || cityId === key;
  });
}

function findOriginMention(text: string, mentions: CityMention[]): CityMention | undefined {
  const closeContext = /\b(?:closer|closest|nearer|nearest|distance|far|close)\b/i.test(text);
  const explicitOrigin = mentions.find((mention) => {
    const prefix = text.slice(Math.max(0, mention.start - 36), mention.start);
    return /\b(?:from|starting from)\s*$/i.test(prefix);
  });
  if (explicitOrigin) return explicitOrigin;
  if (mentions.length > 1) {
    const firstToSecond = text.slice(mentions[0].end, mentions[1].start);
    if (/\bto\b/i.test(firstToSecond)) return mentions[0];
  }
  return mentions.find((mention) => {
    const prefix = text.slice(Math.max(0, mention.start - 36), mention.start);
    return /\b(?:to|from|near|around)\s*$/i.test(prefix) && closeContext;
  });
}

function haversineKm(first: CityRecord, second: CityRecord): number | null {
  if (![first.lat, first.lng, second.lat, second.lng].every(Number.isFinite)) return null;
  // The national centroid is used as a placeholder in some records; never present it as a city coordinate.
  const isPlaceholder = (city: CityRecord) => Math.abs(city.lat - 20.5937) < 0.0001 && Math.abs(city.lng - 78.9629) < 0.0001;
  if (isPlaceholder(first) || isPlaceholder(second)) return null;

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(second.lat - first.lat);
  const longitudeDelta = toRadians(second.lng - first.lng);
  const a = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(first.lat)) * Math.cos(toRadians(second.lat)) *
    Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatKm(distance: number): string {
  return `${Math.round(distance / 10) * 10} km`;
}

export function buildCityComparisonAnswer(rawText: string, isHinglish: boolean): CityComparisonAnswer | null {
  const text = rawText.toLowerCase();
  const mentions = getCityMentions(text);
  if (mentions.length < 2) return null;

  const asksDistance = /\b(closer|closest|nearer|nearest|distance|how far|farther|farthest|paas|nazdeek|kitni door|kitna door)\b/i.test(text);
  if (!asksDistance && /\b(train|flight|air|bus|road|hotel|hotels|restaurant|food|itinerary|budget)\b/i.test(text)) return null;
  const cityRecords = mentions.map((mention) => ({ mention, city: findCityRecord(mention.name) }));
  if (cityRecords.some((item) => !item.city)) return null;

  if (asksDistance) {
    const originMention = findOriginMention(text, mentions);
    let origin = originMention ? findCityRecord(originMention.name) : undefined;
    let destinations = cityRecords.map((item) => item.city!);
    const asksWhichIsCloser = /\b(closer|closest|nearer|nearest|which|kaun|kaunsi|kaunsa|konsa|konsi)\b/i.test(text);

    if (origin) {
      destinations = destinations.filter((city) => city.name.toLowerCase() !== origin!.name.toLowerCase());
    } else if (mentions.length === 2 && !asksWhichIsCloser) {
      // “Distance between A and B” needs no separate starting city.
      origin = destinations.shift();
    } else if (mentions.length === 2 && asksWhichIsCloser) {
      return {
        reply: isHinglish
          ? `**${mentions[0].name}** aur **${mentions[1].name}** mein kaun paas hai, yeh batane ke liye reference city bhi chahiye. Kis shehar se compare karun?`
          : 'I need a reference point to tell which is closer. Which starting city should I compare them from?',
        suggestedActions: ['From Mumbai', 'From Delhi', 'From your location'],
        actions: [],
        sources: [],
      };
    } else {
      return null;
    }

    if (!origin || destinations.length === 0) return null;
    const distances = destinations
      .map((city) => ({ city, km: haversineKm(origin!, city) }))
      .filter((entry): entry is { city: CityRecord; km: number } => entry.km !== null)
      .sort((a, b) => a.km - b.km);
    if (distances.length === 0) return null;

    const closest = distances[0];
    const distanceLines = distances.map(({ city, km }) => `• **${city.name}**: about ${formatKm(km)} straight-line from ${origin!.name}`).join('\n');
    const isSingleDestination = distances.length === 1;
    const difference = distances.length > 1
      ? Math.round(distances[1].km / 10) * 10 - Math.round(closest.km / 10) * 10
      : 0;
    const reply = isHinglish
      ? `${isSingleDestination ? `**${closest.city.name}**, **${origin.name}** se` : `In options mein **${closest.city.name}**, **${origin.name}** ke sabse paas hai`} — seedhi-line estimate lagbhag **${formatKm(closest.km)}** hai.\n\n${distanceLines}${difference ? `\n\nYeh agle option se lagbhag **${difference} km** paas hai.` : ''}\n\nYeh city-center coordinates se rough distance hai; actual road aur flight routes alag honge.`
      : `${isSingleDestination ? `**${closest.city.name}** is` : `**${closest.city.name}** is the closest option to **${origin.name}**`} — about **${formatKm(closest.km)}** in a straight line.\n\n${distanceLines}${difference ? `\n\nIt is about **${difference} km** closer than the next option.` : ''}\n\nThis is an approximate city-center estimate; actual road and flight routes differ.`;

    return {
      reply,
      suggestedActions: [`Plan a ${closest.city.name} trip`, `Compare ${origin.name} routes`, 'Open map'],
      actions: [
        { type: 'open_map', label: `Show ${origin.name} to ${closest.city.name} on Map`, url: `/map?origin=${encodeURIComponent(origin.name)}&destination=${encodeURIComponent(closest.city.name)}` },
        { type: 'plan_itinerary', label: `Plan ${closest.city.name} Trip`, url: `/itinerary?city=${encodeURIComponent(closest.city.name)}&days=3` },
      ],
      sources: ['Virasat City Coordinate Registry (straight-line estimate)'],
    };
  }

  if (mentions.length !== 2) return null;
  const first = cityRecords[0].city!;
  const second = cityRecords[1].city!;
  const reply = isHinglish
    ? `**${first.name} (${first.state})**: ${first.description || 'Virasat ke city registry mein listed destination.'}\n\n**${second.name} (${second.state})**: ${second.description || 'Virasat ke city registry mein listed destination.'}\n\nDono ka experience alag hai. Aap heritage, nature, food, budget ya travel time mein se kis basis par compare karna chahte hain?`
    : `**${first.name} (${first.state})**: ${first.description || 'A destination listed in Virasat’s city registry.'}\n\n**${second.name} (${second.state})**: ${second.description || 'A destination listed in Virasat’s city registry.'}\n\nThey offer different experiences. Would you like me to compare them for heritage, nature, food, budget, or travel time?`;

  return {
    reply,
    suggestedActions: [`Plan ${first.name}`, `Plan ${second.name}`, `Compare distance from ${first.name}`],
    actions: [
      { type: 'plan_itinerary', label: `Plan ${first.name} Trip`, url: `/itinerary?city=${encodeURIComponent(first.name)}&days=3` },
      { type: 'plan_itinerary', label: `Plan ${second.name} Trip`, url: `/itinerary?city=${encodeURIComponent(second.name)}&days=3` },
    ],
    sources: ['Virasat City Registry'],
  };
}
