export enum RestaurantMakis {
  FAST_FOOD = 'fast-food',
  BAKERY = 'bakery',
  RESTAURANT = 'restaurant',
  CAFE = 'cafe',
  BAR = 'bar',
}

export interface DayTime {
  day: number;
  time: string;
}

export interface OpenHours {
  close?: DayTime;
  open: DayTime;
}

export interface RestaurantReview {
  author: string;
  profilePhoto: string;
  rating?: number;
  date: string;
  text: string;
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
  status?: string;
  icon?: string;
  currentlyOpen?: boolean;
  photos?: string[];
  priceLvl?: number;
  rating?: number;
  website?: string;
  reviews?: RestaurantReview[];
  totalRatings?: number;
};
