'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect } from 'react';

const ChatPresence = ({ roomId }: { roomId: string | undefined }) => {
  useEffect(() => {
    if (roomId) {
      console.log(roomId);
      const channel = clientSupabase.channel(roomId);
      channel
        .on('presence', { event: 'sync' }, () => {
          console.log('Synced presence state: ', channel.presenceState());
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString() });
          }
        });
    }
  }, []);

  return <div>ChatPresence</div>;
};

export default ChatPresence;
