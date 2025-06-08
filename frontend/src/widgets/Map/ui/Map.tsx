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
import GradeIcon from '@mui/icons-material/Grade';

import type { Restaurant } from 'entities/restaurant';
import { userMutationApi } from 'features/user-mutation';
import { useViewer } from 'entities/viewer';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);
  const { getMe } = useViewer();
  const [handleUpdateUser] = userMutationApi.endpoints.updateUser.useMutation();
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
          <div
            className="absolute top-6 right-5 cursor-pointer"
            onClick={() => {
              const viewer = getMe();
              if (!viewer || !selectedRestaurant) return;
              const favorites = viewer.favorites;
              let newFavorites = [];
              if (!favorites) {
                newFavorites.push(selectedRestaurant);
              } else {
                const existingRestaurant = favorites.find(
                  (favorite) => favorite.id === selectedRestaurant.id
                );
                if (existingRestaurant) {
                  newFavorites = favorites.filter(
                    (favorite) => favorite.id !== selectedRestaurant.id
                  );
                } else {
                  newFavorites = [...favorites, selectedRestaurant];
                }
              }
              const updatedViewer = {
                name: viewer.name,
                id: viewer.id,
                email: viewer.email,
                favorites: newFavorites,
              };

              handleUpdateUser(updatedViewer);
            }}
          >
            <GradeIcon
              color={
                getMe()?.favorites?.find(
                  (favorite) => favorite.id === selectedRestaurant?.id
                )
                  ? 'warning'
                  : 'inherit'
              }
              fontSize="large"
            />
          </div>
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
              <DialogContentText
                width={'fit-content'}
                paddingTop={'4px'}
                borderBottom={'1px solid rgba(186, 186, 186, 0.555)'}
                fontSize={14}
              >
                {formatOpenHours(openHours)}
              </DialogContentText>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            More details
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
