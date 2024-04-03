import AcceptanceRoomButtons from '(@/components/room/participants/AcceptanceRoomButtons)';
import Member from '(@/components/room/participants/Member)';
import RoomInformation from '(@/components/room/participants/RoomInformation)';
import { UUID } from 'crypto';

const memberList = ({ params }: { params: { id: UUID } }) => {
  const roomId = params.id;
  console.log(roomId);
  return (
    <>
      <div className="flex flex-col justify-center w-full align-middle">
        <RoomInformation roomId={roomId} />
        <div className="m-12 h-100 flex flex-row justify-evenly">
          <div className="flex flex-col justify-center gap-4">
            <Member params={params} />
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
          </div>
          <div className="flex flex-col justify-center gap-16 text-xl">
            <div>
              <div>소개</div>
              <div>소개</div>
            </div>
            <div>
              <div>소개</div>
              <div>소개</div>
            </div>
            <div>
              <div>소개</div>
              <div>소개</div>
            </div>
            <div>
              <div>소개</div>
              <div>소개</div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
            <div className="h-28 w-28 bg-indigo-600 rounded-full my-auto"></div>
          </div>
          <AcceptanceRoomButtons />
        </div>
      </div>
    </>
  );
};

export default memberList;
