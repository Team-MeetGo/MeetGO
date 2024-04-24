'use client';
import { useAddLastMsg, useClearNewMsgNum, useUpdateLastMsg } from '@/hooks/useMutation/useChattingMutation';
import { useMyLastMsgs, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { useEffect } from 'react';

const RememberLastChat = () => {
  const { data: user } = useGetUserDataQuery();
  const { chatRoomId, messages } = chatStore((state) => state);
  const room = useRoomDataQuery(chatRoomId as string);
  const lastMsgId = useMyLastMsgs(user?.user_id!, chatRoomId);
  const { mutate: mutateClearUnread } = useClearNewMsgNum();

  const { mutate: mutateToUpdate } = useUpdateLastMsg(
    user?.user_id as string,
    chatRoomId as string,
    messages && messages.length > 0 ? messages[messages.length - 1].message_id : undefined
  );
  const { mutate: mutateToAdd } = useAddLastMsg(
    chatRoomId as string,
    room?.room_id as string,
    user?.user_id as string,
    messages && messages.length > 0 ? messages[messages.length - 1].message_id : undefined
  );

  // 마지막으로 읽은 메세지 기억하기(채팅방에서 나갈 때만 적용: 의존성 빈배열)
  useEffect(() => {
    return () => {
      if (messages.length) {
        lastMsgId ? mutateToUpdate() : mutateToAdd();
        mutateClearUnread(chatRoomId as string);
      }
    };
  }, []);
  return null;
};

export default RememberLastChat;
