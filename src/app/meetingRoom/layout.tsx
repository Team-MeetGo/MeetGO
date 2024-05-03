import ThinBanner from '@/utils/banner/ThinBanner';
import { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThinBanner />
      {children}
    </>
  );
};

export default layout;
