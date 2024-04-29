'use client';

import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import Link from 'next/link';

const LobbyBanner = () => {
  const { data: user } = useGetUserDataQuery();

  return (
    <>
      {!user?.isValidate ?? (
        <div className="w-full max-w-[1080px] flex justify-between gap-6">
          <div className="text-white">
            <p className="font-thin text-lg">
              지금 대학생 이메일 인증하면, <span className="text-lg">00만 명의 캠퍼스 인연들을</span>만날 수 있어요.
            </p>
          </div>
          <Link
            className="bg-white rounded-xl max-w-52 px-7 h-12 text-secondMainColor text-base font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
            href="/mypage"
          >
            학교 인증하러 하러가기
          </Link>
        </div>
      )}
    </>
  );
};

export default LobbyBanner;
