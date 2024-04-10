'use client';
import { Message } from '(@/types/chatTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ChatScroll from './ChatScroll';
import NewChatAlert from './NewChatAlert';
import LoadChatMore from './LoadChatMore';
import { chatStore } from '(@/store/chatStore)';
import OthersChat from './OthersChat';
import ChatSearch from './ChatSearch';
import { useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { usePathname, useRouter } from 'next/navigation';
import { MyChat } from './ChatList';

export const ChatList = ({ user, chatRoomId }: { user: User | null; chatRoomId: string }) => {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { hasMore, messages, setMessages } = chatStore((state) => state);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(true);
  const [newAddedMsgNum, setNewAddedMsgNum] = useState(0);
  const [count, setCount] = useState(1);
  const [lastCheckedMsg, setLastCheckedMsg] = useState();
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.roomId;

  const router = useRouter();

  // console.log('서버에서 받은 messages', messages);
  const rememberLastMsg = () => {
    const lastDiv = document.getElementById(`${messages[messages.length - 1].message_id}`);
  };

  const keepLastMsgID = () => {
    if (messages.length) {
      localStorage.setItem(`${chatRoomId}`, JSON.stringify(messages[messages.length - 1].message_id));
    }
  };

  const getLastMsgID = () => {
    const lastMsgID = localStorage.getItem(`${chatRoomId}`);
    console.log(lastMsgID);
    // localStorage.removeItem(`${chatRoomId}`);
  };

  useEffect(() => {
    if (roomId && chatRoomId) {
      // INSERT, DELETE 구독
      const channel = clientSupabase
        .channel(chatRoomId)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chatting_room_id=eq.${chatRoomId}`
          },
          (payload) => {
            setMessages([...messages, payload.new as Message]);
            if (isScrolling) {
              setNewAddedMsgNum((prev) => (prev += 1));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'messages', filter: `chatting_room_id=eq.${chatRoomId}` },
          (payload) => {
            setMessages(messages.filter((msg) => msg.message_id !== payload.old.message_id));
          }
        )
        .subscribe();
      return () => {
        clientSupabase.removeChannel(channel);
      };
    }
  }, [messages, setMessages, isScrolling, roomId, chatRoomId]);

  // 처음에 로드될 시
  useEffect(() => {
    // 스크롤 중이 아니면 기본적으로 스크롤 다운
    const scrollBox = scrollRef.current;
    if (scrollBox && isScrolling === false) {
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
  }, [messages, isScrolling]);

  const pathname = usePathname();
  // const { mutate: mutateToUpdate } = useUpdateLastMsg(
  //   user?.id as string,
  //   chatRoomId as string,
  //   messages[messages.length - 1].message_id as string
  // );
  useEffect(() => {
    return () => {
      console.log('나갈 때');
    };
  }, [pathname]);

  // 스크롤 이벤트가 발생할 때
  const handleScroll = () => {
    const scrollBox = scrollRef.current;
    if (scrollBox) {
      const isScroll = scrollBox.scrollTop < scrollBox.scrollHeight - scrollBox.clientHeight - 10;
      setIsScrolling(isScroll);
      if (!isScroll) {
        setNewAddedMsgNum(0);
      }
      setIsScrollTop(scrollBox.scrollTop === 0);
    }
  };

  const handleScrollDown = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };
  // insert 할 때 없어졌으면 좋겠는데..
  return (
    <>
      <div
        className="w-full h-full flex-1 bg-slate-500 p-5 flex flex-col gap-8 overflow-y-auto scroll-smooth"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <ChatSearch isScrollTop={isScrollTop} />

        {hasMore ? <LoadChatMore chatRoomId={chatRoomId} count={count} setCount={setCount} /> : <></>}
        {messages?.map((msg) => {
          if (msg.send_from === user?.id) {
            return <MyChat msg={msg} key={msg.message_id} />;
          } else {
            return <OthersChat msg={msg} key={msg.message_id} />;
          }
        })}
      </div>
      {isScrolling ? (
        newAddedMsgNum === 0 ? (
          <ChatScroll handleScrollDown={handleScrollDown} />
        ) : (
          <NewChatAlert
            newAddedMsgNum={newAddedMsgNum}
            handleScrollDown={handleScrollDown}
            setNewAddedMsgNum={setNewAddedMsgNum}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
};
