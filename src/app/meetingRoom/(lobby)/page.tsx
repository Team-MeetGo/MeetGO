import MeetingRoomList from '(@/components/room/MeetingRoomList)';
import { serverSupabase } from '(@/utils/supabase/server)';
import { Suspense } from 'react';

const LobbyPage = async () => {
  const supabase = serverSupabase();
  return (
    <>
      <Suspense>
        <MeetingRoomList />
      </Suspense>
    </>
  );
};

export default LobbyPage;
