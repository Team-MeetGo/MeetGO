import { clientSupabase } from '(@/utils/supabase/client)';
import { useEffect, useState } from 'react';

type CommentListType = {
  user_id: string | null;
  comment_id: string | null;
  comment_content: string | null;
  created_at: string | null;
  review_id: string | null;
};

type Props = {
  review_id: string;
};

const CommentList = ({ review_id }: Props) => {
  const [commentData, setCommentData] = useState<CommentListType[]>([]);
  useEffect(() => {
    getCommentList(review_id);
  });
  async function getCommentList(review_id: string) {
    let { data: test_review_comment, error } = await clientSupabase
      .from('test_review_comment')
      .select('user_id, comment_content, created_at, comment_id, review_id')
      .eq('review_id', review_id);
    if (error) {
      console.log('댓글 표시 중 에러 발생', error);
    }
    setCommentData(test_review_comment || []);
  }
  return (
    <div>
      {commentData.map((comment, index) => (
        <div key={index}>
          <p>{comment.user_id}</p>
          <p>{comment.comment_content}</p>
          <p>{comment.created_at}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
