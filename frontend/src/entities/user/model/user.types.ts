import type { Restaurant } from 'entities/restaurant';

export interface IUser {
  name: string;
  email: string;
  id: string;
  favorites?: Restaurant[];
}
