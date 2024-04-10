import { getMetPeople } from '(@/query/user/metPeopleQueryFns)';
import { KAKAOID_REQUEST_QUERY_KEY } from '(@/query/user/metPeopleQueryKeys)';
import { useQuery } from '@tanstack/react-query';

export const useMetPeople = (userId: string, userGender: string) => {
  const { data } = useQuery({
    queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender],
    queryFn: () => getMetPeople(userId, userGender)
  });
  return data;
};
