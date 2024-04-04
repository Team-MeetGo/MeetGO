'use client';

import { useEffect, useState } from 'react';
import { clientSupabase } from '(@/utils/supabase/client)';
import Image from 'next/image';
import ReviewEditModal from './ReviewEditModal';
import { useRouter } from 'next/navigation';
import ReviewHeart from './ReviewHeart';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import ImageGallery from './ImageGallery';

export type ReviewDetailType = {
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_url: string | null;
  user_id: string | null;
  test_image_url: string[] | null;
};

type Props = {
  review_id: string;
  commentCount: number;
};

const ReviewDetail = ({ review_id, commentCount }: Props) => {
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailType | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const router = useRouter();

  const getUserId = async () => {
    const { data: user } = await clientSupabase.auth.getUser();
    setUserId(user?.user?.id || '');
  };

  useEffect(() => {
    if (review_id) {
      getReviewDetail(review_id);
      getUserId();
    }
  });

  async function getReviewDetail(review_id: string) {
    let { data: reviewDetail, error } = await clientSupabase
      .from('review')
      .select('review_title, review_contents, created_at, image_url, user_id, test_image_url')
      .eq('review_id', review_id)
      .single();

    if (error) {
      console.error('리뷰를 불러오지 못함', error);
    } else {
      if (reviewDetail) {
        const { user_id } = reviewDetail;
        const { data: userData, error: userError } = await clientSupabase
          .from('users')
          .select('nickname, avatar')
          .eq('user_id', user_id as string)
          .single();

        if (userError) {
          console.error('유저 정보를 불러오지 못함', userError);
        } else {
          setUserAvatar(userData?.avatar || null);
          setUserNickname(userData?.nickname || null);
        }
      }
    }

    setReviewDetail(reviewDetail || null);
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
        <div>{reviewDetail?.review_title}</div>
        <div className="flex items-center">
          {userAvatar ? (
            <Image className="mr-[15px] rounded-full" src={userAvatar} alt="유저 아바타" height={50} width={50} />
          ) : (
            <AvatarDefault />
          )}
          <div>{userNickname}</div>
        </div>
        <div className="text-[#A1A1AA]">
          {reviewDetail && reviewDetail.created_at
            ? new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              }).format(new Date(reviewDetail.created_at))
            : null}
        </div>
        <div className="flex">
          <ReviewHeart review_id={review_id} />
          <p>댓글 {commentCount}</p>
        </div>
        <div>
          <ImageGallery images={reviewDetail?.test_image_url || []} />
        </div>
        <div>{reviewDetail?.review_contents}</div>
      </div>
      <div>
        {userId === reviewDetail?.user_id && (
          <div>
            <ReviewEditModal review_id={review_id} />
            <button onClick={handleDeleteReview}>삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
