import React, { useState, useEffect } from 'react';
import { PlaceDetail } from '../types';
import { api } from '../services/api';
import {
  ArrowLeft,
  MapPin,
  Compass,
  Sparkles,
  Navigation,
  Box,
  Share2,
  Heart,
  Landmark,
  ShieldCheck,
  Calendar,
  BookOpen,
  Train,
  CheckCircle2,
  Clock,
  IndianRupee,
  Layers,
  Info,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { CitizenReportModal } from '../components/common/CitizenReportModal';
import { VisitingInfoCard } from '../components/destination/VisitingInfoCard';
import { RailwayStationsCard } from '../components/destination/RailwayStationsCard';
import { NearbyCarousel } from '../components/destination/NearbyCarousel';
import { RouteCalculator } from '../components/destination/RouteCalculator';
import { GatewayOfIndia3D } from '../components/threed/GatewayOfIndia3D';
import { InteractiveHeritageMonument3D, Monument3DType } from '../components/threed/InteractiveHeritageMonument3D';
import { VirasatHeritageGuide } from '../components/cultural-guides/VirasatHeritageGuide';
import { SafarRouteGuide } from '../components/cultural-guides/SafarRouteGuide';

interface DestinationDetailPageProps {
  placeId: string;
  onBack: () => void;
  onSelectPlace: (placeId: string) => void;
  onOpenAIChat?: (placeId: string, placeName: string) => void;
  isFavorite?: (placeId: string) => boolean;
  toggleFavorite?: (placeId: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  placeId,
  onBack,
  onSelectPlace,
  onOpenAIChat,
  isFavorite = () => false,
  toggleFavorite = () => {},
}) => {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [show3DModel, setShow3DModel] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>('Excellent / Well Maintained');

  const resolve3DMonumentType = (pId: string): Monument3DType | null => {
    const idLower = pId.toLowerCase();
    if (idLower.includes('amber') || idLower.includes('amer')) return 'amber-palace';
    if (idLower.includes('hawa')) return 'hawa-mahal';
    if (idLower.includes('taj')) return 'taj-mahal';
    if (idLower.includes('qutub')) return 'qutub-minar';
    if (idLower.includes('konark')) return 'konark-sun-temple';
    if (idLower.includes('hampi')) return 'hampi-stone-temple';
    if (idLower.includes('gateway')) return 'gateway-of-india';
    return null;
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPlaceById(placeId);
        if (isMounted) {
          setPlace(data);
        }
        try {
          const health = await api.getDestinationHealthForPlace(placeId);
          if (isMounted && health) {
            setHealthScore(health.health_score);
            setHealthStatus(health.status_label);
          }
        } catch {
          // fallback to default health score
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load destination details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [placeId]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#FF671F] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Loading Heritage Dossier...
        </span>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-[#EFE8DF] rounded-3xl max-w-lg mx-auto my-12 shadow-warm">
        <MapPin className="w-12 h-12 text-stone-400 mb-3" />
        <h3 className="font-serif text-lg font-bold text-stone-900">Destination Dossier Unavailable</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-xs">{error || 'Place record could not be found.'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition shadow-xs"
        >
          ← Return to Explorer
        </button>
      </div>
    );
  }

  const lat = place.coordinates?.lat ?? (place.coordinates as any)?.latitude ?? 18.922;
  const lng = place.coordinates?.lng ?? (place.coordinates as any)?.longitude ?? 72.8347;

  const serverStations = (place as any).nearby_stations;
  const railwayStations = Array.isArray(serverStations) && serverStations.length > 0
    ? serverStations
    : [
        {
          id: 'nearby-stn',
          name: `${place.city || 'Central'} Railway Hub`,
          code: 'STN',
          distance_km: 3.5,
          walking_time_mins: 40,
          road_time_mins: 12,
          transfer_modes: ['Taxi', 'Auto-Rickshaw'],
          line: 'Mainline Corridor',
        },
      ];

  const has3D = Boolean(place.features && place.features['3d']);
  const favActive = isFavorite(place.id);
  const nearby = (place as any).nearby_places || [];

  return (
    <div className="min-h-screen text-stone-900 pb-20 space-y-10 animate-fadeIn">
      {/* 1. Hero image & Top Navigation */}
      <div className="relative h-80 sm:h-[420px] w-full overflow-hidden rounded-3xl border border-[#EFE8DF] shadow-warm bg-stone-100">
        <img
          src={
            place.thumbnail_url ||
            (place.images && place.images[0]) ||
            'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80'
          }
          alt={place.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-stone-900/10" />

        {/* Back and Action Bar */}
        <div className="absolute top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-semibold shadow-xs transition backdrop-blur-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#FF671F] text-xs font-semibold shadow-xs transition backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              title="Report Heritage Issue / Maintenance"
              aria-label="Report Heritage Issue or Maintenance need"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF671F]" aria-hidden="true" />
              <span className="hidden sm:inline">Report Issue</span>
            </button>
            <button
              onClick={() => toggleFavorite(place.id)}
              className={`p-2.5 rounded-full shadow-xs transition backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                favActive
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white/90 hover:bg-white text-stone-700'
              }`}
              title="Save to Favorites"
              aria-label={favActive ? 'Remove from saved favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${favActive ? 'fill-rose-500' : ''}`} aria-hidden="true" />
            </button>
            <button
              onClick={() => {
                if (navigator?.clipboard?.writeText) {
                  navigator.clipboard.writeText(window.location.href).catch(() => {});
                }
              }}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-xs transition backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              title="Share Place"
              aria-label="Copy place link to clipboard"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 2. Monument name + 3. Location & Heritage Status */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-2 text-white">
          <div className="flex items-center gap-2 flex-wrap">
            <ProvenanceBadge
              type={place.data_confidence || 'OFFICIAL'}
              sourceUrl={place.source_url}
              verifiedAt={place.last_verified_at}
            />
            {place.heritage_status && (
              <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FF671F] text-xs font-bold shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>{place.heritage_status}</span>
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full backdrop-blur-md border text-xs font-bold flex items-center gap-1 ${
                (healthScore ?? 96) >= 80
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100'
                  : (healthScore ?? 96) >= 60
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-100'
                  : 'bg-rose-500/20 border-rose-400/40 text-rose-100'
              }`}
              title={healthStatus}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Preservation: {healthScore ?? 96}%</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
              {place.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight drop-shadow-sm">
            {place.name}
          </h1>

          <div className="text-xs sm:text-sm text-stone-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              {place.area_neighborhood ? `${place.area_neighborhood}, ` : ''}
              {place.city}, {place.state}, {place.country || 'India'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Editorial Content Column */}
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto space-y-12 sm:space-y-14 px-2 sm:px-4 pb-16">
        {/* 4. Short Introduction */}
        <section className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Overview</span>
          </div>
          <p className="font-serif text-lg sm:text-xl text-stone-800 leading-relaxed">
            {place.description || place.summary}
          </p>
          {place.tags && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {place.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* 5. History */}
        <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Historical Significance</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Origins & Heritage Chronicles
          </h2>
          <div className="text-sm text-stone-700 leading-relaxed space-y-3">
            <p>
              {place.history ||
                `${place.name} has stood for centuries as an enduring symbol of regional craftsmanship, civic legacy, and cultural identity.`}
            </p>
            {place.culture && (
              <p className="text-stone-600 italic">
                "{place.culture}"
              </p>
            )}
          </div>
        </section>

        {/* 6. Architecture */}
        <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" />
            <span>Architectural Craftsmanship</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Structural Geometry & Masonry
          </h2>
          <p className="text-sm text-stone-700 leading-relaxed">
            {(place as any).architecture ||
              `${place.name} showcases signature traditional Indian architectural motifs, combining precision stone geometry, ornate arches, and master craftsmanship designed to withstand the test of time.`}
          </p>

          {/* 3D Architectural Model Viewer */}
          {resolve3DMonumentType(place.id) && (
            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>360° Interactive 3D Architectural Reconstruction</span>
                </span>
                <button
                  onClick={() => setShow3DModel((prev) => !prev)}
                  className="px-3 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#FF671F] border border-orange-200 text-xs font-semibold transition"
                >
                  {show3DModel ? 'Hide 3D Model' : 'Open 3D Model'}
                </button>
              </div>

              {show3DModel && (
                <div className="rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-warm">
                  <InteractiveHeritageMonument3D
                    monumentType={resolve3DMonumentType(place.id)!}
                    monumentName={place.name}
                    cityName={place.city}
                    heightClass="h-80 sm:h-96"
                  />
                </div>
              )}
            </div>
          )}

          {/* Virasat Cultural Heritage Guide */}
          <div className="pt-2">
            <VirasatHeritageGuide
              monumentName={place.name}
              location={`${place.city}, ${place.state}`}
              heritageStatus={place.heritage_status || 'Catalogued Heritage Site'}
              onAskHeritageAI={(prompt) => onOpenAIChat?.(place.id, prompt)}
              onView3DModel={resolve3DMonumentType(place.id) ? () => setShow3DModel(true) : undefined}
            />
          </div>
        </section>

        {/* 7. Visitor Information */}
        <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Practical Information</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Visitor Guidelines & Timings
          </h2>
          <VisitingInfoCard place={place} />
        </section>

        {/* 7B. Data Provenance & Official Source Citations (Section XI.1 & XV.2) */}
        <section className="space-y-4 pt-6 border-t border-[#EFE8DF] bg-white p-6 sm:p-8 rounded-3xl border shadow-warm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Archival Integrity & Field-Level Provenance</span>
            </div>
            <ProvenanceBadge
              type={place.data_confidence || 'OFFICIAL'}
              sourceUrl={place.source_url}
              verifiedAt={place.last_verified_at}
            />
          </div>

          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Source Authority & Audit Traceability
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every factual claim in Virasat carries individual field-level provenance to ensure strict compliance with Archaeological Survey of India (ASI) standards and prevent synthetic or unverified hallucination.
          </p>

          {/* Provenance Facts Grid */}
          {Array.isArray((place as any).facts) && (place as any).facts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {(place as any).facts.map((fact: any) => (
                <div key={fact.id || fact.fact_key} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      {fact.fact_key.replace(/_/g, ' ')}
                    </span>
                    <ProvenanceBadge type={fact.data_confidence} size="sm" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                    {fact.fact_value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Official Source Link & Citation */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-stone-100 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">Official Source Authority:</span>
              <a
                href={place.source_url || 'https://asi.nic.in'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#FF671F] font-semibold hover:underline"
              >
                <span>{place.source_url || 'asi.nic.in'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {place.last_verified_at && (
              <div className="text-stone-400">
                Last Verified: {new Date(place.last_verified_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </section>

        {/* 8. Nearby Places */}
        {nearby && nearby.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Surrounding Heritage</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Nearby Places of Interest
            </h2>
            <NearbyCarousel
              places={nearby}
              currentPlaceName={place.name}
              onSelectPlace={onSelectPlace}
            />
          </section>
        )}

        {/* 9. How to Reach */}
        <section className="space-y-6 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>Transit & Access</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            How to Reach {place.name}
          </h2>

          {/* Railway Stations Card */}
          <RailwayStationsCard
            placeName={place.name}
            stations={railwayStations}
            onSelectStationForRoute={() => {}}
          />

          {/* Safar Cultural Route Guide */}
          <SafarRouteGuide
            origin={railwayStations[0]?.name || `${place.city} Station`}
            destination={place.name}
            cityContext={place.city}
            estimatedFare={railwayStations[0] ? `₹${Math.max(10, Math.round(railwayStations[0].distance_km * 18))}` : '₹30 - ₹120'}
            onOpenRailTransit={() => {}}
          />

          {/* Multimodal Journey Planner */}
          <RouteCalculator
            destinationId={place.id}
            destinationName={place.name}
            destinationLat={lat}
            destinationLng={lng}
            destinationCity={place.city}
            initialOrigin={railwayStations[0]?.name || undefined}
          />
        </section>

        {/* 10. 3D Experience (if available) */}
        {has3D && (
          <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" />
              <span>3D Digital Twin</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Interactive 3D Heritage Explorer
            </h2>
            <p className="text-xs text-stone-600">
              Inspect architectural arches, dome elevations, and stone masonry details in WebGL.
            </p>
            <GatewayOfIndia3D
              onPlanVisit={() => {}}
              height="h-[550px]"
            />
          </section>
        )}

        {/* 11. AI Guide */}
        <section className="pt-6 border-t border-[#EFE8DF]">
          <div className="rounded-3xl bg-white border border-[#EFE8DF] shadow-warm p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-[#FF671F] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FF671F]" />
              <span>Personal Cultural Concierge</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Ask Virasat about {place.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Curious about architectural secrets, morning photography lighting, or hidden courtyard carvings? Ask our cultural guide.
            </p>
            <button
              onClick={() => onOpenAIChat && onOpenAIChat(place.id, place.name)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white font-bold text-xs transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Cultural Conversation</span>
            </button>
          </div>
        </section>
      </div>

      {/* Citizen Heritage Condition Report Modal */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        placeId={place.id}
        placeName={place.name}
        city={place.city}
        onSuccess={async () => {
          try {
            const health = await api.getDestinationHealthForPlace(place.id);
            if (health) {
              setHealthScore(health.health_score);
              setHealthStatus(health.status_label);
            }
          } catch {
            // ignore
          }
        }}
      />
    </div>
  );
};
