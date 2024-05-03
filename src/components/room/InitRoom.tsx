'use client';

import { chatRoomType } from '@/types/chatTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { UUID } from 'crypto';

const InitRoom = ({ roomId }: { roomId: UUID }) => {
  const [newChatRoom, setNewChatRoom] = useState<chatRoomType | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 새로운 채팅방 생성 구독 -> 생성되면 채팅방으로 넘겨주기
    const channel = clientSupabase
      .channel(`${roomId}_chatting_room_table`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chatting_room',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setNewChatRoom(payload.new as chatRoomType);
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    if (newChatRoom) {
      router.replace(`/chat/${newChatRoom.chatting_room_id}`);
    }
  }, [newChatRoom]);
  return null;
};

export default InitRoom;
