'use client';

import ReviewCard from '(@/components/review/ReviewCard)';
import { reviewData } from '(@/components/review/ReviewList)';
import { userStore } from '(@/store/userStore)';
import { signOut } from '(@/utils/api/authAPI)';
import { clientSupabase } from '(@/utils/supabase/client)';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [reviewData, setReviewData] = useState<reviewData[]>([]);
  const { user, setUser } = userStore((state) => state);
  // const userId = user && user[0].user_id;
  // console.log(userId);

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

    const sliceReviews = [...(likedReviews || []), ...(zeroLikedReviews || [])].slice(0, 6);

    setReviewData(sliceReviews);
  }

  useEffect(() => {
    getMostLikedReview();
    // console.log(getMostLikedReview);
  }, []);

  return (
    <main>
      <div className="">배너</div>
      <div>
        <button onClick={signOut}>임시 로그아웃 버튼입니다</button>
      </div>
      <div>
        <div>
          <Link href="/review">더보기</Link>
        </div>
        <ul className="grid grid-cols-3 gap-2 gap-y-4">
          {reviewData.map((item, index) => (
            <ReviewCard key={index} review={item} />
          ))}
        </ul>
      </div>
      <button onClick={() => location.replace('/test')}>test</button>
    </main>
  );
}
