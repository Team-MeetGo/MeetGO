'use client';

import participants from '(@/hooks/custom/participants)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';

function AcceptanceRoomButtons() {
  const router = useRouter();
  const { deleteMember } = participants();

  const gotoMeetingRoom = async () => {
    const { data } = await clientSupabase.auth.getUser();
    console.log('유저데이터 =>', data.user);
    const user = data.user;
    // deleteMember(user?.id);
    router.push(`/meetingRoom`);
  };

  return (
    <div className="h-100 flex flex-col justify-end gap-8">
      <button
        onClick={() => {
          gotoMeetingRoom();
        }}
      >
        나가기
      </button>
      <button
        onClick={() => {
          router.push('/chat');
        }}
      >
        chat on going
      </button>
    </div>
  );
}

export default AcceptanceRoomButtons;
