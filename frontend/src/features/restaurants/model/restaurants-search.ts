import { type Restaurant, RestaurantMakis } from "entities/restaurant";
import { useSearchBoxApi } from "features/search";
import type { Coordinates } from "shared";
import { useRestaurantsMarkers } from "./restaurants-markers";
import { Map } from "mapbox-gl";
import { useViewer } from "entities/viewer";
import { RADIUS } from "widgets/Map";

export interface SearchArgs {
  map: Map;
  coordinates: Coordinates;
  options?: { bbox: [number, number, number, number] };
}

export const useMapboxRestaurantsSearch = () => {
  const searchApi = useSearchBoxApi();
  const { me } = useViewer();
  const { drawRestaurantMarkers } = useRestaurantsMarkers();

  const displayNearbyRestaurants = async (args: SearchArgs) => {
    const restaurants = await findRestaurants(args);
    drawRestaurantMarkers(args.map, restaurants);
  };

  const findRestaurants = async (args: SearchArgs): Promise<Restaurant[]> => {
    const { lat, lng } = args.coordinates;
    const searchResult = await searchApi.category("food_and_drink", {
      bbox: args.options?.bbox,
      proximity: {
        lat,
        lng,
      },
      limit: 25,
    });
    return searchResult.features
      .filter((feature) => {
        const existingFavorite = me?.favorites?.find(
          (favorite) => favorite.id === feature.properties.mapbox_id
        );
        return !existingFavorite;
      })
      .map((feature) => {
        return {
          id: feature.properties.mapbox_id || "",
          name: feature.properties.name,
          coordinates: feature.geometry.coordinates as [number, number],
          maki: feature.properties.maki as RestaurantMakis,
          address: feature.properties.address,
          openHours: feature.properties.metadata?.open_hours?.periods,
          phone: feature.properties.metadata?.phone,
        };
      });
  };

  return {
    displayNearbyRestaurants,
    findRestaurants,
  };
};

export const findGoogleRestaurantsFromCoordinates = (
  location: google.maps.LatLngLiteral,
  callback: (center: google.maps.LatLng, restaurants: Restaurant[]) => void,
  options?: {
    radius?: number;
    bounds?: google.maps.LatLngBounds;
  }
) => {
  const coordinates = { lat: location?.lat, lng: location?.lng };
  const center = new google.maps.LatLng(coordinates.lat, coordinates.lng);
  const { map } = window;
  if (!map) return;
  // If map set from MapLoader, won't have these properties
  // Don't need them for restaurant and table pages
  if (map.setCenter && map.setZoom) {
    map.setCenter(center);
    map.setZoom(15);
  }

  const request: {
    type: "restaurant";
    location?: google.maps.LatLng;
    radius?: number;
    bounds?: google.maps.LatLngBounds;
    fields?: string[];
  } = {
    type: "restaurant",
  };
  if (options?.bounds) {
    const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds(
      options.bounds
    );
    request.bounds = bounds;
  } else {
    request.location = center;
    request.radius = options?.radius || RADIUS;
  }
  request.fields = [
    "rating",
    "formatted_phone_number",
    "website",
    "user_ratings_total",
    "price_level",
  ];

  const searchCallback = (
    results: google.maps.places.PlaceResult[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) => {
    if (
      results &&
      results.length &&
      status == google.maps.places.PlacesServiceStatus.OK
    ) {
      const restaurants: Restaurant[] = results
        .map((result) => {
          const location = result.geometry?.location;
          if (!location || !result.place_id || !result.name || !result.vicinity)
            return;
          return {
            name: result.name,
            maki: RestaurantMakis.RESTAURANT,
            coordinates: [location.lat(), location.lng()] as [number, number],
            address: result.vicinity,
            id: result.place_id,
            rating: result.rating,
            totalRatings: result.user_ratings_total,
            status: result.business_status,
          };
        })
        .filter((restaurant) => !!restaurant);
      callback(center, restaurants);
    }
  };

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, searchCallback);
};
