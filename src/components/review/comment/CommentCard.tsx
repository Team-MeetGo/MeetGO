import { useState } from 'react';
import { CommentListType } from './CommentList';

type Props = {
  comment: CommentListType;
};

const CommentCard = ({ comment }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const handleEditComment = () => {};
  const handleDeleteComment = async () => {};
  const handleCancelEdit = () => {};
  return (
    <div>
      <p>댓글 아이디 : {comment.comment_id}</p>
      <p>유저 아이디 : {comment.user_id}</p>
      <p>댓글 내용 : {comment.comment_content}</p>
      <p>{comment.created_at}</p>
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
