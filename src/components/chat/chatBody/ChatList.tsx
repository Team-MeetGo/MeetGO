'use client';
import { Message } from '(@/types/chatTypes)';
import { getformattedDate } from '(@/utils)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ChatScroll from './ChatScroll';
import NewChatAlert from './NewChatAlert';
import LoadChatMore from './LoadChatMore';
import ChatDeleteDropDown from './ChatDeleteDropDown';
import { chatStore } from '(@/store/chatStore)';
import { Tooltip } from '@nextui-org/react';
import OthersChat from './OthersChat';
import ChatSearch from './ChatSearch';
import { useMyLastMsgs, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { usePathname } from 'next/navigation';
import { useAddLastMsg, useUpdateLastMsg } from '(@/hooks/useMutation/useChattingMutation)';

const ChatList = ({ user, chatRoomId }: { user: User | null; chatRoomId: string }) => {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { hasMore, messages, setMessages } = chatStore((state) => state);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(true);
  const [newAddedMsgNum, setNewAddedMsgNum] = useState(0);
  const [count, setCount] = useState(1);
  const [lastCheckedDiv, setLastCheckedDiv] = useState<HTMLElement | null>();

  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.roomId;

  const lastMsgId = useMyLastMsgs(user?.id!, chatRoomId);
  console.log(lastMsgId);

  const rememberLastMsg = () => {
    const lastDiv = document.getElementById(` ${messages[messages.length - 1].message_id}`);
  };

  // useEffect(() => {
  //   if (lastMsgId) setLastCheckedDiv(document.getElementById(`${lastMsgId[0].last_msg_id}`));
  // }, []);

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

  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (scrollBox && isScrolling === false) {
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
  }, [isScrolling]);

  // 처음에 로드될 시 스크롤 조정
  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (lastMsgId && lastMsgId.length) {
      let lastDiv = document.getElementById(`${lastMsgId[0].last_msg_id}`);
      // if (lastCheckedDiv) {
      if (lastDiv) {
        setLastCheckedDiv(lastDiv);
        if (scrollBox && isScrolling === false && lastCheckedDiv) {
          lastCheckedDiv.style.backgroundColor = 'pink';
          lastCheckedDiv.scrollIntoView({ block: 'center' });
        }
        if (isScrolling) {
          console.log('이제 스크롤중');
          // setLastCheckedDiv(null);
          lastDiv.style.backgroundColor = 'transparent';
          lastDiv.scrollIntoView(false);
        }
      }
    }
    // else if (isScrolling) setLastCheckedDiv(null);
    // } else {
    //   if (scrollBox && isScrolling === false) {
    //     scrollBox.scrollTop = scrollBox.scrollHeight;
    //   }
    // }
    //   if (scrollBox && isScrolling === false) {
    //     // 스크롤 중이 아닐 때,
    //     if (lastMsgId.length && lastDiv) {
    //       // 저장된 마지막 메세지가 있고 + 그 div가 뷰포트에 있으면
    //       if (lastCheckedDiv) lastCheckedDiv.style.backgroundColor = 'pink';
    //       lastDiv.scrollIntoView({ block: 'center' });
    //       if (isScrolling) setLastCheckedDiv(null);
    //     } else {
    //       // 저장된 마지막 메세지가 없거나 + 그 div가 뷰포트에 없으면
    //       scrollBox.scrollTop = scrollBox.scrollHeight;
    //     }
    //   }
    //   if (isScrolling && lastDiv) {
    //     // 그 div가 뷰포트에 있는데 스크롤을 하면
    //   }
    // } else {
    //   if (scrollBox && isScrolling === false) {
    //     scrollBox.scrollTop = scrollBox.scrollHeight;
    //   }
  }, [isScrolling, lastCheckedDiv]);

  const pathname = usePathname();

  const { mutate: mutateToUpdate } = useUpdateLastMsg(
    user?.id as string,
    chatRoomId as string,
    messages && messages.length > 0 ? messages[messages.length - 1].message_id : undefined
  );

  const { mutate: mutateToAdd } = useAddLastMsg(
    chatRoomId,
    user?.id as string,
    messages && messages.length > 0 ? messages[messages.length - 1].message_id : undefined
  );

  // 마지막으로 읽은 메세지 기억하기
  useEffect(() => {
    return () => {
      if (lastMsgId?.length) {
        // 이전에 저장된 마지막 메세지가 있을 때
        if (messages.length) {
          // 채팅방에 메세지가 있으면
          mutateToUpdate(); // 마지막 메세지 업데이트
        }
      } else {
        // 이전에 저장된 마지막 메세지가 없을 때(처음 채팅방이 시작되었을 때)
        mutateToAdd();
      }
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

export default ChatList;

const MyChat = ({ msg }: { msg: Message }) => {
  return (
    <div id={msg.message_id} className="flex gap-4 ml-auto">
      <div className="w-80 h-24 flex flex-col gap-1">
        <div className="font-bold ml-auto">{msg.nickname}</div>
        <div className="flex gap-2 ml-auto">
          <ChatDeleteDropDown msg={msg} />
          <div className="border rounded-md py-3 px-5 h-full text-right">{msg.message}</div>
        </div>
        <div className="mt-auto text-slate-100 text-xs ml-auto">
          <p>{getformattedDate(msg.created_at)}</p>
        </div>
      </div>
      <Tooltip content="여기 컴포넌트">
        <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">{msg.avatar}</div>
      </Tooltip>
    </div>
  );
};
