'use client';

import CommentList from '(@/components/review/comment/CommentList)';
import NewComment from '(@/components/review/comment/NewComment)';
import ReviewDetail from '(@/components/review/ReviewDetail)';
import { useParams } from 'next/navigation';

const ReviewDetailPage = () => {
  const { review_id } = useParams();
  const id = review_id.toString();
  return (
    <div>
      <div>
        <ReviewDetail review_id={id} />
      </div>
      <div>
        <NewComment review_id={id} />
      </div>
      <div>
        <CommentList review_id={id} />
      </div>
    </div>
  );
};

export default ReviewDetailPage;
