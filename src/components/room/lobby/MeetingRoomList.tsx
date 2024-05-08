import MyRoomsTitle from '@/components/room/lobby/MyRoomTitle';
import OtherRoomsTitle from '@/components/room/lobby/OtherRoomsTitle';
import ParticipatingRooms from './ParticipatingRooms';
import RecruitingRooms from './RecruitingRooms';
const MeetingRoomList = () => {
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
};

export default MeetingRoomList;
