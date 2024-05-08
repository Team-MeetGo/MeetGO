import MyRoomsTitle from '@/components/room/lobby/MyRoomTitle';
import OtherRoomsTitle from '@/components/room/lobby/OtherRoomsTitle';
import ParticipatingRooms from './ParticipatingRooms';
import RecruitingRooms from './RecruitingRooms';
function MeetingRoomList() {
  return (
    <>
      <MyRoomsTitle>
        <ParticipatingRooms />
      </MyRoomsTitle>
      <OtherRoomsTitle>
        <RecruitingRooms />
      </OtherRoomsTitle>
    </>
  );
}

export default MeetingRoomList;
