import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { type IErrorResponse } from './redux.types';
import { env } from 'app/config';
import { TAGS } from './tags';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: <BaseQueryFn<string | FetchArgs, unknown, IErrorResponse, object>>(
    fetchBaseQuery({
      baseUrl: `${env.api.http}/api`,
      credentials: 'include',
    })
  ),
  tagTypes: [TAGS.FAVORITES, TAGS.AUTH, TAGS.USER],
  endpoints: () => ({}),
});
