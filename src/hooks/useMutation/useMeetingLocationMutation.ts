import { addMeetingLocation, deleteMeetingLocation, updateMeetingLocation } from '@/query/chat/chatQueryFns';
import { CHATDATA_QUERY_KEY } from '@/query/chat/chatQueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateMeetingLocationMutation = () => {
  const queryClient = useQueryClient();

  const updateMeetingRoomMutation = useMutation({
    mutationFn: ({ chatRoomId, barName }: { chatRoomId: string; barName: string }) =>
      updateMeetingLocation({ chatRoomId, barName }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CHATDATA_QUERY_KEY] });
    }
  });

  return updateMeetingRoomMutation;
};
