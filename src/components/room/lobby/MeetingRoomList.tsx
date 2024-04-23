'use client';
import { useMyroomQuery, useRecruitingQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import MeetingRoom from '@/components/room/singleMeetingRoom/MeetingRoom';
import MyRoomsTitle from '@/components/room/lobby/MyRoomTitle';
import OtherRoomsTitle from '@/components/room/lobby/OtherRoomsTitle';

import type { MeetingRoomType } from '@/types/roomTypes';
import { REGIONANDMEMBER } from '@/utils/MeetingRoomSelector';
function MeetingRoomList() {
  const [page, setPage] = useState(1);
  const [filteredOtherRooms, setFilteredOtherRooms] = useState<MeetingRoomType[]>();
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  const { data: meetingRoomList } = useRecruitingQuery(String(user?.user_id));
  const myRoomList = useMyroomQuery(String(user?.user_id));
  const filteredMyRoomList = myRoomList?.map((room) => room.room);
  const { selectRegion, selectMemberNumber } = useSearchRoomStore();

  // meetingRoomList 중에서 myRoomList가 없는 것을 뽑아내기
  const otherRooms = meetingRoomList?.filter(function (room: MeetingRoomType) {
    const foundItem = filteredMyRoomList?.find((r) => r?.room_id === room?.room_id);
    if (foundItem) {
      return false;
    } else {
      return true;
    }
  });

  //여러 조건에서 모집 중인 RoomList를 뽑아내기
  const filteredOtherRoomsHandler = () => {
    if (selectRegion === REGIONANDMEMBER.EVERYWHERE && selectMemberNumber === REGIONANDMEMBER.EVERYMEMBER) {
      return setFilteredOtherRooms(otherRooms);
    }
    if (selectRegion !== REGIONANDMEMBER.EVERYWHERE && selectMemberNumber === REGIONANDMEMBER.EVERYMEMBER) {
      const regionFilteredRooms = otherRooms?.filter((room) => room.region === selectRegion);
      return setFilteredOtherRooms(regionFilteredRooms);
    }
    if (selectMemberNumber !== REGIONANDMEMBER.EVERYMEMBER && selectRegion === REGIONANDMEMBER.EVERYWHERE) {
      const numberFilteredRooms = otherRooms?.filter((room) => room.member_number === selectMemberNumber);
      return setFilteredOtherRooms(numberFilteredRooms);
    }
    if (selectMemberNumber !== REGIONANDMEMBER.EVERYMEMBER && selectRegion !== REGIONANDMEMBER.EVERYWHERE) {
      const regionNumberFilteredRooms = otherRooms?.filter(
        (room) => room.member_number === selectMemberNumber && room.region === selectRegion
      );
      return setFilteredOtherRooms(regionNumberFilteredRooms);
    }
  };
  useEffect(() => {
    filteredOtherRoomsHandler();
  }, [myRoomList, selectRegion, selectMemberNumber]);

  const nextPage = () => {
    if (filteredMyRoomList && filteredMyRoomList.length / 3 <= page) {
      return setPage(1);
    }
    setPage((page) => page + 1);
  };
  const beforePage = () => {
    if (page < 2) {
      return setPage(1);
    }
    setPage((page) => page - 1);
  };

  return (
    <>
      <MyRoomsTitle>
        <section className="w-100% flex flex-row items-center justify-content">
          <button onClick={beforePage}>
            <IoIosArrowBack className="h-[40px] w-[40px] m-[8px]" />
          </button>
          <div className="w-[1000px]">
            {
              <li className=" h-[241px] gap-[24px] grid grid-cols-3 w-100%">
                {filteredMyRoomList?.map((room, index) => {
                  if (index < 3 * page && index >= 3 * (page - 1))
                    return <div key={room?.room_id}>{room && <MeetingRoom room={room} />}</div>;
                })}
              </li>
            }
          </div>
          <button onClick={nextPage}>
            <IoIosArrowForward className="h-[40px] w-[40px] m-[8px]" />
          </button>
        </section>
      </MyRoomsTitle>
      <OtherRoomsTitle>
        <section className="gap-[24px] grid grid-cols-3 w-[1000px] pt-[24px] pb-[8px]">
          {filteredOtherRooms?.map((room) => (
            <MeetingRoom key={room?.room_id} room={room} />
          ))}
        </section>
      </OtherRoomsTitle>
    </>
  );
}

export default MeetingRoomList;
