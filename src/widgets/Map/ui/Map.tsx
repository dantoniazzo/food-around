import { useRef, useEffect, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import { env } from 'app/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRestaurantsSearch } from 'features/restaurants';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);

  const { displayNearbyRestaurants } = useRestaurantsSearch();
  const [, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    mapboxgl.accessToken = env.mapbox.accessToken;
    if (!mapContainerRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      attributionControl: false,
      container: mapContainerRef.current,
      center: [15.994705, 45.750367],
      zoom: 15,
    });

    mapInstanceRef.current.on('load', () => {
      setMapLoaded(true);
    });
    mapInstanceRef.current?.on('click', (e) => {
      console.log('clicked on map: ', e);
    });
  }, []);

  return (
    <>
      {/* @ts-expect-error mapbox typescript bug */}
      <Geocoder
        accessToken={env.mapbox.accessToken}
        onRetrieve={async (e) => {
          const map = mapInstanceRef.current;
          if (!map) return;
          const { latitude, longitude } = e.properties.coordinates;
          displayNearbyRestaurants({
            map,
            coordinates: { lat: latitude, lng: longitude },
          });
        }}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d) => {
          setInputValue(d);
        }}
        marker
      />
      <div id="map-container" ref={mapContainerRef} className="w-full h-full" />
    </>
  );
};
