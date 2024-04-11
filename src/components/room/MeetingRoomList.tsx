'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { useRecruitingMyroomQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { useCallback, useEffect, useState } from 'react';
import { IoMdRefresh } from 'react-icons/io';
import MeetingRoom from './MeetingRoom';
import MeetingRoomForm from './MeetingRoomForm';

import type { MeetingRoomType, MeetingRoomTypes } from '(@/types/roomTypes)';
import type { User } from '@supabase/supabase-js';
import { userStore } from '(@/store/userStore)';
import { useMyChatRoomIdsQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { clientSupabase } from '(@/utils/supabase/client)';

function MeetingRoomList({ user }: { user: User | null }) {
  const [page, setPage] = useState(1);
  const result = useRecruitingMyroomQuery(user ? user.id : '');
  const recruitingRoom = result[0] as MeetingRoomTypes;
  const myRoom = result[1]?.map((sample: any) => sample.room);

  const [chattingRoomList, setChattingRoomList] = useState<MeetingRoomTypes>();
  const { getChattingRoom } = meetingRoomHandler();

  const myChatRoomIds = useMyChatRoomIdsQuery(user?.id!);
  console.log(myChatRoomIds);
  const [msgCountArr, setMsgCountArr] = useState(Array(myChatRoomIds.length).fill(0));
  console.log(msgCountArr);

  const handlePlusMsgCount = useCallback(
    (idx: number) => {
      const newCountArr = [...msgCountArr];
      newCountArr[idx] = msgCountArr[idx] + 1;
      setMsgCountArr(newCountArr);
    },
    [msgCountArr]
  );

  const clearMsgCount = (idx: number) => {
    const newCountArr = [...msgCountArr];
    newCountArr[idx] = 0;
    setMsgCountArr(newCountArr);
  };

  useEffect(() => {
    myChatRoomIds.forEach((id, idx) => {
      const channel = clientSupabase
        .channel(id)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chatting_room_id=eq.${id}`
          },
          (payload) => {
            console.log('payload', payload);
            handlePlusMsgCount(idx);
          }
        )
        .subscribe();

      return () => {
        clientSupabase.removeChannel(channel);
      };
    });
  }, [myChatRoomIds, handlePlusMsgCount]);

  useEffect(() => {
    const getMeetingRoomList = async () => {
      const chattingroom = (await getChattingRoom()) as MeetingRoomTypes;
      setChattingRoomList(chattingroom);
    };
    getMeetingRoomList();
  }, []);
  if (chattingRoomList === undefined) return;

  const onReload = () => {
    window.location.reload();
  };

  // meetingRoomList 중에서 myRoomList가 없는 것을 뽑아내기
  const otherRooms = recruitingRoom?.filter(function (room: MeetingRoomType) {
    const foundItem = myRoom?.find((r) => r.room_id === room?.room_id);
    if (foundItem) {
      return false;
    } else {
      return true;
    }
  });

  const nextPage = () => {
    if (myRoom && myRoom.length / 3 < page) {
      return setPage(1);
    }
    setPage((page) => page + 1);
  };
  const beforePage = () => {
    if (page < 2) {
      return setPage(1);
    }
    setPage((page) => page - 1);
  };
  console.log('otherRooms', otherRooms);
  console.log('myRoom', myRoom);

  return (
    <article>
      <button onClick={() => handlePlusMsgCount(1)}>플러스</button>
      <button onClick={() => clearMsgCount(1)}>clear</button>
      <header className="h-72">
        <div className="flex flex-row justify-between">
          <div className="m-4 text-xl	font-semibold">들어가 있는 방</div>
          <div className="flex flex-row align-middle justify-center">
            <MeetingRoomForm />
            <button
              onClick={() => {
                onReload();
              }}
            >
              <IoMdRefresh className="h-8 w-8 m-2" />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-row justify-center">
          <button onClick={() => beforePage()}> - </button>
          {
            <div className="gap-8 grid grid-cols-3 m-4 w-full px-4">
              {myRoom?.map((room, index) => {
                if (index < 3 * page && index >= 3 * (page - 1))
                  return (
                    <div key={index}>
                      {index}
                      {/* 새로운 메세지 수! - ㅇㅈ */}
                      <div className="flex gap-2">
                        <h1>새로운 메세지 수</h1>
                        {msgCountArr[index]}
                      </div>
                      <MeetingRoom room={room} />
                    </div>
                  );
              })}
            </div>
          }
          <button onClick={() => nextPage()}> + </button>
        </div>
      </header>
      <div className="m-4 text-xl	font-semibold">모집중</div>
      <div className="gap-2 grid grid-cols-3 m-4 w-100%">
        {otherRooms?.map((room) => (
          <MeetingRoom key={room?.room_id} room={room} />
        ))}
      </div>
      {/* 이 부분은 채팅룸이 형성된 전체 방으로, 마지막에는 삭제 예정입니다. */}
      <div>========여기부터는 채팅방========</div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-8">
        {chattingRoomList?.map((room) => (
          <MeetingRoom key={room?.room_id} room={room} />
        ))}
      </div>
    </article>
  );
}

export default MeetingRoomList;
