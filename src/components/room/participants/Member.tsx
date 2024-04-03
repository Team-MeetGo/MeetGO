'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import { Database } from '(@/types/database.types)';

import type { UUID } from 'crypto';
type ParticipantType = Database['public']['Tables']['participants']['Row'];

const Member = ({ params }: { params: { id: UUID } }) => {
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  useEffect(() => {
    const participantsList = async () => {
      const { data: participantList } = await clientSupabase.from('participants').select('*').eq('room_id', params.id);

      if (!participantList || participantList === null) return;
      setParticipants(participantList);

      const channels = clientSupabase
        .channel('custom-insert-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'participants'
          },
          (payload) => {
            setParticipants((addMember) => [...addMember, payload.new as ParticipantType]);
          }
        )
        .subscribe();

      const deletechannels = clientSupabase
        .channel('custom-delete-channel')
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participants' }, (payload) => {
          const filterdMember = participants.filter((member) => member.part_id !== payload.old.part_id);
          setParticipants(() => filterdMember);
        })
        .subscribe();

      return () => {
        clientSupabase.removeChannel(channels);
      };
    };
    participantsList();
  }, [params]);
  return (
    <>
      {participants.map((member) => (
        <div key={member.part_id}>{member.user_id} </div>
      ))}
      {/* <RealTimeSubscription participantInsert={participants} /> */}
    </>
  );
};
export default Member;
