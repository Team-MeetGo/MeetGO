'use client';

import participants from '(@/hooks/custom/participants)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';

function AcceptanceRoomButtons() {
  const router = useRouter();
  const { deleteMember } = participants();

  const gotoMeetingRoom = async () => {
    const { data } = await clientSupabase.auth.getUser();
    console.log('유저데이터 =>', data.user);
    if (!data.user) {
      return alert('잘못된 접근입니다.');
    }
    const user_id = data.user.id;
    deleteMember(user_id);
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
