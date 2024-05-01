'use client';
import { customErrToast } from '@/components/common/customToast';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ThinBanner = () => {
  const pathname = usePathname();
  const { data: user } = useGetUserDataQuery();

  const checkIfValidated = () => {
    if (user?.isValidate) {
      customErrToast(`이미 학교인증을 하셨습니다.`);
    }
  };

  return (
    <section className="w-full h-14 bg-mainColor flex justify-center ">
      {pathname === '/' ? (
        <h1 className="text-xl text-thin text-white my-auto">베타 기간에는 학교 인증 없이 미팅할 수 있어요!</h1>
      ) : null}
      {pathname === '/meetingRoom' ? (
        <div className="w-full max-w-[1280px] flex justify-between items-center gap-6 px-3">
          <h2 className="font-thin text-lg max-sm:text-sm text-white">
            다른 회원들의 <span className="text-lg max-sm:text-sm">실시간 미팅후기가</span> 궁금하다면?
          </h2>
          <p className="text-white">아아아</p>
          <Link
            className="bg-white rounded-md max-w-52 px-7 h-10 text-secondMainColor text-base max-sm:text-sm font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
            href="/review/pageNumber/1"
          >
            후기 보러가기
          </Link>
        </div>
      ) : null}
      {pathname.startsWith('/review') ? (
        <div className="w-full max-w-[1280px] flex justify-between items-center gap-6 px-3">
          <p className="font-thin text-lg max-sm:text-sm text-white">
            <span className="text-lg max-sm:text-sm">지금 대학교 이메일을 인증하면,</span> 캠퍼스 인연들을 만날 수
            있어요.
          </p>
          <Link
            className="bg-white rounded-md px-7 h-10 text-secondMainColor text-base max-sm:text-sm font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
            href={user?.isValidate ? '/review/pageNumber/1' : '/mypage'}
            onClick={checkIfValidated}
          >
            메일 인증하러 가기
          </Link>
        </div>
      ) : null}
    </section>
  );
};

export default ThinBanner;
