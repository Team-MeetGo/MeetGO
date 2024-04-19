import MeetingRoomList from '@/components/room/LobbyRooms/MeetingRoomList';
import RoomLoading from '@/components/room/RoomLoading';
import { Suspense } from 'react';

const LobbyPage = async () => {
  return (
    <>
      <Suspense fallback={<RoomLoading />}>
        <div className="flex flex-col items-center justify-content">
          <main className="flex flex-col items-center justify-content min-w-[1000px]">
            <MeetingRoomList />
          </main>
        </div>
      </Suspense>
    </>
  );
};

export default LobbyPage;
