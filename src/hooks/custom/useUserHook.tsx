'use client';
import { useGetUserDataQuery } from '../useQueries/useUserQuery';

export const useUserHook = () => {
  const { data: user } = useGetUserDataQuery();
  if (!user) return;
  if (user) return user;
};
