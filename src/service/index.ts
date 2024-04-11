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
