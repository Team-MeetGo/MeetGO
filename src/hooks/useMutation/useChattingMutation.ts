import {
  addNewLastMsg,
  clearUnReadMsgNum,
  handleSubmit,
  updateMyLastMsg,
  updateNewMsgNum
} from '@/query/chat/chatQueryFns';
import { MSGS_QUERY_KEY, MY_LAST_MSGS_AFTER, MY_MSG_DATA } from '@/query/chat/chatQueryKeys';
import { Message } from '@/types/chatTypes';
import { UsersType } from '@/types/userTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 새로운 메세지 추가
export const useAddNewMsg = () => {
  const { mutate: addNewMsg } = useMutation({
    mutationFn: ({
      user,
      chatRoomId,
      message,
      imgs
    }: {
      user: UsersType | null | undefined;
      chatRoomId: string | null;
      message: string;
      imgs: File[];
    }) => handleSubmit(user, chatRoomId, message, imgs)
  });
  return { mutate: addNewMsg };
};

export const useAddLastMsg = (chatRoomId: string, roomId: string, user_id: string, last_msg_id: string | undefined) => {
  const queryClient = useQueryClient();
  const { mutate: mutateToAdd } = useMutation({
    mutationFn: () => addNewLastMsg(chatRoomId, roomId, user_id, last_msg_id),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [MY_LAST_MSGS_AFTER, user_id, chatRoomId] })
  });
  return { mutate: mutateToAdd };
};

export const useUpdateLastMsg = (user_id: string, chatRoomId: string, msg_id: string | undefined) => {
  const queryClient = useQueryClient();
  const { mutate: mutateToUpdate } = useMutation({
    mutationFn: () => updateMyLastMsg(user_id, chatRoomId, msg_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MY_LAST_MSGS_AFTER, user_id, chatRoomId] })
  });
  return { mutate: mutateToUpdate };
};

export const useUpdateNewMsg = () => {
  const queryClient = useQueryClient();
  const { mutate: mutateNewMsgNum } = useMutation({
    mutationFn: (chatting_room_id: string) => updateNewMsgNum(chatting_room_id),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [MY_MSG_DATA] })
  });
  return {
    mutate: mutateNewMsgNum
  };
};

export const useClearNewMsgNum = () => {
  const queryClient = useQueryClient();
  const { mutate: mutateClearUnread } = useMutation({
    mutationFn: (chatting_room_id: string) => clearUnReadMsgNum(chatting_room_id),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [MY_MSG_DATA] })
  });
  return { mutate: mutateClearUnread };
};
