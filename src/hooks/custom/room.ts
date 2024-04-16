'use client';
import { clientSupabase } from '@/utils/supabase/client';

function meetingRoomHandler() {
  const getChattingRoom = async () => {
    const { data: chattingRoom, error } = await clientSupabase
      .from('room')
      .select(`*`)
      .eq('room_status', '모집종료')
      .order('created_at', { ascending: false });
    if (error) return alert('error 발생!');
    return chattingRoom;
  };

  const getmaxGenderMemberNumber = (memberNumber: string) => {
    if (memberNumber === '1:1') {
      return 1;
    } else if (memberNumber === '2:2') {
      return 2;
    } else if (memberNumber === '3:3') {
      return 3;
    } else if (memberNumber === '4:4') {
      return 4;
    }
  };

  return { getChattingRoom, getmaxGenderMemberNumber };
}

export default meetingRoomHandler;
