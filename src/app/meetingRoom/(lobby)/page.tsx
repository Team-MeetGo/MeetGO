import LobbySkeleton from '@/components/room/LobbySkeleton';
import MeetingRoomList from '@/components/room/lobby/MeetingRoomList';
import { Suspense } from 'react';

const LobbyPage = async () => {
  return (
    <>
      <Suspense fallback={<LobbySkeleton />}>
        <MeetingRoomList />
      </Suspense>
    </>
  );
};

export default LobbyPage;
