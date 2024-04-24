'use client';
import { useGetUserDataQuery } from '../useQueries/useUserQuery';
import { useRouter } from 'next/navigation';

export const useUserHook = () => {
  const { data: user } = useGetUserDataQuery();
  const router = useRouter();
  if (!user) return;
  if (user) return user;
};
