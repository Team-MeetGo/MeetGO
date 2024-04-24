import { Message } from '@/types/chatTypes';
import { UsersType } from '@/types/userTypes';
import { clientSupabase } from '@/utils/supabase/client';

// 채팅룸 아이디로 룸 정보 가져오기
export const fetchRoomDataWithChatRoomId = async (chatRoomId: string) => {
  // roomId 불러오기
  const { data: roomId, error: roomIdErr } = await clientSupabase
    .from('chatting_room')
    .select('room_id')
    .eq('chatting_room_id', chatRoomId);
  if (roomIdErr) console.error('roomId 불러오는 중 오류 발생', roomIdErr.message);

  // 룸 정보 가져오기
  if (roomId?.length) {
    const { data: roomData, error: roomDataErr } = await clientSupabase
      .from('room')
      .select('*')
      .eq('room_id', String(roomId[0].room_id));
    if (roomDataErr) console.error('room 데이터 불러오는 중 오류 발생');
    if (roomData) return roomData[0];
  }
  return null;
};

// 채팅방 참여자들 불러오기
export const fetchParticipants = async (roomId: string) => {
  const { data: userIds, error: userIdErr } = await clientSupabase
    .from('participants')
    .select('user_id')
    .eq('room_id', String(roomId))
    .eq('isDeleted', false);
  if (userIdErr) console.error('채팅방 멤버들 ID를 불러오는 데에 실패했습니다.', userIdErr.message);
  const users = [];
  if (userIds) {
    for (const id of userIds) {
      const { data, error: usersDataErr } = await clientSupabase
        .from('users')
        .select('*')
        .eq('user_id', String(id.user_id));
      if (usersDataErr) console.error('채팅방 멤버들의 유저정보를 불러오는 데에 실패했습니다.', usersDataErr.message);
      if (data) {
        users.push(...data);
      }
    }
  }
  return users;
};

// 채팅방 정보 가져오기
export const fetchChatData = async (chatRoomId: string) => {
  const { data: chatData, error: chatDataErr } = await clientSupabase
    .from('chatting_room')
    .select('*')
    .eq('chatting_room_id', chatRoomId);
  if (chatDataErr) {
    throw new Error('Error fetching chat data');
  } else {
    return chatData;
  }
};

// 내 채팅방들의 아이디
export const fetchMyChatRoomIds = async (userId: string) => {
  const myChatRooms = [];
  const { data: myRooms } = await clientSupabase.from('participants').select('room_id').eq('user_id', userId);

  if (myRooms) {
    for (let room of myRooms) {
      const { data: myChatRoomId } = await clientSupabase
        .from('chatting_room')
        .select('chatting_room_id')
        .eq('room_id', room.room_id)
        .eq('isActive', true);
      if (myChatRoomId && myChatRoomId.length) {
        myChatRooms.push(myChatRoomId[0].chatting_room_id);
      }
    }
  }
  return myChatRooms;
};

// user_id로 특정 채팅방의 마지막 메세지 가져오기
export const fetchMyLastMsgs = async (user_id: string, chatRoomId: string | null) => {
  const { data: lastMsgs, error } = await clientSupabase
    .from('remember_last_msg')
    .select('last_msg_id')
    .eq('user_id', user_id)
    .eq('chatting_room_id', String(chatRoomId));
  if (error) console.error('마지막 메세지가 없습니다.', error.message);
  if (lastMsgs && lastMsgs.length) {
    return lastMsgs[0].last_msg_id;
  }
  return null;
};

// 채팅 메세지 가져오기
export const fetchMsgs = async (chatRoomId: string) => {
  const { data: msgs, error } = await clientSupabase
    .from('messages')
    .select('*')
    .eq('chatting_room_id', chatRoomId)
    .order('created_at', { ascending: true });
  if (error) console.error('fail to load messages', error.message);
  return msgs;
};

// user_id로 현재 들어가있는 방들 정보 가져오기
export const fetchMyMsgData = async (user_id: string | undefined) => {
  const { data: msgData, error } = await clientSupabase
    .from('remember_last_msg')
    .select('chatting_room_id, room_id, newMsgCount')
    .eq('user_id', String(user_id));
  if (error) console.error('현재 방 정보 불러오는 데에 실패했습니다.', error.message);
  if (msgData && msgData.length) {
    return msgData;
  }
  return null;
};

// 새로운 메세지 추가하기
export const makeUrl = async (user: UsersType, imgs: File[], chatRoomId: string) => {
  let chatImgsUrls = [];
  for (const imgFile of imgs) {
    const uuid = crypto.randomUUID();
    const imgUrlPath = `${chatRoomId}/${user?.user_id}/${uuid}`;
    const { data: imgUrlData, error } = await clientSupabase.storage.from('chatImg').upload(imgUrlPath, imgFile, {
      cacheControl: '3600',
      upsert: true
    });
    if (error) console.error('채팅이미지 업로드 실패', error.message);
    const { data: imgUrls } = await clientSupabase.storage.from('chatImg').getPublicUrl(imgUrlData?.path as string);
    chatImgsUrls.push(imgUrls);
  }
  return chatImgsUrls.map((url) => url.publicUrl);
};

export const handleSubmit = async (
  user: UsersType | null | undefined,
  chatRoomId: string | null,
  message: string,
  imgs: File[]
) => {
  if (user && chatRoomId && (message.length || imgs.length)) {
    const { data, error } = await clientSupabase.from('messages').insert({
      send_from: user?.user_id,
      message: message.length ? message : null,
      chatting_room_id: chatRoomId,
      imgs: imgs.length ? await makeUrl(user, imgs, chatRoomId) : null
    });
    if (error) {
      console.error(error.message);
      alert('새로운 메세지를 추가하는 데에 실패했습니다.');
    }
    return data;
  }
};

// DB에 마지막 메세지 추가하기
export const addNewLastMsg = async (
  chatRoomId: string,
  roomId: string,
  user_id: string,
  last_msg_id: string | undefined
) => {
  const { data: alreadyRow } = await clientSupabase
    .from('remember_last_msg')
    .select('chatting_room_id')
    .eq('chatting_room_id', chatRoomId)
    .eq('user_id', user_id);
  if (!alreadyRow?.length) {
    const { data: addedlastMsg, error } = await clientSupabase
      .from('remember_last_msg')
      .insert({
        chatting_room_id: String(chatRoomId),
        room_id: String(roomId),
        user_id: String(user_id),
        last_msg_id: String(last_msg_id)
      })
      .select('*');
    if (error) console.error('마지막 메세지 추가하기 실패 => ', error.message);
    return addedlastMsg;
  }
};

// DB에 마지막 메세지 업데이트
export const updateMyLastMsg = async (user_id: string, chatRoomId: string, msg_id: string | undefined) => {
  const { data: updatedLastMsg, error } = await clientSupabase
    .from('remember_last_msg')
    .update({ last_msg_id: msg_id })
    .eq('user_id', user_id)
    .eq('chatting_room_id', chatRoomId)
    .select('*');
  if (error) console.error('마지막 메세지 업데이트 실패 =>', error.message);
  return updatedLastMsg;
};

// 안 읽은 메세지 수 추가
export const updateNewMsgNum = async (chatting_room_id: string) => {
  const { data: oldCount } = await clientSupabase
    .from('remember_last_msg')
    .select('newMsgCount')
    .eq('chatting_room_id', chatting_room_id);
  if (oldCount && oldCount[0]) {
    const { data: updatedNewMsgNum, error } = await clientSupabase
      .from('remember_last_msg')
      .update({ newMsgCount: oldCount[0].newMsgCount + 1 })
      .eq('chatting_room_id', chatting_room_id)
      .select('*');
    if (error) console.error('새로운 메세지 count UP 실패', error.message);
    return updatedNewMsgNum;
  }
};

// 안 읽은 메세지 수 초기화
export const clearUnReadMsgNum = async (chatting_room_id: string) => {
  const { data: clearedNewMsgNum, error } = await clientSupabase
    .from('remember_last_msg')
    .update({ newMsgCount: 0 })
    .eq('chatting_room_id', chatting_room_id)
    .select('*');
  if (error) console.error('안 읽은 메세지 수 초기화 실패', error.message);
};

// 미팅 장소 추가
export const addMeetingLocation = async ({ chatRoomId, barName }: { chatRoomId: string; barName: string }) => {
  if (!chatRoomId) {
  }
  await clientSupabase.from('chatting_room').update({ meeting_location: barName }).eq('chatting_room_id', chatRoomId);
};

// 미팅 장소 제거
export const deleteMeetingLocation = async (chatRoomId: string) => {
  await clientSupabase.from('chatting_room').update({ meeting_location: null }).eq('chatting_room_id', chatRoomId);
};

export const updateMeetingLocation = async ({ chatRoomId, barName }: { chatRoomId: string; barName: string }) => {
  const { data: DBdata, error } = await clientSupabase
    .from('chatting_room')
    .select('meeting_location')
    .eq('chatting_room_id', chatRoomId)
    .eq('meeting_location', barName);
  if (error) console.error('fail to select meeting_location', error.message);

  if (DBdata && DBdata[0]) {
    const { data, error } = await clientSupabase
      .from('chatting_room')
      .update({ meeting_location: null })
      .eq('chatting_room_id', chatRoomId);
    if (error) console.error('fail to update meetingLocation to null', error.message);
    return data;
  } else {
    const { data, error } = await clientSupabase
      .from('chatting_room')
      .update({ meeting_location: barName })
      .eq('chatting_room_id', chatRoomId);
    if (error) console.error('fail to update meetingLocation to new', error.message);
    return data;
  }
};
