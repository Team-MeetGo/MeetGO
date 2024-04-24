import { customErrToast } from '@/components/common/customToast';
import type { UpdateSchoolType } from '@/types/userTypes';
import { clientSupabase } from '@/utils/supabase/client';

// supabase Insert, Delete, Update
export const requestKakaoId = async (requestId: string, responseId: string) => {
  const { data, error } = await clientSupabase
    .from('kakaoId_request')
    .insert([
      { request_Id: requestId, response_Id: responseId, request_status: '요청중', created_at: new Date().toISOString() }
    ])
    .select('*');

  return data;
};

// 요청취소 업데이트
export const cancelRequestKakaoId = async (requestId: string, responseId: string) => {
  const { data, error } = await clientSupabase
    .from('kakaoId_request')
    .update({ request_status: '요청전' })
    .match({ request_Id: requestId, response_Id: responseId });

  return data;
};

// 요청상태 업데이트
export const updateRequestStatus = async (requestId: string, responseId: string, newStatus: string) => {
  const { data, error } = await clientSupabase
    .from('kakaoId_request')
    .update({ request_status: newStatus })
    .match({ request_Id: requestId, response_Id: responseId });

  if (error) {
    console.error('상태 업데이트 실패:', error);
    return;
  }
  return;
};

// 프로필 업데이트
export const updateProfile = async (
  userId: string,
  inputNickname: string,
  inputIntro: string,
  inputKakaoId: string,
  inputGender: string,
  favorite: string[]
) => {
  // 닉네임 중복 유효성 검사
  const { data: nicknameData, error: nicknameError } = await clientSupabase
    .from('users')
    .select('nickname')
    .eq('nickname', inputNickname)
    .not('user_id', 'eq', userId);
  if (nicknameError) {
    console.error('Error fetching:', nicknameError);
    return;
  }
  if (nicknameData && nicknameData.length > 0) {
    customErrToast('이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
    return;
  }

  const { error } = await clientSupabase
    .from('users')
    .update({
      intro: inputIntro,
      kakaoId: inputKakaoId,
      nickname: inputNickname,
      gender: inputGender,
      favorite: favorite
    })
    .eq('user_id', userId);
};

/** 학교 업데이트하는 로직 */
export const updateSchool = async ({ userId, schoolEmail, univName }: UpdateSchoolType) => {
  const { error } = await clientSupabase
    .from('users')
    .update({ school_email: schoolEmail, school_name: univName, isValidate: true })
    .eq('user_id', userId);
  if (error) {
    console.error('Error updating school:', error);
  }
  return;
};

/** 프로필 사진 업데이트 */
export const updateAvatar = async (userId: string, file: File) => {
  if (!userId || !file) {
    console.error('Invalid user ID or file');
    return;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // 파일 업로드
  let { error: uploadError, data: uploadData } = await clientSupabase.storage.from('avatarImg').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true
  });

  if (uploadError) throw new Error('Error uploading file');

  // 파일 URL 가져오기
  const { data: urlData } = await clientSupabase.storage.from('avatarImg').getPublicUrl(filePath);
  const publicURL = urlData.publicUrl;

  // 사용자 프로필 업데이트
  const { error: updateUserError } = await clientSupabase
    .from('users')
    .update({ avatar: publicURL })
    .eq('user_id', userId);

  if (updateUserError) {
    console.error('Error updating user profile:', updateUserError);
    return;
  }
  return publicURL;
};

/**첫 로그인 후 첫 로그인 여부 변경 */
export const updateFirstLogin = async (userId: string) => {
  const { error } = await clientSupabase.from('users').update({ first_login: false }).eq('user_id', userId);
  if (error) {
    console.error('Error updating first login:', error);
  }
  return;
};
