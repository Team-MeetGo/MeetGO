'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { useEffect, useState } from 'react';

import type { Database } from '(@/types/database.types)';
import MeetingRoom from './MeetingRoom';

function MeetingRoomList() {
  type MeetingRoom = Database['public']['Tables']['room']['Row'];
  const [meetingRoomList, setMeetingRoomList] = useState<MeetingRoom[]>();
  const [chattingRoomList, setChattingRoomList] = useState<MeetingRoom[]>();
  const { getMeetingRoom, getChattingRoom } = meetingRoomHandler();

  useEffect(() => {
    const getMeetingRoomList = async () => {
      const meetingroom = (await getMeetingRoom()) as MeetingRoom[];
      const chattingroom = (await getChattingRoom()) as MeetingRoom[];
      setMeetingRoomList(meetingroom);
      setChattingRoomList(chattingroom);
    };
    getMeetingRoomList();
  }, []);
  if (meetingRoomList === undefined || !meetingRoomList) return;
  if (chattingRoomList === undefined || !chattingRoomList) return;

  return (
    <>
      <article>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-8">
          {meetingRoomList.map((room) => (
            <MeetingRoom key={room.room_id} room={room} />
          ))}
        </div>
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
