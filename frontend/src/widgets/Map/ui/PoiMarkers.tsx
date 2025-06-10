import { useCallback, useEffect, useRef } from "react";
import { Pin, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Restaurant } from "entities/restaurant";
import { openEvent } from "features/restaurants";

export const PoiMarkers = (props: { pois: Restaurant[]; color?: string }) => {
  const map = useMap();
  const markers = useRef<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    const currentMarkers = markers.current;
    if (marker && currentMarkers[key]) return;
    if (!marker && !currentMarkers[key]) return;
    if (marker) {
      markers.current = { ...currentMarkers, [key]: marker };
    } else {
      const newMarkers = { ...currentMarkers };
      delete newMarkers[key];
      markers.current = newMarkers;
    }
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers.current));
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
            background={props.color ?? "#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};
