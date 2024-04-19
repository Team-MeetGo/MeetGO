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
  const roomId = room?.roomId;
  const lastMsgId = useMyLastMsgs(user?.user_id!, chatRoomId);
  const { mutate: mutateClearUnread } = useClearNewMsgNum();

  const { mutate: mutateToUpdate } = useUpdateLastMsg(
    user?.user_id as string,
    chatRoomId as string,
    messages && messages.length > 0 ? messages[messages.length - 1].message_id : undefined
  );
  const { mutate: mutateToAdd } = useAddLastMsg(
    chatRoomId as string,
    roomId as string,
    user?.user_id as string,
    messages && messages.length > 0 ? messages[messages.length - 1].message_id : undefined
  );

  // 마지막으로 읽은 메세지 기억하기(채팅방에서 나갈 때 적용)
  useEffect(() => {
    return () => {
      // 왜 처음에 방을 만들어서 들어간 뒤, 메세지를 남기면 나오기 직전에는 아닌데 나올때는 messages.length가 0이 출력될까?
      // 현재 나누는 메세지가 있을 때
      // 이전에 저장된 마지막 메세지가 있으면 현재 메세지 중 마지막 걸로 업데이트, 없으면 현재 메세지 중 마지막 메세지 추가하기
      if (messages.length) {
        lastMsgId ? mutateToUpdate() : mutateToAdd();
        mutateClearUnread(chatRoomId as string);
      }
    };
  }, []);
  return null;
};

export default RememberLastChat;
