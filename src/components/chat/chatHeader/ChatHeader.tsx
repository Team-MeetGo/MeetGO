'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import ChatPresence from './ChatPresence';
import { chatStore } from '(@/store/chatStore)';
import { useRouter } from 'next/navigation';

const ChatHeader = () => {
  const router = useRouter();
  const { chatRoomId, roomData, setMessages, setChatRoomId } = chatStore((state) => state);
  console.log(chatRoomId);

  const getOutOfRoom = async () => {
    const { error } = await clientSupabase
      .from('chatting_room')
      .update({ isActive: false })
      .eq('chatting_room_id', String(chatRoomId));
    if (error) {
      console.error(error.message);
      alert('채팅방 나가기에서 오류가 발생하였습니다.');
    } else {
      setMessages([]);
      setChatRoomId(null);
      // router.push('/');
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
      <button onClick={getOutOfRoom}>나가기</button>
    </div>
  );
};

export default ChatHeader;
