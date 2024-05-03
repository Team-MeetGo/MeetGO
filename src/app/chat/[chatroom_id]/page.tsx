import { Suspense } from 'react';
import { serverSupabase } from '@/utils/supabase/server';
import ChatHeader from '@/components/chat/chatHeader/ChatHeader';
import InitChat from '@/components/chat/chatHeader/InitChat';
import SideBar from '@/components/chat/sidebar/SideBar';
import ChatInput from '@/components/chat/chatFooter/ChatInput';
import ChatLoading from '@/components/chat/ChatLoading';
import { getFromTo } from '@/utils/utilFns';
import { ITEM_INTERVAL } from '@/utils/constant';
import ChatList from '@/components/chat/chatBody/ChatList';
import SideBarButton from '@/components/chat/sidebar/SideBarButton';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { MSGS_QUERY_KEY } from '@/query/chat/chatQueryKeys';

const ChatPage = async ({ params }: { params: { chatroom_id: string } }) => {
  const chatRoomId = params.chatroom_id;
  const supabase = serverSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const prefetchMsgs = async () => {
    const { from, to } = getFromTo(0, ITEM_INTERVAL);
    const { data: allMsgs, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chatting_room_id', chatRoomId)
      .range(from, to)
      .order('created_at', { ascending: false });
    if (error || !allMsgs) {
      console.error(error.message);
    } else {
      return allMsgs;
    }
  };
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [MSGS_QUERY_KEY, chatRoomId],
    queryFn: prefetchMsgs
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ChatLoading />}>
          <div className="relative flex flex-row">
            <InitChat user={user} chatRoomId={chatRoomId} />
            <div className="flex lg:flex-row w-full max-sm:flex-col justify-center mx-auto">
              <section className="lg:flex lg:max-w-96 max-sm:absolute max-sm:z-40 max-sm:bg-white">
                <SideBar chatRoomId={chatRoomId} />
              </section>
              <section className="w-full max-w-xl max-h-[calc(100vh-90px)] min-h-[36rem] relative">
                <div className="absolute top-0 left-0">
                  <SideBarButton />
                </div>
                <div className="h-full border rounded-md flex flex-col relative ">
                  <ChatHeader chatRoomId={chatRoomId} />
                  <Suspense>
                    <ChatList user={user} chatRoomId={chatRoomId} />
                    <ChatInput />
                  </Suspense>
                </div>
              </section>
            </div>
          </div>
        </Suspense>
      </HydrationBoundary>
    </main>
  );
};

export default ChatPage;
