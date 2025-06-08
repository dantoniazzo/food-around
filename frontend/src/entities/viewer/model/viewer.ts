import { useMeQuery } from 'features/auth';

export const useViewer = () => {
  const { data } = useMeQuery(undefined);

  return {
    me: data,
  };
};
