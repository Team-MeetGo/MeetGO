import { Suspense } from 'react';
import { serverSupabase } from '(@/utils/supabase/server)';
import ChatHeader from '(@/components/chat/chatHeader/ChatHeader)';
import ChatList from '(@/components/chat/chatBody/ChatList)';
import InitChat from '(@/components/chat/chatHeader/InitChat)';
import SideBar from '(@/components/chat/sidebar/SideBar)';
import ChatInput from '(@/components/chat/ChatInput)';

const ChatPage = async ({ params }: { params: { chatroom_id: string } }) => {
  const chatRoomId = params.chatroom_id;

  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const { data: roomData } = await supabase
    .from('chatting_room')
    .select('room_id')
    .eq('chatting_room_id', chatRoomId)
    .single();
  const roomId = roomData?.room_id;

  let leaderId = null;
  if (roomId) {
    const { data: roomData } = await supabase.from('room').select('leader_id').eq('room_id', roomId).single();
    leaderId = roomData?.leader_id;
  }

  const { data: allMsgs } = await supabase
    .from('messages')
    .select('*')
    .eq('chatting_room_id', chatRoomId)
    .order('created_at', { ascending: false });

  return (
    <div className="flex felx-row">
      <InitChat chatRoomId={chatRoomId} allMsgs={allMsgs ?? []} />
      <SideBar userId={user?.id} leaderId={leaderId} chatRoomId={chatRoomId} />
      <div className="w-full max-w-2xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col border-indigo-600 relative">
          <ChatHeader chatRoomId={chatRoomId} />
          <Suspense fallback="skeleton 들어갈 자리">
            <ChatList user={user} chatRoomId={chatRoomId} />
          </Suspense>
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
