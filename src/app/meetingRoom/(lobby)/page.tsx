import LobbySkeleton from '@/components/room/LobbySkeleton';
import LobbyBanner from '@/components/room/lobby/LobbyBanner';
import MeetingRoomList from '@/components/room/lobby/MeetingRoomList';
import { Suspense } from 'react';

const LobbyPage = async () => {
  return (
    <>
      <Suspense fallback={<LobbySkeleton />}>
        <LobbyBanner />
        <main className="flex flex-col items-center justify-content min-w-[1000px]">
          <MeetingRoomList />
        </main>
      </Suspense>
    </>
  );
};

export default LobbyPage;
