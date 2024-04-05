'use client';

import { chatStore } from '(@/store/chatStore)';
import { Message } from '(@/types/chatTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

const InitChat = ({ chatRoomId, allMsgs }: { chatRoomId: string; allMsgs: Message[] }) => {
  const { messages, setMessages, setRoomId, setRoomData, setChatRoomId, setHasMore } = chatStore((state) => state);

  useEffect(() => {
    const channel = clientSupabase
      .channel(`${chatRoomId}_chatting_room_table`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chatting_room', filter: `chatting_room_id=eq.${chatRoomId}` },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channel);
    };
  }, [chatRoomId]);

  useEffect(() => {
    if (messages.length === 0) setMessages([...allMsgs?.slice(0, 3).reverse()]); // 현재 메세지가 없을 때만(처음시작 or 메세지 한개일 때)
    setHasMore(allMsgs?.length - messages?.length > 0);
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
  }, [setRoomData, setRoomId, setChatRoomId, allMsgs, chatRoomId, setMessages, setHasMore, messages.length]);
  // 왜 요청이 2번이나 되징
  return <></>;
};

export default InitChat;
