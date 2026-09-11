import fs from 'fs';
import path from 'path';
import { INDIA_TOURISM_DATABASE } from '../data/indiaTourismDatabase';
import { TransitComparison, TransitOption } from '../types';

export interface VerifiedStationNode {
  name: string;
  code: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  is_junction?: boolean;
  status: 'VERIFIED' | 'UNVERIFIED';
}

export interface VerifiedAirportNode {
  name: string;
  code: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  type?: string;
  status: 'VERIFIED' | 'UNVERIFIED';
}

export interface VerifiedPoiNode {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface ResolvedTransportDestination {
  is_poi: boolean;
  poi_name?: string;
  destination_name: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  railway_hub: {
    station_name: string;
    station_code: string;
    is_direct: boolean;
    distance_to_dest_km?: number;
    onward_connection_note?: string;
    status: 'VERIFIED' | 'NOT_AVAILABLE';
  };
  airport_hub: {
    airport_name: string;
    airport_code: string;
    is_direct: boolean;
    distance_to_dest_km?: number;
    onward_connection_note?: string;
    status: 'VERIFIED' | 'NOT_AVAILABLE';
  };
  geographic_notes?: string;
}

export interface ResolvedTransportOrigin {
  origin_label: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  nearest_railway_station: {
    name: string;
    code: string;
    distance_km: number;
    is_verified: boolean;
  };
  nearest_airport: {
    name: string;
    code: string;
    distance_km: number;
    is_verified: boolean;
  };
}

// -------------------------------------------------------------
// Geo Utility: Haversine distance in km
// -------------------------------------------------------------
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function calculateSafeHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number | null {
  if (
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) ||
    lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90 ||
    lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180
  ) {
    return null;
  }
  return haversineDistanceKm(lat1, lon1, lat2, lon2);
}

// -------------------------------------------------------------
// Master Verified Transport Registry (Initialized from authentic files)
// -------------------------------------------------------------
const MASTER_VERIFIED_STATIONS: VerifiedStationNode[] = [];
const MASTER_VERIFIED_AIRPORTS: VerifiedAirportNode[] = [];
const MASTER_VERIFIED_PLACES: VerifiedPoiNode[] = [];

// Static station aliases and popular station codes across India
export const STATION_ALIASES: Record<string, { name: string; code: string; city: string; state: string; lat: number; lng: number; is_junction?: boolean }> = {
  csmt: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353, is_junction: true },
  cst: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353, is_junction: true },
  vt: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353, is_junction: true },
  'victoria terminus': { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353, is_junction: true },
  'mumbai csmt': { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353, is_junction: true },
  churchgate: { name: 'Churchgate Railway Station (CCG)', code: 'CCG', city: 'Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8264, is_junction: false },
  'churchgate station': { name: 'Churchgate Railway Station (CCG)', code: 'CCG', city: 'Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8264, is_junction: false },
  'churchgate terminal': { name: 'Churchgate Railway Station (CCG)', code: 'CCG', city: 'Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8264, is_junction: false },
  ccg: { name: 'Churchgate Railway Station (CCG)', code: 'CCG', city: 'Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8264, is_junction: false },
  'marine lines': { name: 'Marine Lines Railway Station', code: 'MEL', city: 'Mumbai', state: 'Maharashtra', lat: 18.9438, lng: 72.8242 },
  'charni road': { name: 'Charni Road Railway Station', code: 'CYR', city: 'Mumbai', state: 'Maharashtra', lat: 18.9517, lng: 72.8188 },
  'grant road': { name: 'Grant Road Railway Station', code: 'GTR', city: 'Mumbai', state: 'Maharashtra', lat: 18.9625, lng: 72.8160 },
  'mumbai central': { name: 'Mumbai Central', code: 'MMCT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9696, lng: 72.8193, is_junction: true },
  mmct: { name: 'Mumbai Central', code: 'MMCT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9696, lng: 72.8193, is_junction: true },
  bct: { name: 'Mumbai Central', code: 'MMCT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9696, lng: 72.8193, is_junction: true },
  dadar: { name: 'Dadar Junction', code: 'DDR', city: 'Mumbai', state: 'Maharashtra', lat: 19.0178, lng: 72.8478, is_junction: true },
  ddr: { name: 'Dadar Junction', code: 'DDR', city: 'Mumbai', state: 'Maharashtra', lat: 19.0178, lng: 72.8478, is_junction: true },
  dr: { name: 'Dadar Central', code: 'DR', city: 'Mumbai', state: 'Maharashtra', lat: 19.0178, lng: 72.8478, is_junction: true },
  bandra: { name: 'Bandra Terminus', code: 'BDTS', city: 'Mumbai', state: 'Maharashtra', lat: 19.0544, lng: 72.8406, is_junction: true },
  bdts: { name: 'Bandra Terminus', code: 'BDTS', city: 'Mumbai', state: 'Maharashtra', lat: 19.0544, lng: 72.8406, is_junction: true },
  andheri: { name: 'Andheri', code: 'ADH', city: 'Mumbai', state: 'Maharashtra', lat: 19.1197, lng: 72.8464, is_junction: true },
  adh: { name: 'Andheri', code: 'ADH', city: 'Mumbai', state: 'Maharashtra', lat: 19.1197, lng: 72.8464, is_junction: true },
  borivali: { name: 'Borivali', code: 'BVI', city: 'Mumbai', state: 'Maharashtra', lat: 19.2291, lng: 72.8573, is_junction: true },
  bvi: { name: 'Borivali', code: 'BVI', city: 'Mumbai', state: 'Maharashtra', lat: 19.2291, lng: 72.8573, is_junction: true },
  thane: { name: 'Thane', code: 'TNA', city: 'Mumbai', state: 'Maharashtra', lat: 19.1860, lng: 72.9759, is_junction: true },
  tna: { name: 'Thane', code: 'TNA', city: 'Mumbai', state: 'Maharashtra', lat: 19.1860, lng: 72.9759, is_junction: true },
  kalyan: { name: 'Kalyan Junction', code: 'KYN', city: 'Mumbai', state: 'Maharashtra', lat: 19.2354, lng: 73.1306, is_junction: true },
  kyn: { name: 'Kalyan Junction', code: 'KYN', city: 'Mumbai', state: 'Maharashtra', lat: 19.2354, lng: 73.1306, is_junction: true },
  kurla: { name: 'Kurla Junction', code: 'CLA', city: 'Mumbai', state: 'Maharashtra', lat: 19.0653, lng: 72.8792, is_junction: true },
  byculla: { name: 'Byculla Railway Station', code: 'BY', city: 'Mumbai', state: 'Maharashtra', lat: 18.9757, lng: 72.8336 },
  ghatkopar: { name: 'Ghatkopar Railway Station', code: 'GC', city: 'Mumbai', state: 'Maharashtra', lat: 19.0863, lng: 72.9081, is_junction: true },
  panvel: { name: 'Panvel Junction', code: 'PNVL', city: 'Navi Mumbai', state: 'Maharashtra', lat: 18.9902, lng: 73.1188, is_junction: true },
  pnvl: { name: 'Panvel Junction', code: 'PNVL', city: 'Navi Mumbai', state: 'Maharashtra', lat: 18.9902, lng: 73.1188, is_junction: true },
  ndls: { name: 'New Delhi Railway Station (NDLS)', code: 'NDLS', city: 'New Delhi', state: 'Delhi (NCT)', lat: 28.6430, lng: 77.2195, is_junction: true },
  dli: { name: 'Old Delhi Railway Station (DLI)', code: 'DLI', city: 'Delhi', state: 'Delhi (NCT)', lat: 28.6606, lng: 77.2281, is_junction: true },
  nzm: { name: 'Hazrat Nizamuddin (NZM)', code: 'NZM', city: 'New Delhi', state: 'Delhi (NCT)', lat: 28.5888, lng: 77.2534, is_junction: true },
  anvt: { name: 'Anand Vihar Terminal (ANVT)', code: 'ANVT', city: 'Delhi', state: 'Delhi (NCT)', lat: 28.6508, lng: 77.3153, is_junction: true },
  howrah: { name: 'Howrah Junction (HWH)', code: 'HWH', city: 'Kolkata', state: 'West Bengal', lat: 22.5838, lng: 88.3426, is_junction: true },
  'howrah junction': { name: 'Howrah Junction (HWH)', code: 'HWH', city: 'Kolkata', state: 'West Bengal', lat: 22.5838, lng: 88.3426, is_junction: true },
  hwh: { name: 'Howrah Junction (HWH)', code: 'HWH', city: 'Kolkata', state: 'West Bengal', lat: 22.5838, lng: 88.3426, is_junction: true },
  sealdah: { name: 'Sealdah (SDAH)', code: 'SDAH', city: 'Kolkata', state: 'West Bengal', lat: 22.5675, lng: 88.3713, is_junction: true },
  sdah: { name: 'Sealdah (SDAH)', code: 'SDAH', city: 'Kolkata', state: 'West Bengal', lat: 22.5675, lng: 88.3713, is_junction: true },
  koaa: { name: 'Kolkata Railway Station (KOAA)', code: 'KOAA', city: 'Kolkata', state: 'West Bengal', lat: 22.6022, lng: 88.3789, is_junction: true },
  'new delhi': { name: 'New Delhi Railway Station (NDLS)', code: 'NDLS', city: 'New Delhi', state: 'Delhi (NCT)', lat: 28.6430, lng: 77.2195, is_junction: true },
  'old delhi': { name: 'Old Delhi Railway Station (DLI)', code: 'DLI', city: 'Delhi', state: 'Delhi (NCT)', lat: 28.6606, lng: 77.2281, is_junction: true },
  nizamuddin: { name: 'Hazrat Nizamuddin (NZM)', code: 'NZM', city: 'New Delhi', state: 'Delhi (NCT)', lat: 28.5888, lng: 77.2534, is_junction: true },
  'hazrat nizamuddin': { name: 'Hazrat Nizamuddin (NZM)', code: 'NZM', city: 'New Delhi', state: 'Delhi (NCT)', lat: 28.5888, lng: 77.2534, is_junction: true },
  'anand vihar': { name: 'Anand Vihar Terminal (ANVT)', code: 'ANVT', city: 'Delhi', state: 'Delhi (NCT)', lat: 28.6508, lng: 77.3153, is_junction: true },
  'chennai central': { name: 'Chennai Central (MAS)', code: 'MAS', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2755, is_junction: true },
  'chennai egmore': { name: 'Chennai Egmore (MS)', code: 'MS', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0782, lng: 80.2608, is_junction: true },
  mas: { name: 'Chennai Central (MAS)', code: 'MAS', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2755, is_junction: true },
  ms: { name: 'Chennai Egmore (MS)', code: 'MS', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0782, lng: 80.2608, is_junction: true },
  msb: { name: 'Chennai Beach (MSB)', code: 'MSB', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0922, lng: 80.2936, is_junction: true },
  sbc: { name: 'KSR Bengaluru City Junction (SBC)', code: 'SBC', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lng: 77.5696, is_junction: true },
  'ksr bengaluru': { name: 'KSR Bengaluru City Junction (SBC)', code: 'SBC', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lng: 77.5696, is_junction: true },
  'bangalore city': { name: 'KSR Bengaluru City Junction (SBC)', code: 'SBC', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lng: 77.5696, is_junction: true },
  'bengaluru city': { name: 'KSR Bengaluru City Junction (SBC)', code: 'SBC', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lng: 77.5696, is_junction: true },
  ypr: { name: 'Yesvantpur Junction (YPR)', code: 'YPR', city: 'Bengaluru', state: 'Karnataka', lat: 13.0238, lng: 77.5502, is_junction: true },
  yesvantpur: { name: 'Yesvantpur Junction (YPR)', code: 'YPR', city: 'Bengaluru', state: 'Karnataka', lat: 13.0238, lng: 77.5502, is_junction: true },
  smvb: { name: 'Sir M. Visvesvaraya Terminal (SMVB)', code: 'SMVB', city: 'Bengaluru', state: 'Karnataka', lat: 13.0039, lng: 77.6534, is_junction: true },
  pune: { name: 'Pune Junction (PUNE)', code: 'PUNE', city: 'Pune', state: 'Maharashtra', lat: 18.5284, lng: 73.8739, is_junction: true },
  'pune junction': { name: 'Pune Junction (PUNE)', code: 'PUNE', city: 'Pune', state: 'Maharashtra', lat: 18.5284, lng: 73.8739, is_junction: true },
  adi: { name: 'Ahmedabad Junction (ADI)', code: 'ADI', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.6011, is_junction: true },
  'ahmedabad junction': { name: 'Ahmedabad Junction (ADI)', code: 'ADI', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.6011, is_junction: true },
  jp: { name: 'Jaipur Junction (JP)', code: 'JP', city: 'Jaipur', state: 'Rajasthan', lat: 26.9200, lng: 75.7878, is_junction: true },
  'jaipur junction': { name: 'Jaipur Junction (JP)', code: 'JP', city: 'Jaipur', state: 'Rajasthan', lat: 26.9200, lng: 75.7878, is_junction: true },
};

// Initialize transport registry
export function initializeTransportRegistry(rootDir: string = process.cwd()) {
  if (MASTER_VERIFIED_STATIONS.length > 0 && MASTER_VERIFIED_AIRPORTS.length > 0) {
    return;
  }

  // 1. Ingest verified stations from data/railway_stations.json
  const stationsJsonPath = path.join(rootDir, 'data', 'railway_stations.json');
  if (fs.existsSync(stationsJsonPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(stationsJsonPath, 'utf-8'));
      for (const s of raw) {
        if (s.name && s.lat && s.lng) {
          MASTER_VERIFIED_STATIONS.push({
            name: s.name,
            code: s.code || s.id?.toUpperCase() || '',
            city: s.city || '',
            state: s.state || '',
            lat: Number(s.lat),
            lng: Number(s.lng),
            is_junction: !!s.is_junction,
            status: 'VERIFIED',
          });
        }
      }
    } catch (e) {
      console.error('[TransportRegistry] Failed to parse railway_stations.json:', e);
    }
  }

  // 2. Ingest suburban stations from data/mumbai_local_network.json
  const mumbaiNetPath = path.join(rootDir, 'data', 'mumbai_local_network.json');
  if (fs.existsSync(mumbaiNetPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(mumbaiNetPath, 'utf-8'));
      if (raw.lines) {
        for (const lineKey of Object.keys(raw.lines)) {
          const lineObj = raw.lines[lineKey];
          if (Array.isArray(lineObj.stations)) {
            for (const stn of lineObj.stations) {
              if (stn.name && stn.lat && stn.lng) {
                const exists = MASTER_VERIFIED_STATIONS.some(
                  (x) => x.name.toLowerCase() === stn.name.toLowerCase() || (stn.code && x.code.toLowerCase() === stn.code.toLowerCase())
                );
                if (!exists) {
                  MASTER_VERIFIED_STATIONS.push({
                    name: `${stn.name} Railway Station`,
                    code: stn.code || '',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    lat: Number(stn.lat),
                    lng: Number(stn.lng),
                    is_junction: !!stn.is_interchange,
                    status: 'VERIFIED',
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('[TransportRegistry] Failed to parse mumbai_local_network.json:', e);
    }
  }

  // 3. Ingest verified stations & airports from INDIA_TOURISM_DATABASE
  for (const state of (INDIA_TOURISM_DATABASE.states as any[]) || []) {
    for (const city of (state.cities as any[]) || []) {
      const cityLat = city.coordinates?.lat || 0;
      const cityLng = city.coordinates?.lng || 0;

      // Railway stations
      if (Array.isArray(city.transport?.railway_stations)) {
        for (const stn of city.transport.railway_stations) {
          if (stn.name) {
            const exists = MASTER_VERIFIED_STATIONS.some(
              (x) => x.name.toLowerCase() === stn.name.toLowerCase() || (stn.code && x.code === stn.code)
            );
            if (!exists) {
              MASTER_VERIFIED_STATIONS.push({
                name: stn.name,
                code: stn.code || '',
                city: city.name,
                state: state.name,
                lat: cityLat,
                lng: cityLng,
                is_junction: !!stn.is_junction,
                status: stn.status === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED',
              });
            }
          }
        }
      }

      // Airport
      if (city.transport?.airport?.name) {
        const apt = city.transport.airport;
        const exists = MASTER_VERIFIED_AIRPORTS.some(
          (x) => x.name.toLowerCase() === apt.name.toLowerCase() || (apt.code && x.code === apt.code)
        );
        if (!exists) {
          MASTER_VERIFIED_AIRPORTS.push({
            name: apt.name,
            code: apt.code || '',
            city: city.name,
            state: state.name,
            lat: cityLat,
            lng: cityLng,
            type: apt.type || 'Domestic/International',
            status: apt.status === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED',
          });
        }
      }
    }
  }

  // Add specific verified critical mountain & gateway railway hubs if not present
  const ESSENTIAL_RAILWAY_HUBS: VerifiedStationNode[] = [
    { name: 'New Jalpaiguri Junction', code: 'NJP', city: 'Siliguri / Jalpaiguri', state: 'West Bengal', lat: 26.6853, lng: 88.4419, is_junction: true, status: 'VERIFIED' },
    { name: 'Darjeeling Railway Station (DHR Toy Train)', code: 'DJ', city: 'Darjeeling', state: 'West Bengal', lat: 27.0410, lng: 88.2663, is_junction: false, status: 'VERIFIED' },
    { name: 'Srinagar Railway Station', code: 'SINA', city: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0384, lng: 74.8384, is_junction: false, status: 'VERIFIED' },
    { name: 'Jammu Tawi Railway Station', code: 'JAT', city: 'Jammu', state: 'Jammu and Kashmir', lat: 32.7058, lng: 74.8789, is_junction: true, status: 'VERIFIED' },
    { name: 'Shri Mata Vaishno Devi Katra', code: 'SVDK', city: 'Katra', state: 'Jammu and Kashmir', lat: 32.9856, lng: 74.9547, is_junction: false, status: 'VERIFIED' },
    { name: 'Kalka Railway Station', code: 'KLK', city: 'Kalka', state: 'Haryana', lat: 30.8358, lng: 76.9366, is_junction: true, status: 'VERIFIED' },
    { name: 'Mettupalayam Railway Station', code: 'MTP', city: 'Mettupalayam', state: 'Tamil Nadu', lat: 11.2989, lng: 76.9489, is_junction: true, status: 'VERIFIED' },
    { name: 'Hosapete Junction', code: 'HPT', city: 'Hospet / Vijayanagara', state: 'Karnataka', lat: 15.2750, lng: 76.3860, is_junction: true, status: 'VERIFIED' },
    { name: 'Panvel Junction', code: 'PNVL', city: 'Navi Mumbai', state: 'Maharashtra', lat: 18.9902, lng: 73.1188, is_junction: true, status: 'VERIFIED' },
    { name: 'Kanyakumari Railway Station', code: 'CAPE', city: 'Kanyakumari', state: 'Tamil Nadu', lat: 8.0883, lng: 77.5385, is_junction: false, status: 'VERIFIED' },
    { name: 'Nagercoil Junction', code: 'NCJ', city: 'Nagercoil', state: 'Tamil Nadu', lat: 8.1812, lng: 77.4414, is_junction: true, status: 'VERIFIED' },
  ];

  for (const hub of ESSENTIAL_RAILWAY_HUBS) {
    if (!MASTER_VERIFIED_STATIONS.some((s) => s.code === hub.code)) {
      MASTER_VERIFIED_STATIONS.push(hub);
    }
  }

  // Add specific verified critical airports if not present
  const ESSENTIAL_AIRPORTS: VerifiedAirportNode[] = [
    { name: 'Indira Gandhi International Airport', code: 'DEL', city: 'New Delhi', state: 'Delhi (NCT)', lat: 28.5562, lng: 77.1000, status: 'VERIFIED' },
    { name: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM', city: 'Mumbai', state: 'Maharashtra', lat: 19.0896, lng: 72.8656, status: 'VERIFIED' },
    { name: 'Kempegowda International Airport', code: 'BLR', city: 'Bengaluru', state: 'Karnataka', lat: 13.1986, lng: 77.7066, status: 'VERIFIED' },
    { name: 'Netaji Subhash Chandra Bose International Airport', code: 'CCU', city: 'Kolkata', state: 'West Bengal', lat: 22.6547, lng: 88.4467, status: 'VERIFIED' },
    { name: 'Chennai International Airport', code: 'MAA', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9941, lng: 80.1709, status: 'VERIFIED' },
    { name: 'Rajiv Gandhi International Airport', code: 'HYD', city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lng: 78.4294, status: 'VERIFIED' },
    { name: 'Jaipur International Airport', code: 'JAI', city: 'Jaipur', state: 'Rajasthan', lat: 26.8289, lng: 75.8056, status: 'VERIFIED' },
    { name: 'Bagdogra International Airport', code: 'IXB', city: 'Siliguri / Darjeeling', state: 'West Bengal', lat: 26.6812, lng: 88.3286, status: 'VERIFIED' },
    { name: 'Sheikh ul-Alam International Airport, Srinagar', code: 'SXR', city: 'Srinagar', state: 'Jammu and Kashmir', lat: 33.9871, lng: 74.7744, status: 'VERIFIED' },
    { name: 'Manohar International Airport, Mopa', code: 'GOX', city: 'North Goa', state: 'Goa', lat: 15.7667, lng: 73.8667, status: 'VERIFIED' },
    { name: 'Dabolim Airport', code: 'GOI', city: 'South Goa', state: 'Goa', lat: 15.3808, lng: 73.8314, status: 'VERIFIED' },
    { name: 'Kushok Bakula Rimpochee Airport', code: 'IXL', city: 'Leh', state: 'Ladakh', lat: 34.1359, lng: 77.5465, status: 'VERIFIED' },
    { name: 'Coimbatore International Airport', code: 'CJB', city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0298, lng: 77.0434, status: 'VERIFIED' },
    { name: 'Jindal Vijayanagar Airport', code: 'VDY', city: 'Vidyanagar / Hampi', state: 'Karnataka', lat: 15.1683, lng: 76.6344, status: 'VERIFIED' },
    { name: 'Trivandrum International Airport', code: 'TRV', city: 'Thiruvananthapuram / Trivandrum', state: 'Kerala', lat: 8.4821, lng: 76.9200, status: 'VERIFIED' },
    { name: 'Tuticorin Airport', code: 'TCR', city: 'Thoothukudi / Tuticorin', state: 'Tamil Nadu', lat: 8.7242, lng: 78.0258, status: 'VERIFIED' },
  ];

  for (const apt of ESSENTIAL_AIRPORTS) {
    if (!MASTER_VERIFIED_AIRPORTS.some((a) => a.code === apt.code)) {
      MASTER_VERIFIED_AIRPORTS.push(apt);
    }
  }

  // 4. Ingest verified places / POIs
  const poiSources = [
    path.join(rootDir, 'data', 'mumbai', 'places.json'),
    path.join(rootDir, 'data', 'places.json'),
    path.join(rootDir, 'data', 'india_tourism.json'),
    path.join(rootDir, 'data', 'heritage', 'monuments.json'),
  ];
  for (const srcPath of poiSources) {
    if (fs.existsSync(srcPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));
        const arr = Array.isArray(raw) ? raw : raw.places ? raw.places : [];
        for (const p of arr) {
          const pLat = Number(p.coordinates?.lat || p.lat || 0);
          const pLng = Number(p.coordinates?.lng || p.lng || 0);
          if (p.name && pLat && pLng) {
            const exists = MASTER_VERIFIED_PLACES.some((x) => x.name.toLowerCase() === p.name.toLowerCase());
            if (!exists) {
              MASTER_VERIFIED_PLACES.push({
                id: p.id || '',
                name: p.name,
                city: p.city || '',
                state: p.state || '',
                lat: pLat,
                lng: pLng,
              });
            }
          }
        }
      } catch (e) {
        // Ignore file parse error
      }
    }
  }
}

/**
 * Helper to match any query to a verified railway station or alias.
 */
export function findStationByQuery(rawQuery: string): VerifiedStationNode | null {
  if (!rawQuery) return null;
  initializeTransportRegistry();

  const clean = rawQuery.trim().replace(/[?!,.:;]+$/g, '').trim().toLowerCase();
  if (!clean) return null;

  // Extract code in parentheses e.g. "Sealdah (SDAH)" -> "sdah"
  const parenCodeMatch = clean.match(/\(([a-zA-Z0-9]+)\)/);
  const parenCode = parenCodeMatch ? parenCodeMatch[1].toLowerCase() : null;
  const cleanWithoutParens = clean.replace(/\s*\([^)]*\)/g, '').trim();

  const candidates = [clean, parenCode, cleanWithoutParens].filter((c): c is string => !!c && c.length > 0);

  // 1. Direct Alias Check (CSMT, CCG, NDLS, HWH, etc.)
  for (const cand of candidates) {
    if (STATION_ALIASES[cand]) {
      const a = STATION_ALIASES[cand];
      return {
        name: a.name,
        code: a.code,
        city: a.city,
        state: a.state,
        lat: a.lat,
        lng: a.lng,
        is_junction: a.is_junction,
        status: 'VERIFIED',
      };
    }
  }

  // 2. Check MASTER_VERIFIED_STATIONS by exact code match
  for (const cand of candidates) {
    const codeMatch = MASTER_VERIFIED_STATIONS.find((s) => s.code && s.code.toLowerCase() === cand);
    if (codeMatch) return codeMatch;
  }

  // 3. Check by exact station name match
  for (const cand of candidates) {
    const exactName = MASTER_VERIFIED_STATIONS.find((s) => s.name.toLowerCase() === cand);
    if (exactName) return exactName;
  }

  // 4. Check by station name contains or query contains station name
  for (const cand of candidates) {
    if (cand.length >= 4) {
      const subMatch = MASTER_VERIFIED_STATIONS.find(
        (s) => s.name.toLowerCase().includes(cand) || cand.includes(s.name.toLowerCase())
      );
      if (subMatch) return subMatch;
    }
  }

  return null;
}

// -------------------------------------------------------------
// Resolve User Origin to Real Verified Transport Nodes
// (Returns null if origin is unknown or unprovided - NO FAKE FALLBACKS)
// -------------------------------------------------------------
export function resolveOriginTransportNode(
  rawOrigin: { lat?: number; lng?: number; locality?: string; city?: string; state?: string } | string | null | undefined
): ResolvedTransportOrigin | null {
  initializeTransportRegistry();

  if (!rawOrigin) {
    return null;
  }

  let label = '';
  let city = '';
  let state = '';
  let lat = 0;
  let lng = 0;
  let hasCoords = false;

  if (typeof rawOrigin === 'string') {
    const trimmed = rawOrigin.trim().replace(/[?!,.:;]+$/g, '').trim();
    if (!trimmed || trimmed.toLowerCase() === 'unknown' || trimmed.toLowerCase() === 'your location') {
      return null;
    }
    label = trimmed;
    const cleanLower = label.toLowerCase();

    // 1. Check station alias or station code first
    const stn = findStationByQuery(cleanLower);
    if (stn) {
      city = stn.city;
      state = stn.state;
      lat = stn.lat;
      lng = stn.lng;
      label = stn.name;
      hasCoords = true;
    } else {
      // 2. Try matching city
      const allCities = (INDIA_TOURISM_DATABASE.states as unknown as any[]).flatMap((s: any) => s.cities || []);
      const matchedCity = allCities.find(
        (c: any) => c && (c.name.toLowerCase() === cleanLower || cleanLower.includes(c.name.toLowerCase()))
      );
      if (matchedCity) {
        city = matchedCity.name;
        state = matchedCity.state || '';
        if (matchedCity.coordinates?.lat && matchedCity.coordinates?.lng) {
          lat = matchedCity.coordinates.lat;
          lng = matchedCity.coordinates.lng;
          hasCoords = true;
        }
      } else {
        // 3. Try matching place / POI (e.g. Gateway of India, Taj Mahal, Dal Lake)
        const foundPoi = MASTER_VERIFIED_PLACES.find(
          (p) =>
            p.name.toLowerCase() === cleanLower ||
            cleanLower.includes(p.name.toLowerCase()) ||
            p.name.toLowerCase().includes(cleanLower)
        );
        if (foundPoi) {
          city = foundPoi.city;
          state = foundPoi.state;
          label = foundPoi.name;
          lat = foundPoi.lat;
          lng = foundPoi.lng;
          hasCoords = true;
        } else {
          for (const st of INDIA_TOURISM_DATABASE.states) {
            for (const c of (st.cities || [])) {
              for (const p of ((c as any).places || [])) {
                if (
                  p.name.toLowerCase() === cleanLower ||
                  cleanLower.includes(p.name.toLowerCase()) ||
                  p.name.toLowerCase().includes(cleanLower)
                ) {
                  city = c.name;
                  state = st.name;
                  label = p.name;
                  if (p.coordinates?.lat && p.coordinates?.lng) {
                    lat = p.coordinates.lat;
                    lng = p.coordinates.lng;
                    hasCoords = true;
                  }
                  break;
                }
              }
              if (hasCoords) break;
            }
            if (hasCoords) break;
          }
        }
      }
    }
  } else if (rawOrigin && typeof rawOrigin === 'object') {
    if (rawOrigin.lat && rawOrigin.lng && !isNaN(rawOrigin.lat) && !isNaN(rawOrigin.lng)) {
      if (rawOrigin.lat >= 6.0 && rawOrigin.lat <= 38.5 && rawOrigin.lng >= 68.0 && rawOrigin.lng <= 98.5) {
        lat = rawOrigin.lat;
        lng = rawOrigin.lng;
        hasCoords = true;
      }
    }
    city = rawOrigin.city || '';
    state = rawOrigin.state || '';
    label = rawOrigin.locality
      ? `${rawOrigin.locality}, ${rawOrigin.city || rawOrigin.state || ''}`.trim()
      : rawOrigin.city || rawOrigin.state || 'Selected Origin';
  }

  if (!hasCoords && city) {
    const allCities = (INDIA_TOURISM_DATABASE.states as unknown as any[]).flatMap((s: any) => s.cities || []);
    const matchedCity = allCities.find((c: any) => c && c.name.toLowerCase() === city.toLowerCase());
    if (matchedCity?.coordinates?.lat && matchedCity?.coordinates?.lng) {
      lat = matchedCity.coordinates.lat;
      lng = matchedCity.coordinates.lng;
      hasCoords = true;
    }
  }

  if (!hasCoords || !MASTER_VERIFIED_STATIONS.length) {
    return null;
  }

  // Find closest verified railway station using actual Haversine distance
  let nearestStation = MASTER_VERIFIED_STATIONS[0];
  let minStnDist = Infinity;
  for (const s of MASTER_VERIFIED_STATIONS) {
    const dist = haversineDistanceKm(lat, lng, s.lat, s.lng);
    if (dist < minStnDist) {
      minStnDist = dist;
      nearestStation = s;
    }
  }

  // Find closest verified airport using actual Haversine distance
  let nearestAirport = MASTER_VERIFIED_AIRPORTS[0];
  let minAptDist = Infinity;
  for (const a of MASTER_VERIFIED_AIRPORTS) {
    const dist = haversineDistanceKm(lat, lng, a.lat, a.lng);
    if (dist < minAptDist) {
      minAptDist = dist;
      nearestAirport = a;
    }
  }

  return {
    origin_label: label || city || nearestStation.name || 'Verified Origin',
    city: city || nearestStation.city,
    state: state || nearestStation.state,
    coordinates: { lat, lng },
    nearest_railway_station: {
      name: nearestStation ? nearestStation.name : 'Verified Railway Station',
      code: nearestStation ? nearestStation.code : '',
      distance_km: Math.round(minStnDist * 10) / 10,
      is_verified: true,
    },
    nearest_airport: {
      name: nearestAirport ? nearestAirport.name : 'Verified Airport',
      code: nearestAirport ? nearestAirport.code : '',
      distance_km: Math.round(minAptDist * 10) / 10,
      is_verified: true,
    },
  };
}

// -------------------------------------------------------------
// Resolve Destination to Real Verified Transport Nodes
// (City-aware, station-aware, never falls back to fake coordinates)
// -------------------------------------------------------------
export function resolveDestinationTransportNode(
  destQuery: string,
  placesData?: Map<string, any>
): ResolvedTransportDestination {
  initializeTransportRegistry();

  const q = (destQuery || '').trim().replace(/[?!,.:;]+$/g, '').trim().toLowerCase();

  // 1. Check if destination is a Point of Interest (POI)
  let matchedPlace: any = null;
  if (placesData) {
    for (const [id, p] of placesData.entries()) {
      if (
        id.toLowerCase() === q ||
        p.name?.toLowerCase() === q ||
        q.includes(p.name?.toLowerCase()) ||
        p.name?.toLowerCase().includes(q)
      ) {
        matchedPlace = p;
        break;
      }
    }
  }

  if (!matchedPlace) {
    const foundPoi = MASTER_VERIFIED_PLACES.find(
      (p) =>
        p.name.toLowerCase() === q ||
        q.includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(q)
    );
    if (foundPoi) {
      matchedPlace = foundPoi;
    }
  }

  // 2. Special Mountain & Heritage Hubs
  if (q.includes('darjeeling')) {
    return {
      is_poi: false,
      destination_name: 'Darjeeling',
      city: 'Darjeeling',
      state: 'West Bengal',
      coordinates: { lat: 27.0410, lng: 88.2663 },
      railway_hub: {
        station_name: 'New Jalpaiguri Junction (NJP)',
        station_code: 'NJP',
        is_direct: false,
        distance_to_dest_km: 70,
        onward_connection_note:
          'Darjeeling is a Himalayan hill town. Main broad-gauge express trains terminate at New Jalpaiguri Junction (NJP) in the plains. From NJP or Siliguri, connect to Darjeeling (~70 km) via shared taxi/private cab up NH-110 (approx. 2.5–3 hrs) or the historic UNESCO Darjeeling Himalayan Railway (DHR Toy Train).',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Bagdogra International Airport (IXB)',
        airport_code: 'IXB',
        is_direct: false,
        distance_to_dest_km: 68,
        onward_connection_note:
          'Darjeeling town has no commercial airport. Fly into Bagdogra Airport (IXB), which connects major Indian metros. From Bagdogra, prepaid taxis or shared cabs take approx. 2.5 to 3 hours up the hills via NH-110.',
        status: 'VERIFIED',
      },
      geographic_notes: 'High-altitude mountain terrain. Road ascent from Siliguri plains via Hill Cart Road / NH-110.',
    };
  }

  if (q.includes('dal lake')) {
    return {
      is_poi: true,
      poi_name: 'Dal Lake',
      destination_name: 'Dal Lake (Srinagar)',
      city: 'Srinagar',
      state: 'Jammu and Kashmir',
      coordinates: { lat: 34.1250, lng: 74.8700 },
      railway_hub: {
        station_name: 'Srinagar Railway Station (SINA) / Jammu Tawi (JAT) Railhead',
        station_code: 'SINA',
        is_direct: false,
        distance_to_dest_km: 15,
        onward_connection_note:
          'Dal Lake is an urban freshwater lake in Srinagar, not a railway station. Mainline broad-gauge express trains from Delhi and rest of India connect to Jammu Tawi (JAT) and Katra (SVDK). The Kashmir Valley rail link operates passenger trains to Srinagar Railway Station (SINA). From Srinagar station, local taxi or auto takes ~25 mins (~15 km) to the Dal Lake Boulevard ghats.',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Sheikh ul-Alam International Airport, Srinagar (SXR)',
        airport_code: 'SXR',
        is_direct: false,
        distance_to_dest_km: 16,
        onward_connection_note:
          'Sheikh ul-Alam Airport (SXR) in Srinagar has direct domestic flights from Delhi, Mumbai, Bengaluru, and Chandigarh. From the airport, prepaid cabs reach Dal Lake in approx. 25–35 minutes.',
        status: 'VERIFIED',
      },
      geographic_notes: 'Scenic urban lake in Srinagar city surrounded by Zabarwan mountain ranges.',
    };
  }

  if (q.includes('srinagar') || q.includes('kashmir')) {
    return {
      is_poi: false,
      destination_name: 'Srinagar',
      city: 'Srinagar',
      state: 'Jammu and Kashmir',
      coordinates: { lat: 34.0837, lng: 74.7973 },
      railway_hub: {
        station_name: 'Srinagar Railway Station (SINA) & Jammu Tawi (JAT) Railhead',
        station_code: 'SINA',
        is_direct: false,
        distance_to_dest_km: 12,
        onward_connection_note:
          'Direct trunk trains connect across India to Jammu Tawi (JAT) and Shri Mata Vaishno Devi Katra (SVDK). The Kashmir Valley rail line operates between Banihal, Qazigund, and Srinagar (SINA). Highway connection from Jammu to Srinagar runs via the Chenani-Nashri and Banihal tunnels (approx. 7–8 hrs by road).',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Sheikh ul-Alam International Airport, Srinagar (SXR)',
        airport_code: 'SXR',
        is_direct: true,
        distance_to_dest_km: 12,
        onward_connection_note: 'Daily direct flights into Srinagar Airport from major Indian cities.',
        status: 'VERIFIED',
      },
    };
  }

  if (q.includes('ooty') || q.includes('udhagamandalam')) {
    return {
      is_poi: false,
      destination_name: 'Ooty',
      city: 'Ooty',
      state: 'Tamil Nadu',
      coordinates: { lat: 11.4102, lng: 76.6950 },
      railway_hub: {
        station_name: 'Mettupalayam (MTP) & Coimbatore Junction (CBE)',
        station_code: 'MTP',
        is_direct: false,
        distance_to_dest_km: 52,
        onward_connection_note:
          'Ooty is a hill station. Broad-gauge express trains connect to Coimbatore Junction (CBE) and Mettupalayam (MTP). From Mettupalayam, board the UNESCO Nilgiri Mountain Railway (NMR) toy train or take a scenic hill taxi (~52 km / 2 hrs).',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Coimbatore International Airport (CJB)',
        airport_code: 'CJB',
        is_direct: false,
        distance_to_dest_km: 88,
        onward_connection_note: 'Fly to Coimbatore (CJB), then drive approx. 88 km (approx. 3 hrs) up the Nilgiris to Ooty.',
        status: 'VERIFIED',
      },
    };
  }

  if (q.includes('shimla')) {
    return {
      is_poi: false,
      destination_name: 'Shimla',
      city: 'Shimla',
      state: 'Himachal Pradesh',
      coordinates: { lat: 31.1048, lng: 77.1734 },
      railway_hub: {
        station_name: 'Kalka Railway Station (KLK) [Broad-Gauge Railhead]',
        station_code: 'KLK',
        is_direct: false,
        distance_to_dest_km: 88,
        onward_connection_note:
          'Mainline express trains from Delhi terminate at Kalka (KLK). From Kalka, connect via the UNESCO Kalka-Shimla narrow-gauge Toy Train or cab along NH-5 (approx. 3 hrs).',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Chandigarh International Airport (IXC)',
        airport_code: 'IXC',
        is_direct: false,
        distance_to_dest_km: 120,
        onward_connection_note: 'Fly into Chandigarh Airport (IXC); drive up to Shimla via NH-5 in approx. 3.5 to 4 hours.',
        status: 'VERIFIED',
      },
    };
  }

  if (q.includes('leh') || q.includes('ladakh')) {
    return {
      is_poi: false,
      destination_name: 'Leh',
      city: 'Leh',
      state: 'Ladakh',
      coordinates: { lat: 34.1526, lng: 77.5771 },
      railway_hub: {
        station_name: 'Jammu Tawi (JAT) / Chandigarh (CDG) [Nearest Railheads]',
        station_code: 'JAT',
        is_direct: false,
        distance_to_dest_km: 700,
        onward_connection_note:
          'No verified railway connection exists in Ladakh. The closest broad-gauge railheads are Jammu Tawi (JAT) and Chandigarh (CDG) (~700 km away), followed by a 2-day scenic highway road expedition via Manali-Leh or Srinagar-Leh highway.',
        status: 'NOT_AVAILABLE',
      },
      airport_hub: {
        airport_name: 'Kushok Bakula Rimpochee Airport, Leh (IXL)',
        airport_code: 'IXL',
        is_direct: true,
        distance_to_dest_km: 4,
        onward_connection_note: 'Daily flights operate into Leh Airport (IXL). Acclimatization rest is mandatory on arrival.',
        status: 'VERIFIED',
      },
    };
  }

  if (q.includes('hampi')) {
    return {
      is_poi: false,
      destination_name: 'Hampi',
      city: 'Hampi',
      state: 'Karnataka',
      coordinates: { lat: 15.3350, lng: 76.4600 },
      railway_hub: {
        station_name: 'Hosapete Junction (HPT)',
        station_code: 'HPT',
        is_direct: false,
        distance_to_dest_km: 13,
        onward_connection_note:
          'Hampi is a UNESCO archaeological ruins complex and has no railway station of its own. The nearest verified railway junction is Hosapete Junction (HPT), approx. 13 km away. Auto rickshaws and taxis connect Hospet station to Hampi in ~25 minutes.',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Jindal Vijayanagar Airport, Vidyanagar (VDY)',
        airport_code: 'VDY',
        is_direct: false,
        distance_to_dest_km: 38,
        onward_connection_note:
          'Nearest commercial domestic airport is Jindal Vijayanagar Airport (VDY) (~38 km) or Hubballi Airport (HBX) (~160 km).',
        status: 'VERIFIED',
      },
    };
  }

  if (q.includes('sonamarg')) {
    return {
      is_poi: false,
      destination_name: 'Sonamarg',
      city: 'Sonamarg / Ganderbal',
      state: 'Jammu and Kashmir',
      coordinates: { lat: 34.3000, lng: 75.2900 },
      railway_hub: {
        station_name: 'Srinagar Railway Station (SINA) & Jammu Tawi (JAT) Railhead',
        station_code: 'SINA',
        is_direct: false,
        distance_to_dest_km: 85,
        onward_connection_note:
          'Sonamarg is a high-altitude Himalayan valley meadow with no direct railway station. The broad-gauge mainline connects across India to Jammu Tawi (JAT) and Katra (SVDK). The local Kashmir Valley line connects to Srinagar (SINA). From Srinagar, take a private cab or shared taxi along the scenic NH-1 (Srinagar-Leh Highway) via Ganderbal and Kangan (~85 km, approx. 2.5 to 3 hours).',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Sheikh ul-Alam International Airport, Srinagar (SXR)',
        airport_code: 'SXR',
        is_direct: false,
        distance_to_dest_km: 80,
        onward_connection_note:
          'Sonamarg has no airport. Fly into Sheikh ul-Alam International Airport in Srinagar (SXR), which has regular flights from major Indian cities. From the airport, drive ~80 km along the Sindh River to Sonamarg in approx. 2.5 hours.',
        status: 'VERIFIED',
      },
      geographic_notes: 'High-altitude mountain valley along the Sindh River surrounded by glaciers and Himalayan passes.',
    };
  }

  if (q.includes('kanyakumari')) {
    return {
      is_poi: false,
      destination_name: 'Kanyakumari',
      city: 'Kanyakumari',
      state: 'Tamil Nadu',
      coordinates: { lat: 8.0883, lng: 77.5385 },
      railway_hub: {
        station_name: 'Kanyakumari Railway Station (CAPE)',
        station_code: 'CAPE',
        is_direct: true,
        distance_to_dest_km: 1,
        onward_connection_note:
          'Kanyakumari is directly served by Kanyakumari Railway Station (CAPE), the southernmost terminus on Indian Railways with direct express trains across the country. Nagercoil Junction (NCJ) is also a major rail junction just 16 km away.',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Trivandrum International Airport (TRV)',
        airport_code: 'TRV',
        is_direct: false,
        distance_to_dest_km: 90,
        onward_connection_note:
          'Kanyakumari has no commercial airport. The nearest major commercial airport is Trivandrum International Airport (TRV) in Kerala (~90 km via NH-66, approx. 2.5 hours by taxi). Tuticorin Airport (TCR) is approx. 95 km away.',
        status: 'VERIFIED',
      },
      geographic_notes: 'Coastal tip of mainland India at the confluence of the Arabian Sea, Gulf of Mannar, and Indian Ocean.',
    };
  }

  if (q.includes('goa')) {
    return {
      is_poi: false,
      destination_name: 'Goa',
      city: 'Goa',
      state: 'Goa',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      railway_hub: {
        station_name: 'Madgaon Junction (MAO) & Thivim (THVM)',
        station_code: 'MAO',
        is_direct: true,
        distance_to_dest_km: 0,
        onward_connection_note:
          'Madgaon Junction (MAO) in South Goa and Thivim (THVM) in North Goa are major stations on the Konkan Railway network with direct express and Vande Bharat trains.',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Manohar International Airport Mopa (GOX) / Dabolim (GOI)',
        airport_code: 'GOX',
        is_direct: true,
        distance_to_dest_km: 0,
        onward_connection_note: 'Frequent direct domestic flights into GOX (North Goa) and GOI (Central/South Goa).',
        status: 'VERIFIED',
      },
    };
  }

  if (q.includes('delhi') || q === 'ndls' || q === 'dli') {
    return {
      is_poi: false,
      destination_name: 'New Delhi',
      city: 'New Delhi',
      state: 'Delhi (NCT)',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      railway_hub: {
        station_name: 'New Delhi Railway Station (NDLS)',
        station_code: 'NDLS',
        is_direct: true,
        distance_to_dest_km: 0,
        onward_connection_note:
          'Major national rail hub with Rajdhani, Shatabdi, and Vande Bharat express trains connecting across India.',
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: 'Indira Gandhi International Airport (DEL)',
        airport_code: 'DEL',
        is_direct: true,
        distance_to_dest_km: 0,
        onward_connection_note: 'Primary international and domestic aviation gateway of India.',
        status: 'VERIFIED',
      },
      geographic_notes: 'National Capital Territory of India.',
    };
  }

  // 3. Resolve by Station Code / Alias (e.g. CSMT, Churchgate, CCG, Dadar, etc.)
  const matchedStation = findStationByQuery(q);
  if (matchedStation) {
    return {
      is_poi: false,
      destination_name: matchedStation.name,
      city: matchedStation.city,
      state: matchedStation.state,
      coordinates: { lat: matchedStation.lat, lng: matchedStation.lng },
      railway_hub: {
        station_name: matchedStation.name,
        station_code: matchedStation.code,
        is_direct: true,
        distance_to_dest_km: 0,
        onward_connection_note: `Direct rail access at ${matchedStation.name} (${matchedStation.code}).`,
        status: 'VERIFIED',
      },
      airport_hub: {
        airport_name: `${matchedStation.city} Airport`,
        airport_code: '',
        is_direct: false,
        onward_connection_note: `Commercial aviation gateway serving ${matchedStation.city}.`,
        status: 'VERIFIED',
      },
      geographic_notes: `Station hub in ${matchedStation.city}, ${matchedStation.state}.`,
    };
  }

  // 4. Resolve by Matched POI
  if (matchedPlace) {
    const poiCity = matchedPlace.city || 'India';
    const poiState = matchedPlace.state || '';
    const poiCoords = matchedPlace.coordinates || { lat: matchedPlace.lat || 20.5937, lng: matchedPlace.lng || 78.9629 };

    let cityStn = MASTER_VERIFIED_STATIONS.find(
      (s) => s.city.toLowerCase() === poiCity.toLowerCase()
    );
    let stnDist = cityStn ? haversineDistanceKm(poiCoords.lat, poiCoords.lng, cityStn.lat, cityStn.lng) : 0;

    if (!cityStn) {
      let minDist = Infinity;
      for (const s of MASTER_VERIFIED_STATIONS) {
        const d = haversineDistanceKm(poiCoords.lat, poiCoords.lng, s.lat, s.lng);
        if (d < minDist) {
          minDist = d;
          cityStn = s;
        }
      }
      stnDist = minDist;
    }

    let cityApt = MASTER_VERIFIED_AIRPORTS.find(
      (a) => a.city.toLowerCase() === poiCity.toLowerCase()
    );
    let aptDist = cityApt ? haversineDistanceKm(poiCoords.lat, poiCoords.lng, cityApt.lat, cityApt.lng) : 0;

    if (!cityApt) {
      let minDist = Infinity;
      for (const a of MASTER_VERIFIED_AIRPORTS) {
        const d = haversineDistanceKm(poiCoords.lat, poiCoords.lng, a.lat, a.lng);
        if (d < minDist) {
          minDist = d;
          cityApt = a;
        }
      }
      aptDist = minDist;
    }

    return {
      is_poi: true,
      poi_name: matchedPlace.name,
      destination_name: `${matchedPlace.name} (${poiCity})`,
      city: poiCity,
      state: poiState,
      coordinates: poiCoords,
      railway_hub: {
        station_name: cityStn ? `${cityStn.name} (${cityStn.code})` : 'Nearest Regional Rail Junction',
        station_code: cityStn ? cityStn.code : '',
        is_direct: false,
        distance_to_dest_km: Math.round(stnDist * 10) / 10,
        onward_connection_note: `${matchedPlace.name} is a cultural monument/attraction in ${poiCity}. Take train to ${cityStn?.name} (${cityStn?.code}), then local cab/auto approx. ${Math.round(stnDist * 10) / 10} km to the site.`,
        status: cityStn ? 'VERIFIED' : 'NOT_AVAILABLE',
      },
      airport_hub: {
        airport_name: cityApt ? `${cityApt.name} (${cityApt.code})` : 'Nearest Commercial Airport',
        airport_code: cityApt ? cityApt.code : '',
        is_direct: false,
        distance_to_dest_km: Math.round(aptDist * 10) / 10,
        onward_connection_note: `Fly to ${cityApt?.name} (${cityApt?.code}), then connect by taxi approx. ${Math.round(aptDist * 10) / 10} km to ${matchedPlace.name}.`,
        status: cityApt ? 'VERIFIED' : 'NOT_AVAILABLE',
      },
      geographic_notes: `Cultural attraction located in ${poiCity}, ${poiState}.`,
    };
  }

  // 5. Resolve by City in INDIA_TOURISM_DATABASE
  for (const state of INDIA_TOURISM_DATABASE.states || []) {
    for (const city of state.cities || []) {
      if (
        city.name.toLowerCase() === q ||
        city.id.toLowerCase() === q ||
        q.includes(city.name.toLowerCase()) ||
        city.name.toLowerCase().includes(q)
      ) {
        const cLat = city.coordinates?.lat || 20.0;
        const cLng = city.coordinates?.lng || 78.0;

        const transport: any = city.transport;
        const cityStn: any =
          transport?.railway_stations?.[0] ||
          MASTER_VERIFIED_STATIONS.find((s) => s.city.toLowerCase() === city.name.toLowerCase());

        const cityApt: any =
          transport?.airport ||
          MASTER_VERIFIED_AIRPORTS.find((a) => a.city.toLowerCase() === city.name.toLowerCase());

        return {
          is_poi: false,
          destination_name: city.name,
          city: city.name,
          state: state.name,
          coordinates: { lat: cLat, lng: cLng },
          railway_hub: {
            station_name: cityStn ? `${cityStn.name} (${cityStn.code})` : `No verified direct station found in database`,
            station_code: cityStn?.code || '',
            is_direct: !!cityStn,
            distance_to_dest_km: 0,
            onward_connection_note: cityStn
              ? `Direct rail access at ${cityStn.name} (${cityStn.code}) on Indian Railways broad-gauge network.`
              : `No verified direct railway station found in available database for ${city.name}.`,
            status: cityStn ? 'VERIFIED' : 'NOT_AVAILABLE',
          },
          airport_hub: {
            airport_name: cityApt ? `${cityApt.name} (${cityApt.code})` : `No verified commercial airport in ${city.name}`,
            airport_code: cityApt?.code || '',
            is_direct: !!cityApt,
            distance_to_dest_km: 0,
            onward_connection_note: cityApt
              ? `Commercial air connectivity at ${cityApt.name} (${cityApt.code}).`
              : `No commercial airport located directly in ${city.name}.`,
            status: cityApt ? 'VERIFIED' : 'NOT_AVAILABLE',
          },
        };
      }
    }
  }

  // 6. Unresolved Destination: NEVER fabricate coordinates to Nagpur (20.5937, 78.9629)
  return {
    is_poi: false,
    destination_name: destQuery,
    city: destQuery,
    state: 'India',
    coordinates: { lat: 0, lng: 0 },
    railway_hub: {
      station_name: 'Unresolved destination station',
      station_code: '',
      is_direct: false,
      onward_connection_note: `Destination "${destQuery}" could not be confidently identified in the Virasat database. Please specify a nearby city or station.`,
      status: 'NOT_AVAILABLE',
    },
    airport_hub: {
      airport_name: 'Unresolved destination airport',
      airport_code: '',
      is_direct: false,
      onward_connection_note: `No verified airport recognized for "${destQuery}".`,
      status: 'NOT_AVAILABLE',
    },
    geographic_notes: 'Unresolved destination entity',
  };
}

// -------------------------------------------------------------
// Build Verified Multimodal Transit Comparison
// (City-aware, Same-city routing, Defensive coordinate validation)
// -------------------------------------------------------------
export function buildVerifiedTransitComparison(
  originNode: ResolvedTransportOrigin,
  destNode: ResolvedTransportDestination,
  selectedMode?: 'train' | 'air' | 'road' | 'all'
): TransitComparison {
  if (!originNode || !destNode) {
    return {
      origin: originNode?.origin_label || 'Unknown',
      destination: destNode?.destination_name || 'Unknown',
      distance_km: 0,
    };
  }

  const oLat = originNode.coordinates?.lat || 0;
  const oLng = originNode.coordinates?.lng || 0;
  const dLat = destNode.coordinates?.lat || 0;
  const dLng = destNode.coordinates?.lng || 0;

  // Defensive validation: coordinate sanity checks
  const isOriginCoordsValid = oLat >= 6.0 && oLat <= 38.5 && oLng >= 68.0 && oLng <= 98.5;
  const isDestCoordsValid = dLat >= 6.0 && dLat <= 38.5 && dLng >= 68.0 && dLng <= 98.5;

  if (!isOriginCoordsValid || !isDestCoordsValid) {
    return {
      origin: originNode.origin_label,
      destination: destNode.destination_name,
      distance_km: 0,
      is_same_city: false,
      train: {
        summary: `Location clarification needed for ${destNode.destination_name}`,
        approx_duration: 'N/A',
        notes: `Could not confidently determine geographic coordinates for "${destNode.destination_name}". Please verify the location name.`,
      },
      air: {
        summary: `Location clarification needed`,
        approx_duration: 'N/A',
        notes: `Please specify a verified starting or destination city.`,
      },
      road: {
        summary: `Route calculation unavailable`,
        approx_duration: 'N/A',
        notes: `Please provide a valid Indian city or station.`,
      },
    };
  }

  // Real Haversine straight-line distance
  const aerialDistanceKm = Math.round(haversineDistanceKm(oLat, oLng, dLat, dLng) * 10) / 10;

  // Defensive check: Reject impossible straight-line distance (> 3800 km)
  if (aerialDistanceKm > 3800) {
    return {
      origin: originNode.origin_label,
      destination: destNode.destination_name,
      distance_km: aerialDistanceKm,
      is_same_city: false,
      train: {
        summary: 'Exceeds mainland domestic routing boundaries',
        notes: 'Distance exceeds standard Indian domestic transit corridors.',
      },
    };
  }

  const origCity = (originNode.city || '').toLowerCase().trim();
  const destCity = (destNode.city || '').toLowerCase().trim();
  const isHilly = destNode.geographic_notes?.toLowerCase().includes('mountain') || destNode.geographic_notes?.toLowerCase().includes('hill');

  // Same-city detection
  const isSameCity =
    (origCity.length > 0 && destCity.length > 0 && (origCity === destCity || origCity.includes(destCity) || destCity.includes(origCity))) ||
    (aerialDistanceKm <= 35 && originNode.state?.toLowerCase() === destNode.state?.toLowerCase());

  // -------------------------------------------------------------
  // SAME-CITY / INTRA-METROPOLITAN ROUTING
  // -------------------------------------------------------------
  if (isSameCity) {
    const roadDistKm = Math.max(0.8, Math.round(aerialDistanceKm * 1.5 * 10) / 10);
    const driveMinutes = Math.max(5, Math.min(75, Math.round(roadDistKm * 3.5)));
    const walkMinutes = Math.round(roadDistKm * 12);

    // City-specific nuances (Mumbai, Delhi, Kolkata, Chennai, etc.)
    const isMumbai = origCity.includes('mumbai') || destCity.includes('mumbai');
    const isDelhi = origCity.includes('delhi') || destCity.includes('delhi');
    const isKolkata = origCity.includes('kolkata') || destCity.includes('kolkata');

    // Local train option
    let localTrainSummary = `Suburban / Local Rail within ${destNode.city || originNode.city}`;
    let localTrainDuration = '15 - 30 mins';
    let localTrainNotes = `Direct city local transport / suburban rail network. Regulated local fare: ₹5 - ₹15.`;
    let localTrainStations = [originNode.nearest_railway_station.name, destNode.railway_hub.station_name];

    if (isMumbai) {
      const origIsCsmt = originNode.origin_label.toLowerCase().includes('csmt') || originNode.nearest_railway_station.code === 'CSMT';
      const destIsChurchgate = destNode.destination_name.toLowerCase().includes('churchgate') || destNode.railway_hub.station_code === 'CCG';
      const origIsChurchgate = originNode.origin_label.toLowerCase().includes('churchgate') || originNode.nearest_railway_station.code === 'CCG';
      const destIsCsmt = destNode.destination_name.toLowerCase().includes('csmt') || destNode.railway_hub.station_code === 'CSMT';

      if ((origIsCsmt && destIsChurchgate) || (origIsChurchgate && destIsCsmt)) {
        localTrainSummary = `Mumbai Suburban Rail: Central/Harbour Line (CSMT) ↔ Western Line (Churchgate)`;
        localTrainDuration = `~20–25 mins via Dadar transfer OR 5–10 min direct taxi / 15-min walk`;
        localTrainStations = ['CSMT (Central/Harbour Terminus)', 'Churchgate (Western Line Terminus)'];
        localTrainNotes = `CSMT and Churchgate are adjacent South Mumbai railway terminals separated by ~1.2 km across the Fort / Hutatma Chowk heritage precinct. For local train rail-only journey, transfer between Central and Western lines at Dadar Junction (~25 mins), or take a direct 5-10 minute metered Kaali-Peeli taxi / 15-minute heritage walk.`;
      } else {
        localTrainSummary = `Mumbai Suburban Local Train (${originNode.origin_label} ➔ ${destNode.destination_name})`;
        localTrainDuration = roadDistKm < 10 ? '10 - 20 mins' : roadDistKm < 25 ? '25 - 45 mins' : '45 - 75 mins';
        localTrainNotes = `Frequent fast and slow local trains operated by Central and Western Railways. Fare: ₹5–₹15 (Second Class), ₹50–₹105 (First Class / AC Local).`;
      }
    }

    // Road / Taxi option
    const roadSummary = isMumbai
      ? `Kaali-Peeli Metered Taxi / App Cab / BEST Bus: ${originNode.origin_label} ➔ ${destNode.destination_name}`
      : `City Cab / Taxi / Auto: ${originNode.origin_label} ➔ ${destNode.destination_name}`;

    const roadNotes = isMumbai && (origCity === 'mumbai' && (originNode.coordinates.lat < 19.05 || destNode.coordinates.lat < 19.05))
      ? `South Mumbai (Island City) metered Kaali-Peeli taxi ride (~${driveMinutes} mins, regulated meter fare ~₹28–₹45). Note: Auto-rickshaws are prohibited in South Mumbai south of Mahim/Sion.`
      : `City road transit (~${roadDistKm} km, ~${driveMinutes} mins under typical traffic). Regulated metered auto-rickshaw or taxi available.`;

    const localModes = [
      {
        mode: 'Local Train',
        summary: localTrainSummary,
        duration: localTrainDuration,
        cost_estimate: '₹5 - ₹15 (Suburban Railway)',
        notes: localTrainNotes,
      },
      {
        mode: 'Taxi / Cab',
        summary: `Metered Kaali-Peeli / App Cab (~${roadDistKm} km)`,
        duration: `~${driveMinutes} mins`,
        cost_estimate: isMumbai ? '₹28 - ₹45 (Regulated Meter)' : '₹40 - ₹80',
        notes: roadNotes,
      },
      {
        mode: 'City Bus',
        summary: isMumbai ? 'BEST City Bus Transit (Routes connecting terminals)' : 'City Municipal Bus',
        duration: `~${driveMinutes + 5} mins`,
        cost_estimate: '₹6 - ₹15',
        notes: isMumbai ? 'Frequent BEST buses (e.g. 137, 138) connect South Mumbai terminals.' : 'Frequent municipal bus transit.',
      },
    ];

    if (roadDistKm <= 3.0) {
      localModes.push({
        mode: 'Walking',
        summary: `Pleasant Heritage Walk: ${originNode.origin_label} ➔ ${destNode.destination_name}`,
        duration: `~${walkMinutes} mins (~${roadDistKm} km)`,
        cost_estimate: 'Free',
        notes: isMumbai ? 'Scenic walk through the UNESCO Victorian Gothic & Art Deco heritage precinct (via D.N. Road / Flora Fountain / Veer Nariman Road).' : 'Comfortable urban walking distance.',
      });
    }

    return {
      origin: originNode.origin_label,
      destination: destNode.destination_name,
      distance_km: aerialDistanceKm,
      is_same_city: true,
      city: destNode.city || originNode.city,
      local_modes: localModes,
      train: {
        summary: localTrainSummary,
        approx_duration: localTrainDuration,
        distance_km: roadDistKm,
        stations: localTrainStations,
        lines: [isMumbai ? 'Mumbai Suburban Railway' : isKolkata ? 'Kolkata Suburban Railway' : isDelhi ? 'Delhi-NCR Transit Network' : 'City Suburban Rail'],
        notes: localTrainNotes,
        fare_estimate: '₹5 - ₹15',
      },
      air: undefined,
      road: {
        summary: roadSummary,
        approx_duration: `~${driveMinutes} mins driving / taxi`,
        distance_km: roadDistKm,
        highways: ['City Arterial Roads'],
        notes: roadNotes,
        fare_estimate: isMumbai ? '₹28 - ₹45 (Metered Taxi)' : '₹40 - ₹80',
      },
      walking: roadDistKm <= 3.5 ? {
        summary: `Walking route (~${roadDistKm} km)`,
        approx_duration: `~${walkMinutes} mins`,
        distance_km: roadDistKm,
        notes: `Short urban stroll.`,
      } : undefined,
      taxi: {
        summary: `Metered Taxi / Cab (~${roadDistKm} km)`,
        approx_duration: `~${driveMinutes} mins`,
        distance_km: roadDistKm,
        fare_estimate: isMumbai ? '₹28 - ₹45' : '₹40 - ₹80',
        notes: roadNotes,
      },
    };
  }

  // -------------------------------------------------------------
  // INTERCITY ROUTING (Different cities / distant hubs)
  // -------------------------------------------------------------
  const roadMultiplier = isHilly ? 1.35 : 1.25;
  const roadDistanceKm = Math.round(aerialDistanceKm * roadMultiplier);
  const avgRoadSpeed = isHilly ? 45 : 55; // km/h
  const roadHours = Math.max(1, Math.round(roadDistanceKm / avgRoadSpeed));

  const railDistanceKm = Math.round(aerialDistanceKm * 1.18);
  const trainHours = Math.max(1, Math.round(railDistanceKm / 60));

  let trainSummary = '';
  let trainDuration = `${trainHours} - ${Math.round(trainHours * 1.25)} hours`;
  let trainNotes = '';

  if (destNode.railway_hub.status === 'VERIFIED') {
    trainSummary = `Train from ${originNode.nearest_railway_station.name} (${originNode.nearest_railway_station.code}) to ${destNode.railway_hub.station_name}`;
    trainNotes = destNode.railway_hub.onward_connection_note || 'Scheduled Indian Railways express connectivity. Verify official schedules and book on IRCTC.';
  } else {
    trainSummary = `No verified direct railhead in database for ${destNode.destination_name}`;
    trainDuration = 'Multi-modal transfer required';
    trainNotes = destNode.railway_hub.onward_connection_note || 'No verified direct railway connection found in the available data.';
  }

  let airSummary = '';
  let airDuration = '';
  let airNotes = '';

  if (destNode.airport_hub.status === 'VERIFIED') {
    airSummary = `Flight from ${originNode.nearest_airport.name} (${originNode.nearest_airport.code}) to ${destNode.airport_hub.airport_name}`;
    airDuration = aerialDistanceKm < 450 ? '~1 hr 15 min flight' : aerialDistanceKm < 1000 ? '~2 hrs direct' : '~2.5 to 3.5 hrs direct/connecting';
    airNotes = destNode.airport_hub.onward_connection_note || 'Check official airline portals for current flight schedules.';
  } else {
    airSummary = `No verified commercial airport in ${destNode.destination_name}`;
    airDuration = 'Road transfer from nearest regional hub';
    airNotes = destNode.airport_hub.onward_connection_note || 'No verified direct commercial airport found in the available data.';
  }

  const roadSummary = `Highway route: ${originNode.origin_label} ➔ ${destNode.destination_name}`;
  const roadNotes = isHilly
    ? `Mountain terrain driving. Road ascent involves winding ghat sections; drive cautiously or hire experienced hill drivers. Estimated travel time ~${roadHours} hours.`
    : `Estimated highway driving time is ~${roadHours} hours via National Highway corridors under standard traffic conditions.`;

  return {
    origin: originNode.origin_label,
    destination: destNode.destination_name,
    distance_km: aerialDistanceKm,
    is_same_city: false,
    train: {
      summary: trainSummary,
      approx_duration: trainDuration,
      distance_km: railDistanceKm,
      stations: [
        `${originNode.nearest_railway_station.name} (${originNode.nearest_railway_station.code})`,
        destNode.railway_hub.station_name,
      ],
      lines: ['Indian Railways Broad Gauge Network'],
      notes: trainNotes,
    },
    air: {
      summary: airSummary,
      approx_duration: airDuration,
      airport_origin: `${originNode.nearest_airport.name} (${originNode.nearest_airport.code})`,
      airport_dest: destNode.airport_hub.airport_name,
      notes: airNotes,
    },
    road: {
      summary: roadSummary,
      approx_duration: `~${roadHours} hours driving`,
      distance_km: roadDistanceKm,
      highways: ['National Highway Corridor'],
      notes: roadNotes,
    },
  };
}
