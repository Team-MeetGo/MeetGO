'use client';
import participantsHandler from '(@/hooks/custom/participants)';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { userStore } from '(@/store/userStore)';
import { Chip } from '@nextui-org/react';
import DeleteMeetingRoom from './DeleteMeetingRoom';
import EditMeetingRoom from './EditMeetingRoom';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';

import type { MeetingRoomType } from '(@/types/roomTypes)';

function MeetingRoom({ room }: { room: MeetingRoomType }) {
  const { user } = userStore((state) => state);
  const router = useRouter();
  const { addMemberHandler, totalMember, userMemberInformation } = participantsHandler();
  const { getmaxGenderMemberNumber } = meetingRoomHandler();

  const { room_id, room_status, room_title, member_number, location, feature, leader_id } = room;

  const addMember = async ({ room_id, member_number }: { room_id: string; member_number: string }) => {
    //채팅창으로 넘어갔을 경우에는 채팅창으로 이동
    const { data: alreadyChat } = await clientSupabase
      .from('chatting_room')
      .select('*')
      .eq('room_id', room_id)
      .eq('isActive', true);
    if (alreadyChat && alreadyChat?.length) {
      // 만약 isActive인 채팅방이 이미 있다면 그 방으로 보내기
      router.replace(`/chat/${alreadyChat[0].chatting_room_id}`);
    }

    //아직 인원을 모집중인 경우 + 채팅창이 열리지 않은 경우
    const participants = await totalMember(room_id);

    //수락창인 단계에서 내가 이미 방에 참여하고 있는 경우
    if (participants?.find((member) => member.user_id === user[0].user_id)) {
      router.push(`/meetingRoom/${room_id}`);
    }

    //room의 정보를 가져와서 성별에 할당된 인원을 확인
    const genderMaxNumber = await getmaxGenderMemberNumber(member_number);
    if (genderMaxNumber === undefined) return alert('최대 성별 오류 다시 시도해 주세요');

    //참여자 정보를 가져와서 해당 성별이 안에 몇명 있는지 확인
    const totalMemberList = await userMemberInformation(room_id);
    if (totalMemberList === undefined) return alert('참여 성벌 요류 다시 시도해 주세요');
    const participatedGenderMember = totalMemberList.filter((member) => member.gender === user[0].gender).length;

    //성별에 할당된 인원이 참여자 정보보다 적을 때 입장
    if (genderMaxNumber > participatedGenderMember || !participatedGenderMember) {
      await addMemberHandler(room_id);
      router.push(`/meetingRoom/${room_id}`);
    }

    //성별에 할당된 인원이 다 찼으면 알람
    if (genderMaxNumber === participatedGenderMember && room_status === '모집중') {
      alert('해당 성별은 모두 참여가 완료되었습니다.');
      // router.back();
    }

    //모든 인원이 다 찼을 경우 모집종료로 변경
    if (participants?.length === genderMaxNumber * 2) {
      await clientSupabase.from('room').update({ room_status: '모집종료' }).eq('room_id', room_id);
    }
  };

  return (
    <div>
      <div className="border-gray-950 border-1 w-100% h-full rounded-xl">
        <div className="">
          <div className="flex flex-row justify-between align-middle text-sm">
            <div>정보 </div>
            {user[0].user_id === leader_id ? (
              <div>
                <DeleteMeetingRoom id={room_id} />
                <EditMeetingRoom room={room} />
              </div>
            ) : null}
          </div>
          <main className="m-2 p-2 h-100%" onClick={(e) => addMember({ room_id, member_number })}>
            <div className="flex flex-row justify-between">
              <div> {room_title} </div>
              <div className="text-sm"> {location} </div>
            </div>
            <div className="text-sm">
              <div> {room_status} </div>
              <div> {member_number}</div>
            </div>
            <div>
              {Array.from(feature).map((value) => (
                <Chip
                  key={value}
                  color="default"
                  style={{ backgroundColor: favoriteOptions.find((option) => option.value === value)?.color }}
                >
                  {value}
                </Chip>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;
