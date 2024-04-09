import { requestKakaoId } from '(@/service)';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// /** 카카오톡ID 요청하기 누르면 DB에 상태 저장하는 API */
// export const createRequestKakaoId = async (requestId: string, responseId: string) => {
//     const { data, error } = await clientSupabase
//       .from('kakaoId_request')
//       .insert([
//         { request_Id: requestId, response_Id: responseId, request_status: '요청중', created_at: new Date().toISOString() }
//       ])
//       .select('*');

//     if (error) {
//       console.error(error);
//       return null;
//     }

//     return data;
//   };

export const useMetPeopleMutation = () =>
  useMutation({
    mutationFn: ({ requestId, responseId }: { requestId: string; responseId: string }) =>
      requestKakaoId(requestId, responseId)
  });

// DB에 스쳐간 인연 중 해당하는 유저(상대방)의 id와 내 id를 response_Id, request_Id에 넣고
// requestStatus의 값을 '요청중'으로 넣는다 (요청하기 버튼을 클릭하면 실행될 로직이라서)
// const MetPeopleContent = () => {
//     const queryClient = useQueryClient();
//     const userId = userStore((state) => state.user?.[0]?.user_id ?? ''); // 여기서 정의해줄지 아니면 걍 매개변수로 받아올지?

// }

// export default MetPeopleContent
