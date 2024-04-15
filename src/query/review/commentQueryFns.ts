import { clientSupabase } from '@/utils/supabase/client';

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
