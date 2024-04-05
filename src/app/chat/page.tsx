'use client';

import { Suspense, useState } from 'react';
import { serverSupabase } from '(@/utils/supabase/server)';
import ChatHeader from '(@/components/chat/chatHeader/ChatHeader)';
import ChatList from '(@/components/chat/chatBody/ChatList)';
import ChatInput from '(@/components/chat/chatInput)';
import SideBar from '(@/components/chat/sidebar/SideBar)';

const ChatPage = async () => {
  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { data: allMsgs } = await supabase.from('messages').select('*').order('created_at', { ascending: false });

  return (
    <div className="flex felx-row ">
      <div className={`border ${isSidebarOpen ? 'w-72' : 'w-0'} overflow-hidden transition-all duration-300`}>
        {isSidebarOpen && <SideBar />}
      </div>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <button onClick={toggleSidebar}> 사이드 바 </button>
        <div className="h-full border rounded-md flex flex-col border-indigo-600 relative">
          <ChatHeader allMsgs={allMsgs ?? []} />
          <Suspense fallback="응애 나 애기 폴백">
            <ChatList allMsgs={allMsgs ?? []} user={user} />
          </Suspense>
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
