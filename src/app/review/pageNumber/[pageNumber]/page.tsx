'use client';

import React, { useEffect, useState } from 'react';
import ReviewCard from '../../../../components/review/ReviewCard';
import Link from 'next/link';
import { clientSupabase } from '(@/utils/supabase/client)';
import NewReview from '(@/components/review/NewReview)';
import { useParams } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { Selection } from '@react-types/shared';
import { userStore } from '(@/store/userStore)';

interface ReviewData {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_urls: string[] | null;
}

const ReviewsPage = () => {
  const currentPage = useParams().pageNumber;
  const currentPageNumber = parseInt(currentPage[0]);
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const reviewsPerPage = 9;
  const [selected, setSelected] = React.useState<Selection>(new Set(['최신 순']));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);

  const getUserId = async () => {
    const userData = userStore.getState().user;
    return userData && userData[0].user_id;
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

  async function getMostLikedReview(page: number) {
    const likedReviewIds = (await clientSupabase.from('review_like').select('review_id')).data?.map(
      (item) => item.review_id
    );

    const { data: allReviews } = await clientSupabase.from('review').select('*');

    const zeroLikedReviews = allReviews?.filter((review) => !likedReviewIds?.includes(review.review_id));

    const likedReviews = allReviews?.filter((review) => likedReviewIds?.includes(review.review_id));

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
  };

  useEffect(() => {
    if (selected instanceof Set && selected.has('최신 순')) {
      getRecentReview(currentPageNumber);
    } else if (selected instanceof Set && selected.has('좋아요 순')) {
      getMostLikedReview(currentPageNumber);
    }
  }, []);

  async function getRecentReview(page: number) {
    let { data, count } = await clientSupabase.from('review').select('*', { count: 'estimated' });

    if (data) {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const startIdx = (page - 1) * reviewsPerPage;
      const endIdx = page * reviewsPerPage;
      const slicedData = data.slice(startIdx, endIdx);
      setReviewData(slicedData);
      setTotalReviews(count || 0);
    }
  }

  useEffect(() => {
    if (currentPageNumber) {
      getRecentReview(currentPageNumber);
    }
  }, []);

  async function handlePageChange(page: number) {
    await getRecentReview(page);
  }

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="capitalize">
                {selectedValue}
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
              <Link key={i} href={`/review/pageNumber/${i}`} prefetch onClick={() => handlePageChange(i)}>
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

export default ReviewsPage;
