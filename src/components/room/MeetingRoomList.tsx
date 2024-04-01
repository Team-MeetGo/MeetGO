'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { useEffect, useState } from 'react';

import type { Database } from '(@/types/database.types)';

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
        {meetingRoomList.map((room) => (
          <main key={room.room_id} className="w-full h-32 border-red-600 border-8">
            <div> {room.room_title} </div>
            <div> {room.feature} </div>
            <div> {room.location} </div>
            <div> {room.room_status} </div>
            <div> {room.member_number}</div>
            {/* <DeleteMeetingRoom id={room.room_id} />
          <EditMeetingRoom /> */}
          </main>
        ))}
        {chattingRoomList.map((room) => (
          <main key={room.room_id} className="w-full h-32 border-red-600 border-8">
            <div> {room.room_title} </div>
            <div> {room.feature} </div>
            <div> {room.location} </div>
            <div> {room.room_status} </div>
            <div> {room.member_number}</div>
            {/* <DeleteMeetingRoom id={room.room_id} />
          <EditMeetingRoom /> */}
          </main>
        ))}
      </article>
    </>
  );
}

export default MeetingRoomList;
