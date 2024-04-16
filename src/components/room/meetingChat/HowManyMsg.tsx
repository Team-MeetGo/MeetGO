'use client';

import { useMyChatRoomIdsQuery } from '@/hooks/useQueries/useChattingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { useCallback, useEffect, useState } from 'react';

const HowManyMsg = () => {
  const { data: user } = useGetUserDataQuery();
  const myChatRoomIds = useMyChatRoomIdsQuery(user?.user_id!);
  console.log(myChatRoomIds);
  const [countArr, setCountArr] = useState(Array(myChatRoomIds.length).fill(0));
  console.log(countArr);

  const handleCount = useCallback(
    (idx: number) => {
      const newCountArr = [...countArr];
      newCountArr[idx] = countArr[idx] + 1;
      setCountArr(newCountArr);
    },
    [countArr]
  );

  useEffect(() => {
    myChatRoomIds.forEach((id, idx) => {
      const channel = clientSupabase
        .channel(id)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chatting_room_id=eq.${id}`
          },
          (payload) => {
            console.log('payload', payload);
            handleCount(idx);
          }
        )
        .subscribe();

      return () => {
        clientSupabase.removeChannel(channel);
      };
    });
  }, [myChatRoomIds, handleCount]);

  return (
    <div>
      <button onClick={() => handleCount(1)}>카운트</button>
    </div>
  );
};

export default HowManyMsg;
