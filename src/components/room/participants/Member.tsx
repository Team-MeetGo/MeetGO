'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import { Database } from '(@/types/database.types)';
import participants from '(@/hooks/custom/participants)';
import Image from 'next/image';

import type { UUID } from 'crypto';
type ParticipantType = Database['public']['Tables']['participants']['Row'];
type UserType = Database['public']['Tables']['users']['Row'];

const Member = ({ params }: { params: { id: UUID } }) => {
  const [maleMember, setMaleMember] = useState<UserType[]>([]);
  const [femaleMember, setFemaleMember] = useState<UserType[]>([]);
  const { getTotalMember } = participants();
  const roomId = params.id;
  useEffect(() => {
    const participantsList = async () => {
      const memberList = await getTotalMember({ roomId });
      if (!memberList || memberList === null) return;
      setFemaleMember(memberList.getFemaleMember);
      setMaleMember(memberList.getMaleMember);

      // 수락창의 인원을 실시간으로 파악하기 위해 구독합
      const channels = clientSupabase
        .channel('custom-insert-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'participants'
          },
          (payload) => {
            const isFemale = async () => {
              const addUserId = payload.new.user_id;
              const { data: isFemaleQuestion } = await clientSupabase
                .from('users')
                .select(`*`)
                .eq('user_id', addUserId);
              if (!isFemaleQuestion || isFemaleQuestion === null) return;
              isFemaleQuestion[0].gender === 'female'
                ? setFemaleMember((member) => [...member, payload.new as UserType])
                : setMaleMember((member) => [...member, payload.new as UserType]);
            };
            isFemale();
          }
        )
        .subscribe();

      // const memberchannels = clientSupabase
      //   .channel('custom-insert-channel')
      //   .on(
      //     'postgres_changes',
      //     {
      //       event: 'INSERT',
      //       schema: 'authenticated',
      //       table: 'users'
      //     },
      //     (payload) => {
      //       console.log(payload);
      //     }
      //   )
      //   .subscribe();

      const deletechannels = clientSupabase
        .channel('custom-delete-channel')
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participants' }, (payload) => {
          const deleteMember = async () => {
            const deleteUserId = payload.old.part_id;
            const { data: deleteGenderQuestion } = await clientSupabase
              .from('participants')
              .select(`*`)
              .eq('part_id', deleteUserId)
              .select('user_id, users(*)');
            console.log('deleteGenderQuestion', deleteGenderQuestion);
            if (!deleteGenderQuestion || deleteGenderQuestion.length < 1) return;
            const deleteUserInformation = deleteGenderQuestion[0].users;
            if (!deleteUserInformation || deleteUserInformation === null) return;

            deleteUserInformation.gender === 'female'
              ? setFemaleMember(femaleMember.filter((member) => member.user_id !== deleteUserInformation.user_id))
              : setMaleMember(maleMember.filter((member) => member.user_id !== deleteUserInformation.user_id));
          };
          deleteMember();
        })
        .subscribe();

      return () => {
        clientSupabase.removeChannel(channels);
        clientSupabase.removeChannel(deletechannels);
      };
    };
    participantsList();
  }, [roomId]);
  return (
    <div className="flex flex-col justify-center w-full align-middle">
      <div className="m-12 h-100 flex flex-row justify-evenly">
        <div className="flex flex-col justify-start gap-8 bg-slate-300">
          {femaleMember.map((member) => (
            <>
              <div key={member.user_id} className="h-36 w-36 flex flex-col align-middle justify-start m-4">
                <div className="h-28 w-28 bg-indigo-600 rounded-full">
                  {member.avatar ? <Image src={member.avatar as string} alt="유저" /> : ''}
                </div>
                <div>{member.nickname}</div>
                <div>{member.school_name}</div>
              </div>
            </>
          ))}
        </div>
        <div className="h-18 w-60 flex flex-col justify-start gap-8 bg-slate-100 p-4">
          <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
            <div>{femaleMember[0] ? femaleMember[0].favorite : ''}</div>
            <div>{femaleMember[0] ? femaleMember[0].intro : ''}</div>
          </div>
          <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
            <div>{maleMember[0] ? maleMember[0].favorite : ''}</div>
            <div>{maleMember[0] ? maleMember[0].intro : ''}</div>
          </div>
          <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
            <div>{femaleMember[1] ? femaleMember[1].favorite : ''}</div>
            <div>{femaleMember[1] ? femaleMember[1].intro : ''}</div>
          </div>
          <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
            <div>{maleMember[1] ? maleMember[1].favorite : ''}</div>
            <div>{maleMember[1] ? maleMember[1].intro : ''}</div>
          </div>
          <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
            <div>{femaleMember[2] ? femaleMember[2].favorite : ''}</div>
            <div>{femaleMember[2] ? femaleMember[2].intro : ''}</div>
          </div>
          <div className="flex flex-col justify-center align-top gap-1 bg-violet-300 p-4">
            <div>{maleMember[2] ? maleMember[2].favorite : ''}</div>
            <div>{maleMember[2] ? maleMember[2].intro : ''}</div>
          </div>
        </div>
        <div className="flex flex-col justify-start gap-4 bg-slate-400">
          {maleMember.map((member) => (
            <>
              <div key={member.user_id} className="h-36 w-36 flex flex-col align-middle justify-start m-4">
                <div className="h-28 w-28 bg-indigo-600 rounded-full">
                  {member.avatar ? <Image src={member.avatar as string} alt="유저" /> : ''}
                </div>
                <div>{member.nickname}</div>
                <div>{member.school_name}</div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Member;
