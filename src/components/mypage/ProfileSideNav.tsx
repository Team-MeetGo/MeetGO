'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ProfileSideNav = () => {
  const pathname = usePathname();

  return (
    <nav className="rounded-xl bg-white p-[24px] max-w-[290px] w-full h-full flex flex-col gap-4 text-[#9CA3AF]">
      <Link
        href="/mypage"
        className={`hover:text-mainColor ${pathname === '/mypage' ? 'text-mainColor font-bold' : ''}`}
      >
        프로필 설정
      </Link>
      <Link
        href="/mypage/metpeople"
        className={`hover:text-mainColor ${pathname === '/mypage/metpeople' ? 'text-mainColor font-bold' : ''}`}
        prefetch={true}
      >
        스쳐간 인연
      </Link>
      <Link
        href="/mypage/mypost"
        className={`hover:text-mainColor ${pathname === '/mypage/mypost' ? 'text-mainColor font-bold' : ''}`}
        prefetch={true}
      >
        내가 쓴 글
      </Link>
      <Link
        href="/mypage/likepost"
        className={`hover:text-mainColor ${pathname === '/mypage/likepost' ? 'text-mainColor font-bold' : ''}`}
        prefetch={true}
      >
        내가 좋아요한 글
      </Link>
    </nav>
  );
};

export default ProfileSideNav;
