'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import RealTimeSubscription from './RealTimeSubscription';
import { Database } from '(@/types/database.types)';
import { UUID } from 'crypto';

type ParticipantType = Database['public']['Tables']['participants']['Row'];

const Member = ({ params }: { params: { id: UUID } }) => {
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  useEffect(() => {
    const participantsList = async () => {
      const { data: participantList } = await clientSupabase.from('participants').select('*').eq('room_id', params.id);

      if (!participantList || participantList === null) return;
      setParticipants(participantList);
    };
    participantsList();
  }, [params]);
  return (
    <>
      <RealTimeSubscription participantInsert={participants} />
    </>
  );
};
export default Member;
