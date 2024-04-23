'use client';

import { useDeleteRoom } from '@/hooks/useMutation/useMeetingMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';

function DeleteMeetingRoom({
  room_id,
  setOpen
}: {
  room_id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: user } = useGetUserDataQuery();
  const roomId = room_id;
  const userId = user?.user_id!;
  const { mutate: deleteRoomMutation } = useDeleteRoom({ roomId, userId });
  const DeleteMeetingRoomHandler = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteRoomMutation();
      setOpen(false);
    }
  };

  return (
    <button
      className="gap-0 p-0 m-0 h-[31px] w-[76px] rounded-xl text-black text-[16px] bg-white hover:bg-mainColor hover:text-white "
      onClick={DeleteMeetingRoomHandler}
    >
      삭제
    </button>
  );
}

export default DeleteMeetingRoom;
