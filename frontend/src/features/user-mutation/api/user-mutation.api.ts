import { baseApi } from 'app/redux';
import type { IUser } from 'entities/user';

export const userMutationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateUser: build.mutation<IUser, IUser>({
      query: (attributes) => ({
        url: '/user',
        method: 'PUT',
        body: attributes,
      }),
    }),
    deleteUser: build.mutation({
      query: () => ({
        url: '/user',
        method: 'DELETE',
      }),
    }),
  }),
});
