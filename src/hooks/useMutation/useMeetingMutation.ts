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
import { ROOM, ROOM_MEMBER } from '(@/query/meetingRoom/meetingQueryKeys)';
import { NextMeetingRoomType, UpdateRoomType, UserType } from '(@/types/roomTypes)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateRoomStatusClose = ({ room_id }: { room_id: string }) => {
  const queryClient = useQueryClient();

  const roomStatusCloseMutation = useMutation({
    mutationFn: async () => await updateRoomStatusClose(room_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM });
    }
  });

  return roomStatusCloseMutation;
};

export const useUpdateRoomStatusOpen = ({ room_id }: { room_id: string }) => {
  const queryClient = useQueryClient();

  const roomStatusOpenMutation = useMutation({
    mutationFn: async () => await updateRoomStatusOpen(room_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM });
    }
  });

  return roomStatusOpenMutation;
};

export const useUpdateRoom = ({ title, tags, location, memberNumber, room_id }: UpdateRoomType) => {
  const queryClient = useQueryClient();

  const updateRoomMutation = useMutation({
    mutationFn: async () => await updateRoom({ title, tags, location, memberNumber, room_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM });
    }
  });

  return updateRoomMutation;
};

export const useDeleteRoom = ({ room_id }: { room_id: string }) => {
  const queryClient = useQueryClient();

  const roomDeleteMutation = useMutation({
    mutationFn: async () => await deleteRoom(room_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM });
    }
  });

  return roomDeleteMutation;
};

export const useAddRoom = ({
  nextMeetingRoom,
  user_id
}: {
  nextMeetingRoom: NextMeetingRoomType;
  user_id: string | null;
}) => {
  const queryClient = useQueryClient();

  const roomDeleteMutation = useMutation({
    mutationFn: async () => await addRoom({ nextMeetingRoom, user_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM });
    }
  });

  return roomDeleteMutation;
};

export const useAddRoomMemberMutation = ({ user_id, room_id }: { user_id: string | undefined; room_id: string }) => {
  const queryClient = useQueryClient();

  const roomMemberMutation = useMutation({
    mutationFn: async () => await addMember({ user_id, room_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_MEMBER });
    }
  });

  return roomMemberMutation;
};

export const useDeleteMember = (user_id: string) => {
  const queryClient = useQueryClient();

  const deleteMemberMutation = useMutation({
    mutationFn: async () => await deleteMember({ user_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_MEMBER });
    }
  });

  return deleteMemberMutation;
};

export const useUpdateLeaderMemberMutation = ({
  otherParticipants,
  room_id
}: {
  otherParticipants: UserType[];
  room_id: string;
}) => {
  const queryClient = useQueryClient();

  const roomMemberMutation = useMutation({
    mutationFn: async () => await updateLeaderMember({ otherParticipants, room_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_MEMBER });
    }
  });

  return roomMemberMutation;
};
