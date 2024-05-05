import { UsersType } from '@/types/userTypes';
import { clientSupabase } from '@/utils/supabase/client';

// 채팅룸 아이디로 룸 정보 가져오기
export const fetchRoomDataWithChatRoomId = async (chatRoomId: string) => {
  const { data: room, error: roomIdErr } = await clientSupabase
    .from('chatting_room')
    .select('room_id, room(*)')
    .eq('chatting_room_id', chatRoomId)
    .single();
  if (roomIdErr) {
    console.error('미팅룸 정보를 불러오는 데에 실패했습니다.');
  } else {
    return room;
  }
};

// 채팅방 참여자들 불러오기
export const fetchParticipants = async (roomId: string) => {
  const { data: participantsData, error: userIdErr } = await clientSupabase
    .from('participants')
    .select('user_id, users(*)')
    .eq('room_id', String(roomId))
    .eq('isDeleted', false);
  if (userIdErr) {
    throw new Error('채팅방 멤버들 ID를 불러오는 데에 실패했습니다.');
  } else {
    return participantsData;
  }
};

// 채팅방 정보 가져오기
export const fetchChatData = async (chatRoomId: string) => {
  const { data: chatData, error: chatDataErr } = await clientSupabase
    .from('chatting_room')
    .select('*')
    .eq('chatting_room_id', chatRoomId)
    .single();
  if (chatDataErr || !chatData) {
    console.error('채팅방 정보를 불러오는 데 실패했습니다.');
  } else {
    return chatData;
  }
};

// 내 채팅방들의 아이디
export const fetchMyChatRoomIds = async (userId: string) => {
  const myChatRooms = [];
  const { data: myRooms, error } = await clientSupabase.from('participants').select('room_id').eq('user_id', userId);
  if (error) {
    throw new Error('회원님의 채팅방 데이터를 불러오는 데에 실패했습니다.');
  } else {
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
    return myChatRooms;
  }
};

// user_id로 특정 채팅방의 마지막 메세지 가져오기
export const fetchMyLastMsgs = async (user_id: string, chatRoomId: string | null) => {
  const { data: lastMsgs, error } = await clientSupabase
    .from('remember_last_msg')
    .select('last_msg_id')
    .eq('user_id', user_id)
    .eq('chatting_room_id', String(chatRoomId));
  if (error) {
    throw new Error('마지막 메세지가 없습니다.');
  } else {
    if (lastMsgs.length) {
      return lastMsgs[0].last_msg_id;
    } else {
      return null;
    }
  }
};

// 채팅 메세지 가져오기
export const fetchMsgs = async (chatRoomId: string) => {
  const { data: msgs, error } = await clientSupabase
    .from('messages')
    .select('*')
    .eq('chatting_room_id', chatRoomId)
    .order('created_at', { ascending: true });
  if (error || !msgs) {
    throw new Error('메세지를 불러오는 데에 실패했습니다.');
  } else {
    return msgs;
  }
};

// user_id로 현재 들어가있는 방들 정보 가져오기
export const fetchMyMsgData = async (user_id: string | undefined) => {
  const { data: msgData, error } = await clientSupabase
    .from('remember_last_msg')
    .select('chatting_room_id, room_id, newMsgCount')
    .eq('user_id', String(user_id));
  if (error) {
    throw new Error('현재 방 정보 불러오는 데에 실패했습니다.');
  } else {
    if (msgData.length) {
      return msgData;
    }
  }
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
    if (error) {
      throw new Error('채팅이미지 업로드에 실패하였습니다.');
    } else {
      const { data: imgUrls } = await clientSupabase.storage.from('chatImg').getPublicUrl(imgUrlData.path as string);
      chatImgsUrls.push(imgUrls);
    }
  }
  return chatImgsUrls.map((url) => url.publicUrl);
};

export const handleSubmit = async (
  user: UsersType | null | undefined,
  chatRoomId: string | null,
  message: string,
  imgs: File[]
) => {
  const trimmedMessage = message.trim();
  if (user && chatRoomId && ((message.length && trimmedMessage !== '') || imgs.length)) {
    const { error } = await clientSupabase.from('messages').insert({
      send_from: user?.user_id,
      message: message.length ? message : null,
      chatting_room_id: chatRoomId,
      imgs: imgs.length ? await makeUrl(user, imgs, chatRoomId) : null
    });
    if (error) {
      alert('새로운 메세지를 추가하는 데에 실패했습니다.');
      throw new Error('새로운 메세지를 추가하는 데에 실패했습니다.');
    }
  } else {
    return;
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
    if (error) {
      console.error('마지막 메세지 추가하기 실패 => ', error.message);
      throw new Error('마지막 메세지를 추가할 수 없습니다');
    } else {
      return addedlastMsg;
    }
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
  if (error) {
    console.error('마지막 메세지 업데이트 실패 =>', error.message);
    throw new Error('마지막 메세지 업데이트에 실패했습니다.');
  } else {
    return updatedLastMsg;
  }
};

// 안 읽은 메세지 수 추가
export const updateNewMsgNum = async (chatting_room_id: string) => {
  const { data: oldCount, error: oldCountSelectErr } = await clientSupabase
    .from('remember_last_msg')
    .select('newMsgCount')
    .eq('chatting_room_id', chatting_room_id);
  if (oldCountSelectErr) {
    console.error('fail to select oldCount', oldCountSelectErr.message);
  } else {
    const { data: updatedNewMsgNum, error } = await clientSupabase
      .from('remember_last_msg')
      .update({ newMsgCount: oldCount[0].newMsgCount + 1 })
      .eq('chatting_room_id', chatting_room_id)
      .select('*');
    if (error) {
      console.error('새로운 메세지 count UP 실패', error.message);
      throw new Error('새로운 메세지 카운트에 실패했습니다.');
    } else {
      return updatedNewMsgNum;
    }
  }
};

// 안 읽은 메세지 수 초기화
export const clearUnReadMsgNum = async (chatting_room_id: string) => {
  const { data: clearedNewMsgNum, error } = await clientSupabase
    .from('remember_last_msg')
    .update({ newMsgCount: 0 })
    .eq('chatting_room_id', chatting_room_id)
    .select('*');
  if (error) {
    console.error('안 읽은 메세지 수 초기화 실패', error.message);
    throw new Error('안 읽은 메세지 수 초기화 실패');
  } else {
    return clearedNewMsgNum;
  }
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
  if (error) {
    console.error('fail to select meeting_location', error.message);
    throw new Error('미팅 장소를 불러오는 데 실패했습니다.');
  }

  if (DBdata && DBdata[0]) {
    const { data, error } = await clientSupabase
      .from('chatting_room')
      .update({ meeting_location: null })
      .eq('chatting_room_id', chatRoomId);
    if (error) {
      console.error('fail to update meetingLocation to null', error.message);
      throw new Error('미팅 장소 업데이트에 실패했습니다.');
    }
    return data;
  } else {
    const { data, error } = await clientSupabase
      .from('chatting_room')
      .update({ meeting_location: barName })
      .eq('chatting_room_id', chatRoomId);
    if (error) {
      console.error('fail to update meetingLocation to new', error.message);
      throw new Error('미팅 장소 업데이트에 실패했습니다.');
    }
    return data;
  }
};
