import { clientSupabase } from '(@/utils/supabase/client)';

import type { Database } from '(@/types/database.types)';
import type { UUID } from 'crypto';
type UserType = Database['public']['Tables']['users']['Row'];

function participants() {
  const getTotalMember = async ({ roomId }: { roomId: UUID }) => {
    const { data: getTotalMemberList, error } = await clientSupabase
      .from('participants')
      .select(`*`)
      .eq('room_id', roomId)
      .select(`user_id, users(*)`);

    if (error) return alert('구성원 정보 오류 발생!');
    const totalMemberList: UserType[] = getTotalMemberList.map((member) => {
      return member.users as UserType;
    });
    if (!totalMemberList || totalMemberList.length < 1) return;

    const getFemaleMember = totalMemberList.filter((member) => member.gender === 'female');
    const getMaleMember = totalMemberList.filter((member) => member.gender === 'male');

    return { getFemaleMember, getMaleMember };
  };

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

  const addMemeberHandler = (room_id: string) => {
    const addNewMember = async () => {
      const { data } = await clientSupabase.auth.getUser();
      if (!data.user) {
        return alert('잘못된 접근입니다.');
      }
      const user_id = data.user.id;
      addMemeber({ user_id, room_id });
    };
    return addNewMember();
  };

  return { getTotalMember, deleteMember, addMemeber, addMemeberHandler, totalMember };
}

export default participants;
