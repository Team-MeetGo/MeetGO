'use client';

import { UsersType } from '@/types/userTypes';
import { FaCrown } from 'react-icons/fa6';
import Image from 'next/image';
import { RoomFemaleAvatar, RoomMaleAvatar } from '@/utils/icons/RoomAvatar';
import { IoFemale } from 'react-icons/io5';
import HollowFemaleMemberCard from './HollowMemberCard';
import { GENDERFILTER } from '@/utils/constant';

const MaleOrFemale = ({
  gender,
  genderList,
  leader
}: {
  gender: string;
  genderList: (UsersType | null)[];
  leader: string;
}) => {
  return (
    <section
      className={`lg:mt-[40px] mt-[2rem] grid grid-cols-1 grid-rows-${genderList.length} w-100% lg:gap-y-[50px] gap-y-[0.8rem]`}
    >
      {genderList.map((member, idx) =>
        member ? (
          <div key={member.user_id} className={`grid col-start-1 col-span-1`}>
            <article
              className={`${
                gender === GENDERFILTER.FEMALE ? 'border-[2px] border-purpleThird' : 'bg-purpleSecondary'
              }  flex flex-row align-middle lg:w-[490px] w-[20rem] lg:h-[166px] h-[8rem] rounded-2xl`}
            >
              {/* 카드 왼쪽 */}
              <div className="lg:mx-[40px] mx-[1rem] lg:h-[86px] w-[5rem] flex flex-col justify-items-center">
                <figure className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] lg:mt-[32px] mt-[0.8rem] rounded-full relative">
                  {leader === member.user_id ? (
                    <div>
                      <FaCrown className="absolute h-[20px] w-[20px] m-[2px] fill-mainColor z-5 top-[-18px] left-[29px]" />
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
                      sizes="86px"
                    />
                  ) : (
                    <figure className="lg:w-[86px] w-[5rem] lg:h-[86px] h-[5rem] rounded-full object-center bg-cover object-fill">
                      {gender === GENDERFILTER.FEMALE ? <RoomFemaleAvatar /> : <RoomMaleAvatar />}
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
                  <h2 className="pr-[4px]">{member?.school_name}</h2>
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
        ) : (
          <HollowFemaleMemberCard key={idx} gender={gender} />
        )
      )}
    </section>
  );
};

export default MaleOrFemale;
