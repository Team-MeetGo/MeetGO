'use client';
import { customErrToast } from '@/components/common/customToast';
import { useRoomInformationQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { debounce, genderMemberNumber } from '@/utils/utilFns';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { IoPlay } from 'react-icons/io5';

import type { UserType } from '@/types/roomTypes';
import type { UUID } from 'crypto';
const GotoChatButton = ({ roomId, members }: { roomId: UUID; members: UserType[] }) => {
  const router = useRouter();

  const { data: user } = useGetUserDataQuery();
  const { roomInfoWithId: roomInformation } = useRoomInformationQuery(roomId);

  const genderParticipants = genderMemberNumber(roomInformation.member_number);
  const maxMember = genderParticipants! * 2;

  //원하는 인원이 모두 들어오면 채팅으로 넘어간다.
  const gotoChattingRoom = async () => {
    if (!user) {
      customErrToast('로그인 후에 이용하세요.');
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
    }
  };

  const handleGoChatDebounce = useCallback(debounce(gotoChattingRoom, 500), []);

  return (
    <main className="max-w-[1080px] w-full">
      {
        <figure
          className="
        flex flex-col mt-[1rem] justify-center text-center max-w-[1080px] w-full"
        >
          <button
            disabled={members.length === maxMember ? false : true}
            className={`w-full max-w-[1080px] p-2 ${members.length === maxMember ? 'bg-mainColor' : 'bg-gray1'}`}
            onClick={handleGoChatDebounce}
          >
            <div className="flex flex-row justify-center align-middle gap-[8px]">
              <h2 className="text-[36px] text-white font-semibold">Go to chat</h2>
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
