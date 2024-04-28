'use client';
import { Suspense } from 'react';
import InitChatRealTime from './InitChatRealTime';
import NavBarContents from './NavBarContents';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { fetchUserData } from '@/query/user/userQueryFns';

const NavBar = () => {
  return (
    <>
      <NavBarContents />
      <InitChatRealTime />
    </>
  );
};

export default NavBar;
