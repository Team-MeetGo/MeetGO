'use client';

import { useRoomInfoWithRoomIdQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { IoPlay } from 'react-icons/io5';
import useGenderMaxNumber from '@/hooks/custom/useGenderMaxNumber';

import type { UUID } from 'crypto';
import type { UserType } from '@/types/roomTypes';
import { useCallback } from 'react';
import { debounce } from '@/utils';
const GotoChatButton = ({ roomId, members }: { roomId: UUID; members: UserType[] }) => {
  const router = useRouter();

  const { data: user } = useGetUserDataQuery();
  const { member_number } = useRoomInfoWithRoomIdQuery(roomId);

  const genderParticipants = useGenderMaxNumber(member_number);
  const maxMember = genderParticipants! * 2;

  //원하는 인원이 모두 들어오면 위에서 창이 내려온다.
  const gotoChattingRoom = async () => {
    if (!user) {
      alert('로그인 후에 이용하세요.');
      router.push('/login');
    }
    const { data: alreadyChat } = await clientSupabase
      .from('chatting_room')
      .select('*')
      .eq('room_id', roomId)
      .eq('isActive', true);
    if (alreadyChat && alreadyChat.length > 0) {
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
      if (error) console.error('fail tp make new Chatting Room', error.message);
      if (chat_room) router.replace(`/chat/${chat_room[0].chatting_room_id}`);
    } // "/chatting_room_id" 로 주소값 변경
  };

  const handleGoChatDebounce = useCallback(debounce(gotoChattingRoom, 1500), []);

  return (
    <main>
      {
        <figure
          className="
        flex flex-col h-[114px] w-[1116px] justify-center text-center"
        >
          <button
            disabled={members.length === maxMember ? false : true}
            className={`${members.length === maxMember ? 'bg-mainColor' : 'bg-gray1'}`}
            onClick={gotoChattingRoom}
          >
            <div className="flex flex-row justify-center align-middle gap-[8px]">
              <h2 className="text-[40px] text-white font-bold">Go to chat</h2>
              <IoPlay className="w-[24px] h-[24px] my-auto fill-white" />
            </div>
            <p className="text-[14px] text-white">인원이 다 차면 이 버튼을 누르세요.</p>
          </button>
        </figure>
      }
    </main>
  );
};

export default GotoChatButton;
