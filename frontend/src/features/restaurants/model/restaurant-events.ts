import type { Restaurant } from 'entities/restaurant';
import { getAppElement } from 'app/lib';

export const EVENT_NAME = 'open-restaurant-info';

const eventListeners = new WeakMap<HTMLElement, EventListener>();

export const openEventListener = (callback: (detail: Restaurant) => void) => {
  const mapContainer = getAppElement();
  if (!mapContainer) return;
  const fn = ((event: CustomEvent<Restaurant>) => {
    if (event.detail) {
      callback(event.detail);
    }
  }) as EventListener;
  eventListeners.set(mapContainer, fn);
  mapContainer.addEventListener(EVENT_NAME, fn);
};

export const removeEventListener = () => {
  const mapContainer = getAppElement();
  if (!mapContainer) return;
  const fn = eventListeners.get(mapContainer);
  if (fn) {
    mapContainer.removeEventListener(EVENT_NAME, fn);
    eventListeners.delete(mapContainer);
  }
};

export const openEvent = (restaurant: Restaurant) => {
  const mapContainer = getAppElement();
  if (!mapContainer) return;
  mapContainer.dispatchEvent(
    new CustomEvent(EVENT_NAME, { detail: restaurant })
  );
};
