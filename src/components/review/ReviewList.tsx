'use client';

import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { clientSupabase } from '(@/utils/supabase/client)';
import NewReview from './NewReview';
import Link from 'next/link';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { Selection } from '@react-types/shared';

export type reviewData = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_url: string | null;
  like_user: string[] | null;
  test_image_url: string[] | null;
};

const ReviewList: React.FC = () => {
  const [reviewData, setReviewData] = useState<reviewData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 9;
  const [selected, setSelected] = React.useState<Selection>(new Set(['최신 순']));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);

  const checkLoginStatus = async () => {
    const user = await clientSupabase.auth.getUser();
    console.log(user);
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  async function getMostLikedReview() {
    let { data: likedReviews, error } = await clientSupabase.from('test_review_like').select('*');

    if (likedReviews) {
      // review_id를 기준으로 데이터를 그룹화합니다.
      const groupedReviews: { [key: string]: reviewData[] } = likedReviews.reduce((acc, curr) => {
        if (curr.review_id !== null) {
          acc[curr.review_id] = acc[curr.review_id] || [];
          acc[curr.review_id].push(curr);
        }
        return acc;
      }, {});

      // 그룹화된 데이터를 review_id의 갯수를 기준으로 정렬합니다.
      const sortedReviews = Object.values(groupedReviews).sort(
        (a: reviewData[], b: reviewData[]) => b.length - a.length
      );

      // 정렬된 데이터를 리뷰 데이터로 설정합니다.
      setReviewData(sortedReviews.flat());
      console.log(sortedReviews.flat());
    }
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
    console.log(getMostLikedReview);
  }, [selected]);

  useEffect(() => {
    getRecentReview();
  }, [currentPage]);

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
