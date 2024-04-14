'use client';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { Chip } from '@nextui-org/react';
import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { IoFemale, IoMale } from 'react-icons/io5';

import type { UUID } from 'crypto';
import meetingRoomHandler from '(@/hooks/custom/room)';

function RoomInformation({ room_id }: { room_id: UUID }) {
  const participants = useRoomParticipantsQuery(room_id);

  const { data: room, isLoading: isRoomLoading, isError: isRoomError } = useRoomInfoWithRoomIdQuery(room_id);
  if (isRoomLoading || !room?.room_title) {
    return <div>로딩중입니다...!</div>;
  }
  const { room_title, member_number, location, feature } = room;
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const genderMaxNumber = getmaxGenderMemberNumber(member_number);
  console.log(participants);

  const countFemale = participants?.filter((member) => member?.gender === 'female').length;
  const countMale = participants?.filter((member) => member?.gender === 'male').length;
  return (
    <div className="flex flex-col items-center justify-content">
      <div className="flex flex-col items-center justify-content min-w-[1116px] max-w-[1440px]">
        <div className="h-[72x] w-full mt-[88px] border-b border-gray2 flex flex-row pb-[32px]">
          <div className="text-[40px] pr-[32px]">{room_title}</div>
          <div className="h-[40px] display display-col gap-[4px]">
            <div className="text-[16px] flex flex-row justify-between align-middle justify-items-center">
              <IoFemale className="w-[16px] fill-hotPink" /> {`${countFemale}/${genderMaxNumber} |`}
              <IoMale className="w-[16px] fill-blue" /> {`${countMale}/${genderMaxNumber}`}
            </div>
            <div className="text-[16px]">{location}</div>
          </div>
          <div className="flex flex-row w-[44px] justify-start items-end pl-[32px]">
            {feature &&
              Array.from(feature).map((value) => (
                <Chip
                  key={value}
                  color="default"
                  style={{ backgroundColor: '#F2EAFA', color: '#8F5DF4', borderRadius: '8px' }}
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
