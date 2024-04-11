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
  const [count, setCount] = useState(1);
  const [newAddedMsgNum, setNewAddedMsgNum] = useState(0);
  const [lastCheckedDiv, setLastCheckedDiv] = useState<HTMLElement | null>();
  const [checkedLastMsg, setCheckedLastMsg] = useState(false);
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.roomId;
  const lastMsgId = useMyLastMsgs(user?.id!, chatRoomId);

  useEffect(() => {
    if (roomId && chatRoomId) {
      // "messages" table Realtime INSERT, DELETE 구독로직
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
    if (scrollBox && !isScrolling) {
      // 처음에 로드 시 스크롤 중이 아닐 때
      if (lastMsgId && lastMsgId.length) {
        // 이전에 저장된 마지막 메세지가 있으면 그 메세지 강조처리
        let lastDiv = document.getElementById(`${lastMsgId[0].last_msg_id}`);
        if (lastDiv) {
          setLastCheckedDiv(lastDiv);
          lastDiv.style.backgroundColor = 'pink';
          lastDiv.scrollIntoView({ block: 'center' });
          setCheckedLastMsg(true);
        }
      }
    }
    // 처음 로드 시에만 실행(의존성배열 = [])
  }, []);

  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (scrollBox && !isScrolling) {
      // 처음에 로드 시 스크롤 중이 아닐 때
      if (!lastMsgId || !lastMsgId?.length) {
        // 이전에 저장된 마지막 메세지가 없으면 그냥 스크롤 다운
        scrollBox.scrollTop = scrollBox.scrollHeight;
      } else {
        // 이전에 저장된 마지막 메세지가 있고 그게 강조처리 되어있다가, 스크롤다운(마지막 메세지를 확인)되면 투명으로 변경
        if (checkedLastMsg && lastCheckedDiv) {
          lastCheckedDiv.style.backgroundColor = 'transparent';
        }
      }
    }
  }, [messages, isScrolling]);

  // 마지막으로 읽은 메세지 기억하기
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

  //   useEffect(() => {
  //     return () => {
  //       // 현재 나누는 메세지가 있을 때
  //       if (messages.length) {
  //         // 이전에 저장된 마지막 메세지가 있으면 현재 메세지 중 마지막 걸로 업데이트, 없으면 현재 메세지 중 마지막 메세지 추가하기
  //         lastMsgId?.length ? mutateToUpdate() : mutateToAdd();
  //       }
  //     };
  //     // 주소가 바뀔 때만 감지해서 저장 또는 업데이트
  //   }, [pathname]);

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
