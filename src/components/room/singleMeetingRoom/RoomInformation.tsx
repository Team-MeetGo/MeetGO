'use client';
import DeleteMeetingRoom from '@/components/room/DeleteMeetingRoom';
import EditMeetingRoom from '@/components/room/EditMeetingRoom';
import useGenderMaxNumber from '@/hooks/custom/useGenderMaxNumber';
import { useMyMsgData } from '@/hooks/useQueries/useChattingQuery';
import { useAlreadyChatRoomQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { GENDERFILTER } from '@/utils/constant';
import { useEffect, useRef, useState } from 'react';
import { BsFire } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoChatbubblesOutline, IoFemale, IoMale } from 'react-icons/io5';

import type { MeetingRoomType } from '@/types/roomTypes';
function RoomInformation({ room }: { room: MeetingRoomType }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { room_id, room_status, member_number, leader_id } = room;

  const roomId = room_id;
  const alreadyChatRoom = useAlreadyChatRoomQuery(room_id);
  const participants = useRoomParticipantsQuery(roomId);
  const { data: user } = useGetUserDataQuery();

  const genderMaxNumber = useGenderMaxNumber(member_number);
  const emptySeatNumber = genderMaxNumber! * 2 - participants.length;
  const femaleNumber = participants.filter((member) => member?.gender === GENDERFILTER.FEMALE).length;
  const maleNumber = participants.length - femaleNumber;
  const myMsgData = useMyMsgData(user?.user_id);

  useEffect(() => {
    const outSideClick = (e: any) => {
      const { target } = e;
      if (open && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', outSideClick);
    return;
  });
  return (
    <div className="flex flex-row">
      <div className="flex flex-row justify-between w-full items-center">
        <section className="text-[12px] flex flex-row">
          <IoFemale className="w-[12px] h-[12px] my-auto fill-hotPink" /> {`${femaleNumber}/${genderMaxNumber}`}
          <div className="px-[6px] text-[12px]">|</div>
          <IoMale className="w-[12px] h-[12px] my-auto fill-blue" />
          {`${maleNumber}/${genderMaxNumber}`}
          <div className="mx-[6px] text-[12px]">|</div> {`${room_status}`}
        </section>
        <section className="flex flex-row justify-center relative">
          {alreadyChatRoom && alreadyChatRoom.length > 0 ? (
            <mark className="flex flex-row mr-[6px] p-[4px] bg-white border rounded-lg relative">
              {myMsgData && myMsgData.find((item) => item.room_id === room.room_id) ? (
                <figure
                  className={`w-5 h-5 bg-[#F31260] rounded-full flex justify-center text-sm items-center absolute top-[-12px] right-[-12px] text-white z-[5]`}
                >
                  <h1>{myMsgData.find((item) => item.room_id === room.room_id)?.newMsgCount}</h1>
                </figure>
              ) : null}
              <p className="text-[14px]">채팅중</p>
              <figure>
                <IoChatbubblesOutline className="h-[16px] w-[16px] my-auto fill-gray2" />
              </figure>
            </mark>
          ) : emptySeatNumber === 1 ? (
            <mark className="flex flex-row gap-[2px] p-[4px] bg-white rounded-lg text-[14px]">
              <p className="text-hotPink my-auto">한자리!!</p>
              <figure>
                <BsFire className="h-[18px] w-[18px] my-auto fill-hotPink" />
              </figure>
            </mark>
          ) : null}
          {user?.user_id === leader_id ? (
            <section ref={dropdownRef} className="relative flex flex-row justify-center align-middle">
              <button
                className="flex flex-row justify-center align-middle p-[0.2rem]"
                onClick={() => {
                  setOpen((open) => !open);
                }}
              >
                <HiOutlineDotsVertical className="h-[20px] w-[20px] my-auto " />
              </button>

              {open && (
                <div className="absolute top-full right-[0px] bg-white flex flex-col w-[92px] h-[78px] p-[5px] justify-items-center border-gray2 border-1 rounded-xl">
                  <div className="flex flex-col justify-items-center w-[92px]">
                    <DeleteMeetingRoom room_id={room_id} setOpen={setOpen} />
                  </div>
                  <div className="flex flex-col justify-items-center w-[92px]">
                    <EditMeetingRoom room={room} dropdownRef={dropdownRef} setOpen={setOpen} />
                  </div>
                </div>
              )}
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default RoomInformation;
