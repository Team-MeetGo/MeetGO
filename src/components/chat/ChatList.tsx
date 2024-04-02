'use client';
import { Message } from '(@/types)';
import { getformattedDate } from '(@/utils)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { CiMenuKebab } from 'react-icons/ci';
import { HiOutlineMenu } from 'react-icons/hi';
import { TfiLayoutMenuSeparated } from 'react-icons/tfi';
import ChatDropDownMenu from './ChatDropDownMenu';

const ChatList = ({ serverMsg }: { serverMsg: Message[] }) => {
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
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channle);
    };
  }, [messages, setMessages]);

  return (
    <div className=" w-full flex-1 bg-slate-500 p-5 flex flex-col gap-8 overflow-y-auto">
      {messages?.map((msg, idx) => {
        if (!(idx % 2)) {
          return <OddChat msg={msg} key={idx} />;
        } else {
          return <EvenChat msg={msg} key={idx} />;
        }
      })}
    </div>
  );
};

export default ChatList;

const OddChat = ({ msg }: { msg: Message }) => {
  return (
    <div className="flex gap-4 ml-auto">
      <div className="w-80 h-24 flex flex-col gap-1">
        <div className="font-bold ml-auto">{msg.nickname}</div>
        <div className="flex gap-2 ml-auto">
          <ChatDropDownMenu />
          <div className="border rounded-md p-3 h-full">{msg.message}</div>
        </div>
        <div className="mt-auto text-slate-100 text-xs ml-auto">
          <p>{getformattedDate(msg.created_at)}</p>
        </div>
      </div>
      <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">{msg.avatar}</div>
    </div>
  );
};

const EvenChat = ({ msg }: { msg: Message }) => {
  return (
    <div className="flex gap-4" key={msg.message_id}>
      <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">{msg.avatar}</div>

      <div className="w-80 h-24 flex flex-col gap-1">
        <div className="font-bold">{msg.nickname}</div>
        <div className="flex gap-2">
          <div className="border rounded-md p-3 h-full">{msg.message}</div>
          <ChatDropDownMenu />
        </div>

        <div className="mt-auto text-slate-100 text-xs">
          <p>{getformattedDate(msg.created_at)}</p>
        </div>
      </div>
    </div>
  );
};
