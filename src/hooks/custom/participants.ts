import { clientSupabase } from '(@/utils/supabase/client)';
import { UUID } from 'crypto';

function participants() {
  const getFemale = async () => {
    const { data: getFemale, error } = await clientSupabase
      .from('participants')
      .select(`*, user (user_id)`)
      .eq('gender', 'woman')
      .order('created_at', { ascending: false });
    if (error) return alert('error 발생!');
    return getFemale;
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

  return { getFemale, deleteMember, addMemeber, addMemeberHandler, totalMember };
}

export default participants;
