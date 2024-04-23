import { customErrToast, customSuccessToast } from '@/components/common/customToast';
import { clientSupabase } from '@/utils/supabase/client';

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
  if (error) {
    return console.error('구글 로그인 에러: ', error);
  }
};

export const kakaoLogin = async () => {
  const { data, error } = await clientSupabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: { queryParams: { access_type: 'offline', prompt: 'consent' }, redirectTo: '/' }
  });
  if (error) {
    return console.error('카카오 로그인 에러: ', error);
  }
};

/**회원탈퇴 API */
export const deleteUser = async (userId: string) => {
  const { error } = await clientSupabase.auth.admin.deleteUser(userId);
  if (error) {
    return customErrToast('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
  }
  return customSuccessToast('회원탈퇴가 완료되었습니다.');
};
