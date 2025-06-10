import { MapLoader, GoogleMapsSearch } from "widgets";
import type { Restaurant } from "entities/restaurant";
import { useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 300 },
  { field: "address", headerName: "Address", width: 300 },
  { field: "rating", headerName: "Rating", width: 100 },
  { field: "totalRatings", headerName: "Total ratings", width: 100 },
  { field: "status", headerName: "Status", width: 200 },
];

const paginationModel = { page: 0, pageSize: 20 };

export const TableView = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[] | undefined>(
    undefined
  );
  const navigate = useNavigate();

  return (
    <div className="w-full h-full">
      <div
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 cursor-pointer"
      >
        <ArrowBackIcon />
      </div>
      <MapLoader />
      <GoogleMapsSearch
        onPlaceSelected={(_, restaurants) => {
          setRestaurants(restaurants);
        }}
      />
      <div className="mt-20">
        <Paper sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={restaurants}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </div>
  );
};
