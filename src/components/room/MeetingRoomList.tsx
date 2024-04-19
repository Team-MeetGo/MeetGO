'use client';
import { useMyroomQuery, useRecruitingQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { RECRUTING_ROOMDATA, ROOMLIST } from '@/query/meetingRoom/meetingQueryKeys';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from 'react-icons/io';
import MeetingRoomForm from './MeetingRoomForm';
import MemberNumberSelection from './MemberNumberSelection';
import RegionSelection from './RegionSelection';
import MeetingRoom from './singleMeetingRoom/MeetingRoom';

import type { MeetingRoomType } from '@/types/roomTypes';
function MeetingRoomList() {
  const [page, setPage] = useState(1);
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  const { data: meetingRoomList } = useRecruitingQuery(String(user?.user_id));
  const scrollRef = useRef<HTMLInputElement>(null);
  const myRoomList = useMyroomQuery(String(user?.user_id));
  const filteredMyRoomList = myRoomList?.map((room) => room.room);
  const { selectRegion, selectMemberNumber } = useSearchRoomStore();
  const queryClient = useQueryClient();

  // meetingRoomList 중에서 myRoomList가 없는 것을 뽑아내기
  const otherRooms = meetingRoomList?.filter(function (room: MeetingRoomType) {
    const foundItem = filteredMyRoomList?.find((r) => r?.room_id === room?.room_id);
    if (foundItem) {
      return false;
    } else {
      return true;
    }
  });

  const regionSelectedOtherRooms = otherRooms?.filter((room) => room.region === selectRegion);
  const memberNumberSelectedOtherRooms = otherRooms?.filter((room) => room.member_number === selectMemberNumber);
  const regionMemberNumberSelectedOtherRooms = otherRooms?.filter(
    (room) => room.member_number === selectMemberNumber && room.region === selectRegion
  );

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

  const onReload = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ROOMLIST, user?.user_id],
      refetchType: 'all'
    });
    await queryClient.invalidateQueries({
      queryKey: RECRUTING_ROOMDATA,
      refetchType: 'all'
    });
  };
  return (
    <>
      <article className="fixed z-50 bg-white w-full flex-col justify-center align-middle">
        <div className="flex flex-row justify-center align-middle">
          <section className="h-[366px] mt-[64px] border-b border-gray2 max-w-[1250px]">
            <div className="flex flex-row w-full justify-between">
              <p className="text-[40px] font-semibold ml-[56px]">참여 중</p>
              <div className="flex flex-row align-middle justify-center gap-4 mr-[56px]">
                <div className="flex flex-col align-middle justify-center text-gray2">
                  <button
                    className="h-full"
                    onClick={() => {
                      onReload();
                    }}
                  >
                    <IoMdRefresh className="h-[24px] w-[24px] m-2" />
                  </button>
                  <div className="text-[14px] text-center">New</div>
                </div>
                <MeetingRoomForm />
              </div>
            </div>
            <div className="h-[24px]"></div>
            <div className="w-full flex flex-row items-center justify-content">
              <button onClick={() => beforePage()}>
                <IoIosArrowBack className="h-[40px] w-[40px] m-[8px]" />
              </button>
              <div className="w-[1000px]">
                {
                  <div className=" h-[241px] gap-[24px] grid grid-cols-3 w-100%">
                    {filteredMyRoomList !== null &&
                      filteredMyRoomList?.map((room, index) => {
                        if (index < 3 * page && index >= 3 * (page - 1))
                          return <div key={room?.room_id}>{room && <MeetingRoom room={room} />}</div>;
                      })}
                  </div>
                }
              </div>
              <button onClick={() => nextPage()}>
                <IoIosArrowForward className="h-[40px] w-[40px] m-[8px]" />
              </button>
            </div>
            <div className="h-[40px]"></div>
          </section>
        </div>
      </article>
      <article className="z-10 flex flex-col items-center justify-content pt-[462px]">
        <div>
          <div className="flex flex-col justify-start min-w-[1000px] max-w-[1440px] mt-[40px]">
            <div className="text-[40px]	font-semibold">모집 중</div>
            <div className="flex flex-row gap-x-[16px] mt-[24px] w-1/4">
              <RegionSelection text={'selectRegion'} />
              <MemberNumberSelection text={'selectMember'} />
            </div>
          </div>
          <div className="gap-[24px] mb-[8px] grid grid-cols-3 w-full mt-[24px]">
            {selectRegion &&
              selectRegion !== ('지역' || '전국') &&
              (!selectMemberNumber || selectMemberNumber === ('인원' || '전체')) &&
              regionSelectedOtherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}

            {selectMemberNumber &&
              selectMemberNumber !== ('인원' && '전체') &&
              (!selectRegion || selectRegion === ('지역' || '전국')) &&
              memberNumberSelectedOtherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}

            {selectMemberNumber &&
              selectMemberNumber !== ('인원' && '전체') &&
              selectRegion &&
              selectRegion !== ('지역' && '전국') &&
              regionMemberNumberSelectedOtherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}

            {(!selectMemberNumber || selectMemberNumber === '인원' || selectMemberNumber === '전체') &&
              (!selectRegion || selectRegion === '지역' || selectRegion === '전국') &&
              otherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}
            <div className="w-full h-8"></div>
          </div>
        </div>
        <div ref={scrollRef}></div>
      </article>
    </>
  );
}

export default MeetingRoomList;
