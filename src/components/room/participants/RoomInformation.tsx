'use client';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { Chip } from '@nextui-org/react';

import { useRoomInfoWithRoomIdQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import type { UUID } from 'crypto';

function RoomInformation({ roomId }: { roomId: UUID }) {
  const roomInformation = useRoomInfoWithRoomIdQuery(roomId);
  const { room_title, member_number, location, feature } = roomInformation![0];

  return (
    roomInformation && (
      <div className="m-8 text-center">
        <div>{room_title}</div>
        <div>{member_number}</div>
        <div>{location}</div>
        <div>
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
