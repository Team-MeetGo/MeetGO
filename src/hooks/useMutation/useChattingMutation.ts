import { addNewLastMsg, fetchMyMsgData, updateMyLastMsg, updateNewMsgNum } from '(@/query/chat/chatQueryFns)';
import { MY_LAST_MSGS_AFTER, MY_MSG_DATA } from '(@/query/chat/chatQueryKeys)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddLastMsg = (chatRoomId: string, roomId: string, user_id: string, last_msg_id: string | undefined) => {
  const queryClient = useQueryClient();
  const { mutate: mutateToAdd } = useMutation({
    mutationFn: () => addNewLastMsg(chatRoomId, roomId, user_id, last_msg_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [MY_LAST_MSGS_AFTER, user_id, chatRoomId] });
    }
  });
  return { mutate: mutateToAdd };
};

export const useUpdateLastMsg = (user_id: string, chatRoomId: string, msg_id: string | undefined) => {
  const queryClient = useQueryClient();
  const { mutate: mutateToUpdate } = useMutation({
    mutationFn: () => updateMyLastMsg(user_id, chatRoomId, msg_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [MY_LAST_MSGS_AFTER, user_id, chatRoomId] });
    }
  });
  return { mutate: mutateToUpdate };
};

export const useUpdateNewMsg = () => {
  const queryClient = useQueryClient();
  const { mutate: mutateNewMsgNum } = useMutation({
    mutationFn: (chatting_room_id: string) => updateNewMsgNum(chatting_room_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_MSG_DATA] });
    }
  });
  return {
    mutate: mutateNewMsgNum
  };
};
