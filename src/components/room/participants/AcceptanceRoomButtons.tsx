'use client';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
<<<<<<< HEAD
import type { UUID } from 'crypto';
=======

import participantsHandler from '(@/hooks/custom/participants)';
>>>>>>> 133859f4e71b77b61895e517ec5f6550312b277c
import { Database } from '(@/types/database.types)';
import type { UUID } from 'crypto';
type ParticipantType = Database['public']['Tables']['participants']['Row'];

const AcceptanceRoomButtons = ({ roomId }: { roomId: UUID }) => {
  const router = useRouter();
  const [maximumParticipants, setMaximumParticipants] = useState(0);
  const [totalMemberList, setTotalMemberList] = useState<ParticipantType[]>();
  const { deleteMember, totalMember } = participantsHandler();
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
      //총 인원수가 최대 인원수와 같다면 방 상태는 모집완료로 변경됩니다.
      if (totalMemberList.length === maximumParticipants) {
        await clientSupabase.from('room').update({ room_status: '모집완료' }).eq('roomId', roomId).select();
      }
    };
    getSingleRoom();
    getTotalMemeber();
  }, []);

  const gotoChattingRoom = async () => {
    const { data } = await clientSupabase.auth.getUser();
<<<<<<< HEAD

    //로그인된 유저가 아니면 채팅창에 접근이 불가합니다.
    if (!data.user) {
      return alert('잘못된 접근입니다.');
    }

    //선택창이 채팅창으로 전환됩니다.
    const { data: changeTochattingRoom, error: changeGoingChat } = await clientSupabase
      .from('room')
      .update({ going_chat: true })
      .eq('roomId', roomId)
      .select();

    //채팅창이 생성됩니다.
    const { data: chat_room, error } = await clientSupabase
      .from('chatting_room')
      .insert({
        room_id: roomId,
        isActive: true
      })
      .select('chatting_room_id');
    console.log(chat_room);

    //채팅창으로 입장합니다.
    if (chat_room) router.replace(`/chat/${chat_room[0].chatting_room_id}`); // "/chatting_room_id" 로 주소값 변경
=======
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
    } // "/chatting_room_id" 로 주소값 변경
>>>>>>> dev
  };

  const gotoMeetingRoom = async () => {
    const { data } = await clientSupabase.auth.getUser();
    //로그인된 유저가 아니라면 이 경로는 잘못된 경로입니다.
    if (!data.user) {
      return alert('잘못된 접근입니다.');
    }
    //나가기를 누르면 유저의 정보가 참가자 테이블에서 삭제됩니다.
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
