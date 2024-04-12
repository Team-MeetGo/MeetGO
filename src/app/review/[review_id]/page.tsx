'use client';

import CommentList from '(@/components/review/comment/CommentList)';
import ReviewDetail from '(@/components/review/ReviewDetail)';
import { useParams } from 'next/navigation';

const ReviewDetailPage = () => {
  const { review_id } = useParams();
  const id = review_id.toString();

  return (
    <div className="flex flex-col bg-gray-200 justify-center items-center">
      <div className="flex flex-col max-w-[1111px] bg-red-200 w-full">
        <div>
          <ReviewDetail review_id={id} />
        </div>
        <div>
          <CommentList review_id={id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
