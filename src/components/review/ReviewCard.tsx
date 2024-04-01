import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export type ReviewType = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_url: string | null;
};

const reviewCard = ({ review }: { review: ReviewType }) => {
  return (
    <div key={review.review_id} className="flex justify-center item-center bg-green-200 p-4">
      <Link href={`/review/${review.review_id}`}>
        <div>
          {review.image_url ? <Image src={review.image_url} alt="reviewImage" height={400} width={400} /> : null}
        </div>
        <div>{review.review_title}</div>
        <div>{review.user_id}</div>
        <div>{review.review_contents}</div>
        <div>{review.created_at}</div>
      </Link>
    </div>
  );
};

export default reviewCard;
