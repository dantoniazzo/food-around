import { useRef, useEffect, useState } from 'react';
import { Geocoder, useSearchBoxCore } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import { env } from 'app/config';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);
  const searchBoxCore = useSearchBoxCore({
    accessToken: env.mapbox.accessToken,
  });
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
  }, []);

  return (
    <>
      {/* @ts-expect-error mapbox typescript bug */}
      <Geocoder
        accessToken={env.mapbox.accessToken}
        onRetrieve={async (e) => {
          const map = mapInstanceRef.current;
          const bbox = e.properties.bbox as [number, number, number, number];
          if (!bbox || !map) return;

          // Remove existing layers if they exist
          if (map.getLayer('bbox')) map.removeLayer('bbox');
          if (map.getLayer('points')) map.removeLayer('points');
          if (map.getSource('bbox')) map.removeSource('bbox');
          if (map.getSource('points')) map.removeSource('points');

          // Add bbox layer
          const bboxJson = {
            type: 'Polygon',
            coordinates: [
              [
                [bbox[0], bbox[1]],
                [bbox[0], bbox[3]],
                [bbox[2], bbox[3]],
                [bbox[2], bbox[1]],
                [bbox[0], bbox[1]],
              ],
            ],
          };
          map.addSource('bbox', {
            type: 'geojson',
            data: {
              type: 'Feature',
              /* @ts-expect-error typing issue, it's ok */
              geometry: bboxJson,
            },
          });

          map.addLayer({
            id: 'bbox',
            type: 'fill',
            source: 'bbox',
            layout: {},
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.25,
            },
          });

          // Fetch restaurants
          const restaurants = await searchBoxCore.category('food_and_drink', {
            bbox,
            limit: 25,
          });

          enum Icons {
            FAST_FOOD = 'fast-food',
            BAKERY = 'bakery',
            RESTAURANT = 'restaurant',
            CAFE = 'cafe',
            BAR = 'bar',
          }

          const icons = {
            [Icons.FAST_FOOD]: '/fast-food.png',
            [Icons.BAKERY]: '/bakery.png',
            [Icons.RESTAURANT]: '/restaurant.png',
            [Icons.CAFE]: '/coffee.png',
            [Icons.BAR]: '/bar.png',
          };

          // Add markers to the map.
          for (const feature of restaurants.features) {
            const maki = feature.properties.maki as Icons;
            // Create a DOM element for each marker.
            const el = document.createElement('div');
            const width = 30;
            const height = 30;
            el.className = 'marker';
            el.style.backgroundImage = `url(${icons[maki]})`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = '100%';

            el.addEventListener('click', () => {
              window.alert(feature.properties.name);
            });

            // Add markers to the map.
            new mapboxgl.Marker(el)
              .setLngLat(feature.geometry.coordinates as [number, number])
              .addTo(map);
          }
          /* map.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: restaurants.features,
            },
          });

          map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': ['get', 'maki'], // Use the maki property from each feature
              'icon-size': 1.5, // Adjust icon size as needed
              'icon-allow-overlap': true, // Allow icons to overlap
            },
            paint: {
              // Optional: Add conditional coloring based on 'within' expression
              'icon-color': [
                'case',
                ['within', bboxJson],
                '#f55442', // Color for points within bbox
                '#484848', // Fallback color
              ],
            },
          }); */
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
