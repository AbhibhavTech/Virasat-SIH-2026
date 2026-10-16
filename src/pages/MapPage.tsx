import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { MapErrorBoundary } from '../components/map/MapErrorBoundary';
import { getMumbaiDestinationById } from '../data/mumbaiDestinations';

interface MapPageProps {
  onSelectPlace: (id: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  onSelectPlace,
  selectedCity,
  onSelectCity,
}) => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');
  const originParam = searchParams.get('origin');
  const destParam = searchParams.get('destination');
  const queryParam = searchParams.get('q');

  useEffect(() => {
    if (cityParam && cityParam.toLowerCase() !== selectedCity.toLowerCase()) {
      onSelectCity(cityParam);
    }
  }, [cityParam, selectedCity, onSelectCity]);

  const activeCity = cityParam || selectedCity;
  return (
    <main className="h-[calc(100vh-5.5rem)] min-h-[720px] w-full overflow-hidden bg-stone-100">
      <h1 className="sr-only">Interactive heritage map</h1>
      <MapErrorBoundary height="100%">
        <InteractiveMap
          onSelectPlace={onSelectPlace}
          selectedCity={activeCity}
          onSelectCity={onSelectCity}
          initialOrigin={originParam || undefined}
          initialDestination={getMumbaiDestinationById(destParam || '')?.name || destParam || queryParam || undefined}
          height="100%"
        />
      </MapErrorBoundary>
    </main>
  );
};
