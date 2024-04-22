'use client';

import { useRoomInfoWithRoomIdQuery } from '@/hooks/useQueries/useMeetingQuery';
import { UUID } from 'crypto';
import Member from './Member';
import RoomInformation from './RoomInformation';

function AcceptanceRoom({ room_id }: { room_id: UUID }) {
  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  return (
    <div>
      {roomInformation && (
        <div>
          <RoomInformation room_id={room_id} roomInformation={roomInformation} />
          <div className="w-100 h-100 flex flex-row justify-evenly">
            <Member room_id={room_id} roomInformation={roomInformation} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AcceptanceRoom;
