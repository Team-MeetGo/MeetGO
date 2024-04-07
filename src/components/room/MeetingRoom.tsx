'use client';
import participantsHandler from '(@/hooks/custom/participants)';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { userStore } from '(@/store/userStore)';
import { Card, CardBody, Chip } from '@nextui-org/react';
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

  const { room_id, room_status, room_title, member_number, location, feature } = room;
  //특성 입력이 안됐으면 빈칸으로
  if (!feature) return {};

  const addMember = async ({ room_id, member_number }: { room_id: string; member_number: string }) => {
    if (!user) return alert('로그인이 필요한 서비스입니다.');
    // if (!participants) return alert('유효하지 않은 접근입니다.');
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
    console.log('participants', participants);
    // if (!user || user.length === 0) return alert('로그인이 필요한 서비스입니다.');
    // if (!participants || participants.length === 0) return alert('유효하지 않은 접근입니다.');

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
    else if (genderMaxNumber === participatedGenderMember && room_status === '모집중') {
      return alert('해당 성별은 모두 참여가 완료되었습니다.');
    }

    //모든 인원이 다 찼을 경우 모집완료로 변경
    // if (participants.length === genderMaxNumber * 2) {
    //   await clientSupabase.from('room').update({ room_status: '모집종료' }).eq('room_id', room_id);
    // }
  };
  return (
    <div>
      {
        <Card shadow="sm" isPressable>
          <CardBody className="overflow-visible p-0 m-8">
            <main onClick={(e) => addMember({ room_id, member_number })}>
              <div> {room_title} </div>
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
              <div> {location} </div>
              <div> {room_status} </div>
              <div> {member_number}</div>
            </main>
            <div className="flex flex-row gap-12">
              <DeleteMeetingRoom id={room_id} />
              <EditMeetingRoom room={room} />
            </div>
          </CardBody>
        </Card>
      }
    </div>
  );
}

export default MeetingRoom;
