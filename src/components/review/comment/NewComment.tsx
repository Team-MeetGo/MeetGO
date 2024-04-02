import { clientSupabase } from '(@/utils/supabase/client)';
import React, { FormEvent, useState } from 'react';

type Props = {
  review_id: string;
};

const NewComment = ({ review_id }: Props) => {
  const [comments, setComments] = useState('');
  const handleNewComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = '8fe87c99-842a-4fde-a0e8-918a0171e9a6';
    const comment_content = (document.getElementById('comment_content') as HTMLInputElement)?.value;
    const { data, error } = await clientSupabase
      .from('test_review_comment')
      .insert([{ comment_content: comment_content, user_id: userId, review_id: review_id }]);

    if (error) {
      console.error('insert error', error);
      return;
    }
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
          <button>등록</button>
        </div>
      </form>
    </div>
  );
};

export default NewComment;
