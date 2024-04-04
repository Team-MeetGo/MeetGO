'use client';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

const ChatPresence = () => {
  const userData = userStore((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const { chatRoomId } = chatStore((state) => state);

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
          setOnlineUsers(nowUsers.length);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString(), user_id: userData && userData[0].user_id });
          }
        });
    }
  }, [userData]);
  // 나중에 roomId 받아오면 의존성에 넣을지 말지 결정예정

  return (
    <>
      <div className="flex gap-2">
        <div className="h-4  w-4 bg-indigo-500 rounded-full animate-pulse my-auto"></div>
        <h1>{onlineUsers} online</h1>
      </div>
    </>
  );
};

export default ChatPresence;
