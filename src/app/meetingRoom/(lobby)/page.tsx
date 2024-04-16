import MeetingRoomList from '@/components/room/MeetingRoomList';
import { Suspense } from 'react';

const LobbyPage = async () => {
  return (
    <>
      <Suspense>
        <div className="flex flex-col items-center justify-content">
          <main className="flex flex-col items-center justify-content min-w-[1116px] max-w-[1440px]">
            <MeetingRoomList />
          </main>
        </div>
      </Suspense>
    </>
  );
};

export default LobbyPage;
