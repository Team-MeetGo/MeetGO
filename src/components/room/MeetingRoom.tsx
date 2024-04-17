'use client';
import meetingRoomHandler from '@/hooks/custom/room';
// import MeetGoLogo from '../../utils/icons/meetgo-logo.png';
import { useAddRoomMemberMutation, useUpdateRoomStatusClose } from '@/hooks/useMutation/useMeetingMutation';
import { useAlreadyChatRoomQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { Chip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsFire } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoChatbubblesOutline, IoFemale, IoMale } from 'react-icons/io5';
import DeleteMeetingRoom from './DeleteMeetingRoom';
import EditMeetingRoom from './EditMeetingRoom';

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

  return (
    <div
      className={
        room.room_status === '모집중'
          ? `bg-white rounded-xl border-mainColor border-1`
          : alreadyChatRoom && alreadyChatRoom.length > 0
          ? `bg-purpleThird rounded-xl`
          : `bg-slate-300 rounded-xl`
      }
    >
      <div className="w-[354px] h-[241px] rounded-xl flex flex-col justify-start hover:cursor-pointer">
        <div className="px-[24px]">
          <div className="h-[24px]"></div>
          <div className="flex flex-row justify-between align-middle justify-items-center relative">
            <div className="text-[16px] flex flex-row justify-between align-middle justify-items-center">
              <IoFemale className="w-[16px] fill-hotPink" /> {`${countFemale}/${genderMaxNumber} |`}
              <IoMale className="w-[16px] fill-blue" /> {`${countMale}/${genderMaxNumber} | ${room_status}`}
            </div>
            <div className="absolute right-[10px] flex justify-items-end">
              {alreadyChatRoom && alreadyChatRoom.length > 0 ? (
                <IoChatbubblesOutline className="h-6 w-6 m-2 fill-gray2" />
              ) : emptySeat === 1 ? (
                <BsFire className="h-6 w-6 m-2 fill-hotPink" />
              ) : user_id === leader_id ? (
                <div>
                  <button
                    onClick={() => {
                      setOpen((open) => !open);
                    }}
                  >
                    <HiOutlineDotsVertical className="h-6 w-6 m-2" />
                  </button>

                  {open && (
                    <div className="flex flex-col w-[92px] h-[78px] p-[5px] justify-items-center border-gray2 border-1 rounded-xl">
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

          <main className="flex flex-col justify-start" onClick={() => addMember({ room_id })}>
            <div className="h-[16px]"></div>
            <div className="text-[26px]"> {room_title} </div>
            <div className="flex flex-row justify-start gap-2">
              <div className="text-[14px]">{region}</div>
              <div className="text-[14px]"> {location} </div>
            </div>
            <div className="h-[40px]"></div>
            <div>
              {/* <Image
                src={MeetGoLogo}
                alt="MeetGo Logo"
                style={{
                  width: 'auto',
                  height: '18px'
                }}
                priority={true}
              /> */}
            </div>
            <div className="h-[8px]"></div>

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
