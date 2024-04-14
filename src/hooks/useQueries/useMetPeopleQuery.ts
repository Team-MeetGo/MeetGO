import { getMetPeople } from '(@/query/user/metPeopleQueryFns)';
import { KAKAOID_REQUEST_QUERY_KEY } from '(@/query/user/metPeopleQueryKeys)';
import { profileCount } from '(@/store/userStore)';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useMetPeople = (userId: string, userGender: string) => {
  const { data } = useQuery({
    queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender],
    queryFn: () => getMetPeople(userId, userGender)
  });

  const { setMetPeopleCount } = profileCount();
  useEffect(() => {
    if (data) {
      setMetPeopleCount(data.length);
    }
  }, [data]);

  return data;
};
