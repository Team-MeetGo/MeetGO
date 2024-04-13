import { addNewLastMsg, updateMyLastMsg } from '(@/query/chat/chatQueryFns)';
import { MY_LAST_MSGS_AFTER } from '(@/query/chat/chatQueryKeys)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddLastMsg = (chatRoomId: string, user_id: string, last_msg_id: string | undefined) => {
  const queryClient = useQueryClient();
  const { mutate: mutateToAdd } = useMutation({
    mutationFn: () => addNewLastMsg(chatRoomId, user_id, last_msg_id),
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
