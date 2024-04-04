'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect } from 'react';
import ChatPresence from './ChatPresence';
import { chatStore } from '(@/store/chatStore)';
import { useRouter } from 'next/navigation';
import { Message } from '(@/types/chatTypes)';

const ChatHeader = ({ allMsgs }: { allMsgs: Message[] }) => {
  const router = useRouter();
  // const roomId = window.location.pathname.substring(1);
  const roomId = 'c9c15e2c-eae0-40d4-ad33-9a05ad4792b5';
  const { roomData, chatRoomId, setMessages, setRoomData, setRoomId, setChatRoomId } = chatStore((state) => state);

  useEffect(() => {
    setMessages([...allMsgs?.slice(0, 3).reverse()]);

    const fetchRoomData = async () => {
      const { data: room, error: roomErr } = await clientSupabase.from('room').select('*').eq('room_id', roomId);
      return { room, roomErr };
    };
    const fetchChatRoomId = async () => {
      const { data: chatRoomId, error: chatRoomErr } = await clientSupabase
        .from('chatting_room')
        .select('chatting_room_id')
        .eq('room_id', String(roomId)) // params
        .eq('isActive', true);
      if (chatRoomErr) console.log('해당하는 chatting방이 없습니다.');
      return { chatRoomId, chatRoomErr };
    };
    const fetchRoomChat = async () => {
      const { room, roomErr } = await fetchRoomData();
      const { chatRoomId, chatRoomErr } = await fetchChatRoomId();
      if (room?.length && chatRoomId?.length) {
        setRoomData([...room]);
        setRoomId(room[0].room_id);
        setChatRoomId(chatRoomId[0].chatting_room_id);
      }
      if (roomErr) {
        console.error(roomErr.message);
      } else if (chatRoomErr) {
        console.log(chatRoomErr?.message);
      }
    };
    roomId && fetchRoomChat();
  }, [setRoomData, setRoomId, setChatRoomId, allMsgs, setMessages]);
  // 왜 요청이 2번이나 되징

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
