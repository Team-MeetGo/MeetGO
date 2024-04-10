'use client';
import { userStore } from '(@/store/userStore)';
import { Database } from '(@/types/database.types)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

import { useRoomInfoWithRoomIdQuery } from '(@/hooks/useQueries/useMeetingQuery)';
type UserType = Database['public']['Tables']['users']['Row'];

const Member = ({ params }: { params: { id: string } }) => {
  const { participants, setParticipants } = userStore((state) => state);
  const [leaderMember, setLeaderMember] = useState('');
  const user_id = params.id;
  const roomInformation = useRoomInfoWithRoomIdQuery(user_id);

  useEffect(() => {
    //리더를 찾아 표시
    const leaderSelector = async () => {
      setLeaderMember(roomInformation ? (roomInformation[0].leader_id as string) : '');
    };

    const channle = clientSupabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants'
        },
        (payload) => {
          setParticipants(participants ? [...participants, payload.new as UserType] : []);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'participants'
        },
        (payload) => {
          const deletePartId = payload.old;
          type test = Awaited<typeof payload.old>;
          const deleteMemeberUserId = async ({ deletePartId }: { deletePartId: test }) => {
            const { data: userData } = await clientSupabase
              .from('participants')
              .select('*')
              .eq('user_id', deletePartId);
            if (!participants || participants.length < 1) return;
            if (!userData || userData.length < 1) return;
            setParticipants(participants?.filter((member) => member.user_id !== userData[0].user_id));
          };
          deleteMemeberUserId({ deletePartId });
        }
      )
      .subscribe();
    leaderSelector();
    return () => {
      clientSupabase.removeChannel(channle);
    };
  }, [params, participants]);
  if (!participants) return;

  return (
    <>
      <div className="gap-2 grid grid-cols-2 m-4 w-100% gap-8">
        {participants.map((member) => (
          <div key={member.user_id}>
            <div className="flex flex-row h-32 w-unit-7xl border-4 rounded-2xl">
              <div className="flex flex-col align-middle justify-start m-1">
                <div className="w-24 h-24 border-4">
                  {leaderMember === member.user_id ? <div>왕관모양</div> : ''}
                  {member.avatar ? <img src={member.avatar as string} alt="유저" /> : ''}
                </div>
                <div className="px-2">{member.nickname}</div>
              </div>
              <div className="flex flex-col w-unit-6xl justify-center align-top gap-1 border-4 px-3">
                <div>{member.school_name}</div>
                <div>{member.favorite}</div>
                <div>{member.intro}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Member;
