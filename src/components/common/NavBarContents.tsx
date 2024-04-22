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
import MeetGoLogo from '@/utils/icons/meetgo-logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { clientSupabase } from '@/utils/supabase/client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import Link from 'next/link';
import { customErrToast, customSuccessToast } from './customToast';

const NavBarContents = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error, isLoggedIn } = useGetUserDataQuery();
  const router = useRouter();
  const isValidate = user?.isValidate;

  if (isPending) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>{error?.message}</span>;
  }

  const signOut = async () => {
    await clientSupabase.auth.signOut();
    queryClient.invalidateQueries({
      queryKey: [USER_DATA_QUERY_KEY]
    });
    customSuccessToast('로그아웃 성공');
    router.replace('/');
  };

  const checkIsValidate = () => {
    if (!isValidate) {
      customErrToast('미팅을 하고 싶다면 학교 인증을 해주세요!');
    }
  };

  return (
    <Navbar className="flex flex-row py-[20px] h-auto">
      <div className="flex flex-row justify-between gap-11 ">
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
        <NavbarContent className="hidden sm:flex h-auto gap-11">
          <NavbarItem>
            <Link color="foreground" href={isValidate ? '/meetingRoom' : '/mypage'} onClick={checkIsValidate}>
              Lobby
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/review/pageNumber/1" aria-current="page" color="secondary">
              Review
            </Link>
          </NavbarItem>
        </NavbarContent>
      </div>

      <NavbarContent className="h-auto" as="div" justify="end">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2">
                  <p className="cursor-pointer">{user?.nickname}</p>
                  {user?.avatar ? (
                    <Avatar
                      as="button"
                      className="transition-transform"
                      src={`${user?.avatar}?${new Date().getTime()}`}
                    />
                  ) : (
                    <Avatar showFallback as="button" className="transition-transform" color="secondary" size="sm" />
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                onAction={(key) => {
                  if (key === 'logout') {
                    signOut();
                  }
                }}
              >
                <DropdownItem key="mypage" href="/mypage">
                  마이페이지
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="w-full">
                  LOGOUT
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="bg-white rounded-[12px] px-[20px] py-[12px] text-[18px] text-[#252642] font-medium"
            >
              로그인
            </Link>
            <Link
              href="/join"
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
