import { Map } from 'widgets';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Restaurant } from 'pages/Restaurant';
import { getItem, LocalStorageKeys } from 'shared';
import { Login } from 'pages/Login';
import { Signup } from 'pages/Signup';

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
              element={getItem(LocalStorageKeys.USER_ID) ? <Map /> : <Login />}
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
