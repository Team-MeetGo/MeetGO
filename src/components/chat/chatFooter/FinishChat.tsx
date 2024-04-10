'use client';

import { useUpdateLastMsg } from '(@/hooks/useQueries/useChattingQuery)';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const FinishChat = () => {
  const pathname = usePathname();
  const user = userStore((state) => state.user);
  const userId = user ? user[0].user_id : '';
  const { chatRoomId, messages } = chatStore((state) => state);
  console.log(messages);

  const { mutate: mutateToUpdate } = useUpdateLastMsg(
    userId,
    chatRoomId as string,
    messages[messages.length - 1].message_id
  );

  useEffect(() => {
    mutateToUpdate();

    return () => {
      console.log('나갈 때');
    };
  }, [pathname]);
  return null;
};

export default FinishChat;
