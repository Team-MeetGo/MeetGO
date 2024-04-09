'use client';

import { useMetPeopleMutation } from '(@/hooks/useMutation/useMetPeopleMutation)';
import { useMetPeople } from '(@/hooks/useQueries/useMetPeople)';
import { KAKAOID_REQUEST_QUERY_KEY } from '(@/query/user/metPeopleQueryKeys)';
import { userStore } from '(@/store/userStore)';
import { createRequestKakaoId } from '(@/utils/api/authAPI)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

/**
 * useMutation을 이용한 데이터 처리 사용 방법
 * 1. service 폴더에 적절한 supabase의 insert/update/delete를 다루는 함수를 만든다.
 * 2. hooks/useMutation 폴더에 적절한 use~~~~~Mutation 함수를 만든다.
 * 3. 적용하려고 하는 컴포넌트를 client components로 바꾼다 -> "use client";
 * 4. const { mutate: 바꿔줄이름 } = useMetPeopleMutation(); => mutation을 호출한다.2번에서 만든 mutation.
 * 5. 실제 click이 일어나서 데이터를 넣어야 하는 곳에 mutate 함수를 실행한다.
 * 6. 실행이 완료되면(onSuccess), 갱신해야하는 useQuery로 가져온 데이터를 invalidate 처리한다.
 */

const MetPeople = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = userStore((state) => state);
  const userId = user?.[0]?.user_id ?? '';
  const userGender = user?.[0]?.gender ?? '';

  const { mutate: requestKakaoMutate } = useMetPeopleMutation();
  const metPeopleList = useMetPeople(userId, userGender);

  console.log('metPeopleList => ', metPeopleList);

  // const onKakaoIdRequest = async (responseId: string) => {
  //   if (!userId) {
  //     console.error('사용자 ID가 존재하지 않습니다.');
  //     return;
  //   }
  //   const result = await createRequestKakaoId(userId, responseId);
  //   if (result) {
  //     alert('상대방에게 카카오톡ID를 요청하셨습니다!');
  //     const updatedMetPeopleList = metPeopleList.map((person: any) => {
  //       if (person.user_id === responseId) {
  //         return { ...person, requestStatus: '요청중' };
  //       }
  //       return person;
  //     });
  //   } else {
  //     alert('요청 실패.');
  //   }
  // };

  // const handleStatusChange = async (requestId: string, responseId: string, newStatus: string) => {
  //   const success = await updateRequestStatus(requestId, responseId, newStatus);
  //   if (success) {
  //     alert(`${newStatus}하셨습니다.`);
  //     // 상태 업데이트 후 목록을 새로고침하거나 업데이트하기 위한 로직 추가
  //     const updatedMetPeopleList = metPeopleList.map((person: any) => {
  //       if (person.user_id === responseId && person.request_Id === requestId) {
  //         return { ...person, requestStatus: newStatus };
  //       }
  //       return person;
  //     });

  //     setMetPeopleList(updatedMetPeopleList);
  //   }
  // };

  // console.log(metPeopleList, '이성리스트');

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">스쳐간 인연 리스트</h2>
      <div className="flex items-center gap-4 flex-wrap">
        {metPeopleList?.map((person: any, index: any) => (
          <div key={index} className="flex flex-col items-center p-2">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
            <p className="text-sm">{person.nickname}</p>
            {(!person.requestStatus || person.requestStatus === '요청전') && (
              // <button className="text-xs" onClick={() => onKakaoIdRequest(person.user_id)}>
              <button
                className="text-xs"
                onClick={() =>
                  requestKakaoMutate(
                    {
                      requestId: userId,
                      responseId: person.user_id
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: [KAKAOID_REQUEST_QUERY_KEY, userId, userGender]
                        });
                      }
                    }
                  )
                }
              >
                카톡ID 요청
              </button>
            )}
            {userId === person.request_Id && person.requestStatus === '요청중' && <p className="text-xs">요청중</p>}
            {/* {userId === person.response_Id && person.requestStatus === '요청중' && (
              <>
                <button className="text-xs" onClick={() => handleStatusChange(person.request_Id, userId, '수락')}>
                  수락
                </button>
                <button className="text-xs" onClick={() => handleStatusChange(person.request_Id, userId, '거절')}>
                  거절
                </button>
              </>
            )} */}
            {person.requestStatus === '수락' && <p className="text-xs">카톡ID: {person.kakaoId}</p>}
            {userId === person.request_Id && person.requestStatus === '거절' && <p className="text-xs">거절됨</p>}
            {userId === person.response_Id && person.requestStatus === '거절' && <p className="text-xs">거절</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetPeople;
