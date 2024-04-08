'use client';
import { chatStore } from '(@/store/chatStore)';
import { Message, chatRoomPayloadType } from '(@/types/chatTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const InitChat = ({ chatRoomId, allMsgs }: { chatRoomId: string; allMsgs: Message[] }) => {
  const router = useRouter();
  const {
    roomId,
    messages,
    chatState,
    isRest,
    setChatState,
    setMessages,
    setRoomId,
    setRoomData,
    setChatRoomId,
    setHasMore
  } = chatStore((state) => state);

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
      if (messages.length === 0) setMessages([...allMsgs?.slice(0, 3).reverse()]); // 현재 메세지가 없을 때만(처음시작 or 메세지 한개일 때)
      setHasMore(allMsgs?.length - messages?.length > 0);
      setChatRoomId(chatRoomId);

      const fetchRoomData = async () => {
        // roomId 불러오기
        const { data: roomId, error: roomIdErr } = await clientSupabase
          .from('chatting_room')
          .select('room_id')
          .eq('chatting_room_id', chatRoomId);
        if (roomIdErr) console.error('roomId 불러오는 중 오류 발생');
        if (roomId?.length) {
          setRoomId(roomId[0].room_id);

          // 룸 정보 가져오기
          const { data: room, error: roomDataErr } = await clientSupabase
            .from('room')
            .select('*')
            .eq('room_id', String(roomId[0].room_id));
          if (roomDataErr) console.error('room 데이터 불러오는 중 오류 발생');
          room && setRoomData([...room]);
        }
      };

      fetchRoomData();
    }
  }, [
    setRoomData,
    setRoomId,
    setChatRoomId,
    allMsgs,
    chatRoomId,
    setMessages,
    setHasMore,
    messages.length,
    chatState,
    isRest,
    roomId
  ]);
  // 왜 요청이 2번이나 되징
  return <></>;
};

export default InitChat;
