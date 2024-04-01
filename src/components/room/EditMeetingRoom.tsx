'use client';
import { Database } from '(@/types/database.types)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useState } from 'react';
import DeleteMeetingRoom from './DeleteMeetingRoom';

type MeetingRoom = Database['public']['Tables']['room']['Row'];

function EditMeetingRoom({ room }: { room: MeetingRoom }) {
  const [isEdition, setIsEdition] = useState(false);
  const completeEdition = () => {
    setIsEdition(false);
  };
  const editMeetingRoom = async () => {
    const { data, error } = await clientSupabase
      .from('room')
      .update({ room_title: '', feature: 'otherValue', location: '', member_number: '' })
      .eq('room_id', room.room_id)
      .select();
  };
  console.log(isEdition);
  return <button onClick={() => setIsEdition(true)}>수정</button>;
}

export default EditMeetingRoom;
