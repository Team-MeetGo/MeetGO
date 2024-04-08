import { clientSupabase } from '(@/utils/supabase/client)';

export const fetchRecruitingRoom = async () => {
  const { data: meetingroom, error } = await clientSupabase
    .from('room')
    .select(`*`)
    .eq('room_status', '모집중')
    .order('created_at', { ascending: false });
  if (error) return alert('error 발생!');
  return meetingroom;
};

export const fetchMyRoom = async (user_id: string) => {
  const { data: myRoom, error } = await clientSupabase
    .from('participants')
    .select(`*`)
    .eq('user_id', user_id)
    .select('user_id, room(*)')
    .order('created_at', { ascending: false });
  if (error) alert('error 발생!');
  return myRoom;
};

export const fetchRoomData = async (chatRoomId: string) => {
  // roomId 불러오기
  const { data: roomId, error: roomIdErr } = await clientSupabase
    .from('chatting_room')
    .select('room_id')
    .eq('chatting_room_id', chatRoomId);
  if (roomIdErr) console.error('roomId 불러오는 중 오류 발생');
  if (roomId?.length) {
    // 룸 정보 가져오기
    const { data: roomData, error: roomDataErr } = await clientSupabase
      .from('room')
      .select('*')
      .eq('room_id', String(roomId[0].room_id));
    if (roomDataErr) {
      console.error('room 데이터 불러오는 중 오류 발생');
    } else {
      return { roomId: roomId[0].room_id, roomData: roomData[0] };
    }
  }
};
