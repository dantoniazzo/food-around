import { usePlacesWidget } from 'react-google-autocomplete';
import { env } from 'app/config';
import { useMap } from '@vis.gl/react-google-maps';
import { RestaurantMakis, type Restaurant } from 'entities/restaurant';

interface GoogleSearchProps {
  onPlaceSelected: (restaurants: Restaurant[]) => void;
}

export const GoogleMapsSearch = (props: GoogleSearchProps) => {
  const map = useMap();
  const { ref } = usePlacesWidget({
    apiKey: env.googleMaps.apiKey,
    onPlaceSelected: (place) => {
      const location = place.geometry?.location;
      if (!location || !map) return;
      const coordinates = { lat: location?.lat(), lng: location?.lng() };
      const center = new google.maps.LatLng(coordinates.lat, coordinates.lng);
      map.setCenter(center);
      map.setZoom(15);
      const request = {
        location: center,
        radius: 2000,
        type: 'restaurant',
      };

      const callback = (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (
          results &&
          results.length &&
          status == google.maps.places.PlacesServiceStatus.OK
        ) {
          console.log('Results: ', results);
          const restaurants: Restaurant[] = results
            .map((result) => {
              const location = result.geometry?.location;
              if (
                !location ||
                !result.place_id ||
                !result.name ||
                !result.vicinity
              )
                return;
              return {
                name: result.name,
                maki: RestaurantMakis.RESTAURANT,
                coordinates: [location.lat(), location.lng()] as [
                  number,
                  number
                ],
                address: result.vicinity,
                id: result.place_id,
              };
            })
            .filter((restaurant) => !!restaurant);
          props.onPlaceSelected(restaurants);
        }
      };

      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
    },
  });
  return (
    <div className="absolute flex justify-center top-0 left-0 w-full h-fit">
      <input
        className="mt-3 bg-white w-1/2 text-black h-10 border-1 border-white rounded-md p-4 outline-none shadow-lg"
        ref={ref}
      />
    </div>
  );
};
