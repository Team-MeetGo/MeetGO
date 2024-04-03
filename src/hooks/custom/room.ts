import { clientSupabase } from '(@/utils/supabase/client)';
import { UUID } from 'crypto';

function meetingRoomHandler() {
  const getMeetingRoom = async () => {
    const { data: meetingroom, error } = await clientSupabase
      .from('room')
      .select(`*`)
      .eq('going_chat', false)
      .order('created_at', { ascending: false });
    if (error) return alert('error 발생!');
    return meetingroom;
  };

  const getChattingRoom = async () => {
    const { data: chattingRoom, error } = await clientSupabase
      .from('room')
      .select(`*`)
      .eq('going_chat', true)
      .order('created_at', { ascending: false });
    if (error) return alert('error 발생!');
    return chattingRoom;
  };

  const getRoomInformation = async (room_id: UUID) => {
    const { data: roominformation } = await clientSupabase.from('room').select(`*`).eq('room_id', room_id);
    return roominformation;
  };

  return { getMeetingRoom, getChattingRoom, getRoomInformation };
}

export default meetingRoomHandler;
