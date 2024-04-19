'use client';

import { useRoomInfoWithRoomIdQuery, useRoomParticipantsQuery } from '@/hooks/useQueries/useMeetingQuery';
import { clientSupabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { IoFemale, IoMale } from 'react-icons/io5';
import meetingRoomHandler from '@/hooks/custom/room';
import { RoomFemaleAvatar, RoomMaleAvatar } from '@/utils/icons/RoomAvatar';
import MeetGoLogoPurple from '../../../utils/icons/meetgo-logo-purple.png';
import Image from 'next/image';

import type { UserType } from '@/types/roomTypes';
import AcceptanceRoomButtons from './AcceptanceRoomButtons';
import { RoomData } from '@/types/chatTypes';
const Member = ({ room_id }: { room_id: string }) => {
  const participants = useRoomParticipantsQuery(room_id as string);
  const [members, setMembers] = useState<UserType[]>(participants as UserType[]);
  const { data: roomInformation } = useRoomInfoWithRoomIdQuery(room_id);
  const leaderMember = roomInformation?.leader_id;
  const [leader, setLeader] = useState(leaderMember as string);
  const femaleMembers = members.filter((member) => member.gender === 'female');
  const maleMembers = members.filter((member) => member.gender === 'male');
  const memberNumber = roomInformation?.member_number;
  const { getmaxGenderMemberNumber } = meetingRoomHandler();
  const genderMaxNumber = getmaxGenderMemberNumber(memberNumber as string);
  const hollowFemaleArray = Array.from({ length: (genderMaxNumber as number) - femaleMembers.length }, (vi, i) => i);
  const hollowMaleArray = Array.from({ length: (genderMaxNumber as number) - maleMembers.length }, (vi, i) => i);

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
          console.log('payload', payload);
          const { leader_id } = payload.new;
          setLeader(leader_id);
        }
      )
      .subscribe();
    return () => {
      clientSupabase.removeChannel(channle);
    };
  }, [members, participants, leaderMember]);
  if (!participants) return;
  console.log('현리더', leader);

  return (
    <div className="flex flex-col">
      {hollowFemaleArray.length === 0 && hollowMaleArray.length === 0 && (
        <div className="w-100%">
          <AcceptanceRoomButtons
            roomInformation={roomInformation as RoomData}
            participants={participants as UserType[]}
            leader={leader}
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-content align-middle">
        <div className="flex flex-row gap-[100px] items-center justify-content align-middle min-w-[1000px] max-w-[1440px]">
          <main className="mt-[40px] grid grid-cols-1 grid-rows-4 w-100% gap-y-[50px]">
            {femaleMembers.map((member) => (
              <div key={member.user_id} className={`grid col-start-1 col-span-1`}>
                <article className={`border-purpleThird border-[2px] flex flex-row w-[506px] h-[166px] rounded-2xl`}>
                  {/* 카드 왼쪽 */}
                  <div className="mx-[40px] align-middle items-center">
                    <div className="w-[86px] h-[86px] mt-[32px] mr-[48px] rounded-full relative">
                      {leader === member.user_id ? (
                        <div>
                          <FaCrown className="absolute h-[20px] w-[20px] m-[2px] fill-mainColor z-50 top-[-18px] left-[29px]" />
                        </div>
                      ) : (
                        ''
                      )}
                      {member.avatar ? (
                        <Image
                          className="w-[86px] h-[86px] rounded-full object-center bg-cover"
                          src={member.avatar as string}
                          alt="유저 아바타"
                          height={80}
                          width={80}
                        />
                      ) : (
                        <div className="w-[86px] h-[86px] rounded-full object-center bg-cover">
                          <RoomFemaleAvatar />
                        </div>
                      )}
                    </div>
                    <div className="pt-[8px] w-[100px] text-center">{member.nickname}</div>
                  </div>

                  {/* 카드 오른쪽 */}
                  <div className="flex flex-col justify-center w-100%">
                    <div className="flex flex-row gap text-[16px]">
                      <div className="pr-[4px]">{member.school_name}</div>
                      {<IoFemale className="w-[14px] my-auto fill-hotPink" />}
                    </div>
                    <div className="flex flex-row w-100% text-[14px] gap-[8px] w-100%">
                      <div className="my-[16px] flex flex-row gap-[6px]">
                        {member.favorite?.map((tag) => (
                          <div
                            key={tag}
                            style={{
                              backgroundColor: '#F2EAFA',
                              color: '#8F5DF4',
                              borderRadius: '8px',
                              padding: '8px'
                            }}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[14px]">{member.intro}</div>
                  </div>
                </article>
              </div>
            ))}
            {hollowFemaleArray.map((h) => (
              <article
                key={h}
                className={`border-purpleThird border-[2px] flex justify-center w-[506px] h-[166px] rounded-2xl`}
              >
                <Image
                  className="w-[86px] h-[68px] object-center flex justify-center my-auto"
                  src={MeetGoLogoPurple}
                  alt="참여하지 않은 인원"
                  height={80}
                  width={80}
                />
              </article>
            ))}
          </main>
          {genderMaxNumber && genderMaxNumber > femaleMembers.length ? '' : ''}

          <main className="mt-[40px] grid grid-cols-1 grid-rows-4 w-100% gap-x-[100px] gap-y-[50px]">
            {maleMembers.map((member) => (
              <div key={member.user_id} className={`grid col-start-1 col-span-1`}>
                <article className={`bg-purpleSecondary flex flex-row w-[506px] h-[166px] rounded-2xl`}>
                  {/* 카드 왼쪽 */}
                  <div className="ml-[40px] mr-[88px] flex flex-col justify-center align-middle justify-items-center">
                    <div className="w-[86px] h-[86px] mt-[32px] rounded-full relative">
                      {leader === member.user_id ? (
                        <div>
                          <FaCrown className="absolute h-[20px] w-[20px] m-[2px] fill-mainColor z-50 top-[-20px] left-[30px]" />
                        </div>
                      ) : (
                        ''
                      )}
                      {member.avatar ? (
                        <Image
                          className="w-[86px] h-[86px] rounded-full object-center bg-cover"
                          src={member.avatar as string}
                          alt="유저 아바타"
                          height={80}
                          width={80}
                        />
                      ) : (
                        <div className="w-[86px] h-[86px] rounded-full object-center bg-cover">
                          <RoomMaleAvatar />
                        </div>
                      )}
                    </div>
                    <div className="pt-[8px] w-[100px] text-center">{member.nickname}</div>
                  </div>

                  {/* 카드 오른쪽 */}
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-row gap text-[16px]">
                      <div className="pr-[4px]">{member.school_name}</div>
                      {<IoMale className="w-[14px] my-auto fill-blue" />}
                    </div>
                    <div className="flex flex-row w-100% text-[14px] gap-[8px] w-100%">
                      <div className="my-[16px] flex flex-row gap-[6px]">
                        {member.favorite?.map((tag) => (
                          <div
                            key={tag}
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#8F5DF4',
                              borderRadius: '8px',
                              padding: '8px'
                            }}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[14px]">{member.intro}</div>
                  </div>
                </article>
              </div>
            ))}
            {hollowMaleArray.map((h) => (
              <article key={h} className={`bg-purpleSecondary flex justify-center w-[506px] h-[166px] rounded-2xl`}>
                <Image
                  className="w-[86px] h-[68px] object-center flex justify-center my-auto"
                  sizes="86px"
                  src={MeetGoLogoPurple}
                  alt="참여하지 않은 인원"
                />
              </article>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};
export default Member;
