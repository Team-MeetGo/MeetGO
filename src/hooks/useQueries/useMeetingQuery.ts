import {
  fetchAlreadyChatRoom,
  fetchMyRoom,
  fetchRecruitingRoom,
  fetchRoomInfoWithRoomId
} from '(@/query/meetingRoom/meetingQueryFns)';
import { MY_ROOM, RECRUTING_ROOMDATA, ROOMDATA_WITH_ROOMID } from '(@/query/meetingRoom/meetingQueryKeys)';
import { profileCount } from '(@/store/userStore)';
import { useQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

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

  // 희라가 참여한 방 숫자 가져오려고 추가하는 로직
  const { setMeetingRoomCount } = profileCount();
  useEffect(() => {
    if (results.data) {
      setMeetingRoomCount(results.data?.length);
    }
  }, [results.data]);

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
