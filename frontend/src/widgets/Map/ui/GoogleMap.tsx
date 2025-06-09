import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { env } from 'app/config';
import { GOOGLE_MAP_ID, RADIUS } from '../lib';
import { PoiMarkers } from './PoiMarkers';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';
import { GoogleMapsSearch } from './GoogleMapsSearch';
import type { Restaurant } from 'entities/restaurant';
import { Circle } from './Circle';
import { useState } from 'react';

export const GoogleMap = () => {
  const [center, setCenter] = useState<google.maps.LatLng | null>(null);
  const [locations, setLocations] = useState<Restaurant[] | null>(null);

  return (
    <div className="w-full h-full">
      {' '}
      <APIProvider
        apiKey={env.googleMaps.apiKey}
        onLoad={() => console.log('Maps API has loaded.')}
      >
        <Map
          defaultZoom={16}
          defaultCenter={{ lat: 45.750367, lng: 15.994705 }}
          mapId={GOOGLE_MAP_ID}
          onClick={(e) => {
            console.log('Map click event: ', e);
          }}
        >
          {locations && <PoiMarkers pois={locations} />}
          <Circle
            radius={RADIUS}
            center={center}
            strokeColor={'#0c4cb3'}
            strokeOpacity={1}
            strokeWeight={3}
            fillColor={'#3b82f6'}
            fillOpacity={0.3}
          />
          <GoogleMapsSearch
            onPlaceSelected={(center, restaurants) => {
              setCenter(center);
              setLocations(restaurants);
            }}
          />
        </Map>
        <div className="absolute bottom-5 left-5">
          {' '}
          <Link to={'/mapbox'}>
            <Button variant="contained" color="primary">
              <MapIcon />
              &nbsp; Switch to Mapbox
            </Button>
          </Link>
        </div>
      </APIProvider>{' '}
    </div>
  );
};
