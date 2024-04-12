import { addMeetingTime } from '(@/service/sidebar)';
import { useMutation } from '@tanstack/react-query';

export const updateMeetingTimeMutation = () =>
  useMutation({
    mutationFn: ({ chatRoomId, isoStringMeetingTime }: { chatRoomId: string; isoStringMeetingTime: string }) =>
      addMeetingTime(chatRoomId, isoStringMeetingTime)
  });
