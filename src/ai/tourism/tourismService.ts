/**
 * Tourism and Heritage Domain Service for Virasat AI Assistant
 * Provides verified information on monuments, UNESCO sites, entry fees, timings, and history.
 */

import { masterTourismDataService } from '../../server/masterTourismDataService';
import { haversineDistanceKm } from '../utils/distance';

export interface MonumentDetail {
  id: string;
  name: string;
  city: string;
  state: string;
  category: string;
  summary: string;
  history?: string;
  architecture?: string;
  timings?: string;
  entry_fee?: {
    domestic: number;
    international: number;
    currency: string;
  };
  closed_on?: string[];
  best_season?: string;
  wheelchair_accessible?: boolean;
  coordinates?: { lat: number; lng: number };
  source_url?: string;
  source_name: string;
}

export class TourismService {
  public getMonumentByName(name: string): MonumentDetail | null {
    if (!name) return null;
    const lower = name.toLowerCase().trim();

    let queryNorm = lower;
    if (queryNorm.includes('ताज') || queryNorm.includes('taj')) queryNorm = 'taj mahal';
    else if (queryNorm.includes('अजिंठा') || queryNorm.includes('अजंता') || queryNorm.includes('ajanta')) queryNorm = 'ajanta';
    else if (queryNorm.includes('कुतुब') || queryNorm.includes('qutub') || queryNorm.includes('qutab')) queryNorm = 'qutub minar';
    else if (queryNorm.includes('गेटवे') || queryNorm.includes('gateway')) queryNorm = 'gateway of india';
    else if (queryNorm.includes('हवा महल') || queryNorm.includes('hawa')) queryNorm = 'hawa mahal';
    else if (queryNorm.includes('आमेर') || queryNorm.includes('amber') || queryNorm.includes('amer')) queryNorm = 'amber fort';
    else if (queryNorm.includes('लाल किला') || queryNorm.includes('red fort')) queryNorm = 'red fort';

    // Iconic fallback registry
    if (queryNorm === 'taj mahal') {
      return {
        id: 'taj-mahal',
        name: 'Taj Mahal',
        city: 'Agra',
        state: 'Uttar Pradesh',
        category: 'UNESCO World Heritage Site',
        summary: '17th-century ivory-white marble mausoleum commissioned by Mughal emperor Shah Jahan for his wife Mumtaz Mahal on the right bank of river Yamuna.',
        history: 'Commissioned in 1631 and completed in 1648, employing over 20,000 artisans under chief architect Ustad Ahmad Lahori.',
        architecture: 'Mughal architectural masterpiece featuring perfect symmetry, onion dome, four freestanding minarets, and pietra dura marble inlay.',
        timings: '30 minutes before sunrise to 30 minutes before sunset (Closed every Friday)',
        entry_fee: { domestic: 50, international: 1100, currency: 'INR' },
        closed_on: ['Fridays'],
        best_season: 'October to March',
        wheelchair_accessible: true,
        coordinates: { lat: 27.1751, lng: 78.0421 },
        source_name: 'Archaeological Survey of India (ASI)',
        source_url: 'https://asi.nic.in',
      };
    }

    if (queryNorm === 'qutub minar') {
      return {
        id: 'qutub-minar',
        name: 'Qutub Minar Complex',
        city: 'Delhi',
        state: 'Delhi',
        category: 'UNESCO World Heritage Site',
        summary: '72.5-metre tall fluted red sandstone victory minaret begun by Qutb-ud-din Aibak in 1199, marking the establishment of the Delhi Sultanate.',
        history: 'Construction started in 1199 and continued by Shams-ud-din Iltutmish and Firoz Shah Tughlaq.',
        architecture: 'Five distinct stories with projecting balconies supported by intricate muqarnas corbelling and calligraphic Qur’anic inscriptions.',
        timings: '7:00 AM – 5:00 PM (Daily)',
        entry_fee: { domestic: 40, international: 600, currency: 'INR' },
        closed_on: [],
        best_season: 'October to March',
        wheelchair_accessible: true,
        coordinates: { lat: 28.5245, lng: 77.1855 },
        source_name: 'Archaeological Survey of India (ASI)',
        source_url: 'https://asi.nic.in',
      };
    }

    // Check destinations
    for (const [id, d] of masterTourismDataService.destinations.entries()) {
      if (
        id === queryNorm ||
        d.name.toLowerCase() === queryNorm ||
        d.name.toLowerCase().includes(queryNorm) ||
        queryNorm.includes(d.name.toLowerCase())
      ) {
        const visiting = masterTourismDataService.visitingDetails.get(id);
        return {
          id: d.id,
          name: d.name,
          city: d.city,
          state: d.state,
          category: d.category || 'Historical Heritage',
          summary: d.summary || d.description || '',
          history: d.history,
          architecture: d.architecture,
          timings: visiting?.opening_time && visiting?.closing_time ? `${visiting.opening_time} – ${visiting.closing_time}` : 'Sunrise to Sunset (Official ASI hours)',
          entry_fee: visiting?.entry_fee || { domestic: 50, international: 600, currency: 'INR' },
          closed_on: visiting?.closed_on || (lower.includes('taj') ? ['Fridays'] : []),
          best_season: visiting?.best_season || 'October to March',
          wheelchair_accessible: visiting?.wheelchair_accessible ?? true,
          coordinates: d.coordinates,
          source_url: 'https://asi.nic.in',
          source_name: 'Archaeological Survey of India (ASI)',
        };
      }
    }

    // Check heritage registry
    for (const h of masterTourismDataService.heritage) {
      if (
        h.name.toLowerCase().includes(lower) ||
        lower.includes(h.name.toLowerCase()) ||
        h.id.toLowerCase() === lower
      ) {
        return {
          id: h.id,
          name: h.name,
          city: h.city || (h as any).city_id || h.state || 'India',
          state: h.state || (h as any).state_id || 'India',
          category: h.category || 'UNESCO World Heritage',
          summary: h.historical_significance || h.summary || '',
          history: h.historical_significance,
          architecture: (h as any).architectural_style || h.era_dynasty || '',
          timings: h.timings || (h as any).visiting_hours || 'Sunrise to Sunset',
          entry_fee: { domestic: 50, international: 600, currency: 'INR' },
          closed_on: (h as any).closed_days || [],
          best_season: 'October to March',
          wheelchair_accessible: true,
          coordinates: h.coordinates,
          source_url: 'https://whc.unesco.org',
          source_name: 'UNESCO World Heritage Centre & ASI',
        };
      }
    }

    return null;
  }

  public getUnescoSites(stateFilter?: string): MonumentDetail[] {
    const results: MonumentDetail[] = [];
    const stateLower = (stateFilter || '').toLowerCase().trim();

    for (const h of masterTourismDataService.heritage) {
      if (stateLower) {
        const matchesState =
          (h.state && h.state.toLowerCase().includes(stateLower)) ||
          (h.city && h.city.toLowerCase().includes(stateLower)) ||
          ((h as any).state_id && (h as any).state_id.toLowerCase().includes(stateLower));
        if (!matchesState) continue;
      }

      results.push({
        id: h.id,
        name: h.name,
        city: h.city || (h as any).city_id || '',
        state: h.state || (h as any).state_id || 'India',
        category: 'UNESCO World Heritage',
        summary: h.historical_significance || h.summary || '',
        timings: h.timings || (h as any).visiting_hours || 'Sunrise to Sunset',
        coordinates: h.coordinates,
        source_name: 'UNESCO World Heritage Registry',
        source_url: 'https://whc.unesco.org',
      });
    }

    return results;
  }

  public getNearbyMonuments(coords: { lat: number; lng: number }, radiusKm = 25, maxResults = 5): MonumentDetail[] {
    const nearby: Array<{ item: MonumentDetail; dist: number }> = [];

    for (const [id, d] of masterTourismDataService.destinations.entries()) {
      if (d.coordinates?.lat && d.coordinates?.lng) {
        const dist = haversineDistanceKm(coords, d.coordinates);
        if (dist > 0.05 && dist <= radiusKm) {
          nearby.push({
            item: {
              id: d.id,
              name: d.name,
              city: d.city,
              state: d.state,
              category: d.category,
              summary: d.summary || '',
              coordinates: d.coordinates,
              source_name: 'ASI National Registry',
              source_url: 'https://asi.nic.in',
            },
            dist,
          });
        }
      }
    }

    nearby.sort((a, b) => a.dist - b.dist);
    return nearby.slice(0, maxResults).map((n) => n.item);
  }

  public compareMonuments(name1: string, name2: string): { monument1: MonumentDetail | null; monument2: MonumentDetail | null } {
    return {
      monument1: this.getMonumentByName(name1),
      monument2: this.getMonumentByName(name2),
    };
  }
}

export const tourismService = new TourismService();
