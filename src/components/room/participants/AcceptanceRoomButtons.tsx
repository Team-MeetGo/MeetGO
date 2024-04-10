'use client';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';

import type { UUID } from 'crypto';
import {
  useDeleteMember,
  useDeleteRoom,
  useUpdateLeaderMemberMutation,
  useUpdateRoomStatusOpen
} from '(@/hooks/useMutation/useMeetingMutation)';
import { useParticipantsQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { useRoomInfoWithRoomIdQuery } from '(@/hooks/useQueries/useMeetingQuery)';

const AcceptanceRoomButtons = ({ roomId }: { roomId: UUID }) => {
  const router = useRouter();
  const { user } = userStore((state) => state);
  const user_id = String(user && user[0].user_id);
  const room_id = String(roomId);
  const participants = useParticipantsQuery(roomId);
  const deleteMemberMutation = useDeleteMember({ user_id, room_id });
  const updateRoomStatusOpenMutation = useUpdateRoomStatusOpen({ room_id });
  const deleteRoomMutation = useDeleteRoom({ room_id });

  const roomInformation = useRoomInfoWithRoomIdQuery(roomId);
  const leader = String(roomInformation && roomInformation[0].leader_id);
  const otherParticipants = participants.filter((person) => person.user_id !== leader);
  const updateLeaderMemeberMutation = useUpdateLeaderMemberMutation({ otherParticipants, room_id });

  const gotoChattingRoom = async () => {
    if (!user) {
      alert('로그인 후에 이용하세요.');
      router.push('/users/login');
    }

    const { data: alreadyChat } = await clientSupabase
      .from('chatting_room')
      .select('*')
      .eq('room_id', roomId)
      .eq('isActive', true);
    if (alreadyChat && alreadyChat?.length) {
      // 만약 isActive인 채팅방이 이미 있다면 그 방으로 보내기
      router.replace(`/chat/${alreadyChat[0].chatting_room_id}`);
    } else {
      // 없으면 새로 만들어주기
      const { data: chat_room, error } = await clientSupabase
        .from('chatting_room')
        .insert({
          room_id: roomId,
          isActive: true
        })
        .select('chatting_room_id');
      console.log(chat_room);

      if (chat_room) router.replace(`/chat/${chat_room[0].chatting_room_id}`);
    } // "/chatting_room_id" 로 주소값 변경
  };

  //나가기를 클릭하면 로비로 이동합니다.
  const gotoLobby = async () => {
    confirm('정말 나가시겠습니까? 나가면 다시 돌아올 수 없습니다!');
    await updateRoomStatusOpenMutation.mutateAsync();
    await deleteMemberMutation.mutateAsync();
    //유저가 리더였다면 다른 사람에게 리더 역할이 승계됩니다.
    if (leader && leader === user_id && participants.length !== 1) {
      await updateLeaderMemeberMutation.mutateAsync();
    }
    //만약 유일한 참여자라면 나감과 동시에 방은 삭제됩니다.
    if (participants.length === 1) {
      await deleteRoomMutation.mutateAsync();
    }
    router.push(`/meetingRoom`);
  };

  window.onpopstate = () => {
    gotoLobby();
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
