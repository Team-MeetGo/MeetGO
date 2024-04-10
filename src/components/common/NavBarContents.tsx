'use client';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Avatar
} from '@nextui-org/react';
import MeetGoLogo from '(@/utils/icons/meetgo-logo.png)';
import Image from 'next/image';
import { userStore } from '(@/store/userStore)';
import { useRouter } from 'next/navigation';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { useEffect } from 'react';

const NavBarContents = () => {
  const { isLoggedIn, setIsLoggedIn, setUser, user } = userStore((state) => state);
  const { data: userData, isPending, isError, error } = useGetUserDataQuery();
  const router = useRouter();

  if (isPending) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>{error?.message}</span>;
  }

  console.log(userData, 'userData');
  console.log(isLoggedIn, '로그인됐냐');
  console.log(user, '유저 객체냐?');

  const signOut = async () => {
    await clientSupabase.auth.signOut();
    setIsLoggedIn(false);
    router.replace('/'); // 로그아웃 후 메인 페이지로 이동. 뒤로가기 방지.
    alert('로그아웃 성공');
  };

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/" className="max-w-[150px]">
          <Image
            src={MeetGoLogo}
            alt="MeetGo Logo"
            style={{
              width: '100%',
              height: 'auto'
            }}
            priority={true}
          />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/meetingRoom">
            로비
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/review/pageNumber/1" aria-current="page" color="secondary">
            리뷰게시판
          </Link>
        </NavbarItem>
        {/* <NavbarItem>
            <Link color="foreground" href="#">
              메뉴더있었으면..
            </Link>
          </NavbarItem> */}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <p>{userData?.nickname}</p>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                {userData?.avatar ? (
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name="profile"
                    src={`${userData?.avatar}?${new Date().getTime()}`}
                  />
                ) : (
                  <Avatar
                    isBordered
                    showFallback
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    size="sm"
                  />
                )}
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="mypage" href="/mypage">
                  마이페이지
                </DropdownItem>
                <DropdownItem key="helpdesk">고객센터</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={signOut}>
                  LOGOUT
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          <div>
            <Link href="/users/login">로그인</Link>
            <Link href="/users/join">회원가입</Link>
            <button onClick={signOut}>로그아웃</button>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavBarContents;
