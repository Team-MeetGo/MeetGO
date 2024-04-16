'use client';

import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const AcceptanceRoomButtons = ({ room_id }: { room_id: string }) => {
  const router = useRouter();
  const { data: user, isPending, isError } = useGetUserDataQuery();
  const user_id = user?.user_id!;
  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  const leader = roomInformation?.leader_id;

  const gotoChattingRoom = async () => {
    if (!user) {
      alert('로그인 후에 이용하세요.');
      router.push('/login');
    }
    if (user_id === leader) {
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
    }
  };

  return (
    <div className="h-100 w-40 flex flex-row justify-end gap-8">
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
