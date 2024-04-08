'use client';

import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { clientSupabase } from '(@/utils/supabase/client)';
import NewReview from './NewReview';
import Link from 'next/link';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { Selection } from '@react-types/shared';
import { userStore } from '(@/store/userStore)';

export type reviewData = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_urls: string[] | null;
};

const ReviewList: React.FC = () => {
  const [reviewData, setReviewData] = useState<reviewData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 9;
  const [selected, setSelected] = React.useState<Selection>(new Set(['최신 순']));
  const { isLoggedIn, setIsLoggedIn } = userStore((state) => state);

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

  async function getMostLikedReview() {
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

    setReviewData([...(likedReviews || []), ...(zeroLikedReviews || [])]);
  }

  const handleSelectionChange = (keys: Selection) => {
    setSelected(keys);

    if (keys instanceof Set && keys.has('최신 순')) {
      getRecentReview();
    } else if (keys instanceof Set && keys.has('좋아요 순')) {
      getMostLikedReview();
    }
  };

  useEffect(() => {
    if (selected instanceof Set && selected.has('최신 순')) {
      getRecentReview();
    } else if (selected instanceof Set && selected.has('좋아요 순')) {
      getMostLikedReview();
    }
  }, []);

  useEffect(() => {
    getRecentReview();
  }, []);

  async function getRecentReview() {
    let { data, count } = await clientSupabase.from('review').select('*', { count: 'estimated' });
    if (data) {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReviewData(data);
      setTotalReviews(count || 0);
    }
  }

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewData.slice(indexOfFirstReview, indexOfLastReview);

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
              <DropdownItem key="최신 순" onClick={getRecentReview}>
                최신 순
              </DropdownItem>
              <DropdownItem key="좋아요 순" onClick={getMostLikedReview}>
                좋아요 순
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>{isLoggedIn ? <NewReview /> : null}</div>
      </div>
      <ul className="grid grid-cols-3 gap-2 gap-y-4">
        {currentReviews.map((item, index) => (
          <ReviewCard key={index} review={item} />
        ))}
      </ul>
      <div className="flex justify-center mt-4">
        {(() => {
          const totalPages = Math.ceil(totalReviews / reviewsPerPage);
          const pageNumbers = [];

          for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
              <Link key={i} href={`/review/pageNumber/${i}`} onClick={() => setCurrentPage(i)}>
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
