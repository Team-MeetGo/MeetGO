'use client';

import { clientSupabase } from '(@/utils/supabase/client)';

const SignOut = () => {
  const signOut = async () => {
    const { error } = await clientSupabase.auth.signOut();
    if (!error) console.log('로그아웃');
  };
  return <button onClick={signOut}>로그아웃</button>;
};

export default SignOut;
