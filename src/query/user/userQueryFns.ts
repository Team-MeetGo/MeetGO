import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';

export const fetchUserData = async () => {
  // 유저 데이터 가져오기
  const {
    data: { user }
  } = await clientSupabase.auth.getUser();

  console.log('userQueryFns => ', user);

  if (user) {
    const { data: userData } = await clientSupabase.from('users').select('*').eq('user_id', String(user.id));
    if (userData) return userData[0];
  }
  return null;
};
