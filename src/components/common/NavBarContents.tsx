'use client';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Avatar
} from '@nextui-org/react';
import MeetGoLogo from '(@/utils/icons/meetgo-logo.png)';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '(@/query/user/userQueryKeys)';
import Link from 'next/link';

const NavBarContents = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error, isLoggedIn } = useGetUserDataQuery();
  const router = useRouter();

  if (isPending) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>{error?.message}</span>;
  }

  const signOut = async () => {
    await clientSupabase.auth.signOut();
    alert('로그아웃 성공');
    queryClient.invalidateQueries({
      queryKey: [USER_DATA_QUERY_KEY]
    });
    await router.replace('/'); // 로그아웃 후 메인 페이지로 이동. 뒤로가기 방지.
  };

  return (
    <Navbar className="py-[20px] h-auto">
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
      <NavbarContent className="hidden sm:flex gap-4 h-auto" justify="center">
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

      <NavbarContent className="h-auto" as="div" justify="end">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <p>{user?.nickname}</p>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                {user?.avatar ? (
                  <Avatar
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    src={`${user?.avatar}?${new Date().getTime()}`}
                  />
                ) : (
                  <Avatar showFallback as="button" className="transition-transform" color="secondary" size="sm" />
                )}
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="mypage" textValue="mypage">
                  <Link href="/mypage" className="flex">
                    마이페이지
                  </Link>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={signOut}>
                  LOGOUT
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          <div>
            <Link
              href="/users/login"
              className="bg-white rounded-[12px] px-[20px] py-[12px] text-[18px] text-[#252642] font-medium"
            >
              로그인
            </Link>
            <Link
              href="/users/join"
              className="bg-mainColor rounded-[12px] px-[20px] py-[12px] text-[18px] text-white font-medium"
            >
              회원가입
            </Link>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavBarContents;
