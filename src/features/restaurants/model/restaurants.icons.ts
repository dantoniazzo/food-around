import { RestaurantMakis } from 'entities/restaurant';

export const restaurantIcons = {
  [RestaurantMakis.FAST_FOOD]: '/fast-food.png',
  [RestaurantMakis.BAKERY]: '/bakery.png',
  [RestaurantMakis.RESTAURANT]: '/restaurant.png',
  [RestaurantMakis.CAFE]: '/coffee.png',
  [RestaurantMakis.BAR]: '/bar.png',
};

export const SPECIAL_CONDITIONS = ['pekarnica', 'pekarna', 'pekara'];

export const checkForBakeries = (name: string): boolean => {
  for (const condition of SPECIAL_CONDITIONS) {
    if (name.toLowerCase().includes(condition)) {
      return true;
    }
  }
  return false;
};

export const getImageUrl = (name: string, maki: RestaurantMakis): string => {
  if (checkForBakeries(name)) {
    return restaurantIcons[RestaurantMakis.BAKERY];
  }
  return restaurantIcons[maki] || restaurantIcons[RestaurantMakis.RESTAURANT];
};
