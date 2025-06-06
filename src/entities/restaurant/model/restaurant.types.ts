export enum RestaurantMakis {
  FAST_FOOD = 'fast-food',
  BAKERY = 'bakery',
  RESTAURANT = 'restaurant',
  CAFE = 'cafe',
  BAR = 'bar',
}

export type Restaurant = {
  id: string | number;
  maki: RestaurantMakis;
  name: string;
  coordinates: [number, number];
};
