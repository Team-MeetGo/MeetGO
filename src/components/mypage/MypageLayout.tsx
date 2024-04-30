import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileSideNav from './ProfileSideNav';

interface MypageLayoutProps {
  children: React.ReactNode;
}

const MypageLayout: React.FC<MypageLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#F3F4F6]">
      <ProfileHeader />
      <div className="flex justify-center gap-6 py-[48px] px-[24px] max-lg:flex-col max-w-[1280px] mx-auto">
        <ProfileSideNav />
        <div className="bg-white max-w-[966px] w-full py-[40px] px-[48px] rounded-xl">{children}</div>
      </div>
    </div>
  );
};

export default MypageLayout;
