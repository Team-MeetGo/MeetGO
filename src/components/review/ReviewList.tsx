'use client';

import { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { clientSupabase } from '(@/utils/supabase/client)';
import NewReview from './NewReview';

export type reviewData = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_url: string | null;
};

const ReviewList = () => {
  const [reviewData, setReviewData] = useState<reviewData[]>([]);

  useEffect(() => {
    getRecentReview();
  }, []);

  async function getRecentReview() {
    let { data } = await clientSupabase.from('review').select('*');
    if (data) {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReviewData(data);
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <div>dropdown</div>
        <div>
          <NewReview />
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-2 gap-y-4">
        {reviewData.map((item, index) => (
          <ReviewCard key={index} review={item} />
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
