'use client';

import { useEffect, useState } from 'react';
import { clientSupabase } from '(@/utils/supabase/client)';
import Image from 'next/image';
import ReviewEditModal from './ReviewEditModal';
import { useRouter } from 'next/navigation';
import ReviewHeart from './ReviewHeart';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import ImageGallery from './ImageGallery';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import defaultImg from '../../../public/defaultImg.jpg';
import { userStore } from '(@/store/userStore)';

export type ReviewDetailType = {
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  user_id: string | null;
  image_urls: string[] | null;
};

type Props = {
  review_id: string;
  commentCount: number;
};

const ReviewDetail = ({ review_id, commentCount }: Props) => {
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailType | null>(null);
  // const [userId, setUserId] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const router = useRouter();

  // const getUserId = async () => {
  //   const { data: user } = await clientSupabase.auth.getUser();
  //   setUserId(user?.user?.id || '');
  // };

  const { user, setUser } = userStore((state) => state);
  const userId = user && user[0].user_id;

  useEffect(() => {
    if (review_id) {
      getReviewDetail(review_id);
      // getUserId();
    }
  }, []);

  async function getReviewDetail(review_id: string) {
    let { data: reviewDetail, error } = await clientSupabase
      .from('review')
      .select('review_title, review_contents, created_at, user_id, image_urls')
      .eq('review_id', review_id)
      .single();

    // if (error) {
    //   console.error('리뷰를 불러오지 못함', error);
    // } else {
    //   if (reviewDetail) {
    //     const { user_id } = reviewDetail;
    //     const { data: userData, error: userError } = await clientSupabase
    //       .from('users')
    //       .select('nickname, avatar')
    //       .eq('user_id', user_id as string)
    //       .single();

    //     if (userError) {
    //       console.error('유저 정보를 불러오지 못함', userError);
    //     } else {
    //       setUserAvatar(userData?.avatar || null);
    //       setUserNickname(userData?.nickname || null);
    //     }
    //   }
    // }

    setReviewDetail(reviewDetail || null);
  }

  const handleDeleteReview = async () => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      const { error: reviewDeleteError } = await clientSupabase.from('review').delete().eq('review_id', review_id);
      const { error: commentDeleteError } = await clientSupabase
        .from('review_comment')
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
          {user && user[0].avatar ? (
            <Image
              className="mr-[15px] rounded-full"
              src={user && user[0].avatar}
              alt="유저 아바타"
              height={50}
              width={50}
            />
          ) : (
            <AvatarDefault />
          )}
          <div>{user && user[0].nickname}</div>
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
        <div className="flex gap-1">
          <ReviewHeart review_id={review_id} />
          <div className="flex gap-1">
            <div className="pt-[2px]" style={{ fontSize: '1.1rem' }}>
              <HiOutlineChatBubbleOvalLeftEllipsis />
            </div>
            <div className="pb-1">{commentCount}</div>
          </div>
        </div>
        <div>
          {reviewDetail?.image_urls && reviewDetail.image_urls.length > 0 ? (
            <ImageGallery images={reviewDetail?.image_urls || []} />
          ) : (
            <Image
              src={defaultImg}
              alt="reviewImage"
              height={300}
              width={300}
              className="w-[300px] h-full object-cover rounded-[10px]"
            />
          )}
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
