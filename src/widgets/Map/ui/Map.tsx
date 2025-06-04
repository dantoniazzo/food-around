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
      container: mapContainerRef.current, // container ID
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
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
          console.log('Retrieved: ', e);

          const map = mapInstanceRef.current;
          const bbox = e.properties.bbox as [number, number, number, number];
          if (!bbox || !map) return;
          map.removeLayer('bbox');
          map.removeLayer('points');
          const bboxJson = {
            type: 'Polygon',
            coordinates: [
              [
                [bbox[0], bbox[1]],
                [bbox[0], bbox[3]],
                [bbox[2], bbox[3]],
                [bbox[2], bbox[1]],
                [bbox[0], bbox[1]],
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
          const restaurants = await searchBoxCore.category('food_and_drink', {
            bbox,
            limit: 25,
            /*  proximity: e.geometry.coordinates as [number, number], */
          });
          console.log('Restaurants: ', restaurants);

          map.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: restaurants.features,
            },
          });

          // Apply 'within' expression to points
          // Routes within Colorado have 'circle-color': '#f55442'
          // Fallback values (routes not within Colorado) have 'circle-color': '#484848'
          map.addLayer({
            id: 'points',
            type: 'circle',
            source: 'points',
            layout: {},
            paint: {
              'circle-color': [
                'case',
                ['within', bboxJson],
                '#f55442',
                '#484848',
              ],
              'circle-radius': 10,
            },
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
