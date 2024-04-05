'use client';

import React, { useEffect, useState } from 'react';
import { clientSupabase } from '(@/utils/supabase/client)';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';

type Props = {
  review_id: string;
};

const ReviewComment = ({ review_id }: Props) => {
  const [commentCount, setCommentCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

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

  const getUserId = async () => {
    const { data: user } = await clientSupabase.auth.getUser();
    setUserId(user?.user?.id || '');
  };

  useEffect(() => {
    fetchCommentCount(review_id);
    getUserId();
  }, [review_id]);

  return (
    <div className="flex gap-1 items-center">
      <div className="pb-[7px]" style={{ fontSize: '1.1rem' }}>
        <HiOutlineChatBubbleOvalLeftEllipsis />
      </div>
      <div className="pb-1">{commentCount}</div>
    </div>
  );
};

export default ReviewComment;
