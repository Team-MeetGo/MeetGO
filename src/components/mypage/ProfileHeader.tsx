'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { profileCount } from '@/store/userStore';
import { Avatar, Skeleton } from '@nextui-org/react';
import Image from 'next/image';
import { BsPostcardHeart } from 'react-icons/bs';
import { GoPeople } from 'react-icons/go';
import { IoMdHeartEmpty } from 'react-icons/io';

const ProfileHeader = () => {
  const { data: user } = useGetUserDataQuery();
  const joinTime = user?.created_at?.toString().slice(0, 10);
  const { postCount, likedPostCount, metPeopleCount } = profileCount();

  const buttonData = [
    { icon: GoPeople, title: '스쳐간 인연 >', count: metPeopleCount },
    { icon: BsPostcardHeart, title: '내가 쓴 글 >', count: postCount },
    { icon: IoMdHeartEmpty, title: '좋아요한 글 >', count: likedPostCount }
  ];

  return (
    <div className="bg-mainColor w-full py-[48px] text-white">
      <div className="flex flex-col gap-6 max-w-[1080px] m-auto max-md:items-start px-[24px]">
        <h1 className="text-2xl font-medium">마이페이지</h1>
        <div className="flex items-center max-md:items-start md:justify-between max-md:flex-col max-md:gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-[108px] h-[108px] overflow-hidden flex justify-center items-center rounded-full relative">
              {user?.avatar ? (
                <Image
                  src={`${user?.avatar}?${new Date().getTime()}`}
                  alt="Avatar"
                  style={{ objectFit: 'cover' }}
                  fill={true}
                  sizes="450px"
                  priority={true}
                />
              ) : (
                <Avatar
                  classNames={{
                    base: 'bg-white',
                    icon: 'text-mainColor'
                  }}
                  className="w-32 h-32"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center max-lg:flex-col max-lg:items-start gap-2">
                <p className="block text-2xl font-bold max-md:text-xl">{user?.nickname}</p>
                <p className="text-2xl font-thin max-lg:hidden">|</p>
                <div>
                  <span className="text-sm tracking-wider">카카오톡 ID : </span>
                  <span className="text-sm font-medium tracking-wider">{user?.kakaoId}</span>
                </div>
              </div>
              <div className="flex items-center max-lg:flex-col max-lg:items-start gap-2">
                {user?.isValidate ? (
                  <p className="px-[12px] py-[4px] bg-white rounded-full text-warningYellow text-sm font-semibold">
                    대학교 인증회원
                  </p>
                ) : (
                  <p className="px-[12px] py-[4px] bg-white rounded-full text-grayBlack text-sm font-semibold">
                    대학교 미인증회원
                  </p>
                )}
                <p className="block text-sm tracking-wider">{user?.school_email}</p>
              </div>
              <p className="font-light text-sm">가입일 : {joinTime}</p>
            </div>
          </div>
          <div className="flex">
            {buttonData.map((item, index) => (
              <button key={index} className="flex flex-col items-start gap-2 w-40 max-lg:w-32">
                <item.icon size={40} />
                <p>{item.title}</p>
                <p className="font-bold text-3xl">{item.count}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
