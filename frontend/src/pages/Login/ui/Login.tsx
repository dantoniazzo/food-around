import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <form className="flex flex-col gap-4">
        <TextField type="email" id="email" label="Email" variant="standard" />
        <TextField
          type="password"
          id="password"
          label="Password"
          variant="standard"
        />
        <Button variant="outlined">Login</Button>
        <span className="text-sm">
          Don't have an account?{' '}
          <Link className="text-amber-400" to={'/signup'}>
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
};
