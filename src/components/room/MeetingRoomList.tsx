'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { userStore } from '(@/store/userStore)';
import { useEffect, useState } from 'react';
import MeetingRoom from './MeetingRoom';

import type { Database } from '(@/types/database.types)';
import { useRouter } from 'next/navigation';
import { IoMdRefresh } from 'react-icons/io';
import MeetingRoomForm from './MeetingRoomForm';

function MeetingRoomList() {
  type MeetingRoom = Database['public']['Tables']['room']['Row'];
  const router = useRouter();
  const { user, isLoggedIn } = userStore((state) => state);
  const [meetingRoomList, setMeetingRoomList] = useState<MeetingRoom[]>();
  const [myRoomList, setMyRoomList] = useState<MeetingRoom[]>();
  const [chattingRoomList, setChattingRoomList] = useState<MeetingRoom[]>();
  const { getMeetingRoom, getChattingRoom, getMyRoom } = meetingRoomHandler();

  useEffect(() => {
    const getMeetingRoomList = async () => {
      const meetingroom = (await getMeetingRoom()) as MeetingRoom[];
      const myRoomWithId = (await getMyRoom(user[0].user_id)) as any;
      const myRoom = myRoomWithId.map((sample: any) => sample.room);
      const chattingroom = (await getChattingRoom()) as MeetingRoom[];
      setMeetingRoomList(meetingroom);
      setChattingRoomList(chattingroom);
      setMyRoomList(myRoom); //여러개 참여하면 여러개입니다 네네 ㄴ
    };
    getMeetingRoomList();
  }, [user]);

  if (meetingRoomList === undefined) return;
  if (chattingRoomList === undefined) return;

  // meetingRoomList 중에서 myRoomList가 없는 것을 뽑아내기
  const otherRooms = meetingRoomList.filter(function (room: MeetingRoom) {
    const foundItem = myRoomList?.find((r) => r.room_id === room.room_id);
    if (foundItem) {
      return false;
    } else {
      return true;
    }
  });

  console.log('myRoomList', myRoomList);
  console.log('otherRooms ==> ', otherRooms);
  return (
    <>
      <article>
        <div>
          <div className="flex flex-row justify-between">
            <div className="m-4 text-xl	font-semibold">들어가 있는 방</div>
            <div className="flex flex-row align-middle justify-center">
              <MeetingRoomForm />
              <button onClick={() => router.refresh()}>
                <IoMdRefresh className="h-8 w-8 m-2" />
              </button>
            </div>
          </div>
          {
            <div className="gap-2 grid grid-cols-3 m-4 w-100%">
              {myRoomList?.map((room) => (
                <MeetingRoom key={room.room_id} room={room} />
              ))}
            </div>
          }
        </div>
        <div className="m-4 text-xl	font-semibold">모집중</div>
        <div className="gap-2 grid grid-cols-3 m-4 w-100%">
          {otherRooms?.map((room) => (
            <MeetingRoom key={room.room_id} room={room} />
          ))}
        </div>
        {/* 이 부분은 채팅룸이 형성된 전체 방으로, 마지막에는 삭제 예정입니다. */}
        <div>========여기부터는 채팅방========</div>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-8">
          {chattingRoomList.map((room) => (
            <MeetingRoom key={room.room_id} room={room} />
          ))}
        </div>
      </article>
    </>
  );
}

export default MeetingRoomList;
