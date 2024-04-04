'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { clientSupabase } from '(@/utils/supabase/client)';
import ReviewComment from './ReviewComment';
import ReviewHeart from './ReviewHeart';

export type ReviewType = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_url: string | null;
  test_image_url: string[] | null;
};

const ReviewCard = ({ review }: { review: ReviewType }) => {
  const [userNickname, setUserNickname] = useState<string | null>(null);

  async function getReviewDetail(review_id: string) {
    let { data: reviewDetail, error } = await clientSupabase
      .from('review')
      .select('review_title, review_contents, created_at, image_url, user_id, test_image_url')
      .eq('review_id', review_id)
      .single();

    if (error) {
      console.error('리뷰를 불러오지 못함', error);
    } else {
      if (reviewDetail) {
        const { user_id } = reviewDetail;
        const { data: userData, error: userError } = await clientSupabase
          .from('users')
          .select('nickname, avatar')
          .eq('user_id', user_id as string)
          .single();

        if (userError) {
          console.error('유저 정보를 불러오지 못함', userError);
        } else {
          setUserNickname(userData?.nickname || null);
        }
      }
    }
  }

  useEffect(() => {
    getReviewDetail(review.review_id);
  });

  return (
    <div key={review.review_id} className="flex flex-col justify-center item-center bg-green-200 p-4">
      <Link href={`/review/${review.review_id}`}>
        <div>
          {review.test_image_url && review.test_image_url.length > 0 ? (
            <Image
              src={review.test_image_url[0]}
              alt="reviewImage"
              height={400}
              width={400}
              className="w-full h-[280px] object-cover"
            />
          ) : null}
        </div>
        <div>{review.review_title}</div>
        <div>{review.review_contents}</div>
        <div>{userNickname}</div>
      </Link>
      <ReviewHeart review_id={review.review_id} />
      <ReviewComment review_id={review.review_id} />
    </div>
  );
};

export default ReviewCard;
