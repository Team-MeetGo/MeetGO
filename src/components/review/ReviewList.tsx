'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ReviewCard from './ReviewCard';
import NewReview from './NewReview';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { Selection } from '@react-types/shared';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useLikedReviewDataQuery, useReviewListDataQuery } from '@/hooks/useQueries/useReviewQuery';
import { GrNext, GrPrevious } from 'react-icons/gr';

export type reviewData = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_urls: string[] | null;
  show_nickname: boolean | null;
};

const ReviewList: React.FC = () => {
  const currentPage = useParams().pageNumber;
  const currentPageNumber = parseInt(currentPage[0]);
  const [reviewData, setReviewData] = useState<reviewData[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const reviewsPerPage = 9;
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = React.useState<Selection>(new Set(['최신순']));
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const router = useRouter();

  const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);

  const { data: isLoggedIn } = useGetUserDataQuery();

  const likedReviewList = useLikedReviewDataQuery();

  async function getMostLikedReview(page: number) {
    const likedReviewIds = likedReviewList?.map((item) => item.review_id);

    const zeroLikedReviews = fetchReviewsData?.data?.filter((review) => !likedReviewIds?.includes(review.review_id));

    const likedReviews = fetchReviewsData?.data?.filter((review) => likedReviewIds?.includes(review.review_id));

    likedReviews?.sort((a, b) => {
      const aLikes = likedReviewIds?.filter((id) => id === a.review_id).length || 0;
      const bLikes = likedReviewIds?.filter((id) => id === b.review_id).length || 0;
      return bLikes - aLikes;
    });

    const combinedReviews = [...(likedReviews || []), ...(zeroLikedReviews || [])];

    if (combinedReviews) {
      const startIdx = (page - 1) * reviewsPerPage;
      const endIdx = page * reviewsPerPage;
      const slicedData = combinedReviews.slice(startIdx, endIdx);
      setReviewData(slicedData);
      setTotalReviews(combinedReviews.length);
    }
  }

  const handleSelectionChange = (keys: Selection) => {
    setSelected(keys);

    if (keys instanceof Set && keys.has('최신순')) {
      getRecentReview(currentPageNumber);
    } else if (keys instanceof Set && keys.has('인기순')) {
      getMostLikedReview(currentPageNumber);
    }

    setIsOpen(false);
  };

  const fetchReviewsData = useReviewListDataQuery();

  async function getRecentReview(page: number) {
    if (fetchReviewsData?.data) {
      const sortedData = [...fetchReviewsData.data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const startIdx = (page - 1) * reviewsPerPage;
      const endIdx = page * reviewsPerPage;
      const slicedData = sortedData.slice(startIdx, endIdx);

      if (JSON.stringify(reviewData) !== JSON.stringify(slicedData)) {
        setReviewData(slicedData);
      }
      if (totalReviews !== fetchReviewsData.count) {
        setTotalReviews(fetchReviewsData.count || 0);
      }
    }
  }

  const memoizedData = useMemo(() => {
    return fetchReviewsData?.data || [];
  }, [fetchReviewsData?.data]);

  useEffect(() => {
    if (selected instanceof Set && selected.has('최신순')) {
      getRecentReview(currentPageNumber);
    } else if (selected instanceof Set && selected.has('인기순')) {
      getMostLikedReview(currentPageNumber);
    } else if (!selected) {
      getRecentReview(currentPageNumber);
    }
  }, [selected, currentPageNumber, memoizedData]);

  const prevPageNumber = currentPageNumber - 1;
  const nextPageNumber = currentPageNumber + 1;

  return (
    <div className="flex flex-col justify-center items-center px-[24px]">
      <div className="flex justify-between w-full max-w-[1000px] mb-[24px]">
        <div>
          <Dropdown onOpenChange={setIsOpen} isOpen={isOpen} className="min-w-0 w-auto">
            <DropdownTrigger className="w-[106px]">
              <Button variant="bordered" className="capitalize p-[12px] w-[106px] h-[51px]">
                <div className="text-[16px]">{selectedValue}</div>
                <div>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selected}
              onSelectionChange={handleSelectionChange}
              className="w-[106px] h-full"
            >
              <DropdownItem
                key="최신순"
                color="secondary"
                className="text-[80px] p-[6px]"
                onClick={() => getRecentReview(currentPageNumber)}
              >
                최신순
              </DropdownItem>
              <DropdownItem
                key="인기순"
                color="secondary"
                className="text-[16px]"
                onClick={() => getMostLikedReview(currentPageNumber)}
              >
                인기순
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
          <div>{isLoggedIn ? <NewReview /> : null}</div>
        </div>
      </div>
      <ul className="w-full grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3  gap-4 mb-[64px]">
        {reviewData.map((item, index) => (
          <ReviewCard key={index} review={item} />
        ))}
      </ul>
      <div className="flex mb-[88px]">
        <button
          className={`${currentPageNumber > 1 ? 'text-mainColor' : 'text-gray-500'}`}
          disabled={currentPageNumber <= 1}
          onClick={currentPageNumber > 1 ? () => router.push(`/review/pageNumber/${prevPageNumber}`) : undefined}
        >
          <GrPrevious />
        </button>
        <div className="flex mx-2 justify-center">
          {(() => {
            const pageNumbers = [];
            for (let i = 1; i <= totalPages; i++) {
              pageNumbers.push(
                <Link key={i} href={`/review/pageNumber/${i}`} prefetch>
                  <p
                    className={`mx-2 p-[10px] flex justify-center items-center w-[40px] h-[40px] rounded-[10px] border-1 border-[#A1A1AA] text-[#A1A1AA] hover:bg-mainColor hover:text-white duration-300 ${
                      currentPageNumber === i ? 'text-white bg-mainColor' : ''
                    }`}
                  >
                    {i}
                  </p>
                </Link>
              );
            }
            return pageNumbers;
          })()}
        </div>

        <button
          className={`${currentPageNumber < totalPages ? 'text-mainColor' : 'text-gray-500'}`}
          disabled={currentPageNumber >= totalPages}
          onClick={
            currentPageNumber < totalPages ? () => router.push(`/review/pageNumber/${nextPageNumber}`) : undefined
          }
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
