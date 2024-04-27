import InitRoom from '@/components/room/InitRoom';
import AcceptanceRoom from '@/components/room/participants/AcceptanceRoom';

import type { UUID } from 'crypto';

const MemberListPage = async ({ params }: { params: { id: UUID } }) => {
  const roomId = params.id;

  return (
    <>
      <div className="flex flex-col justify-center w-full align-middle">
        <InitRoom roomId={roomId} />
        <AcceptanceRoom roomId={roomId} />
      </div>
    </>
  );
};

export default MemberListPage;
