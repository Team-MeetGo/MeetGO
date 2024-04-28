'use client';
import MyPost from './MyPost';
import MetPeople from './MetPeople';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import ProfileHeader from './ProfileHeader';
import ProfileSetting from './ProfileSetting';
import ProfileSideNav from './ProfileSideNav';

const Profile = () => {
  const { data: user, isPending } = useGetUserDataQuery();

  if (isPending) return <></>;

  return (
    <div className="mx-auto bg-[#F3F4F6]">
      <ProfileHeader />
      <div className="flex py-[48px] justify-center gap-6">
        <ProfileSideNav />
        <div className="max-w-[800px] py-[40px] px-[24px] flex flex-col gap-6 bg-white rounded-xl">
          <ProfileSetting />
          <MetPeople />
          <MyPost />
        </div>
      </div>
    </div>
  );
};

export default Profile;
