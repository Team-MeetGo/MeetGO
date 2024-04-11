import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation } from '@tanstack/react-query';

export const useUpdateMeetingTimeMutation = () => {
  return useMutation({
    mutationFn: async ({ chatRoomId, isoStringMeetingTime }: { chatRoomId: string; isoStringMeetingTime: string }) => {
      const { data: updatedMeetingTime, error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: isoStringMeetingTime })
        .eq('chatting_room_id', chatRoomId);

      return { updatedMeetingTime, error };
    }
  });
};
