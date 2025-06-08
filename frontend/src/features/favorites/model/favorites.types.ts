import type { Coordinates } from 'shared';

export interface IFavorite {
  id: string;
  coordinates: Coordinates;
}

export type IFavorites = Array<IFavorite>;
