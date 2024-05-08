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
  const [{ data: recruitingData }, { data: myRoomData }, { data: myPastNowRoomData }] = useSuspenseQueries({
    queries: [
      {
        queryKey: [RECRUTING_ROOMDATA],
        queryFn: fetchRecruitingRoom
      },
      {
        queryKey: [ROOMLIST, user_id],
        queryFn: () => fetchMyRoom(user_id)
      },
      {
        queryKey: [MY_PAST_NOW_ROOM],
        queryFn: () => fetchMyPastAndNowRoom(user_id),
        select: (value: any) => value.map((room: any) => room.room) as MeetingRoomType[]
      }
    ]
  });
  return { recruitingData, myRoomData, myPastNowRoomData };
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

//이미 채팅으로 넘어간 목록
export const useAlreadyChatRoomQuery = (roomId: string): ChattingRoomType[] | undefined => {
  const { data } = useQuery({
    queryKey: [ROOMDATA_WITH_ROOMID, roomId],
    queryFn: () => fetchAlreadyChatRoom(roomId),
    enabled: !!roomId
  });
  return data;
};
