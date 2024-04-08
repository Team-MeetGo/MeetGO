'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { useEffect, useState } from 'react';
import MeetingRoom from './MeetingRoom';
import { userStore } from '(@/store/userStore)';

import type { Database, Tables } from '(@/types/database.types)';

function MeetingRoomList() {
  type MeetingRoom = Database['public']['Tables']['room']['Row'];
  const { user, isLoggedIn } = userStore((state) => state);
  const [meetingRoomList, setMeetingRoomList] = useState<MeetingRoom[]>();
  const [myMeetingRoomList, setMyMeetingRoomList] = useState<MeetingRoom[]>();
  const [chattingRoomList, setChattingRoomList] = useState<MeetingRoom[]>();
  const { getMeetingRoom, getChattingRoom, getMyRoom } = meetingRoomHandler();

  useEffect(() => {
    const getMeetingRoomList = async () => {
      if (!user) return;
      const meetingroom = (await getMeetingRoom()) as MeetingRoom[];
      const myRoomWithId = (await getMyRoom(user[0].user_id)) as any;
      const myRoom = myRoomWithId.map((sample: any) => sample.room);
      const chattingroom = (await getChattingRoom()) as MeetingRoom[];
      setMeetingRoomList(meetingroom);
      setChattingRoomList(chattingroom);
      setMyMeetingRoomList(myRoom);
    };
    getMeetingRoomList();
  }, [user]);
  if (meetingRoomList === undefined || !meetingRoomList) return;
  if (myMeetingRoomList === undefined || !myMeetingRoomList) return;
  if (chattingRoomList === undefined || !chattingRoomList) return;

  return (
    <>
      <article>
        <div>
          <div>========여기부터는 내가 참여한 방========</div>
          {!user || user === null ? (
            <div> 로그인하시면 참여하실 수 있습니다. </div>
          ) : (
            <div className="gap-2 grid grid-cols-1 sm:grid-cols-3 m-8">
              {myMeetingRoomList.map((room) => (
                <MeetingRoom key={room.room_id} room={room} />
              ))}
            </div>
          )}
        </div>
        <div>========여기부터는 공개방========</div>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-8">
          {meetingRoomList.map((room) => (
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
