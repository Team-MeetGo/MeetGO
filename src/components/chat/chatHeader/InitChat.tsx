'use client';

import { CHATDATA_QUERY_KEY, MSGS_QUERY_KEY } from '@/query/chat/chatQueryKeys';
import { useMsgsQuery, useRoomDataQuery } from '@/query/useQueries/useChattingQuery';
import { chatStore } from '@/store/chatStore';
import { chatRoomType } from '@/types/chatTypes';
import { ITEM_INTERVAL } from '@/utils/constant';
import { clientSupabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const InitChat = ({ user, chatRoomId }: { user: User | null; chatRoomId: string }) => {
  const { chatState, isRest, setChatState, setisRest, setChatRoomId, setHasMore } = chatStore((state) => state);
  const {
    room: { room_id, leader_id }
  } = useRoomDataQuery(chatRoomId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const allMsgs = useMsgsQuery(chatRoomId);

  useEffect(() => {
    // 채팅방 isActive 상태 구독
    const channel = clientSupabase
      .channel(`${chatRoomId}_chatting_room_table`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chatting_room', filter: `chatting_room_id=eq.${chatRoomId}` },
        (payload) => {
          setChatState((payload.new as chatRoomType).isActive);
          if (user?.id !== leader_id) {
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
        router.push(`/meetingRoom/${room_id}`);
      } else {
        // 내가 나가기를 누른 사람이라면 아예 로비로
        router.push('/meetingRoom');
      }
      setChatState(true);
      setisRest(true);
    } else {
      // **채팅방에 있는다면
      setChatRoomId(chatRoomId);
      if (allMsgs) {
        queryClient.setQueryData([MSGS_QUERY_KEY, chatRoomId], [...allMsgs].reverse());
        setHasMore(allMsgs.length >= ITEM_INTERVAL + 1);
      }
    }
  }, [chatState, isRest]);

  return null;
};

export default InitChat;
