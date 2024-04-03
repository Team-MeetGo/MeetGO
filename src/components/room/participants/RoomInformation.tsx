'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { Database } from '(@/types/database.types)';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';

type MeetingRoomType = Database['public']['Tables']['room']['Row'];

function RoomInformation({ roomId }: { roomId: UUID }) {
  const [room, setRoom] = useState<MeetingRoomType[]>();
  const { getRoomInformation } = meetingRoomHandler();
  useEffect(() => {
    const getSingleRoom = async () => {
      const singleRoom = await getRoomInformation(roomId);
      if (!singleRoom) {
        return;
      }
      setRoom(singleRoom);
    };
    getSingleRoom();
  }, []);
  if (!room) return;
  const { feature, location, member_number, room_title } = room[0];
  return (
    <div className="m-8 text-center">
      <div>{room_title}</div>
      <div>{member_number}</div>
      <div>{location}</div>
      <div>{feature}</div>
    </div>
  );
}

export default RoomInformation;
