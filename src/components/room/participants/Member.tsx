'use client';

import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { IoFemale, IoMale } from 'react-icons/io5';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';

import type { UserType } from '(@/types/roomTypes)';

const Member = ({ room_id }: { room_id: string }) => {
  const participants = useRoomParticipantsQuery(room_id);
  const [members, setMembers] = useState<UserType[]>(participants);
  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  const leaderMember = roomInformation?.leader_id;
  const [leader, setLeader] = useState(leaderMember);
  const femaleMembers = members.filter((member) => member.gender === 'female');
  const maleMembers = members.filter((member) => member.gender === 'male');

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
          const { user_id } = payload.new;
          type test = Awaited<typeof payload.new>;
          const addMemeberUserId = async ({ addPartId }: { addPartId: test }) => {
            const { data: newUserData, error } = await clientSupabase
              .from('participants')
              .select(`*`)
              .eq('isDeleted', false)
              .eq('user_id', user_id)
              .select('user_id, users(*)');
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
      <div className="flex flex-col items-center justify-content align-middle">
        <div className="flex flex-row gap-[100px] items-center justify-content align-middle min-w-[1116px] max-w-[1440px]">
          <main className="mt-[40px] grid grid-cols-1 grid-rows-4 w-100% gap-y-[25px]">
            {femaleMembers.map((member) => (
              <div key={member.user_id} className={`grid col-start-1 col-span-1`}>
                <article
                  className={`border-purpleThird border-[2px] mb-[50px] flex flex-row w-[506px] h-[166px] rounded-2xl`}
                >
                  {/* 카드 왼쪽 */}
                  <div className="mx-[40px] align-middle items-center">
                    <div className="w-[86px] h-[86px] mt-[32px] border-4 mr-[48px] rounded-full relative">
                      {leaderMember === member.user_id ? (
                        <div>
                          <FaCrown className="absolute h-[20px] w-[20px] m-[2px] fill-mainColor z-50" />
                        </div>
                      ) : (
                        ''
                      )}
                      <div className="object-cover my-auto rounded-full overflow-hidden">
                        {member.avatar ? (
                          <img
                            className="w-[86px] h-[86px] object-cover object-center bg-cover"
                            src={member.avatar as string}
                            alt="유저"
                          />
                        ) : (
                          <div className="w-100% h-100% object-cover object-center bg-cover">
                            {/* <AvatarDefault /> */}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-[8px] w-[100px] text-center">{member.nickname}</div>
                  </div>

                  {/* 카드 오른쪽 */}
                  <div className="flex flex-col mt-[32px] mb-[32px]">
                    <div className="flex flex-row gap text-[16px]">
                      <div>{member.school_name}</div>
                      {<IoFemale className="w-[16px] fill-hotPink" />}
                    </div>
                    <div className="flex flex-row w-100% text-[14px] gap-[8px] w-[200px]">
                      <div className="my-[16px] bg-purpleSecondary color: text-mainColor rounded-xl ">
                        {member.favorite}
                      </div>
                    </div>
                    <div className="text-[14px]">{member.intro}</div>
                  </div>
                </article>
              </div>
            ))}
          </main>

          <main className="mt-[40px] grid grid-cols-1 grid-rows-4 w-100% gap-x-[100px] gap-y-[25px]">
            {maleMembers.map((member) => (
              <div key={member.user_id} className={`grid col-start-1 col-span-1`}>
                <article className={`bg-purpleSecondary mb-[50px] flex flex-row w-[506px] h-[166px] rounded-2xl`}>
                  {/* 카드 왼쪽 */}
                  <div className="mx-[40px] align-middle items-center">
                    <div className="w-[86px] h-[86px] mt-[32px] border-4 mr-[48px] rounded-full relative">
                      {leaderMember === member.user_id ? (
                        <div>
                          <FaCrown className="absolute h-[20px] w-[20px] m-[2px] fill-mainColor z-50" />
                        </div>
                      ) : (
                        ''
                      )}
                      <div className="object-cover my-auto rounded-full overflow-hidden">
                        {member.avatar ? (
                          <img
                            className="w-full h-full object-cover object-center bg-cover"
                            src={member.avatar as string}
                            alt="유저"
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="pt-[8px] w-[100px] text-center">{member.nickname}</div>
                  </div>

                  {/* 카드 오른쪽 */}
                  <div className="flex flex-col mt-[32px] mb-[32px]">
                    <div className="flex flex-row gap text-[16px]">
                      <div>{member.school_name}</div>
                      {<IoMale className="w-[16px] fill-blue" />}
                    </div>
                    <div className="flex flex-row w-100% text-[14px] gap-[8px] w-[200px]">
                      <div className="my-[16px] bg-purpleSecondary color: text-mainColor rounded-xl ">
                        {member.favorite}
                      </div>
                    </div>
                    <div className="text-[14px]">{member.intro}</div>
                  </div>
                </article>
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
};
export default Member;
