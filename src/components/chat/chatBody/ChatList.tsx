'use client';
import { Message } from '(@/types/chatTypes)';
import { getformattedDate, showingDate } from '(@/utils)';
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
  console.log('checkedLastMsg =>', checkedLastMsg);
  console.log('메세지 있어? =>', messages.length > 0);
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.roomId;

  const prevMsgsLengthRef = useRef(messages.length);
  const lastDivRefs = useRef(messages);

  const lastMsgId = useMyLastMsgs(user?.id!, chatRoomId);

  console.log('DB의 마지막 메세지 =>', lastMsgId);
  console.log('찐 마지막 메세지 =>', messages[messages.length - 1].message_id);

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
      if (lastMsgId && lastMsgId !== messages[messages.length - 1].message_id) {
        // 이전에 저장된 마지막 메세지가 있으면 그 메세지 강조처리
        // let lastDiv = document.getElementById(`${lastMsgId[0].last_msg_id}`);
        let ref = lastDivRefs.current.find((ref) => ref.message_id === lastMsgId);
        let lastDiv = ref && ref.current;
        if (lastDiv) {
          setLastCheckedDiv(lastDiv);
          makeHereText(lastDiv);
          // setCheckedLastMsg(true);
        }
      } else {
        scrollBox.scrollTop = scrollBox.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (scrollBox && !isScrolling) {
      // 처음에 로드 시 스크롤 중이 아닐 때
      if (!lastMsgId || prevMsgsLengthRef.current !== messages.length) {
        // 이전에 저장된 마지막 메세지가 없으면 그냥 스크롤 다운
        scrollBox.scrollTop = scrollBox.scrollHeight;
        prevMsgsLengthRef.current = messages.length;
      } else {
        // 이전에 저장된 마지막 메세지가 있고 그게 강조처리 되어있다가, 스크롤다운(마지막 메세지를 확인)되면 투명으로 변경
        if (lastCheckedDiv) {
          setCheckedLastMsg(true);
          lastCheckedDiv.style.display = 'none';
        }
      }
    }
  }, [messages, isScrolling]);

  // 마지막으로 읽은 메세지 기억하기
  useEffect(() => {
    console.log('useEffect 안 실행되는 건 맞아?');
    // 현재 나누는 메세지가 있을 때

    return () => {
      console.log('실행은 되니');
      console.log(checkedLastMsg && messages.length);
      // if (checkedLastMsg && messages.length) {
      // 이전에 저장된 마지막 메세지가 있으면 현재 메세지 중 마지막 걸로 업데이트, 없으면 현재 메세지 중 마지막 메세지 추가하기
      lastMsgId ? mutateToUpdate() : mutateToAdd();
      // }
    };
  }, []);

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

  const makeHereText = (lastDiv: HTMLElement) => {
    lastDiv.style.backgroundColor = 'pink';
    lastDiv.scrollIntoView({ block: 'center' });
  };

  return (
    <>
      <div
        className="w-full h-full flex-1 bg-slate-500 p-5 flex flex-col gap-8 overflow-y-auto scroll-smooth"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <ChatSearch isScrollTop={isScrollTop} />

        {hasMore ? <LoadChatMore chatRoomId={chatRoomId} count={count} setCount={setCount} /> : <></>}
        {messages?.map((msg, idx) => (
          <>
            {idx >= 1 && new Date(msg.created_at).getDate() > new Date(messages[idx - 1].created_at).getDate() ? (
              <div className="mx-auto">
                <p>{showingDate(msg.created_at)}</p>
              </div>
            ) : null}
            {msg.send_from === user?.id ? (
              <MyChat msg={msg} key={msg.message_id} idx={idx} lastDivRefs={lastDivRefs} />
            ) : (
              <OthersChat msg={msg} key={msg.message_id} idx={idx} lastDivRefs={lastDivRefs} />
            )}
            {lastMsgId &&
            lastMsgId !== messages[messages.length - 1].message_id &&
            lastMsgId === msg.message_id &&
            isScrolling &&
            !checkedLastMsg ? (
              <div className={`flex ${msg.send_from === user?.id ? 'ml-auto' : 'mr-auto'}`}>
                <p>여기까지 읽으셨습니다.</p>
              </div>
            ) : null}
          </>
        ))}
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

const MyChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  return (
    <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-4 ml-auto">
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
