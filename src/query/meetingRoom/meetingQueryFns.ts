import { NextMeetingRoomType, UpdateRoomType, UserType } from '(@/types/roomTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { UUID } from 'crypto';

export const fetchRecruitingRoom = async () => {
  const { data: meetingroom, error } = await clientSupabase
    .from('room')
    .select(`*`)
    .eq('room_status', '모집중')
    .order('created_at', { ascending: false });
  if (error) console.log('error 발생!');
  return meetingroom;
};

export const fetchMyRoom = async (user_id: string | null) => {
  const { data: myRoom, error } = await clientSupabase
    .from('participants')
    .select(`*`)
    .eq('user_id', String(user_id))
    .select('user_id, room(*)')
    .order('created_at', { ascending: false });
  if (error) console.log('myRoom error 발생!', error.message);
  return myRoom;
};

export const fetchRoomInfoWithRoomId = async (room_id: string) => {
  const { data: roominformation, error } = await clientSupabase.from('room').select(`*`).eq('room_id', room_id);
  if (error) {
    console.log('미팅방 정보를 불러오는 데에 실패했습니다.');
  }
  return roominformation;
};

export const addRoom = async ({
  nextMeetingRoom,
  user_id
}: {
  nextMeetingRoom: NextMeetingRoomType;
  user_id: string | null;
}) => {
  const { data: insertMeetingRoom } = await clientSupabase.from('room').upsert([nextMeetingRoom]).select();
  if (insertMeetingRoom) {
    await clientSupabase.from('participants').insert([{ room_id: insertMeetingRoom[0].room_id }, { user_id: user_id }]);
    const room_id = insertMeetingRoom[0].room_id;
    await clientSupabase.from('participants').insert([{ user_id, room_id }]);
    return insertMeetingRoom[0].room_id;
  }
};

export const updateRoomStatusClose = async (room_id: string) =>
  await clientSupabase.from('room').update({ room_status: '모집종료' }).eq('room_id', room_id);

export const updateRoomStatusOpen = async (room_id: string) =>
  await clientSupabase.from('room').update({ room_status: '모집중' }).eq('room_id', room_id);

export const updateRoom = async ({ title, tags, location, memberNumber, room_id }: UpdateRoomType) => {
  await clientSupabase
    .from('room')
    .update({ room_title: title, feature: tags, location: location, member_number: memberNumber })
    .eq('room_id', room_id)
    .select();
};

export const deleteRoom = async (room_id: string) => {
  await clientSupabase.from('room').delete().eq('room_id', room_id);
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

export const addMember = async ({ user_id, room_id }: { user_id: string | undefined; room_id: string }) => {
  if (!user_id) {
    console.log('유저가 없어요');
  }
  await clientSupabase.from('participants').insert([{ user_id, room_id }]);
};

export const deleteMember = async ({ user_id }: { user_id: string }) => {
  await clientSupabase.from('participants').delete().eq('user_id', user_id);
};
