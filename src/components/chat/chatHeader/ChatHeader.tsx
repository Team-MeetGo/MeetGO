'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import ChatPresence from './ChatPresence';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';

const ChatHeader = () => {
  const { roomId, chatRoomId, roomData, setMessages, setisRest } = chatStore((state) => state);
  const { user } = userStore((state) => state);

  const getOutOfRoom = async () => {
    // 채팅방 isActive 상태를 false로 변경
    const { error: updateActiveErr } = await clientSupabase
      .from('chatting_room')
      .update({ isActive: false })
      .eq('chatting_room_id', String(chatRoomId));
    // participants 테이블에서 해당 룸에 대한 유저정보 삭제
    if (user) {
      const { error: deleteErr } = await clientSupabase
        .from('participants')
        .delete()
        .eq('room_id', String(roomId))
        .eq('user_id', user[0].user_id);
      // room에 남아있는 사람들 조회
      const { data: restOf } = await clientSupabase
        .from('participants')
        .select('user_id')
        .eq('room_id', String(roomId));
      const restArr = restOf?.map((r) => r.user_id);
      setisRest(restArr?.includes(user[0].user_id) as boolean);

      if (updateActiveErr || deleteErr) {
        console.error(updateActiveErr?.message, deleteErr?.message);
        alert('채팅방 나가기에서 오류가 발생하였습니다.');
      } else {
        setMessages([]);
      }
    }
  };

  return (
    <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
      <div className="font-bold text-2xl flex gap-2">
        {roomData && roomData[0]?.room_title}
        <div className="text-base font-normal">
          누가 들어와 있는지 들어갈 부분
          <ChatPresence />
        </div>
      </div>
      <div></div>
      <button onClick={getOutOfRoom}>죄송합니다 제 스타일은 아니신 것 같아요</button>
    </div>
  );
};

export default ChatHeader;
