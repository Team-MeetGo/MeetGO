'use client';
import { customErrToast } from '@/components/common/customToast';
import useGenderMaxNumber from '@/hooks/custom/useGenderMaxNumber';
import { useAddRoomMemberMutation, useUpdateRoomStatusCloseMutation } from '@/hooks/useMutation/useMeetingMutation';
import { useAlreadyChatRoomQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { ROOMSTATUS } from '@/utils/constant';
import MeetGoLogoPurple from '@/utils/icons/meetgo-logo-purple.png';
import { debounce } from '@/utils/utilFns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RoomInformation from './RoomInformation';

import type { MeetingRoomType } from '@/types/roomTypes';
function MeetingRoom({ room }: { room: MeetingRoomType }) {
  const router = useRouter();
  const { room_id, room_status, room_title, member_number, location, feature, region } = room;
  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id as string;
  const roomId = room_id;

  const participants = useRoomParticipantsQuery(roomId);
  const alreadyChatRoom = useAlreadyChatRoomQuery(roomId);
  const { mutate: roomMemberMutation } = useAddRoomMemberMutation({ roomId, userId });
  const { mutate: updateRoomStatusCloseMutation } = useUpdateRoomStatusCloseMutation({ roomId, userId });
  const genderMaxNumber = useGenderMaxNumber(member_number);

  const addMember = async ({ room_id }: { room_id: string }) => {
    if (!user?.gender && user?.gender === null) {
      customErrToast('성별을 선택해주세요.');
      return router.push('/mypage');
    }
    //수락창: 이미 참여한 방은 바로 입장
    const alreadyParticipants = participants.find((member) => member?.user_id === userId);
    if (alreadyParticipants && alreadyChatRoom?.length === 0) {
      return router.push(`meetingRoom/${room_id}`);
    }
    //채팅창: 채팅창으로 이동
    if (alreadyParticipants && alreadyChatRoom?.length === 1) {
      return router.replace(`/chat/${alreadyChatRoom[0].chatting_room_id}`);
    }
    const participatedGenderMember = participants.filter((member) => member?.gender === user?.gender).length;

    //성별에 할당된 인원이 다 찼으면 알람
    if (genderMaxNumber === participatedGenderMember && room_status === ROOMSTATUS.RECRUITING && !alreadyParticipants) {
      customErrToast(`해당 성별은 모두 참여가 완료되었습니다.`);
    }

    //성별에 할당된 인원이 참여자 정보보다 적을 때 입장
    if (
      (!alreadyParticipants && genderMaxNumber && genderMaxNumber > participatedGenderMember) ||
      !participatedGenderMember
    ) {
      roomMemberMutation();
      //모든 인원이 다 찼을 경우 모집종료로 변경
      if (genderMaxNumber && participants.length === genderMaxNumber * 2 - 1) {
        updateRoomStatusCloseMutation();
      }
      return router.push(`meetingRoom/${room_id}`);
    }
  };

  const handleAddMemberDebounce = debounce(addMember, 500);

  return (
    <article
      className={`sm:w-80 mx-auto ${
        room.room_status === ROOMSTATUS.RECRUITING
          ? `bg-white rounded-xl border-[#E5E7EB] border-1`
          : alreadyChatRoom && alreadyChatRoom.length > 0
          ? `bg-purpleThird rounded-xl`
          : `bg-gray1 rounded-xl`
      }`}
    >
      <section className="max-w-[420px] w-full h-[200px] p-6 gap-5 rounded-xl flex flex-col hover:cursor-pointer">
        <RoomInformation room={room} />
        <main className="h-full flex flex-col justify-between" onClick={() => handleAddMemberDebounce({ room_id })}>
          <section>
            <h1 className="text-[16px] font-semibold"> {room_title} </h1>
            <div className="flex flex-row justify-start gap-2">
              <p className="text-[14px]">{region}</p>
              <p className="text-[14px]"> {location} </p>
            </div>
          </section>

          <section>
            <figure className="flex gap-1 mb-2 items-center"></figure>
            <figure className="flex flex-row gap-[4px]">
              <div className="bg-purpleSecondary text-mainColor rounded-[8px] p-[8px] text-[14px]">
                {feature && feature[0]}
              </div>
            </figure>
          </section>
        </main>
      </section>
    </article>
  );
}

export default MeetingRoom;
