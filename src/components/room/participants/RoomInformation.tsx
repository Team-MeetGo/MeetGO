'use client';
import { ValidationModal } from '@/components/common/ValidationModal';
import useGenderMaxNumber from '@/hooks/custom/useGenderMaxNumber';
import {
  useDeleteMember,
  useDeleteRoom,
  useUpdateLeaderMemberMutation,
  useUpdateRoomStatusOpen
} from '@/hooks/useMutation/useMeetingMutation';
import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useModalStore } from '@/store/modalStore';
import { GENDERFILTER, ROUTERADDRESS } from '@/utils/constant';
import { useRouter } from 'next/navigation';
import { IoFemale, IoMale } from 'react-icons/io5';

import type { UserType } from '@/types/roomTypes';
import type { UUID } from 'crypto';
function RoomInformation({ roomId }: { roomId: UUID }) {
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id!;
  const { mutate: deleteMemberMutation } = useDeleteMember({ userId, roomId });
  const { mutate: updateRoomStatusOpenMutation } = useUpdateRoomStatusOpen({ roomId, userId });
  const { mutate: deleteRoomMutation } = useDeleteRoom({ roomId, userId });

  const { room_title, member_number, location, feature, region, leader_id } = useRoomInfoWithRoomIdQuery(roomId);
  const participants = useRoomParticipantsQuery(roomId);

  const genderMaxNumber = useGenderMaxNumber(member_number);
  const otherParticipants = participants.filter((person: UserType | null) => person?.user_id !== leader_id);
  const { mutate: updateLeaderMemeberMutation } = useUpdateLeaderMemberMutation({ otherParticipants, roomId });

  const countFemale = participants.filter((member) => member?.gender === GENDERFILTER.FEMALE).length;
  const countMale = participants.length - countFemale;

  //나가기: 로비로
  const gotoLobby = () => {
    openModal({
      type: 'confirm',
      name: '',
      text: `정말 나가시겠습니까?
        나가면 다시 돌아올 수 없습니다!`,
      onFunc: () => {
        if (participants.length / 2 === genderMaxNumber) {
          updateRoomStatusOpenMutation();
        }
        deleteMemberMutation();
        //유저가 리더였다면 다른 사람에게 리더 역할이 승계됩니다.
        if (leader_id === userId && participants.length > 1) {
          updateLeaderMemeberMutation();
        }
        //만약 유일한 참여자라면 나감과 동시에 방은 삭제됩니다.
        if (participants.length === 1) {
          deleteRoomMutation();
        }
        router.push(ROUTERADDRESS.GOTOLOBBY);
        closeModal();
      },
      onCancelFunc: () => {
        closeModal();
      }
    });
    openModal;
  };

  const gotoBack = () => {
    router.push(ROUTERADDRESS.GOTOLOBBY);
  };

  return (
    <div className="flex flex-col items-center justify-content">
      <main className="flex flex-col items-center justify-content min-w-[1116px] max-w-[1440px]">
        <div className="h-[72x] w-full pt-[64px] border-b border-gray2 flex flex-row pb-[32px]">
          <div className="flex flex-row min-w-[1116px] max-w-[1440px] justify-between">
            <section className="flex flex-row justify-center">
              <p className="text-[40px] pr-[32px]">{room_title}</p>

              <figure className="h-[46px] display display-col justify-items-center items-center gap-[8px]">
                <div className="text-[16px] flex flex-row justify-between align-middle justify-items-center mt-[12px]">
                  <IoFemale className="w-[16px] pr-[6px] my-auto fill-hotPink" /> {`${countFemale}/${genderMaxNumber}`}
                  <div className="px-[6px]">|</div>
                  <IoMale className="w-[16px] pr-[6px] my-auto fill-blue" /> {`${countMale}/${genderMaxNumber}`}
                </div>
                <p className="text-[16px]">{`${region} ${location}`}</p>
              </figure>
              <figure className="flex flex-col justify-end">
                <div className="text-[14px] h-[40px] ml-[32px] bg-purpleSecondary text-mainColor rounded-[8px] p-[8px]">
                  {feature && feature[0]}
                </div>
              </figure>
            </section>
            <section className="flex flex-row items-end gap-[16px]">
              <button
                onClick={gotoBack}
                className="w-[90px] h-[43px] text-gray2 border-1 border-gray2 rounded-xl align-bottom"
              >
                뒤로가기
              </button>
              <ValidationModal />
              <button
                className="w-[90px] h-[43px] text-white border-1 bg-gray3 border-gray2 rounded-xl align-bottom"
                onClick={gotoLobby}
              >
                나가기
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomInformation;
