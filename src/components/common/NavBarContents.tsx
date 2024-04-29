'use client';
import { DropdownItem, Dropdown, DropdownTrigger, DropdownMenu, Avatar } from '@nextui-org/react';
import MeetGoLogo from '@/utils/icons/meetgo-logo.png';
import Image from 'next/image';
import { clientSupabase } from '@/utils/supabase/client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import Link from 'next/link';
import { customErrToast } from './customToast';
import { FaRegUser } from 'react-icons/fa6';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { Drawer } from './ui/Drawer';
import { DrawerTrigger } from './ui/DrawerTrigger';
import { DrawerMenu } from './ui/DrawerMenu';
import { useState } from 'react';

const NavBarContents = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoggedIn } = useGetUserDataQuery();
  const isValidate = user?.isValidate;
  const [isOpen, setIsOpen] = useState(false);

  //사이드바 액션
  const handleDrawerToggle = () => {
    setIsOpen((prev) => !prev);
  };
  const handleDrawerClose = () => {
    setIsOpen(false);
  };

  const signOut = async () => {
    await clientSupabase.auth.signOut();
    queryClient.invalidateQueries({
      queryKey: [USER_DATA_QUERY_KEY]
    });
    location.replace('/');
  };

  const checkIsValidate = () => {
    setIsOpen(false);
    if (!isValidate) {
      customErrToast('미팅을 하고 싶다면 학교 인증을 해주세요!');
    }
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center m-auto sticky z-20 top-0 inset-x-0 backdrop-blur-lg bg-white bg-opacity-70 justify-center ">
      <div className="max-w-[1280px] w-full flex justify-between p-6">
        <div className="flex items-center">
          <Drawer>
            <DrawerTrigger onToggle={handleDrawerToggle}>
              <RxHamburgerMenu className="h-6 w-6 mr-4 lg:hidden" />
            </DrawerTrigger>
            <DrawerMenu isOpen={isOpen}>
              <div className="flex flex-col gap-4 px-4 py-6">
                <IoClose className="absolute top-0 right-0 mt-4 mr-4 h-5 w-5 " onClick={handleDrawerClose} />
                <Link className="flex items-center max-w-[100px]" href="/">
                  <Image
                    src={MeetGoLogo}
                    alt="MeetGo Logo"
                    style={{
                      width: '100%',
                      height: 'auto'
                    }}
                    priority={true}
                    onClick={handleDrawerClose}
                  />
                </Link>
                <nav className="grid gap-2">
                  <Link
                    className="flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors"
                    href={isValidate ? '/meetingRoom' : '/mypage'}
                    onClick={checkIsValidate}
                    prefetch={true}
                  >
                    라운지
                  </Link>
                  <Link
                    className="flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors"
                    href="/review/pageNumber/1"
                    onClick={handleDrawerClose}
                  >
                    실시간 후기
                  </Link>
                  <Link
                    className="flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors"
                    href="#"
                    onClick={handleDrawerClose}
                  >
                    스쳐간 인연
                  </Link>
                </nav>
              </div>
            </DrawerMenu>
          </Drawer>
          <div className="flex items-center">
            <Link className="flex items-center max-w-[120px] mr-[24px]" href="/">
              <Image
                src={MeetGoLogo}
                alt="MeetGo Logo"
                style={{
                  width: '100%',
                  height: 'auto'
                }}
                priority={true}
                onClick={handleDrawerClose}
              />
            </Link>
          </div>
        </div>
        <nav className="hidden lg:flex gap-4">
          <Link
            className="inline-flex h-full w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors"
            href={isValidate ? '/meetingRoom' : '/mypage'}
            onClick={checkIsValidate}
          >
            믿고
          </Link>
          <Link
            className="inline-flex h-full w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors"
            href="/review/pageNumber/1"
          >
            실시간 후기
          </Link>
          <Link
            className="inline-flex h-full w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors"
            href="#"
          >
            스쳐간 인연
          </Link>
        </nav>
        <div className="ml-auto flex gap-2">
          <div className="hidden lg:flex gap-2">
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
                    <DropdownItem key="help" href="/help">
                      고객센터
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger">
                      LOGOUT
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="bg-white rounded-[12px] px-[16px] py-[10px] text-base text-[#252642] font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/join"
                  className="bg-mainColor rounded-[12px] px-[16px] py-[10px] text-base text-white font-medium"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 lg:hidden">
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
                    <DropdownItem key="help" href="/help">
                      고객센터
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger">
                      LOGOUT
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <FaRegUser className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBarContents;
