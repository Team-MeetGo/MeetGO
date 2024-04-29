import ReviewList from '@/components/review/ReviewList';
import ThinBanner from '@/utils/banner/ThinBanner';
import Link from 'next/link';

const ReviewsPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* <div className="w-full h-[120px] flex justify-center items-center text-white text-2xl bg-gradient-to-review mb-8"> */}

      {/* </div> */}
      <div className="max-w-[1000px]">
        <ReviewList />
      </div>
      <ThinBanner />
    </div>
  );
};

export default ReviewsPage;
