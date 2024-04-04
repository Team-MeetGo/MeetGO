'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import ChatPresence from './ChatPresence';
import { RoomData } from '(@/types/chatTypes)';

const ChatHeader = () => {
  async function signOut() {
    const { error } = await clientSupabase.auth.signOut();
    if (!error) alert('로그아웃 성공');
  }
  // const roomId = window.location.pathname.substring(1);
  const roomId = 'c9c15e2c-eae0-40d4-ad33-9a05ad4792b5';
  const [roomData, setRoomData] = useState<RoomData[]>();
  // store에 roomData 지울지? 다른 사람들 필요하면 냅두기

  useEffect(() => {
    console.log(roomData);
    const fetchRoomData = async (roomId: string) => {
      const { data } = await clientSupabase.from('room').select('*').eq('room_id', roomId);
      data && setRoomData([...data]);
    };
    fetchRoomData(roomId);
  }, []);

  return (
    <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
      <div className="font-bold text-2xl flex gap-2">
        {roomData && roomData[0]?.room_title}
        <div className="text-base font-normal">
          누가 들어와 있는지 들어갈 부분
          <ChatPresence roomId={roomId} />
        </div>
      </div>
      <div>몇 명 참여중인지</div>
      <button onClick={signOut}>로그아웃</button>
    </div>
  );
};

export default ChatHeader;
