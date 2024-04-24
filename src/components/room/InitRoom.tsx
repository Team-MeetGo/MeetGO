'use client';

import { useRoomInfoWithRoomIdQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatRoomPayloadType } from '@/types/chatTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { UUID } from 'crypto';

const InitRoom = ({ roomId }: { roomId: UUID }) => {
  const [newChatRoom, setNewChatRoom] = useState<chatRoomPayloadType | null>(null);
  // const { data: user } = useGetUserDataQuery();
  // const room = useRoomInfoWithRoomIdQuery(roomId);
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
          setNewChatRoom(payload.new as chatRoomPayloadType);
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    // if (user?.user_id !== room?.leader_id && newChatRoom) {
    if (newChatRoom) {
      router.replace(`/chat/${newChatRoom.chatting_room_id}`);
    }
  }, [newChatRoom]);
  return null;
};

export default InitRoom;
