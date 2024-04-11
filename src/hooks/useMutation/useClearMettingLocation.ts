import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation } from '@tanstack/react-query';

export const useClearMeetingLocationMutation = ({ chatRoomId }: { chatRoomId: string }) => {
  return useMutation({
    mutationFn: async () => {
      const { data: updatedMeetingLocation, error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_location: null })
        .eq('chatting_room_id', chatRoomId);

      return { updatedMeetingLocation, error };
    }
  });
};
