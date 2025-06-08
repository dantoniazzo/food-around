import type { Restaurant, RestaurantMakis } from 'entities/restaurant';
import { useSearchBoxApi } from 'features/search';
import type { Coordinates } from 'shared';
import { useRestaurantsMarkers } from './restaurants-markers';
import { Map } from 'mapbox-gl';

export interface SearchArgs {
  map: Map;
  coordinates: Coordinates;
  options?: { bbox: [number, number, number, number] };
}

export const useRestaurantsSearch = () => {
  const searchApi = useSearchBoxApi();
  const { drawRestaurantMarkers } = useRestaurantsMarkers();

  const displayNearbyRestaurants = async (args: SearchArgs) => {
    const restaurants = await findRestaurants(args);
    drawRestaurantMarkers(args.map, restaurants);
  };

  const findRestaurants = async (args: SearchArgs): Promise<Restaurant[]> => {
    const { lat, lng } = args.coordinates;
    const searchResult = await searchApi.category('food_and_drink', {
      bbox: args.options?.bbox,
      proximity: {
        lat,
        lng,
      },
      limit: 25,
    });
    console.log('searchResult: ', searchResult);
    return searchResult.features.map((feature) => {
      return {
        id: feature.properties.mapbox_id || '',
        name: feature.properties.name,
        coordinates: feature.geometry.coordinates as [number, number],
        maki: feature.properties.maki as RestaurantMakis,
      };
    });
  };

  return {
    displayNearbyRestaurants,
    findRestaurants,
  };
};
