'use client';

import React, { useEffect, useState } from 'react';
import ToggleButton from './ToggleButton';
import HeartFillIcon from '(@/utils/icons/HeartFillIcon)';
import HeartIcon from '(@/utils/icons/HeartIcon)';
import { clientSupabase } from '(@/utils/supabase/client)';

type Props = {
  review_id: string;
};

const ReviewHeart = ({ review_id }: Props) => {
  const [likes, setLikes] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUser, setLikeUser] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchLikeCount = async (review_id: string) => {
    let { data: review_like, error } = await clientSupabase.from('review_like').select('*').eq('review_id', review_id);

    if (error) {
      throw error;
    }
    if (review_like) {
      setLikeCount(review_like.length);
    } else {
      setLikeCount(0);
    }
  };

  const getUserId = async () => {
    const { data: user } = await clientSupabase.auth.getUser();
    setUserId(user?.user?.id || '');
  };

  useEffect(() => {
    const fetchLikedStatus = async () => {
      const { data: user } = await clientSupabase.auth.getUser();
      const userId = user?.user?.id || '';
      console.log('유저 아이디:', userId);

      const { data: likedUsers } = await clientSupabase
        .from('review_like')
        .select('user_id')
        .eq('review_id', review_id);

      if (!likedUsers || likedUsers.length === 0) {
        setLikes(false);
        return;
      }

      const userLikes = likedUsers.some((likedUser) => likedUser.user_id === userId);
      setLikes(userLikes);
    };

    fetchLikedStatus();
  }, [review_id]);

  useEffect(() => {
    fetchLikeCount(review_id);
    getUserId();
  }, [review_id, userId]);

  useEffect(() => {
    fetchLikeCount(review_id);
    getUserId();
  }, [review_id, userId]);
  const handleLikeToggle = async () => {
    const userId = (await clientSupabase.auth.getUser()).data.user?.id;

    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const { data: existingData } = await clientSupabase
      .from('review_like')
      .select('review_id')
      .eq('review_id', review_id)
      .eq('user_id', userId);

    if (existingData && existingData.length > 0) {
      await clientSupabase.from('review_like').delete().eq('review_id', review_id).eq('user_id', userId);
      setLikeCount((prevCount) => prevCount - 1);
      setLikes(false);
      setLikeUser((prevLikeUser) => prevLikeUser.filter((id) => id !== userId));
    } else {
      await clientSupabase.from('review_like').insert([{ review_id, user_id: userId }]);
      setLikeCount((prevCount) => prevCount + 1);
      setLikes(true);
      setLikeUser((prevLikeUser) => [...prevLikeUser, userId]);
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
