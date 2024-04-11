import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { useNewCommentMutation } from '(@/query/review/commentQueryFns)';
import { Button } from '@nextui-org/react';
import React, { FormEvent, useState } from 'react';

type Props = {
  review_id: string;
};

const NewComment = ({ review_id }: Props) => {
  const [comments, setComments] = useState('');

  const { data: user } = useGetUserDataQuery();
  const userId = user && user.user_id;

  const addCommentMutation = useNewCommentMutation(review_id);

  const handleNewComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    const comment_content = (document.getElementById('comment_content') as HTMLInputElement)?.value;

    addCommentMutation.mutate({ review_id, userId, comment_content });

    alert('댓글이 등록되었습니다.');
    setComments('');
  };
  return (
    <div>
      <form onSubmit={handleNewComment}>
        <div className="flex">
          <textarea
            id="comment_content"
            required
            placeholder="댓글을 입력해주세요."
            maxLength={200}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="outline-none border-2 rounded-[20px] resize-none p-[8px] pl-4 mb-2"
          />
          <Button type="submit" className="bg-[#8F5DF4] text-white">
            등록
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewComment;
