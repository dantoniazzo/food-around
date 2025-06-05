import type { Restaurant, RestaurantMakis } from 'entities/restaurant';
import { restaurantIcons } from './restaurants.icons';

import mapboxgl, { Map } from 'mapbox-gl';

export const useRestaurantsMarkers = () => {
  const drawRestaurantMarkers = async (map: Map, restaurants: Restaurant[]) => {
    // Add markers to the map.
    for (const restaurant of restaurants) {
      const maki = restaurant.maki as RestaurantMakis;
      // Create a DOM element for each marker.
      const el = document.createElement('div');
      const width = 30;
      const height = 30;
      el.className = 'marker';
      el.style.backgroundImage = `url(${restaurantIcons[maki]})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        window.alert(restaurant.name);
      });

      // Add markers to the map.
      new mapboxgl.Marker(el)
        .setLngLat(restaurant.coordinates as [number, number])
        .addTo(map);
    }
  };

  return {
    drawRestaurantMarkers,
  };
};
