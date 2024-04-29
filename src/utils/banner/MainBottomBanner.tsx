import { customErrToast } from '@/components/common/customToast';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { Link } from '@nextui-org/react';

const MainBottomBanner = () => {
  const { isLoggedIn } = useGetUserDataQuery();
  const checkIfMember = () => {
    if (isLoggedIn) {
      customErrToast(`이미 로그인을 하셨네요!`);
    }
  };

  return (
    <div className="w-full max-w-[1080px] flex justify-between gap-6">
      <div className="text-white">
        <p className="font-thin text-lg max-sm:text-base">MeetGo의 멤버가 되어</p>
        <p className="text-lg max-sm:text-base">
          설렘 가득한 미팅을 <span className="font-thin text-lg max-sm:text-base break-keep">경험 해보세요!</span>
        </p>
      </div>
      <Link
        className="bg-white rounded-xl max-w-52 px-7 h-11 text-secondMainColor text-base max-sm:text-sm font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
        href={isLoggedIn ? '/' : '/join'}
        onClick={checkIfMember}
      >
        회원가입 하러가기
      </Link>
    </div>
  );
};

export default MainBottomBanner;
