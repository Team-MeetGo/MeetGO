'use client';

import { clientSupabase } from '(@/utils/supabase/client)';

function DeleteMeetingRoom({ id }: { id: string }) {
  const DeleteMeetingRoomHandler = async () => {
    const { error } = await clientSupabase.from('room').delete().eq('room_id', id);
  };

  return <button onClick={DeleteMeetingRoomHandler}>삭제</button>;
}

export default DeleteMeetingRoom;
