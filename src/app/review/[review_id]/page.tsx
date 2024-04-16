import CommentList from '@/components/review/comment/CommentList';
import ReviewDetail from '@/components/review/ReviewDetail';
import ReviewDetailNavigate from '@/components/review/ReviewDetailNavigate';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ReviewDetailPage = () => {
  const { review_id } = useParams();
  const id = review_id.toString();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[208px] flex justify-center items-center text-white text-[50px] bg-gradient-to-review mb-[88px]">
        <Link href="/review/pageNumber/1">
          <p className="text-white text-[50px]">리뷰페이지</p>
        </Link>
      </div>
      <div className="flex flex-col max-w-[1111px] w-full mb-[88px]">
        <div>
          <ReviewDetail review_id={id} />
        </div>
        <div>
          <CommentList review_id={id} />
        </div>
        <div>
          <ReviewDetailNavigate review_id={id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
