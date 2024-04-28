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

  const sliceReviews = [...(likedReviews || []), ...(zeroLikedReviews || [])].slice(0, 8);

  return (
    <div className="px-[24px] w-full max-w-[1080px]">
      <div className="flex items-center justify-between mb-[12px]">
        <div className="flex items-center">
          <p className="text-2xl font-bold mr-[10px]">실시간 베스트 후기</p>
        </div>
        <div className="flex items-center">
          <Link href="/review/pageNumber/1" className="text-sm text-gray2">
            더보기
          </Link>
          <div className="text-mainColor text-sm">
            <IoIosArrowForward />
          </div>
        </div>
      </div>
      <ul className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 grid-cols-4 gap-x-2 gap-y-4">
        {sliceReviews.map((item) => (
          <ReviewCard key={item.review_id} review={item} />
        ))}
      </ul>
    </div>
  );
};

export default GetMostLikedReivew;
