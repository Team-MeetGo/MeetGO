import {
  addMember,
  addRoom,
  deleteMember,
  deleteRoom,
  updateLeaderMember,
  updateRoom,
  updateRoomStatusClose,
  updateRoomStatusOpen
} from '@/query/meetingRoom/meetingQueryFns';
import { MY_PAST_NOW_ROOM, RECRUTING_ROOMDATA, ROOMLIST, ROOM_MEMBER } from '@/query/meetingRoom/meetingQueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { NewRoomType, UpdateRoomType, UserType } from '@/types/roomTypes';

export const useUpdateRoomStatusCloseMutation = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const queryClient = useQueryClient();
  const roomStatusCloseMutation = useMutation({
    mutationFn: async () => await updateRoomStatusClose(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, userId] });
      queryClient.invalidateQueries({ queryKey: [MY_PAST_NOW_ROOM] });
    }
  });
  return roomStatusCloseMutation;
};

export const useUpdateRoomStatusOpen = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const queryClient = useQueryClient();
  const roomStatusOpenMutation = useMutation({
    mutationFn: () => updateRoomStatusOpen(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, userId] });
      queryClient.invalidateQueries({ queryKey: [MY_PAST_NOW_ROOM] });
    }
  });
  return roomStatusOpenMutation;
};

export const useUpdateRoom = ({
  editedMeetingRoom,
  userId
}: {
  editedMeetingRoom: UpdateRoomType;
  userId: string | undefined;
}) => {
  const queryClient = useQueryClient();
  const updateRoomMutation = useMutation({
    mutationFn: async () => await updateRoom(editedMeetingRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMLIST, userId] });
      queryClient.invalidateQueries({ queryKey: [MY_PAST_NOW_ROOM] });
    }
  });
  return updateRoomMutation;
};

export const useDeleteRoom = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const queryClient = useQueryClient();
  const deleteRoomMutation = useMutation({
    mutationFn: () => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMLIST, userId] });
      queryClient.invalidateQueries({ queryKey: [RECRUTING_ROOMDATA] });
      queryClient.invalidateQueries({ queryKey: [MY_PAST_NOW_ROOM] });
    }
  });
  return deleteRoomMutation;
};
export const useAddRoomMutation = () => {
  const roomAddMutation = useMutation({
    mutationFn: ({ nextMeetingRoom, userId }: { nextMeetingRoom: NewRoomType; userId: string }) =>
      addRoom({ nextMeetingRoom, userId })
  });
  return roomAddMutation;
};

export const useAddRoomMemberMutation = ({ userId, roomId }: { userId: string; roomId: string }) => {
  const queryClient = useQueryClient();

  const roomMemberMutation = useMutation({
    mutationFn: () => addMember({ userId, roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, roomId] });
    }
  });
  return roomMemberMutation;
};

export const useDeleteMember = ({ userId, roomId }: { userId: string; roomId: string }) => {
  const queryClient = useQueryClient();

  const deleteMemberMutation = useMutation({
    mutationFn: () => deleteMember({ userId, roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, roomId] });
      queryClient.invalidateQueries({ queryKey: [MY_PAST_NOW_ROOM] });
    }
  });
  return deleteMemberMutation;
};

export const useUpdateLeaderMemberMutation = ({
  otherParticipants,
  roomId
}: {
  otherParticipants: (UserType | null)[] | undefined;
  roomId: string;
}) => {
  const queryClient = useQueryClient();

  const roomLeaderMutation = useMutation({
    mutationFn: () => updateLeaderMember({ otherParticipants, roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, roomId] });
    }
  });
  return roomLeaderMutation;
};
