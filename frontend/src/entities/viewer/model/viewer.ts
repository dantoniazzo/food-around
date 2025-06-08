import { useMeQuery } from 'features/auth';

export const useViewer = () => {
  const { data } = useMeQuery(undefined);

  const getMe = () => {
    return data;
  };

  return {
    getMe,
  };
};
