import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { env } from 'app/config';
import { GOOGLE_MAP_ID } from '../lib';
import { PoiMarkers } from './PoiMarkers';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';
import { GoogleMapsSearch } from './GoogleMapsSearch';
import type { Restaurant } from 'entities/restaurant';
import { useState } from 'react';

export const GoogleMap = () => {
  const [locations, setLocations] = useState<Restaurant[] | null>(null);

  return (
    <div className="w-full h-full">
      {' '}
      <APIProvider
        apiKey={env.googleMaps.apiKey}
        onLoad={() => console.log('Maps API has loaded.')}
      >
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          mapId={GOOGLE_MAP_ID}
          onClick={(e) => {
            console.log('Map click event: ', e);
          }}
        >
          {locations && <PoiMarkers pois={locations} />}
          <GoogleMapsSearch onPlaceSelected={setLocations} />
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
