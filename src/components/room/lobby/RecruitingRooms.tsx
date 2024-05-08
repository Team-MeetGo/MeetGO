'use client';

import { useRoomConditionDataQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { REGIONANDMEMBER } from '@/utils/constant';
import { Suspense, useEffect, useState } from 'react';
import MeetingRoom from '../singleMeetingRoom/MeetingRoom';

import type { MeetingRoomType } from '@/types/roomTypes';
function RecruitingRooms() {
  const [filteredOtherRooms, setFilteredOtherRooms] = useState<MeetingRoomType[]>([]);

  const { data: user } = useGetUserDataQuery();
  const { recruitingData, myPastNowRoomData: myOutList } = useRoomConditionDataQuery(String(user?.user_id));

  const filteredMyOutRoomList = myOutList?.map((room) => room.room);
  const { selectRegion, selectMemberNumber } = useSearchRoomStore();

  // meetingRoomList 중에서 내가 참여한 적도, 참여하지도 않은 방들을 뽑아내기
  const otherRooms = recruitingData.filter(function (room: MeetingRoomType) {
    const foundItem = filteredMyOutRoomList?.find((r) => r?.room_id === room.room_id);
    if (foundItem) {
      return false;
    } else {
      return true;
    }
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
      <Suspense>
        {filteredOtherRooms.map((room) => (
          <MeetingRoom key={room.room_id} room={room} />
        ))}
      </Suspense>
    </section>
  );
}

export default RecruitingRooms;
