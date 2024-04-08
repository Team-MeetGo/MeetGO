'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { clientSupabase } from '(@/utils/supabase/client)';
import ReviewComment from './ReviewComment';
import ReviewHeart from './ReviewHeart';
import defaultImg from '../../../public/defaultImg.jpg';
import { useQuery } from '@tanstack/react-query';

export type ReviewType = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_urls: string[] | null;
  show_nickname: boolean | null;
};

const ReviewCard = ({ review }: { review: ReviewType }) => {
  const [userNickname, setUserNickname] = useState<string | null>(null);

  const {
    data: reviewDetailData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['REVIEW_DATA'],
    queryFn: async (review_id) => {
      let { data: reviewDetail, error } = await clientSupabase
        .from('review')
        .select('review_title, review_contents, created_at, user_id, image_urls')
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
  });

  // async function getReviewDetail(review_id: string) {
  //   let { data: reviewDetail, error } = await clientSupabase
  //     .from('review')
  //     .select('review_title, review_contents, created_at, user_id, image_urls')
  //     .eq('review_id', review_id)
  //     .single();

  //   if (error) {
  //     console.error('리뷰를 불러오지 못함', error);
  //   } else {
  //     if (reviewDetail) {
  //       const { user_id } = reviewDetail;
  //       const { data: userData, error: userError } = await clientSupabase
  //         .from('users')
  //         .select('nickname, avatar')
  //         .eq('user_id', user_id as string)
  //         .single();

  //       if (userError) {
  //         console.error('유저 정보를 불러오지 못함', userError);
  //       } else {
  //         setUserNickname(userData?.nickname || null);
  //       }
  //     }
  //   }
  // }

  // useEffect(() => {
  //   getReviewDetail(review.review_id);
  // }, []);

  return (
    <div
      key={review.review_id}
      className="flex flex-col justify-center item-center border-1 border-[#A1A1AA] rounded-[10px] p-4"
    >
      <Link href={`/review/${review.review_id}`}>
        <div>
          {review.image_urls && review.image_urls.length > 0 ? (
            <Image
              src={review.image_urls[0]}
              alt="reviewImage"
              height={400}
              width={400}
              className="w-full h-[280px] object-cover rounded-[10px]"
            />
          ) : (
            <Image
              src={defaultImg}
              alt="reviewImage"
              height={400}
              width={400}
              className="w-full h-[280px] object-cover rounded-[10px]"
            />
          )}
        </div>
        <div>{review.review_title}</div>
        <div>{review.review_contents}</div>
        <div>{review.show_nickname ? userNickname || '익명유저' : '익명유저'}</div>
      </Link>
      <div className="flex gap-2">
        <ReviewHeart review_id={review.review_id} />
        <ReviewComment review_id={review.review_id} />
      </div>
    </div>
  );
};

export default ReviewCard;
