'use client';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { Chip } from '@nextui-org/react';

import { useRoomInfoWithRoomIdQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import type { UUID } from 'crypto';

function RoomInformation({ roomId }: { roomId: string }) {
  const roomInformation = useRoomInfoWithRoomIdQuery(roomId);
  const { room_title, member_number, location, feature } = roomInformation![0];
  console.log(roomId);
  return (
    roomInformation! && (
      <div className="h-28 m-8 text-center border-4 flex flex-row justify-start gap-4 p-6">
        <div className="text-5xl ">{room_title}</div>
        <div>
          <div>{member_number}</div>
          <div>{location}</div>
        </div>
        <div className="flex flex-row w-44 justify-start align-bottom">
          {feature &&
            Array.from(feature).map((value) => (
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
