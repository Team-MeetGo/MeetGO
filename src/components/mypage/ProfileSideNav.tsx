import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ProfileSideNav = () => {
  // 현재 경로를 얻기 위해 useRouter 훅 사용
  const pathname = usePathname();

  return (
    <nav className="rounded-xl bg-white p-[24px] pr-[80px] h-full flex flex-col gap-4 text-[#9CA3AF]">
      <Link
        href="/mypage"
        className={`hover:text-mainColor ${pathname === '/mypage' ? 'text-mainColor font-bold' : ''}`}
      >
        프로필 설정
      </Link>
      <Link
        href="/mypage/metpeople"
        className={`hover:text-mainColor ${pathname === '/mypage/metpeople' ? 'text-mainColor font-bold' : ''}`}
      >
        스쳐간 인연
      </Link>
      <Link
        href="/mypage/mypost"
        className={`hover:text-mainColor ${pathname === '/mypage/mypost' ? 'text-mainColor font-bold' : ''}`}
      >
        내가 쓴 글
      </Link>
      <Link
        href="/mypage/mylike"
        className={`hover:text-mainColor ${pathname === '/mypage/likepost' ? 'text-mainColor font-bold' : ''}`}
      >
        내가 좋아요한 글
      </Link>
    </nav>
  );
};

export default ProfileSideNav;
