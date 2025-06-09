export enum RestaurantMakis {
  FAST_FOOD = 'fast-food',
  BAKERY = 'bakery',
  RESTAURANT = 'restaurant',
  CAFE = 'cafe',
  BAR = 'bar',
}

export interface DayTime {
  day: number;
  time: 'string';
}

export interface OpenHours {
  close: DayTime;
  open: DayTime;
}

export type Restaurant = {
  id: string | number;
  maki: RestaurantMakis;
  name: string;
  coordinates: [number, number];
  address: string;
  openHours?: OpenHours[];
  phone?: string;
  comment?: string;
};
