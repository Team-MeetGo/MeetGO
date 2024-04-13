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

import type { MeetingRoomType, UpdateRoomType, UserType } from '(@/types/roomTypes)';

export const useUpdateRoomStatusClose = ({ room_id }: { room_id: string }) => {
  const roomStatusCloseMutation = useMutation({
    mutationFn: async () => await updateRoomStatusClose(room_id)
  });
  return roomStatusCloseMutation;
};

export const useUpdateRoomStatusOpen = ({ room_id }: { room_id: string }) => {
  const roomStatusOpenMutation = useMutation({
    mutationFn: async () => await updateRoomStatusOpen(room_id)
  });
  return roomStatusOpenMutation;
};

export const useUpdateRoom = () =>
  useMutation({
    mutationFn: (editedMeetingRoom: UpdateRoomType) => updateRoom(editedMeetingRoom)
  });

export const useDeleteRoom = ({ room_id }: { room_id: string }) =>
  useMutation({
    mutationFn: async () => deleteRoom(room_id)
  });

export const useAddRoom = ({ nextMeetingRoom, user_id }: { nextMeetingRoom: MeetingRoomType; user_id: string }) => {
  // const queryClient = useQueryClient();

  const roomAddMutation = useMutation({
    mutationFn: async () => await addRoom({ nextMeetingRoom, user_id })
  });
  return roomAddMutation;
};

export const useAddRoomMemberMutation = ({ user_id, room_id }: { user_id: string; room_id: string }) => {
  const queryClient = useQueryClient();

  const roomMemberMutation = useMutation({
    mutationFn: async () => await addMember({ user_id, room_id })
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ROOM_MEMBER });
    // }
  });
  return roomMemberMutation;
};

export const useDeleteMember = ({ user_id, room_id }: { user_id: string; room_id: string }) => {
  const queryClient = useQueryClient();

  const deleteMemberMutation = useMutation({
    mutationFn: () => deleteMember({ user_id, room_id })
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ROOM_MEMBER });
    // }
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

  const roomLeaderMutation = useMutation({
    mutationFn: async () => await updateLeaderMember({ otherParticipants, room_id })
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ROOM_MEMBER });
    // }
  });
  return roomLeaderMutation;
};
