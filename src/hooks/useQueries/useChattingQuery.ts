import { fetchChatData, fetchParticipants, fetchRoomDataWithChatRoomId } from '(@/query/chat/chatQueryFns)';
import { CHATDATA_QUERY_KEY, PARTICIPANTS_QUERY_KEY, ROOMDATA_QUERY_KEY } from '(@/query/chat/chatQueryKeys)';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useRoomDataQuery = (chatRoomId: string) => {
  const { data: room } = useSuspenseQuery({
    queryKey: [ROOMDATA_QUERY_KEY, chatRoomId],
    queryFn: async () => await fetchRoomDataWithChatRoomId(chatRoomId)
  });
  return room;
};

export const useChatDataQuery = (chatRoomId: string) => {
  const { data: chat } = useSuspenseQuery({
    queryKey: CHATDATA_QUERY_KEY,
    queryFn: async () => await fetchChatData(chatRoomId)
  });
  return chat;
};

export const useParticipantsQuery = (roomId: string) => {
  const { data: users } = useSuspenseQuery({
    queryKey: [PARTICIPANTS_QUERY_KEY, roomId],
    queryFn: async () => await fetchParticipants(roomId)
  });
  return users;
};
