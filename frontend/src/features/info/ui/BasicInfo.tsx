import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TextField from "@mui/material/TextField";
import {
  formatOpenHours,
  openEventListener,
  removeEventListener,
} from "features/restaurants";
import { useEffect, useMemo, useState } from "react";
import type { Restaurant } from "entities/restaurant";
import { debounce } from "lodash";
import { useViewer } from "entities/viewer";
import { getItem, LocalStorageKeys } from "shared";
import { userMutationApi } from "features/user-mutation";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export const BasicInfo = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  console.log("Selected Restaurant:", selectedRestaurant);
  const { me } = useViewer();
  const navigate = useNavigate();
  const [handleUpdateUser] = userMutationApi.endpoints.updateUser.useMutation();

  const handleClose = () => {
    setSelectedRestaurant(null);
  };

  useEffect(() => {
    openEventListener((restaurant) => {
      setSelectedRestaurant(restaurant);
    });

    return () => {
      removeEventListener();
    };
  }, []);

  const debounceCommentChange = useMemo(
    () =>
      debounce((value: string) => {
        if (!me || !selectedRestaurant) return;
        const favorites = me.favorites;
        const updatedFavorites = favorites?.map((favorite) => {
          if (favorite.id === selectedRestaurant.id) {
            return { ...favorite, comment: value };
          } else return favorite;
        });
        const updatedViewer = {
          name: me.name,
          email: me.email,
          id: getItem(LocalStorageKeys.USER_ID) as string,
          favorites: updatedFavorites,
        };
        handleUpdateUser(updatedViewer);
      }, 300),
    [me, handleUpdateUser, selectedRestaurant]
  );

  const selectedFavorite = me?.favorites?.find(
    (favorite) => favorite.id === selectedRestaurant?.id
  );

  return (
    <Dialog onClose={handleClose} open={!!selectedRestaurant}>
      <DialogTitle fontSize={24}>
        {selectedRestaurant?.name}
        <div
          className="absolute top-6 right-5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            const viewer = me;

            if (!viewer || !selectedRestaurant) return;
            const favorites = viewer.favorites;
            let newFavorites = [];
            if (!favorites) {
              newFavorites.push(selectedRestaurant);
            } else {
              const existingRestaurant = favorites.find(
                (favorite) => favorite.id === selectedRestaurant.id
              );
              if (existingRestaurant) {
                newFavorites = favorites.filter(
                  (favorite) => favorite.id !== selectedRestaurant.id
                );
              } else {
                newFavorites = [...favorites, selectedRestaurant];
              }
            }
            const updatedViewer = {
              name: viewer.name,
              email: viewer.email,
              id: getItem(LocalStorageKeys.USER_ID) as string,
              favorites: newFavorites,
            };

            handleUpdateUser(updatedViewer);
          }}
        >
          {!selectedFavorite && (
            <FavoriteBorderIcon fontSize="large" color="inherit" />
          )}
          {selectedFavorite && <FavoriteIcon fontSize="large" color="error" />}
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText marginTop={1} marginBottom={2} fontSize={16}>
          {selectedRestaurant?.address}
        </DialogContentText>
        {selectedRestaurant?.rating && (
          <DialogContentText
            className="flex items-center gap-2"
            variant="h6"
            fontSize={16}
          >
            <HotelClassIcon /> {selectedRestaurant?.rating} / 5{" "}
            {selectedRestaurant.totalRatings
              ? `(${selectedRestaurant.totalRatings} ratings)`
              : ""}
          </DialogContentText>
        )}
        {selectedRestaurant?.priceLvl && (
          <DialogContentText
            className="flex items-center gap-2"
            variant="h6"
            fontSize={16}
          >
            <AttachMoneyIcon /> {selectedRestaurant?.priceLvl} / 4
          </DialogContentText>
        )}

        {selectedRestaurant?.openHours?.map((openHours) => {
          return (
            <DialogContentText
              width={"fit-content"}
              paddingTop={"4px"}
              fontSize={14}
            >
              {formatOpenHours(openHours)}
            </DialogContentText>
          );
        })}
        {selectedFavorite && (
          <div className="mt-4">
            <TextField
              label="Comment"
              type="text"
              fullWidth
              defaultValue={selectedFavorite.comment}
              variant="standard"
              onChange={(e) => debounceCommentChange(e.target.value)}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={() => {
            handleClose();
            navigate(`/${selectedRestaurant?.id}`);
          }}
        >
          More details
        </Button>
      </DialogActions>
    </Dialog>
  );
};
