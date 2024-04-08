import { fetchMyRoom, fetchRecruitingRoom } from '(@/query/meetingRoom/meetingQueryFns)';
import { MY_ROOM, RECRUTING_ROOMDATA } from '(@/query/meetingRoom/meetingQueryKeys)';
import { useSuspenseQueries } from '@tanstack/react-query';

export const useRecruitingMyroomQuery = (user_id: string | null) => {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: RECRUTING_ROOMDATA,
        queryFn: fetchRecruitingRoom
      },
      {
        queryKey: MY_ROOM,
        queryFn: async () => await fetchMyRoom(user_id)
      }
    ]
  });
  return results.map((re) => re.data);
};
