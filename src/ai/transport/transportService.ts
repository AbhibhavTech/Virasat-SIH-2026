/**
 * Transport and Tariff Domain Service for Virasat AI Assistant
 * Provides verified fare estimates, RTO rate cards, and transit details across Indian cities.
 */

import { masterTourismDataService } from '../../server/masterTourismDataService';
import { formatINR } from '../utils/formatters';

export interface FareEstimateResult {
  city: string;
  service: string;
  base_fare: string;
  per_km_rate: string;
  night_charge_policy?: string;
  source: string;
  notes: string[];
}

export class TransportService {
  public getFareEstimate(cityInput?: string, mode?: string): FareEstimateResult {
    const city = (cityInput || 'Mumbai').trim();
    const cityLower = city.toLowerCase();

    if (cityLower.includes('delhi')) {
      return {
        city: 'Delhi (NCR)',
        service: mode === 'taxi' ? 'Metered Non-AC / AC Taxi' : 'CNG Auto Rickshaw',
        base_fare: mode === 'taxi' ? '₹40 (first 1.5 km)' : '₹30 (first 1.5 km)',
        per_km_rate: mode === 'taxi' ? '₹17 – ₹20 / km' : '₹11 / km',
        night_charge_policy: '25% extra between 11:00 PM and 5:00 AM',
        source: 'Delhi Transport Department (RTO Gazetted Tariffs)',
        notes: [
          'Always insist on running the electronic meter or use the official prepaid booths at NDLS/Airport.',
          'Metro smart cards give 10% discount on all Delhi Metro routes.',
        ],
      };
    }

    if (cityLower.includes('jaipur')) {
      return {
        city: 'Jaipur',
        service: 'Auto Rickshaw / City Cab',
        base_fare: '₹30 (first 1.5 km)',
        per_km_rate: '₹12 – ₹15 / km',
        night_charge_policy: '20% surcharge between 10:00 PM and 6:00 AM',
        source: 'Rajasthan State Transport Authority',
        notes: [
          'Prepaid auto booths are active at Jaipur Junction railway station and Sindhi Camp bus station.',
          'E-rickshaws operate inside the walled Pink City at ₹10 – ₹20 shared flat rates.',
        ],
      };
    }

    // Default to Mumbai
    return {
      city: 'Mumbai',
      service: mode === 'taxi' ? 'Black & Yellow (Kaali-Peeli) Taxi' : 'CNG Auto Rickshaw',
      base_fare: mode === 'taxi' ? '₹28 (first 1.5 km)' : '₹23 (first 1.5 km)',
      per_km_rate: mode === 'taxi' ? '₹18.66 / km' : '₹15.33 / km',
      night_charge_policy: '25% night charge between 12:00 Midnight and 5:00 AM',
      source: 'Mumbai Metropolitan Region Transport Authority (MMRTA)',
      notes: [
        'Autos are NOT permitted in South Mumbai (south of Sion/Mahim); black-and-yellow cabs operate city-wide.',
        'Suburban railway tickets start at ₹5 (Second Class) and ₹50 (AC Local).',
      ],
    };
  }
}

export const transportService = new TransportService();
