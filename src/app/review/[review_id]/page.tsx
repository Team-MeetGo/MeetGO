import CommentList from '@/components/review/comment/CommentList';
import ReviewDetail from '@/components/review/ReviewDetail';
import ReviewDetailNavigate from '@/components/review/ReviewDetailNavigate';

const ReviewDetailPage = ({ params }: { params: { review_id: string } }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col max-w-[1000px] w-full mb-[80px] p-[24px]">
        <div>
          <ReviewDetail review_id={params.review_id} />
        </div>
        <div>
          <CommentList review_id={params.review_id} />
        </div>
        <div>
          <ReviewDetailNavigate review_id={params.review_id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
