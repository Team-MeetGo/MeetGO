'use client';
import { useUpdateNewMsg } from '@/hooks/useMutation/useChattingMutation';
import { clientSupabase } from '@/utils/supabase/client';
import { useEffect } from 'react';

const InitChatRealTime = () => {
  const { mutate: mutateNewMsgNum } = useUpdateNewMsg();

  useEffect(() => {
    const channel = clientSupabase
      .channel('new_Message_Count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          mutateNewMsgNum(payload.new.chatting_room_id);
        }
      )
      .subscribe();

    return () => {
      clientSupabase.removeChannel(channel);
    };
  }, [mutateNewMsgNum]);
  return null;
};

export default InitChatRealTime;
