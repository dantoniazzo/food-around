import { baseApi, TAGS } from 'app/redux';
import type { IUser } from 'entities/user';
import type { ISignInData, ISignUpData } from './auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<IUser, ISignUpData>({
      query: (attributes) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          data: {
            attributes,
            type: 'user',
          },
        },
      }),
      invalidatesTags: [TAGS.AUTH, TAGS.USER],
    }),
    signin: build.mutation<IUser, ISignInData>({
      query: (attributes) => ({
        url: '/auth/login',
        method: 'POST',
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
