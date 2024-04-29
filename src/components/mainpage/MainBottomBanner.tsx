'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import Link from 'next/link';
import { customErrToast } from '../common/customToast';

const MainBottomBanner = () => {
  const { isLoggedIn } = useGetUserDataQuery();

  const checkIfMember = () => {
    if (isLoggedIn) {
      customErrToast(`이미 로그인을 하셨네요!`);
    }
  };

  return (
    <section className="w-full h-24 bg-mainColor flex justify-center items-center px-3">
      <div className="w-full max-w-[1080px] flex justify-between gap-6">
        <div className="text-white">
          <p className="font-thin text-lg">지금 대학생 이메일 인증하면,</p>
          <p className="text-lg">
            나를 설레게하는 캠퍼스 인연들을 <span className="font-thin text-lg">만날 수 있어요</span>
          </p>
        </div>
        <Link
          className="bg-white rounded-xl max-w-52 px-7 h-12 text-secondMainColor text-base font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
          href={isLoggedIn ? '/' : '/join'}
          onClick={checkIfMember}
        >
          회원가입 하러가기
        </Link>
      </div>
    </section>
  );
};

export default MainBottomBanner;
