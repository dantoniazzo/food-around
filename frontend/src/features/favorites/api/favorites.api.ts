import { baseApi, TAGS } from 'app/redux';
import type { IFavorite, IFavorites } from '../model/favorites.types';

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFavorites: build.query<IFavorites, undefined>({
      query: () => ({
        url: '/favorites',
      }),
      providesTags: [TAGS.FAVORITES],
    }),
    addFavorite: build.mutation<IFavorites, IFavorite>({
      query: (attributes) => ({
        url: '/favorites',
        method: 'POST',
        body: {
          data: {
            attributes,
            type: 'user',
          },
        },
      }),
    }),
    removeFavorite: build.mutation<IFavorites, IFavorite>({
      query: (attributes) => ({
        url: '/favorites',
        method: 'DELETE',
        body: {
          data: {
            attributes,
            type: 'user',
          },
        },
      }),
    }),
  }),
});
