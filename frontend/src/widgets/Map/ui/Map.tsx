import { useRef, useEffect, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import { env } from 'app/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  useRestaurantsSearch,
  openEventListener,
  removeEventListener,
  formatOpenHours,
} from 'features/restaurants';
import './styles.css';
import { MAP_CONTAINER_ID } from '../lib';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import type { Restaurant } from 'entities/restaurant';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);

  const { displayNearbyRestaurants } = useRestaurantsSearch();
  const [, setMapLoaded] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
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
    openEventListener((restaurant) => {
      console.log('Restaurant: ', restaurant);
      setSelectedRestaurant(restaurant);
    });

    return () => {
      removeEventListener();
    };
  }, []);

  const handleClose = () => {
    setSelectedRestaurant(null);
  };
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

      <div
        id={MAP_CONTAINER_ID}
        ref={mapContainerRef}
        className="w-full h-full"
      />

      <Dialog onClose={handleClose} open={!!selectedRestaurant}>
        <DialogTitle textAlign={'center'} fontSize={24}>
          {selectedRestaurant?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            textAlign={'center'}
            marginTop={2}
            marginBottom={4}
            fontSize={16}
          >
            {selectedRestaurant?.address}
          </DialogContentText>
          {selectedRestaurant?.phone && (
            <DialogContentText marginY={1} fontSize={14}>
              <b>Phone:</b> {selectedRestaurant?.phone}
            </DialogContentText>
          )}
          {selectedRestaurant?.openHours && (
            <DialogContentText fontWeight={'bold'} marginY={1} fontSize={14}>
              Open hours:
            </DialogContentText>
          )}

          {selectedRestaurant?.openHours?.map((openHours) => {
            return (
              <DialogContentText fontSize={14}>
                {formatOpenHours(openHours)}
              </DialogContentText>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Go to restaurant page
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
