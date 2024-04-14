'use client';
import { Chip } from '@nextui-org/react';
import { IoFemale, IoMale } from 'react-icons/io5';

import type { UUID } from 'crypto';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { useRouter } from 'next/navigation';
import {
  useDeleteMember,
  useDeleteRoom,
  useUpdateLeaderMemberMutation,
  useUpdateRoomStatusOpen
} from '(@/hooks/useMutation/useMeetingMutation)';
import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

import type { UserType } from '(@/types/roomTypes)';
import AcceptanceRoomButtons from './AcceptanceRoomButtons';

function RoomInformation({ room_id }: { room_id: UUID }) {
  const router = useRouter();
  const { data: user, isPending, isError } = useGetUserDataQuery();
  const user_id = user?.user_id!;
  const { mutate: deleteMemberMutation } = useDeleteMember({ user_id, room_id });
  const updateRoomStatusOpenMutation = useUpdateRoomStatusOpen({ room_id, user_id });
  const { mutate: deleteRoomMutation } = useDeleteRoom({ room_id, user_id });

  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  const leader = roomInformation?.leader_id;
  const participants = useRoomParticipantsQuery(room_id);
  const otherParticipants = participants?.filter((person: UserType | null) => person?.user_id !== leader);
  const updateLeaderMemeberMutation = useUpdateLeaderMemberMutation({ otherParticipants, room_id });

  const { data: room, isLoading: isRoomLoading, isError: isRoomError } = useRoomInfoWithRoomIdQuery(room_id);
  if (isRoomLoading || !room?.room_title) {
    return <div>로딩중입니다...!</div>;
  }
  const { room_title, member_number, location, feature, region } = room;
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const genderMaxNumber = getmaxGenderMemberNumber(member_number);
  console.log(participants);

  const countFemale = participants?.filter((member) => member?.gender === 'female').length;
  const countMale = participants?.filter((member) => member?.gender === 'male').length;

  //나가기: 로비로
  const gotoLobby = async () => {
    if (!confirm('정말 나가시겠습니까? 나가면 다시 돌아올 수 없습니다!')) {
      return;
    }
    await updateRoomStatusOpenMutation.mutateAsync();
    await deleteMemberMutation();
    //유저가 리더였다면 다른 사람에게 리더 역할이 승계됩니다.
    if (leader && leader === user_id && participants?.length !== 1) {
      await updateLeaderMemeberMutation.mutateAsync();
    }
    //만약 유일한 참여자라면 나감과 동시에 방은 삭제됩니다.
    if (participants?.length === 1) {
      await deleteRoomMutation();
    }
    router.push(`/meetingRoom`);
  };
  //뒤로가기: 로비로
  window.onpopstate = () => {
    if (confirm('로비로 이동하시겠습니까?')) router.replace('/meetingRoom');
  };

  return (
    <div className="flex flex-col items-center justify-content">
      <div className="flex flex-col items-center justify-content min-w-[1116px] max-w-[1440px]">
        <div className="h-[72x] w-full mt-[88px] border-b border-gray2 flex flex-row pb-[32px]">
          <div className="flex flex-row min-w-[1116px] max-w-[1440px] justify-between">
            <div className="flex flex-row align-bottom">
              <div className="text-[40px] pr-[32px]">{room_title}</div>

              <div className="h-[46px] display display-col justify-items-center items-center gap-[8px]">
                <div className="text-[16px] flex flex-row justify-between align-middle justify-items-center mt-[12px]">
                  <IoFemale className="w-[16px] fill-hotPink" /> {`${countFemale}/${genderMaxNumber} |`}
                  <IoMale className="w-[16px] fill-blue" /> {`${countMale}/${genderMaxNumber}`}
                </div>
                <div className="text-[16px]">{`${region} ${location}`}</div>
              </div>

              <div className="flex flex-row w-[44px] text-[14px] gap-[8px] justify-start items-end pl-[32px] mb-[16 px]">
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
            <div>
              <button
                className="w-[90px] h-[43px] text-gray2 border-2 border-gray2 rounded-xl mt-[12px]"
                onClick={() => {
                  gotoLobby();
                }}
              >
                나가기
              </button>
            </div>
          </div>
        </div>
        <div className="w-100% h">
          <AcceptanceRoomButtons room_id={room_id} />
        </div>
      </div>
    </div>
  );
}

export default RoomInformation;
