import { userStore } from '(@/store/userStore)';
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
            <button className="text-xs">카톡ID요청하기</button>
            <p>{person.kakaoId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetPeople;
