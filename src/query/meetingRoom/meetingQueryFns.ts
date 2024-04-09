import { clientSupabase } from '(@/utils/supabase/client)';
import { UUID } from 'crypto';

export const fetchRecruitingRoom = async () => {
  const { data: meetingroom, error } = await clientSupabase
    .from('room')
    .select(`*`)
    .eq('room_status', '모집중')
    .order('created_at', { ascending: false });
  if (error) {
    alert('error 발생!');
    return null;
  }
  return meetingroom;
};

export const fetchMyRoom = async (user_id: string) => {
  const { data: myRoom, error } = await clientSupabase
    .from('participants')
    .select(`*`)
    .eq('user_id', user_id)
    .select('user_id, room(*)')
    .order('created_at', { ascending: false });
  console.log('myRoom =>', myRoom);
  if (error) {
    // alert('error 발생!');
    console.log(error.message);
    return null;
  }
  return myRoom;
};

export const fetchRoomInfoWithRoomId = async (room_id: UUID) => {
  const { data: roominformation, error } = await clientSupabase.from('room').select(`*`).eq('room_id', room_id);
  if (error) {
    alert('미팅방 정보를 불러오는 데에 실패했습니다.');
  }
  return roominformation;
};
