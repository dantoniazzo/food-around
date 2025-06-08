import { useEffect, useState } from 'react';
import { authApi } from '../api';
import { type IErrorResponse } from 'app/redux';
import { Login } from 'pages/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [handleMe] = authApi.endpoints.me.useLazyQuery();

  const checkAuth = async () => {
    try {
      const me = await handleMe(undefined);
      console.log('Me: ', me);
      if (me) setAuthorized(true);
    } catch (err) {
      console.log('Error', (err as IErrorResponse).error);
      setAuthorized(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (authorized) return props.children;
  else return <Login />;
};
