import Member from '@/components/room/participants/Member';
import RoomInformation from '@/components/room/participants/RoomInformation';
import { Suspense } from 'react';
import InitRoom from '@/components/room/InitRoom';

import type { UUID } from 'crypto';
const memberList = ({ params }: { params: { id: UUID } }) => {
  const room_id = params.id;

  return (
    <>
      <Suspense>
        <div className="flex flex-col justify-center w-full align-middle">
          <InitRoom room_id={room_id} />
          <RoomInformation room_id={room_id} />
          <div className="w-100 h-100 flex flex-row justify-evenly">
            <Member room_id={room_id} />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default memberList;
