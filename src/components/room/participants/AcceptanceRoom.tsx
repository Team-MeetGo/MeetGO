import { Suspense } from 'react';
import Member from './Member';
import RoomInformation from './RoomInformation';

import type { UUID } from 'crypto';

function AcceptanceRoom({ roomId }: { roomId: UUID }) {
  return (
    <>
      <div>
        <Suspense>
          <RoomInformation roomId={roomId} />
          <Member roomId={roomId} />
        </Suspense>
      </div>
    </>
  );
}

export default AcceptanceRoom;
