import { useRef, useEffect, useState, useMemo } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl, { Map as MapType } from 'mapbox-gl';
import { env } from 'app/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  useRestaurantsSearch,
  openEventListener,
  removeEventListener,
  formatOpenHours,
  useRestaurantsMarkers,
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
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

import type { Restaurant } from 'entities/restaurant';
import { userMutationApi } from 'features/user-mutation';
import { useViewer } from 'entities/viewer';
import { getItem, LocalStorageKeys } from 'shared';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapType | undefined>(undefined);
  const { me } = useViewer();
  const [handleUpdateUser] = userMutationApi.endpoints.updateUser.useMutation();
  const { displayNearbyRestaurants } = useRestaurantsSearch();
  const { drawRestaurantMarkers } = useRestaurantsMarkers();
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
      setSelectedRestaurant(restaurant);
    });

    return () => {
      removeEventListener();
    };
  }, []);

  useEffect(() => {
    const favorites = me?.favorites;
    const map = mapInstanceRef.current;
    if (favorites && map) {
      drawRestaurantMarkers(map, favorites, { shouldHighlight: true });
    }
  }, [me]);

  const handleClose = () => {
    setSelectedRestaurant(null);
  };

  const debounceCommentChange = useMemo(
    () =>
      debounce((value: string) => {
        if (!me || !selectedRestaurant) return;
        const favorites = me.favorites;
        const updatedFavorites = favorites?.map((favorite) => {
          if (favorite.id === selectedRestaurant.id) {
            return { ...favorite, comment: value };
          } else return favorite;
        });
        const updatedViewer = {
          name: me.name,
          email: me.email,
          id: getItem(LocalStorageKeys.USER_ID) as string,
          favorites: updatedFavorites,
        };
        handleUpdateUser(updatedViewer);
      }, 300),
    [me, handleUpdateUser, selectedRestaurant]
  );

  const selectedFavorite = me?.favorites?.find(
    (favorite) => favorite.id === selectedRestaurant?.id
  );
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
              const viewer = me;
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
                email: viewer.email,
                id: getItem(LocalStorageKeys.USER_ID) as string,
                favorites: newFavorites,
              };

              handleUpdateUser(updatedViewer);
            }}
          >
            <GradeIcon
              color={selectedFavorite ? 'warning' : 'inherit'}
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
          {selectedFavorite && (
            <div className="mt-4">
              <TextField
                label="Comment"
                type="text"
                fullWidth
                defaultValue={selectedFavorite.comment}
                variant="standard"
                onChange={(e) => debounceCommentChange(e.target.value)}
              />
            </div>
          )}
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
