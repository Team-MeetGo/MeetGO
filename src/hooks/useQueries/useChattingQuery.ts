import { fetchRoomData, selectMessage } from '(@/services/queryFns)';
import { ROOMDATA_QUERY_KEY } from '(@/services/queryKeys)';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useRoomDataQuery = (chatRoomId: string) => {
  const { data: room } = useSuspenseQuery({
    queryKey: ROOMDATA_QUERY_KEY,
    queryFn: async () => await fetchRoomData(chatRoomId)
  });
  return room;
};
