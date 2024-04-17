import ReviewList from '@/components/review/ReviewList';
import Link from 'next/link';

const ReviewsPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[208px] flex justify-center items-center text-white text-[50px] bg-gradient-to-review mb-[88px]">
        <Link href="/review/page/1">
          <p className="text-white text-[50px]">Review</p>
        </Link>
      </div>
      <div className="max-w-[1160px]">
        <ReviewList />
      </div>
    </div>
  );
};

export default ReviewsPage;
