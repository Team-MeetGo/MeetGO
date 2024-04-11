'use client';

import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import NewReview from './NewReview';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { Selection } from '@react-types/shared';
import { userStore } from '(@/store/userStore)';
import { useQuery } from '@tanstack/react-query';
import { fetchLikedReviewList, fetchReviewList } from '(@/query/review/reviewQueryFns)';
import { LIKED_REVIEWLIST_QUERY_KEY, REVIEWLIST_QUERY_KEY } from '(@/query/review/reviewQueryKeys)';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

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
  const [selected, setSelected] = React.useState<Selection>(new Set(['최신 순']));
  const { isLoggedIn, setIsLoggedIn } = userStore((state) => state);

  const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);

  const getUserId = async () => {
    const userData = userStore.getState().user;
    return userData && userData.user_id;
  };

  const checkLoginStatus = async () => {
    const userId = await getUserId();
    if (userId !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const { data: likedReviewList } = useQuery({
    queryKey: [LIKED_REVIEWLIST_QUERY_KEY],
    queryFn: fetchLikedReviewList
  });

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

    if (keys instanceof Set && keys.has('최신 순')) {
      getRecentReview(currentPageNumber);
    } else if (keys instanceof Set && keys.has('좋아요 순')) {
      getMostLikedReview(currentPageNumber);
    }

    setIsOpen(false);
  };

  useEffect(() => {
    if (selected instanceof Set && selected.has('최신 순')) {
      getRecentReview(currentPageNumber);
    } else if (selected instanceof Set && selected.has('좋아요 순')) {
      getMostLikedReview(currentPageNumber);
    }
  }, []);

  const { data: fetchReviewsData } = useQuery({
    queryKey: [REVIEWLIST_QUERY_KEY],
    queryFn: fetchReviewList
  });

  async function getRecentReview(page: number) {
    if (fetchReviewsData) {
      fetchReviewsData.data?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const startIdx = (page - 1) * reviewsPerPage;
      const endIdx = page * reviewsPerPage;
      const slicedData = fetchReviewsData.data?.slice(startIdx, endIdx);
      setReviewData(slicedData || []);
      setTotalReviews(fetchReviewsData.count || 0);
    }
  }

  useEffect(() => {
    getRecentReview(currentPageNumber);
  }, [currentPageNumber, fetchReviewsData]);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Dropdown onOpenChange={setIsOpen} isOpen={isOpen}>
            <DropdownTrigger>
              <Button variant="bordered" className="capitalize">
                {/* {selectedValue} */}
                {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />} {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selected}
              onSelectionChange={handleSelectionChange}
            >
              <DropdownItem key="최신 순" onClick={() => getRecentReview(currentPageNumber)}>
                최신 순
                {/* <IoIosArrowDown />
                <IoIosArrowUp /> */}
              </DropdownItem>
              <DropdownItem key="좋아요 순" onClick={() => getMostLikedReview(currentPageNumber)}>
                좋아요 순
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
          <div>{isLoggedIn ? <NewReview /> : null}</div>
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-2 gap-y-4">
        {reviewData.map((item, index) => (
          <ReviewCard key={index} review={item} />
        ))}
      </ul>
      <div className="flex justify-center mt-4">
        {(() => {
          const totalPages = Math.ceil(totalReviews / reviewsPerPage);
          const pageNumbers = [];

          for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
              <Link key={i} href={`/review/pageNumber/${i}`} prefetch>
                {i}
              </Link>
            );
          }

          return pageNumbers;
        })()}
      </div>
    </div>
  );
};

export default ReviewList;
