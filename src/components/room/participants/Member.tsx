'use client';

import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

import type { UserType } from '(@/types/roomTypes)';

const Member = ({ room_id }: { room_id: string }) => {
  const participants = useRoomParticipantsQuery(room_id);
  const [members, setMembers] = useState<UserType[]>(participants);
  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  const leaderMember = roomInformation?.leader_id;
  const [leader, setLeader] = useState(leaderMember);

  useEffect(() => {
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
          console.log('payload', payload);
          const { user_id } = payload.new;
          type test = Awaited<typeof payload.new>;
          const addMemeberUserId = async ({ addPartId }: { addPartId: test }) => {
            const { data: newUserData, error } = await clientSupabase
              .from('participants')
              .select(`*`)
              .eq('isDeleted', false)
              .eq('user_id', user_id)
              .select('user_id, users(*)');

            console.log('유저데이터 확인 => ', newUserData);
            console.log('오류 확인 => ', error);

            if (!participants || participants.length < 1) return;
            if (!newUserData || newUserData.length < 1) return;
            setMembers(() => [...participants, newUserData[0].users as UserType]);
          };
          addMemeberUserId({ addPartId: user_id });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'participants'
        },
        (payload) => {
          const { user_id } = payload.new;
          setMembers(members.filter((member) => member.user_id !== user_id));
          if (user_id === leaderMember) {
          }
          const updateLeaderUser = async () => {
            const { data: leader_id, error } = await clientSupabase
              .from('room')
              .select(`*`)
              .eq('room_id', room_id)
              .select('leader_id');

            console.log('유저데이터 확인 => ', leader_id);
            console.log('오류 확인 => ', error);

            if (!participants || participants.length < 1) return;
            if (!leader_id || leader_id.length < 1) return;
            if (leader) {
              const newLeader = leader_id[0].leader_id;
              setLeader(newLeader);
            }
          };
          updateLeaderUser();
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channle);
    };
  }, [members, participants]);
  if (!participants) return;

  return (
    <>
      <div className="gap-2 grid grid-cols-2 m-4 w-100% gap-8">
        {members.map((member) => (
          <div key={member.user_id}>
            <div className="flex flex-row h-32 w-unit-7xl border-4 rounded-2xl">
              <div className="flex flex-col align-middle justify-start m-1">
                <div className="w-24 h-24 border-4">
                  {leader === member.user_id ? <div>왕관모양</div> : ''}
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
