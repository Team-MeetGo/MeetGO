import { fetchCommentAuthor, fetchCommentData } from '@/query/review/commentQueryFns';
import { COMMENT_AUTHOR_QUERY_KEY, COMMENT_QUERY_KEY } from '@/query/review/commentQueryKeys';
import { useQuery } from '@tanstack/react-query';

export const useCommentAuthorDataQuery = (commentAuthorId: string) => {
  const { data: commentAuthorData } = useQuery({
    queryKey: [COMMENT_AUTHOR_QUERY_KEY, commentAuthorId],
    queryFn: async () => await fetchCommentAuthor(commentAuthorId)
  });
  return commentAuthorData;
};

export const useFetchCommentData = (review_id: string) => {
  const { data: commentData, isLoading: isCommentDataLoading } = useQuery({
    queryKey: [COMMENT_QUERY_KEY, review_id],
    queryFn: async () => await fetchCommentData(review_id)
  });
  return { commentData, isCommentDataLoading };
};
