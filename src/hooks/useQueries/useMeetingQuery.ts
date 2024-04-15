import {
  fetchAlreadyChatRoom,
  fetchMyRoom,
  fetchRecruitingRoom,
  fetchRoomInfoWithRoomId,
  fetchRoomParticipants
} from '@/query/meetingRoom/meetingQueryFns';
import {
  MY_ROOM,
  RECRUTING_ROOMDATA,
  ROOMDATA_WITH_ROOMID,
  ROOMLIST,
  ROOM_MEMBER
} from '@/query/meetingRoom/meetingQueryKeys';
// import { profileCount } from '@/store/userStore';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

//현재 모집중인 방
export const useRecruitingQuery = (user_id: string) => {
  const data = useSuspenseQuery({
    queryKey: RECRUTING_ROOMDATA,
    queryFn: fetchRecruitingRoom
  });
  return data;
};
//내가 참가한 방
export const useMyroomQuery = (user_id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [ROOMLIST, user_id],
    queryFn: () => fetchMyRoom(user_id)
  });
  return data;
};

// 희라가 참여한 방 숫자 가져오려고 추가하는 로직
//   const { setMeetingRoomCount } = profileCount();
//   useEffect(() => {
//     if (results.data) {
//       setMeetingRoomCount(results.data?.length);
//     }
//   }, [results.data]);

//   return results.data?.map((r) => r.room);
// };
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

// export const useMyChatRoomsQuery = (user_id: string | undefined) => {
//   const data = useSuspenseQuery({
//     queryKey: [MYCHATROOMS],
//     queryFn: () => fetchMyChatRooms(user_id)
//   });
//   return data;
// };
