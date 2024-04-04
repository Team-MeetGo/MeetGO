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
  const [likeUser, setLiketest] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchLikeCount = async (review_id: string) => {
    let { data: test_review_like, error } = await clientSupabase
      .from('test_review_like')
      .select('*')
      .eq('review_id', review_id);

    if (error) {
      throw error;
    }
    if (test_review_like) {
      setLikeCount(test_review_like.length);
    } else {
      setLikeCount(0);
    }
  };

  const getUserId = async () => {
    const { data: user } = await clientSupabase.auth.getUser();
    setUserId(user?.user?.id || '');
  };

  useEffect(() => {
    const likedStatus = async () => {
      const { data: likedUser, error } = await clientSupabase
        .from('review')
        .select('like_user')
        .eq('review_id', review_id)
        .single();

      if (likedUser && likedUser.like_user && likedUser.like_user.includes(userId as string)) {
        setLikes(true);
      } else {
        setLikes(false);
      }
    };
    likedStatus();
  }, [userId, review_id]);

  useEffect(() => {
    fetchLikeCount(review_id);
    getUserId();
  }, [review_id]);

  const handleLikeToggle = async () => {
    const userId = (await clientSupabase.auth.getUser()).data.user?.id;
    console.log(userId);

    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    await addLikedUser(review_id, userId as string);
    await fetchLikeCount(review_id);
    if (likes) {
      setLikes(false);
      setLiketest((prevLikeUser) => prevLikeUser.filter((id) => id !== userId));
    } else {
      setLikes(true);
      setLiketest((prevLikeUser) => {
        if (userId) {
          return [...prevLikeUser, userId];
        } else {
          return prevLikeUser;
        }
      });
    }
    setLikes(!likes);
  };

  const addLikedUser = async (review_id: string, userId: string) => {
    const { data: existingData } = await clientSupabase
      .from('test_review_like')
      .select('review_id')
      .eq('review_id', review_id)
      .eq('user_id', userId);

    if (existingData && existingData.length > 0) {
      await clientSupabase.from('test_review_like').delete().eq('review_id', review_id).eq('user_id', userId);
      const { data, error } = await clientSupabase
        .from('review')
        .update({ like_user: likeUser.filter((id) => id !== userId) })
        .eq('review_id', review_id)
        .select();

      if (error) {
        throw error;
      }
    } else {
      await clientSupabase.from('test_review_like').insert([{ user_id: userId, review_id: review_id }]);
      const { data, error } = await clientSupabase
        .from('review')
        .update({ like_user: [...likeUser, userId] })
        .eq('review_id', review_id)
        .select();

      if (error) {
        throw error;
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center item-center">
      <div className="flex gap-2">
        <ToggleButton
          toggled={likes ?? false}
          onToggle={handleLikeToggle}
          onIcon={<HeartFillIcon />}
          offIcon={<HeartIcon />}
        />
        <div>{likeCount}</div>
      </div>
    </div>
  );
};

export default ReviewHeart;
