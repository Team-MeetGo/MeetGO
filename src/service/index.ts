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
