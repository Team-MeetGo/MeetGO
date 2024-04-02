import React, { Suspense } from 'react';
import ChatInput from '../../components/chat/ChatInput';
import ChatListParent from '(@/components/chat/ChatListParent)';
import { serverSupabase } from '(@/utils/supabase/server)';
import ChatHeader from '(@/components/chat/ChatHeader)';

const ChatPage = async () => {
  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  console.log(data);

  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col border-indigo-600">
        <ChatHeader />
        {/* 메세지영역 */}
        <Suspense fallback="응애 나 애기 폴백">
          <ChatListParent />
        </Suspense>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
