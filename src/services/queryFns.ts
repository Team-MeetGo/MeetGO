import { clientSupabase } from '(@/utils/supabase/client)';

export const selectMessage = async () => {
  const { data } = await clientSupabase.from('messages').select('*');
  return data;
};
