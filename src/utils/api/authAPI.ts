import { clientSupabase } from '(@/utils/supabase/client)';

export const getUserId = async () => {
  const {
    data: { user },
    error
  } = await clientSupabase.auth.getUser();
  if (error) {
    return { status: 'fail', result: error } as const;
  }
  return { status: 'success', result: user!.id } as const;
};

export const getUserNickname = async () => {
  const {
    data: { user },
    error
  } = await clientSupabase.auth.getUser();
  if (error) {
    return { status: 'fail', result: error } as const;
  }
  return { status: 'success', result: user?.user_metadata.nickname } as const;
};

// 캐싱처리 하고싶다 = 리액트 쿼리로 쿼리키를 만들어서 일정시간 보관?

export const googleLogin = async () => {
  const { data, error } = await clientSupabase.auth.signInWithOAuth({
    provider: 'google',
    options: { queryParams: { access_type: 'offline', prompt: 'consent' } }
  });
  if (data) {
    return console.log('구글 로그인 성공');
  }
  if (error) {
    return console.error('구글 로그인 에러: ', error);
  }
};

export const kakaoLogin = async () => {
  const { data, error } = await clientSupabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: { queryParams: { access_type: 'offline', prompt: 'consent' } }
  });
  if (data) {
    return console.log('카카오 로그인 성공');
  }
  if (error) {
    return console.error('카카오 로그인 에러: ', error);
  }
};

export const signOut = async () => {
  await clientSupabase.auth.signOut();
  console.log('로그아웃 성공');
};
