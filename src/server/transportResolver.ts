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
// Station Aliases and Search Utilities
// -------------------------------------------------------------
export const STATION_ALIASES: Record<string, { name: string; code: string; city: string; state: string; lat?: number; lng?: number }> = {
  csmt: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353 },
  cst: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353 },
  mumbaicsmt: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9400, lng: 72.8353 },
  churchgate: { name: 'Churchgate Suburban Terminal (CCG)', code: 'CCG', city: 'Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8264 },
  sina: { name: 'Srinagar Railway Station (SINA)', code: 'SINA', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0384, lng: 74.8384 },
  srinagarstn: { name: 'Srinagar Railway Station (SINA)', code: 'SINA', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0384, lng: 74.8384 },
  srinagarstation: { name: 'Srinagar Railway Station (SINA)', code: 'SINA', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0384, lng: 74.8384 },
  srinagarrailwaystation: { name: 'Srinagar Railway Station (SINA)', code: 'SINA', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0384, lng: 74.8384 },
  svdk: { name: 'Shri Mata Vaishno Devi Katra (SVDK)', code: 'SVDK', city: 'Katra', state: 'Jammu & Kashmir', lat: 32.9856, lng: 74.9547 },
  katrastation: { name: 'Shri Mata Vaishno Devi Katra (SVDK)', code: 'SVDK', city: 'Katra', state: 'Jammu & Kashmir', lat: 32.9856, lng: 74.9547 },
  jat: { name: 'Jammu Tawi (JAT)', code: 'JAT', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7058, lng: 74.8789 },
  jammustation: { name: 'Jammu Tawi (JAT)', code: 'JAT', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7058, lng: 74.8789 },
  bahl: { name: 'Banihal Railway Station (BAHL)', code: 'BAHL', city: 'Banihal', state: 'Jammu & Kashmir', lat: 33.4981, lng: 75.2017 },
  ndls: { name: 'New Delhi Railway Station (NDLS)', code: 'NDLS', city: 'Delhi', state: 'Delhi', lat: 28.6430, lng: 77.2195 },
  delhistation: { name: 'New Delhi Railway Station (NDLS)', code: 'NDLS', city: 'Delhi', state: 'Delhi', lat: 28.6430, lng: 77.2195 },
  dli: { name: 'Old Delhi Railway Station (DLI)', code: 'DLI', city: 'Delhi', state: 'Delhi', lat: 28.6619, lng: 77.2280 },
  nzm: { name: 'Hazrat Nizamuddin (NZM)', code: 'NZM', city: 'Delhi', state: 'Delhi', lat: 28.5888, lng: 77.2534 },
  mmct: { name: 'Mumbai Central (MMCT)', code: 'MMCT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9696, lng: 72.8193 },
  mumbaicentral: { name: 'Mumbai Central (MMCT)', code: 'MMCT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9696, lng: 72.8193 },
  jp: { name: 'Jaipur Junction (JP)', code: 'JP', city: 'Jaipur', state: 'Rajasthan', lat: 26.9196, lng: 75.7878 },
  jaipurstation: { name: 'Jaipur Junction (JP)', code: 'JP', city: 'Jaipur', state: 'Rajasthan', lat: 26.9196, lng: 75.7878 },
  agc: { name: 'Agra Cantt (AGC)', code: 'AGC', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1578, lng: 77.9904 },
  agrastation: { name: 'Agra Cantt (AGC)', code: 'AGC', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1578, lng: 77.9904 },
  bsb: { name: 'Varanasi Junction (BSB)', code: 'BSB', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3283, lng: 82.9858 },
  varanasistation: { name: 'Varanasi Junction (BSB)', code: 'BSB', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3283, lng: 82.9858 },
  sbc: { name: 'KSR Bengaluru (SBC)', code: 'SBC', city: 'Bengaluru', state: 'Karnataka', lat: 12.9781, lng: 77.5694 },
  bengalurustation: { name: 'KSR Bengaluru (SBC)', code: 'SBC', city: 'Bengaluru', state: 'Karnataka', lat: 12.9781, lng: 77.5694 },
  bangalorestation: { name: 'KSR Bengaluru (SBC)', code: 'SBC', city: 'Bengaluru', state: 'Karnataka', lat: 12.9781, lng: 77.5694 },
  mas: { name: 'Chennai Central (MAS)', code: 'MAS', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2756 },
  chennaistation: { name: 'Chennai Central (MAS)', code: 'MAS', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2756 },
  hwh: { name: 'Howrah Junction (HWH)', code: 'HWH', city: 'Kolkata', state: 'West Bengal', lat: 22.5833, lng: 88.3425 },
  kolkatastation: { name: 'Howrah Junction (HWH)', code: 'HWH', city: 'Kolkata', state: 'West Bengal', lat: 22.5833, lng: 88.3425 },
  howrahstation: { name: 'Howrah Junction (HWH)', code: 'HWH', city: 'Kolkata', state: 'West Bengal', lat: 22.5833, lng: 88.3425 },
  adi: { name: 'Ahmedabad Junction (ADI)', code: 'ADI', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  ahmedabadstation: { name: 'Ahmedabad Junction (ADI)', code: 'ADI', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  pune: { name: 'Pune Junction (PUNE)', code: 'PUNE', city: 'Pune', state: 'Maharashtra', lat: 18.5289, lng: 73.8744 },
  punestation: { name: 'Pune Junction (PUNE)', code: 'PUNE', city: 'Pune', state: 'Maharashtra', lat: 18.5289, lng: 73.8744 },
  lko: { name: 'Lucknow Charbagh (LKO)', code: 'LKO', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8317, lng: 80.9248 },
  lucknowstation: { name: 'Lucknow Charbagh (LKO)', code: 'LKO', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8317, lng: 80.9248 },
  bpl: { name: 'Bhopal Junction (BPL)', code: 'BPL', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  bhopalstation: { name: 'Bhopal Junction (BPL)', code: 'BPL', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  st: { name: 'Surat Railway Station (ST)', code: 'ST', city: 'Surat', state: 'Gujarat', lat: 21.2049, lng: 72.8407 },
  suratstation: { name: 'Surat Railway Station (ST)', code: 'ST', city: 'Surat', state: 'Gujarat', lat: 21.2049, lng: 72.8407 },
  brc: { name: 'Vadodara Junction (BRC)', code: 'BRC', city: 'Vadodara', state: 'Gujarat', lat: 22.3107, lng: 73.1812 },
  vadodarastation: { name: 'Vadodara Junction (BRC)', code: 'BRC', city: 'Vadodara', state: 'Gujarat', lat: 22.3107, lng: 73.1812 },
  barodastation: { name: 'Vadodara Junction (BRC)', code: 'BRC', city: 'Vadodara', state: 'Gujarat', lat: 22.3107, lng: 73.1812 },
  pnbe: { name: 'Patna Junction (PNBE)', code: 'PNBE', city: 'Patna', state: 'Bihar', lat: 25.6022, lng: 85.1376 },
  patnastation: { name: 'Patna Junction (PNBE)', code: 'PNBE', city: 'Patna', state: 'Bihar', lat: 25.6022, lng: 85.1376 },
  ghy: { name: 'Guwahati Railway Station (GHY)', code: 'GHY', city: 'Guwahati', state: 'Assam', lat: 26.1824, lng: 91.7516 },
  guwahatistation: { name: 'Guwahati Railway Station (GHY)', code: 'GHY', city: 'Guwahati', state: 'Assam', lat: 26.1824, lng: 91.7516 },
  bbs: { name: 'Bhubaneswar Railway Station (BBS)', code: 'BBS', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2666, lng: 85.8436 },
  bhubaneswarstation: { name: 'Bhubaneswar Railway Station (BBS)', code: 'BBS', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2666, lng: 85.8436 },
  puri: { name: 'Puri Railway Station (PURI)', code: 'PURI', city: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8315 },
  puristation: { name: 'Puri Railway Station (PURI)', code: 'PURI', city: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8315 },
  mao: { name: 'Madgaon Junction (MAO)', code: 'MAO', city: 'Goa', state: 'Goa', lat: 15.2736, lng: 73.9678 },
  goastation: { name: 'Madgaon Junction Goa (MAO)', code: 'MAO', city: 'Goa', state: 'Goa', lat: 15.2736, lng: 73.9678 },
  madgaonstation: { name: 'Madgaon Junction Goa (MAO)', code: 'MAO', city: 'Goa', state: 'Goa', lat: 15.2736, lng: 73.9678 },
  cdg: { name: 'Chandigarh Junction (CDG)', code: 'CDG', city: 'Chandigarh', state: 'Chandigarh', lat: 30.7056, lng: 76.8013 },
  chandigarhstation: { name: 'Chandigarh Junction (CDG)', code: 'CDG', city: 'Chandigarh', state: 'Chandigarh', lat: 30.7056, lng: 76.8013 },
  asr: { name: 'Amritsar Junction (ASR)', code: 'ASR', city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  amritsarstation: { name: 'Amritsar Junction (ASR)', code: 'ASR', city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  sml: { name: 'Shimla Railway Station (SML)', code: 'SML', city: 'Shimla', state: 'Himachal Pradesh', lat: 31.1039, lng: 77.1644 },
  shimlastation: { name: 'Shimla Railway Station (SML)', code: 'SML', city: 'Shimla', state: 'Himachal Pradesh', lat: 31.1039, lng: 77.1644 },
  ers: { name: 'Ernakulam Junction (ERS)', code: 'ERS', city: 'Kochi', state: 'Kerala', lat: 9.9678, lng: 76.2891 },
  kochistation: { name: 'Ernakulam Junction (ERS)', code: 'ERS', city: 'Kochi', state: 'Kerala', lat: 9.9678, lng: 76.2891 },
  ernakulamstation: { name: 'Ernakulam Junction (ERS)', code: 'ERS', city: 'Kochi', state: 'Kerala', lat: 9.9678, lng: 76.2891 },
  tvc: { name: 'Thiruvananthapuram Central (TVC)', code: 'TVC', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4875, lng: 76.9532 },
  trivandrumstation: { name: 'Thiruvananthapuram Central (TVC)', code: 'TVC', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4875, lng: 76.9532 },
};

export function findStationByQuery(query: string): { name: string; code: string; city: string; state: string } | null {
  if (!query) return null;
  initializeTransportRegistry();
  const qClean = query.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (STATION_ALIASES[qClean]) {
    const a = STATION_ALIASES[qClean];
    return { name: a.name, code: a.code, city: a.city, state: a.state };
  }

  const qUpper = query.trim().toUpperCase();
  const matchByCode = MASTER_VERIFIED_STATIONS.find(s => s.code.toUpperCase() === qUpper);
  if (matchByCode) {
    return { name: matchByCode.name, code: matchByCode.code, city: matchByCode.city, state: matchByCode.state };
  }

  const qLower = query.trim().toLowerCase();
  const matchByName = MASTER_VERIFIED_STATIONS.find(
    s => s.name.toLowerCase() === qLower || s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean
  );
  if (matchByName) {
    return { name: matchByName.name, code: matchByName.code, city: matchByName.city, state: matchByName.state };
  }

  return null;
}

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

// -------------------------------------------------------------
// Master Verified Transport Registry (Initialized from authentic files)
// -------------------------------------------------------------
const MASTER_VERIFIED_STATIONS: VerifiedStationNode[] = [];
const MASTER_VERIFIED_AIRPORTS: VerifiedAirportNode[] = [];

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

  // 2. Ingest verified stations & airports from INDIA_TOURISM_DATABASE
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
    { name: 'Indira Gandhi International Airport', code: 'DEL', city: 'New Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000, status: 'VERIFIED' },
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
    const trimmed = rawOrigin.trim();
    if (!trimmed || trimmed.toLowerCase() === 'unknown' || trimmed.toLowerCase() === 'your location') {
      return null;
    }
    label = trimmed;
    const cleanLower = label.toLowerCase();
    // Try matching city
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
      // Try matching verified station
      const stn = MASTER_VERIFIED_STATIONS.find(
        (s) => s.city.toLowerCase() === cleanLower || s.name.toLowerCase().includes(cleanLower) || cleanLower.includes(s.city.toLowerCase())
      );
      if (stn) {
        city = stn.city;
        state = stn.state;
        lat = stn.lat;
        lng = stn.lng;
        hasCoords = true;
      }
    }
  } else if (rawOrigin && typeof rawOrigin === 'object') {
    if (rawOrigin.lat && rawOrigin.lng && !isNaN(rawOrigin.lat) && !isNaN(rawOrigin.lng)) {
      lat = rawOrigin.lat;
      lng = rawOrigin.lng;
      hasCoords = true;
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
    origin_label: label || city || 'Verified Origin',
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
// (NEVER invent "${dest} Railway Station" or "${dest} Airport")
// -------------------------------------------------------------
export function resolveDestinationTransportNode(
  destQuery: string,
  placesData?: Map<string, any>
): ResolvedTransportDestination {
  initializeTransportRegistry();

  const q = destQuery.trim().toLowerCase();

  // 1. Check if destination is a Point of Interest (POI) like "Dal Lake", "Gateway of India", etc.
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

  // 2. Special Mountain & Heritage Hubs with distinct physical railhead/airport geography
  // DARJEELING
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

  // DAL LAKE
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

  // SRINAGAR / KASHMIR
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

  // OOTY / UDHAGAMANDALAM
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

  // SHIMLA
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

  // LEH / LADAKH
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

  // HAMPI
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

  // SONAMARG
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

  // KANYAKUMARI
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

  // GOA
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

  // DELHI / NEW DELHI
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

  // 3. Resolve by Matched POI
  if (matchedPlace) {
    const poiCity = matchedPlace.city || 'India';
    const poiState = matchedPlace.state || '';
    const poiCoords = matchedPlace.coordinates || { lat: 20.5937, lng: 78.9629 };

    // Find verified station for the POI's city
    let cityStn = MASTER_VERIFIED_STATIONS.find(
      (s) => s.city.toLowerCase() === poiCity.toLowerCase()
    );
    let stnDist = cityStn ? haversineDistanceKm(poiCoords.lat, poiCoords.lng, cityStn.lat, cityStn.lng) : 0;

    if (!cityStn) {
      // Find closest verified station by coordinates
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

    // Find verified airport for the POI's city
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

  // 4. Resolve by City in INDIA_TOURISM_DATABASE
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

  // 5. Fallback: Search closest verified nodes from geographic index
  // If destination is completely unrecognized, do NOT invent a station or airport!
  return {
    is_poi: false,
    destination_name: destQuery,
    city: destQuery,
    state: 'India',
    coordinates: { lat: 20.5937, lng: 78.9629 },
    railway_hub: {
      station_name: 'No verified direct railway station found in the available data',
      station_code: '',
      is_direct: false,
      onward_connection_note: `No verified railway station found in Virasat database for "${destQuery}". Please specify a nearby major city.`,
      status: 'NOT_AVAILABLE',
    },
    airport_hub: {
      airport_name: 'No verified airport found in the available data',
      airport_code: '',
      is_direct: false,
      onward_connection_note: `No verified commercial airport found in Virasat database for "${destQuery}".`,
      status: 'NOT_AVAILABLE',
    },
  };
}

// -------------------------------------------------------------
// Build Verified Multimodal Transit Comparison
// -------------------------------------------------------------
export function buildVerifiedTransitComparison(
  originNode: ResolvedTransportOrigin,
  destNode: ResolvedTransportDestination,
  selectedMode?: 'train' | 'air' | 'road' | 'all'
): TransitComparison {
  const oLat = originNode.coordinates.lat;
  const oLng = originNode.coordinates.lng;
  const dLat = destNode.coordinates.lat;
  const dLng = destNode.coordinates.lng;

  // Real Haversine straight-line distance
  const aerialDistanceKm = Math.round(haversineDistanceKm(oLat, oLng, dLat, dLng));

  // Realistic highway distance (approx 1.25 - 1.35x aerial distance depending on terrain)
  const isHilly = destNode.geographic_notes?.toLowerCase().includes('mountain') || destNode.geographic_notes?.toLowerCase().includes('hill');
  const roadMultiplier = isHilly ? 1.35 : 1.25;
  const roadDistanceKm = Math.round(aerialDistanceKm * roadMultiplier);
  const avgRoadSpeed = isHilly ? 45 : 55; // km/h
  const roadHours = Math.max(1, Math.round(roadDistanceKm / avgRoadSpeed));

  // Realistic railway calculation
  const railDistanceKm = Math.round(aerialDistanceKm * 1.18);
  const trainHours = Math.max(1, Math.round(railDistanceKm / 60));

  // Train Option
  let trainSummary = '';
  let trainDuration = `${trainHours} - ${Math.round(trainHours * 1.25)} hours`;
  let trainNotes = '';

  const isSameStation =
    (originNode.nearest_railway_station.code && destNode.railway_hub.station_code && originNode.nearest_railway_station.code === destNode.railway_hub.station_code) ||
    (originNode.city.toLowerCase() === destNode.city.toLowerCase() && aerialDistanceKm < 25);

  if (isSameStation) {
    trainSummary = `Local suburban / metro transit within ${destNode.city || destNode.destination_name}`;
    trainDuration = '15 - 45 mins';
    trainNotes = `You are already located within or near ${destNode.city || destNode.destination_name}. Use city local transport (metro, suburban rail, or auto/cab) instead of intercity rail.`;
  } else if (destNode.railway_hub.status === 'VERIFIED') {
    trainSummary = `Train from ${originNode.nearest_railway_station.name} (${originNode.nearest_railway_station.code}) to ${destNode.railway_hub.station_name}`;
    trainNotes = destNode.railway_hub.onward_connection_note || 'Scheduled Indian Railways express connectivity. Verify official schedules and book on IRCTC.';
  } else {
    trainSummary = `No verified direct railhead in database for ${destNode.destination_name}`;
    trainDuration = 'Multi-modal transfer required';
    trainNotes = destNode.railway_hub.onward_connection_note || 'No verified direct railway connection found in the available data.';
  }

  // Flight Option
  let airSummary = '';
  let airDuration = '';
  let airNotes = '';

  const isSameMetro =
    originNode.city.toLowerCase() === destNode.city.toLowerCase() ||
    aerialDistanceKm < 35 ||
    (originNode.nearest_airport.code && destNode.airport_hub.airport_code && originNode.nearest_airport.code === destNode.airport_hub.airport_code);

  if (isSameMetro) {
    airSummary = `Intra-city / short distance: No commercial flights operated within ${destNode.city || destNode.destination_name}`;
    airDuration = 'N/A (Local transit recommended)';
    airNotes = `You are already within or near ${destNode.city || destNode.destination_name}. Intercity flights do not operate within the same metropolitan area; use local road or rail transit.`;
  } else if (destNode.airport_hub.status === 'VERIFIED') {
    airSummary = `Flight from ${originNode.nearest_airport.name} (${originNode.nearest_airport.code}) to ${destNode.airport_hub.airport_name}`;
    airDuration = aerialDistanceKm < 450 ? '~1 hr 15 min flight' : aerialDistanceKm < 1000 ? '~2 hrs direct' : '~2.5 to 3.5 hrs direct/connecting';
    airNotes = destNode.airport_hub.onward_connection_note || 'Check official airline portals for current flight schedules.';
  } else {
    airSummary = `No verified commercial airport in ${destNode.destination_name}`;
    airDuration = 'Road transfer from nearest regional hub';
    airNotes = destNode.airport_hub.onward_connection_note || 'No verified direct commercial airport found in the available data.';
  }

  // Road Option
  const roadSummary = `Highway route: ${originNode.origin_label} ➔ ${destNode.destination_name}`;
  const roadNotes = isHilly
    ? `Mountain terrain driving. Road ascent involves winding ghat sections; drive cautiously or hire experienced hill drivers. Estimated travel time ~${roadHours} hours.`
    : `Estimated highway driving time is ~${roadHours} hours via National Highway corridors under standard traffic conditions.`;

  return {
    origin: originNode.origin_label,
    destination: destNode.destination_name,
    distance_km: aerialDistanceKm,
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
