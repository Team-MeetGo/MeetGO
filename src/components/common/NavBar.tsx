import { serverSupabase } from '(@/utils/supabase/server)';
import InitUser from '../user/InitUser';
import NavBarContents from './NavBarContents';

const NavBar = async () => {
  // const supabase = serverSupabase();
  // const { data } = await supabase.auth.getUser();
  // const user = data.user;
  // const { data: userData } = await supabase.from('users').select('*').eq('user_id', String(user?.id));
  // console.log('userData', userData);
  return (
    <>
      <InitUser />
      <NavBarContents />
    </>
  );
};

export default NavBar;
