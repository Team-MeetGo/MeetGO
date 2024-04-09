import { fetchParticipants, fetchRoomDataWithChatRoomId } from '(@/query/chat/chatQueryFns)';
import { PARTICIPANTS_QUERY_KEY, ROOMDATA_QUERY_KEY } from '(@/query/chat/chatQueryKeys)';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useRoomDataQuery = (chatRoomId: string) => {
  const { data: room } = useSuspenseQuery({
    queryKey: [ROOMDATA_QUERY_KEY, chatRoomId],
    queryFn: async () => await fetchRoomDataWithChatRoomId(chatRoomId)
  });
  return room;
};

export const useParticipantsQuery = (roomId: string) => {
  const { data: users } = useSuspenseQuery({
    queryKey: [PARTICIPANTS_QUERY_KEY, roomId],
    queryFn: async () => await fetchParticipants(roomId)
  });
  return users;
};
