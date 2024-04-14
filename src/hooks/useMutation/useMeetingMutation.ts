import {
  addMember,
  addRoom,
  deleteMember,
  deleteRoom,
  updateLeaderMember,
  updateRoom,
  updateRoomStatusClose,
  updateRoomStatusOpen
} from '(@/query/meetingRoom/meetingQueryFns)';
import { ROOMLIST, ROOM_MEMBER } from '(@/query/meetingRoom/meetingQueryKeys)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { NewRoomType, UpdateRoomType, UserType } from '(@/types/roomTypes)';

export const useUpdateRoomStatusClose = ({ room_id, user_id }: { room_id: string; user_id: string }) => {
  const queryClient = useQueryClient();
  const roomStatusCloseMutation = useMutation({
    mutationFn: async () => await updateRoomStatusClose(room_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMLIST, user_id] });
    }
  });
  return roomStatusCloseMutation;
};

export const useUpdateRoomStatusOpen = ({ room_id, user_id }: { room_id: string; user_id: string }) => {
  const queryClient = useQueryClient();
  const roomStatusOpenMutation = useMutation({
    mutationFn: async () => await updateRoomStatusOpen(room_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMLIST, user_id] });
    }
  });
  return roomStatusOpenMutation;
};

export const useUpdateRoom = ({
  editedMeetingRoom,
  user_id
}: {
  editedMeetingRoom: UpdateRoomType;
  user_id: string;
}) => {
  const queryClient = useQueryClient();
  const updateRoomMutation = useMutation({
    mutationFn: async () => await updateRoom(editedMeetingRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMLIST, user_id] });
    }
  });
  return updateRoomMutation;
};

export const useDeleteRoom = ({ room_id, user_id }: { room_id: string; user_id: string }) => {
  const queryClient = useQueryClient();
  const deleteRoomMutation = useMutation({
    mutationFn: async () => deleteRoom(room_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ROOMLIST, user_id] });
    }
  });
  return deleteRoomMutation;
};
export const useAddRoom = ({ nextMeetingRoom, user_id }: { nextMeetingRoom: NewRoomType; user_id: string }) => {
  const queryClient = useQueryClient();

  const roomAddMutation = useMutation({
    mutationFn: async () => await addRoom({ nextMeetingRoom, user_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMLIST, user_id] });
    }
  });
  return roomAddMutation;
};

export const useAddRoomMemberMutation = ({ user_id, room_id }: { user_id: string; room_id: string }) => {
  const queryClient = useQueryClient();

  const roomMemberMutation = useMutation({
    mutationFn: async () => await addMember({ user_id, room_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, room_id] });
    }
  });
  return roomMemberMutation;
};

export const useDeleteMember = ({ user_id, room_id }: { user_id: string; room_id: string }) => {
  const queryClient = useQueryClient();

  const deleteMemberMutation = useMutation({
    mutationFn: () => deleteMember({ user_id, room_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, room_id] });
    }
  });
  return deleteMemberMutation;
};

export const useUpdateLeaderMemberMutation = ({
  otherParticipants,
  room_id
}: {
  otherParticipants: UserType[] | undefined | null;
  room_id: string;
}) => {
  const queryClient = useQueryClient();

  const roomLeaderMutation = useMutation({
    mutationFn: () => updateLeaderMember({ otherParticipants, room_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_MEMBER, room_id] });
    }
  });
  return roomLeaderMutation;
};
