'use client';
import { Message } from '(@/types)';
import { getformattedDate } from '(@/utils)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import ChatDropDownMenu from './ChatDropDownMenu';
import { User } from '@supabase/supabase-js';

const ChatList = ({ serverMsg, user }: { serverMsg: Message[]; user: User | null }) => {
  const [messages, setMessages] = useState<Message[]>([...serverMsg]);

  useEffect(() => {
    const channle = clientSupabase
      .channel('realtime chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages([...messages, payload.new as Message]);
        }
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(messages.filter((msg) => msg.message_id !== payload.old.message_id));
      })
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channle);
    };
  }, [messages, setMessages]);

  return (
    <div className=" w-full flex-1 bg-slate-500 p-5 flex flex-col gap-8 overflow-y-auto">
      {messages?.map((msg, idx) => {
        if (msg.send_from === user?.id) {
          return <MyChat msg={msg} key={idx} />;
        } else {
          return <OthersChat msg={msg} key={idx} />;
        }
      })}
    </div>
  );
};

export default ChatList;

const MyChat = ({ msg }: { msg: Message }) => {
  return (
    <div className="flex gap-4 ml-auto">
      <div className="w-80 h-24 flex flex-col gap-1">
        <div className="font-bold ml-auto">{msg.nickname}</div>
        <div className="flex gap-2 ml-auto">
          <ChatDropDownMenu msg={msg} />
          <div className="border rounded-md p-3 h-full text-right">{msg.message}</div>
        </div>
        <div className="mt-auto text-slate-100 text-xs ml-auto">
          <p>{getformattedDate(msg.created_at)}</p>
        </div>
      </div>
      <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">{msg.avatar}</div>
    </div>
  );
};

const OthersChat = ({ msg }: { msg: Message }) => {
  return (
    <div className="flex gap-4" key={msg.message_id}>
      <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">{msg.avatar}</div>

      <div className="w-80 h-24 flex flex-col gap-1">
        <div className="font-bold">{msg.nickname}</div>
        <div className="gap-2 mr-auto">
          <div className="border rounded-md p-3 h-full">{msg.message}</div>
        </div>

        <div className="mt-auto text-slate-100 text-xs">
          <p>{getformattedDate(msg.created_at)}</p>
        </div>
      </div>
    </div>
  );
};
