import { fetchMyRoom, fetchRecruitingRoom, fetchRoomInfoWithRoomId } from '(@/query/meetingRoom/meetingQueryFns)';
import { MY_ROOM, RECRUTING_ROOMDATA, ROOMDATA_WITH_ROOMID } from '(@/query/meetingRoom/meetingQueryKeys)';
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useRecruitingMyroomQuery = (user_id: string) => {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: RECRUTING_ROOMDATA,
        queryFn: fetchRecruitingRoom
      },
      {
        queryKey: [MY_ROOM, user_id],
        queryFn: async () => await fetchMyRoom(user_id)
      }
    ]
  });
  return results.map((re) => re.data);
};

export const useRoomInfoWithRoomIdQuery = (room_id: UUID) => {
  const { data: roomData } = useSuspenseQuery({
    queryKey: [ROOMDATA_WITH_ROOMID, room_id],
    queryFn: async () => await fetchRoomInfoWithRoomId(room_id)
  });
  console.log(roomData);
  return roomData;
};
