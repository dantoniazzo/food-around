import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [handleMe] = authApi.endpoints.me.useLazyQuery();
  const navigate = useNavigate();
  const checkAuth = useCallback(async () => {
    const me = await handleMe(undefined);
    if (me.isError) {
      setAuthorized(false);
      navigate('/login');
    } else setAuthorized(true);
  }, [handleMe, navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authorized) return props.children;
};
