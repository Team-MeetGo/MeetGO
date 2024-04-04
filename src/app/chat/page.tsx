import React, { Suspense } from 'react';
import ChatInput from '(@/components/chat/chatInput)';
import { serverSupabase } from '(@/utils/supabase/server)';
<<<<<<< HEAD
import ChatHeader from '(@/components/chat/ChatHeader)';
import SideBar from '(@/components/chat/sidebar/SideBar)';
=======
import ChatHeader from '(@/components/chat/chatHeader/ChatHeader)';
import ChatList from '(@/components/chat/chatBody/ChatList)';
import { ITEM_INTERVAL } from '(@/utils)';
import { userStore } from '(@/store/userStore)';
>>>>>>> e219ed431d7f140265552841c30e4af8918e7d3a

const ChatPage = async () => {
  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  // const { data: userData } = await supabase
  //   .from('users')
  //   .select('user_id, avatar, nickname')
  //   .eq('user_id', String(user?.id));
  // // console.log(userData);

  // const { data: userData } = await supabase.from('users').select('*').eq('user_id', String(user?.id));
  // console.log(userData);

  const { data: serverMsg } = await supabase
    .from('messages')
    .select('*')
    .range(0, ITEM_INTERVAL)
    .order('created_at', { ascending: false });

  return (
<<<<<<< HEAD
    <div className="flex felx-row">
      <div className="border">
        <SideBar />
      </div>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col border-indigo-600">
          <ChatHeader />
          {/* 메세지영역 */}
          <Suspense fallback="응애 나 애기 폴백">
            <ChatListParent user={user} />
          </Suspense>
          <ChatInput userData={userData} />
        </div>
=======
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col border-indigo-600 relative">
        <ChatHeader />
        <Suspense fallback="응애 나 애기 폴백">
          <ChatList serverMsg={serverMsg?.reverse() ?? []} user={user} />
        </Suspense>
        <ChatInput />
>>>>>>> e219ed431d7f140265552841c30e4af8918e7d3a
      </div>
    </div>
  );
};

export default ChatPage;
