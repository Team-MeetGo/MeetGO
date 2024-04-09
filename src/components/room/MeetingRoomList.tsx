'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { useRecruitingMyroomQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { useEffect, useState } from 'react';
import { IoMdRefresh } from 'react-icons/io';
import MeetingRoom from './MeetingRoom';
import MeetingRoomForm from './MeetingRoomForm';
import { useRouter } from 'next/navigation';

import type { MeetingRoomType, MeetingRoomTypes } from '(@/types/roomTypes)';
import type { User } from '@supabase/supabase-js';

function MeetingRoomList({ user }: { user: User | null }) {
  const [page, setPage] = useState(1);
  const result = useRecruitingMyroomQuery(user ? user?.id : null);
  const recruitingRoom = result[0] as MeetingRoomTypes;
  const myRoom = result[1]?.map((sample: any) => sample.room);

  const [chattingRoomList, setChattingRoomList] = useState<MeetingRoomTypes>();
  const { getChattingRoom } = meetingRoomHandler();
  useEffect(() => {
    const getMeetingRoomList = async () => {
      const chattingroom = (await getChattingRoom()) as MeetingRoomTypes;
      setChattingRoomList(chattingroom);
    };
    getMeetingRoomList();
  }, []);
  if (chattingRoomList === undefined) return;

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
    setPage((page) => page + 1);
  };
  const beforePage = () => {
    if (page < 2) {
      setPage(1);
    }
    setPage((page) => page - 1);
  };
  console.log('otherRooms', otherRooms);
  console.log('myRoom', myRoom);
  return (
    <Suspense fallback="미팅룸들 나열중~~">
      <article>
        <header className="h-72">
          <div className="flex flex-row justify-between">
            <div className="m-4 text-xl	font-semibold">들어가 있는 방</div>
            <div className="flex flex-row align-middle justify-center">
              <MeetingRoomForm />
              <button>
                <IoMdRefresh className="h-8 w-8 m-2" />
              </button>
            </div>
          </div>
          <div className="w-full flex flex-row justify-center">
            <button onClick={() => beforePage()}> - </button>
            {
              <div className="gap-8 grid grid-cols-3 m-4 w-full px-4">
                {myRoom?.map((room, index) => (
                  <div
                    key={index}
                    className={`room ${
                      page < 1 || myRoom.length / 3 + 1 < page
                        ? setPage(1)
                        : 3 * page - 1 > index && 3 * page - 3 < index && 'hidden'
                    }`}
                  >
                    {page * 3 + 1} 시작
                    {page * 3 - 1} 끝{index}
                    <MeetingRoom room={room} />
                  </div>
                ))}
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
    </Suspense>
  );
}

export default MeetingRoomList;
