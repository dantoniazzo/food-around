import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4 items-center">
      <h1 className="text-3xl font-sans">Choose your view</h1>
      <Stack spacing={2} direction="row">
        <Link to={'/mapbox'}>
          {' '}
          <Button variant="outlined" color="primary">
            Mapbox
          </Button>
        </Link>
        <Link to={'/google'}>
          {' '}
          <Button variant="outlined" color="secondary">
            Google Maps
          </Button>
        </Link>
        <Link to={'/table'}>
          <Button variant="outlined" color="warning">
            Table
          </Button>
        </Link>
      </Stack>
    </div>
  );
};
