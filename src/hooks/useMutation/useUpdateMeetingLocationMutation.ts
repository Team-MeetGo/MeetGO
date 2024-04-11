import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation } from '@tanstack/react-query';

export const useUpdateMeetingLocationMutation = () => {
  return useMutation({
    mutationFn: async ({ chatRoomId, barName }: { chatRoomId: string; barName: string }) => {
      const { data: updatedMeetingLocation, error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_location: barName })
        .eq('chatting_room_id', chatRoomId);

      return { updatedMeetingLocation, error };
    }
  });
};
