'use client';

import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

import type { UserType } from '(@/types/roomTypes)';
import { FaCrown } from 'react-icons/fa6';

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
      <div className="flex flex-col items-center justify-content">
        <div className="flex flex-col items-center justify-content min-w-[1116px] max-w-[1440px]">
          <main className="mt-[40px] grid grid-cols-2 grid-rows-4 w-100%">
            <div>
              {members.map((member) => (
                <article
                  key={member.user_id}
                  className="border-purpleThird border-[2px] mb-[50px] flex flex-row w-[506px] h-[166px] rounded-2xl"
                >
                  {/* 카드 왼쪽 */}
                  <div className="mx-[40px] justify-items-center align-middle items-center">
                    <div className="w-[86px] h-[86px] mt-[32px] border-4 mr-[48px] ">
                      {leaderMember === member.user_id ? (
                        <div>
                          <FaCrown className="h-[20px] w-[20px] m-[2px] fill-mainColor" />
                        </div>
                      ) : (
                        ''
                      )}
                      {member.avatar ? <img src={member.avatar as string} alt="유저" /> : ''}
                    </div>
                    <div className="pt-[8px] w-[84px] text-center">{member.nickname}</div>
                  </div>

                  {/* 카드 오른쪽 */}
                  <div className="flex flex-col mt-[32px] mb-[32px]">
                    <div>{member.school_name}</div>
                    <div className="py-[16px] ">{member.favorite}</div>
                    <div>{member.intro}</div>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default Member;
