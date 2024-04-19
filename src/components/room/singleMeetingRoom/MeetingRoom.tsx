'use client';
import meetingRoomHandler from '@/hooks/custom/room';
import { useAddRoomMemberMutation, useUpdateRoomStatusClose } from '@/hooks/useMutation/useMeetingMutation';
import { useAlreadyChatRoomQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import MeetGoLogoPurple from '@/utils/icons/meetgo-logo-purple.png';
import { Chip } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RoomInformation from './RoomInformation';

import type { MeetingRoomType } from '@/types/roomTypes';
function MeetingRoom({ room }: { room: MeetingRoomType }) {
  const { room_id, room_status, room_title, member_number, location, feature, region } = room;
  const router = useRouter();
  const { data: user } = useGetUserDataQuery();
  const user_id = user?.user_id as string;
  const participants = useRoomParticipantsQuery(room_id);
  const roomMemberMutation = useAddRoomMemberMutation({ user_id, room_id });
  const updateRoomStatusCloseMutation = useUpdateRoomStatusClose({ room_id, user_id });
  const { data: alreadyChatRoom, error: alreadyChatRoomError } = useAlreadyChatRoomQuery(room_id);
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const genderMaxNumber = getmaxGenderMemberNumber(member_number);

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
      await roomMemberMutation.mutate();
    }
    //모든 인원이 다 찼을 경우 모집종료로 변경
    if (genderMaxNumber && participants?.length === genderMaxNumber * 2 - 1) {
      await updateRoomStatusCloseMutation.mutate();
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
          : `bg-gray1 rounded-xl`
      }
    >
      <section className="w-max-[354px] h-[241px] p-6 gap-4 rounded-xl flex flex-col hover:cursor-pointer">
        <RoomInformation room={room} user_id={user_id} alreadyChatRoom={alreadyChatRoom} participants={participants} />
        <main className="h-full flex flex-col justify-between" onClick={() => addMember({ room_id })}>
          <div className="flex flex-col">
            <p className="text-[26px]"> {room_title} </p>
            <div className="flex flex-row justify-start gap-2">
              <p className="text-base">{region}</p>
              <p className="text-base"> {location} </p>
            </div>
          </div>

          <div>
            <figure className="flex gap-1 mb-2 items-center">
              <Image
                src={MeetGoLogoPurple}
                alt="MeetGo Logo"
                style={{
                  width: 'auto',
                  height: '20px'
                }}
              />
              <p className="text-mainColor text-sm font-bold">MEETGO</p>
            </figure>
            <figure className="flex flex-row gap-[4px] text-[14px]">
              {feature &&
                Array.from(feature).map((value) => (
                  <Chip
                    key={value}
                    color="default"
                    style={{
                      backgroundColor: '#F2EAFA',
                      color: '#8F5DF4',
                      borderRadius: '8px'
                    }}
                    classNames={{ content: 'px-1 text-sm' }}
                  >
                    {value}
                  </Chip>
                ))}
            </figure>
          </div>
        </main>
      </section>
    </div>
  );
}

export default MeetingRoom;
