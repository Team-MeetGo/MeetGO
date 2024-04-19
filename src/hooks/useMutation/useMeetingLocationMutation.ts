import { addMeetingLocation, deleteMeetingLocation } from '@/query/chat/chatQueryFns';
import { CHATDATA_QUERY_KEY } from '@/query/chat/chatQueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateMeetingLocationMutation = () => {
  const queryClient = useQueryClient();

  const updateMeetingRoomMutation = useMutation({
    mutationFn: ({ chatRoomId, barName }: { chatRoomId: string; barName: string }) =>
      addMeetingLocation({ chatRoomId, barName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHATDATA_QUERY_KEY });
    }
  });

  return updateMeetingRoomMutation;
};

export const useClearMeetingLocationMutation = () => {
  const queryClient = useQueryClient();

  const clearMeetingRoomMutation = useMutation<void, unknown, string>({
    mutationFn: (chatRoomId: string) => {
      return deleteMeetingLocation(chatRoomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHATDATA_QUERY_KEY });
    }
  });

  return clearMeetingRoomMutation;
};
