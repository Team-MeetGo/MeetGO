import { clientSupabase } from '(@/utils/supabase/client)';

import type { Database } from '(@/types/database.types)';
import type { UUID } from 'crypto';
type UserType = Database['public']['Tables']['users']['Row'];

function participantsHandler() {
  const totalMember = async (room_id: string) => {
    let { data: totalParticipants, error } = await clientSupabase
      .from('participants')
      .select('*')
      .eq('room_id', room_id);
    return totalParticipants;
  };

  const userMemberInformation = async (roomId: string) => {
    const { data: userIds, error: userIdErr } = await clientSupabase
      .from('participants')
      .select('user_id')
      .eq('room_id', String(roomId));
    console.log('채팅방 멤버들', userIds); // 남은 애들

    if (userIds) {
      const users = [];
      for (const id of userIds) {
        const { data, error: usersDataErr } = await clientSupabase
          .from('users')
          .select('*')
          .eq('user_id', String(id.user_id));
        console.log(data);
        if (data) users.push(...data);
      }
      console.log('users', users);
      return users;
    }
  };

  const deleteMember = async (user_id: string) => {
    const { error } = await clientSupabase.from('participants').delete().eq('user_id', user_id);
  };

  const addMember = async ({ user_id, room_id }: { user_id: string; room_id: string }) => {
    const { data, error } = await clientSupabase.from('participants').insert([{ user_id, room_id }]);
  };

  const addMemberHandler = (room_id: string) => {
    const addNewMember = async () => {
      const { data } = await clientSupabase.auth.getUser();
      if (!data.user) {
        return alert('잘못된 접근입니다.');
      }
      const user_id = data.user.id;
      addMember({ user_id, room_id });
    };
    return addNewMember();
  };

  return { deleteMember, addMember, addMemberHandler, totalMember, userMemberInformation };
}

export default participantsHandler;
