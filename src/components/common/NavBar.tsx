import { serverSupabase } from '(@/utils/supabase/server)';
import InitUser from '../user/InitUser';
import NavBarContents from './NavBarContents';

const NavBar = async () => {
  const supabase = serverSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: userData } = await supabase.from('users').select('*').eq('user_id', String(user?.id));

  return (
    <>
      <InitUser userData={userData} />
      <NavBarContents />
    </>
  );
};

export default NavBar;
