import ThinBanner from '@/utils/banner/ThinBanner';
import { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <main className="w-full max-w-[1280px] mx-auto px-[24px] flex flex-col gap-12">
        <header className="h-40 flex flex-col justify-center items-center gap-4 py-auto">
          <p className="text-[#6F7785] mr-auto">자유게시판 이라고 생각해도 좋아요.</p>
          <h1 className="text-4xl font-extrabold mr-auto">실시간 후기</h1>
        </header>
        <div>{children}</div>
      </main>
      <ThinBanner />
    </>
  );
};

export default layout;
