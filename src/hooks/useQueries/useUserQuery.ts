import { fetchUserData } from '(@/query/user/userQueryFns)';
import { USER_DATA_QUERY_KEY } from '(@/query/user/userQueryKeys)';
import { userStore } from '(@/store/userStore)';
import { useQuery } from '@tanstack/react-query';

export const useGetUserDataQuery = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [USER_DATA_QUERY_KEY],
    queryFn: fetchUserData
  });
  return { data, isPending, isError, error };
};
