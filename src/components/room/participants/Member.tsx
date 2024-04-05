'use client';
import { Database } from '(@/types/database.types)';
import { clientSupabase } from '(@/utils/supabase/client)';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { userStore } from '(@/store/userStore)';
import { UserDataFromTable } from '(@/types/userTypes)';
import type { UUID } from 'crypto';
type ParticipantType = Database['public']['Tables']['participants']['Row'];
type UserType = Database['public']['Tables']['users']['Row'];

const Member = ({ params }: { params: { id: UUID } }) => {
  const { participants, setParticipants } = userStore((state) => state);

  useEffect(() => {
    console.log('나 포함 참가자들 =>', participants);
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
          setParticipants(participants ? [...participants, payload.new as UserDataFromTable] : []);
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
          console.log(payload.old);
          const deletePartId = payload.old;
          type test = Awaited<typeof payload.old>;
          const deleteMemeberUserId = async ({ deletePartId }: { deletePartId: test }) => {
            const { data: userData } = await clientSupabase
              .from('participants')
              .select('*')
              .eq('user_id', deletePartId);
            if (!participants || participants.length < 1) return;
            if (!userData || userData.length < 1) return;
            console.log(userData[0]);
            setParticipants(participants?.filter((member) => member.user_id !== userData[0].user_id));
          };
          deleteMemeberUserId({ deletePartId });
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channle);
    };
  }, [params, participants]);
  if (!participants) return;

  return (
    <>
      <div className="flex flex-row justify-center w-full align-middle">
        <div className="m-12 h-100 flex flex-row justify-evenly">
          <div className="flex flex-col justify-start gap-8 bg-slate-300">
            {participants.map((member) => (
              <div key={member.user_id}>
                <div className="flex flex-row">
                  <div className="h-36 w-36 flex flex-col align-middle justify-start m-4">
                    <div className="h-28 w-28 bg-indigo-600 rounded-full">
                      {member.avatar ? <img src={member.avatar as string} alt="유저" /> : ''}
                    </div>
                    <div>{member.nickname}</div>
                    <div>{member.school_name}</div>
                  </div>
                  <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
                    <div>{member.favorite}</div>
                    <div>{member.intro}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="m-12 h-100 flex flex-row justify-evenly">
          <div className="flex flex-col justify-start gap-4 bg-slate-400">
            {participants
              .filter((member) => member.gender === 'male')
              .map((member) => (
                <div key={member.user_id}>
                  <div className="flex flex-row">
                    <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
                      <div>{member.favorite}</div>
                      <div>{member.intro}</div>
                    </div>
                    <div className="h-36 w-36 flex flex-col align-middle justify-start m-4">
                      <div className="h-28 w-28 bg-indigo-600 rounded-full">
                        {member.avatar ? <img src={member.avatar as string} alt="유저" /> : ''}
                      </div>
                      <div>{member.nickname}</div>
                      <div>{member.school_name}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Member;
