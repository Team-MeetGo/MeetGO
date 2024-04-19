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
import { useMyMsgData } from '@/hooks/useQueries/useChattingQuery';

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
  const myMsgData = useMyMsgData(user?.user_id!);

  const addMember = async ({ room_id }: { room_id: string }) => {
    //수락창: 이미 참여한 방은 바로 입장
    const alreadyParticipants = participants?.find((member) => member?.user_id === user_id);
    if (alreadyParticipants && alreadyChatRoom?.length === 0) {
      return router.push(`/meetingRoom/${room_id}`);
    }
    //채팅창: 채팅창으로 이동
    if (alreadyParticipants && alreadyChatRoom?.length === 1) {
      return router.replace(`/chat/${alreadyChatRoom[0].chatting_room_id}`);
    }
    const participatedGenderMember = participants?.filter((member) => member?.gender === user?.gender).length;

    //성별에 할당된 인원이 다 찼으면 알람
    if (genderMaxNumber === participatedGenderMember && room_status === '모집중' && !alreadyParticipants) {
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
      await updateRoomStatusCloseMutation.mutateAsync();
    }
    return router.push(`/meetingRoom/${room_id}`);
  };

  useEffect(() => {
    const outSideClick = (e: any) => {
      const { target } = e;
      if (openModal && dropdownRef.current && dropdownRef.current.contains(target)) {
        setOpenModal(false);
      }
    };
    document.addEventListener('mousedown', outSideClick);
  }, [openModal]);

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
      <div
        className="w-max-[354px] h-[241px] p-6 gap-4 rounded-xl flex flex-col hover:cursor-pointer"
        onClick={() => addMember({ room_id })}
      >
        {/* <div className="flex flex-col justify-between"> */}
        {/* <div className="h-[24px]"></div> */}

        <div className="flex flex-row">
          <div className="flex flex-row justify-between w-full items-center">
            <div className="text-[16px] flex flex-row text-center">
              <IoFemale className="w-[14px] h-[14px] my-auto fill-hotPink" /> {`${countFemale}/${genderMaxNumber}`}
              <div className="px-[6px]">|</div>
              <IoMale className="w-[14px] h-[14px] my-auto fill-blue" />
              {`${countMale}/${genderMaxNumber}`}
              <div className="mx-[6px]">|</div> {`${room_status}`}
            </div>
            <div className="pr-[16px] flex flex-row justify-center relative">
              {alreadyChatRoom && alreadyChatRoom.length > 0 ? (
                <div className="flex flex-row gap-[2px] p-[4px] bg-white border rounded-lg">
                  {myMsgData && myMsgData.find((item) => item.room_id === room?.room_id) ? (
                    <div
                      className={`w-5 h-5 bg-[#F31260] rounded-full flex justify-center items-center gap-2 absolute top-[-8px] right-0 text-white`}
                    >
                      <h1>{myMsgData.find((item) => item.room_id === room?.room_id)?.newMsgCount}</h1>
                    </div>
                  ) : null}

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
                <div ref={dropdownRef} className="relative flex flex-row justify-center align-middle">
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

        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="text-[26px]"> {room_title} </div>
            <div className="flex flex-row justify-start gap-2">
              <div className="text-base">{region}</div>
              <div className="text-base"> {location} </div>
            </div>
          </div>

          <div>
            <div className="flex gap-1 mb-2 items-center">
              <Image
                src={MeetGoLogoPurple}
                alt="MeetGo Logo"
                style={{
                  width: 'auto',
                  height: '20px'
                }}
              />
              <p className="text-mainColor text-sm font-bold">MEETGO</p>
            </div>
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
            </div>
          </div>

          {/* <div className="h-[16px]"></div> */}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default MeetingRoom;
