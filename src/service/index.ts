import { clientSupabase } from '(@/utils/supabase/client)';

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

  console.log('상태 업데이트 성공:', data);
  return;
};

// 프로필 업데이트
export const updateProfile = async (
  userId: string,
  inputNickname: string,
  inputIntro: string,
  inputKakaoId: string,
  inputGender: string
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
  if (nicknameData) {
    alert('이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
    return;
  }

  const { error } = await clientSupabase
    .from('users')
    .update({
      intro: inputIntro,
      kakaoId: inputKakaoId,
      nickname: inputNickname,
      gender: inputGender
    })
    .eq('user_id', userId);
};
