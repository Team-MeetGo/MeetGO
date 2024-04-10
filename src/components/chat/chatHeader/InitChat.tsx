'use client';
import { useMyLastMsgs, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { chatStore } from '(@/store/chatStore)';
import { Message, chatRoomPayloadType } from '(@/types/chatTypes)';
import { ITEM_INTERVAL } from '(@/utils/constant)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const InitChat = ({ user, chatRoomId, allMsgs }: { user: User | null; chatRoomId: string; allMsgs: Message[] }) => {
  const router = useRouter();
  const { messages, chatState, isRest, setChatState, setMessages, setChatRoomId, setHasMore } = chatStore(
    (state) => state
  );
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.roomId;

  const myLastMsgId = useMyLastMsgs(user?.id!, chatRoomId);
  console.log('원래 있던 마지막 id', myLastMsgId);

  useEffect(() => {
    // 채팅방 isActive 상태 구독
    const channel = clientSupabase
      .channel(`${chatRoomId}_chatting_room_table`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chatting_room', filter: `chatting_room_id=eq.${chatRoomId}` },
        (payload) => {
          console.log(payload.new);
          setChatState((payload.new as chatRoomPayloadType).isActive);
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channel);
    };
  }, [chatRoomId, setChatState]);

  useEffect(() => {
    // **채팅방에 있을지 말지
    if (!chatState) {
      // 한 명이 채팅방을 나가서 채팅방 isActive가 false가 되면,
      if (isRest) {
        // 내가 나가기를 누른 사람이 아니라면(남은사람이면) 다시 수락창으로
        router.push(`/meetingRoom/${roomId}`);
      } else {
        // 내가 나가기를 누른 사람이라면 아예 로비로
        router.push('/meetingRoom');
      }
    } else {
      // **채팅방에 있는다면
      if (messages.length === 0) {
        setMessages([...allMsgs].reverse()); // 현재 메세지가 없을 때만(처음시작 or 메세지 한개일 때)
        setHasMore(allMsgs?.length < ITEM_INTERVAL + 1);
      }
      setChatRoomId(chatRoomId);
    }
  }, [setChatRoomId, allMsgs, chatRoomId, setMessages, setHasMore, messages.length, chatState, isRest, router, roomId]);
  // 왜 요청이 2번이나 되징

  // const userId = user ? user[0].user_id : '';
  // console.log(messages);

  // const { mutate: mutateToUpdate } = useUpdateLastMsg(
  //   userId,
  //   chatRoomId as string,
  //   messages[messages.length - 1].message_id
  // );

  // useEffect(() => {
  //   return () => {
  //     mutateToUpdate();
  //   };
  // }, [pathname]);

  return <></>;
};

export default InitChat;
