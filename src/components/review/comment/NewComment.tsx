'use client';
import { useNewCommentMutation } from '@/hooks/useMutation/useCommentMutations';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { Button } from '@nextui-org/react';
import React, { FormEvent, useState } from 'react';

type Props = {
  review_id: string;
};

const NewComment = ({ review_id }: Props) => {
  const [comments, setComments] = useState('');
  const [isActive, setIsActive] = useState(false);

  const { data: user } = useGetUserDataQuery();
  const userId = user && user.user_id;

  const addCommentMutation = useNewCommentMutation(review_id);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
    setIsActive(e.target.value !== '');
  };

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
    <div className="max-w-[1000px] w-full h-[136px] mb-[24px]">
      <form onSubmit={handleNewComment} className="flex flex-col max-w-[1000px] w-full">
        <div className="flex max-w-[1000px] w-full h-[136px]">
          <textarea
            id="comment_content"
            required
            placeholder="댓글을 입력해주세요."
            maxLength={200}
            value={comments}
            onChange={handleInputChange}
            className={`max-w-[1000px] w-full h-[136px] outline-none border-1 rounded-[10px] resize-none p-[24px] pl-4 mb-2 ${
              isActive ? 'border-mainColor' : 'border-gray-300'
            }`}
          />
        </div>
        <div className="flex w-full justify-end mt-[16px]">
          <Button type="submit" className="bg-mainColor text-white flex">
            등록
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewComment;
