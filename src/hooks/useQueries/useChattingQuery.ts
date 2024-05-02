import {
  fetchChatData,
  fetchMsgs,
  fetchMyChatRoomIds,
  fetchMyLastMsgs,
  fetchMyMsgData,
  fetchParticipants,
  fetchRoomDataWithChatRoomId
} from '@/query/chat/chatQueryFns';
import {
  CHATDATA_QUERY_KEY,
  MSGS_QUERY_KEY,
  MYCHAT_ROOMIDS,
  MY_LAST_MSGS_AFTER,
  MY_MSG_DATA,
  PARTICIPANTS_QUERY_KEY,
  ROOMDATA_QUERY_KEY
} from '@/query/chat/chatQueryKeys';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useRoomDataQuery = (chatRoomId: string) => {
  const { data: room } = useSuspenseQuery({
    queryKey: [ROOMDATA_QUERY_KEY, chatRoomId],
    queryFn: () => fetchRoomDataWithChatRoomId(chatRoomId)
  });
  if (room) return room;
};

export const useParticipantsQuery = (roomId: string) => {
  const { data: users } = useSuspenseQuery({
    queryKey: [PARTICIPANTS_QUERY_KEY, roomId],
    queryFn: () => fetchParticipants(roomId)
  });
  return users;
};

export const useChatDataQuery = (chatRoomId: string) => {
  const { data: chat } = useSuspenseQuery({
    queryKey: [CHATDATA_QUERY_KEY, chatRoomId],
    queryFn: () => fetchChatData(chatRoomId)
  });

  return chat;
};

export const useMyChatRoomIdsQuery = (userId: string) => {
  const { data: myChatRoomIds } = useSuspenseQuery({
    queryKey: [MYCHAT_ROOMIDS, userId],
    queryFn: () => fetchMyChatRoomIds(userId)
  });
  return myChatRoomIds;
};

// 더보기 or invalidate 해야만 이전 메세지를 불러올 수 있도록 자동 refetch되는 옵션 모두 false
export const useMsgsQuery = (chatRoomId: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [MSGS_QUERY_KEY, chatRoomId],
    queryFn: () => fetchMsgs(chatRoomId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  return data;
};

export const useMyLastMsgs = (user_id: string, chatRoomId: string | null) => {
  const { data: myLastMsgs } = useSuspenseQuery({
    queryKey: [MY_LAST_MSGS_AFTER, user_id, chatRoomId],
    queryFn: () => fetchMyLastMsgs(user_id, chatRoomId)
  });
  return myLastMsgs;
};

export const useMyMsgData = (user_id: string | undefined) => {
  const { data: myMsgData } = useQuery({
    queryKey: [MY_MSG_DATA],
    queryFn: () => fetchMyMsgData(user_id),
    enabled: !!user_id
  });
  if (myMsgData) return myMsgData;
};
