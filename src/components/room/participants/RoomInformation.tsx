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

  return (
    <div className="flex flex-col items-center justify-content">
      <div className="flex flex-col items-center justify-content min-w-[1116px] max-w-[1440px]">
        <div className="h-[72x] w-full mt-[88px] border-b border-gray2 flex flex-row pb-[32px]">
          <div className="text-[40px] pr-[32px]">{room_title}</div>
          <div>
            <div className="text-[16px]">{member_number}</div>
            <div className="text-[16px]">{location}</div>
          </div>
          <div className="flex flex-row w-44 justify-start items-end pl-[32px]">
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
      </div>
    </div>
  );
}

export default RoomInformation;
