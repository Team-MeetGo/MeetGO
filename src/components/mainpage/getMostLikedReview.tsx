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
    <div>
      <div className="max-w-[1000px] flex items-center justify-between mr-[15px]">
        <div className="flex items-center mb-[15px] ml-[15px]">
          <p className="text-[26px] font-bold mr-[10px]">리뷰 페이지</p>
          <p className="text-[16px] text-[#A1A1AA]">{fetchReviewsData?.count}리뷰</p>
        </div>
        <div className="flex items-center mr-[10px] mb-[15px]">
          <Link href="/review/pageNumber/1">더보기</Link>
          <div className="text-mainColor">
            <IoIosArrowForward />
          </div>
        </div>
      </div>
      <ul className="max-w-[1000px] grid grid-cols-3 gap-x-[24px] gap-y-[32px]">
        {sliceReviews.map((item, index) => (
          <ReviewCard key={index} review={item} />
        ))}
      </ul>
    </div>
  );
};

export default GetMostLikedReivew;
