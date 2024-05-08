'use client';

import { useRoomConditionDataQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { REGIONANDMEMBER } from '@/utils/constant';
import { useEffect, useState } from 'react';
import MeetingRoom from '../singleMeetingRoom/MeetingRoom';

import type { MeetingRoomType } from '@/types/roomTypes';
const RecruitingRooms = () => {
  const [filteredOtherRooms, setFilteredOtherRooms] = useState<MeetingRoomType[]>([]);

  const { data: user } = useGetUserDataQuery();
  const { recruitingData, myPastNowRoomData: filteredMyOutRoomList } = useRoomConditionDataQuery(String(user?.user_id));
  const { selectRegion, selectMemberNumber } = useSearchRoomStore();

  const otherRooms = recruitingData?.filter((r) => {
    return filteredMyOutRoomList?.every((m) => m.room_id !== r.room_id);
  });

  const allMember = selectMemberNumber === REGIONANDMEMBER.EVERYMEMBER;
  const someMember = selectMemberNumber !== REGIONANDMEMBER.EVERYMEMBER;
  const allRegion = selectRegion === REGIONANDMEMBER.EVERYWHERE;
  const someRegion = selectRegion !== REGIONANDMEMBER.EVERYWHERE;

  //여러 조건에서 모집 중인 RoomList를 뽑아내기
  const filteredOtherRoomsHandler = () => {
    if (!otherRooms) return setFilteredOtherRooms([]);
    if (allRegion && allMember) {
      return setFilteredOtherRooms(otherRooms);
    }
    if (someRegion && allMember) {
      const regionFilteredRooms = otherRooms?.filter(
        (room) => room.region === selectRegion || room.region === REGIONANDMEMBER.EVERYWHERE
      );
      return setFilteredOtherRooms(regionFilteredRooms);
    }
    if (someMember && allRegion) {
      const numberFilteredRooms = otherRooms?.filter(
        (room) => room.member_number === selectMemberNumber || room.member_number === REGIONANDMEMBER.EVERYMEMBER
      );
      return setFilteredOtherRooms(numberFilteredRooms);
    }
    if (someMember && someRegion) {
      const regionNumberFilteredRooms = otherRooms?.filter(
        (room) =>
          room.member_number === (selectMemberNumber || REGIONANDMEMBER.EVERYMEMBER) &&
          room.region === (selectRegion || REGIONANDMEMBER.EVERYWHERE)
      );
      return setFilteredOtherRooms(regionNumberFilteredRooms);
    }
  };

  useEffect(() => {
    filteredOtherRoomsHandler();
  }, [selectRegion, selectMemberNumber]);
  return (
    <section className="flex max-w-[1280px] py-6 flex-wrap gap-[1.9rem] w-full">
      {filteredOtherRooms.map((room) => (
        <MeetingRoom key={room.room_id} room={room} />
      ))}
    </section>
  );
};

export default RecruitingRooms;
