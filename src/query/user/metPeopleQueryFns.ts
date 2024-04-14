import { clientSupabase } from '(@/utils/supabase/client)';

// 요청상태 조회
export async function getMetPeople(userId: string, userGender: string) {
  if (!userId) return [];

  // 방 참여자 정보 가져오기
  const { data: roomIdsData } = await clientSupabase.from('participants').select('room_id').eq('user_id', userId);
  if (!roomIdsData) return [];

  const roomIds = roomIdsData.map((room) => room.room_id);

  // 스쳐간 인연들의 ID 가져오기
  const { data: metPeople } = await clientSupabase.from('participants').select('user_id').in('room_id', roomIds);
  if (!metPeople) return [];

  const metPeopleIds = metPeople.map((participant) => participant.user_id);

  // 상대방의 정보 및 상태 가져오기
  const { data: metPeopleDetails } = await clientSupabase
    .from('users')
    .select('*')
    .in('user_id', metPeopleIds)
    .neq('gender', userGender);

  if (!metPeopleDetails) return [];

  // 상대방의 요청 상태 정보 포함하여 반환
  const metPeopleWithStatus = await Promise.all(
    metPeopleDetails.map(async (personDetails) => {
      // (1) requestId가 나이면서 responseId는 만났던 사람인 경우
      const { data: requestsMade1 } = await clientSupabase
        .from('kakaoId_request')
        .select('request_status, created_at, request_Id, response_Id')
        .eq('request_Id', userId)
        .eq('response_Id', personDetails.user_id)
        .order('created_at', { ascending: false });

      // (2) requestId가 만났던 사람이면서 responseId는 나인 경우
      const { data: requestsMade2 } = await clientSupabase
        .from('kakaoId_request')
        .select('request_status, created_at, request_Id, response_Id')
        .eq('request_Id', personDetails.user_id)
        .eq('response_Id', userId)
        .order('created_at', { ascending: false });

      let requestStatus = '요청전';

      // (1)이 있는 경우
      if (requestsMade1 && requestsMade1.length > 0) {
        requestStatus = requestsMade1[0].request_status;
        const { request_Id, response_Id } = requestsMade1[0];

        return {
          ...personDetails,
          requestStatus,
          request_Id,
          response_Id
        };
      }

      // (2)이 있는 경우
      if (requestsMade2 && requestsMade2.length > 0) {
        requestStatus = requestsMade2[0].request_status;
        const { request_Id, response_Id } = requestsMade2[0];

        return {
          ...personDetails,
          requestStatus,
          request_Id,
          response_Id
        };
      }

      return {
        ...personDetails,
        requestStatus,
        request_Id: null,
        response_Id: null
      };
    })
  );

  return metPeopleWithStatus;
}
