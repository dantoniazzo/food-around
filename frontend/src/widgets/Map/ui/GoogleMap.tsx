import { Map, useMap } from "@vis.gl/react-google-maps";
import { GOOGLE_MAP_ID, RADIUS } from "../lib";
import { PoiMarkers } from "./PoiMarkers";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import MapIcon from "@mui/icons-material/Map";
import { GoogleMapsSearch } from "./GoogleMapsSearch";
import type { Restaurant } from "entities/restaurant";
import { Circle } from "./Circle";
import { useEffect, useState } from "react";
import { findGoogleRestaurantsFromCoordinates } from "features/restaurants";
import { useViewer } from "entities/viewer";

export const GoogleMap = () => {
  const [center, setCenter] = useState<google.maps.LatLng | null>(null);
  const [locations, setLocations] = useState<Restaurant[] | null>(null);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const map = useMap();
  const { me } = useViewer();

  useEffect(() => {
    window.map = map;
  }, [map]);

  const mainCallback = (
    center: google.maps.LatLng,
    restaurants: Restaurant[]
  ) => {
    const filteredFavorites = restaurants.filter((restaurant) => {
      const existingFavorite = me?.favorites?.find(
        (favorite) => favorite.id === restaurant.id
      );
      return !existingFavorite;
    });
    setCenter(center);
    setLocations(filteredFavorites);
  };

  useEffect(() => {
    const favorites = me?.favorites;
    if (favorites) {
      setFavorites(favorites);
    }
  }, [me]);

  return (
    <div className="w-full h-full">
      {" "}
      <Map
        defaultZoom={16}
        defaultCenter={{ lat: 45.750367, lng: 15.994705 }}
        mapId={GOOGLE_MAP_ID}
        onClick={(e) => {
          const latLng = e.detail.latLng;
          if (!latLng) return;
          findGoogleRestaurantsFromCoordinates(latLng, mainCallback);
        }}
      >
        {favorites && (
          <PoiMarkers pois={favorites} color={"var(--color-green-100)"} />
        )}
        {locations && <PoiMarkers pois={locations} />}
        <Circle
          radius={RADIUS}
          center={center}
          strokeColor={"#0c4cb3"}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={"#3b82f6"}
          fillOpacity={0.3}
        />
      </Map>
      <div className="absolute bottom-5 left-5 flex items-center gap-2">
        {" "}
        <Link to={"/mapbox"}>
          <Button variant="contained" color="primary">
            <MapIcon />
            &nbsp; Switch to Mapbox
          </Button>
        </Link>
        <Link to={"/table"}>
          <Button variant="outlined" color="warning">
            Switch to Table
          </Button>
        </Link>
      </div>
      <GoogleMapsSearch onPlaceSelected={mainCallback} />
    </div>
  );
};
