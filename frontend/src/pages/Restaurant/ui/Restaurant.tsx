import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const Restaurant = () => {
  const params = useParams();
  useEffect(() => {
    const id = params.id;
    const { map } = window;
    if (!map || !id) return;
    console.log('Id: ', id);
    console.log('Map: ', map);
    const request = {
      placeId: id,
      fields: [
        'name',
        'rating',
        'formatted_phone_number',
        'opening_hours',
        'formatted_address',
        'place_id',
        'geometry',
        'business_status',
        'icon',
        'photo',
        'url',
        'website',
        'reviews',
        'user_ratings_total',
        'price_level',
      ],
    };
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(request, (place, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        place &&
        place.geometry &&
        place.geometry.location
      ) {
        console.log('Place: ', place);
      }
    });
  }, []);
  return (
    <div>
      Restaurant
      <div></div>
    </div>
  );
};
