import { useRef, useEffect, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import { env } from 'app/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  useMapboxRestaurantsSearch,
  useRestaurantsMarkers,
} from 'features/restaurants';
import './styles.css';
import Button from '@mui/material/Button';
import { useViewer } from 'entities/viewer';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';

export const MapboxMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);
  const { me } = useViewer();
  const { displayNearbyRestaurants } = useMapboxRestaurantsSearch();
  const { drawRestaurantMarkers } = useRestaurantsMarkers();
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

  useEffect(() => {
    const favorites = me?.favorites;
    const map = mapInstanceRef.current;
    if (favorites && map) {
      drawRestaurantMarkers(map, favorites, { shouldHighlight: true });
    }
  }, [me]);

  return (
    <>
      <div className="absolute w-full h-full z-1 flex justify-center items-baseline pointer-events-none">
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

      <div ref={mapContainerRef} className="w-full h-full" />

      <div className="absolute bottom-5 right-5">
        {' '}
        <Link to={'/google'}>
          <Button variant="contained" color="secondary">
            <GoogleIcon />
            &nbsp; Switch to Google Maps
          </Button>
        </Link>
      </div>
    </>
  );
};
