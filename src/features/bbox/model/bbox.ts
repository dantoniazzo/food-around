export const drawBbox = (
  map: mapboxgl.Map,
  bbox: [number, number, number, number]
) => {
  // Remove existing layers if they exist
  if (map.getLayer('bbox')) map.removeLayer('bbox');
  if (map.getLayer('points')) map.removeLayer('points');
  if (map.getSource('bbox')) map.removeSource('bbox');
  if (map.getSource('points')) map.removeSource('points');
  if (bbox) {
    // Add bbox layer
    const bboxJson = {
      type: 'Polygon',
      coordinates: [
        [
          [bbox[0], bbox[1]],
          [bbox[0], bbox[3]],
          [bbox[2], bbox[3]],
          [bbox[2], bbox[1]],
          [bbox[0], bbox[1]],
        ],
      ],
    };
    map.addSource('bbox', {
      type: 'geojson',
      data: {
        type: 'Feature',
        /* @ts-expect-error typing issue, it's ok */
        geometry: bboxJson,
      },
    });

    map.addLayer({
      id: 'bbox',
      type: 'fill',
      source: 'bbox',
      layout: {},
      paint: {
        'fill-color': '#009d1d',
        'fill-opacity': 0.1,
      },
    });
  }
};
