import { Suspense } from 'react';
import Member from './Member';
import RoomInformation from './RoomInformation';

import type { UUID } from 'crypto';

const AcceptanceRoom = ({ roomId }: { roomId: UUID }) => {
  return (
    <Suspense>
      <RoomInformation roomId={roomId} />
      <Member roomId={roomId} />
    </Suspense>
  );
};

export default AcceptanceRoom;
