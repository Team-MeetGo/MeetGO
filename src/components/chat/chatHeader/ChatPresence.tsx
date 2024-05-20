'use client';

import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { clientSupabase } from '@/utils/supabase/client';
import { useEffect } from 'react';

const ChatPresence = () => {
  const { data: user } = useGetUserDataQuery();
  const { chatRoomId, onlineUsers, setOnlineUsers } = chatStore((state) => state);

  useEffect(() => {
    if (chatRoomId) {
      const channel = clientSupabase.channel(chatRoomId);
      channel
        .on('presence', { event: 'sync' }, () => {
          const nowUsers = [];
          for (const id in channel.presenceState()) {
            // @ts-ignore
            nowUsers.push(channel.presenceState()[id][0].user_id);
          }
          setOnlineUsers([...nowUsers]);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString(), user_id: user?.user_id });
          }
        });
    }
  }, [user, chatRoomId]);

  return (
    <>
      <div className="flex gap-2">
        <div className="h-4  w-4 bg-mainColor rounded-full animate-pulse my-auto text-base"></div>
        {chatRoomId && <h1>{onlineUsers.length} online</h1>}
      </div>
    </>
  );
};

export default ChatPresence;
