'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { profileCount } from '@/store/userStore';
import { Avatar } from '@nextui-org/react';
import Image from 'next/image';
import { GoPeople } from 'react-icons/go';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { IoMdHeartEmpty } from 'react-icons/io';

const ProfileHeader = () => {
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  const joinTime = user?.created_at?.toString().slice(0, 10);

  const { postCount, likedPostCount, metPeopleCount } = profileCount();

  const buttonData = [
    { icon: GoPeople, title: '스쳐간 인연', count: metPeopleCount },
    { icon: HiOutlineChatBubbleOvalLeftEllipsis, title: '작성 글', count: postCount },
    { icon: IoMdHeartEmpty, title: '좋아요한 글', count: likedPostCount }
  ];

  return (
    <div className="bg-purpleSecondary w-full py-[40px] px-[24px]">
      <div className="flex flex-col gap-4 max-w-[1000px] m-auto max-md:items-start">
        <h1 className="text-[42px] font-bold">프로필</h1>
        <div className="flex items-center max-md:items-start md:justify-between max-md:flex-col max-md:gap-6">
          <div className="flex gap-6 items-center">
            <div className="max-md:w-[160px] max-md:h-[160px] w-[180px] h-[180px] overflow-hidden flex justify-center items-center rounded-full relative">
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
                <Avatar color="secondary" className="w-32 h-32" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="block text-2xl font-semibold">{user?.nickname}</p>
              <p className="block text-lg font-medium">{user?.login_email}</p>
              <p className="font-medium text-gray3 text-sm">가입일 : {joinTime}</p>
            </div>
          </div>
          <div className="flex gap-10 max-md:gap-6">
            {buttonData.map((item, index) => (
              <button key={index} className="font-semibold flex flex-col items-center gap-4 max-md:gap-2">
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
