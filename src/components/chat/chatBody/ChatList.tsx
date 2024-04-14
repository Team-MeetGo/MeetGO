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
import { useMyLastMsgs, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import MyChat from './MyChat';
import RememberLastChat from '../chatFooter/RememberLastChat';

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
  const prevMsgsLengthRef = useRef(messages.length);
  const lastDivRefs = useRef(messages);
  const lastMsgId = useMyLastMsgs(user?.id!, chatRoomId);
  // console.log('messages => ', messages);

  console.log('isScrolling =>', isScrolling);
  console.log('lastMsgId =>', lastMsgId);
  console.log('lastCheckedDiv =>', lastCheckedDiv);
  // console.log('찐 마지막 메세지 =>', messages[messages.length - 1].message_id);

  // "messages" table Realtime INSERT, DELETE 구독로직
  useEffect(() => {
    if (roomId && chatRoomId) {
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

  // 여기까지 읽으셨습니다
  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (scrollBox && !isScrolling) {
      console.log('0');
      // 처음에 로드 시 스크롤 중이 아닐 때
      let ref = lastDivRefs.current.find((ref) => ref.message_id === lastMsgId);
      let lastDiv = ref && ref.current;

      if (lastMsgId && lastMsgId !== messages[messages.length - 1].message_id) {
        console.log('1');
        // 이전에 저장된 마지막 메세지가 있으면 그 메세지 강조처리
        // let lastDiv = document.getElementById(`${lastMsgId[0].last_msg_id}`);
        if (lastDiv) {
          console.log('2');
          setLastCheckedDiv(lastDiv);
          styleHere(lastDiv);
        }
      }
      // else if (!lastMsgId || !lastDiv) {
      //   console.log('3');
      //   // 이전에 저장된 마지막 메세지가 없거나, DB에 저장된 메세지는 있는데 화면에 없거나, 새로운 메세지가 추가될 때 그냥 스크롤 다운
      // }
      else {
        console.log('*');
        scrollBox.scrollTop = scrollBox.scrollHeight;
      }
    }
  }, []);

  // 스크롤 다운
  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (lastCheckedDiv && !isScrolling) {
      console.log('5');
      setCheckedLastMsg(true);
      lastCheckedDiv.style.backgroundColor = '';
    }
    // if (scrollBox && !isScrolling) {
    // 처음에 로드 시 스크롤 중이 아닐 때
    // let ref = lastDivRefs.current.find((ref) => ref.message_id === lastMsgId);
    // let lastDiv = ref && ref.current;
    // if (!lastMsgId || prevMsgsLengthRef.current !== messages.length || !lastDiv) {
    //   console.log('3');
    //   // 이전에 저장된 마지막 메세지가 없거나, DB에 저장된 메세지는 있는데 화면에 없거나, 새로운 메세지가 추가될 때 그냥 스크롤 다운
    //   scrollBox.scrollTop = scrollBox.scrollHeight;
    //   prevMsgsLengthRef.current = messages.length;
    // }
    // else {
    if (checkedLastMsg && prevMsgsLengthRef.current !== messages.length) {
      scrollBox.scrollTop = scrollBox.scrollHeight;
      prevMsgsLengthRef.current = messages.length;
    }
    // console.log('4');
    // 이전에 저장된 마지막 메세지가 있고 그게 강조처리 되어있다가, 스크롤다운(마지막 메세지를 확인)되면 투명으로 변경

    // }
    // }
  }, [messages, isScrolling]);

  // 스크롤 이벤트가 발생할 때
  const handleScroll = () => {
    const scrollBox = scrollRef.current;
    if (scrollBox) {
      const isScroll = scrollBox.scrollTop < scrollBox.scrollHeight - scrollBox.clientHeight - 5;
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

  const styleHere = (lastDiv: HTMLElement) => {
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
      <RememberLastChat />
    </>
  );
};

export default ChatList;
