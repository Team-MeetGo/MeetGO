'use client';

import { Database } from '(@/types/database.types)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

type ParticipantType = Database['public']['Tables']['participants']['Row'];

const RealTimeSubscription = ({ participantInsert }: { participantInsert: ParticipantType[] }) => {
  const [participants, setParticipants] = useState<ParticipantType[]>([]);

  useEffect(() => {
    setParticipants(participantInsert);
  }, [participantInsert]);
  useEffect(() => {
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
          setParticipants([...participants, payload.new as ParticipantType]);
        }
      )
      .subscribe();

    const deletechannels = clientSupabase
      .channel('custom-delete-channel')
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participants' }, (payload) => {
        setParticipants([...participants, payload.new as ParticipantType]);
      })
      .subscribe();

    return () => {
      clientSupabase.removeChannel(channels);
    };
  }, []);
  console.log('participantsReal', participants);

  return (
    <div>
      {participants.map((member) => (
        <div key={member.part_id}>{member.room_id} </div>
      ))}
    </div>
  );
};

export default RealTimeSubscription;
