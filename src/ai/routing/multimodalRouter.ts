/**
 * Multimodal Router for Virasat AI Assistant
 * Provides verified transit comparisons for both intra-city local trips and inter-city journeys across India.
 */

import { RouteOption } from '../types';
import { TransitComparison } from '../../types';
import {
  resolveOriginTransportNode,
  resolveDestinationTransportNode,
  buildVerifiedTransitComparison,
} from '../../server/transportResolver';
import { haversineDistanceKm, estimateRoadDistanceKm, estimateTravelTime } from '../utils/distance';
import { formatINR } from '../utils/formatters';
import { masterTourismDataService } from '../../server/masterTourismDataService';
import { canonicalizeLocation } from '../utils/locationHelper';

export class MultimodalRouter {
  public calculateRoute(
    originRaw: string,
    destRaw: string,
    preferredMode: string = 'all'
  ): { routes: RouteOption[]; comparison: TransitComparison | null } {
    const origCanonical = canonicalizeLocation(originRaw);
    const destCanonical = canonicalizeLocation(destRaw);
    const origNode = resolveOriginTransportNode(origCanonical);
    const destNode = resolveDestinationTransportNode(destCanonical);

    if (!origNode || !destNode) {
      return { routes: [], comparison: null };
    }

    // Call existing transport resolver engine
    const comparison = buildVerifiedTransitComparison(origNode, destNode);

    const routes: RouteOption[] = [];
    if (!comparison) {
      return { routes, comparison: null };
    }

    const isSameCity = !!comparison.is_same_city;
    const distanceKm = comparison.distance_km || 0;
    const city = comparison.city || origNode?.city || destNode?.city || 'Local Area';

    if (isSameCity) {
      // 1. Suburban Train / Metro
      if (comparison.train) {
        routes.push({
          origin: comparison.origin,
          destination: comparison.destination,
          mode: 'Suburban Local Train',
          distance_km: distanceKm,
          duration: comparison.train.approx_duration || 'Approx. 20-30 mins',
          fare_estimate: '₹5 – ₹10 (Regulated Suburban Tariff)',
          is_same_city: true,
          city,
          notes: comparison.train.notes || comparison.train.summary || '',
        });
      }

      // 2. Metered Taxi / Cab
      if (comparison.road) {
        const roadKm = estimateRoadDistanceKm(distanceKm);
        const taxiFareMin = Math.max(28, Math.round(roadKm * 18));
        const taxiFareMax = Math.max(40, Math.round(roadKm * 24));
        routes.push({
          origin: comparison.origin,
          destination: comparison.destination,
          mode: 'Regulated Metered Taxi / Cab',
          distance_km: roadKm,
          duration: comparison.road.approx_duration || 'Approx. 15-25 mins',
          fare_estimate: `${formatINR(taxiFareMin)} – ${formatINR(taxiFareMax)}`,
          is_same_city: true,
          city,
          notes: comparison.road.notes || comparison.road.summary || '',
        });
      }

      // 3. Auto Rickshaw (if available in city)
      if (city.toLowerCase() !== 'south mumbai' && distanceKm <= 20) {
        const roadKm = estimateRoadDistanceKm(distanceKm);
        const autoFareMin = Math.max(23, Math.round(roadKm * 15));
        const autoFareMax = Math.max(30, Math.round(roadKm * 18));
        routes.push({
          origin: comparison.origin,
          destination: comparison.destination,
          mode: 'Auto Rickshaw',
          distance_km: roadKm,
          duration: estimateTravelTime(roadKm, 'auto').formatted,
          fare_estimate: `${formatINR(autoFareMin)} – ${formatINR(autoFareMax)} (RTO Meter Fare)`,
          is_same_city: true,
          city,
          notes: 'Flag down at designated auto stand or book via Ola/Uber Auto.',
        });
      }

      // 4. Scenic Heritage Walk (if distance < 3.5 km)
      if (distanceKm <= 3.5) {
        const walkTime = estimateTravelTime(distanceKm, 'walking').formatted;
        routes.push({
          origin: comparison.origin,
          destination: comparison.destination,
          mode: 'Heritage Walk (Pedestrian)',
          distance_km: distanceKm,
          duration: walkTime,
          fare_estimate: 'Free (₹0)',
          is_same_city: true,
          city,
          notes: 'Safe and walkable heritage corridor with colonial street architecture.',
        });
      }
    } else {
      // Inter-city routes
      // 1. Indian Railways
      if (comparison.train) {
        routes.push({
          origin: comparison.origin,
          destination: comparison.destination,
          mode: 'Indian Railways (Express / Vande Bharat)',
          distance_km: distanceKm,
          duration: comparison.train.approx_duration || 'Express Rail Service',
          fare_estimate: (comparison.train as any).estimated_fare_range || '₹350 – ₹1,800 (SL / 3A / CC)',
          is_same_city: false,
          notes: `${comparison.train.summary}. ${comparison.train.notes || ''}`,
        });
      }

      // 2. Air / Flight
      if (comparison.air) {
        routes.push({
          origin: comparison.origin,
          destination: comparison.destination,
          mode: 'Commercial Flight',
          distance_km: distanceKm,
          duration: comparison.air.approx_duration || 'Direct flight',
          fare_estimate: (comparison.air as any).estimated_fare_range || '₹3,200 – ₹7,500',
          is_same_city: false,
          notes: `${comparison.air.summary}. ${comparison.air.notes || ''}`,
        });
      }

      // 3. Road / Bus / Self-drive
      if (comparison.road) {
        routes.push({
          origin: comparison.origin,
          destination: comparison.destination,
          mode: 'Roadway (Intercity Bus / Taxi)',
          distance_km: Math.round(distanceKm * 1.25),
          duration: comparison.road.approx_duration || 'Intercity Highway',
          fare_estimate: (comparison.road as any).estimated_fare_range || '₹600 – ₹2,400',
          is_same_city: false,
          notes: comparison.road.summary || '',
        });
      }
    }

    return { routes, comparison };
  }
}

export const multimodalRouter = new MultimodalRouter();
