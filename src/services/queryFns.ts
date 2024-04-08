import { clientSupabase } from '(@/utils/supabase/client)';

export const selectMessage = async () => {
  const { data } = await clientSupabase.from('messages').select('*');
  return data;
};

export const fetchRoomData = async (chatRoomId: string) => {
  // roomId 불러오기
  const { data: roomId, error: roomIdErr } = await clientSupabase
    .from('chatting_room')
    .select('room_id')
    .eq('chatting_room_id', chatRoomId);
  if (roomIdErr) console.error('roomId 불러오는 중 오류 발생');
  if (roomId?.length) {
    // setRoomId(roomId[0].room_id);

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
    // room && setRoomData([...room]);
  }
};

// 채팅창 정보 가져오기
export const fetchChatData = async (chatRoomId: string) => {
  const { data: chatData, error: chatDataErr } = await clientSupabase
    .from('chatting_room')
    .select('*')
    .eq('chatting_room_id', chatRoomId);
  if (chatDataErr) {
    console.error('chat 데이터 불러오는 중 오류 발생');
  } else {
    return chatData;
  }
};
