'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { userStore } from '(@/store/userStore)';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { Chip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import DeleteMeetingRoom from './DeleteMeetingRoom';
import EditMeetingRoom from './EditMeetingRoom';

import { useAddRoomMemberMutation, useUpdateRoomStatusClose } from '(@/hooks/useMutation/useMeetingMutation)';
import { useParticipantsQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { useAlreadyChatRoomQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import type { MeetingRoomType } from '(@/types/roomTypes)';
import { BsFire } from 'react-icons/bs';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useState } from 'react';

function MeetingRoom({ room }: { room: MeetingRoomType }) {
  const { user } = userStore((state) => state);
  const router = useRouter();
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const participants = useParticipantsQuery(room.room_id);

  const { room_id, room_status, room_title, member_number, location, feature, leader_id } = room;
  const [open, setOpen] = useState(false);
  const userInformation = user;
  const user_id = userInformation?.user_id;
  const roomMemberMutation = useAddRoomMemberMutation({ user_id, room_id });
  const updateRoomStatusCloseMutation = useUpdateRoomStatusClose({ room_id });
  const alreadyChatRoom = useAlreadyChatRoomQuery(room_id);
  const genderMaxNumber = getmaxGenderMemberNumber(member_number);
  const emptySeat = genderMaxNumber * 2 - participants.length;

  const addMember = async ({ room_id, member_number }: { room_id: string; member_number: string }) => {
    //채팅창으로 넘어갔을 경우에는 채팅창으로 이동
    if (alreadyChatRoom && alreadyChatRoom?.length) {
      // 만약 isActive인 채팅방이 이미 있다면 그 방으로 보내기
      router.replace(`/chat/${alreadyChatRoom[0].chatting_room_id}`);
    }

    //수락창인 단계에서 내가 이미 방에 참여하고 있는 경우
    const alreadyParticipants = participants?.find((member) => member.user_id === userInformation?.user_id);
    if (alreadyParticipants) {
      router.push(`/meetingRoom/${room_id}`);
    }

    //성별에 할당된 인원이 참여자 정보보다 적을 때 입장
    const participatedGenderMember = participants.filter((member) => member.gender === userInformation?.gender).length;

    if ((genderMaxNumber && genderMaxNumber > participatedGenderMember) || !participatedGenderMember) {
      await roomMemberMutation.mutateAsync();
      router.push(`/meetingRoom/${room_id}`);
    }

    //성별에 할당된 인원이 다 찼으면 알람
    if (genderMaxNumber === participatedGenderMember && room_status === '모집중' && !alreadyParticipants) {
      alert('해당 성별은 모두 참여가 완료되었습니다.');
      router.push('/meetingRoom');
    }

    //모든 인원이 다 찼을 경우 모집종료로 변경
    if (genderMaxNumber && participants?.length === genderMaxNumber * 2) {
      await updateRoomStatusCloseMutation.mutateAsync();
    }
  };
  console.log('genderMaxNumber', genderMaxNumber);
  console.log(emptySeat);
  return (
    <>
      <div
        className={
          room.room_status === '모집중'
            ? `bg-white rounded-xl`
            : alreadyChatRoom && alreadyChatRoom.length > 0
            ? `bg-purpleThird rounded-xl`
            : `bg-slate-300 rounded-xl`
        }
      >
        <div className="border-gray-950 border-1 w-100% h-full rounded-xl">
          <div className="flex flex-row justify-between align-middle text-sm">
            <div>정보 </div>
            {alreadyChatRoom && alreadyChatRoom.length > 0 ? (
              <IoChatbubblesOutline className="h-6 w-6 m-2" />
            ) : emptySeat === 1 ? (
              <BsFire className="h-6 w-6 m-2" />
            ) : null}
            {userInformation?.user_id === leader_id ? (
              <div>
                <button
                  onClick={() => {
                    setOpen((open) => !open);
                  }}
                >
                  <HiOutlineDotsVertical className="h-6 w-6 mr-12" />
                </button>

                {open && (
                  <div>
                    <DeleteMeetingRoom room_id={room_id} />
                    <EditMeetingRoom room={room} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <main className="m-2 p-2 h-100%" onClick={(e) => addMember({ room_id, member_number })}>
            <div className="flex flex-row justify-between">
              <div> {room_title} </div>
              <div className="text-sm"> {location} </div>
            </div>
            <div className="text-sm">
              <div> {room_status} </div>
              <div> {member_number}</div>
            </div>
            <div>
              {feature &&
                Array.from(feature).map((value) => (
                  <Chip
                    key={value}
                    color="default"
                    style={{ backgroundColor: favoriteOptions.find((option) => option.value === value)?.color }}
                  >
                    {value}
                  </Chip>
                ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default MeetingRoom;
