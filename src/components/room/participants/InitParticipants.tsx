'use client';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect } from 'react';

const InitParticipants = ({ roomId }: { roomId: string }) => {
  const { setParticipants } = userStore((state) => state);

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data: userIds, error: userIdErr } = await clientSupabase
        .from('participants')
        .select('user_id')
        .eq('room_id', String(roomId));
      console.log('채팅방 멤버들', userIds); // 남은 애들

      if (userIds) {
        const users = [];
        for (const id of userIds) {
          const { data, error: usersDataErr } = await clientSupabase
            .from('users')
            .select('*')
            .eq('user_id', String(id.user_id));
          console.log(data);
          if (data) users.push(...data);
        }
        console.log('users', users);
        setParticipants([...users]);
      }
    };
    roomId && fetchParticipants();
  }, []);

  return <></>;
};

export default InitParticipants;
