import { GoogleMap, MapboxMap } from 'widgets';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Restaurant } from 'pages/Restaurant';
import { Login } from 'pages/Login';
import { Signup } from 'pages/Signup';
import { ProtectedRoute } from 'features/auth/ui/ProtectedRoute';
import { Home } from 'pages/Home';
import { BasicInfo } from 'features/info';
import { APP_ID } from 'app/lib';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div id={APP_ID} className="h-screen w-screen">
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
            <Route path="/:id" element={<Restaurant />} />
          </Routes>
        </Router>
        <BasicInfo />
      </div>
    </ThemeProvider>
  );
}

export default App;
