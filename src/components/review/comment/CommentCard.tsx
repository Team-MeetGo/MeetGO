import { useState } from 'react';
import { CommentListType } from './CommentList';
import { clientSupabase } from '(@/utils/supabase/client)';

type Props = {
  comment: CommentListType;
};

const CommentCard = ({ comment }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment_content);
  const handleEditComment = async () => {
    if (comment.comment_content === editedComment) {
      alert('수정 된 내용이 없습니다.');
      return;
    }
    const { data, error } = await clientSupabase
      .from('test_review_comment')
      .update({ comment_content: editedComment })
      .eq('comment_id', comment.comment_id as string)
      .select();
    if (error) {
      console.log(error.message);
    }
    setIsEditMode(false);
  };
  const handleDeleteComment = async () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const { error } = await clientSupabase
        .from('test_review_comment')
        .delete()
        .eq('comment_id', comment.comment_id as string);
    }
    return;
  };
  const handleCancelEdit = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      setEditedComment(comment.comment_content);
      setIsEditMode(false);
    }
  };
  return (
    <div>
      <p>댓글 아이디 : {comment.comment_id}</p>
      <p>유저 아이디 : {comment.user_id}</p>
      <p>{comment.created_at}</p>
      <div>
        {!isEditMode ? (
          <p>댓글 내용 : {comment.comment_content}</p>
        ) : (
          <textarea
            id="editedComment"
            required
            value={editedComment || ''}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        )}
      </div>
      {!isEditMode ? (
        <button onClick={() => setIsEditMode(true)}>수정</button>
      ) : (
        <button onClick={handleEditComment}>수정완료</button>
      )}
      {!isEditMode ? (
        <button onClick={handleDeleteComment}>삭제</button>
      ) : (
        <button onClick={handleCancelEdit}>취소</button>
      )}
    </div>
  );
};

export default CommentCard;
