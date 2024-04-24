'use client';

import { useMsgsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { CHATDATA_QUERY_KEY, MSGS_QUERY_KEY } from '@/query/chat/chatQueryKeys';
import { chatStore } from '@/store/chatStore';
import { Message, chatRoomPayloadType } from '@/types/chatTypes';
import { ITEM_INTERVAL } from '@/utils/constant';
import { clientSupabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const InitChat = ({ user, chatRoomId, allMsgs }: { user: User | null; chatRoomId: string; allMsgs: Message[] }) => {
  const { chatState, isRest, setChatState, setisRest, setChatRoomId, setHasMore } = chatStore((state) => state);
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.room_id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const messages = useMsgsQuery(chatRoomId);

  useEffect(() => {
    // 채팅방 isActive 상태 구독
    const channel = clientSupabase
      .channel(`${chatRoomId}_chatting_room_table`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chatting_room', filter: `chatting_room_id=eq.${chatRoomId}` },
        (payload) => {
          setChatState((payload.new as chatRoomPayloadType).isActive);
          if (user?.id !== room?.leader_id) {
            queryClient.invalidateQueries({
              queryKey: [CHATDATA_QUERY_KEY]
            });
          }
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // **채팅방에 있을지 말지
    if (!chatState) {
      // 한 명이 채팅방을 나가서 채팅방 isActive가 false가 되면,
      if (isRest) {
        // 내가 나가기를 누른 사람이 아니라면(남은 사람이면) 다시 수락창으로
        router.push(`/meetingRoom/${roomId}`);
      } else {
        // 내가 나가기를 누른 사람이라면 아예 로비로
        router.push('/meetingRoom');
      }
      setChatState(true);
      setisRest(true);
    } else {
      // **채팅방에 있는다면
      queryClient.setQueryData([MSGS_QUERY_KEY, chatRoomId], [...allMsgs].reverse());
      setHasMore(allMsgs?.length >= ITEM_INTERVAL + 1);
      setChatRoomId(chatRoomId);
    }
  }, [chatState, isRest]);

  return null;
};

export default InitChat;
