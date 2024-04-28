'use client';
import { Message } from '@/types/chatTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ChatScroll from './ChatScroll';
import NewChatAlert from './NewChatAlert';
import LoadChatMore from './LoadChatMore';
import { chatStore } from '@/store/chatStore';
import OthersChat from './OthersChat';
import ChatSearch from './ChatSearch';
import { useMsgsQuery, useMyLastMsgs, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import MyChat from './MyChat';
import RememberLastChat from '../chatFooter/RememberLastChat';
import { isNextDay, showingDate } from '@/utils/utilFns';
import { useQueryClient } from '@tanstack/react-query';
import { MSGS_QUERY_KEY } from '@/query/chat/chatQueryKeys';

const ChatList = ({ user, chatRoomId }: { user: User | null; chatRoomId: string }) => {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { hasMore } = chatStore((state) => state);
  const messages = useMsgsQuery(chatRoomId);
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.room_id;
  const lastMsgId = useMyLastMsgs(user?.id!, chatRoomId);
  const queryClient = useQueryClient();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(true);
  const [count, setCount] = useState(1);
  const [newAddedMsgNum, setNewAddedMsgNum] = useState(0);
  const [lastCheckedDiv, setLastCheckedDiv] = useState<HTMLElement | null>();
  const [checkedLastMsg, setCheckedLastMsg] = useState(false);
  const prevMsgsLengthRef = useRef(messages?.length);
  const lastDivRefs = useRef(messages);

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
          async (payload) => {
            if (payload) {
              await queryClient.invalidateQueries({ queryKey: [MSGS_QUERY_KEY, chatRoomId] });
              const includingNew: Message[] | undefined = queryClient.getQueryData([MSGS_QUERY_KEY, chatRoomId]);
              const lastIdx = messages && includingNew?.map((i) => i.message_id).indexOf(messages[0]?.message_id);
              messages &&
                includingNew &&
                (await queryClient.setQueryData(
                  [MSGS_QUERY_KEY, chatRoomId],
                  [...includingNew].slice(lastIdx ?? 0, includingNew.length)
                ));
              if (isScrolling) {
                setNewAddedMsgNum((prev) => (prev += 1));
              }
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'messages', filter: `chatting_room_id=eq.${chatRoomId}` },
          async (payload) => {
            if (payload) {
              await queryClient.invalidateQueries({ queryKey: [MSGS_QUERY_KEY, chatRoomId] });
              messages &&
                queryClient.setQueryData(
                  [MSGS_QUERY_KEY, chatRoomId],
                  messages.filter((msg) => msg.message_id !== payload.old.message_id)
                );
            }
          }
        )
        .subscribe();
      return () => {
        clientSupabase.removeChannel(channel);
      };
    }
  }, [messages, isScrolling, roomId, chatRoomId]);

  // 여기까지 읽으셨습니다(처음 마운트 시에만 실행)
  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (scrollBox && messages) {
      // DB에 마지막 메세지로 저장된 메세지와 id가 동일한 div 가 있다면 강조처리
      const lastMsgValue = lastDivRefs?.current?.find((ref) => ref.message_id === lastMsgId);
      const lastDiv = lastMsgValue && (lastMsgValue as any).current;
      if (lastMsgId && lastMsgId !== messages[messages.length - 1].message_id && lastDiv) {
        setLastCheckedDiv(lastDiv);
        styleHere(lastDiv);
        setIsScrolling(true);
      } else {
        // 그 외의 경우 기본적으로 스크롤 다운
        scrollBox.scrollTop = scrollBox.scrollHeight;
        setCheckedLastMsg(true);
      }
    }
  }, [lastMsgId]);

  // 스크롤 다운
  useEffect(() => {
    const scrollBox = scrollRef.current;
    // 이전 메세지가 화면에 있을 때
    if (!isScrolling && messages) {
      if (lastCheckedDiv) {
        // 강조처리를 보고난 뒤 스크롤을 맨 아래로 내리면 강조처리 해제
        if (!checkedLastMsg) {
          setCheckedLastMsg(true);
          lastCheckedDiv.style.backgroundColor = '';
        } else if (checkedLastMsg && prevMsgsLengthRef.current !== messages.length) {
          // 강조처리를 보고나야만 타인으로부터 새로운 메세지가 추가되었을 때 스크롤 다운되도록
          scrollBox.scrollTop = scrollBox.scrollHeight;
          prevMsgsLengthRef.current = messages.length;
        }
      } else if (prevMsgsLengthRef.current !== messages?.length || count === 0) {
        // 이전 메세지가 화면에 없고 + 새로운 메세지가 추가되면 스크롤 다운이 따라가도록
        scrollBox.scrollTop = scrollBox.scrollHeight;
        prevMsgsLengthRef.current = messages.length;
      }
    }
  }, [messages, isScrolling]);

  // 스크롤 이벤트가 발생할 때
  const handleScroll = () => {
    const scrollBox = scrollRef.current;
    if (scrollBox) {
      // 5 상수화
      const isScroll = scrollBox.scrollTop < scrollBox.scrollHeight - scrollBox.clientHeight - 5;
      setIsScrolling(isScroll);
      if (!isScroll) {
        setNewAddedMsgNum(0);
      }
      setIsScrollTop(scrollBox.scrollTop === 0);
    }
  };

  const handleScrollDown = () => {
    setCheckedLastMsg(true);
    if (lastCheckedDiv) lastCheckedDiv.style.backgroundColor = '';
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const styleHere = (lastDiv: HTMLElement) => {
    lastDiv.style.backgroundColor = '#F2EAFA';
    lastDiv.style.borderRadius = '5px';
    lastDiv.scrollIntoView({ block: 'center' });
  };

  return (
    <>
      <div
        className={'w-full h-full flex-1 p-[16px] flex flex-col gap-[8px] overflow-y-auto scroll-smooth'}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <ChatSearch isScrollTop={isScrollTop} />
        {hasMore ? <LoadChatMore chatRoomId={chatRoomId} count={count} setCount={setCount} /> : <></>}
        {messages &&
          messages.map((msg, idx) => (
            <div key={msg.message_id} className="w-full">
              {isNextDay(idx, messages) ? (
                <div className="flex justify-center my-[16px] bg-[#D4D4D8] mx-auto w-[150px] px-[16px] py-[6px] rounded-full text-white">
                  <p className="font-extralight tracking-wide text-sm">{showingDate(msg.created_at)}</p>
                </div>
              ) : null}
              {msg.send_from === user?.id ? (
                <MyChat msg={msg} idx={idx} lastDivRefs={lastDivRefs} />
              ) : (
                <OthersChat msg={msg} idx={idx} lastDivRefs={lastDivRefs} />
              )}
              {messages &&
              lastMsgId &&
              lastMsgId !== messages[messages.length - 1].message_id &&
              lastMsgId === msg.message_id &&
              isScrolling &&
              !checkedLastMsg ? (
                <div className={`flex ${msg.send_from === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <p>여기까지 읽으셨습니다.</p>
                </div>
              ) : null}
            </div>
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
