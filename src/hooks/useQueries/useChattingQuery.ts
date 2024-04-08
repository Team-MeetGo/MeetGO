import { fetchChatData, fetchRoomData, selectMessage } from '(@/services/queryFns)';
import { CHATDATA_QUERY_KEY, ROOMDATA_QUERY_KEY } from '(@/services/queryKeys)';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useRoomDataQuery = (chatRoomId: string) => {
  const { data: room } = useSuspenseQuery({
    queryKey: ROOMDATA_QUERY_KEY,
    queryFn: async () => await fetchRoomData(chatRoomId)
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
