'use client';

import { useUpdateLastMsg } from '(@/hooks/useQueries/useChattingQuery)';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const RouteChangeListener = () => {
  const pathname = usePathname();
  const { user } = userStore((state) => state);
  const userId = user?.user_id!;
  const { chatRoomId, messages } = chatStore((state) => state);
  const MychatRoomId = chatRoomId ? chatRoomId : '';
  //   const myLastMsgs = use()
  //   console.log(myLastMsgs)
  console.log('이거봐', messages[messages.length - 1].message_id);

  const { mutate: mutateToUpdate } = useUpdateLastMsg(userId, MychatRoomId, messages[messages.length - 1].message_id);

  useEffect(() => {
    mutateToUpdate();

    return () => {
      console.log('나갈 때');
    };
  }, [pathname]);

  return null;
};

export default RouteChangeListener;
