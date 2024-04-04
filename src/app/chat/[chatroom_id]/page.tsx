import { Suspense } from 'react';
import { serverSupabase } from '(@/utils/supabase/server)';
import ChatHeader from '(@/components/chat/chatHeader/ChatHeader)';
import ChatList from '(@/components/chat/chatBody/ChatList)';
import ChatInput from '(@/components/chat/chatInput)';
import InitChat from '(@/components/chat/chatHeader/InitChat)';

const ChatPage = async ({ params }: { params: { chatroom_id: string } }) => {
  console.log(params.chatroom_id);
  const chatRoomId = params.chatroom_id;

  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const { data: allMsgs } = await supabase
    .from('messages')
    .select('*')
    .eq('chatting_room_id', chatRoomId)
    .order('created_at', { ascending: false });
  console.log(allMsgs);

  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col border-indigo-600 relative">
        <InitChat chatRoomId={chatRoomId} allMsgs={allMsgs ?? []} />
        <ChatHeader />
        <Suspense fallback="응애 나 애기 폴백">
          <ChatList user={user} />
        </Suspense>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
