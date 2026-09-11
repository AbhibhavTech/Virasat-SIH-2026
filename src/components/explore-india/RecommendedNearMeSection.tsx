import {
  RecommendedPlacesNearYou,
  RecommendedPlacesNearYouProps,
  NearbyAttractionItem,
} from './RecommendedPlacesNearYou';
import {
  haversineDistanceKm,
  estimateTravelTime,
} from '../../utils/geoUtils';

// Export aliases matching existing expectations
export const calculateHaversineKm = haversineDistanceKm;
export const formatDriveTime = estimateTravelTime;

export { RecommendedPlacesNearYou };
export const RecommendedNearMeSection = RecommendedPlacesNearYou;

export type { RecommendedPlacesNearYouProps };
export type RecommendedNearMeSectionProps = RecommendedPlacesNearYouProps;
export type { NearbyAttractionItem };

export default RecommendedPlacesNearYou;
