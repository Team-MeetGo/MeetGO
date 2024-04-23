import {
  fetchChatData,
  fetchMyChatRoomIds,
  fetchMyLastMsgs,
  fetchMyMsgData,
  fetchParticipants,
  fetchRoomDataWithChatRoomId
} from '@/query/chat/chatQueryFns';
import {
  CHATDATA_QUERY_KEY,
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
  return room;
};

export const useParticipantsQuery = (roomId: string) => {
  const { data: users } = useSuspenseQuery({
    queryKey: [PARTICIPANTS_QUERY_KEY, roomId],
    queryFn: () => fetchParticipants(roomId)
  });
  return users;
};

export const useChatDataQuery = (chatRoomId: string) => {
  const { data: chat } = useQuery({
    queryKey: [CHATDATA_QUERY_KEY],
    queryFn: () => fetchChatData(chatRoomId)
  });
  return chat[0];
};

export const useMyChatRoomIdsQuery = (userId: string) => {
  const { data: myChatRoomIds } = useSuspenseQuery({
    queryKey: [MYCHAT_ROOMIDS, userId],
    queryFn: () => fetchMyChatRoomIds(userId)
  });
  return myChatRoomIds;
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
