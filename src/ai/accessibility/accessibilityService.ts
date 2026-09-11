/**
 * Accessibility Domain Service for Virasat AI Assistant
 * Provides verified accessibility facts (ramps, wheelchairs, lifts, terrain flatness) for Indian heritage sites.
 */

import { masterTourismDataService } from '../../server/masterTourismDataService';

export interface AccessibilityRecord {
  place_id: string;
  place_name: string;
  city: string;
  state: string;
  wheelchair_access: string;
  ramp_available: boolean;
  accessible_toilet: boolean;
  elevator_available: boolean;
  tactile_paving_or_braille: boolean;
  audio_guide_available: boolean;
  flat_terrain_percentage: number;
  accessibility_notes: string;
  provenance: string;
}

export class AccessibilityService {
  public getAccessibilityInfo(placeOrCity: string): AccessibilityRecord | null {
    if (!placeOrCity) return null;
    const lower = placeOrCity.toLowerCase().trim();
    const data: AccessibilityRecord[] = masterTourismDataService.accessibilityData || [];

    for (const item of data) {
      if (
        item.place_id?.toLowerCase() === lower ||
        item.place_name?.toLowerCase().includes(lower) ||
        lower.includes(item.place_name?.toLowerCase()) ||
        item.city?.toLowerCase().includes(lower)
      ) {
        return item;
      }
    }

    // Fallback if not found in data
    return null;
  }
}

export const accessibilityService = new AccessibilityService();
