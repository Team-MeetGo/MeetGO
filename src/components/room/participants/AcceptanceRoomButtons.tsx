'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import {
  useDeleteMember,
  useDeleteRoom,
  useUpdateLeaderMemberMutation,
  useUpdateRoomStatusOpen
} from '(@/hooks/useMutation/useMeetingMutation)';
import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

import type { UserType } from '(@/types/roomTypes)';

const AcceptanceRoomButtons = ({ room_id }: { room_id: string }) => {
  const router = useRouter();
  const { data: user, isPending, isError } = useGetUserDataQuery();
  const user_id = user?.user_id!;
  const participants = useRoomParticipantsQuery(room_id);
  const { mutate: deleteMemberMutation } = useDeleteMember({ user_id, room_id });
  const updateRoomStatusOpenMutation = useUpdateRoomStatusOpen({ room_id, user_id });
  const { mutate: deleteRoomMutation } = useDeleteRoom({ room_id, user_id });

  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  const leader = roomInformation?.leader_id;
  const otherParticipants = participants?.filter((person: UserType) => person?.user_id !== leader);
  const updateLeaderMemeberMutation = useUpdateLeaderMemberMutation({ otherParticipants, room_id });

  const gotoChattingRoom = async () => {
    if (!user) {
      alert('로그인 후에 이용하세요.');
      router.push('/users/login');
    }

    const { data: alreadyChat } = await clientSupabase
      .from('chatting_room')
      .select('*')
      .eq('room_id', room_id)
      .eq('isActive', true);
    if (alreadyChat && alreadyChat?.length) {
      // 만약 isActive인 채팅방이 이미 있다면 그 방으로 보내기
      router.replace(`/chat/${alreadyChat[0].chatting_room_id}`);
    } else {
      // 없으면 새로 만들어주기
      const { data: chat_room, error } = await clientSupabase
        .from('chatting_room')
        .insert({
          room_id: room_id,
          isActive: true
        })
        .select('chatting_room_id');

      if (chat_room) router.replace(`/chat/${chat_room[0].chatting_room_id}`);
    } // "/chatting_room_id" 로 주소값 변경
  };

  //나가기: 로비로
  const gotoLobby = async () => {
    if (!confirm('정말 나가시겠습니까? 나가면 다시 돌아올 수 없습니다!')) {
      return;
    }
    await updateRoomStatusOpenMutation.mutateAsync();
    await deleteMemberMutation();
    //유저가 리더였다면 다른 사람에게 리더 역할이 승계됩니다.
    if (leader && leader === user_id && participants?.length !== 1) {
      await updateLeaderMemeberMutation.mutateAsync();
    }
    //만약 유일한 참여자라면 나감과 동시에 방은 삭제됩니다.
    if (participants?.length === 1) {
      await deleteRoomMutation();
    }
    router.push(`/meetingRoom`);
  };
  //뒤로가기: 로비로
  window.onpopstate = () => {
    if (confirm('로비로 이동하시겠습니까?')) router.replace('/meetingRoom');
  };

  return (
    <div className="h-100 w-40 flex flex-row justify-end gap-8">
      <button
        onClick={() => {
          gotoLobby();
        }}
      >
        나가기
      </button>
      <button
        // disabled={participants?.length === maximumParticipants ? false : true}
        onClick={() => gotoChattingRoom()}
      >
        go to chat
      </button>
    </div>
  );
};

export default AcceptanceRoomButtons;
