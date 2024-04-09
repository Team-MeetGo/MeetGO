'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { Chip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { favoriteOptions } from '(@/utils/FavoriteData)';

import type { MeetingRoomType } from '(@/types/roomTypes)';
import type { UUID } from 'crypto';

function RoomInformation({ roomId }: { roomId: UUID }) {
  const [room, setRoom] = useState<MeetingRoomType>();
  const { getRoomInformation } = meetingRoomHandler();

  useEffect(() => {
    const getSingleRoom = async () => {
      const singleRoom = await getRoomInformation(roomId);
      if (!singleRoom) {
        return;
      }
      setRoom(singleRoom[0]);
    };
    getSingleRoom();
  }, []);

  return (
    room && (
      <div className="m-8 text-center">
        <div>{room.room_title}</div>
        <div>{room.member_number}</div>
        <div>{room.location}</div>
        <div>
          {room.feature &&
            Array.from(room.feature).map((value) => (
              <Chip
                key={value}
                color="default"
                style={{ backgroundColor: favoriteOptions.find((option) => option.value === value)?.color }}
              >
                {value}
              </Chip>
            ))}
        </div>
      </div>
    )
  );
}

export default RoomInformation;
