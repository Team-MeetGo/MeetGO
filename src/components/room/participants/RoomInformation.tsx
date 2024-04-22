'use client';
import meetingRoomHandler from '@/hooks/custom/room';
import {
  useDeleteMember,
  useDeleteRoom,
  useUpdateLeaderMemberMutation,
  useUpdateRoomStatusOpen
} from '@/hooks/useMutation/useMeetingMutation';
import { useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useRouter } from 'next/navigation';
import { IoFemale, IoMale } from 'react-icons/io5';

import type { MeetingRoomType, UserType } from '@/types/roomTypes';

function RoomInformation({ room_id, roomInformation }: { room_id: string; roomInformation: MeetingRoomType }) {
  const router = useRouter();
  const { data: user } = useGetUserDataQuery();
  const user_id = user?.user_id!;
  const { mutate: deleteMemberMutation } = useDeleteMember({ user_id, room_id });
  const updateRoomStatusOpenMutation = useUpdateRoomStatusOpen({ room_id, user_id });
  const { mutate: deleteRoomMutation } = useDeleteRoom({ room_id, user_id });

  const { room_title, member_number, location, feature, region, leader_id } = roomInformation;
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const genderMaxNumber = getmaxGenderMemberNumber(member_number);
  const participants = useRoomParticipantsQuery(room_id);
  const otherParticipants = participants?.filter((person: UserType | null) => person?.user_id !== leader_id);
  const updateLeaderMemeberMutation = useUpdateLeaderMemberMutation({ otherParticipants, room_id });

  const countFemale = participants?.filter((member) => member?.gender === 'female').length;
  const countMale = participants.length - countFemale;

  //나가기: 로비로
  const gotoLobby = async () => {
    if (!confirm('정말 나가시겠습니까? 나가면 다시 돌아올 수 없습니다!')) {
      return;
    }
    updateRoomStatusOpenMutation.mutateAsync();
    deleteMemberMutation();
    //유저가 리더였다면 다른 사람에게 리더 역할이 승계됩니다.
    if (leader_id && leader_id === user_id && participants?.length !== 1) {
      updateLeaderMemeberMutation.mutate();
    }
    //만약 유일한 참여자라면 나감과 동시에 방은 삭제됩니다.
    if (participants?.length === 1) {
      deleteRoomMutation();
    }
    router.push(`/meetingRoom`);
  };

  const gotoBack = () => {
    router.push(`/meetingRoom`);
  };

  return (
    <div className="flex flex-col items-center justify-content">
      <main className="flex flex-col items-center justify-content min-w-[1116px] max-w-[1440px]">
        <div className="h-[72x] w-full pt-[64px] border-b border-gray2 flex flex-row pb-[32px]">
          <div className="flex flex-row min-w-[1116px] max-w-[1440px] justify-between">
            <section className="flex flex-row align-bottom">
              <p className="text-[40px] pr-[32px]">{room_title}</p>

              <figure className="h-[46px] display display-col justify-items-center items-center gap-[8px]">
                <div className="text-[16px] flex flex-row justify-between align-middle justify-items-center mt-[12px]">
                  <IoFemale className="w-[16px] pr-[6px] my-auto fill-hotPink" /> {`${countFemale}/${genderMaxNumber}`}
                  <div className="px-[6px]">|</div>
                  <IoMale className="w-[16px] pr-[6px] my-auto fill-blue" /> {`${countMale}/${genderMaxNumber}`}
                </div>
                <p className="text-[16px]">{`${region} ${location}`}</p>
              </figure>

              <figure className="flex flex-row w-[full] text-[14px] gap-[8px] justify-start items-end pl-[32px] mb-[16 px]">
                {feature &&
                  feature.map((value) => (
                    <div
                      key={value}
                      style={{
                        backgroundColor: '#F2EAFA',
                        color: '#8F5DF4',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    >
                      {value}
                    </div>
                  ))}
              </figure>
            </section>
            <div className="flex flex-row items-end gap-[16px]">
              <button
                onClick={gotoBack}
                className="w-[90px] h-[43px] text-gray2 border-1 border-gray2 rounded-xl align-bottom"
              >
                뒤로가기
              </button>
              <button
                className="w-[90px] h-[43px] text-gray2 border-1 border-gray2 rounded-xl align-bottom"
                onClick={gotoLobby}
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomInformation;
