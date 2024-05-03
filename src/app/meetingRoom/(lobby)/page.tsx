import LobbySkeleton from '@/components/room/LobbySkeleton';
import LobbyBanner from '@/components/room/lobby/LobbyBanner';
import MeetingRoomList from '@/components/room/lobby/MeetingRoomList';
import { Suspense } from 'react';

const LobbyPage = async () => {
  return (
    <>
      <Suspense fallback={<LobbySkeleton />}>
        <main className="flex flex-col items-center justify-content lg:min-w-[1000px] w-full pb-[24px]">
          <LobbyBanner />
          <MeetingRoomList />
        </main>
      </Suspense>
    </>
  );
};

export default LobbyPage;
