import { clientSupabase } from '@/utils/supabase/client';

// 미팅 시간 추가
export const addMeetingTime = async (chatRoomId: string, isoStringMeetingTime: string) => {
  const { data, error } = await clientSupabase
    .from('chatting_room')
    .update({ meeting_time: isoStringMeetingTime })
    .eq('chatting_room_id', chatRoomId);
  console.log('업데이트 돼?');
  if (error) {
    console.error('미팅 시간 업데이트 실패:', error);
    return;
  }
  return;
};
