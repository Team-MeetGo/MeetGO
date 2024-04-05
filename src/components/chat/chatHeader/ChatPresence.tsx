'use client';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

const ChatPresence = () => {
  const userData = userStore((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const chatRoomId = chatStore((state) => state.chatRoomId);

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
          console.log(nowUsers.length);
          setOnlineUsers(nowUsers.length);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString(), user_id: userData && userData[0].user_id });
          }
        });
    }
  }, [userData, chatRoomId]);
  // presence가 re-load시 바로 반영이 안되는 문제 발생

  return (
    <>
      <div className="flex gap-2">
        <div className="h-4  w-4 bg-indigo-500 rounded-full animate-pulse my-auto"></div>
        {chatRoomId && <h1>{onlineUsers} online</h1>}
      </div>
    </>
  );
};

export default ChatPresence;
