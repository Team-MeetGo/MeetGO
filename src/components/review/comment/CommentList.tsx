import { useEffect, useState } from 'react';
import CommentCard from './CommentCard';
import { useCommentStore } from '(@/store/commentStore)';
import { clientSupabase } from '(@/utils/supabase/client)';

type Props = {
  review_id: string;
  onUpdateCommentCount: (count: number) => void;
};

export type CommentListType = {
  user_id: string | null;
  comment_id: string | null;
  comment_content: string | null;
  created_at: string | null;
  review_id: string | null;
};

const CommentList = ({ review_id, onUpdateCommentCount }: Props) => {
  const [supabaseCommentData, setSupabaseCommentData] = useState<CommentListType[]>([]);
  const [totalCommentCount, setTotalCommentCount] = useState(0);
  const commentsFromStore = useCommentStore((state) => state.comments);

  useEffect(() => {
    getCommentListFromSupabase(review_id);
  }, []);

  useEffect(() => {
    const combinedComments = [
      ...supabaseCommentData,
      ...commentsFromStore.filter((comment) => comment.review_id === review_id)
    ];
    setTotalCommentCount(combinedComments.length);
    onUpdateCommentCount(combinedComments.length);
  }, [commentsFromStore, supabaseCommentData]);

  async function getCommentListFromSupabase(review_id: string) {
    let { data: review_comment, error } = await clientSupabase
      .from('review_comment')
      .select('user_id, comment_content, created_at, comment_id, review_id')
      .eq('review_id', review_id);
    if (error) {
      console.log('댓글 표시 중 에러 발생', error);
    }
    setSupabaseCommentData(review_comment || []);
    setTotalCommentCount(review_comment?.length || 0);
  }

  const handleDeleteComment = (commentId: string) => {
    setSupabaseCommentData(supabaseCommentData.filter((comment) => comment.comment_id !== commentId));
  };

  return (
    <div>
      <div>댓글 {totalCommentCount}개</div>
      {[...supabaseCommentData, ...commentsFromStore.filter((comment) => comment.review_id === review_id)].map(
        (comment, index) => (
          <div key={index}>
            <CommentCard comment={comment} onDeleteComment={handleDeleteComment} />
          </div>
        )
      )}
    </div>
  );
};

export default CommentList;
