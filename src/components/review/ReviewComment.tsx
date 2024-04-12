'use client';

import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { COMMENT_QUERY_KEY } from '(@/query/review/commentQueryKeys)';
import { fetchCommentData } from '(@/query/review/commentQueryFns)';

type Props = {
  review_id: string;
};

const ReviewComment = ({ review_id }: Props) => {
  const { data: commentData, isLoading: isCommentDataLoading } = useQuery({
    queryKey: [COMMENT_QUERY_KEY, review_id],
    queryFn: async () => await fetchCommentData(review_id)
  });

  return (
    <div className="flex gap-1 items-center">
      <div className="pb-[7px]" style={{ fontSize: '1.1rem' }}>
        <HiOutlineChatBubbleOvalLeftEllipsis />
      </div>
      <div className="pb-1">{commentData?.length}</div>
    </div>
  );
};

export default ReviewComment;
