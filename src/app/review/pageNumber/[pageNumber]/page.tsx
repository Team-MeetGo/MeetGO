import ReviewList from '(@/components/review/ReviewList)';

const ReviewsPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="w-full h-[208px] flex justify-center items-center text-white bg-gray-400 mb-[88px]">리뷰 페이지</p>
      <div className="max-w-[1160px]">
        <ReviewList />
      </div>
    </div>
  );
};

export default ReviewsPage;
