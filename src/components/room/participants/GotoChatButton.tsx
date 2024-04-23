'use client';

import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { IoPlay } from 'react-icons/io5';
import getmaxGenderMemberNumber from '@/hooks/custom/room';

import type { UUID } from 'crypto';
const GotoChatButton = ({ roomId, leader }: { roomId: UUID; leader: string }) => {
  const router = useRouter();

  const { data: user } = useGetUserDataQuery();
  const roomInformation = useRoomInfoWithRoomIdQuery(roomId);
  const participants = useRoomParticipantsQuery(roomId);

  const userId = user?.user_id!;
  const memberNumber = roomInformation.member_number;
  const genderParticipants = getmaxGenderMemberNumber(memberNumber ?? []);
  const maxMember = genderParticipants! * 2;

  //원하는 인원이 모두 들어오면 위에서 창이 내려온다.
  const gotoChattingRoom = async () => {
    if (!user) {
      alert('로그인 후에 이용하세요.');
      router.push('/login');
    }
    if (userId === leader) {
      const { data: alreadyChat } = await clientSupabase
        .from('chatting_room')
        .select('*')
        .eq('room_id', roomId)
        .eq('isActive', true);
      if (alreadyChat && alreadyChat?.length > 0) {
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
    }
  };

  return (
    <main>
      {userId === leader && participants?.length === maxMember && (
        <figure
          className="
        flex flex-col h-[114px] w-[1116px] justify-center text-center bg-mainColor"
        >
          <button
            disabled={genderParticipants ? (participants?.length === genderParticipants * 2 ? false : true) : false}
            onClick={gotoChattingRoom}
          >
            <div className="flex flex-row justify-center align-middle ">
              <h2 className="text-[40px] text-white font-bold">MEET GO</h2>
              <div className="flex flex-col justify-start">
                <IoPlay className="w-[24px] h-[24px] my-auto fill-white" />
              </div>
            </div>
            <p className="text-[14px] text-white">방장이 여기를 누를 시 채팅방으로 이동합니다.</p>
          </button>
        </figure>
      )}
    </main>
  );
};

export default GotoChatButton;
