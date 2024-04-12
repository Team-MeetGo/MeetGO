'use client';

import { useDeleteRoom } from '(@/hooks/useMutation/useMeetingMutation)';

function DeleteMeetingRoom({ room_id }: { room_id: string }) {
  const deleteRoomMutation = useDeleteRoom({ room_id });
  const DeleteMeetingRoomHandler = async () => {
    confirm('정말 삭제하시겠습니까?');
    await deleteRoomMutation.mutateAsync();
  };

  return <button onClick={DeleteMeetingRoomHandler}>삭제</button>;
}

export default DeleteMeetingRoom;
