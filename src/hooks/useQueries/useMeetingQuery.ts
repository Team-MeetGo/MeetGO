import {
  fetchAlreadyChatRoom,
  fetchMyRoom,
  fetchRecruitingRoom,
  fetchRoomInfoWithRoomId,
  fetchRoomParticipants
} from '(@/query/meetingRoom/meetingQueryFns)';
import {
  MY_ROOM,
  RECRUTING_ROOMDATA,
  ROOMDATA_WITH_ROOMID,
  ROOMLIST,
  ROOM_MEMBER
} from '(@/query/meetingRoom/meetingQueryKeys)';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
//현재 모집중인 방
export const useRecruitingQuery = (user_id: string) => {
  const results = useSuspenseQuery({
    queryKey: RECRUTING_ROOMDATA,
    queryFn: fetchRecruitingRoom
  });
  return results;
};
//내가 참가한 방
export const useMyroomQuery = (user_id: string) => {
  const results = useSuspenseQuery({
    queryKey: [ROOMLIST, user_id],
    queryFn: () => fetchMyRoom(user_id)
  });
  return results.data?.map((r) => r.room);
};
//room_id로 하나의 방 얻기
export const useRoomInfoWithRoomIdQuery = (room_id: string) => {
  const data = useQuery({
    queryKey: [ROOMDATA_WITH_ROOMID, room_id],
    queryFn: () => fetchRoomInfoWithRoomId(room_id)
  });
  return data;
};
//이미 채팅으로 넘어간 목록
export const useAlreadyChatRoomQuery = (room_id: string) => {
  const data = useQuery({
    queryKey: [ROOMDATA_WITH_ROOMID, room_id],
    queryFn: () => fetchAlreadyChatRoom(room_id)
  });
  return data;
};
//참가한 사람들의 유저정보
export const useRoomParticipantsQuery = (room_id: string) => {
  const { data: users } = useSuspenseQuery({
    queryKey: [ROOM_MEMBER, room_id],
    queryFn: () => fetchRoomParticipants(room_id)
  });
  return users;
};
