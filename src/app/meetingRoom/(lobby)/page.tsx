import MeetingRoomList from '(@/components/room/MeetingRoomList)';
import { serverSupabase } from '(@/utils/supabase/server)';
import { Suspense } from 'react';

const LobbyPage = async () => {
  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return (
    <>
      <Suspense>
        <MeetingRoomList user={user} />
      </Suspense>
    </>
  );
};

export default LobbyPage;
