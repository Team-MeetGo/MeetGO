import { COMMENT_QUERY_KEY } from '@/query/review/commentQueryKeys';
import { clientSupabase } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useNewCommentMutation = (review_id: string) => {
  const queryClient = useQueryClient();

  const newCommentMutation = useMutation({
    mutationFn: async ({
      review_id,
      comment_content,
      userId
    }: {
      review_id: string;
      comment_content: string;
      userId: string;
    }) => {
      const { data: newComment, error } = await clientSupabase
        .from('review_comment')
        .insert([{ comment_content: comment_content, user_id: userId, review_id: review_id }]);

      if (error) {
        console.error('insert error', error);
        return null;
      }
      return newComment;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENT_QUERY_KEY, review_id] });
    }
  });

  return newCommentMutation;
};

export const useDeleteCommentMutation = (review_id: string) => {
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return await clientSupabase.from('review_comment').delete().eq('comment_id', commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COMMENT_QUERY_KEY, review_id]
      });
    }
  });

  return deleteCommentMutation;
};
