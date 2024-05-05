import MypageLayout from '@/components/mypage/MypageLayout';
import ThickBanner from '@/utils/banner/ThickBanner';
import React, { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <MypageLayout>{children}</MypageLayout>
      <ThickBanner />
    </>
  );
};

export default layout;
