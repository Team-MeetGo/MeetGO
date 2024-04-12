import { MEETING_TIME_QUERY_KEY } from '(@/query/chat/chatQueryKeys)';
import { addMeetingTime } from '(@/service/sidebar)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const updateMeetingTimeMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: updateMeetingTime } = useMutation({
    mutationFn: ({ chatRoomId, isoStringMeetingTime }: { chatRoomId: string; isoStringMeetingTime: string }) =>
      addMeetingTime(chatRoomId, isoStringMeetingTime),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [MEETING_TIME_QUERY_KEY]
      });
    }
  });
  return { mutate: updateMeetingTime };
};
