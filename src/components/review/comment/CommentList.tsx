import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';
import CommentCard from './CommentCard';

export type CommentListType = {
  user_id: string | null;
  comment_id: string | null;
  comment_content: string | null;
  created_at: string | null;
  review_id: string | null;
};

type Props = {
  review_id: string;
  onUpdateCommentCount: (count: number) => void;
};

const CommentList = ({ review_id, onUpdateCommentCount }: Props) => {
  const [commentData, setCommentData] = useState<CommentListType[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  const fetchCommentCount = async (review_id: string) => {
    let { data: review_comment, error } = await clientSupabase
      .from('review_comment')
      .select('*')
      .eq('review_id', review_id);

    if (error) {
      throw error;
    }

    if (review_comment) {
      setCommentCount(review_comment.length);
      onUpdateCommentCount(review_comment.length);
    } else {
      setCommentCount(0);
      onUpdateCommentCount(0);
    }
  };

  useEffect(() => {
    getCommentList(review_id);
    fetchCommentCount(review_id);
  });

  async function getCommentList(review_id: string) {
    let { data: review_comment, error } = await clientSupabase
      .from('review_comment')
      .select('user_id, comment_content, created_at, comment_id, review_id')
      .eq('review_id', review_id);
    if (error) {
      console.log('댓글 표시 중 에러 발생', error);
    }
    setCommentData(review_comment || []);
  }
  return (
    <div>
      <div>댓글 {commentCount}개</div>
      {commentData.map((comment, index) => (
        <div key={index}>
          <CommentCard comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
