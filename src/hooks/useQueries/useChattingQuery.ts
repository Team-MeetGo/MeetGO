import {
  fetchChatData,
  fetchMyChatRoomIds,
  fetchMyLastMsgs,
  fetchParticipants,
  fetchRoomDataWithChatRoomId,
  updateMyLastMsg
} from '(@/query/chat/chatQueryFns)';
import {
  CHATDATA_QUERY_KEY,
  MYCHAT_ROOMIDS,
  MY_LAST_MSGS,
  PARTICIPANTS_QUERY_KEY,
  ROOMDATA_QUERY_KEY
} from '(@/query/chat/chatQueryKeys)';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useRoomDataQuery = (chatRoomId: string) => {
  const { data: room } = useSuspenseQuery({
    queryKey: [ROOMDATA_QUERY_KEY, chatRoomId],
    queryFn: async () => await fetchRoomDataWithChatRoomId(chatRoomId)
  });
  return room;
};

export const useParticipantsQuery = (roomId: string) => {
  const { data: users } = useSuspenseQuery({
    queryKey: [PARTICIPANTS_QUERY_KEY, roomId],
    queryFn: () => fetchParticipants(roomId)
  });
  return users;
};

export const useChatDataQuery = (chatRoomId: string) => {
  const { data: chat } = useSuspenseQuery({
    queryKey: CHATDATA_QUERY_KEY,
    queryFn: async () => await fetchChatData(chatRoomId)
  });
  return chat;
};

export const useMyChatRoomIdsQuery = (userId: string) => {
  const { data: myChatRoomIds } = useSuspenseQuery({
    queryKey: [MYCHAT_ROOMIDS, userId],
    queryFn: async () => await fetchMyChatRoomIds(userId)
  });
  return myChatRoomIds;
};

export const useMyLastMsgs = (user_id: string, chatRoomId: string) => {
  const { data: myLastMsgs } = useSuspenseQuery({
    queryKey: [MY_LAST_MSGS, user_id, chatRoomId],
    queryFn: async () => await fetchMyLastMsgs(user_id, chatRoomId)
  });
  return myLastMsgs;
};

export const useUpdateLastMsg = (user_id: string, chatRoomId: string, msg_id: string | undefined) => {
  const queryClient = useQueryClient();
  const { mutate: mutateToUpdate } = useMutation({
    mutationFn: async () => updateMyLastMsg(user_id, chatRoomId, msg_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [MY_LAST_MSGS, user_id, chatRoomId] });
      console.log('성공!');
    }
  });
  return { mutate: mutateToUpdate };
};
