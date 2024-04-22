import InitRoom from '@/components/room/InitRoom';
import AcceptanceRoom from '@/components/room/participants/AcceptanceRoom';
import { Suspense } from 'react';

import type { UUID } from 'crypto';
const MemberListPage = ({ params }: { params: { id: UUID } }) => {
  const room_id = params.id;

  return (
    <>
      <Suspense>
        <div className="flex flex-col justify-center w-full align-middle">
          <InitRoom room_id={room_id} />
          <AcceptanceRoom room_id={room_id} />
        </div>
      </Suspense>
    </>
  );
};

export default MemberListPage;
