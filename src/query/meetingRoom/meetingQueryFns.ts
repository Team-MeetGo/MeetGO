import { MeetingRoomType, UpdateRoomType, UserType } from '(@/types/roomTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';

export const fetchRecruitingRoom = async () => {
  const { data: meetingroom, error } = await clientSupabase
    .from('room')
    .select(`*`)
    .eq('room_status', '모집중')
    .order('created_at', { ascending: false });
  return meetingroom;
};

export const fetchMyRoom = async (user_id: string) => {
  const { data: myRoom, error } = await clientSupabase
    .from('participants')
    .select(`*`)
    .eq('user_id', user_id)
    .select('user_id, room(*)')
    .order('created_at', { ascending: false });
  return myRoom;
};

export const fetchRoomInfoWithRoomId = async (room_id: string) => {
  try {
    const { data: room, error } = await clientSupabase.from('room').select(`*`).eq('room_id', room_id);

    if (!room || room.length <= 0) {
      throw new Error('room이 존재하지 않습니다.');
    }
    return room[0];
  } catch (error) {
    console.log(error);
  }
};

export const fetchAlreadyChatRoom = async (room_id: string) => {
  const { data: alreadyChat } = await clientSupabase
    .from('chatting_room')
    .select('*')
    .eq('room_id', room_id)
    .eq('isActive', true);
  return alreadyChat;
};

export const addRoom = async ({ nextMeetingRoom, user_id }: { nextMeetingRoom: MeetingRoomType; user_id: string }) => {
  const { data: insertMeetingRoom } = await clientSupabase.from('room').upsert([nextMeetingRoom]).select();
  if (insertMeetingRoom) {
    await clientSupabase.from('participants').insert([{ room_id: insertMeetingRoom[0].room_id, user_id: user_id }]);
    return insertMeetingRoom[0].room_id;
  }
};

export const updateRoomStatusClose = async (room_id: string) =>
  await clientSupabase.from('room').update({ room_status: '모집종료' }).eq('room_id', room_id);

export const updateRoomStatusOpen = async (room_id: string) =>
  await clientSupabase.from('room').update({ room_status: '모집중' }).eq('room_id', room_id);

export const updateRoom = async (editedMeetingRoom: UpdateRoomType) => {
  const { data } = await clientSupabase.from('room').update(editedMeetingRoom).eq('room_id', editedMeetingRoom.room_id);
  return data;
};

export const deleteRoom = async (room_id: string) => {
  const { data: deleteRoomData } = await clientSupabase.from('room').delete().eq('room_id', room_id);
  return deleteRoomData;
};

export const updateLeaderMember = async ({
  otherParticipants,
  room_id
}: {
  otherParticipants: UserType[];
  room_id: string;
}) => {
  await clientSupabase.from('room').update({ leader_id: otherParticipants[0].user_id }).eq('room_id', room_id);
};

export const addMember = async ({ user_id, room_id }: { user_id: string; room_id: string }) => {
  if (!user_id) {
    console.log('유저가 없어요');
  }
  await clientSupabase.from('participants').insert([{ user_id, room_id }]);
};

export const deleteMember = async ({ user_id, room_id }: { user_id: string; room_id: string }) => {
  await clientSupabase
    .from('participants')
    .update({ isDeleted: true })
    .eq('user_id', user_id)
    .eq('room_id', room_id)
    .select();
};
