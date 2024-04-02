'use client';

import { clientSupabase } from '(@/utils/supabase/client)';

const ChatHeader = () => {
  async function signOut() {
    const { error } = await clientSupabase.auth.signOut();
    if (!error) alert('로그아웃 성공');
  }
  return (
    <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
      <div className="font-bold text-2xl">
        MeetGo
        <div className="text-base font-normal">누가 들어와 있는지 들어갈 부분</div>
      </div>
      <div>몇 명 참여중인지</div>
      <button onClick={signOut}>로그아웃</button>
    </div>
  );
};

export default ChatHeader;
