'use client';

import CommentList from '(@/components/review/comment/CommentList)';
import NewComment from '(@/components/review/comment/NewComment)';
import ReviewDetail from '(@/components/review/ReviewDetail)';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const ReviewDetailPage = () => {
  const { review_id } = useParams();
  const id = review_id.toString();
  const [commentCount, setCommentCount] = useState(0);
  const handleUpdateCommentCount = (count: number) => {
    setCommentCount(count);
  };
  return (
    <div>
      <div>
        <ReviewDetail review_id={id} commentCount={commentCount} />
      </div>
      <div>
        <NewComment review_id={id} />
      </div>
      <div>
        <CommentList review_id={id} onUpdateCommentCount={handleUpdateCommentCount} />
      </div>
    </div>
  );
};

export default ReviewDetailPage;
