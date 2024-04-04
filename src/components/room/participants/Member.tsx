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
      // 초기값을 생성하기 위해 데이터베이스에서 현재 유저 정보를 불러옵니다.
      // 성별에 따라 나누어 관리하게 했습니다.
      const memberList = await getTotalMember({ roomId });
      if (!memberList || memberList === null) return;
      setFemaleMember(memberList.getFemaleMember);
      setMaleMember(memberList.getMaleMember);

      // 수락창의 인원 추가를 실시간으로 파악하기 위해 구독합니다.
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
            //유저가 수락창에 추가되면 users 테이블에서 user_id가 같은 경우의 데이터를 모두 받아옵니다.
            const isFemale = async () => {
              const addUserId = payload.new.user_id;
              const { data: isFemaleQuestion } = await clientSupabase
                .from('users')
                .select(`*`)
                .eq('user_id', addUserId);
              if (!isFemaleQuestion || isFemaleQuestion === null) return;
              // 여성과 남성의 경우로 나누어서 데이터를 갱신합니다.
              isFemaleQuestion[0].gender === 'female'
                ? setFemaleMember((member) => [...member, payload.new as UserType])
                : setMaleMember((member) => [...member, payload.new as UserType]);
            };
            isFemale();
          }
        )
        .subscribe();

      // 수락창의 인원 삭제를 실시간으로 파악하기 위해 구독합니다.
      const deletechannels = clientSupabase
        .channel('custom-delete-channel')
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'participants' }, (payload) => {
          const deleteMember = async () => {
            const deleteUserId = payload.old.part_id;
            //수락창의 part_id에 할당된 user_id를 찾습니다.
            const { data: deleteGenderQuestion } = await clientSupabase
              .from('participants')
              .select(`*`)
              .eq('part_id', deleteUserId);
            console.log('deleteGenderQuestion', deleteGenderQuestion);
            if (!deleteGenderQuestion || deleteGenderQuestion.length < 1) return;
            const deleteUserInformation = deleteGenderQuestion[0].user_id;
            if (!deleteUserInformation || deleteUserInformation === null) return;
            // 삭제된 참여자의 user_id를 필터링하여 업데이트 합니다.
            setFemaleMember(femaleMember.filter((member) => member.user_id !== deleteUserInformation));
            setMaleMember(maleMember.filter((member) => member.user_id !== deleteUserInformation));
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
  }, [femaleMember, maleMember, roomId]);
  return (
    <div className="flex flex-col justify-center w-full align-middle">
      <div className="m-12 h-100 flex flex-row justify-evenly">
        <div className="flex flex-col justify-start gap-8 bg-slate-300">
          {femaleMember.map((member) => (
            <div key={member.user_id}>
              <div className="h-36 w-36 flex flex-col align-middle justify-start m-4">
                <div className="h-28 w-28 bg-indigo-600 rounded-full">
                  {member.avatar ? <img src={member.avatar as string} alt="유저" /> : ''}
                </div>
                <div>{member.nickname}</div>
                <div>{member.school_name}</div>
              </div>
            </div>
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
            <div key={member.user_id}>
              <div className="h-36 w-36 flex flex-col align-middle justify-start m-4">
                <div className="h-28 w-28 bg-indigo-600 rounded-full">
                  {member.avatar ? <Image src={member.avatar as string} alt="유저" /> : ''}
                </div>
                <div>{member.nickname}</div>
                <div>{member.school_name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Member;
