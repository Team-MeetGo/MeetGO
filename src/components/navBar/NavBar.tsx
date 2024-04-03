import { serverSupabase } from '(@/utils/supabase/server)';
import InitUser from '../user/InitUser';

const NavBar = async () => {
  const supabase = serverSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const { data: userData } = await supabase.from('users').select('*').eq('user_id', String(user?.id));
  console.log('유저데이터 =>', userData);
  return (
    <>
      <InitUser userData={userData} />
    </>
  );
};

export default NavBar;
