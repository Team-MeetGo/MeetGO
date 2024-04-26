'use client';
import { Skeleton } from '@nextui-org/skeleton';
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
import { Dropdown } from './ui/Dropdown';
import { DropdownTrigger } from './ui/DropdownTrigger';
import { DropdownMenu } from './ui/DropdownMenu';
import Button from './ui/Button';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const NavBarContents2 = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error, isLoggedIn } = useGetUserDataQuery();
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };
  const isValidate = user?.isValidate;

  if (isPending) {
    return (
      <div className="w-full flex items-center gap-2 max-w-5xl py-[20px] px-6 m-auto justify-between">
        <div className="w-full flex gap-10 items-center">
          <Skeleton className="w-1/3 h-10 rounded-lg" />
          <Skeleton className="h-6 w-4/6 rounded-lg" />
        </div>
        <div className="w-full flex gap-4 items-center justify-end">
          <Skeleton className="h-6 w-1/5 rounded-lg" />
          <Skeleton className="flex rounded-full w-10 h-10" />
        </div>
      </div>
    );
  }
  if (isError) {
    return <span>{error?.message}</span>;
  }

  const signOut = async () => {
    await clientSupabase.auth.signOut();
    queryClient.invalidateQueries({
      queryKey: [USER_DATA_QUERY_KEY]
    });
    location.replace('/');
  };

  const checkIsValidate = () => {
    if (!isValidate) {
      customErrToast('미팅을 하고 싶다면 학교 인증을 해주세요!');
    }
  };

  return (
    <header className="flex max-w-[1200px] h-20 w-full shrink-0 items-center px-6 m-auto">
      <div className="flex items-center">
        <Dropdown>
          <DropdownTrigger onToggle={handleToggle}>
            <RxHamburgerMenu className="h-6 w-6 mr-4 lg:hidden" />
          </DropdownTrigger>
          <DropdownMenu isOpen={isOpen}>
            <div className="flex flex-col gap-4 px-4 py-6">
              <IoClose className="absolute top-0 right-0 mt-4 mr-4 h-5 w-5 " onClick={handleToggle} />
              <Link className="flex items-center max-w-[100px]" href="/">
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
              <nav className="grid gap-2">
                <Link
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                  href="#"
                >
                  로비
                </Link>
                <Link
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                  href="#"
                >
                  리뷰
                </Link>
                <Link
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                  href="#"
                >
                  스쳐간인연
                </Link>
              </nav>
            </div>
          </DropdownMenu>
        </Dropdown>
        <div className="flex items-center">
          <Link className="flex items-center max-w-[120px]" href="/">
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
        </div>
      </div>
      <nav className="hidden lg:flex gap-4">
        <Link
          className="inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          href="#"
        >
          로비
        </Link>
        <Link
          className="inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          href="#"
        >
          리뷰
        </Link>
        <Link
          className="inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          href="#"
        >
          스쳐간인연
        </Link>
      </nav>
      <div className="ml-auto flex gap-2">
        <div className="flex items-center gap-2 lg:hidden">
          <Button>
            <FaRegUser className="h-5 w-5" />
          </Button>
        </div>
        <div className="hidden lg:flex gap-2">
          <Button>로그인</Button>
          <Button className="bg-mainColor text-white">회원가입</Button>
        </div>
      </div>
    </header>
  );
};

export default NavBarContents2;
