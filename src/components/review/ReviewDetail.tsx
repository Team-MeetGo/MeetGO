import Image from 'next/image';
import ReviewEditModal from './ReviewEditModal';
import { useRouter } from 'next/navigation';
import ReviewHeart from './ReviewHeart';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import ImageGallery from './ImageGallery';
import defaultImg from '../../../public/defaultImg.jpg';
import { AUTHOR_QUERY_KEY, REVIEW_QUERY_KEY } from '(@/query/review/reviewQueryKeys)';
import { useQuery } from '@tanstack/react-query';
import { fetchAuthorData, fetchReviewData, useDeleteReviewMutation } from '(@/query/review/reviewQueryFns)';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from '@nextui-org/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoIosList } from 'react-icons/io';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import ReviewComment from './ReviewComment';

export type ReviewDetailType = {
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  user_id: string | null;
  image_urls: string[] | null;
  show_nickname: boolean | null;
};

export type AuthorDataType = {
  avatar: string | null;
  nickname: string | null;
};

type Props = {
  review_id: string;
};

const ReviewDetail = ({ review_id }: Props) => {
  const editModal = useDisclosure();
  const [reviewDetailData, setReviewDetailData] = useState<ReviewDetailType | null>(null);
  const [authorData, setAuthorData] = useState<AuthorDataType | null>(null);
  const router = useRouter();

  const { data: user } = useGetUserDataQuery();
  const userId = user && user.user_id;

  const useAuthorDataQuery = (review_id: string) => {
    const { data: userData } = useQuery({
      queryKey: [AUTHOR_QUERY_KEY, review_id],
      queryFn: async () => await fetchAuthorData(review_id)
    });
    return userData;
  };

  const userData = useAuthorDataQuery(review_id);

  const useReviewDataQuery = (review_id: string) => {
    const { data: reviewDetail } = useQuery({
      queryKey: [REVIEW_QUERY_KEY, review_id],
      queryFn: async () => await fetchReviewData(review_id)
    });
    return reviewDetail;
  };

  const reviewDetail = useReviewDataQuery(review_id);

  useEffect(() => {
    if (reviewDetail) {
      setReviewDetailData(reviewDetail);
    }
    if (userData) {
      setAuthorData(userData);
    }
  }, [review_id, reviewDetail, userData]);

  const deleteReviewMutation = useDeleteReviewMutation();

  const handleDeleteReview = async () => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await deleteReviewMutation.mutate(review_id as string);
      } catch (error) {
        console.error('리뷰 삭제 오류:', error);
      }
      router.push(`/review/pageNumber/1`);
    }
    return;
  };

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div>{reviewDetailData?.review_title}</div>
          <Link href="/review/pageNumber/1">
            <IoIosList />
          </Link>
        </div>
        <div className="flex items-center">
          {authorData?.avatar ? (
            <Image
              className="mr-[15px] rounded-full"
              src={authorData?.avatar}
              alt="유저 아바타"
              height={50}
              width={50}
            />
          ) : (
            <AvatarDefault />
          )}
          <div>{reviewDetailData?.show_nickname ? userData?.nickname || '익명유저' : '익명유저'}</div>
        </div>
        <div className="flex">
          <div className="text-[#A1A1AA]">
            {reviewDetailData?.created_at
              ? new Intl.DateTimeFormat('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                }).format(new Date(reviewDetailData?.created_at))
              : null}
          </div>
          <div className="flex gap-1">
            <ReviewHeart review_id={review_id} />
            <div className="flex gap-1">
              <ReviewComment review_id={review_id} />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          {userId === reviewDetailData?.user_id && (
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <button>
                    <HiOutlineDotsVertical />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Action event example"
                  onAction={(key) => {
                    if (key === 'delete') {
                      handleDeleteReview();
                    } else if (key === 'edit') {
                      editModal.onOpen();
                    }
                  }}
                >
                  <DropdownItem key="edit">수정</DropdownItem>
                  <DropdownItem key="delete" className="text-danger" color="danger">
                    <button>삭제</button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <ReviewEditModal disclosure={editModal} review_id={review_id} />
            </div>
          )}
        </div>
        <div>
          {reviewDetailData?.image_urls && reviewDetailData?.image_urls.length > 0 ? (
            <ImageGallery images={reviewDetailData?.image_urls || []} />
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
        <div>{reviewDetailData?.review_contents}</div>
      </div>
    </div>
  );
};

export default ReviewDetail;
