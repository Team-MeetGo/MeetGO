import ThickBanner from '@/utils/banner/ThickBanner';
import React, { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div>{children}</div>
      <ThickBanner />
    </>
  );
};

export default layout;
