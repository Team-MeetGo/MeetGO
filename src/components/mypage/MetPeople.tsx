import { userStore } from '(@/store/userStore)';
import { createRequestKakaoId } from '(@/utils/api/authAPI)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

const MetPeople = () => {
  const { user, setUser } = userStore((state) => state);
  const [metPeopleList, setMetPeopleList] = useState([] as any);
  const userId = user && user[0].user_id;

  useEffect(() => {
    const getMetPeople = async () => {
      if (!userId) return;

      // 방 참여자 정보 가져오기
      const { data: roomIdsData } = await clientSupabase.from('participants').select('room_id').eq('user_id', userId);

      if (roomIdsData) {
        const roomIds = roomIdsData.map((room) => room.room_id);

        // 스쳐간 인연들의 ID 가져오기
        const { data: metPeople } = await clientSupabase.from('participants').select('user_id').in('room_id', roomIds);

        if (metPeople) {
          const metPeopleIds = metPeople.map((participant) => participant.user_id);

          // 상대방의 정보 및 상태 가져오기
          const { data: metPeopleDetails } = await clientSupabase
            .from('users')
            .select('*')
            .in('user_id', metPeopleIds)
            .neq('gender', user[0].gender);

          if (metPeopleDetails && metPeopleDetails.length > 0) {
            const metPeopleWithStatus = await Promise.all(
              metPeopleDetails.map(async (personDetails) => {
                const { data: requestsMade } = await clientSupabase
                  .from('kakaoId_request')
                  .select('request_status, created_at')
                  .eq('request_Id', userId)
                  .eq('response_Id', personDetails.user_id)
                  .order('created_at', { ascending: false })
                  .limit(1);

                let requestStatus = '요청전';
                if (requestsMade && requestsMade.length > 0) {
                  requestStatus = requestsMade[0].request_status;
                }

                return {
                  ...personDetails, // 여기서는 personDetails 객체를 스프레드
                  requestStatus
                };
              })
            );

            setMetPeopleList(metPeopleWithStatus);
          }
        }
      }
    };

    getMetPeople();
  }, [user]);

  const onKakaoIdRequest = async (responseId: string) => {
    if (!userId) {
      console.error('사용자 ID가 존재하지 않습니다.');
      return;
    }
    const result = await createRequestKakaoId(userId, responseId);
    if (result) {
      alert('상대방에게 카카오톡ID를 요청하셨습니다!');
      const updatedMetPeopleList = metPeopleList.map((person: any) => {
        if (person.user_id === responseId) {
          return { ...person, requestStatus: '요청중' };
        }
        return person;
      });

      setMetPeopleList(updatedMetPeopleList);
    } else {
      alert('요청 실패.');
    }
  };

  const updateRequestStatus = async (requestId: string, responseId: string, newStatus: string) => {
    const { data, error } = await clientSupabase
      .from('kakaoId_request')
      .update({ request_status: newStatus })
      .match({ request_Id: requestId, response_Id: responseId });

    if (error) {
      console.error('상태 업데이트 실패:', error);
      return false;
    }

    console.log('상태 업데이트 성공:', data);
    return true;
  };

  const handleStatusChange = async (requestId: string, responseId: string, newStatus: string) => {
    const success = await updateRequestStatus(requestId, responseId, newStatus);
    if (success) {
      alert(`${newStatus}하셨습니다.`);
      // 상태 업데이트 후 목록을 새로고침하거나 업데이트하기 위한 로직 추가
      const updatedMetPeopleList = metPeopleList.map((person: any) => {
        if (person.user_id === responseId && person.request_Id === requestId) {
          return { ...person, requestStatus: newStatus };
        }
        return person;
      });

      setMetPeopleList(updatedMetPeopleList);
    }
  };

  console.log(metPeopleList, '이성리스트');

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">스쳐간 인연 리스트</h2>
      <div className="flex items-center gap-4 flex-wrap">
        {metPeopleList.map((person: any, index: any) => (
          <div key={index} className="flex flex-col items-center p-2">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
            <p className="text-sm">{person.nickname}</p>
            {/* 조건 0: 요청전 상태일 때 */}
            {(!person.requestStatus || person.requestStatus === '요청전') && (
              <button className="text-xs" onClick={() => onKakaoIdRequest(person.user_id)}>
                카톡ID 요청
              </button>
            )}
            {/* 조건 1: 내가 요청자이고 요청중 상태일 때 */}
            {userId === person.request_Id && person.requestStatus === '요청중' && <p className="text-xs">요청중</p>}
            {/* 조건 2: 내가 응답자이고 요청중 상태일 때 */}
            {userId === person.response_Id && person.requestStatus === '요청중' && (
              <>
                <button className="text-xs" onClick={() => handleStatusChange(person.request_Id, userId, '수락')}>
                  수락
                </button>
                <button className="text-xs" onClick={() => handleStatusChange(person.request_Id, userId, '거절')}>
                  거절
                </button>
              </>
            )}
            {/* 조건 3 & 4: 수락 상태일 때 상대방의 카톡 Id 표시 */}
            {person.requestStatus === '수락' && <p className="text-xs">카톡ID: {person.kakaoId}</p>}
            {/* 조건 5: 내가 요청자이고 거절 상태일 때 */}
            {userId === person.request_Id && person.requestStatus === '거절' && <p className="text-xs">거절됨</p>}
            {/* 조건 6: 내가 응답자이고 거절 상태일 때 */}
            {userId === person.response_Id && person.requestStatus === '거절' && <p className="text-xs">거절</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetPeople;
