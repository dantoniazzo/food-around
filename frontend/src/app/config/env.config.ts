export const env = {
  api: {
    http: import.meta.env.VITE_API_URL,
  },
  mapbox: {
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
  },
  googleMaps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  },
};
