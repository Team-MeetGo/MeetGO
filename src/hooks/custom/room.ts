import { clientSupabase } from '(@/utils/supabase/client)';

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

  return { getMeetingRoom, getChattingRoom };
}

export default meetingRoomHandler;
