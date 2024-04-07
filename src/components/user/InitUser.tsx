'use client';

import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect } from 'react';

const InitUser = () => {
  const { isLoggedIn, setIsLoggedIn, setUser } = userStore((state) => state);

  useEffect(() => {
    // isLoggedIn 상태가 변경되거나, 새로고침 했을때 쎄션 유지 중인지 여부에 따라 실행되는 함수
    const fetchUserData = async () => {
      const {
        data: { user }
      } = await clientSupabase.auth.getUser();
      // 쎄션 유지중이면
      if (user) {
        setIsLoggedIn(true); // 새로고침해도 isLoggedIn 상태 true로 유지

        // 쎄션 유지중일 때만 supabase DB에 요청하도록(성능적 효율성)
        const { data: userData } = await clientSupabase.from('users').select('*').eq('user_id', String(user?.id));
        if (userData && userData[0]) {
          setUser(userData);
        }
      } else {
        // 로그아웃하면(= 쎄션 유지 중이 아니면) 유저데이터 null로 변경
        setUser(null);
      }
    };

    // console.log("user", user)
    fetchUserData();
  }, [setUser, isLoggedIn, setIsLoggedIn]);
  return <></>;
};

export default InitUser;
