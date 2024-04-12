import { fetchLikeCount, fetchLikestatus } from '(@/query/review/likeQueryFns)';
import { LIKED_COUNT_QUERY_KEY, LIKED_QUERY_KEY } from '(@/query/review/likeQueryKeys)';
import { useQuery } from '@tanstack/react-query';

export const useLikedReviewDataQuery = (review_id: string) => {
  const { data: likedUsers } = useQuery({
    queryKey: [LIKED_QUERY_KEY, review_id],
    queryFn: async () => await fetchLikestatus(review_id)
  });
  return likedUsers;
};

export const useLikedReviewCountQuery = (review_id: string) => {
  const { data: likeCountData, error } = useQuery({
    queryKey: [LIKED_COUNT_QUERY_KEY, review_id],
    queryFn: async () => await fetchLikeCount(review_id)
  });
  if (error) {
    console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
    return 0;
  }
  return likeCountData;
};
