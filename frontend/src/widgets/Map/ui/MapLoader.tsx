import { useEffect } from 'react';

export const MAP_LOADER_ID = 'map';
export const MapLoader = () => {
  useEffect(() => {
    if (!window.map) {
      window.map = new google.maps.Map(
        document.getElementById(MAP_LOADER_ID) as HTMLElement
      );
    }
  }, []);
  return <div id={MAP_LOADER_ID}></div>;
};
