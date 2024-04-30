'use client';

import GotoChatButton from '@/components/room/participants/GotoChatButton';
import useGenderMaxNumber from '@/hooks/custom/useGenderMaxNumber';
import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { GENDERFILTER } from '@/utils/constant';
import { RoomFemaleAvatar, RoomMaleAvatar } from '@/utils/icons/RoomAvatar';
import { clientSupabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { IoFemale, IoMale } from 'react-icons/io5';
import HollowFemaleMemberCard from './HollowFemaleMemberCard';
import HollowMaleMemberCard from './HollowMaleMemberCard';

import type { UserType } from '@/types/roomTypes';
import type { UUID } from 'crypto';

const Member = ({ roomId }: { roomId: UUID }) => {
  const roomInformation = useRoomInfoWithRoomIdQuery(roomId);
  const participants = useRoomParticipantsQuery(roomId);

  const [members, setMembers] = useState<UserType[]>(participants as UserType[]);
  const [leader, setLeader] = useState(roomInformation?.leader_id as string);

  const genderMaxNumber = useGenderMaxNumber(roomInformation?.member_number as string);
  const femaleMembers = members.filter((member) => member.gender === GENDERFILTER.FEMALE);
  const maleMembers = members.filter((member) => member.gender === GENDERFILTER.MALE);
  const hollowFemaleArray = Array.from({ length: (genderMaxNumber as number) - femaleMembers.length }, (_, i) => i);
  const hollowMaleArray = Array.from({ length: (genderMaxNumber as number) - maleMembers.length }, (_, i) => i);

  useEffect(() => {
    setLeader(roomInformation?.leader_id!);
  }, [roomInformation?.leader_id]);

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
            console.error('오류 확인 => ', error);
            if (!participants || participants.length < 1) return;
            if (!newUserData || newUserData.length < 1) return;
            setMembers((participants) => [...participants, newUserData[0].users as UserType]);
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
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'room'
        },
        (payload) => {
          const { leader_id } = payload.new;
          setLeader(leader_id);
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channle);
    };
  }, [members, participants, roomInformation?.leader_id]);

  return (
    <div className="w-100 h-100 flex flex-row justify-evenly">
      <div className="flex flex-col items-center justify-content">
        <section className="w-full max-w-[1080px]">
          <GotoChatButton roomId={roomId} members={members} />
        </section>
        <section className="flex lg:flex-row flex-col lg:gap-[100px] gap-[2rem] lg:min-w-[1080px] w-[22rem] items-center justify-content align-middle ">
          <section
            className={`lg:mt-[40px] mt-[2rem] grid grid-cols-1 grid-rows-${femaleMembers.length} w-100% lg:gap-y-[50px] gap-y-[0.8rem]`}
          >
            {femaleMembers.map((member) => (
              <div key={member.user_id} className={`grid col-start-1 col-span-1`}>
                <article
                  className={`border-purpleThird border-[2px] flex flex-row align-middle lg:w-[490px] w-[20rem] lg:h-[166px] h-[8rem] rounded-2xl`}
                >
                  {/* 카드 왼쪽 */}
                  <div className="lg:mx-[40px] mx-[1rem] lg:h-[86px] w-[5rem] flex flex-col justify-items-center">
                    <figure className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] lg:mt-[32px] mt-[0.8rem] rounded-full relative">
                      {leader === member.user_id ? (
                        <div>
                          <FaCrown className="absolute h-[20px] w-[20px] m-[2px] fill-mainColor z-10 top-[-18px] left-[29px]" />
                        </div>
                      ) : (
                        ''
                      )}
                      {member.avatar ? (
                        <Image
                          className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] rounded-full object-center bg-cover object-fill"
                          src={member.avatar}
                          alt="유저 아바타"
                          height={86}
                          width={86}
                          sizes="100px"
                        />
                      ) : (
                        <figure className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] rounded-full object-center bg-cover object-fill">
                          <RoomFemaleAvatar />
                        </figure>
                      )}
                      <p className="lg:pt-[8px] pt-[0.4rem] w-full lg:text-[16px] text-[0.9rem] text-center">
                        {member.nickname}
                      </p>
                    </figure>
                  </div>

                  {/* 카드 오른쪽 */}
                  <div className="flex flex-col justify-center w-100%">
                    <div className="flex flex-row text-[16px]">
                      <h2 className="pr-[4px]">{member.school_name}</h2>
                      {<IoFemale className="w-[14px] my-auto fill-hotPink" />}
                    </div>
                    <figure className="flex flex-row w-100% text-[14px] w-100%">
                      <div className="lg:my-[16px] my-[0.5rem] flex flex-row gap-[6px]">
                        {member.favorite?.map((tag) => (
                          <div
                            key={tag}
                            className="bg-purpleSecondary text-mainColor lg:text-[14px] text-[0.7rem] rounded-[8px] lg:p-[8px] p-[0.3rem]"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </figure>
                    <h2 className="text-[14px]">{member.intro}</h2>
                  </div>
                </article>
              </div>
            ))}
            <HollowFemaleMemberCard array={hollowFemaleArray} />
          </section>

          <section
            className={`lg:mt-[40px] mt-[2rem] grid grid-cols-1 grid-rows-${maleMembers.length} w-100% lg:gap-y-[50px] gap-y-[0.8rem] lg:mb-0 mb-[4rem]`}
          >
            {maleMembers.map((member) => (
              <div key={member.user_id} className={`grid col-start-1 col-span-1`}>
                <article
                  className={`bg-purpleSecondary flex flex-row align-middle lg:w-[490px] w-[20rem] lg:h-[166px] h-[8rem] rounded-2xl`}
                >
                  {/* 카드 왼쪽 */}
                  <div className="lg:mx-[40px] mx-[1rem] w-[5rem] flex flex-col items-center justify-content align-middle">
                    <figure className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] lg:mt-[32px] mt-[0.8rem] rounded-full relative">
                      {leader === member.user_id ? (
                        <div>
                          <FaCrown className="absolute h-[20px] w-[20px] m-[2px] fill-mainColor z-10 top-[-20px] left-[30px]" />
                        </div>
                      ) : (
                        ''
                      )}
                      {member.avatar ? (
                        <Image
                          className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] rounded-full object-center bg-cover object-fill"
                          src={member.avatar}
                          alt="유저 아바타"
                          height={80}
                          width={80}
                          sizes="100px"
                        />
                      ) : (
                        <figure className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] rounded-full object-center bg-cover object-fill">
                          <RoomMaleAvatar />
                        </figure>
                      )}
                      <p className="lg:pt-[8px] pt-[0.4rem] w-full lg:text-[16px] text-[0.9rem] text-center">
                        {member.nickname}
                      </p>
                    </figure>
                  </div>

                  {/* 카드 오른쪽 */}
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-row gap text-[16px]">
                      <h2 className="pr-[4px]">{member.school_name}</h2>
                      {<IoMale className="w-[14px] my-auto fill-blue" />}
                    </div>
                    <figure className="flex flex-row w-full">
                      <div className="lg:my-[16px] my-[0.5rem] flex flex-row gap-[6px]">
                        {member.favorite?.map((tag) => (
                          <div
                            key={tag}
                            className="bg-white text-mainColor lg:text-[14px] text-[0.7rem] rounded-[8px] lg:p-[8px] p-[0.3rem]"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </figure>
                    <h2 className="text-[14px]">{member.intro}</h2>
                  </div>
                </article>
              </div>
            ))}
            <HollowMaleMemberCard array={hollowMaleArray} />
          </section>
        </section>
      </div>
    </div>
  );
};
export default Member;
