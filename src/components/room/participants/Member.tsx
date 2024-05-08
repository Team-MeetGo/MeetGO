'use client';

import GotoChatButton from '@/components/room/participants/GotoChatButton';
import { useRoomInformationQuery } from '@/hooks/useQueries/useMeetingQuery';
import { GENDERFILTER } from '@/utils/constant';
import { clientSupabase } from '@/utils/supabase/client';
import { genderMemberNumber, handleGenderList } from '@/utils/utilFns';
import { useEffect, useState } from 'react';
import type { UserType } from '@/types/roomTypes';
import type { UUID } from 'crypto';
import MaleOrFemale from './MaleOrFemale';

const Member = ({ roomId }: { roomId: UUID }) => {
  const { roomMemberWithId: participants, roomInfoWithId: roomInformation } = useRoomInformationQuery(roomId);
  const [members, setMembers] = useState<UserType[]>(participants);
  const [leader, setLeader] = useState(roomInformation.leader_id as string);
  const genderMaxNumber = genderMemberNumber(roomInformation.member_number as string);

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
          <MaleOrFemale
            gender={GENDERFILTER.FEMALE}
            genderList={handleGenderList(genderMaxNumber, participants, GENDERFILTER.FEMALE)}
            leader={leader}
          />
          <MaleOrFemale
            gender={GENDERFILTER.MALE}
            genderList={handleGenderList(genderMaxNumber, participants, GENDERFILTER.MALE)}
            leader={leader}
          />
        </section>
      </div>
    </div>
  );
};
export default Member;
