import Image from 'next/image';
import ReviewEditModal from './ReviewEditModal';
import { useRouter } from 'next/navigation';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import ImageGallery from './ImageGallery';
import defaultImg from '../../../public/defaultImg.jpg';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from '@nextui-org/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoIosList } from 'react-icons/io';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import ReviewComment from './ReviewComment';
import ReviewLike from './ReviewLike';
import { useDeleteReviewMutation } from '(@/hooks/useMutation/useReviewMutations)';
import { useAuthorDataQuery, useReviewDataQuery, useReviewListDataQuery } from '(@/hooks/useQueries/useReviewQuery)';
import { useAsyncNavigation } from '(@/hooks/custom/useReviewNavigation)';

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

  const userData = useAuthorDataQuery(review_id);

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
          <div className="text-[40px] mb-[24px]">{reviewDetailData?.review_title}</div>
          <div className="flex items-center">
            <Link href="/review/pageNumber/1">
              <IoIosList className="w-[31px] h-[36px] mb-[24px]" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col border-t-1 border-b-1 border-gray2 mb-[64px]">
          <div className="flex items-center mt-[24px] mb-[48px]">
            <div className="flex items-center mr-[15px]">
              {authorData?.avatar ? (
                <Image
                  className="w-[52px] h-[52px] rounded-full"
                  src={authorData?.avatar}
                  alt="유저 아바타"
                  height={50}
                  width={50}
                />
              ) : (
                <AvatarDefault />
              )}
            </div>
            <div className="w-full">
              <div className="text-[20px]">
                {reviewDetailData?.show_nickname ? userData?.nickname || '익명유저' : '익명유저'}
              </div>
              <div className="flex">
                <div className="flex w-full">
                  <div className="text-gray2 text-[16px] mr-[15px]">
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
                  <div className="flex gap-2">
                    <ReviewLike review_id={review_id} />
                    <div className="flex gap-1">
                      <ReviewComment review_id={review_id} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  {userId === reviewDetailData?.user_id && (
                    <div>
                      <Dropdown className="min-w-0 w-auto h-auto flex justyfy-center items-center">
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
                          className="w-[100px] h-[80px]"
                          color="secondary"
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
              </div>
            </div>
          </div>
          <div className="flex w-full h-[480px] justify-center items-center mb-[48px]">
            <div>
              {reviewDetailData?.image_urls && reviewDetailData?.image_urls.length > 0 ? (
                <div className="w-[630px] h-[480px] bg-gray2">
                  <ImageGallery images={reviewDetailData?.image_urls || []} />
                </div>
              ) : (
                <Image
                  src={defaultImg}
                  alt="reviewImage"
                  height={600}
                  width={600}
                  className="w-[630px] h-[480px] object-cover rounded-[10px]"
                />
              )}
            </div>
          </div>
          <div className="flex justify-center mb-[48px]">
            <p className="max-w-[746px] max-h-144px">{reviewDetailData?.review_contents}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
