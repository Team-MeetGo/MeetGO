import { reviewData } from '(@/components/review/ReviewList)';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import ReviewCard from '../review/ReviewCard';
import { useQuery } from '@tanstack/react-query';
import { LIKED_REVIEWLIST_QUERY_KEY, REVIEWLIST_QUERY_KEY } from '(@/query/review/reviewQueryKeys)';
import { fetchLikedReviewList, fetchReviewList } from '(@/query/review/reviewQueryFns)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

const GetMostLikedReivew = () => {
  // const [reviewData, setReviewData] = useState<reviewData[]>([]);
  // const { isLoggedIn, setIsLoggedIn } = userStore((state) => state);

  const { data: userData, isError, isLoggedIn } = useGetUserDataQuery();

  //   // const getUserId = async () => {
  //   const userData = userStore.getState().user;
  //   return userData && userData.user_id;
  // };

  //   // const checkLoginStatus = async () => {
  //   const userId = await getUserId();
  //   if (userId !== null) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // };

  //   // useEffect(() => {
  //   checkLoginStatus();
  // }, []);

  // useEffect(() => {
  //   getMostLikedReview();
  // }, [likedReviewList, fetchReviewsData]);

  const { data: likedReviewList } = useQuery({
    queryKey: [LIKED_REVIEWLIST_QUERY_KEY],
    queryFn: fetchLikedReviewList
  });

  const { data: fetchReviewsData } = useQuery({
    queryKey: [REVIEWLIST_QUERY_KEY],
    queryFn: fetchReviewList
  });

  //   async function getMostLikedReview() {
  const likedReviewIds = likedReviewList?.map((item) => item.review_id);
  const zeroLikedReviews = fetchReviewsData?.data?.filter((review) => !likedReviewIds?.includes(review.review_id));

  const likedReviews = fetchReviewsData?.data?.filter((review) => likedReviewIds?.includes(review.review_id));

  likedReviews?.sort((a, b) => {
    const aLikes = likedReviewIds?.filter((id) => id === a.review_id).length || 0;
    const bLikes = likedReviewIds?.filter((id) => id === b.review_id).length || 0;
    return bLikes - aLikes;
  });

  const sliceReviews = [...(likedReviews || []), ...(zeroLikedReviews || [])].slice(0, 6);

  //   //   setReviewData(sliceReviews);
  // }

  return (
    <div>
      <ul className="max-w-[1160px] grid grid-cols-3 gap-2 gap-y-4">
        {sliceReviews.map((item, index) => (
          <ReviewCard key={index} review={item} />
        ))}
      </ul>
    </div>
  );
};

export default GetMostLikedReivew;
