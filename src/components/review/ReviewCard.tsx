import Image from 'next/image';
import React from 'react';

export type ReviewType = {
  user_id: string;
  review_id: string;
  review_title: string;
  review_contents: string;
  created_at: string;
  image_url: string;
};

const reviewCard = ({ review }: { review: ReviewType }) => {
  return (
    <div>
      <div>{review.image_url ? <Image src={review.image_url} alt="reviewImage" height={300} width={300} /> : null}</div>
      <div>{review.review_title}</div>
      <div>{review.user_id}</div>
      <div>{review.review_contents}</div>
      <div>{review.created_at}</div>
    </div>
  );
};

export default reviewCard;
