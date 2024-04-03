import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect } from 'react';

const ChatPresence = () => {
  useEffect(() => {
    const channel = clientSupabase.channel('room1');
    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('Synced presence state: ', channel.presenceState());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });
  }, []);
  return <div>ChatPresence</div>;
};

export default ChatPresence;
