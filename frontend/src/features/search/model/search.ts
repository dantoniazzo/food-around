import { useSearchBoxCore } from '@mapbox/search-js-react';
import { env } from 'app/config';

export const useSearchBoxApi = () => {
  return useSearchBoxCore({
    accessToken: env.mapbox.accessToken,
  });
};
