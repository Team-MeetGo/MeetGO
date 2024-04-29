'use client';
import { useGetUserDataQuery, useGetUserLikePostQuery } from '@/hooks/useQueries/useUserQuery';

const LikePost = () => {
  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id ?? '';

  const likePostData = useGetUserLikePostQuery(userId);

  return <div>LikePost</div>;
};

export default LikePost;
