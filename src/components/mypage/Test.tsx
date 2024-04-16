'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';

// 쿼리 테스트
const Test = () => {
  const { data: user, isPending, isError } = useGetUserDataQuery();
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 발생</div>;
  if (!user) return null;
  const userId = user.user_id;
  console.log(userId);

  return <div>{user.favorite}</div>;
};

export default Test;
