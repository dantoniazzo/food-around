import { GoogleMap, MapboxMap } from "widgets";
import {
  ThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Restaurant } from "pages/Restaurant";
import { Login } from "pages/Login";
import { Signup } from "pages/Signup";
import { TableView } from "pages/Table";
import { ProtectedRoute } from "features/auth/ui/ProtectedRoute";
import { Home } from "pages/Home";
import { BasicInfo } from "features/info";
import { APP_ID } from "app/lib";
import { env } from "app/config";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";
import BedtimeIcon from "@mui/icons-material/Bedtime";

function App() {
  const [theme, setTheme] = useState<PaletteMode>("light");
  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });
  return (
    <APIProvider
      apiKey={env.googleMaps.apiKey}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div id={APP_ID} className="h-screen w-screen">
          <div
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            className="absolute top-4 right-4 cursor-pointer"
          >
            <BedtimeIcon color={theme === "dark" ? "primary" : "inherit"} />
          </div>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/mapbox" element={<MapboxMap />} />
              <Route path="/google" element={<GoogleMap />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/table" element={<TableView />} />
              <Route path="/:id" element={<Restaurant />} />
            </Routes>
            <BasicInfo />
          </Router>
        </div>
      </ThemeProvider>
    </APIProvider>
  );
}

export default App;
