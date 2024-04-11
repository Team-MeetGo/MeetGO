import { reviewData } from '(@/components/review/ReviewList)';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import ReviewCard from '../review/ReviewCard';

const GetMostLikedReivew = () => {
  const [reviewData, setReviewData] = useState<reviewData[]>([]);
  const { isLoggedIn, setIsLoggedIn } = userStore((state) => state);

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
  }, []);

  return (
    <div>
      <ul className="max-w-[1160px] grid grid-cols-3 gap-2 gap-y-4">
        {reviewData.map((item, index) => (
          <ReviewCard key={index} review={item} />
        ))}
      </ul>
    </div>
  );
};

export default GetMostLikedReivew;
