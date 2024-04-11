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
  const commentsFromStore = useCommentStore((state) => state.comments);
  const [updatedComment, setUpdatedComment] = useState<CommentListType[]>([]);
  const deleteComment = useCommentStore((state) => state.deleteComment);

  const { user } = userStore((state) => state);
  const userId = user && user.user_id;

  const { data: commentData, isLoading: isCommentDataLoading } = useQuery({
    queryKey: [COMMENT_QUERY_KEY, review_id],
    queryFn: async () => await fetchCommentData(review_id)
  });

  const deleteCommentMutation = useDeleteCommentMutation(review_id);

  // const handleDeleteComment = async (commentId: string) => {
  //   if (window.confirm('댓글을 삭제하시겠습니까?')) {
  //     await deleteCommentMutation.mutate(commentId, {
  //       onSuccess: () => {
  //         setUpdatedComment((currentComments) => currentComments.filter((comment) => comment.comment_id !== commentId));
  //         deleteComment(commentId as string);
  //       }
  //     });
  //   }
  // };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      await deleteCommentMutation.mutate(commentId);
      await deleteComment(commentId as string);
      // await setUpdatedComment((currentComments) =>
      //   currentComments.filter((comment) => comment.comment_id !== commentId)
      // );
    }
  };

  useEffect(() => {
    if (!isCommentDataLoading) {
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
    }
  }, [commentData, onUpdateCommentCount, commentsFromStore, isCommentDataLoading]);

  if (isCommentDataLoading) {
    return <div>Loading comments...</div>;
  }

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
