'use client';

import meetingRoomHandler from '@/hooks/custom/room';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { RoomData } from '@/types/chatTypes';
import { UserType } from '@/types/roomTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { IoPlay } from 'react-icons/io5';

const AcceptanceRoomButtons = ({
  roomInformation,
  participants,
  leader
}: {
  roomInformation: RoomData;
  participants: UserType[];
  leader: string;
}) => {
  const router = useRouter();
  const { data: user, isPending, isError } = useGetUserDataQuery();
  const user_id = user?.user_id!;
  const room_id = roomInformation?.room_id;
  const memberNumber = roomInformation?.member_number;
  //원하는 인원이 모두 들어오면 위에서 창이 내려온다.
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const genderParticipants = getmaxGenderMemberNumber(memberNumber ?? '');
  const maxMember = genderParticipants! * 2;

  const gotoChattingRoom = async () => {
    if (!user) {
      alert('로그인 후에 이용하세요.');
      router.push('/login');
    }
    // if (user_id === leader) {
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
    // }
  };

  return (
    <div>
      {user_id === leader && participants?.length === maxMember && (
        <div
          className="
        flex flex-col h-[114px] w-[1116px] justify-center text-center bg-mainColor"
        >
          <button
            disabled={genderParticipants ? (participants?.length === genderParticipants * 2 ? false : true) : false}
            onClick={() => gotoChattingRoom()}
          >
            <div className="flex flex-row justify-center align-middle ">
              <div className="text-[40px] text-white font-bold">MEET GO</div>
              <div className="flex flex-col justify-start">
                <IoPlay className="w-[24px] h-[24px] my-auto fill-white" />
              </div>
            </div>
            <div className="text-[14px] text-white">방장이 여기를 누를 시 채팅방으로 이동합니다.</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default AcceptanceRoomButtons;
