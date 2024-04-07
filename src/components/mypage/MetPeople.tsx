import { userStore } from '(@/store/userStore)';
import { createRequestKakaoId } from '(@/utils/api/authAPI)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

const MetPeople = () => {
  const { user, setUser } = userStore((state) => state);
  const [metPeopleList, setMetPeopleList] = useState([] as any);

  const getMetPeople = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { data: roomIdsData } = await clientSupabase.from('participants').select('room_id').eq('user_id', userId);
    if (roomIdsData) {
      const roomIds = roomIdsData.map((room: any) => room.room_id);
      const { data: metPeople } = await clientSupabase.from('participants').select('user_id').in('room_id', roomIds);
      if (metPeople) {
        const metPeopleIds = metPeople.map((user: any) => user.user_id);
        const { data: otherGenderMembers } = await clientSupabase
          .from('users')
          .select('*')
          .in('user_id', metPeopleIds)
          .neq('gender', user[0].gender);
        setMetPeopleList(otherGenderMembers);
      }
    }
  };

  const getRequestStatus = async (userId: string, personId: string) => {
    const { data, error } = await clientSupabase
      .from('kakaoId_request')
      .select('request_status')
      .eq('request_Id', userId)
      .eq('response_Id', personId)
      .single();

    if (error || !data) {
      console.error(error || '요청상태를 가져오는데 실패했습니다.');
      return null;
    }

    return data.request_status;
  };

  const onKakaoIdRequest = async (responseId: string) => {
    const userId = user && user[0].user_id;
    if (!userId) {
      console.error('사용자 ID가 존재하지 않습니다.');
      return;
    }
    const result = await createRequestKakaoId(userId, responseId);
    if (result) {
      alert('상대방에게 카카오톡ID를 요청하셨습니다!');
    } else {
      alert('요청 실패.');
    }
  };

  useEffect(() => {
    getMetPeople();
  }, [user]);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">스쳐간 인연 리스트</h2>
      <div className="flex items-center gap-4">
        {metPeopleList.map((person: any, index: any) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
            <p className="text-sm">{person.nickname}</p>
            <button className="text-xs" onClick={() => onKakaoIdRequest(person.user_id)}>
              카톡ID요청하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetPeople;
