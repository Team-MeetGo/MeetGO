'use client';
import MyRoomsTitle from '@/components/room/lobby/MyRoomTitle';
import OtherRoomsTitle from '@/components/room/lobby/OtherRoomsTitle';
import MeetingRoom from '@/components/room/singleMeetingRoom/MeetingRoom';
import { useMyPastAndNowRoomQuery, useRoomConditionDataQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { REGIONANDMEMBER } from '@/utils/constant';
import { Suspense, useEffect, useState } from 'react';
// import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import type { MeetingRoomType } from '@/types/roomTypes';
// import LobbyBanner from './LobbyBanner';
import ParticipatingRooms from './ParticipatingRooms';
function MeetingRoomList() {
  // const [page, setPage] = useState(1);
  const [filteredOtherRooms, setFilteredOtherRooms] = useState<MeetingRoomType[]>([]);

  const { data: user } = useGetUserDataQuery();
  const { recrutingData } = useRoomConditionDataQuery(String(user?.user_id));
  const myOutList = useMyPastAndNowRoomQuery(String(user?.user_id));

  // const filteredMyRoomList = myRoomList?.map((room) => room.room);
  const filteredMyOutRoomList = myOutList?.map((room) => room.room);
  const { selectRegion, selectMemberNumber } = useSearchRoomStore();

  // meetingRoomList 중에서 내가 참여한 적도, 참여하지도 않은 방들을 뽑아내기
  const otherRooms = recrutingData.filter(function (room: MeetingRoomType) {
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

  // const nextPage = () => {
  //   if (filteredMyRoomList && filteredMyRoomList.length / 3 <= page) {
  //     return setPage(1);
  //   }
  //   setPage((page) => page + 1);
  // };
  // const beforePage = () => {
  //   if (page < 2) {
  //     return setPage(1);
  //   }
  //   setPage((page) => page - 1);
  // };

  return (
    <>
      <MyRoomsTitle>
        <ParticipatingRooms />
        {/* {filteredMyRoomList && filteredMyRoomList.length > 0 ? (
          <>
            <button onClick={beforePage} className="lg:block hidden">
              {page !== 1 ? <IoIosArrowBack className="h-[40px] w-[40px] m-[8px]" /> : null}
            </button>

            <div className="lg:w-[1280px] max-sm:w-[22rem]">
              {
                <li
                  className={`${
                    filteredMyRoomList.length === 0 ? 'h-[40px]' : 'lg:h-[241px]'
                  } lg:gap-[24px] lg:grid lg:grid-cols-3 w-full flex flex-col gap-[1rem]`}
                >
                  <Suspense>
                    {filteredMyRoomList.map((room, index) => {
                      if (index < 3 * page && index >= 3 * (page - 1))
                        return (
                          <div className="lg:block hidden" key={room?.room_id}>
                            {room && <MeetingRoom room={room} />}
                          </div>
                        );
                    })}
                    {filteredMyRoomList.map((room) => {
                      return (
                        <div className="block lg:hidden" key={room?.room_id}>
                          {room && <MeetingRoom room={room} />}
                        </div>
                      );
                    })}
                  </Suspense>
                </li>
              }
            </div>

            <button onClick={nextPage} className="lg:block hidden">
              {filteredMyRoomList.length / 3 <= page ? null : (
                <IoIosArrowForward className="h-[40px] w-[40px] m-[8px]" />
              )}
            </button>
          </>
        ) : (
          <div className="text-[20px] lg:w-[1112px] max-sm:[22rem] text-center">
            아직 만들어진 방이 없습니다! 방을 만들어서 미팅을 시작해 보세요!
          </div>
        )} */}
      </MyRoomsTitle>
      <div className="bg-[#E5E7EB] w-full max-w-[1280px] h-[1px] mt-[48px]"></div>
      <OtherRoomsTitle>
        <section className="flex max-w-[1280px] py-6 flex-wrap gap-4 w-full">
          <Suspense>
            {filteredOtherRooms.map((room) => (
              <MeetingRoom key={room.room_id} room={room} />
            ))}
          </Suspense>
        </section>
      </OtherRoomsTitle>
    </>
  );
}

export default MeetingRoomList;
