'use client';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { Chip } from '@nextui-org/react';

import { useRoomInfoWithRoomIdQuery } from '(@/hooks/useQueries/useMeetingQuery)';

function RoomInformation({ room_id }: { room_id: string }) {
  const { data: room, isLoading: isRoomLoading, isError: isRoomError } = useRoomInfoWithRoomIdQuery(room_id);

  if (isRoomLoading || !room?.room_title) {
    return <div>로딩중입니다...!</div>;
  }

  const { room_title, member_number, location, feature } = room;
  console.log(room_id);
  return (
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
  );
}

export default RoomInformation;
