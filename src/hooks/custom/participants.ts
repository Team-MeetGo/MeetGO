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
  const deleteMember = async (user_id: UUID) => {
    const { error } = await clientSupabase.from('participants').delete().eq('user_id', user_id);
  };
  return { getFemale, deleteMember };
}

export default participants;
