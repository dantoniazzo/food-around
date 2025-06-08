import type { Restaurant, RestaurantMakis } from 'entities/restaurant';
import { useSearchBoxApi } from 'features/search';
import type { Coordinates } from 'shared';
import { useRestaurantsMarkers } from './restaurants-markers';
import { Map } from 'mapbox-gl';
import { useViewer } from 'entities/viewer';

export interface SearchArgs {
  map: Map;
  coordinates: Coordinates;
  options?: { bbox: [number, number, number, number] };
}

export const useRestaurantsSearch = () => {
  const searchApi = useSearchBoxApi();
  const { me } = useViewer();
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
    return searchResult.features
      .filter((feature) => {
        const existingFavorite = me?.favorites?.find(
          (favorite) => favorite.id === feature.properties.mapbox_id
        );
        return !existingFavorite;
      })
      .map((feature) => {
        return {
          id: feature.properties.mapbox_id || '',
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
