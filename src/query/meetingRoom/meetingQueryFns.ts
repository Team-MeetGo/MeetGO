import { clientSupabase } from '(@/utils/supabase/client)';
import { UUID } from 'crypto';

export const fetchRecruitingRoom = async () => {
  const { data: meetingroom, error } = await clientSupabase
    .from('room')
    .select(`*`)
    .eq('room_status', '모집중')
    .order('created_at', { ascending: false });
  if (error) return alert('error 발생!');
  return meetingroom;
};

export const fetchMyRoom = async (user_id: string | null) => {
  const { data: myRoom, error } = await clientSupabase
    .from('participants')
    .select(`*`)
    .eq('user_id', String(user_id))
    .select('user_id, room(*)')
    .order('created_at', { ascending: false });
  if (error) alert('error 발생!');
  return myRoom;
};

export const fetchRoomInfoWithRoomId = async (room_id: UUID) => {
  const { data: roominformation, error } = await clientSupabase.from('room').select(`*`).eq('room_id', room_id);
  if (error) {
    alert('미팅방 정보를 불러오는 데에 실패했습니다.');
  }
  return roominformation;
};
