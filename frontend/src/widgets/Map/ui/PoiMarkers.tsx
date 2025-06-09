import { useCallback, useEffect, useRef, useState } from 'react';
import { Pin, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Restaurant } from 'entities/restaurant';
import { openEvent } from 'features/restaurants';

export const PoiMarkers = (props: { pois: Restaurant[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, poi: Restaurant) => {
      if (!map) return;
      if (!ev.latLng) return;
      map.panTo(ev.latLng);
      openEvent(poi);
    },
    [map]
  );
  return (
    <>
      {props.pois.map((poi: Restaurant) => (
        <AdvancedMarker
          key={poi.id}
          position={{ lat: poi.coordinates[0], lng: poi.coordinates[1] }}
          ref={(marker) => setMarkerRef(marker, poi.id as string)}
          onClick={(e) => handleClick(e, poi)}
        >
          <Pin
            background={'#FBBC04'}
            glyphColor={'#000'}
            borderColor={'#000'}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};
