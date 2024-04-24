import Member from './Member';
import RoomInformation from './RoomInformation';

import type { UUID } from 'crypto';
function AcceptanceRoom({ roomId }: { roomId: UUID }) {
  return (
    <>
      <div>
        <RoomInformation roomId={roomId} />
        <div className="w-100 h-100 flex flex-row justify-evenly">
          <Member roomId={roomId} />
        </div>
      </div>
    </>
  );
}

export default AcceptanceRoom;
