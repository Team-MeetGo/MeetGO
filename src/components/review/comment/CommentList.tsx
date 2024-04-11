import { useEffect, useState } from 'react';
import CommentCard from './CommentCard';
import { useCommentStore } from '(@/store/commentStore)';
import { useQuery } from '@tanstack/react-query';
import { COMMENT_QUERY_KEY } from '(@/query/review/commentQueryKeys)';
import { fetchCommentData, useDeleteCommentMutation } from '(@/query/review/commentQueryFns)';
import NewComment from './NewComment';
import { userStore } from '(@/store/userStore)';

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
  // TODO: useQuery로 변경
  const commentsFromStore = useCommentStore((state) => state.comments);
  const [updatedComment, setUpdatedComment] = useState<CommentListType[]>([]);

  const { user } = userStore((state) => state);
  const userId = user && user.user_id;

  const useCommentDataQuery = (review_id: string) => {
    const { data: commentData } = useQuery({
      queryKey: [COMMENT_QUERY_KEY, review_id],
      queryFn: async () => await fetchCommentData(review_id)
    });
    return commentData;
  };

  const commentData = useCommentDataQuery(review_id as string);

  useEffect(() => {
    const mergedComments = [
      ...(commentData ?? []),
      ...commentsFromStore
        .filter((comment) => comment.review_id === review_id)
        .filter((comment) => {
          const isExist = commentData?.some((dataComment) => dataComment.comment_id === comment.comment_id);
          return !isExist && comment.review_id === review_id;
        })
    ];
    setUpdatedComment(mergedComments);
    onUpdateCommentCount(mergedComments.length);
  }, [commentData, onUpdateCommentCount, commentsFromStore, review_id]);

  const deleteCommentMutation = useDeleteCommentMutation();

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await deleteCommentMutation.mutate(commentId);
        // const updatedList = updatedComment.filter((c) => c.comment_id !== commentId);
        // setUpdatedComment(updatedList);
        window.location.reload();
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
      }
    }
  };

  return (
    <div>
      <div>
        <NewComment review_id={review_id} />
      </div>
      <div>댓글 {updatedComment.length}개</div>
      {updatedComment.map((comment, index) => (
        <div key={index} className="flex">
          <CommentCard comment={comment} />
          <div>
            {userId === comment.user_id && (
              <button onClick={() => handleDeleteComment(comment.comment_id as string)}>삭제</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
