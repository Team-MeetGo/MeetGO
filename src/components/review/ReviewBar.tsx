'use client';

import React, { useEffect, useState } from 'react';
import ToggleButton from './ToggleButton';
import HeartFillIcon from '(@/utils/icons/HeartFillIcon)';
import HeartIcon from '(@/utils/icons/HeartIcon)';
import { clientSupabase } from '(@/utils/supabase/client)';

type Props = {
  review_id: string;
};

const ReviewBar = ({ review_id }: Props) => {
  const [commentCount, setCommentCount] = useState(0);
  const [likes, setLikes] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUser, setLiketest] = useState<string[]>([]);

  const fetchCommentCount = async (review_id: string) => {
    let { data: test_review_comment, error } = await clientSupabase
      .from('test_review_comment')
      .select('*')
      .eq('review_id', review_id);

    if (error) {
      throw error;
    }

    if (test_review_comment) {
      setCommentCount(test_review_comment.length);
    } else {
      setCommentCount(0);
    }
  };

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

  useEffect(() => {
    fetchCommentCount(review_id);
    fetchLikeCount(review_id);
  }, [review_id]);

  const handleLikeToggle = async () => {
    const userId = '8fe87c99-842a-4fde-a0e8-918a0171e9a6';
    await addLikedUser(review_id, userId);
    await fetchLikeCount(review_id);
    await fetchCommentCount(review_id);
    if (likes) {
      setLikes(false);
      setLiketest((prevLikeUser) => prevLikeUser.filter((id) => id !== userId));
    } else {
      setLikes(true);
      setLiketest((prevLikeUser) => [...prevLikeUser, userId]);
    }
    setLikes(!likes);
  };

  const addLikedUser = async (review_id: string, user_id: string) => {
    const userId = '8fe87c99-842a-4fde-a0e8-918a0171e9a6';

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
      <div className="flex gap-2">
        <p>댓글</p>
        <div>{commentCount}</div>
      </div>
    </div>
  );
};

export default ReviewBar;
