import { MYCHATROOMS } from '(@/query/chat/chatQueryKeys)';
import {
  fetchAlreadyChatRoom,
  fetchMyChatRooms,
  fetchMyRoom,
  fetchRecruitingRoom,
  fetchRoomInfoWithRoomId
} from '(@/query/meetingRoom/meetingQueryFns)';
import { MY_ROOM, RECRUTING_ROOMDATA, ROOMDATA_WITH_ROOMID } from '(@/query/meetingRoom/meetingQueryKeys)';
import { useQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

export const useRecruitingQuery = (user_id: string) => {
  const results = useSuspenseQuery({
    queryKey: RECRUTING_ROOMDATA,
    queryFn: fetchRecruitingRoom
  });
  return results;
};

export const useMyroomQuery = (user_id: string) => {
  const results = useSuspenseQuery({
    queryKey: [MY_ROOM, user_id],
    queryFn: () => fetchMyRoom(user_id)
  });
  return results.data?.map((r) => r.room);
};

export const useRoomInfoWithRoomIdQuery = (room_id: string) =>
  useQuery({
    queryKey: [ROOMDATA_WITH_ROOMID, room_id],
    queryFn: () => fetchRoomInfoWithRoomId(room_id)
  });

export const useAlreadyChatRoomQuery = (room_id: string) =>
  useQuery({
    queryKey: [ROOMDATA_WITH_ROOMID, room_id],
    queryFn: () => fetchAlreadyChatRoom(room_id)
  });

export const useMyChatRoomsQuery = (user_id: string | undefined) => {
  const data = useSuspenseQuery({
    queryKey: [MYCHATROOMS],
    queryFn: () => fetchMyChatRooms(user_id)
  });
  return data;
};
