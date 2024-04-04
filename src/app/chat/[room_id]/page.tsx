import { Suspense } from 'react';
import ChatInput from '../../../components/chat/ChatInput';
import { serverSupabase } from '(@/utils/supabase/server)';
import ChatHeader from '(@/components/chat/chatHeader/ChatHeader)';
import ChatList from '(@/components/chat/chatBody/ChatList)';

const ChatPage = async () => {
  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const { data: allMsgs } = await supabase.from('messages').select('*').order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col border-indigo-600 relative">
        <ChatHeader allMsgs={allMsgs ?? []} />
        <Suspense fallback="응애 나 애기 폴백">
          <ChatList allMsgs={allMsgs ?? []} user={user} />
        </Suspense>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
