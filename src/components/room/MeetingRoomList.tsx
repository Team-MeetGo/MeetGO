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
        {/* <MeetingRoomForm /> */}
        <MeetingRoom list={meetingRoomList} />
        <MeetingRoom list={chattingRoomList} />
      </article>
    </>
  );
}

export default MeetingRoomList;
