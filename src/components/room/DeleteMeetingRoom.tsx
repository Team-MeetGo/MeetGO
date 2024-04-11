'use client';

import { useDeleteRoom } from '(@/hooks/useMutation/useMeetingMutation)';
import { clientSupabase } from '(@/utils/supabase/client)';

function DeleteMeetingRoom({ room_id }: { room_id: string }) {
  const deleteRoomMutation = useDeleteRoom({ room_id });
  const DeleteMeetingRoomHandler = async () => {
    await deleteRoomMutation.mutateAsync();
  };

  return <button onClick={DeleteMeetingRoomHandler}>삭제</button>;
}

export default DeleteMeetingRoom;
