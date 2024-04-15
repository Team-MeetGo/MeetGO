'use client';
import { useMyMsgData } from '@/hooks/useQueries/useChattingQuery';
import { useMyroomQuery, useRecruitingQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import type { MeetingRoomType, MeetingRoomTypes } from '@/types/roomTypes';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from 'react-icons/io';
import MeetingRoom from './MeetingRoom';
import MeetingRoomForm from './MeetingRoomForm';
import MemberNumberSelection from './MemberNumberSelection';
import RegionSelection from './RegionSelection';

function MeetingRoomList() {
  const [page, setPage] = useState(1);
  const [scrollPage, setScrollPage] = useState(0);
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  const { data: meetingRoomList } = useRecruitingQuery(String(user?.user_id));
  const scrollRef = useRef<HTMLInputElement>(null);

  const myRoomList = useMyroomQuery(String(user?.user_id));
  const filteredMyRoomList = myRoomList?.map((r) => r.room);
  const { selectRegion, selectMemberNumber } = useSearchRoomStore();

  const myMsgData = useMyMsgData(user?.user_id!);
  console.log('myRoomList', myRoomList);

  const otherRooms = meetingRoomList?.filter((m) => {
    filteredMyRoomList?.filter((r) => r?.room_id === m.room_id);
  });

  const regionSelectedOtherRooms = otherRooms?.filter((room) => room.region === selectRegion);
  const memberNumberSelectedOtherRooms = otherRooms?.filter((room) => room.member_number === selectMemberNumber);
  const regionMemberNumberSelectedOtherRooms = otherRooms?.filter(
    (room) => room.member_number === selectMemberNumber && room.region === selectRegion
  );

  const [otherRoomScroll, setOtherRoomScroll] = useState<MeetingRoomType[]>([]);
  const [regionSelectedRoomScroll, setRegionSelectedRoomScroll] = useState<MeetingRoomType[]>([]);
  const [memberSelectedRoomScroll, setMemberSelectedRoomScroll] = useState<MeetingRoomType[]>([]);
  const [regionMemberSelectedRoomScroll, setRegionMemberSelectedRoomScroll] = useState<MeetingRoomType[]>([]);
  const nextpage = scrollPage * 3 + 3;
  const pagecondition = otherRooms!.length > nextpage ? nextpage : otherRooms!.length + 1;
  console.log('pagecondition', pagecondition);
  const viewCards = () => {
    if (otherRooms) {
      const otherRoomsViewCards = otherRooms.slice(0, pagecondition);
      if (otherRoomsViewCards) setOtherRoomScroll(otherRoomsViewCards);
      // const regionSelectedOtherRoomsViewCards = regionSelectedOtherRooms?.slice(0, scrollPage * 3 + 3);
      // const memberNumberSelectedOtherRoomsViewCards = memberNumberSelectedOtherRooms?.slice(0, scrollPage * 3 + 3);
      // const regionMemberNumberSelectedOtherRoomsViewCards = regionMemberNumberSelectedOtherRooms?.slice(
      //   0,
      //   scrollPage * 3 + 3
      // );
      //   if (regionSelectedOtherRoomsViewCards) setRegionSelectedRoomScroll(regionSelectedOtherRoomsViewCards);
      //   if (memberNumberSelectedOtherRoomsViewCards) setMemberSelectedRoomScroll(memberNumberSelectedOtherRoomsViewCards);
      //   if (regionMemberNumberSelectedOtherRoomsViewCards)
      //     setRegionMemberSelectedRoomScroll(regionMemberNumberSelectedOtherRoomsViewCards);
    }
  };

  const nextPage = () => {
    if (myRoomList && myRoomList.length / 3 <= page) {
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

  const currentRef = scrollRef.current;

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          // if (rect.y <= (window.innerHeight || document.documentElement.clientHeight)) {
          viewCards();
          setScrollPage((scrollPage) => scrollPage + 1);
          // }
        }
      }, observerOptions);
    });
    const N = otherRooms?.length;
    if (N === undefined) return;
    const totalPage = Math.ceil(N / 3);
    if (currentRef && scrollPage < totalPage) {
      observer.observe(currentRef);
    } else if (totalPage < scrollPage && currentRef) {
      observer.unobserve(currentRef);
    }
  }, [currentRef, scrollPage]);
  const onReload = () => {};

  return (
    <>
      <article className="h-[366px] mt-[88px] border-b border-gray2 min-w-[1116px] max-w-[1440px]">
        <div className="flex flex-row w-full justify-between">
          <div className="text-[40px] font-semibold ml-[56px]">참여 중</div>
          <div className="flex flex-row align-middle justify-center gap-4 mr-[56px]">
            <div className="flex flex-col align-middle justify-center text-gray2">
              <button
                className="h-full"
                onClick={() => {
                  onReload();
                }}
              >
                <IoMdRefresh className="h-6 w-6 m-2" />
              </button>
              <div className="text-[14px]">새로고침</div>
            </div>
            <MeetingRoomForm />
          </div>
        </div>
        <div className="h-[24px]"></div>
        <div className="w-full flex flex-row items-center justify-content">
          <button onClick={() => beforePage()}>
            <IoIosArrowBack className="h-[40px] w-[40px] m-[8px]" />
          </button>
          {
            <div className="h-[241px] gap-[24px] grid grid-cols-3 w-full px-4">
              {filteredMyRoomList !== null &&
                filteredMyRoomList?.map((room, index) => {
                  if (index < 3 * page && index >= 3 * (page - 1))
                    return (
                      <div key={room?.room_id}>
                        <div className="flex gap-2">
                          {myMsgData && myMsgData.find((item) => item.room_id === room?.room_id) ? (
                            <h1>
                              {myMsgData.find((item) => item.room_id === room?.room_id)?.newMsgCount} 새로운 메세지 수
                            </h1>
                          ) : null}
                        </div>
                        {room && <MeetingRoom room={room} />}
                      </div>
                    );
                })}
            </div>
          }
          <button onClick={() => nextPage()}>
            <IoIosArrowForward className="h-[40px] w-[40px] m-[8px]" />
          </button>
        </div>
        <div className="h-[40px]"></div>
      </article>
      <article className="flex flex-col items-center justify-content">
        <div>
          <div className="flex flex-col justify-start min-w-[1116px] max-w-[1440px] mt-[40px]">
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
