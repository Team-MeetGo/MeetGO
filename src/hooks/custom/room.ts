import { clientSupabase } from '(@/utils/supabase/client)';

function meetingRoomHandler() {
  const getMeetingRoom = async () => {
    const { data: meetingroom, error } = await clientSupabase.from('room').select(`*`).eq('going_chat', false);
    if (error) return alert('error 발생!');
    return meetingroom;
  };

  const getChattingRoom = async () => {
    const { data: chattingRoom, error } = await clientSupabase.from('room').select(`*`).eq('going_chat', true);
    if (error) return alert('error 발생!');
    return chattingRoom;
  };

  return { getMeetingRoom, getChattingRoom };
}

export default meetingRoomHandler;
