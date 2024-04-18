'use client';

import CommentCard from './CommentCard';
import NewComment from './NewComment';
import { useFetchCommentData } from '@/hooks/useQueries/useCommentQuery';

type Props = {
  review_id: string;
};

export type CommentListType = {
  user_id: string | null;
  comment_id: string | null;
  comment_content: string | null;
  created_at: string | null;
  review_id: string | null;
};

const CommentList = ({ review_id }: Props) => {
  const { commentData, isCommentDataLoading } = useFetchCommentData(review_id);

  const sortedData = commentData?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (isCommentDataLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="flex flex-col mb-[32px]">
      <div className="text-[18px] mb-[32px]">댓글 {commentData?.length}개</div>
      <div>
        <NewComment review_id={review_id} />
      </div>
<<<<<<< HEAD
      {sortedData?.map((comment) => (
        <div key={comment.comment_id} className="flex w-full max-w-[1116px] h-[180px] mt-[32px]">
=======
      {sortedData?.map((comment, index) => (
        <div key={index} className="flex w-full max-w-[1000px] h-[180px] mt-[32px]">
>>>>>>> 27cdc65b71ee280eeea7a01b91c7cf9845d4f6f1
          <CommentCard comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
