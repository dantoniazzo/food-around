import { Map } from 'widgets';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Restaurant } from 'pages/Restaurant';
import { Login } from 'pages/Login';
import { Signup } from 'pages/Signup';
import { ProtectedRoute } from 'features/auth/ui/ProtectedRoute';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="h-screen w-screen">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/:id" element={<Restaurant />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
