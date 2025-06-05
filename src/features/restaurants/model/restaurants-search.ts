import { useSearchBoxApi } from 'features/search';

export const useRestaurantsSearch = () => {
  const searchApi = useSearchBoxApi();

  const findRestaurants = async (
    lat: number,
    lng: number,
    options: { bbox: [number, number, number, number] }
  ) => {
    return await searchApi.category('food_and_drink', {
      bbox: options.bbox,
      proximity: {
        lat,
        lng,
      },
      limit: 25,
    });
  };

  return {
    findRestaurants,
  };
};
