'use client';

import React, { useEffect, useState } from 'react';
import ToggleButton from './ToggleButton';
import HeartFillIcon from '(@/utils/icons/HeartFillIcon)';
import HeartIcon from '(@/utils/icons/HeartIcon)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { useLikedReviewCountQuery, useLikedReviewDataQuery } from '(@/hooks/useQueries/useLikeQuery)';
import { useToggleLikeMutation } from '(@/hooks/useMutation/useLikeMutation)';

type Props = {
  review_id: string;
};

const ReviewLike = ({ review_id }: Props) => {
  const [likes, setLikes] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUser, setLikeUser] = useState<string[]>([]);

  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id;

  //좋아요 status
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

export default ReviewLike;
