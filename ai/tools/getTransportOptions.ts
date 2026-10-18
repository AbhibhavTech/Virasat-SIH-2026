import {
  resolveOriginTransportNode,
  resolveDestinationTransportNode,
  buildVerifiedTransitComparison,
} from '../../src/server/transportResolver';
import { describeAirportAccess, haversineDistanceKm } from '../../src/data/indianAirports';
import { findConnectedRailRoute, getRealRoadRoute } from '../../src/server/railwayRoutingEngine';

export const declaration = {
  name: 'getTransportOptions',
  description: 'Compare drive, rail, walk and airport gateways between Indian cities, stations and destinations. Flight data identifies the nearest airports and ground transfers; it does not claim a live flight schedule, fare or seat.',
  parameters: {
    type: 'OBJECT',
    properties: {
      origin: {
        type: 'STRING',
        description: 'Starting city, station, or landmark (e.g., "New Delhi", "Mumbai", "Jaipur", "Kolkata").',
      },
      destination: {
        type: 'STRING',
        description: 'Target city, heritage monument, or destination (e.g., "Varanasi", "Agra", "Kochi", "Udaipur").',
      },
      user_lat: {
        type: 'NUMBER',
        description: 'Optional latitude of current traveler location.',
      },
      user_lng: {
        type: 'NUMBER',
        description: 'Optional longitude of current traveler location.',
      },
    },
    required: ['destination'],
  },
};

export async function execute(args: {
  origin?: string;
  destination: string;
  user_lat?: number;
  user_lng?: number;
}): Promise<any> {
  const originName = (args.origin || '').trim();
  const destName = (args.destination || '').trim();

  if (!destName) {
    return { error: 'Destination is required to compute transit options.' };
  }
  if (!originName && !(Number.isFinite(args.user_lat) && Number.isFinite(args.user_lng))) {
    return { error: 'Origin is required. Ask the traveler for their starting city.' };
  }

  const origInput = (args.user_lat && args.user_lng)
    ? { lat: args.user_lat, lng: args.user_lng, city: originName }
    : originName;

  const origNode = resolveOriginTransportNode(origInput);
  if (!origNode) return { error: `Origin ${originName} could not be resolved from available transport records.` };

  const destNode = resolveDestinationTransportNode(destName);
  const isNationalPlaceholder = Math.abs(destNode.coordinates.lat - 20.5937) < 0.0001 && Math.abs(destNode.coordinates.lng - 78.9629) < 0.0001;
  if (isNationalPlaceholder) return { origin: originName, destination: destName, error: 'Destination coordinates are unavailable; no distance or route can be computed.', live_availability_checked: false };
  const comparison = buildVerifiedTransitComparison(origNode, destNode);
  const [roadRoute] = await Promise.all([
    getRealRoadRoute(
      origNode.coordinates.lat,
      origNode.coordinates.lng,
      destNode.coordinates.lat,
      destNode.coordinates.lng,
      'DRIVE'
    ),
  ]);
  const railRoute = findConnectedRailRoute(
    origNode.coordinates.lat,
    origNode.coordinates.lng,
    destNode.coordinates.lat,
    destNode.coordinates.lng
  );
  const airportAccess = {
    origin: describeAirportAccess(origNode.coordinates.lat, origNode.coordinates.lng),
    destination: describeAirportAccess(destNode.coordinates.lat, destNode.coordinates.lng),
  };
  const airportToAirportKm = haversineDistanceKm(
    airportAccess.origin.airport.lat,
    airportAccess.origin.airport.lng,
    airportAccess.destination.airport.lat,
    airportAccess.destination.airport.lng
  );
  const walkingMinutes = Math.round((roadRoute.distanceKm / 4.8) * 60);

  return {
    origin: comparison.origin,
    destination: comparison.destination,
    source: 'Virasat route corridors, stored transport registry, and airport-gateway map data',
    live_availability_checked: false,
    estimate_note: 'Road geometry is mapped. Rail is a track-aligned corridor. Walking time is an estimate along the road distance. Flight schedules, fares, seats and airport transfer availability are not live-checked.',
    straight_line_km: comparison.distance_km,
    transit_options: {
      train: {
        available: railRoute.polyline.length >= 2,
        schedule_verified: false, direct_service_verified: false,
        summary: 'Mapped rail corridor only. Direct trains, interchange stations and service availability have not been verified.',
        approx_duration: 'Check an actual train timetable',
        mapped_stops: railRoute.stops,
        verification_url: 'https://www.irctc.co.in/',
        notes: 'This is route geometry and a planning estimate. Confirm the train, station, timetable and seat availability on IRCTC.',
      },
      air: {
        available: true,
        schedule_verified: false,
        summary: `Airport gateways: ${airportAccess.origin.airport.name} (${airportAccess.origin.airport.iata}) in ${airportAccess.origin.airport.city} → ${airportAccess.destination.airport.name} (${airportAccess.destination.airport.iata}) in ${airportAccess.destination.airport.city}.`,
        approx_duration: `Airport-to-airport distance: about ${airportToAirportKm} km`,
        origin_airport: airportAccess.origin,
        destination_airport: airportAccess.destination,
        notes: `Ground transfer: ${airportAccess.origin.ground_transfer_note} ${airportAccess.destination.ground_transfer_note} A flight schedule is not verified.`,
      },
      road: {
        available: true,
        summary: `Drive via the mapped India road corridor (${roadRoute.distanceKm} km).`,
        approx_duration: roadRoute.durationFormatted,
        route_engine: roadRoute.source === 'osrm' ? 'OSRM road geometry' : 'Virasat India-only road corridor',
        notes: 'Driving duration is an estimate; traffic, closures and local access can change.',
      },
      walk: {
        available: roadRoute.distanceKm <= 30,
        summary: roadRoute.distanceKm <= 30
          ? `Walk along the mapped road corridor (${roadRoute.distanceKm} km).`
          : `Walking distance is about ${roadRoute.distanceKm} km; this is too long for a normal walking journey.`,
        approx_duration: `${Math.floor(walkingMinutes / 60)}h ${walkingMinutes % 60}m estimate`,
        notes: 'Check footpaths, safety, weather and restricted roads before walking.',
      },
    },
    airport_access: airportAccess,
    recommendation: 'Compare live schedules, fares and door-to-door time with the official operator before choosing a mode.',
  };
}
