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
  const roomInformation = useRoomInfoWithRoomIdQuery(roomId);

  const participants = useRoomParticipantsQuery(roomId);

  const genderMaxNumber = useGenderMaxNumber(roomInformation?.member_number as string);
  const otherParticipants = participants?.filter(
    (person: UserType | null) => person?.user_id !== roomInformation?.leader_id
  );
  const { mutate: updateLeaderMemeberMutation } = useUpdateLeaderMemberMutation({ otherParticipants, roomId });

  const countFemale = participants!.filter((member: any) => member?.gender === GENDERFILTER.FEMALE).length;
  const countMale = participants!.length - countFemale;

  //나가기: 로비로
  const gotoLobby = () => {
    openModal({
      type: 'confirm',
      name: '',
      text: `정말 나가시겠습니까?
        나가면 다시 돌아올 수 없습니다!`,
      onFunc: () => {
        if (participants && participants.length / 2 === genderMaxNumber) {
          updateRoomStatusOpenMutation();
        }
        deleteMemberMutation();
        //유저가 리더였다면 다른 사람에게 리더 역할이 승계됩니다.
        if (participants && roomInformation?.leader_id === userId && participants.length > 1) {
          updateLeaderMemeberMutation();
        }
        //만약 유일한 참여자라면 나감과 동시에 방은 삭제됩니다.
        if (participants?.length === 1) {
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
      <main className="flex flex-col items-center justify-content lg:w-[1116px] lg:max-w-[1440px] max-sm:w-[22rem]">
        <div className="h-[72x] w-full lg:pt-[64px] max-sm:pt-[2rem] border-b border-gray2 flex flex-row lg:pb-[32px] max-sm:pb-[1rem] max-sm:px-[1rem]">
          <div className="flex flex-row lg:w-[1116px] lg:max-w-[1440px] justify-between max-sm:w-[22rem]">
            <section className="flex lg:flex-row max-sm:flex-col max-sm:gap-[0.3rem] justify-center ">
              <p className="lg:text-[40px] max-sm:text-[1.8rem] pr-[32px]">{roomInformation?.room_title}</p>

              <figure className="lg:h-[46px] max-sm:h-[4rem] display display-col justify-items-center items-center gap-[8px]">
                <div className="text-[16px] flex flex-row mt-[12px]">
                  <IoFemale className="w-[16px] pr-[6px] my-auto fill-hotPink" /> {`${countFemale}/${genderMaxNumber}`}
                  <div className="px-[6px]">|</div>
                  <IoMale className="w-[16px] pr-[6px] my-auto fill-blue" /> {`${countMale}/${genderMaxNumber}`}
                </div>
                <p className="text-[16px]">{`${roomInformation?.region} ${roomInformation?.location}`}</p>
              </figure>
              <figure className="flex flex-col lg:justify-end max-sm:justify-start">
                <div className="lg:text-[14px] max-sm:text-[1rem] text-center lg:h-[40px] lg:ml-[32px] max-sm:ml-0 bg-purpleSecondary text-mainColor lg:rounded-[8px] max-sm:rounded-lg lg:p-[8px] max-sm:p-[0.5rem]">
                  {roomInformation?.feature && roomInformation?.feature[0]}
                </div>
              </figure>
            </section>
            <section className="flex flex-row lg:items-end max-sm:items-center gap-[16px]">
              <button
                onClick={gotoBack}
                className="lg:w-[90px] max-sm:w-[5rem] lg:h-[43px] max-sm:h-[2.2rem] max-sm:text-[1rem] rounded-xl max-sm:rounded-lg text-gray2 border-1 border-gray2 align-bottom"
              >
                뒤로가기
              </button>
              <ValidationModal />
              <button
                className="lg:w-[90px] max-sm:w-[5rem] lg:h-[43px] max-sm:h-[2.2rem] max-sm:text-[1rem] rounded-xl max-sm:rounded-lg text-white border-1 bg-gray3 border-gray2 align-bottom"
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
