'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect } from 'react';
import ChatPresence from './ChatPresence';
import { chatStore } from '(@/store/chatStore)';

const ChatHeader = () => {
  async function signOut() {
    const { error } = await clientSupabase.auth.signOut();
    if (!error) alert('로그아웃 성공');
  }
  // const roomId = window.location.pathname.substring(1);
  const roomId = 'c9c15e2c-eae0-40d4-ad33-9a05ad4792b5';
  const { roomData, setRoomData, setRoomId, setChatRoomId } = chatStore((state) => state);

  useEffect(() => {
    const fetchRoomData = async (roomId: string) => {
      const { data: room } = await clientSupabase.from('room').select('*').eq('room_id', roomId);
      return room;
    };

    const fetchChatRoomId = async () => {
      const { data: chatRoomId, error } = await clientSupabase
        .from('chatting_room')
        .select('chatting_room_id')
        .eq('room_id', String(roomId));
      return chatRoomId;
    };
    fetchChatRoomId();

    const fetchRoomChat = async (roomId: string) => {
      const room = await fetchRoomData(roomId);
      const chatRoomId = await fetchChatRoomId();
      if (room && chatRoomId) {
        setRoomData([...room]);
        setRoomId(room[0].room_id);
        setChatRoomId(chatRoomId[0].chatting_room_id);
      }
    };
    fetchRoomChat(roomId);
  }, [setRoomData, setRoomId, setChatRoomId]);

  //   const getOutOfRoom = async () => {
  // const {data:, error} = await clientSupabase.from("chatting_room").delete().eq("room_id", roomId)

  // if(error) {
  //   console.error(error.message)
  //  alert("채팅방 나가기에서 오류가 발생하였습니다.")
  // } else {

  // }
  //   }

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
      <button onClick={signOut}>나가기</button>
    </div>
  );
};

export default ChatHeader;
