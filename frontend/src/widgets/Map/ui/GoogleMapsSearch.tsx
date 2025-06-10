import { usePlacesWidget } from "react-google-autocomplete";
import { env } from "app/config";
import { type Restaurant } from "entities/restaurant";
import { findGoogleRestaurantsFromCoordinates } from "features/restaurants";

interface GoogleSearchProps {
  onPlaceSelected: (
    center: google.maps.LatLng,
    restaurants: Restaurant[]
  ) => void;
}

export const GoogleMapsSearch = (props: GoogleSearchProps) => {
  const { ref } = usePlacesWidget({
    apiKey: env.googleMaps.apiKey,
    options: {
      fields: ["geometry"],
    },
    onPlaceSelected: (place) => {
      if (!place) return;
      const { map } = window;
      const location = place.geometry?.location;
      if (!location || !map) return;

      findGoogleRestaurantsFromCoordinates(
        { lat: location.lat(), lng: location.lng() },
        props.onPlaceSelected,
        {
          bounds: place.geometry?.viewport,
        }
      );
    },
  });
  return (
    <div className="absolute flex justify-center top-0 left-0 w-full h-fit pointer-events-none">
      <input
        className="mt-3 bg-white w-1/2 text-black h-10 border-1 border-white rounded-md p-4 outline-none shadow-lg pointer-events-auto"
        ref={ref}
      />
    </div>
  );
};
