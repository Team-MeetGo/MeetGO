'use client';

import { RoomData } from '(@/types)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

const ChatHeader = () => {
  async function signOut() {
    const { error } = await clientSupabase.auth.signOut();
    if (!error) alert('로그아웃 성공');
  }
  // const roomId = window.location.pathname.substring(1);
  const roomId = 'c9c15e2c-eae0-40d4-ad33-9a05ad4792b5';
  const [roomData, setRoomData] = useState<RoomData[]>();

  useEffect(() => {
    const fetchRoomData = async () => {
      const { data } = await clientSupabase.from('room').select('*').eq('room_id', roomId);
      if (data) setRoomData([...data]);
    };
    fetchRoomData();
  }, [roomData]);

  return (
    <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
      <div className="font-bold text-2xl flex">
        {roomData && roomData[0]?.room_title}
        <div className="text-base font-normal">누가 들어와 있는지 들어갈 부분</div>
      </div>
      <div>몇 명 참여중인지</div>
      <button onClick={signOut}>로그아웃</button>
    </div>
  );
};

export default ChatHeader;
