import meetingRoomHandler from '(@/hooks/custom/room)';
import { UUID } from 'crypto';

function RoomInformation(roomId: UUID) {
  const { getRoomInformation } = meetingRoomHandler();
  const singleRoom = getRoomInformation(roomId);
  return <div>RoomInformation</div>;
}

export default RoomInformation;
