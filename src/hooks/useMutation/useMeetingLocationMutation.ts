import { addMeetingLocation, deleteMeetingLocation } from '(@/query/chat/chatQueryFns)';
import { CHATDATA_QUERY_KEY } from '(@/query/chat/chatQueryKeys)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useClearMeetingLocationMutation = ({ chatRoomId }: { chatRoomId: string }) => {
  const queryClient = useQueryClient();

  const clearMeetingRoomMutation = useMutation({
    mutationFn: async () => await deleteMeetingLocation(chatRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHATDATA_QUERY_KEY });
    }
  });

  return clearMeetingRoomMutation;
};

export const useUpdateMeetingLocationMutation = () => {
  const queryClient = useQueryClient();

  const updateMeetingRoomMutation = useMutation({
    mutationFn: async ({ chatRoomId, barName }: { chatRoomId: string; barName: string }) =>
      await addMeetingLocation({ chatRoomId, barName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHATDATA_QUERY_KEY });
    }
  });

  return updateMeetingRoomMutation;
};
