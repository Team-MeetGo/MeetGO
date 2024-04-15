'use client';

import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { useFetchCommentData } from '@/hooks/useQueries/useCommentQuery';

type Props = {
  review_id: string;
};

const ReviewComment = ({ review_id }: Props) => {
  const { commentData } = useFetchCommentData(review_id);

  return (
    <div className="flex gap-1 items-center">
      <div className="pb-[7px]" style={{ fontSize: '1.1rem' }}>
        <HiOutlineChatBubbleOvalLeftEllipsis />
      </div>
      <div className="pb-1 text-[16px]">{commentData?.length}</div>
    </div>
  );
};

export default ReviewComment;
