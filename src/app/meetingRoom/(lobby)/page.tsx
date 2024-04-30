import LobbySkeleton from '@/components/room/LobbySkeleton';
import MeetingRoomList from '@/components/room/lobby/MeetingRoomList';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { serverSupabase } from '@/utils/supabase/server';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { Suspense } from 'react';

const LobbyPage = async () => {
  const queryclient = new QueryClient();
  const supabase = serverSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return (
    <>
      <Suspense fallback={<LobbySkeleton />}>
        <main className="flex flex-col items-center justify-content lg:min-w-[1000px] w-full">
          <MeetingRoomList />
        </main>
      </Suspense>
    </>
  );
};

export default LobbyPage;
