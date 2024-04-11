'use client';

import React, { useEffect, useState } from 'react';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { COMMENT_COUNT_QUERY_KEY } from '(@/query/review/commentQueryKeys)';
import { fetchCommentCount } from '(@/query/review/commentQueryFns)';

type Props = {
  review_id: string;
};

const ReviewComment = ({ review_id }: Props) => {
  const [commentCount, setCommentCount] = useState(0);

  const useFetchCommentCountQuery = (review_id: string) => {
    const { data: commentCountData, error } = useQuery({
      queryKey: [COMMENT_COUNT_QUERY_KEY, review_id],
      queryFn: async () => await fetchCommentCount(review_id)
    });
    if (error) {
      console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
      return 0;
    }
    return commentCountData;
  };

  const commentCountData = useFetchCommentCountQuery(review_id);

  useEffect(() => {
    if (commentCountData) {
      setCommentCount(commentCountData.length);
    } else {
      setCommentCount(0);
    }
  }, [commentCountData]);

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
