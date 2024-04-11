import { fetchUserData } from '(@/query/user/userQueryFns)';
import { USER_DATA_QUERY_KEY } from '(@/query/user/userQueryKeys)';
import { useQuery } from '@tanstack/react-query';

export const useGetUserDataQuery = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [USER_DATA_QUERY_KEY],
    queryFn: fetchUserData
  });

  const isLoggedIn = data?.user_id ? true : false;

  return { data, isPending, isError, error, isLoggedIn };
};
