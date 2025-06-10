import {
  RestaurantMakis,
  type Restaurant as RestaurantType,
} from "entities/restaurant";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import { formatOpenHours } from "features/restaurants";
import GradeIcon from "@mui/icons-material/Grade";
import { MapLoader } from "widgets";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AdjustIcon from "@mui/icons-material/Adjust";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const Restaurant = () => {
  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const id = params.id;
    const { map } = window;
    if (!id || !map) return;
    const request = {
      placeId: id,
      fields: [
        "name",
        "rating",
        "formatted_phone_number",
        "opening_hours",
        "formatted_address",
        "place_id",
        "geometry",
        "business_status",
        "icon",
        "photo",
        "url",
        "website",
        "reviews",
        "user_ratings_total",
        "price_level",
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
          id: place.place_id?.toString() || "",
          maki: RestaurantMakis.RESTAURANT,
          name: place.name || "",
          coordinates: [
            place.geometry.location.lat(),
            place.geometry.location.lng(),
          ],
          address: place.formatted_address || "",
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
      <div
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 cursor-pointer"
      >
        <ArrowBackIcon />
      </div>

      <MapLoader />
      <Container className="py-10">
        <Card sx={{ width: "100%" }}>
          <CardContent className="flex flex-col gap-4">
            <Typography
              fontSize={32}
              fontWeight={700}
              variant="h1"
              marginBottom={1}
              className="flex items-center justify-between gap-2"
            >
              {restaurant?.name}
              <img className="w-8 h-8 object-contain" src={restaurant?.icon} />
            </Typography>

            <div className="flex items-center gap-2 overflow-auto">
              {restaurant?.photos?.map((img) => {
                return (
                  <img
                    src={img}
                    className="w-100 h-70 object-cover rounded-sm"
                  />
                );
              })}
            </div>
            {restaurant?.address && (
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                <LocationPinIcon /> {restaurant.address}
              </Typography>
            )}
            <div className="flex items-center gap-6">
              {" "}
              {restaurant?.rating && (
                <Typography
                  variant="h6"
                  component="div"
                  className="flex justify-center items-center gap-2"
                >
                  <HotelClassIcon /> {restaurant.rating} / 5
                </Typography>
              )}
              {restaurant?.priceLvl && (
                <Typography
                  variant="h6"
                  className="flex justify-center items-center"
                >
                  <AttachMoneyIcon /> {restaurant.priceLvl} / 4
                </Typography>
              )}
            </div>

            {restaurant?.totalRatings && (
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Total ratings: {restaurant.totalRatings}
              </Typography>
            )}
            {restaurant?.openHours && (
              <div>
                {restaurant.openHours.map((openHours) => {
                  return (
                    <Typography variant="body2">
                      {formatOpenHours(openHours)}
                    </Typography>
                  );
                })}
              </div>
            )}
            {restaurant?.status && (
              <Typography marginTop={3} variant="body2">
                <AdjustIcon /> {restaurant.status}
              </Typography>
            )}
            {restaurant?.phone && (
              <Typography marginTop={3} variant="body2">
                <LocalPhoneIcon /> {restaurant.phone}
              </Typography>
            )}

            {restaurant?.reviews && (
              <Box className="flex flex-col gap-6 mt-8">
                {restaurant.reviews.map((review) => {
                  return (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <img src={review.profilePhoto} className="w-10 h-10" />
                        <Typography>{review.author}</Typography>
                        {review.rating && (
                          <div>
                            {[1, 2, 3, 4, 5].map((i) => {
                              if (review.rating)
                                return (
                                  <GradeIcon
                                    color={
                                      review.rating < i ? "inherit" : "warning"
                                    }
                                    fontSize="large"
                                  />
                                );
                            })}
                          </div>
                        )}

                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {review.date}
                        </Typography>
                      </div>

                      {review.text}
                    </div>
                  );
                })}
              </Box>
            )}
          </CardContent>
          {restaurant?.website && (
            <CardActions>
              <a
                className="text-blue-500"
                target="_blank"
                rel={"noopener noreferrer"}
                href={restaurant.website}
              >
                {" "}
                <Button size="small">Visit website</Button>
              </a>
            </CardActions>
          )}
        </Card>
      </Container>
    </div>
  );
};
