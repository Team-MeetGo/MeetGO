import LobbySkeleton from '@/components/room/LobbySkeleton';
import LobbyBanner from '@/components/room/lobby/LobbyBanner';
import MeetingRoomList from '@/components/room/lobby/MeetingRoomList';
import ThinBanner from '@/utils/banner/ThinBanner';
import { serverSupabase } from '@/utils/supabase/server';
import { Suspense } from 'react';

const LobbyPage = async () => {
  const supabase = serverSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return (
    <>
      <Suspense fallback={<LobbySkeleton />}>
        <ThinBanner />
        <main className="flex flex-col items-center justify-content lg:min-w-[1000px] w-full pb-[24px]">
          <LobbyBanner />
          <MeetingRoomList />
        </main>
      </Suspense>
    </>
  );
};

export default LobbyPage;
