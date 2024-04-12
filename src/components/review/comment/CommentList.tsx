import CommentCard from './CommentCard';
import NewComment from './NewComment';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { useFetchCommentData } from '(@/hooks/useQueries/useCommentQuery)';
import { useDeleteCommentMutation } from '(@/hooks/useMutation/useCommentMutations)';

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
  const { data: user } = useGetUserDataQuery();
  const userId = user && user.user_id;

  const { commentData, isCommentDataLoading } = useFetchCommentData(review_id);

  const deleteCommentMutation = useDeleteCommentMutation(review_id);

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      await deleteCommentMutation.mutate(commentId);
    }
  };

  if (isCommentDataLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div>
      <div>
        <NewComment review_id={review_id} />
      </div>
      <div>댓글 {commentData?.length}개</div>
      {commentData?.map((comment, index) => (
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
