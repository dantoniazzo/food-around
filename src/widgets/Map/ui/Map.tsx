import { useRef, useEffect, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import { env } from 'app/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { restaurantIcons, useRestaurantsSearch } from 'features/restaurants';
import { drawBbox } from 'features/bbox';
import type { RestaurantMakis } from 'entities/restaurant';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);

  const { findRestaurants } = useRestaurantsSearch();
  const [, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    mapboxgl.accessToken = env.mapbox.accessToken;
    if (!mapContainerRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
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
          const bbox = e.properties.bbox as [number, number, number, number];
          if (!map) return;

          drawBbox(map, bbox);
          const { latitude, longitude } = e.properties.coordinates;
          // Fetch restaurants
          const restaurants = await findRestaurants(latitude, longitude, {
            bbox,
          });

          // Add markers to the map.
          for (const feature of restaurants.features) {
            const maki = feature.properties.maki as RestaurantMakis;
            // Create a DOM element for each marker.
            const el = document.createElement('div');
            const width = 30;
            const height = 30;
            el.className = 'marker';
            el.style.backgroundImage = `url(${restaurantIcons[maki]})`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = '100%';
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
              window.alert(feature.properties.name);
            });

            // Add markers to the map.
            new mapboxgl.Marker(el)
              .setLngLat(feature.geometry.coordinates as [number, number])
              .addTo(map);
          }
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
