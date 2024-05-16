'use client';

import { KAKAOID_REQUEST_QUERY_KEY } from '@/query/user/metPeopleQueryKeys';
import { clientSupabase } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect } from 'react';
import { customErrToast, customLoveToast, customSuccessToast } from '../common/customToast';
import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { useMetPeople } from '@/query/useQueries/useMetPeopleQuery';
import {
  useAcceptKakaoIdMutation,
  useCancelRequestKakaoIdMutation,
  useMetPeopleMutation
} from '@/query/useMutation/useMetPeopleMutation';

const MetPeople = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id ?? '';
  const userGender = user?.gender ?? '';
  const metPeopleList = useMetPeople(userId, userGender);
  const { mutate: requestKakaoMutate } = useMetPeopleMutation();
  const { mutate: acceptKakaoIdMutate } = useAcceptKakaoIdMutation();
  const { mutate: cancelRequestKakaoIdMutate } = useCancelRequestKakaoIdMutation();

  useEffect(() => {
    if (userId) {
      const channel = clientSupabase
        .channel('kakaoId_channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'kakaoId_request', filter: `request_Id=eq.${userId}` },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender] });
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'kakaoId_request', filter: `response_Id=eq.${userId}` },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender] });
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'kakaoId_request', filter: `response_Id=eq.${userId}` },
          (payload) => {
            customLoveToast('스쳐간 인연에게서 카카오톡ID 요청이 왔습니다!');
          }
        )
        .subscribe();

      return () => {
        clientSupabase.removeChannel(channel);
      };
    }
  }, [userId, queryClient]);

  const REQUEST_STATUSE = {
    요청전: { value: '요청전', message: '' },
    요청중: { value: '요청중', message: '' },
    수락: { value: '수락', message: '요청을 수락했습니다.' },
    거절: { value: '거절', message: '요청을 거절하셨습니다.' }
  };

  /** 카카오ID요청하기 버튼 클릭시 실행될 로직(상태 업데이트 및 갱신) */
  const handleKakaoIdRequestClick = (responseId: string) => {
    requestKakaoMutate(
      {
        requestId: userId,
        responseId
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender]
          });
        }
      }
    );
  };

  /** 카카오ID요청에 대한 응답 로직 */
  const handleKakaoIdResponse = (requestId: string, newStatus: '수락' | '거절' | '요청전') => {
    acceptKakaoIdMutate(
      {
        requestId,
        responseId: userId,
        newStatus
      },
      {
        onSuccess: () => {
          if (newStatus === REQUEST_STATUSE.수락.value) {
            customSuccessToast(REQUEST_STATUSE.수락.message);
          }
          if (newStatus === REQUEST_STATUSE.거절.value) {
            customErrToast(REQUEST_STATUSE.거절.message);
          }
          queryClient.invalidateQueries({
            queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender]
          });
        }
      }
    );
  };

  const handleCancelRequest = (responseId: string) => {
    cancelRequestKakaoIdMutate(
      {
        requestId: userId,
        responseId
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender]
          });
        }
      }
    );
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">스쳐간 인연 리스트</h2>
      <div className="flex items-center gap-4 flex-wrap">
        {metPeopleList?.map((person: any, index: any) => (
          <div key={index} className="flex flex-col items-center p-2 gap-2 max-w-40 w-full">
            <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center rounded-full relative bg-gray-300">
              {person.avatar && (
                <Image src={person.avatar} alt="avatar" style={{ objectFit: 'cover' }} fill={true} sizes="400px" />
              )}
            </div>
            <p className="text-sm">{person.nickname}</p>
            {(!person.requestStatus || person.requestStatus === '요청전') && (
              <button
                className="text-xs px-4 py-2 rounded-lg bg-gray3 text-white"
                onClick={() => handleKakaoIdRequestClick(person.user_id)}
              >
                카톡ID 요청
              </button>
            )}
            {userId === person.request_Id && person.requestStatus === '요청중' && (
              <div className="flex gap-2">
                <p className="text-xs px-4 py-2 rounded-lg bg-[#D4D4D8]">요청중</p>
                <button
                  className="text-xs border px-4 py-2 rounded-lg"
                  onClick={() => handleCancelRequest(person.user_id)}
                >
                  취소
                </button>
              </div>
            )}
            {userId === person.response_Id && person.requestStatus === '요청중' && (
              <div className="flex gap-1 relative">
                <button
                  className="text-xs border px-4 py-2 rounded-lg relative"
                  onClick={() => handleKakaoIdResponse(person.user_id, '수락')}
                >
                  수락
                  <span className="absolute flex h-3 w-3 -top-1 -right-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-mainColor"></span>
                  </span>
                </button>

                <button
                  className="text-xs border px-4 py-2 rounded-lg bg-gray-100"
                  onClick={() => handleKakaoIdResponse(person.user_id, '거절')}
                >
                  거절
                </button>
              </div>
            )}
            {person.requestStatus === '수락' && (
              <p className="text-xs border px-4 py-2 rounded-lg border-mainColor text-mainColor">{person.kakaoId}</p>
            )}
            {userId === person.request_Id && person.requestStatus === '거절' && <p className="text-xs">거절됨</p>}
            {userId === person.response_Id && person.requestStatus === '거절' && <p className="text-xs">거절</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetPeople;
