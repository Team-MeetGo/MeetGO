'use client';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

// 쿼리 테스트
const Test = () => {
  const userData = useGetUserDataQuery();
  if (!userData) return null;
  const userId = userData.user_id;
  console.log(userId);

  return <div>{userData.favorite}</div>;
};

export default Test;
