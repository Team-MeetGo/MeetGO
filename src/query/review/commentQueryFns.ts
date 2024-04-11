import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { COMMENT_QUERY_KEY, DELETE_COMMENT_QUERY_KEY, NEW_COMMENT_QUERY_KEY } from './commentQueryKeys';
import { useCommentStore } from '(@/store/commentStore)';

export const fetchCommentAuthor = async (commentAuthorId: string) => {
  const { data: commentAuthorData, error: userError } = await clientSupabase
    .from('users')
    .select('nickname, avatar')
    .eq('user_id', commentAuthorId as string)
    .single();
  return commentAuthorData;
};

export const fetchCommentData = async (review_id: string) => {
  let { data: commentData, error } = await clientSupabase
    .from('review_comment')
    .select('user_id, comment_content, created_at, comment_id, review_id')
    .eq('review_id', review_id);
  if (error) {
    console.log('댓글 표시 중 에러 발생', error);
  }
  return commentData;
};

export const useNewCommentMutation = () => {
  const queryClient = useQueryClient();
  const addComment = useCommentStore((state) => state.addComment);
  const uuid = crypto.randomUUID();
  const currentDate = new Date().toISOString();

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
        .insert([{ comment_content: comment_content, user_id: userId, review_id: review_id, comment_id: uuid }]);

      addComment({
        comment_id: uuid,
        comment_content: comment_content,
        user_id: userId,
        review_id: review_id,
        created_at: currentDate
      });

      if (error) {
        console.error('insert error', error);
        return null;
      }
      return newComment;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEW_COMMENT_QUERY_KEY });
    }
  });

  return newCommentMutation;
};

// export const useDeleteCommentMutation = () => {
//   const queryClient = useQueryClient();
//   const deleteComment = useCommentStore((state) => state.deleteComment);
//   const deleteCommentMutation = useMutation({
//     mutationFn: async (commentId: string) => {
//       const { error } = await clientSupabase.from('review_comment').delete().eq('comment_id', commentId);
//       deleteComment(commentId as string);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY });
//     }
//   });
//   return deleteCommentMutation;
// };

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return clientSupabase.from('review_comment').delete().eq('comment_id', commentId);
    },
    // onSuccess 내에서 코멘트 상태를 업데이트
    onSuccess: (_, commentId) => {
      queryClient.setQueryData([COMMENT_QUERY_KEY], (oldData) => {
        return {
          ...oldData,
          data: oldData.data.filter((comment) => comment.comment_id !== commentId)
        };
      });
    }
  });
  return deleteCommentMutation;
};
