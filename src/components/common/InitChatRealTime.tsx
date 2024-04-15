'use client';

import { useUpdateNewMsg } from '@/hooks/useMutation/useChattingMutation';
import { useMyMsgData } from '@/hooks/useQueries/useChattingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { useEffect } from 'react';

const InitChatRealTime = () => {
  const { data: user } = useGetUserDataQuery();
  const myMsgData = useMyMsgData(user?.user_id!);
  console.log('myMsgData =>', myMsgData);
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
