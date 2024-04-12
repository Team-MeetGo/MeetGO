import AcceptanceRoomButtons from '(@/components/room/participants/AcceptanceRoomButtons)';
import InitParticipants from '(@/components/room/participants/InitParticipants)';
import Member from '(@/components/room/participants/Member)';
import RoomInformation from '(@/components/room/participants/RoomInformation)';
import { UUID } from 'crypto';
import { Suspense } from 'react';

const memberList = ({ params }: { params: { id: string } }) => {
  const room_id = params.id;

  return (
    <>
      <Suspense>
        {/* <InitParticipants room_id={room_id} /> */}
        <div className="flex flex-col justify-center w-full align-middle">
          <RoomInformation room_id={room_id} />
          <AcceptanceRoomButtons room_id={room_id} />
          <div className="w-100 h-100 flex flex-row justify-evenly">
            <Member room_id={room_id} />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default memberList;
