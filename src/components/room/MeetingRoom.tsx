'use client';
import meetingRoomHandler from '@/hooks/custom/room';
import MeetGoLogoPurple from '../../utils/icons/meetgo-logo-purple.png';
import { useAddRoomMemberMutation, useUpdateRoomStatusClose } from '@/hooks/useMutation/useMeetingMutation';
import { useAlreadyChatRoomQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { Chip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BsFire } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoChatbubblesOutline, IoFemale, IoMale } from 'react-icons/io5';
import DeleteMeetingRoom from './DeleteMeetingRoom';
import EditMeetingRoom from './EditMeetingRoom';
import Image from 'next/image';

import type { MeetingRoomType } from '@/types/roomTypes';
function MeetingRoom({ room }: { room: MeetingRoomType }) {
  const { room_id, room_status, room_title, member_number, location, feature, leader_id, region } = room;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: user } = useGetUserDataQuery();
  const user_id = String(user?.user_id);
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const participants = useRoomParticipantsQuery(room_id);
  const roomMemberMutation = useAddRoomMemberMutation({ user_id, room_id });
  const updateRoomStatusCloseMutation = useUpdateRoomStatusClose({ room_id, user_id });
  const { data: alreadyChatRoom, error: alreadyChatRoomError } = useAlreadyChatRoomQuery(room_id);
  const genderMaxNumber = getmaxGenderMemberNumber(member_number);
  const emptySeat = genderMaxNumber! * 2 - participants!.length;
  const countFemale = participants?.filter((member) => member?.gender === 'female').length;
  const countMale = participants?.filter((member) => member?.gender === 'male').length;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);

  const addMember = async ({ room_id }: { room_id: string }) => {
    //채팅창: 채팅창으로 이동
    if (alreadyChatRoom?.length === 1) {
      console.log('alreadyChatRoom', alreadyChatRoom);
      return router.replace(`/chat/${alreadyChatRoom[0].chatting_room_id}`);
    }

    //수락창: 이미 참여한 방은 바로 입장
    const alreadyParticipants = participants?.find((member) => member?.user_id === user_id);
    if (alreadyParticipants) {
      return router.push(`/meetingRoom/${room_id}`);
    }
    const participatedGenderMember = participants?.filter((member) => member?.gender === user?.gender).length;

    //성별에 할당된 인원이 다 찼으면 알람
    if (genderMaxNumber === participatedGenderMember && room_status === '모집중' && !alreadyParticipants) {
      console.log('다 찼을 경우');
      alert('해당 성별은 모두 참여가 완료되었습니다.');
      return router.push('/meetingRoom');
    }

    //성별에 할당된 인원이 참여자 정보보다 적을 때 입장
    if (
      (!alreadyParticipants && genderMaxNumber && genderMaxNumber > participatedGenderMember!) ||
      !participatedGenderMember
    ) {
      await roomMemberMutation.mutateAsync();
    }
    //모든 인원이 다 찼을 경우 모집종료로 변경
    if (genderMaxNumber && participants?.length === genderMaxNumber * 2 - 1) {
      console.log('genderMaxNumber', genderMaxNumber);
      console.log('참여자', participants);
      await updateRoomStatusCloseMutation.mutateAsync();
    }
    return router.push(`/meetingRoom/${room_id}`);
  };

  useEffect(() => {
    const outSideClick = (e) => {
      const { target } = e;
      if (openModal && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenModal(false);
      }
    };
    document.addEventListener('mousedown', outSideClick);
  });

  return (
    <div
      className={
        room.room_status === '모집중'
          ? `bg-white rounded-xl border-mainColor border-1`
          : alreadyChatRoom && alreadyChatRoom.length > 0
          ? `bg-purpleThird rounded-xl`
          : `bg-gray1 rounded-xl`
      }
    >
      <div className="w-max-[354px] h-[241px] rounded-xl flex flex-col justify-start">
        <div className="pl-[24px]">
          <div className="h-[24px]"></div>

          <div className="flex flex-row align-middle my-auto">
            <div className="flex flex-row align-middle justify-between w-full">
              <div className="text-[16px] flex flex-row align-middle text-center">
                <IoFemale className="w-[14px] h-[14px] my-auto fill-hotPink" /> {`${countFemale}/${genderMaxNumber}`}
                <div className="px-[6px]">|</div>
                <IoMale className="w-[14px] h-[14px] my-auto fill-blue" />
                {`${countMale}/${genderMaxNumber}`}
                <div className="mx-[6px]">|</div> {`${room_status}`}
              </div>
              <div className="pr-[16px] flex flex-row justify-center align-middle">
                {alreadyChatRoom && alreadyChatRoom.length > 0 ? (
                  <div className="flex flex-row gap-[2px] p-[4px] bg-white rounded-lg text-[14px]">
                    <div className="text-[14px]">채팅중</div>
                    <div>
                      <IoChatbubblesOutline className="h-[16px] w-[16px] my-auto fill-gray2" />
                    </div>
                  </div>
                ) : emptySeat === 1 ? (
                  <div className="flex flex-row gap-[2px] p-[4px] bg-white rounded-lg text-[14px]">
                    <div className="text-hotPink my-auto">한자리!!</div>
                    <div>
                      <BsFire className="h-[18px] w-[18px] my-auto fill-hotPink" />
                    </div>
                  </div>
                ) : user_id === leader_id ? (
                  <div className="relative flex flex-row justify-center align-middle">
                    <button
                      className="flex flex-row justify-center align-middle"
                      onClick={() => {
                        setOpen((open) => !open);
                      }}
                    >
                      <HiOutlineDotsVertical className="h-[20px] w-[20px] my-auto" />
                    </button>

                    {open && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full right-[0px] bg-white flex flex-col w-[92px] h-[78px] p-[5px] justify-items-center border-gray2 border-1 rounded-xl"
                      >
                        <div className="flex flex-col justify-items-center w-[92px]">
                          <DeleteMeetingRoom room_id={room_id} />
                        </div>
                        <div className="flex flex-col justify-items-center w-[92px]">
                          <EditMeetingRoom room={room} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <main className="flex flex-col justify-start hover:cursor-pointer" onClick={() => addMember({ room_id })}>
            <div className="h-[16px]"></div>
            <div className="text-[26px]"> {room_title} </div>
            <div className="flex flex-row justify-start gap-2">
              <div className="text-[14px]">{region}</div>
              <div className="text-[14px]"> {location} </div>
            </div>
            <div className="h-[32px]"></div>
            <div>
              <Image
                src={MeetGoLogoPurple}
                alt="MeetGo Logo"
                style={{
                  width: 'auto',
                  height: '18px'
                }}
              />
            </div>
            <div className="h-[16px]"></div>

            <div className="text-[14px] flex flex-row gap-[4px]">
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
              <div className="h-[24px]"></div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;
