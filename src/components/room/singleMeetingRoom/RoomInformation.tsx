'use client';
import DeleteMeetingRoom from '@/components/room/DeleteMeetingRoom';
import EditMeetingRoom from '@/components/room/EditMeetingRoom';
import getmaxGenderMemberNumber from '@/hooks/custom/room';
import { useMyMsgData } from '@/hooks/useQueries/useChattingQuery';
import { useAlreadyChatRoomQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { GENDER } from '@/utils/MeetingRoomSelector';
import { useEffect, useRef, useState } from 'react';
import { BsFire } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoChatbubblesOutline, IoFemale, IoMale } from 'react-icons/io5';

import type { MeetingRoomType } from '@/types/roomTypes';
function RoomInformation({ room }: { room: MeetingRoomType }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { room_id, room_status, member_number, leader_id } = room;
  const alreadyChatRoom = useAlreadyChatRoomQuery(room_id);
  const participants = useRoomParticipantsQuery(room_id);
  const { data: user } = useGetUserDataQuery();

  const genderMaxNumber = getmaxGenderMemberNumber(member_number);
  const emptySeat = genderMaxNumber! * 2 - participants!.length;
  const countFemale = participants?.filter((member) => member?.gender === GENDER.FEMALE).length;
  const countMale = participants.length - countFemale;
  const user_id = user?.user_id;
  const myMsgData = useMyMsgData(user_id);

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
        <section className="text-[16px] flex flex-row text-center">
          <IoFemale className="w-[14px] h-[14px] my-auto fill-hotPink" /> {`${countFemale}/${genderMaxNumber}`}
          <div className="px-[6px]">|</div>
          <IoMale className="w-[14px] h-[14px] my-auto fill-blue" />
          {`${countMale}/${genderMaxNumber}`}
          <div className="mx-[6px]">|</div> {`${room_status}`}
        </section>
        <section className="pr-[16px] flex flex-row justify-center relative">
          {alreadyChatRoom && alreadyChatRoom.length > 0 ? (
            <mark className="flex flex-row gap-[2px] p-[4px] bg-white border rounded-lg">
              {myMsgData && myMsgData.find((item) => item.room_id === room?.room_id) ? (
                <figure
                  className={`w-5 h-5 bg-[#F31260] rounded-full flex justify-center items-center gap-2 absolute top-[-8px] right-0 text-white`}
                >
                  <h1>{myMsgData.find((item) => item.room_id === room?.room_id)?.newMsgCount}</h1>
                </figure>
              ) : null}

              <p className="text-[14px]">채팅중</p>
              <figure>
                <IoChatbubblesOutline className="h-[16px] w-[16px] my-auto fill-gray2" />
              </figure>
            </mark>
          ) : emptySeat === 1 ? (
            <mark className="flex flex-row gap-[2px] p-[4px] bg-white rounded-lg text-[14px]">
              <p className="text-hotPink my-auto">한자리!!</p>
              <figure>
                <BsFire className="h-[18px] w-[18px] my-auto fill-hotPink" />
              </figure>
            </mark>
          ) : user_id === leader_id ? (
            <mark ref={dropdownRef} className="relative flex flex-row justify-center align-middle">
              <button
                className="flex flex-row justify-center align-middle"
                onClick={() => {
                  setOpen((open) => !open);
                }}
              >
                <HiOutlineDotsVertical className="h-[20px] w-[20px] my-auto" />
              </button>

              {open && (
                <div className="absolute top-full right-[0px] bg-white flex flex-col w-[92px] h-[78px] p-[5px] justify-items-center border-gray2 border-1 rounded-xl">
                  <div className="flex flex-col justify-items-center w-[92px]">
                    <DeleteMeetingRoom roomId={room_id} setOpen={setOpen} />
                  </div>
                  <div className="flex flex-col justify-items-center w-[92px]">
                    <EditMeetingRoom room={room} dropdownRef={dropdownRef} setOpen={setOpen} />
                  </div>
                </div>
              )}
            </mark>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default RoomInformation;
