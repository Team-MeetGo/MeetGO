'use client';
import { useAsyncNavigation } from '@/hooks/custom/useReviewNavigation';
import { useReviewListDataQuery } from '@/query/useQueries/useReviewQuery';
import Link from 'next/link';
import React from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';

type Props = {
  review_id: string;
};

const ReviewDetailNavigate = ({ review_id }: Props) => {
  const { data: fetchReviewsData, isLoading } = useReviewListDataQuery();
  const [navigation, isNavigationLoading] = useAsyncNavigation(review_id, fetchReviewsData || []);

  const { prevReviewId, nextReviewId } = navigation;

  if (isLoading || isNavigationLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-[32px]">
      <div className="flex justify-between items-center">
        {prevReviewId ? (
          <Link href={`/review/${prevReviewId}`}>
            <div className="flex items-center">
              <div className="w-[20px] h-[20px] flex items-center">
                <GrPrevious />
              </div>
              <p className="text-[14px]">이전 글</p>
            </div>
          </Link>
        ) : (
          <Link href={`/review/${prevReviewId}`}>
            <div className="flex items-center">
              <div className="w-[20px] h-[20px] flex items-center"></div>
              <p className="text-[14px]"></p>
            </div>
          </Link>
        )}
        {nextReviewId ? (
          <Link href={`/review/${nextReviewId}`}>
            <div className="flex items-center">
              <p className="text-[14px]">다음 글</p>
              <div className="w-[20px] h-[20px] flex items-center">
                <GrNext />
              </div>
            </div>
          </Link>
        ) : (
          <Link href={`/review/${nextReviewId}`}>
            <div className="flex items-center">
              <p className="text-[14px]"></p>
              <div className="w-[20px] h-[20px] flex items-center"></div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailNavigate;
