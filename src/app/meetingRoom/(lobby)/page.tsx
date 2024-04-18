import MeetingRoomList from '@/components/room/MeetingRoomList';
import { Suspense } from 'react';

const LobbyPage = async () => {
  return (
    <>
      <Suspense>
        <div className="flex flex-col items-center justify-content">
          <main className="flex flex-col items-center justify-content">
            <MeetingRoomList />
          </main>
        </div>
      </Suspense>
    </>
  );
};

export default LobbyPage;
