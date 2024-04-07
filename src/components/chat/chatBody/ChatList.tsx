'use client';
import { Message } from '(@/types/chatTypes)';
import { ITEM_INTERVAL, getFromTo, getformattedDate } from '(@/utils)';
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
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const ChatList = ({ user }: { user: User | null }) => {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { roomId, chatRoomId, hasMore, setHasMore, messages, setMessages, searchMode, setSearchMode } = chatStore(
    (state) => state
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(true);
  const [newAddedMsgNum, setNewAddedMsgNum] = useState(0);
  const [count, setCount] = useState(1);
  const [searchWord, setSearchWord] = useState('');
  const [doneSearchDivs, setDoneSearchdivs] = useState<(HTMLElement | null)[]>();
  const [searchCount, setSearchCount] = useState(0);
  const [upDownCount, setUpDownCount] = useState(0);

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
    // 스크롤 중이 아니면 처음에 로드될 시 기본적으로 스크롤 다운
    const scrollBox = scrollRef.current;
    if (scrollBox && isScrolling === false) {
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
  }, [messages, isScrolling]);

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

  const fetchMoreMsg = async () => {
    const { from, to } = getFromTo(count, ITEM_INTERVAL);
    const { error, data: newMsgs } = await clientSupabase
      .from('messages')
      .select('*')
      .range(from, to)
      .eq('chatting_room_id', String(chatRoomId))
      .order('created_at', { ascending: false });
    if (error) {
      alert('이전 메세지를 불러오는 데에 오류가 발생했습니다.');
    } else {
      setMessages([...(newMsgs ? newMsgs.reverse() : []), ...messages]);
      if (newMsgs.length < ITEM_INTERVAL + 1) {
        setHasMore(false);
      } else {
        setCount((prev) => prev + 1);
      }
    }
  };
  // 더보기를 누르면 다시 렌더링이 되면서 useEffect가 실행되어 scrollTop이랑 scrollHeight가 같아져야 하는데(스크롤다운) 왜 스크롤이 안내려가지는지?
  // 더보기 눌렀을 때 위치 다시 생각해봐야함
  // 삭제 후 더보기 누르면 제대로 안 불러와짐

  const handleSearch = () => {
    const filteredIds = messages
      .filter((m) => m.message.includes(searchWord))
      .map((messages) => messages.message_id)
      .reverse();

    const idsDivs = filteredIds.map((id) => {
      return document.getElementById(`${messages.find((m) => m.message_id === id)?.message_id}`);
    });
    console.log('IdsDivs =>', idsDivs);
    setDoneSearchdivs(idsDivs);

    if (idsDivs && idsDivs.length >= searchCount + 1) {
      const theDiv = idsDivs[searchCount];
      if (theDiv) {
        theDiv.style.backgroundColor! = 'gray';
        theDiv.scrollIntoView({ block: 'center' });
        setSearchCount((prev) => prev + 1);
        setUpDownCount((prev) => prev + 1);
        // upDownCount는 지금까지 search한 것을 기반으로 되어야 하니까 여기에 종속되어서 +
      }
    } else {
      alert('더 이상 찾을 내용이 없습니다.');
    }
  };

  const handleSearchUp = () => {
    console.log(doneSearchDivs);
    if (doneSearchDivs) {
      console.log(searchCount);
      console.log(upDownCount);
      const theDiv = doneSearchDivs[upDownCount];
      console.log(theDiv);
      if (theDiv) {
        theDiv.style.backgroundColor! = 'gray';
        theDiv.scrollIntoView({ block: 'center' });
      }
      setUpDownCount((prev) => prev + 1);
    }
  };
  const handleSearchDown = () => {
    console.log(doneSearchDivs);
    if (doneSearchDivs) {
      console.log(searchCount);
      console.log(upDownCount);
      const theDiv = doneSearchDivs[upDownCount - 2];
      console.log(theDiv);
      if (theDiv) {
        theDiv.style.backgroundColor! = 'gray';
        theDiv.scrollIntoView({ block: 'center' });
      }
      setUpDownCount((prev) => prev - 1);
    }
  };

  const clearColor = () => {
    doneSearchDivs?.forEach((div) => {
      if (div) div.style.backgroundColor = 'transparent';
    });
  };

  const stopSearch = () => {
    setSearchMode();
    setSearchCount(0);
    setSearchWord('');
    clearColor();
    setDoneSearchdivs([]);
    setUpDownCount(0);
  };

  return (
    <>
      <div
        className="w-full h-full flex-1 bg-slate-500 p-5 flex flex-col gap-8 overflow-y-auto scroll-smooth"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {searchMode ? (
          <div className={`${isScrollTop ? '' : 'absolute'} flex justify-between w-full bg-gray-500`}>
            <div className="flex gap-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex gap-2"
              >
                <input value={searchWord} onChange={(e) => setSearchWord(e.target.value)} autoFocus></input>
                <button>검색</button>
              </form>
              <div>{doneSearchDivs?.length ? `(${doneSearchDivs?.length})` : ''}</div>
            </div>

            <div className="flex gap-2">
              <div>
                <button onClick={handleSearchUp}>
                  <FaChevronUp />
                </button>
                <button onClick={handleSearchDown}>
                  <FaChevronDown />
                </button>
              </div>
              <button onClick={stopSearch}>
                <FaX />
              </button>
            </div>
          </div>
        ) : null}

        {hasMore && <LoadChatMore fetchMoreMsg={fetchMoreMsg} />}
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
