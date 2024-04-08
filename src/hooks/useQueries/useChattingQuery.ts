import { fetchRoomData, selectMessage } from '(@/services/queryFns)';
import { CHATMESSAGE_QUERY_KEY, ROOMDATA_QUERY_KEY } from '(@/services/queryKeys)';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useChattingQuery = () => {
  const { data, isLoading } = useSuspenseQuery({
    queryKey: CHATMESSAGE_QUERY_KEY,
    queryFn: selectMessage
  });
  return { data, isLoading };
};

export const useRoomDataQuery = (chatRoomId: string) => {
  const { data: room } = useSuspenseQuery({
    queryKey: ROOMDATA_QUERY_KEY,
    queryFn: async () => await fetchRoomData(chatRoomId)
  });
  return room;
};
