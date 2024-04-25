'use client';
import { fetchUserData, fetchUserLikePost, fetchUserPost } from '@/query/user/userQueryFns';
import { USER_DATA_QUERY_KEY, USER_LIKE_POST_QUERY_KEY, USER_POST_QUERY_KEY } from '@/query/user/userQueryKeys';
import { profileCount } from '@/store/userStore';
import { UsersType } from '@/types/userTypes';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

// 1) initialData
// 2) suspense + fallback UI 사용
// 3) 조건부 분기를 통한 fallback UI 사용
// 4) 프리패치 쿼리 (서버에서 유저에 대한 데이터를 들고 내려온다)

export const useGetUserDataQuery = () => {
  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: [USER_DATA_QUERY_KEY],
    queryFn: fetchUserData
  });

  const isLoggedIn = data?.user_id ? true : false;

  return { data, isPending, isError, error, isSuccess, isLoggedIn };
};

export const useGetUserPostQuery = (userId: string) => {
  const { data } = useQuery({
    queryKey: [USER_POST_QUERY_KEY],
    queryFn: () => fetchUserPost(userId),
    enabled: !!userId
  });

  const { setPostCount } = profileCount();
  useEffect(() => {
    if (data) {
      setPostCount(data.length);
    }
  }, [data]);

  return data;
};

export const useGetUserLikePostQuery = (userId: string) => {
  const { data } = useQuery({
    queryKey: [USER_LIKE_POST_QUERY_KEY],
    queryFn: () => fetchUserLikePost(userId),
    enabled: !!userId
  });

  const { setLikedPostCount } = profileCount();
  useEffect(() => {
    if (data) {
      setLikedPostCount(data.length);
    }
  }, [data]);

  return data;
};
