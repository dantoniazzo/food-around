import type { Restaurant, RestaurantMakis } from 'entities/restaurant';
import { getImageUrl } from './restaurants.icons';

import mapboxgl, { Map, Marker } from 'mapbox-gl';

const existingMarkers: Marker[] = [];

export const useRestaurantsMarkers = () => {
  const drawRestaurantMarkers = async (map: Map, restaurants: Restaurant[]) => {
    existingMarkers.forEach((marker) => {
      marker.remove();
    });

    existingMarkers.length = 0;
    // Add markers to the map.
    for (const restaurant of restaurants) {
      const maki = restaurant.maki as RestaurantMakis;
      // Create a DOM element for each marker.
      const el = document.createElement('div');
      const width = 30;
      const height = 30;
      el.className = 'marker';
      el.style.backgroundImage = `url(${getImageUrl(restaurant.name, maki)})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        window.alert(restaurant.name);
      });

      // Add markers to the map.
      const marker = new mapboxgl.Marker(el)
        .setLngLat(restaurant.coordinates as [number, number])
        .addTo(map);
      existingMarkers.push(marker);
    }
  };

  return {
    drawRestaurantMarkers,
  };
};
