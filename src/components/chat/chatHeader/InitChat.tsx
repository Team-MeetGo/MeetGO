'use client';

import { chatStore } from '(@/store/chatStore)';
import { Message } from '(@/types/chatTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect } from 'react';

const InitChat = ({ chatRoomId, allMsgs }: { chatRoomId: string; allMsgs: Message[] }) => {
  const { messages, setMessages, setRoomId, setRoomData, setChatRoomId, setHasMore } = chatStore((state) => state);
  useEffect(() => {
    setMessages([...allMsgs?.slice(0, 3).reverse()]);
    setHasMore(messages.length ? allMsgs?.length - messages?.length > 0 : false);
    setChatRoomId(chatRoomId);

    const fetchRoomData = async () => {
      const { data: roomId, error: roomIdErr } = await clientSupabase
        .from('chatting_room')
        .select('room_id')
        .eq('chatting_room_id', chatRoomId);
      if (roomIdErr) console.error('roomId 불러오는 중 오류 발생');

      if (roomId?.length) {
        setRoomId(roomId[0].room_id);
        const { data: room, error: roomDataErr } = await clientSupabase
          .from('room')
          .select('*')
          .eq('room_id', String(roomId[0].room_id));
        if (roomDataErr) console.error('room 데이터 불러오는 중 오류 발생');
        room && setRoomData([...room]);
      }
    };
    fetchRoomData();
  }, [setRoomData, setRoomId, setChatRoomId, allMsgs, setMessages, chatRoomId, setHasMore]);
  // 왜 요청이 2번이나 되징
  return <></>;
};

export default InitChat;
