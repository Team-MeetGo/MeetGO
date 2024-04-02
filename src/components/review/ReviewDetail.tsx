'use client';

import { useEffect, useState } from 'react';
import { clientSupabase } from '(@/utils/supabase/client)';
import Image from 'next/image';
import ReviewEditModal from './ReviewEditModal';
import { useRouter } from 'next/navigation';

export type ReviewDetailType = {
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_url: string | null;
  user_id: string | null;
};

type Props = {
  review_id: string;
};

const ReviewDetail = ({ review_id }: Props) => {
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailType | null>(null);
  const router = useRouter();

  useEffect(() => {
    getReviewDetail(review_id);
  });

  async function getReviewDetail(review_id: string) {
    let { data: reviewDetail, error } = await clientSupabase
      .from('review')
      .select('review_title, review_contents, created_at, image_url, user_id')
      .eq('review_id', review_id);

    if (error) {
      console.error('리뷰 가져오는 중 에러 발생', error);
    }

    if (reviewDetail && reviewDetail.length > 0) {
      setReviewDetail(reviewDetail[0]);
    }
  }

  const handleDeleteReview = async () => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      const { error: reviewDeleteError } = await clientSupabase.from('review').delete().eq('review_id', review_id);
      const { error: commentDeleteError } = await clientSupabase
        .from('test_review_comment')
        .delete()
        .eq('review_id', review_id);
      if (reviewDeleteError) {
        console.log('리뷰 삭제 오류:', reviewDeleteError.message);
      } else if (commentDeleteError) {
        console.log('댓글 삭제 오류:', commentDeleteError.message);
      } else {
        router.push('/review');
      }
    }
  };

  return (
    <div>
      <div>
        <div>{`리뷰 아이디 : ${review_id}`}</div>
        <div>{reviewDetail?.review_title}</div>
        <div>{reviewDetail?.user_id}</div>
        <div>{reviewDetail?.created_at}</div>
        <div>
          {reviewDetail?.image_url ? (
            <Image src={reviewDetail?.image_url} alt="reviewImage" height={300} width={300} />
          ) : null}
        </div>
        <div>{reviewDetail?.review_contents}</div>
      </div>
      <div>
        <ReviewEditModal review_id={review_id} />
        <button onClick={handleDeleteReview}>삭제</button>
      </div>
    </div>
  );
};

export default ReviewDetail;
