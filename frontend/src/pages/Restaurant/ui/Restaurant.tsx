import {
  RestaurantMakis,
  type Restaurant as RestaurantType,
} from 'entities/restaurant';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import { formatOpenHours } from 'features/restaurants';
import GradeIcon from '@mui/icons-material/Grade';
import { MapLoader } from 'widgets';

export const Restaurant = () => {
  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
  const params = useParams();
  useEffect(() => {
    const id = params.id;
    const { map } = window;
    console.log('Map: ', map);
    if (!id || !map) return;
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
        setRestaurant({
          id: place.place_id?.toString() || '',
          maki: RestaurantMakis.RESTAURANT,
          name: place.name || '',
          coordinates: [
            place.geometry.location.lat(),
            place.geometry.location.lng(),
          ],
          address: place.formatted_address || '',
          openHours: place.opening_hours?.periods,
          phone: place.formatted_phone_number,
          status: place.business_status,
          icon: place.icon,
          currentlyOpen: place.opening_hours?.open_now,
          photos: place.photos?.map((photo) => photo.getUrl()),
          priceLvl: place.price_level,
          rating: place.rating,
          website: place.website,
          reviews: place.reviews?.map((review) => {
            return {
              author: review.author_name,
              profilePhoto: review.profile_photo_url,
              rating: review.rating,
              date: review.relative_time_description,
              text: review.text,
            };
          }),
          totalRatings: place.user_ratings_total,
        });
      }
    });
  }, [params.id]);
  return (
    <div className="w-full h-full">
      <MapLoader />
      <Container className="py-10 flex flex-col gap-12">
        <h1 className="text-white text-4xl flex items-center gap-4 font-bold">
          <img className="w-15 h-15 object-contain" src={restaurant?.icon} />
          {restaurant?.name}
        </h1>
        <div className="flex items-center gap-2 overflow-auto">
          {restaurant?.photos?.map((img) => {
            return <img src={img} className="w-100 h-70 object-contain" />;
          })}
        </div>
        {restaurant?.address && <h2>{restaurant.address}</h2>}
        {restaurant?.status && <h3>{restaurant.status}</h3>}
        {restaurant?.currentlyOpen === true ? (
          <h3>Open</h3>
        ) : restaurant?.currentlyOpen === false ? (
          <h3>Closed</h3>
        ) : null}
        {restaurant?.openHours && (
          <div>
            {restaurant.openHours.map((openHours) => {
              return <h4 className="">{formatOpenHours(openHours)}</h4>;
            })}
          </div>
        )}
        {restaurant?.phone && <h5>{restaurant.phone}</h5>}
        {restaurant?.priceLvl && <h5>Price level: {restaurant.priceLvl}</h5>}
        {restaurant?.rating && <h5>Rating: {restaurant.rating} / 5</h5>}
        {restaurant?.totalRatings && (
          <h5>Total ratings: {restaurant.totalRatings}</h5>
        )}
        {restaurant?.reviews && (
          <div className="flex flex-col gap-4">
            {restaurant.reviews.map((review) => {
              return (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <img src={review.profilePhoto} className="w-10 h-10" />
                    <span>{review.author}</span>
                    {review.rating && (
                      <span>
                        {[1, 2, 3, 4, 5].map((i) => {
                          if (review.rating)
                            return (
                              <GradeIcon
                                color={
                                  review.rating < i ? 'inherit' : 'warning'
                                }
                                fontSize="large"
                              />
                            );
                        })}
                      </span>
                    )}

                    <span>{review.date}</span>
                  </div>

                  {review.text}
                </div>
              );
            })}
          </div>
        )}
        {restaurant?.website && (
          <h5>
            Website:{' '}
            <a
              className="text-blue-500"
              target="_blank"
              rel={'noopener noreferrer'}
              href={restaurant.website}
            >
              {restaurant.website}
            </a>
          </h5>
        )}
      </Container>
    </div>
  );
};
