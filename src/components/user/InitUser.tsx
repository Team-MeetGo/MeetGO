'use client';

import { userStore } from '(@/store/userStore)';
import { UsersType } from '(@/types/userTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';

const InitUser = ({ user }: { user: User | null }) => {
  console.log(user);
  const { isLoggedIn, setUser } = userStore((state) => state);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData } = await clientSupabase.from('users').select('*').eq('user_id', String(user?.id));
      if (userData && userData[0]) {
        setUser(userData);
      }
      console.log(userData);
    };
    console.log('isLoggedIn', isLoggedIn);
    console.log('user', user);
    // console.log("user", user)
    isLoggedIn && user && fetchUserData();
  }, [user, setUser, isLoggedIn]);
  return <></>;
};

export default InitUser;
