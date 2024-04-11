import { addMeetingTime } from '(@/query/chat/chatQueryFns)';
import { MEETING_TIME_QUERY_KEY } from '(@/query/chat/chatQueryKeys)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateMeetingTimeMutation = () => {
  const queryClient = useQueryClient();

  const updateMeetingRoomMutation = useMutation({
    mutationFn: async ({ chatRoomId, isoStringMeetingTime }: { chatRoomId: string; isoStringMeetingTime: string }) =>
      await addMeetingTime({ chatRoomId, isoStringMeetingTime }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETING_TIME_QUERY_KEY });
    }
  });

  return updateMeetingRoomMutation;
};
