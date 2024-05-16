'use client';

import { useModalStore } from '@/store/modalStore';
import { ValidationModal } from '@/components/common/ValidationModal';
import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { useDeleteRoom } from '@/query/useMutation/useMeetingMutation';

const DeleteMeetingRoom = ({
  room_id,
  setOpen
}: {
  room_id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: user } = useGetUserDataQuery();
  const roomId = room_id;
  const userId = user?.user_id!;
  const { openModal, closeModal } = useModalStore();
  const { mutate: deleteRoomMutation } = useDeleteRoom({ roomId, userId });
  const DeleteMeetingRoomHandler = () => {
    openModal({
      type: 'confirm',
      name: '',
      text: `정말 삭제하시겠습니까?`,
      onFunc: () => {
        deleteRoomMutation();
        setOpen(false);
        closeModal();
      },
      onCancelFunc: () => {
        closeModal();
      }
    });
    openModal;
  };

  return (
    <>
      <ValidationModal />
      <button
        className="gap-0 p-0 m-0 h-[31px] w-[76px] rounded-xl text-black text-[16px] bg-white hover:bg-mainColor hover:text-white "
        onClick={DeleteMeetingRoomHandler}
      >
        삭제
      </button>
    </>
  );
};

export default DeleteMeetingRoom;
