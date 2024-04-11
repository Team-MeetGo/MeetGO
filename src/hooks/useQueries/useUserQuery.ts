import { fetchUserData } from '(@/query/user/userQueryFns)';
import { USER_DATA_QUERY_KEY } from '(@/query/user/userQueryKeys)';
import { userStore } from '(@/store/userStore)';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useGetUserDataQuery = () => {
  const { isLoggedIn, setIsLoggedIn, setUser } = userStore((state) => state);
  const { data, isPending, isError, error } = useQuery({
    queryKey: [USER_DATA_QUERY_KEY],
    queryFn: fetchUserData
  });

  useEffect(() => {
    if (data) {
      setIsLoggedIn(true);
      setUser(data);
    } else {
      setIsLoggedIn(false);
    }
  }, [data, setIsLoggedIn, setUser]);

  return { data, isPending, isError, error };
};
