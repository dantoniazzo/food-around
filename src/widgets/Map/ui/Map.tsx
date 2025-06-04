import { useRef, useEffect, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const accessToken =
  'pk.eyJ1IjoiZG9hbnRvbmkiLCJhIjoiY2txczU1dTA0MTdsbzJucWF5ejVvemFrayJ9.cOgJkwB5_agmOIinEoruDA';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);
  const [, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    mapboxgl.accessToken = accessToken;
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
        accessToken={accessToken}
        onRetrieve={(e) => {
          const map = mapInstanceRef.current;
          const bbox = e.properties.bbox as number[];
          if (!bbox || !map) return;
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
          console.log('Retrieved: ', e);
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
