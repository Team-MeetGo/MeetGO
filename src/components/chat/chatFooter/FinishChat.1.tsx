'use client';
import { useUpdateLastMsg } from '(@/hooks/useQueries/useChattingQuery)';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';

export const FinishChat = () => {
  const user = userStore((state) => state.user);
  const userId = user ? user[0].user_id : '';
  const { chatRoomId, messages } = chatStore((state) => state);
  //   const myLastMsgs = use()
  //   console.log(myLastMsgs)
  const { mutate: mutateToUpdate } = useUpdateLastMsg(userId, chatRoomId, messages[messages.length - 1].message_id);

  useEffect(() => {
    mutateToUpdate();

    return () => {
      console.log('나갈 때');
    };
  }, [pathname]);
  return <div>FinishChat</div>;
};
