import { baseApi, TAGS } from 'app/redux';
import type { IUser } from 'entities/user';
import type { ISignInData, ISignUpData } from './auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<IUser, undefined>({
      query: () => ({
        url: '/user/me',
      }),
      providesTags: [TAGS.USER],
    }),
    signup: build.mutation<IUser, ISignUpData>({
      query: (attributes) => ({
        url: '/auth/register',
        method: 'POST',
        body: attributes,
      }),
      invalidatesTags: [TAGS.USER],
    }),
    signin: build.mutation<IUser, ISignInData>({
      query: (attributes) => ({
        url: '/auth/login',
        method: 'POST',
        body: attributes,
      }),
      invalidatesTags: [TAGS.USER],
    }),
  }),
});

export const { useMeQuery } = authApi;
