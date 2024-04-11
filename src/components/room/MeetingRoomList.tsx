'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { useRecruitingMyroomQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { useEffect, useState } from 'react';
import { IoMdRefresh } from 'react-icons/io';
import MeetingRoom from './MeetingRoom';
import MeetingRoomForm from './MeetingRoomForm';

import { useSearchRoomStore } from '(@/store/searchRoomStore)';
import { userStore } from '(@/store/userStore)';
import type { MeetingRoomType, MeetingRoomTypes } from '(@/types/roomTypes)';
import MemberNumberSelection from './MemberNumberSelection';
import RegionSelection from './RegionSelection';

function MeetingRoomList() {
  const [page, setPage] = useState(1);
  const { user } = userStore((state) => state);
  const result = useRecruitingMyroomQuery(user && user.user_id);
  const recruitingRoom = result[0] as MeetingRoomTypes;
  const myRoom = result[1]?.map((sample: any) => sample.room);
  const { selectRegion, selectMemberNumber } = useSearchRoomStore();

  const [chattingRoomList, setChattingRoomList] = useState<MeetingRoomTypes>();
  const { getChattingRoom } = meetingRoomHandler();
  useEffect(() => {
    const getMeetingRoomList = async () => {
      const chattingroom = (await getChattingRoom()) as MeetingRoomTypes;
      setChattingRoomList(chattingroom);
    };
    getMeetingRoomList();
  }, []);
  if (chattingRoomList === undefined) return;

  const onReload = () => {
    window.location.reload();
  };

  // meetingRoomList 중에서 myRoomList가 없는 것을 뽑아내기
  const otherRooms = recruitingRoom?.filter(function (room: MeetingRoomType) {
    const foundItem = myRoom?.find((r) => r.room_id === room?.room_id);
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
    if (myRoom && myRoom.length / 3 < page) {
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
    <article>
      <header className="h-72">
        <div className="flex flex-row justify-between">
          <div className="m-4 text-xl	font-semibold">들어가 있는 방</div>
          <div className="flex flex-row align-middle justify-center">
            <MeetingRoomForm />
            <button
              onClick={() => {
                onReload();
              }}
            >
              <IoMdRefresh className="h-8 w-8 m-2" />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-row justify-center">
          <button onClick={() => beforePage()}> - </button>
          {
            <div className="gap-8 grid grid-cols-3 m-4 w-full px-4">
              {myRoom?.map((room, index) => {
                if (index < 3 * page && index >= 3 * (page - 1))
                  return (
                    <div key={index}>
                      {index}
                      <MeetingRoom room={room} />
                    </div>
                  );
              })}
            </div>
          }
          <button onClick={() => nextPage()}> + </button>
        </div>
      </header>
      <div className="flex flex-row justify-between">
        <div className="m-4 text-xl	font-semibold">모집중</div>
        <div className="flex flex-row gap-x-4 mx-4">
          <RegionSelection text={'selectRegion'} />
          <MemberNumberSelection text={'selectMember'} />
        </div>
      </div>
      <div className="gap-2 grid grid-cols-3 m-4 w-100%">
        {selectRegion &&
          !selectMemberNumber &&
          selectRegion !== '지역' &&
          selectRegion !== '전국' &&
          regionSelectedOtherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}
        {selectMemberNumber &&
          !selectRegion &&
          selectMemberNumber !== '인원' &&
          selectMemberNumber !== '전체' &&
          memberNumberSelectedOtherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}

        {selectMemberNumber &&
          selectMemberNumber !== '인원' &&
          selectMemberNumber !== '전체' &&
          selectRegion &&
          selectRegion !== '지역' &&
          selectRegion !== '전국' &&
          regionMemberNumberSelectedOtherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}

        {(!selectMemberNumber || selectMemberNumber === '인원' || selectMemberNumber === '전체') &&
          (!selectRegion || selectRegion === '지역' || selectRegion === '전국') &&
          otherRooms?.map((room) => <MeetingRoom key={room?.room_id} room={room} />)}
      </div>
      {/* 이 부분은 채팅룸이 형성된 전체 방으로, 마지막에는 삭제 예정입니다. */}
      <div>========여기부터는 채팅방========</div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-8">
        {chattingRoomList?.map((room) => (
          <MeetingRoom key={room?.room_id} room={room} />
        ))}
      </div>
    </article>
  );
}

export default MeetingRoomList;
