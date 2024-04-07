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

export const googleLogin = async () => {
  const { data, error } = await clientSupabase.auth.signInWithOAuth({
    provider: 'google',
    options: { queryParams: { access_type: 'offline', prompt: 'consent' }, redirectTo: '/' }
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

/** 카카오톡ID 요청하기 API */
export const createRequestKakaoId = async (requestId: string, responseId: string) => {
  const { data, error } = await clientSupabase
    .from('kakaoId_request')
    .insert([
      { request_Id: requestId, response_Id: responseId, request_status: '요청중', created_at: new Date().toISOString() }
    ])
    .select('*');

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};
