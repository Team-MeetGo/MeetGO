'use client';
import participantsHandler from '(@/hooks/custom/participants)';
import meetingRoomHandler from '(@/hooks/custom/room)';
import { userStore } from '(@/store/userStore)';
import { Card, CardBody } from '@nextui-org/react';
import DeleteMeetingRoom from './DeleteMeetingRoom';
import EditMeetingRoom from './EditMeetingRoom';

import type { Database } from '(@/types/database.types)';
import { useRouter } from 'next/navigation';
type MeetingRoom = Database['public']['Tables']['room']['Row'];

function MeetingRoom({ room }: { room: MeetingRoom }) {
  const { participants } = userStore((state) => state);
  const { user } = userStore((state) => state);
  const router = useRouter();

  const { room_id, room_status, room_title, member_number, location, feature } = room;

  const { addMemberHandler, userMemberInformation } = participantsHandler();
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const addMember = async ({ room_id, member_number }: { room_id: string; member_number: string }) => {
    if (!user) return alert('로그인이 필요한 서비스입니다.');
    //room의 정보를 가져와서 성별에 할당된 인원을 확인
    const genderMaxNember = await getmaxGenderMemberNumber(member_number);
    if (genderMaxNember === undefined) return alert('최대 성별 오류 다시 시도해 주세요');
    //모든 인원이 다 찼을 경우 모집 종

    //참여자 정보를 가져와서 해당 성별이 안에 몇명 있는지 확인
    const totalMemberList = await userMemberInformation(room_id);
    if (totalMemberList === undefined) return alert('참여 성벌 요류 다시 시도해 주세요');
    const participatedGenderMember = totalMemberList.filter((member) => member.gender === user[0].gender).length;
    //성별에 할당된 인원이 참여자 정보보다 적을 때 입장
    if (genderMaxNember > participatedGenderMember || !participatedGenderMember) {
      await addMemberHandler(room_id);
      router.push(`/meetingRoom/${room_id}`);
    } //성별에 할당된 인원이 다 찼으면 알람
    else return alert('해당 성별은 모두 참여가 완료되었습니다.');
  };
  return (
    <div>
      {
        <Card shadow="sm" isPressable>
          <CardBody className="overflow-visible p-0 m-8">
            <main onClick={() => addMember({ room_id, member_number })}>
              <div> {room_title} </div>
              <div> {feature} </div>
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
