'use client';
import ReviewCard from '../review/ReviewCard';
import { useLikedReviewDataQuery, useReviewListDataQuery } from '@/hooks/useQueries/useReviewQuery';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';

const GetMostLikedReivew = () => {
  const likedReviewList = useLikedReviewDataQuery();
  const fetchReviewsData = useReviewListDataQuery();

  const likedReviewIds = likedReviewList?.map((item) => item.review_id);
  const zeroLikedReviews = fetchReviewsData?.data?.filter((review) => !likedReviewIds?.includes(review.review_id));

  const likedReviews = fetchReviewsData?.data?.filter((review) => likedReviewIds?.includes(review.review_id));

  likedReviews?.sort((a, b) => {
    const aLikes = likedReviewIds?.filter((id) => id === a.review_id).length || 0;
    const bLikes = likedReviewIds?.filter((id) => id === b.review_id).length || 0;
    return bLikes - aLikes;
  });

  const sliceReviews = [...(likedReviews || []), ...(zeroLikedReviews || [])].slice(0, 6);

  return (
    <div className="px-[24px] max-w-[1000px]">
      <div className="flex items-center justify-between ">
        <div className="flex items-center mb-[16px]">
          <p className="text-[26px] font-bold mr-[10px]">Best Review</p>
        </div>
        <div className="flex items-center mb-[15px]">
          <Link href="/review/pageNumber/1">더보기</Link>
          <div className="text-mainColor">
            <IoIosArrowForward />
          </div>
        </div>
      </div>
      <ul className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 grid-cols-3 gap-x-6 gap-y-8">
        {sliceReviews.map((item) => (
          <ReviewCard key={item.review_id} review={item} />
        ))}
      </ul>
    </div>
  );
};

export default GetMostLikedReivew;
