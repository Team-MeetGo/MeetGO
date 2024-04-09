import MeetingRoomList from '(@/components/room/MeetingRoomList)';
import { Suspense } from 'react';

const LobbyPage = () => {
  return (
    <>
      <Suspense fallback="이거때문인가">
        <MeetingRoomList />
      </Suspense>
    </>
  );
};

export default LobbyPage;
