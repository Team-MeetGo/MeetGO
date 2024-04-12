'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import { useRoomInfoWithRoomIdQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { useParticipantsQuery } from '(@/hooks/useQueries/useChattingQuery)';

import type { UserType } from '(@/types/roomTypes)';

const Member = ({ room_id }: { room_id: string }) => {
  const [members, setMembers] = useState<UserType[]>([]);
  const participants = useParticipantsQuery(room_id);
  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  const leaderMember = roomInformation?.leader_id;

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
          setMembers(participants ? [...members, payload.new as UserType] : []);
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
          console.log('payload => ', payload);
          const { user_id } = payload.new;
          type test = Awaited<typeof payload.old>;
          const deleteMemeberUserId = async ({ deletePartId }: { deletePartId: test }) => {
            console.log('deletePartId ==> ', deletePartId);

            const { data: userData, error } = await clientSupabase
              .from('participants')
              .select(
                `
                *,
                users (
                  nickname,
                  gender
                )
              `
              )
              .eq('user_id', user_id);

            console.log('유저데이터 확인 => ', userData);
            console.log('오류 확인 => ', error);

            if (!participants || participants.length < 1) return;
            if (!userData || userData.length < 1) return;
            setMembers(participants?.filter((member) => member.user_id !== userData[0].user_id));
          };
          deleteMemeberUserId({ deletePartId: user_id });
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
