'use client';
import { clientSupabase } from '@/utils/supabase/client';

function meetingRoomHandler() {
  const getmaxGenderMemberNumber = (memberNumber: string) => {
    if (memberNumber === '1:1') {
      return 1;
    } else if (memberNumber === '2:2') {
      return 2;
    } else if (memberNumber === '3:3') {
      return 3;
    } else if (memberNumber === '4:4') {
      return 4;
    }
  };

  return { getmaxGenderMemberNumber };
}

export default meetingRoomHandler;
