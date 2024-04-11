'use client';

import React, { useEffect, useState } from 'react';
import ToggleButton from './ToggleButton';
import HeartFillIcon from '(@/utils/icons/HeartFillIcon)';
import HeartIcon from '(@/utils/icons/HeartIcon)';
import { useQuery } from '@tanstack/react-query';
import { LIKED_COUNT_QUERY_KEY, LIKED_QUERY_KEY } from '(@/query/review/likeQueryKeys)';
import { fetchLikeCount, fetchLikestatus, useToggleLikeMutation } from '(@/query/review/likeQueryFns)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

type Props = {
  review_id: string;
};

const ReviewHeart = ({ review_id }: Props) => {
  const [likes, setLikes] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUser, setLikeUser] = useState<string[]>([]);

  const { data: user, isPending, isError, error, isLoggedIn } = useGetUserDataQuery();
  const userId = user?.user_id;

  //좋아요 status
  const useLikedReviewDataQuery = (review_id: string) => {
    const { data: likedUsers } = useQuery({
      queryKey: [LIKED_QUERY_KEY, review_id],
      queryFn: async () => await fetchLikestatus(review_id)
    });
    return likedUsers;
  };

  const likedUsers = useLikedReviewDataQuery(review_id);

  useEffect(() => {
    if (!likedUsers || likedUsers.length === 0) {
      setLikes(false);
      return;
    }
    const userLikes = likedUsers.some((likedUser) => likedUser.user_id === userId);
    setLikes(userLikes);
  }, [likedUsers, userId]);

  //좋아요 count
  const useLikedReviewCountQuery = (review_id: string) => {
    const { data: likeCountData, error } = useQuery({
      queryKey: [LIKED_COUNT_QUERY_KEY, review_id],
      queryFn: async () => await fetchLikeCount(review_id)
    });
    if (error) {
      console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
      return 0;
    }
    return likeCountData;
  };

  const likeCountData = useLikedReviewCountQuery(review_id);

  useEffect(() => {
    if (likeCountData) {
      setLikeCount(likeCountData.length);
    } else {
      setLikeCount(0);
    }
  }, [likeCountData]);

  //좋아요 toggle
  const toggleLikeMutation = useToggleLikeMutation();

  const handleLikeToggle = async () => {
    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    try {
      await toggleLikeMutation.mutateAsync({ review_id, userId });
      if (likes) {
        setLikeCount((prevCount) => prevCount - 1);
        setLikes(false);
        setLikeUser((prevLikeUser) => prevLikeUser.filter((id) => id !== userId));
      } else {
        setLikeCount((prevCount) => prevCount + 1);
        setLikes(true);
        setLikeUser((prevLikeUser) => [...prevLikeUser, userId]);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div>
        <ToggleButton
          toggled={likes ?? false}
          onToggle={handleLikeToggle}
          onIcon={<HeartFillIcon />}
          offIcon={<HeartIcon />}
        />
      </div>
      <div className="pb-1">{likeCount}</div>
    </div>
  );
};

export default ReviewHeart;
