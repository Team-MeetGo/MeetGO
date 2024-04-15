'use client';

import { useUpdateNewMsg } from '@/hooks/useMutation/useChattingMutation';
import { useMyMsgData } from '@/hooks/useQueries/useChattingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

const ChatTest = () => {
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  console.log(user);
  const myMsgData = useMyMsgData(user?.user_id);
  console.log('myMsgData =>', myMsgData);
  // console.log(myMsgData?.map((m) => m.newMsgCount));

  const { mutate: mutateNewMsgNum } = useUpdateNewMsg();
  const [count, setCount] = useState([
    {
      chatting_room_id: 'd2bf4d7e-6338-47f5-8cf9-a5ae054f59da',
      room_id: 'b83f87d4-d673-4d94-9dc0-c50b7a78b40a',
      newMsgCount: 0
    },
    {
      chatting_room_id: '3b041f3f-8e70-4a00-8b92-871ddf14e1f2',
      room_id: 'a4f0dd58-14d3-4e4a-a353-d9e51197d52e',
      newMsgCount: 0
    }
  ]);
  const [arr, setArr] = useState([1, 2]);

  // useEffect(() => {
  //   console.log('얘는 실행되나');
  //   count.forEach((item) => {
  //     const channel = clientSupabase
  //       .channel(item.chatting_room_id)
  //       .on(
  //         'postgres_changes',
  //         {
  //           event: '*',
  //           schema: 'public',
  //           table: 'messages',
  //           filter: `chatting_room_id=eq.${item.chatting_room_id}}`
  //         },
  //         (payload) => {
  //           console.log('payload', payload);
  //           mutateNewMsgNum(item);
  //           // handlePlusMsgCount(item.chatRoomId);
  //         }
  //       )
  //       .subscribe();

  //     return () => {
  //       clientSupabase.removeChannel(channel);
  //     };
  //   });
  // }, []);

  return (
    <div>
      <button onClick={() => mutateNewMsgNum('d2bf4d7e-6338-47f5-8cf9-a5ae054f59da')}>버튼버튼</button>
      <h1>{myMsgData && myMsgData[0].newMsgCount}</h1>
    </div>
  );
};

export default ChatTest;
