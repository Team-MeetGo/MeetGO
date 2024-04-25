import CommentList from '@/components/review/comment/CommentList';
import ReviewDetail from '@/components/review/ReviewDetail';
import ReviewDetailNavigate from '@/components/review/ReviewDetailNavigate';
import Link from 'next/link';

const ReviewDetailPage = ({ params }: { params: { review_id: string } }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[208px] flex justify-center items-center text-white text-5xl bg-gradient-to-review mb-[40px]">
        <Link href="/review/pageNumber/1">
          <p className="text-white text-[50px]">Review</p>
        </Link>
      </div>
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
