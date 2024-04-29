import MypageBottomBanner from '@/components/mypage/MypageBottomBanner';
import React, { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div>{children}</div>

      <MypageBottomBanner />
    </>
  );
};

export default layout;
