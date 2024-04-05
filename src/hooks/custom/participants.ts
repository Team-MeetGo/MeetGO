import { clientSupabase } from '(@/utils/supabase/client)';

import type { Database } from '(@/types/database.types)';
import type { UUID } from 'crypto';
type UserType = Database['public']['Tables']['users']['Row'];

function participants() {
  const totalMember = async (room_id: string) => {
    let { data: totalParticipants, error } = await clientSupabase
      .from('participants')
      .select('*')
      .eq('room_id', room_id);
    return totalParticipants;
  };

  const deleteMember = async (user_id: string) => {
    const { error } = await clientSupabase.from('participants').delete().eq('user_id', user_id);
  };

  const addMemeber = async ({ user_id, room_id }: { user_id: string; room_id: string }) => {
    const { data, error } = await clientSupabase.from('participants').insert([{ user_id, room_id }]);
  };

  const addMemeberHandler = async (room_id: string) => {
    const { data } = await clientSupabase.auth.getUser();
    if (!data.user) {
      return alert('잘못된 접근입니다.');
    }
    const user_id = data.user.id;
    addMemeber({ user_id, room_id });
  };

  return { deleteMember, addMemeber, addMemeberHandler, totalMember };
}

export default participants;
