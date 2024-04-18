'use client';

import { useRoomInfoWithRoomIdQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatRoomPayloadType } from '@/types/chatTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const InitRoom = ({ room_id }: { room_id: string }) => {
  const [newChatRoom, setNewChatRoom] = useState<chatRoomPayloadType | null>(null);
  const { data: user } = useGetUserDataQuery();
  const { data: room } = useRoomInfoWithRoomIdQuery(room_id);
  const router = useRouter();

  //   console.log('pathname =>', pathname);

  useEffect(() => {
    // 채팅방 isActive 상태 구독
    const channel = clientSupabase
      .channel(`${room_id}_chatting_room_table`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chatting_room',
          filter: `room_id=eq.${room_id}`
        },
        (payload) => {
          console.log('go to chat 페이로드 =>', payload.new);
          setNewChatRoom(payload.new as chatRoomPayloadType);
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channel);
    };
  }, [room_id]);

  useEffect(() => {
    if (user?.user_id !== room?.leader_id && newChatRoom) {
      router.replace(`/chat/${newChatRoom.chatting_room_id}`);
    }
  }, [newChatRoom]);
  return null;
};

export default InitRoom;
