'use client';
import participants from '(@/hooks/custom/participants)';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { UUID } from 'crypto';
import { Database } from '(@/types/database.types)';
type ParticipantType = Database['public']['Tables']['participants']['Row'];

const AcceptanceRoomButtons = ({ roomId }: { roomId: UUID }) => {
  const router = useRouter();
  const [maximumParticipants, setMaximumParticipants] = useState(0);
  const [totalMemberList, setTotalMemberList] = useState<ParticipantType[]>();
  const { deleteMember, totalMember } = participants();
  const { getRoomInformation } = meetingRoomHandler();

  useEffect(() => {
    const getTotalMemeber = async () => {
      const totalMemberList = await totalMember(roomId);
      if (!totalMemberList) return;
      setTotalMemberList(totalMemberList);
    };
    const getSingleRoom = async () => {
      const singleRoom = await getRoomInformation(roomId);
      if (!singleRoom) {
        return;
      }
      if (singleRoom[0].member_number === '1:1') {
        setMaximumParticipants(2);
      } else if (singleRoom[0].member_number === '2:2') {
        setMaximumParticipants(4);
      } else if (singleRoom[0].member_number === '3:3') {
        setMaximumParticipants(6);
      } else if (singleRoom[0].member_number === '4:4') {
        setMaximumParticipants(8);
      }
      if (!totalMemberList) return;
      if (totalMemberList.length > maximumParticipants) {
        return alert('잘못된 접근입니다');
      }
    };
    getSingleRoom();
    getTotalMemeber();
  }, []);

  const gotoChattingRoom = async () => {
    const { data } = await clientSupabase.auth.getUser();
    if (!data.user) {
      return alert('잘못된 접근입니다.');
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
    }

    // "/chatting_room_id" 로 주소값 변경
  };

  const gotoMeetingRoom = async () => {
    const { data } = await clientSupabase.auth.getUser();
    if (!data.user) {
      return alert('잘못된 접근입니다.');
    }
    const user_id = data.user.id;
    deleteMember(user_id);
    router.push(`/meetingRoom`);
  };

  return (
    <div className="h-100 w-16 flex flex-col justify-end gap-8">
      <button
        onClick={() => {
          gotoMeetingRoom();
        }}
      >
        나가기
      </button>
      <button
        // disabled={totalMemberList?.length === maximumParticipants ? false : true}
        onClick={() => gotoChattingRoom()}
      >
        go to chat
      </button>
    </div>
  );
};

export default AcceptanceRoomButtons;
