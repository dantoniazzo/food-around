import { useRef, useEffect, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import { env } from 'app/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRestaurantsSearch } from 'features/restaurants';
import './styles.css';

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
    const map = mapInstanceRef.current;
    if (!map) return;
    mapInstanceRef.current.on('load', () => {
      setMapLoaded(true);
    });
    mapInstanceRef.current?.on('click', (e) => {
      mapInstanceRef.current?.flyTo({
        center: e.lngLat,
      });
      displayNearbyRestaurants({
        map,
        coordinates: { lat: e.lngLat.lat, lng: e.lngLat.lng },
      });
    });
  }, []);

  return (
    <>
      <div className="absolute top-10 w-full h-full z-1 flex justify-center items-baseline pointer-events-none">
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
        />
      </div>

      <div id="map-container" ref={mapContainerRef} className="w-full h-full" />
    </>
  );
};
