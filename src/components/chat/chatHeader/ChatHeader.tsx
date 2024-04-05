'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import ChatPresence from './ChatPresence';
import { chatStore } from '(@/store/chatStore)';
import { useRouter } from 'next/navigation';
import { userStore } from '(@/store/userStore)';

const ChatHeader = () => {
  const router = useRouter();
  const { roomId, chatRoomId, roomData, setMessages, messages } = chatStore((state) => state);
  const user = userStore((state) => state.user);

  const getOutOfRoom = async () => {
    const { error: updateActiveErr } = await clientSupabase
      .from('chatting_room')
      .update({ isActive: false })
      .eq('chatting_room_id', String(chatRoomId));

    const { error: deleteErr } = await clientSupabase.from('participants').delete().eq('room_id', String(roomId));

    if (updateActiveErr && deleteErr) {
      console.error(updateActiveErr.message, deleteErr.message);
      alert('채팅방 나가기에서 오류가 발생하였습니다.');
    } else {
      setMessages([]);
      router.push(`/meetingRoom`);
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
