import { clientSupabase } from '(@/utils/supabase/client)';

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

export const fetchParticipants = async (roomId: string) => {
  const { data: userIds, error: userIdErr } = await clientSupabase
    .from('participants')
    .select('user_id')
    .eq('room_id', String(roomId));
  console.log('채팅방 멤버들', userIds); // 남은 애들
  if (userIdErr) alert('채팅방 멤버들 ID를 불러오는 데에 실패했습니다.');

  if (userIds) {
    const users = [];
    for (const id of userIds) {
      const { data, error: usersDataErr } = await clientSupabase
        .from('users')
        .select('*')
        .eq('user_id', String(id.user_id));
      if (usersDataErr) alert('채팅방 멤버들의 유저정보를 불러오는 데에 실패했습니다.');
      if (data) {
        users.push(...data);
      }
    }
    return users;
    // setUsersData([...users]);
  }
};
