import {
  fetchAlreadyChatRoom,
  fetchMyPastAndNowRoom,
  fetchMyRoom,
  fetchRecruitingRoom,
  fetchRoomInfoWithRoomId,
  fetchRoomParticipants
} from '@/query/meetingRoom/meetingQueryFns';
import {
  MY_PAST_NOW_ROOM,
  RECRUTING_ROOMDATA,
  ROOMDATA,
  ROOMDATA_WITH_ROOMID,
  ROOMLIST,
  ROOM_MEMBER
} from '@/query/meetingRoom/meetingQueryKeys';
import { ChattingRoomType, MeetingRoomType, ParticipantsWithId, UserType } from '@/types/roomTypes';
import { useQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

//현재 모집중인 방
export const useRoomConditionDataQuery = (user_id: string) => {
  const [{ data: recrutingData }, { data: myRoomData }] = useSuspenseQueries({
    queries: [
      {
        queryKey: [RECRUTING_ROOMDATA],
        queryFn: fetchRecruitingRoom
      },
      {
        queryKey: [ROOMLIST, user_id],
        queryFn: () => fetchMyRoom(user_id)
      }
    ]
  });
  return { recrutingData, myRoomData };
};

export const useRoomInformationQuery = (roomId: string) => {
  const [{ data: roomInfoWithId }, { data: roomMemberWithId }] = useSuspenseQueries({
    queries: [
      {
        queryKey: [ROOMDATA, roomId],
        queryFn: () => fetchRoomInfoWithRoomId(roomId),
        select: (value: MeetingRoomType[]) => value[0]
      },
      {
        queryKey: [ROOM_MEMBER, roomId],
        queryFn: () => fetchRoomParticipants(roomId),
        select: (value: ParticipantsWithId[]) => value.map((participant) => participant.users) as UserType[]
      }
    ]
  });
  return { roomInfoWithId, roomMemberWithId };
};

export const useMyPastAndNowRoomQuery = (user_id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [MY_PAST_NOW_ROOM],
    queryFn: () => fetchMyPastAndNowRoom(user_id)
  });
  return data;
};

//이미 채팅으로 넘어간 목록
export const useAlreadyChatRoomQuery = (roomId: string): ChattingRoomType[] | undefined => {
  const { data } = useQuery({
    queryKey: [ROOMDATA_WITH_ROOMID, roomId],
    queryFn: () => fetchAlreadyChatRoom(roomId)
  });
  return data;
};

//참가한 사람들의 유저정보
// export const useRoomParticipantsQuery = (roomId: string): UserType[] => {
//   const { data } = useSuspenseQuery({
//     queryKey: [ROOM_MEMBER, roomId],
//     queryFn: () => fetchRoomParticipants(roomId),
//     select: (value: ParticipantsWithId[]) => value.map((participant) => participant.users) as UserType[]
//   });
//   return data;
// };

//내가 참가한 방
// export const useMyroomQuery = (user_id: string | undefined) => {
//   const { data: myRoomData } = useSuspenseQuery({
//     queryKey: [ROOMLIST, user_id],
//     queryFn: () => fetchMyRoom(user_id)
//   });
//   return myRoomData;
// };

//room_id로 하나의 방 얻기
// export const useRoomInfoWithRoomIdQuery = (roomId: string): MeetingRoomType | undefined => {
//   const { data: roomInfoWithId } = useQuery({
//     queryKey: [ROOMDATA, roomId],
//     queryFn: () => fetchRoomInfoWithRoomId(roomId),
//     select: (value: MeetingRoomType[]) => value[0]
//   });
//   return roomInfoWithId;
// };
